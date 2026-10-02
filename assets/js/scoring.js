/* Pronunciation scoring: compares what the mic heard with the expected answer. */
(function () {
  'use strict';

  var PUNCT = /[\s.,!?;:।॥"'`\-_()\[\]{}\u200c\u200d]/g;

  function normalizeNative(s) {
    return (s || '').replace(PUNCT, '');
  }

  /** Fold a roman string to a rough phonetic skeleton so aa/a, v/w, sh/s all match. */
  function foldRoman(s) {
    var t = (s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '');
    t = t
      .replace(/ph/g, 'f')
      .replace(/kh/g, 'k')
      .replace(/gh/g, 'g')
      .replace(/th/g, 't')
      .replace(/dh/g, 'd')
      .replace(/bh/g, 'b')
      .replace(/ch/g, 'c')
      .replace(/sh/g, 's')
      .replace(/ksh/g, 'ks')
      .replace(/w/g, 'v')
      .replace(/z/g, 'j')
      .replace(/(.)\1+/g, '$1');
    return t;
  }

  function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    var prev = new Array(b.length + 1);
    for (var j = 0; j <= b.length; j++) prev[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var cur = [i];
      for (var k = 1; k <= b.length; k++) {
        var cost = a.charAt(i - 1) === b.charAt(k - 1) ? 0 : 1;
        cur[k] = Math.min(cur[k - 1] + 1, prev[k] + 1, prev[k - 1] + cost);
      }
      prev = cur;
    }
    return prev[b.length];
  }

  function ratio(a, b) {
    if (!a && !b) return 1;
    if (!a || !b) return 0;
    var max = Math.max(a.length, b.length);
    return 1 - levenshtein(a, b) / max;
  }

  /**
   * Score one spoken attempt.
   * @param {string[]} transcripts - alternatives returned by the recogniser
   * @param {{n:string, r:string}} expected - native script + roman pronunciation
   * @returns {{similarity:number, percent:number, heard:string}}
   */
  function scoreAttempt(transcripts, expected) {
    var targets = [
      { value: normalizeNative(expected.n), native: true },
      { value: foldRoman(expected.r), native: false }
    ];
    var best = { similarity: 0, heard: (transcripts && transcripts[0]) || '' };

    (transcripts || []).forEach(function (raw) {
      targets.forEach(function (target) {
        if (!target.value) return;
        var candidate = target.native ? normalizeNative(raw) : foldRoman(raw);
        var sim = ratio(candidate, target.value);
        if (sim > best.similarity) best = { similarity: sim, heard: raw };
      });
    });

    best.percent = Math.round(best.similarity * 100);
    return best;
  }

  window.Scoring = {
    normalizeNative: normalizeNative,
    foldRoman: foldRoman,
    similarity: ratio,
    scoreAttempt: scoreAttempt
  };
})();
