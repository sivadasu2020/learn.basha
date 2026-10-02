# Learn Bhasha - speak Kannada &amp; Telugu

A zero-dependency, static web app that teaches **speaking** (not writing, not grammar) through a
single shared 6-level path. Every chapter ends in a spoken assessment judged by your microphone,
and you move on only after scoring **80% or more on the same assessment 3 times**.
Learner details and every attempt are also stored in a separate on-device IndexedDB database
(`learn-bhasha-users`) for future enhancements.

- 2 languages today (Kannada, Telugu) on an **identical** syllabus - adding a third is one file.
- 6 levels x 3 chapters x 10 items = **180 spoken items per language**.
- Listen -> repeat -> mic checks you -> assessment -> marks -> recorded.
- Works on phone, tablet and desktop; deploys to IIS as plain static files.

Content selection is justified in [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md).

## How learning works

1. **Pick a language** and enter your name (goes on the record).
2. **Chapter practice** - hear each word/phrase (normal or slow), repeat it, and the mic tells
   you your match percentage instantly.
3. **Assessment** - items are shuffled. You see the English meaning + roman pronunciation
   (native script is blurred until your first attempt) and must *say* the item.
   - 3 tries per item: **100 / 80 / 60 marks**; 0 if all three fail.
   - Failing items are spoken back to you slowly and added to a repeat-practice list.
4. **Result** - total marks out of 100, per-item table (tries, best match, marks), pass/fail.
   **Pass requires every item correct and a score of 100.**
5. **Unlock** - the next chapter unlocks only after a pass. Records are kept in Records ->
   exportable as CSV or JSON.

If the browser has no speech recognition (Safari / Firefox), the assessment automatically falls
back to **type-what-you-said** mode, scored with the same engine.

## Pronunciation (the Listen button)

Native script is **never** handed to a voice that cannot read it. The app picks the best option
on the device and tells you which one it used (see the **Voices** screen):

| Quality | When | What is spoken |
|---|---|---|
| **Native** | a `kn-IN` / `te-IN` voice exists | the native script, correct pronunciation |
| **Indian, transliterated** | only Hindi/Marathi voices exist | the word rewritten in Devanagari (`ನಮಸ್ಕಾರ` -> `नमस्कार`) so an Indian voice says it with Indian sounds |
| **English, approximate** | only English voices exist | a respelled roman form; the written pronunciation stays the reference |

**To get real native pronunciation:**

- **Easiest - open the app in Microsoft Edge.** Edge provides online neural voices for Kannada
  (`kn-IN`) and Telugu (`te-IN`) with no install, just internet access.
- **Windows:** Settings -> Time &amp; language -> Language &amp; region -> *Add a language* ->
  Kannada / Telugu, including the **Text-to-speech** optional feature, then restart the browser.
- **Android:** Settings -> Accessibility -> Text-to-speech -> Google Speech Services ->
  Install voice data -> Kannada / Telugu, then use Chrome.

The **Voices** screen shows the detected quality per language, lets you pick a specific voice
manually, and has a Refresh button for voices installed while the app was open.

## Project layout

```
index.html                 single page shell
web.config                 IIS static hosting + security headers
assets/css/app.css         responsive UI (mobile first)
assets/js/curriculum.js    shared level/chapter skeleton (same for all languages)
assets/js/lang-kannada.js  Kannada content pack
assets/js/lang-telugu.js   Telugu content pack
assets/js/speech.js         SpeechRecognition + voice resolution (native/transliterated/approx)
assets/js/translit.js       Kannada/Telugu -> Devanagari bridge for TTS
assets/js/scoring.js        phonetic folding + Levenshtein similarity scoring
assets/js/storage.js       progress + assessment records (localStorage)
assets/js/app.js           views, assessment flow, events
docs/CONTENT-SOURCES.md    why this content was chosen
```

## Run locally

Open a terminal in the project folder:

```powershell
# any static server works; python example:
python -m http.server 8080
```

Then browse to `http://localhost:8080`. The microphone works on `localhost` without HTTPS.

## Deploy to IIS (and open it on your phone)

Run the deployment script **once, from an elevated PowerShell**:

```powershell
cd C:\siva\pocs\Learn.Bhasha\deploy
.\Deploy-IIS.ps1
```

It is idempotent - re-run it after any code change to publish again. What it does:

1. Enables the IIS static-content and default-document features if they are missing.
2. Copies the app to `C:\inetpub\wwwroot\LearnBhasha` (docs, deploy and git folders excluded).
3. Creates the `LearnBhasha` app pool (**No Managed Code** - the app is pure static) and site.
4. Adds an **http** binding on port 8080 and an **https** binding on port 8443.
5. Creates a self-signed certificate that includes your LAN IP in the Subject Alternative Name,
   binds it to 8443, trusts it on the PC and exports `deploy\learn-bhasha-cert.cer` for phones.
6. Opens the Windows Firewall for both ports on private/domain networks.

Useful parameters: `-HttpPort`, `-HttpsPort`, `-SitePath`, `-LanIp`, `-SkipFirewall`,
`-KeepPublicNetwork`.

> **The most common reason a phone cannot reach the site** is that Windows classifies the
> Wi-Fi as a **Public** network, where all inbound connections are blocked - the PC's own
> browser still works because loopback skips the firewall. The script detects this and switches
> the adapter to **Private** (pass `-KeepPublicNetwork` to prevent that). To check by hand:
>
> ```powershell
> Get-NetConnectionProfile                                                    # as any user
> Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private   # elevated
> ```

### On the phone

Open **`https://<your-lan-ip>:8443/`** (the script prints the exact URL) with the phone on the
same Wi-Fi. Accept the certificate warning once via *Advanced -> Proceed*.

**Use the https URL, not http.** Browsers only grant microphone access on a secure origin, so
over plain http the lessons are readable and the assessment silently drops to typed mode.

To remove the warning entirely, copy `deploy\learn-bhasha-cert.cer` to the phone and install it
(Android: Settings -> Security -> Encryption &amp; credentials -> Install a certificate -> CA).

If the phone still cannot connect:

1. Check the phone's Wi-Fi IP is on the **same subnet** (`192.168.1.x` for a PC on
   `192.168.1.6`). A different subnet usually means it joined a guest SSID.
2. Turn off **AP isolation / client isolation** in the router's Wi-Fi settings - it blocks
   phone-to-PC traffic by design.
3. Confirm the firewall rule exists and the profile is Private (see the box above).

### Manual alternative

If you prefer the IIS Manager UI: **Add Website** -> physical path `C:\inetpub\wwwroot\LearnBhasha`,
app pool with *No Managed Code*, then add the https binding with a certificate from
**Server Certificates -> Create Self-Signed Certificate**.

`web.config` already ships the default document, static MIME types, caching and security headers
(CSP, nosniff, frame options, `Permissions-Policy: microphone=(self)`).

## Data &amp; privacy

Everything - progress, scores and per-item transcripts - stays in `localStorage` on the device.
There is no backend and no network call. **Records -> Clear all records** wipes it.
Export CSV/JSON if you want to keep or share results.

## Adding another language

Create `assets/js/lang-<id>.js` copying the structure of the Telugu pack: same 18 chapter keys,
6 words + 4 phrases each, `[native, roman, english]`. Set `speechLang` to a BCP-47 code the
recogniser supports (e.g. `ta-IN`, `hi-IN`) and add a `<script>` tag in `index.html`.
No other change is needed - the UI, assessment and scoring are language-agnostic.
