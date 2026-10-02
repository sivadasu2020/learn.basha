<#
.SYNOPSIS
    Deploys Learn Bhasha to IIS and opens it to the local network (phone access).

.DESCRIPTION
    Creates a dedicated app pool and site, copies the static files, adds an HTTPS
    binding with a self-signed certificate and opens the Windows Firewall.

    HTTPS is not optional for phone use: browsers only grant microphone access on
    https:// or localhost, so an http-only deployment can be read but not spoken to.

.EXAMPLE
    PS> .\Deploy-IIS.ps1
    PS> .\Deploy-IIS.ps1 -HttpPort 8080 -HttpsPort 8443
#>
[CmdletBinding()]
param(
    [string]$SiteName = 'LearnBhasha',
    [string]$SitePath = 'C:\inetpub\wwwroot\LearnBhasha',
    [int]$HttpPort = 8080,
    [int]$HttpsPort = 8443,
    [string]$LanIp,
    [switch]$SkipFirewall,
    [switch]$KeepPublicNetwork
)

$ErrorActionPreference = 'Stop'

function Write-Step { param($Text) Write-Host "`n==> $Text" -ForegroundColor Cyan }
function Write-Ok { param($Text) Write-Host "    $Text" -ForegroundColor Green }
function Write-Warn { param($Text) Write-Host "    $Text" -ForegroundColor Yellow }

# ---------------------------------------------------------------- pre-flight
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
if (-not (New-Object Security.Principal.WindowsPrincipal $identity).IsInRole(
        [Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Run this script from an elevated PowerShell (right-click > Run as Administrator)."
}

$SourcePath = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $SourcePath 'index.html'))) {
    throw "index.html not found in '$SourcePath'. Keep this script inside the project's deploy folder."
}

Write-Step "Checking IIS features"
Import-Module WebAdministration -ErrorAction Stop
foreach ($feature in 'IIS-StaticContent', 'IIS-DefaultDocument', 'IIS-HttpCompressionStatic') {
    $state = (Get-WindowsOptionalFeature -Online -FeatureName $feature).State
    if ($state -ne 'Enabled') {
        Write-Warn "Enabling $feature ..."
        Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart | Out-Null
    }
}
Write-Ok "Static content and default document are enabled."

if (-not $LanIp) {
    $LanIp = (Get-NetIPConfiguration |
        Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
        Select-Object -First 1 -ExpandProperty IPv4Address).IPAddress
}
if (-not $LanIp) { throw "Could not detect a LAN IP address. Pass one with -LanIp." }
Write-Ok "LAN address: $LanIp"

# Windows blocks all inbound traffic on a "Public" network, so a phone on the same
# Wi-Fi cannot reach the site until the profile is Private.
Write-Step "Checking the network profile"
$lanAlias = (Get-NetIPAddress -IPAddress $LanIp -AddressFamily IPv4).InterfaceAlias
$profileInfo = Get-NetConnectionProfile -InterfaceAlias $lanAlias -ErrorAction SilentlyContinue
if ($profileInfo -and $profileInfo.NetworkCategory -eq 'Public') {
    if ($KeepPublicNetwork) {
        Write-Warn "'$lanAlias' is a Public network - inbound connections stay blocked. Phone access will fail."
    } else {
        Set-NetConnectionProfile -InterfaceAlias $lanAlias -NetworkCategory Private
        Write-Ok "Changed '$lanAlias' from Public to Private so LAN devices can connect."
    }
} else {
    Write-Ok "'$lanAlias' is $($profileInfo.NetworkCategory)."
}

# ------------------------------------------------------------------ app files
Write-Step "Copying application files to $SitePath"
New-Item -ItemType Directory -Path $SitePath -Force | Out-Null
$robocopyArgs = @(
    $SourcePath, $SitePath, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP',
    '/XD', 'deploy', 'docs', '.git', '.vs', 'node_modules',
    '/XF', '*.ps1', '*.md', '.gitignore'
)
& robocopy.exe @robocopyArgs | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE." }
Write-Ok "Files copied."

Write-Step "Granting read access to IIS_IUSRS"
& icacls.exe $SitePath /grant "*S-1-5-32-568:(OI)(CI)(RX)" /T /C /Q | Out-Null
Write-Ok "Permissions set."

# -------------------------------------------------------------- pool and site
Write-Step "Creating application pool '$SiteName'"
if (-not (Test-Path "IIS:\AppPools\$SiteName")) { New-WebAppPool -Name $SiteName | Out-Null }
Set-ItemProperty "IIS:\AppPools\$SiteName" -Name managedRuntimeVersion -Value ''   # static files only
Set-ItemProperty "IIS:\AppPools\$SiteName" -Name startMode -Value 'AlwaysRunning'
Write-Ok "App pool ready (No Managed Code)."

Write-Step "Creating site '$SiteName'"
if (-not (Test-Path "IIS:\Sites\$SiteName")) {
    New-Website -Name $SiteName -PhysicalPath $SitePath -ApplicationPool $SiteName `
        -Port $HttpPort -IPAddress '*' -Force | Out-Null
} else {
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name physicalPath -Value $SitePath
    Set-ItemProperty "IIS:\Sites\$SiteName" -Name applicationPool -Value $SiteName
}

function Add-BindingIfMissing {
    param($Protocol, $Port)
    $existing = Get-WebBinding -Name $SiteName -Protocol $Protocol -ErrorAction SilentlyContinue |
        Where-Object { $_.bindingInformation -like "*:${Port}:*" }
    if (-not $existing) {
        New-WebBinding -Name $SiteName -Protocol $Protocol -Port $Port -IPAddress '*' | Out-Null
        Write-Ok "Added $Protocol binding on port $Port."
    } else {
        Write-Ok "$Protocol binding on port $Port already present."
    }
}
Add-BindingIfMissing -Protocol 'http' -Port $HttpPort
Add-BindingIfMissing -Protocol 'https' -Port $HttpsPort

# -------------------------------------------------------------- certificate
Write-Step "Preparing HTTPS certificate (required for microphone access)"
$hostName = $env:COMPUTERNAME
$friendly = "Learn Bhasha dev certificate"
$cert = Get-ChildItem Cert:\LocalMachine\My |
    Where-Object { $_.FriendlyName -eq $friendly -and $_.NotAfter -gt (Get-Date) } |
    Select-Object -First 1

if (-not $cert) {
    # Chrome only accepts an IP URL when the address is in the SAN as an IPAddress entry.
    $san = "2.5.29.17={text}DNS=$hostName&DNS=localhost&IPAddress=$LanIp"
    $cert = New-SelfSignedCertificate -Subject "CN=$hostName" -FriendlyName $friendly `
        -CertStoreLocation 'Cert:\LocalMachine\My' -TextExtension @($san) `
        -KeyAlgorithm RSA -KeyLength 2048 -NotAfter (Get-Date).AddYears(2)
    Write-Ok "Created certificate $($cert.Thumbprint)."
} else {
    Write-Ok "Reusing certificate $($cert.Thumbprint)."
}

$store = New-Object System.Security.Cryptography.X509Certificates.X509Store 'Root', 'LocalMachine'
$store.Open('ReadWrite')
if (-not $store.Certificates.Find('FindByThumbprint', $cert.Thumbprint, $false).Count) {
    $store.Add($cert)
    Write-Ok "Trusted the certificate on this machine."
}
$store.Close()

$cerPath = Join-Path $PSScriptRoot 'learn-bhasha-cert.cer'
Export-Certificate -Cert $cert -FilePath $cerPath -Force | Out-Null
Write-Ok "Exported certificate for phones: $cerPath"

$httpsBinding = Get-WebBinding -Name $SiteName -Protocol 'https' |
    Where-Object { $_.bindingInformation -like "*:${HttpsPort}:*" }
$httpsBinding.AddSslCertificate($cert.Thumbprint, 'My')
Write-Ok "Certificate bound to port $HttpsPort."

# ---------------------------------------------------------------- firewall
if (-not $SkipFirewall) {
    Write-Step "Opening the firewall for the local network"
    foreach ($port in @($HttpPort, $HttpsPort)) {
        $ruleName = "Learn Bhasha ($port)"
        Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue |
            Remove-NetFirewallRule -ErrorAction SilentlyContinue
        New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow `
            -Protocol TCP -LocalPort $port -Profile Private, Domain | Out-Null
        Write-Ok "Allowed inbound TCP $port (private/domain networks)."
    }
}

Start-Website -Name $SiteName -ErrorAction SilentlyContinue
Write-Step "Verifying"
try {
    $code = (Invoke-WebRequest "http://localhost:$HttpPort/" -UseBasicParsing -TimeoutSec 10).StatusCode
    Write-Ok "http://localhost:$HttpPort/ responded $code"
} catch {
    Write-Warn "Local check failed: $($_.Exception.Message)"
}

Write-Host "`n------------------------------------------------------------" -ForegroundColor Cyan
Write-Host " Learn Bhasha is deployed." -ForegroundColor Cyan
Write-Host "------------------------------------------------------------"
Write-Host " On this PC   : http://localhost:$HttpPort/"
Write-Host " On the phone : https://${LanIp}:$HttpsPort/    <-- use this one"
Write-Host ""
Write-Host " The phone will warn about the self-signed certificate." -ForegroundColor Yellow
Write-Host " Tap Advanced > Proceed. The microphone needs https, so do not use"
Write-Host " http://${LanIp}:$HttpPort/ for assessments - listening will work but"
Write-Host " speaking will not."
Write-Host ""
Write-Host " Phone and PC must be on the same Wi-Fi network."
Write-Host ""
Write-Host " If the phone says ERR_ADDRESS_UNREACHABLE / cannot connect:" -ForegroundColor Yellow
Write-Host "  1. Confirm the phone's Wi-Fi IP starts with $($LanIp.Substring(0, $LanIp.LastIndexOf('.')))."
Write-Host "     A different subnet usually means a guest network - switch SSID."
Write-Host "  2. Some routers enable 'AP isolation' / 'client isolation', which blocks"
Write-Host "     phone-to-PC traffic. Turn it off in the router's Wi-Fi settings."
Write-Host "  3. Re-check the network profile:  Get-NetConnectionProfile"
Write-Host "------------------------------------------------------------`n"
