/* Speech in (recognition) and speech out (synthesis) wrappers. */
(function () {
  'use strict';

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Devanagari-reading locales that can voice a transliterated Kannada/Telugu word.
  var DEVANAGARI_LOCALES = ['hi', 'mr', 'ne', 'sa'];

  var Speech = {
    recognitionSupported: !!SR,
    synthesisSupported: 'speechSynthesis' in window,
    onVoicesChanged: null,
    _recognition: null,
    _voices: [],
    _override: {}
  };

  function loadVoices() {
    if (!Speech.synthesisSupported) return;
    var next = window.speechSynthesis.getVoices() || [];
    var changed = next.length !== Speech._voices.length;
    Speech._voices = next;
    if (changed && typeof Speech.onVoicesChanged === 'function') Speech.onVoicesChanged();
  }
  loadVoices();
  if (Speech.synthesisSupported) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    // Edge and Chrome publish their online neural voices seconds after load.
    [300, 800, 1500, 3000, 6000].forEach(function (ms) { setTimeout(loadVoices, ms); });
  }

  Speech.voices = function () { return Speech._voices.slice(); };

  function voiceLang(v) { return (v.lang || '').toLowerCase().replace('_', '-'); }
  function voicePrefix(v) { return voiceLang(v).split('-')[0]; }

  function byPrefix(codes) {
    return Speech._voices.filter(function (v) { return codes.indexOf(voicePrefix(v)) !== -1; });
  }

  /** Prefer the exact locale (kn-IN) over a bare language match. */
  function best(voices, preferredLocale) {
    if (!voices.length) return null;
    var exact = voices.filter(function (v) { return voiceLang(v) === preferredLocale; });
    return exact[0] || voices[0];
  }

  /** True when the voice can read this language's own script. */
  function isNativeVoice(v, pack) {
    var locales = pack.voiceLocales || [pack.speechLang.split('-')[0]];
    if (locales.indexOf(voicePrefix(v)) !== -1) return true;
    // Fall back to the voice name: a few engines report an empty or odd locale.
    return !!(pack.voiceNamePattern && pack.voiceNamePattern.test(v.name || ''));
  }

  Speech.setVoiceOverride = function (langId, voiceURI) {
    if (voiceURI) Speech._override[langId] = voiceURI;
    else delete Speech._override[langId];
  };

  /** Voices that can read this language's own script, best locale match first. */
  Speech.nativeVoices = function (pack) {
    var wanted = pack.speechLang.toLowerCase();
    return Speech._voices.filter(function (v) { return isNativeVoice(v, pack); })
      .sort(function (a, b) { return (voiceLang(b) === wanted) - (voiceLang(a) === wanted); });
  };

  /** Voice the language should default to: the native one whenever the device has it. */
  Speech.defaultVoiceURI = function (pack) {
    var native = Speech.nativeVoices(pack)[0];
    return native ? native.voiceURI : '';
  };

  Speech.groupedVoices = function (pack) {
    var native = Speech.nativeVoices(pack);
    var groups = { native: native, indian: [], other: [] };
    Speech._voices.forEach(function (v) {
      if (native.indexOf(v) !== -1) return;
      if (DEVANAGARI_LOCALES.indexOf(voicePrefix(v)) !== -1) groups.indian.push(v);
      else groups.other.push(v);
    });
    return groups;
  };

  /**
   * Decide how an item can be spoken on THIS device.
   * quality: native | devanagari | approximate | none
   */
  Speech.resolve = function (item, pack) {
    if (!Speech.synthesisSupported || !Speech._voices.length) {
      return { quality: 'none', text: item.n, voice: null };
    }

    var uri = Speech._override[pack.id];
    var chosen = uri && Speech._voices.find(function (v) { return v.voiceURI === uri; });

    // A manual choice always wins; only its quality label is derived.
    if (chosen) return planFor(chosen, item, pack);

    var nativeVoice = Speech.nativeVoices(pack)[0];
    if (nativeVoice) return { quality: 'native', text: item.n, voice: nativeVoice };

    var devVoice = best(byPrefix(DEVANAGARI_LOCALES), 'hi-in');
    if (devVoice) return { quality: 'devanagari', text: Translit.toDevanagari(item.n), voice: devVoice };

    var enVoice = best(byPrefix(['en']), 'en-in') || Speech._voices[0];
    return { quality: 'approximate', text: Translit.toEnglishRespell(item.r), voice: enVoice };
  };

  function planFor(voice, item, pack) {
    if (isNativeVoice(voice, pack)) return { quality: 'native', text: item.n, voice: voice };
    if (DEVANAGARI_LOCALES.indexOf(voicePrefix(voice)) !== -1) {
      return { quality: 'devanagari', text: Translit.toDevanagari(item.n), voice: voice };
    }
    return { quality: 'approximate', text: Translit.toEnglishRespell(item.r), voice: voice };
  }

  function utterFor(plan, rate) {
    var utter = new SpeechSynthesisUtterance(plan.text);
    utter.voice = plan.voice;
    utter.lang = plan.voice.lang;
    // An approximating voice needs extra time to land the Indian sounds.
    utter.rate = rate || (plan.quality === 'native' ? 0.85 : 0.7);
    return utter;
  }

  /**
   * Speak one curriculum item with the best voice available - native script is never
   * handed to a voice that cannot read it.
   * @returns {{quality:string, voice:SpeechSynthesisVoice|null, text:string}}
   */
  Speech.speakItem = function (item, pack, rate) {
    var plan = Speech.resolve(item, pack);
    if (plan.quality === 'none' || !plan.text) return plan;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterFor(plan, rate));
    return plan;
  };

  /** Queue several items back-to-back without cancelling each other. */
  Speech.speakSequence = function (items, pack, rate) {
    if (!Speech.synthesisSupported) return { quality: 'none' };
    window.speechSynthesis.cancel();
    var last = { quality: 'none' };
    items.forEach(function (item) {
      var plan = Speech.resolve(item, pack);
      last = plan;
      if (plan.quality === 'none' || !plan.text) return;
      window.speechSynthesis.speak(utterFor(plan, rate));
    });
    return last;
  };

  Speech.stopSpeaking = function () {
    if (Speech.synthesisSupported) window.speechSynthesis.cancel();
  };

  /**
   * Listen once. Resolves with { transcripts: string[], confidence: number }.
   */
  Speech.listen = function (lang, opts) {
    opts = opts || {};
    return new Promise(function (resolve, reject) {
      if (!SR) {
        reject(new Error('Speech recognition is not supported in this browser.'));
        return;
      }
      var settled = false;
      var attempts = 0;
      var retryScheduled = false;
      var timer = setTimeout(function () {
        if (Speech._recognition) {
          try { Speech._recognition.stop(); } catch (e) { /* already stopped */ }
        }
      }, opts.timeoutMs || 7000);

      function fail(message) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(new Error(message));
      }

      function startRecognition() {
        if (settled) return;
        retryScheduled = false;
        var rec = new SR();
        Speech._recognition = rec;
        rec.lang = lang;
        rec.interimResults = false;
        rec.maxAlternatives = 5;
        rec.continuous = false;
        var receivedResult = false;

        rec.onresult = function (evt) {
          receivedResult = true;
          var transcripts = [];
          var confidence = 0;
          for (var r = 0; r < evt.results.length; r++) {
            var result = evt.results[r];
            if (result.isFinal === false) continue;
            confidence = Math.max(confidence, result[0].confidence || 0);
            for (var i = 0; i < result.length; i++) transcripts.push(result[i].transcript);
          }
          if (!transcripts.length) return;
          settled = true;
          clearTimeout(timer);
          resolve({ transcripts: transcripts, confidence: confidence });
        };
        rec.onerror = function (evt) {
          if (Speech._recognition !== rec) return;
          if (!settled && !retryScheduled && (evt.error === 'no-speech' || evt.error === 'aborted') && attempts < 1) {
            attempts += 1;
            retryScheduled = true;
            setTimeout(startRecognition, 120);
            return;
          }
          fail(evt.error === 'not-allowed'
            ? 'Microphone permission was blocked. Allow the mic and try again.'
            : 'Could not hear you (' + evt.error + '). Try again.');
        };
        rec.onend = function () {
          if (Speech._recognition !== rec || retryScheduled) return;
          if (settled || receivedResult) return;
          if (attempts < 1) {
            attempts += 1;
            retryScheduled = true;
            setTimeout(startRecognition, 120);
          } else {
            fail('No speech detected. Speak clearly after pressing the mic.');
          }
        };

        try {
          rec.start();
        } catch (e) {
          if (attempts < 1) {
            attempts += 1;
            retryScheduled = true;
            setTimeout(startRecognition, 120);
          } else {
            fail('Microphone is already in use. Wait a second and retry.');
          }
        }
      }

      startRecognition();
    });
  };

  Speech.abortListening = function () {
    if (Speech._recognition) {
      try { Speech._recognition.abort(); } catch (e) { /* noop */ }
    }
  };

  window.Speech = Speech;
})();
