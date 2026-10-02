/*
 * Script bridge for text-to-speech.
 * Kannada, Telugu and Devanagari sit in parallel Unicode blocks, so a Kannada/Telugu
 * word can be rewritten in Devanagari almost 1:1 and read by a Hindi/Marathi voice
 * with the correct Indian sounds - far closer than an English voice reading the raw script.
 */
(function () {
  'use strict';

  var DEV_RANGES = [
    [0x0901, 0x0903], [0x0905, 0x0939], [0x093C, 0x094D],
    [0x0950, 0x0951], [0x0958, 0x0963], [0x0966, 0x096F]
  ];

  function isDevanagari(cp) {
    return DEV_RANGES.some(function (r) { return cp >= r[0] && cp <= r[1]; });
  }

  // Hindi voices handle the short e/o vowels poorly; use the long equivalents.
  var LENGTHEN = { 0x090E: 0x090F, 0x0912: 0x0913, 0x0946: 0x0947, 0x094A: 0x094B };

  function toDevanagari(text) {
    var out = '';
    for (var i = 0; i < text.length; i++) {
      var cp = text.codePointAt(i);
      var base = null;
      if (cp >= 0x0C80 && cp <= 0x0CFF) base = 0x0C80;      // Kannada
      else if (cp >= 0x0C00 && cp <= 0x0C7F) base = 0x0C00; // Telugu
      if (base === null) {
        out += text.charAt(i);
        continue;
      }
      var dev = cp - base + 0x0900;
      if (LENGTHEN[dev]) dev = LENGTHEN[dev];
      if (isDevanagari(dev)) out += String.fromCharCode(dev);
    }
    return out;
  }

  /** Last resort: respell the roman pronunciation so an English voice lands closer. */
  function toEnglishRespell(roman) {
    return (roman || '')
      .toLowerCase()
      .replace(/th/g, 't')   // roman "th" is an aspirated t, never the English fricative
      .replace(/dh/g, 'd')
      .replace(/ai/g, 'eye ')
      .replace(/au/g, 'ow ')
      .replace(/aa/g, 'ah')
      .replace(/ee/g, 'ee')
      .replace(/\s+/g, ' ')
      .trim();
  }

  window.Translit = { toDevanagari: toDevanagari, toEnglishRespell: toEnglishRespell };
})();
