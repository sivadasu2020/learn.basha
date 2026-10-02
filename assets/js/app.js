/* Learn Bhasha - speaking-first learning app. Vanilla JS, no build step. */
(function () {
  'use strict';

  var app = document.getElementById('app');
  var C = window.CURRICULUM;
  var PACKS = window.LANG_PACKS;

  var view = { name: 'home', langId: null, chapterId: null, session: null, lastRecord: null };

  /* ---------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pack(langId) { return PACKS[langId]; }

  function learnerTrack() { return C.track(Store.state.track); }

  function chapterMeta(chapterId) {
    return C.allChapters.find(function (c) { return c.id === chapterId; });
  }

  function chapterItems(langId, chapterId) {
    var data = pack(langId).chapters[chapterId];
    var toItem = function (kind) {
      return function (a) { return { n: a[0], r: a[1], e: a[2], kind: kind }; };
    };
    var items = data.words.map(toItem('word')).concat(data.phrases.map(toItem('phrase')));
    if (learnerTrack().itemMode !== 'words-first') {
      items.sort(function (a, b) { return a.kind === 'phrase' ? -1 : (b.kind === 'phrase' ? 1 : 0); });
    }
    return items;
  }

  function chapterIndex(chapterId) {
    return C.allChapters.findIndex(function (c) { return c.id === chapterId; });
  }

  function isUnlocked(langId, chapterId) {
    var selectedTrack = learnerTrack();
    var selectedLevel = C.levels.find(function (level) {
      return level.chapters.some(function (chapter) { return chapter.id === chapterId; });
    });
    if (selectedLevel && selectedLevel.trackId === selectedTrack.id) return true;
    var i = chapterIndex(chapterId);
    if (i <= 0) return true;
    return Store.isChapterPassed(langId, C.allChapters[i - 1].id);
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function langStats(langId) {
    var total = C.allChapters.length;
    var done = C.allChapters.filter(function (c) { return Store.isChapterPassed(langId, c.id); }).length;
    return { done: done, total: total, percent: Math.round((done / total) * 100) };
  }

  var QUALITY = {
    native: { label: 'Native voice', cls: 'ok' },
    devanagari: { label: 'Indian voice, transliterated', cls: 'warn' },
    approximate: { label: 'English voice, approximate', cls: 'warn' },
    none: { label: 'No voice installed', cls: 'warn' }
  };

  /** What the listen button will sound like for this language on this device. */
  function voicePlan(langId) {
    var p = pack(langId);
    var sample = chapterItems(langId, 'L1C1')[0];
    return Speech.resolve(sample, p);
  }

  function voiceNotice(langId) {
    var plan = voicePlan(langId);
    var q = QUALITY[plan.quality];
    var name = plan.voice ? plan.voice.name + ' (' + plan.voice.lang + ')' : 'none';
    var detail;
    if (plan.quality === 'native') {
      detail = 'Pronunciation comes from a real ' + esc(pack(langId).name) + ' voice: <b>' + esc(name) + '</b>.';
    } else if (plan.quality === 'devanagari') {
      detail = 'No ' + esc(pack(langId).name) + ' voice is installed, so words are transliterated to Devanagari and read by <b>' + esc(name) + '</b>. ' +
        'The sounds are Indian and close, but not native.';
    } else if (plan.quality === 'approximate') {
      detail = 'Only English voices are installed (<b>' + esc(name) + '</b>), so you hear an English approximation of the pronunciation. ' +
        '<b>Install a native voice for correct pronunciation</b> - see below.';
    } else {
      detail = 'This device has no speech voices at all. Use the written pronunciation.';
    }
    return '<div class="banner ' + q.cls + '" id="voiceNotice">' +
      '<b>Listening voice: ' + q.label + '.</b> ' + detail +
      (plan.quality === 'native' ? '' : ' <button type="button" class="linkish" data-nav="voices">Fix pronunciation</button>') +
      '</div>';
  }

  function voicePicker(langId) {
    var p = pack(langId);
    var groups = Speech.groupedVoices(p);
    var nativeCode = p.speechLang;
    // The native locale is always the default; a saved choice only overrides it explicitly.
    var current = Store.state.voice[langId] || Speech.defaultVoiceURI(p);

    function opts(list, suffix) {
      return list.map(function (v) {
        return '<option value="' + esc(v.voiceURI) + '"' + (v.voiceURI === current ? ' selected' : '') + '>' +
          esc(v.name) + ' - ' + esc(v.lang) + suffix + '</option>';
      }).join('');
    }

    var html = '';
    if (groups.native.length) {
      html += '<optgroup label="Native ' + esc(p.name) + ' (' + esc(nativeCode) + ') - correct pronunciation">' +
        opts(groups.native, '') + '</optgroup>';
    } else {
      html += '<optgroup label="Native ' + esc(p.name) + ' (' + esc(nativeCode) + ')">' +
        '<option value="" disabled selected>' + esc(nativeCode) + ' voice is not installed on this device</option>' +
        '</optgroup>';
    }
    if (groups.indian.length) {
      html += '<optgroup label="Indian voices - transliterated, close">' + opts(groups.indian, '') + '</optgroup>';
    }
    if (groups.other.length) {
      html += '<optgroup label="Other voices - approximate only">' + opts(groups.other, '') + '</optgroup>';
    }
    html += '<option value="auto"' + (Store.state.voice[langId] === 'auto' ? ' selected' : '') + '>Automatic (best available)</option>';

    return '<div class="field"><label for="voiceSelect-' + langId + '">Voice for ' + esc(p.name) + ' (' + esc(nativeCode) + ')</label>' +
      '<select id="voiceSelect-' + langId + '" data-voice-for="' + langId + '">' + html + '</select>' +
      (groups.native.length
        ? '<span class="good-text small">Native ' + esc(nativeCode) + ' voice selected by default.</span>'
        : '<span class="warn-text small">No ' + esc(nativeCode) + ' voice on this device - see the steps above to add one, then press Refresh.</span>') +
      '</div>';
  }

  function go(name, opts) {
    Speech.abortListening();
    Speech.stopSpeaking();
    Object.assign(view, { name: name }, opts || {});
    render();
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------ views */

  function homeView() {
    var learner = Store.state.learner;
    var cards = Object.keys(PACKS).map(function (id) {
      var p = PACKS[id];
      var s = langStats(id);
      return '' +
        '<button class="lang-card" data-lang="' + id + '" type="button">' +
          '<span class="lang-native">' + esc(p.nativeName) + '</span>' +
          '<span class="lang-name">' + esc(p.name) + '</span>' +
          '<span class="bar"><i style="width:' + s.percent + '%"></i></span>' +
          '<span class="muted">' + s.done + ' / ' + s.total + ' chapters passed</span>' +
        '</button>';
    }).join('');

    return '' +
      '<section class="hero">' +
        '<h1>Speak a new language, one assessment at a time</h1>' +
        '<p>Choose a path that matches your experience. Every chapter ends with a spoken test judged by your microphone, and you move ahead after scoring <strong>' + C.passMark + '% or more ' + C.requiredPasses + ' times</strong> on the same assessment.</p>' +
        '<div class="field">' +
          '<label for="learnerName">Your name (used on the assessment record)</label>' +
          '<input id="learnerName" type="text" maxlength="40" placeholder="e.g. Siva" value="' + esc(learner) + '" />' +
        '</div>' +
        '<div class="field">' +
          '<label for="trackSelect">Your learning level</label>' +
          '<select id="trackSelect">' + C.tracks.map(function (track) {
            return '<option value="' + track.id + '"' + (track.id === Store.state.track ? ' selected' : '') + '>' + esc(track.title) + ' - ' + esc(track.description) + '</option>';
          }).join('') + '</select>' +
        '</div>' +
      '</section>' +
      '<h2 class="section-title">Pick a language</h2>' +
      '<div class="lang-grid">' + cards + '</div>' +
      supportBanner() +
      voiceNotice('kannada') +
      '<div class="path">' +
        '<h2 class="section-title">Three ways to learn</h2>' +
        '<ol class="path-list">' +
          C.tracks.map(function (track) {
            return '<li><strong>' + esc(track.title) + '</strong><span>' + esc(track.description) + '</span></li>';
          }).join('') +
        '</ol>' +
      '</div>';
  }

  function supportBanner() {
    if (Speech.recognitionSupported) {
      return '<p class="banner ok">Microphone judging is active in this browser. Allow mic access when asked.</p>';
    }
    return '<p class="banner warn">This browser cannot judge speech automatically (use Chrome or Edge for that). ' +
      'You can still take every assessment in <strong>type-what-you-said</strong> mode, which is scored the same way.</p>';
  }

  function levelsView() {
    var p = pack(view.langId);
    var s = langStats(view.langId);
    var selectedTrack = learnerTrack();
    var levels = C.levels.slice().sort(function (a, b) {
      return (a.trackId === selectedTrack.id ? 0 : 1) - (b.trackId === selectedTrack.id ? 0 : 1);
    }).map(function (lvl) {
      var chapters = lvl.chapters.map(function (ch) {
        var passed = Store.isChapterPassed(view.langId, ch.id);
        var unlocked = isUnlocked(view.langId, ch.id);
        var best = Store.bestScore(view.langId, ch.id);
        var passes = Math.min(Store.passCount(view.langId, ch.id), C.requiredPasses);
        var state = passed ? 'PASSED'
          : !unlocked ? 'Locked'
          : best == null ? 'Not started'
          : 'Best ' + best + '% &bull; Passes ' + passes + '/' + C.requiredPasses;
        return '' +
          '<button class="chapter ' + (passed ? 'passed' : '') + '" type="button" data-chapter="' + ch.id + '"' +
            (unlocked ? '' : ' disabled') + '>' +
            '<span class="ch-title">' + esc(ch.title) + '</span>' +
            '<span class="ch-focus">' + esc(ch.focus) + '</span>' +
            '<span class="ch-state">' + state + '</span>' +
          '</button>';
      }).join('');
      var recommended = lvl.chapters.some(function (chapter) { return chapter.id === selectedTrack.defaultChapterId; })
        ? ' <span class="ch-state">Recommended starting point</span>' : '';
      return '<section class="level"><h3>' + esc(lvl.title) + recommended + '</h3><p class="muted">' + esc(lvl.goal) + '</p><div class="chapter-grid">' + chapters + '</div></section>';
    }).join('');

    return '' +
      '<div class="crumbs"><button type="button" data-nav="home">Home</button><span>/</span><b>' + esc(p.name) + '</b></div>' +
      '<section class="hero compact">' +
        '<h1>' + esc(p.nativeName) + ' <small>' + esc(p.name) + '</small></h1>' +
        '<span class="bar big"><i style="width:' + s.percent + '%"></i></span>' +
        '<p class="muted"><strong>' + esc(selectedTrack.title) + ' path:</strong> ' + esc(selectedTrack.description) + ' ' + s.done + ' of ' + s.total + ' chapters passed. A chapter unlocks only after the previous one is passed (' + C.passMark + '%+) ' + C.requiredPasses + ' times.</p>' +
      '</section>' + levels;
  }

  function chapterView() {
    var meta = chapterMeta(view.chapterId);
    var p = pack(view.langId);
    var items = chapterItems(view.langId, view.chapterId);
    var rows = items.map(function (it, i) {
      return '' +
        '<li class="item">' +
          '<div class="item-main">' +
            '<span class="native">' + esc(it.n) + '</span>' +
            '<span class="roman">' + esc(it.r) + '</span>' +
            '<span class="english">' + esc(it.e) + '</span>' +
          '</div>' +
          '<div class="item-actions">' +
            '<button type="button" class="icon" data-say="' + i + '" title="Hear it">Listen</button>' +
            '<button type="button" class="icon" data-slow="' + i + '" title="Hear it slowly">Slow</button>' +
            '<button type="button" class="icon primary" data-try="' + i + '">Repeat &amp; check</button>' +
          '</div>' +
          '<div class="try-result" id="try-' + i + '"></div>' +
        '</li>';
    }).join('');

    var best = Store.bestScore(view.langId, view.chapterId);
    var passes = Math.min(Store.passCount(view.langId, view.chapterId), C.requiredPasses);
    return '' +
      '<div class="crumbs"><button type="button" data-nav="home">Home</button><span>/</span>' +
        '<button type="button" data-nav="levels">' + esc(p.name) + '</button><span>/</span><b>' + esc(meta.title) + '</b></div>' +
      '<section class="hero compact">' +
        '<h1>' + esc(meta.title) + '</h1>' +
        '<p class="muted">' + esc(meta.levelTitle) + ' &bull; ' + esc(meta.focus) + '</p>' +
        '<p>' + items.length + ' items to say out loud. ' + (best != null ? 'Your best score so far: <strong>' + best + '%</strong>.' : 'Practise first, then take the assessment.') +
          ' Passes: <strong>' + passes + '/' + C.requiredPasses + '</strong>.</p>' +
        '<div class="row-actions">' +
          '<button type="button" class="btn" data-playall="1">Play the whole chapter</button>' +
          '<button type="button" class="btn primary" data-start="1">Start assessment</button>' +
        '</div>' +
      '</section>' +
      voiceNotice(view.langId) +
      '<ul class="item-list">' + rows + '</ul>' +
      '<div class="row-actions center"><button type="button" class="btn primary big" data-start="1">Start assessment (pass mark ' + C.passMark + '%)</button></div>';
  }

  /* ------------------------------------------------------- assessment */

  function startAssessment() {
    var items = shuffle(chapterItems(view.langId, view.chapterId));
    view.session = {
      queue: items.map(function (it) {
        return { item: it, tries: 0, best: 0, marks: 0, status: 'pending', heard: '' };
      }),
      index: 0,
      retries: 0,
      locked: false,
      startedAt: Date.now(),
      mode: Speech.recognitionSupported ? 'speech' : 'typed'
    };
    go('assessment');
  }

  function currentEntry() {
    var s = view.session;
    return s ? s.queue[s.index] : null;
  }

  function assessmentView() {
    var s = view.session;
    var entry = currentEntry();
    var meta = chapterMeta(view.chapterId);
    var total = s.queue.length;
    var doneCount = s.queue.filter(function (e) { return e.status === 'correct'; }).length;

    var inputBlock = s.mode === 'speech'
      ? '<button type="button" class="mic" id="micBtn"><span class="mic-dot"></span>Tap and speak</button>' +
        '<p class="muted small">Press, then say it clearly once. You get 3 tries per item.</p>'
      : '<div class="field"><label for="typedAnswer">Say it out loud, then type what you said (native script or roman)</label>' +
        '<input id="typedAnswer" type="text" autocomplete="off" placeholder="' + esc(entry.item.r) + '" />' +
        '<button type="button" class="btn primary" id="typedSubmit">Check my answer</button></div>';

    return '' +
      '<div class="crumbs"><button type="button" data-nav="levels">' + esc(pack(view.langId).name) + '</button><span>/</span><b>Assessment: ' + esc(meta.title) + '</b></div>' +
      '<section class="test">' +
        '<div class="test-head">' +
          '<span class="pill">Item ' + (s.index + 1) + ' of ' + total + '</span>' +
          '<span class="pill">Correct ' + doneCount + ' / ' + total + '</span>' +
          '<span class="pill">Pass mark ' + C.passMark + '%</span>' +
        '</div>' +
        '<span class="bar big"><i style="width:' + Math.round((doneCount / total) * 100) + '%"></i></span>' +
        '<div class="prompt">' +
          '<span class="label">Say this in ' + esc(pack(view.langId).name) + '</span>' +
          '<span class="english big">' + esc(entry.item.e) + '</span>' +
          '<span class="roman big">' + esc(entry.item.r) + '</span>' +
          '<span class="native ' + (entry.tries > 0 ? '' : 'blurred') + '">' + esc(entry.item.n) + '</span>' +
          '<button type="button" class="btn ghost" id="hintBtn">Hear the correct pronunciation</button>' +
        '</div>' +
        '<div class="test-input">' + inputBlock + '</div>' +
        '<div class="feedback" id="feedback"></div>' +
        '<div class="row-actions"><button type="button" class="btn ghost" data-nav="chapter">Quit assessment</button></div>' +
      '</section>';
  }

  function judge(transcripts) {
    var s = view.session;
    var entry = currentEntry();
    var result = Scoring.scoreAttempt(transcripts, entry.item);
    entry.tries += 1;
    entry.heard = result.heard;
    entry.best = Math.max(entry.best, result.percent);

    var fb = document.getElementById('feedback');
    var passedItem = result.similarity >= C.itemPassThreshold;

    if (passedItem) {
      entry.status = 'correct';
      entry.marks = entry.tries === 1 ? 100 : (entry.tries === 2 ? 80 : 60);
      fb.className = 'feedback good';
      fb.innerHTML = 'Correct - ' + result.percent + '% match. Heard: <em>' + esc(result.heard) + '</em>' +
        '<br><small>Marks for this item: ' + entry.marks + '/100</small>';
      s.locked = true;
      setTimeout(nextItem, 1100);
      return;
    }

    s.retries += 1;
    if (entry.tries >= 3) {
      entry.status = 'wrong';
      entry.marks = 0;
      fb.className = 'feedback bad';
      fb.innerHTML = 'Not correct yet (' + result.percent + '% match). Heard: <em>' + esc(result.heard) + '</em>' +
        '<br>Listen once more and repeat after the voice - this item is added to your practice list.';
      Speech.speakItem(entry.item, pack(view.langId), 0.7);
      s.locked = true;
      setTimeout(nextItem, 2200);
    } else {
      entry.status = 'retry';
      fb.className = 'feedback warn';
      fb.innerHTML = 'Close: ' + result.percent + '% match. Heard: <em>' + esc(result.heard) + '</em>' +
        '<br>Repeat after the voice and try again (' + (3 - entry.tries) + ' tries left).';
      Speech.speakItem(entry.item, pack(view.langId), 0.7);
      render();
    }
  }

  function nextItem() {
    var s = view.session;
    s.locked = false;
    if (s.index < s.queue.length - 1) {
      s.index += 1;
      render();
    } else {
      finishAssessment();
    }
  }

  function finishAssessment() {
    var s = view.session;
    var meta = chapterMeta(view.chapterId);
    var p = pack(view.langId);
    var correct = s.queue.filter(function (e) { return e.status === 'correct'; }).length;
    var score = Math.round(s.queue.reduce(function (sum, e) { return sum + e.marks; }, 0) / s.queue.length);
    var passed = score >= C.passMark;

    var record = Store.addRecord({
      langId: p.id,
      langName: p.name,
      levelId: meta.levelId,
      chapterId: meta.id,
      chapterTitle: meta.title,
      mode: s.mode,
      score: score,
      total: s.queue.length,
      correct: correct,
      retries: s.retries,
      passed: passed,
      durationSec: Math.round((Date.now() - s.startedAt) / 1000),
      items: s.queue.map(function (e) {
        return { n: e.item.n, r: e.item.r, e: e.item.e, tries: e.tries, best: e.best, marks: e.marks, heard: e.heard };
      })
    });

    view.lastRecord = record;
    go('result');
  }

  function resultView() {
    var r = view.lastRecord;
    var rows = r.items.map(function (it) {
      return '<tr class="' + (it.marks === 100 ? 'ok' : (it.marks > 0 ? 'mid' : 'bad')) + '">' +
        '<td><b>' + esc(it.n) + '</b><br><small>' + esc(it.r) + '</small></td>' +
        '<td>' + esc(it.e) + '</td>' +
        '<td>' + it.tries + '</td>' +
        '<td>' + it.best + '%</td>' +
        '<td>' + it.marks + '</td></tr>';
    }).join('');

    var weak = r.items.filter(function (it) { return it.marks < 100; });
    var passes = Math.min(Store.passCount(r.langId, r.chapterId), C.requiredPasses);
    var unlocked = Store.isChapterPassed(r.langId, r.chapterId);
    var note = !r.passed
      ? 'You need <strong>' + C.passMark + '%</strong> for this attempt to count. Practise the items below and take the test again.'
      : unlocked
        ? 'Passed ' + passes + '/' + C.requiredPasses + ' times - the next chapter is unlocked.'
        : 'Pass ' + passes + ' of ' + C.requiredPasses + '. Pass this assessment ' + (C.requiredPasses - passes) + ' more time(s) to unlock the next chapter.';

    return '' +
      '<section class="result ' + (r.passed ? 'pass' : 'fail') + '">' +
        '<span class="verdict">' + (r.passed ? 'PASSED' : 'NOT PASSED') + '</span>' +
        '<span class="score">' + r.score + '<small>/100</small></span>' +
        '<p>' + esc(r.chapterTitle) + ' &bull; ' + esc(r.langName) + ' &bull; ' + r.correct + '/' + r.total + ' items spoken correctly' +
        ' &bull; ' + r.retries + ' retries &bull; ' + r.durationSec + 's</p>' +
        '<p class="note">' + note + '</p>' +
      '</section>' +
      (weak.length
        ? '<section class="card"><h3>Repeat these before retrying</h3><div class="repeat-grid">' +
          weak.map(function (it, i) {
            return '<button type="button" class="repeat" data-repeat="' + i + '">' +
              '<b>' + esc(it.n) + '</b><span>' + esc(it.r) + '</span><small>' + esc(it.e) + '</small></button>';
          }).join('') + '</div><p class="muted small">Tap any card to hear it slowly, then say it aloud three times.</p></section>'
        : '') +
      '<section class="card"><h3>Item-by-item record</h3>' +
        '<div class="table-wrap"><table><thead><tr><th>Item</th><th>Meaning</th><th>Tries</th><th>Best match</th><th>Marks</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</section>' +
      '<div class="row-actions center">' +
        '<button type="button" class="btn" data-nav="chapter">Practise chapter</button>' +
        '<button type="button" class="btn primary" data-start="1">Retake assessment</button>' +
        '<button type="button" class="btn ghost" data-nav="levels">Back to levels</button>' +
      '</div>';
  }

  function recordsView() {
    var records = Store.state.records;
    if (!records.length) {
      return '<section class="card"><h3>No assessments recorded yet</h3><p class="muted">Finish a chapter assessment and it will be stored here on this device.</p>' +
        '<div class="row-actions"><button type="button" class="btn primary" data-nav="home">Start learning</button></div></section>';
    }
    var rows = records.map(function (r) {
      return '<tr class="' + (r.passed ? 'ok' : 'bad') + '">' +
        '<td>' + new Date(r.at).toLocaleString() + '</td>' +
        '<td>' + esc(r.learner) + '</td>' +
        '<td>' + esc(r.langName) + '</td>' +
        '<td>' + esc(r.chapterTitle) + '<br><small>' + esc(r.levelId) + ' &bull; ' + esc(r.mode) + '</small></td>' +
        '<td><b>' + r.score + '%</b></td>' +
        '<td>' + r.correct + '/' + r.total + '</td>' +
        '<td>' + (r.passed ? 'PASS' : 'FAIL') + '</td></tr>';
    }).join('');

    return '<section class="card"><h3>Assessment records (' + records.length + ')</h3>' +
      '<div class="row-actions">' +
        '<button type="button" class="btn" data-export="csv">Download CSV</button>' +
        '<button type="button" class="btn" data-export="json">Download JSON</button>' +
        '<button type="button" class="btn ghost danger" data-clear="1">Clear all records</button>' +
      '</div>' +
      '<div class="table-wrap"><table><thead><tr><th>Date</th><th>Learner</th><th>Language</th><th>Chapter</th><th>Score</th><th>Correct</th><th>Result</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
  }

  function voicesView() {
    var langIds = Object.keys(PACKS);
    var rows = langIds.map(function (id) {
      var p = PACKS[id];
      var plan = voicePlan(id);
      var native = Speech.nativeVoices(p);
      return '<tr class="' + (plan.quality === 'native' ? 'ok' : 'mid') + '">' +
        '<td>' + esc(p.name) + '</td>' +
        '<td><code>' + esc(p.speechLang) + '</code><br><small>' +
          (native.length ? 'installed - used by default' : 'not installed on this device') + '</small></td>' +
        '<td>' + esc(QUALITY[plan.quality].label) + '</td>' +
        '<td>' + esc(plan.voice ? plan.voice.name + ' (' + plan.voice.lang + ')' : 'none') + '</td>' +
        '<td>' + esc(plan.text) + '</td></tr>';
    }).join('');

    return '<section class="card"><h3>Pronunciation &amp; voices</h3>' +
      '<p>The app never sends Kannada or Telugu letters to a voice that cannot read them. ' +
      'It uses the best option available on this device, in this order:</p>' +
      '<ol class="help">' +
        '<li><strong>Native voice</strong> (<code>kn-IN</code> / <code>te-IN</code>) - correct pronunciation.</li>' +
        '<li><strong>Indian voice with transliteration</strong> - the word is rewritten in Devanagari and read by a Hindi/Marathi voice. Indian sounds, close but not native.</li>' +
        '<li><strong>English voice, approximate</strong> - a respelled pronunciation. Use the written form as the real reference.</li>' +
      '</ol>' +
      '<div class="table-wrap"><table><thead><tr><th>Language</th><th>Native locale</th><th>Quality now</th><th>Voice</th><th>Text actually spoken</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<h3>Get real native pronunciation</h3>' +
      '<ol class="help">' +
        '<li><strong>Easiest: open this app in Microsoft Edge.</strong> Edge ships online neural voices for Kannada (<code>kn-IN</code>) and Telugu (<code>te-IN</code>) - no install needed, just an internet connection.</li>' +
        '<li><strong>Windows:</strong> Settings &rarr; Time &amp; language &rarr; Language &amp; region &rarr; <em>Add a language</em> &rarr; Kannada / Telugu, and tick <em>Text-to-speech</em> in the optional features. Restart the browser afterwards.</li>' +
        '<li><strong>Android:</strong> Settings &rarr; Accessibility &rarr; Text-to-speech &rarr; Google Speech Services &rarr; Install voice data &rarr; Kannada / Telugu. Then use Chrome.</li>' +
        '<li><strong>iOS/macOS:</strong> Settings &rarr; Accessibility &rarr; Spoken Content &rarr; Voices - Kannada and Telugu are not offered by Apple, so use Edge or Chrome on another device for listening.</li>' +
      '</ol>' +
      '<p class="muted small">Voices detected right now: ' + Speech.voices().length + '. ' +
      'If you just installed one, click Refresh.</p>' +
      langIds.map(voicePicker).join('') +
      '<details class="diag"><summary>All voices this browser reports (' + Speech.voices().length + ')</summary>' +
        (Speech.voices().length
          ? '<ul class="diag-list">' + Speech.voices().map(function (v) {
              var tag = langIds.filter(function (id) {
                return Speech.nativeVoices(PACKS[id]).indexOf(v) !== -1;
              }).map(function (id) { return PACKS[id].name; }).join(', ');
              return '<li><code>' + esc(v.lang || '?') + '</code> ' + esc(v.name) +
                (v.localService ? '' : ' <small>(online)</small>') +
                (tag ? ' <span class="good-text">native for ' + esc(tag) + '</span>' : '') + '</li>';
            }).join('') + '</ul>'
          : '<p class="muted">None. The browser exposes no speech voices at all.</p>') +
        '<p class="muted small">Nothing here for Kannada or Telugu means the voice is not installed ' +
        'in the operating system - the app cannot create one. Edge supplies them online; Windows and ' +
        'Android supply them after installing the language\'s text-to-speech data.</p>' +
      '</details>' +
      '<div class="row-actions">' +
        '<button type="button" class="btn" data-refresh-voices="1">Refresh voice list</button>' +
        '<button type="button" class="btn" data-test-voice="kannada">Test Kannada</button>' +
        '<button type="button" class="btn" data-test-voice="telugu">Test Telugu</button>' +
        '<button type="button" class="btn primary" data-nav="home">Back to home</button>' +
      '</div></section>';
  }

  function helpView() {
    return '<section class="card"><h3>How this app works</h3>' +
      '<ol class="help">' +
        '<li><strong>Same format for every language.</strong> 6 levels, 3 chapters each, 6 words + 4 phrases per chapter. Kannada and Telugu use identical chapter goals, so you can learn both in parallel.</li>' +
        '<li><strong>Listen, repeat, check.</strong> In a chapter you hear each item, repeat it, and the mic tells you how close you were.</li>' +
        '<li><strong>Speak the assessment.</strong> The test gives you the English meaning and the pronunciation; you must say the word in the language. 3 tries per item: 100 marks on the first try, 80 on the second, 60 on the third.</li>' +
        '<li><strong>' + C.passMark + '% is the pass mark, and you must pass the same assessment ' + C.requiredPasses + ' times.</strong> Only then does the next chapter unlock. Below ' + C.passMark + '% the attempt does not count and you get a repeat-practice list.</li>' +
        '<li><strong>Every attempt is recorded</strong> with the date, score, retries and what the mic heard for each item. Export it as CSV or JSON any time. Learner details and attempts are also kept in a separate on-device database (IndexedDB <code>learn-bhasha-users</code>).</li>' +
      '</ol>' +
      '<h3>Microphone notes</h3>' +
      '<ul class="help">' +
        '<li>Chrome or Edge give the best Kannada/Telugu recognition. Safari and Firefox fall back to typed answers.</li>' +
        '<li>On a phone, keep the mic 20-30 cm away and speak one item at a time.</li>' +
        '<li>Speech recognition needs <code>https://</code> or <code>localhost</code>. Bind an HTTPS binding in IIS before using the mic from another device.</li>' +
      '</ul>' +
      '<div class="row-actions">' +
        '<button type="button" class="btn" data-nav="voices">Pronunciation &amp; voices</button>' +
        '<button type="button" class="btn primary" data-nav="home">Back to home</button>' +
      '</div></section>';
  }

  /* ---------------------------------------------------------- rendering */

  function render() {
    var html;
    switch (view.name) {
      case 'levels': html = levelsView(); break;
      case 'chapter': html = chapterView(); break;
      case 'assessment': html = assessmentView(); break;
      case 'result': html = resultView(); break;
      case 'records': html = recordsView(); break;
      case 'voices': html = voicesView(); break;
      case 'help': html = helpView(); break;
      default: html = homeView();
    }
    app.innerHTML = html;
    afterRender();
  }

  function afterRender() {
    if (view.name === 'assessment') {
      var typed = document.getElementById('typedAnswer');
      if (typed) {
        typed.focus();
        typed.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') submitTyped();
        });
      }
    }
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function submitTyped() {
    var input = document.getElementById('typedAnswer');
    if (!input || !input.value.trim() || view.session.locked) return;
    judge([input.value.trim()]);
  }

  function runMic() {
    if (view.session.locked) return;
    var btn = document.getElementById('micBtn');
    var fb = document.getElementById('feedback');
    var p = pack(view.langId);
    btn.classList.add('listening');
    btn.disabled = true;
    fb.className = 'feedback';
    fb.textContent = 'Listening...';
    Speech.listen(p.speechLang, { timeoutMs: 8000 })
      .then(function (res) { judge(res.transcripts); })
      .catch(function (err) {
        fb.className = 'feedback warn';
        fb.textContent = err.message;
      })
      .then(function () {
        var b = document.getElementById('micBtn');
        if (b) {
          b.classList.remove('listening');
          b.disabled = view.session.locked;
        }
      });
  }

  /* --------------------------------------------------------- listeners */

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-nav],[data-lang],[data-chapter],[data-start],[data-say],[data-slow],[data-try],[data-playall],[data-export],[data-clear],[data-repeat],[data-refresh-voices],[data-test-voice],#micBtn,#typedSubmit,#hintBtn,#brandBtn');
    if (!t) return;

    if (t.id === 'brandBtn') return go('home');
    if (t.id === 'micBtn') return runMic();
    if (t.id === 'typedSubmit') return submitTyped();
    if (t.id === 'hintBtn') {
      var entry = currentEntry();
      var plan = Speech.speakItem(entry.item, pack(view.langId), 0.7);
      if (plan.quality !== 'native') {
        var fb = document.getElementById('feedback');
        fb.className = 'feedback warn';
        fb.innerHTML = QUALITY[plan.quality].label + ' - say it as <b>' + esc(entry.item.r) + '</b>. ' +
          '<button type="button" class="linkish" data-nav="voices">Get a native voice</button>';
      }
      return;
    }

    if (t.dataset.nav) {
      var nav = t.dataset.nav;
      if (nav === 'levels' && !view.langId) return go('home');
      if (nav === 'chapter' && !view.chapterId) return go('home');
      return go(nav);
    }

    if (t.dataset.lang) {
      var nameInput = document.getElementById('learnerName');
      if (nameInput) Store.setLearner(nameInput.value.trim());
      return go('levels', { langId: t.dataset.lang });
    }

    if (t.dataset.chapter) return go('chapter', { chapterId: t.dataset.chapter });

    if (t.dataset.start) return startAssessment();

    if (t.dataset.say != null || t.dataset.slow != null) {
      var idx = Number(t.dataset.say != null ? t.dataset.say : t.dataset.slow);
      var item = chapterItems(view.langId, view.chapterId)[idx];
      var plan = Speech.speakItem(item, pack(view.langId), t.dataset.slow != null ? 0.55 : null);
      document.getElementById('try-' + idx).innerHTML = plan.quality === 'native'
        ? '<span class="good-text">Native voice: repeat exactly what you hear.</span>'
        : '<span class="warn-text">' + QUALITY[plan.quality].label + ' - trust the written pronunciation <b>' + esc(item.r) + '</b>. ' +
          '<button type="button" class="linkish" data-nav="voices">Get a native voice</button></span>';
      return;
    }

    if (t.dataset.playall) {
      Speech.speakSequence(chapterItems(view.langId, view.chapterId), pack(view.langId));
      return;
    }

    if (t.dataset.try != null) {
      var i = Number(t.dataset.try);
      var target = chapterItems(view.langId, view.chapterId)[i];
      var box = document.getElementById('try-' + i);
      if (!Speech.recognitionSupported) {
        box.innerHTML = '<span class="warn-text">Mic checking needs Chrome or Edge. Repeat out loud, then take the assessment in typed mode.</span>';
        return;
      }
      box.innerHTML = '<span class="muted">Listening...</span>';
      Speech.listen(pack(view.langId).speechLang, { timeoutMs: 8000 })
        .then(function (res) {
          var sc = Scoring.scoreAttempt(res.transcripts, target);
          var ok = sc.similarity >= C.itemPassThreshold;
          box.innerHTML = '<span class="' + (ok ? 'good-text' : 'warn-text') + '">' +
            (ok ? 'Good - ' : 'Try again - ') + sc.percent + '% match. Heard: <em>' + esc(sc.heard) + '</em></span>';
          if (!ok) Speech.speakItem(target, pack(view.langId), 0.65);
        })
        .catch(function (err) { box.innerHTML = '<span class="warn-text">' + esc(err.message) + '</span>'; });
      return;
    }

    if (t.dataset.repeat != null) {
      var weakItems = view.lastRecord.items.filter(function (it) { return it.marks < 100; });
      var w = weakItems[Number(t.dataset.repeat)];
      Speech.speakItem(w, pack(view.langId), 0.55);
      return;
    }

    if (t.dataset.refreshVoices) {
      // Touching the synthesiser forces browsers to publish their full voice list.
      window.speechSynthesis.getVoices();
      setTimeout(render, 400);
      return;
    }

    if (t.dataset.testVoice) {
      var testPack = pack(t.dataset.testVoice);
      Speech.speakItem(chapterItems(testPack.id, 'L1C1')[0], testPack, 0.7);
      return;
    }

    if (t.dataset.export) {
      if (t.dataset.export === 'csv') download('learn-bhasha-records.csv', Store.exportCsv(), 'text/csv');
      else download('learn-bhasha-records.json', Store.exportJson(), 'application/json');
      return;
    }

    if (t.dataset.clear) {
      if (window.confirm('Delete all local progress and assessment records on this device?')) {
        Store.clearAll();
        go('records');
      }
    }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'learnerName') Store.setLearner(e.target.value.trim());
    if (e.target.id === 'trackSelect') Store.setTrack(e.target.value);
    if (e.target.dataset && e.target.dataset.voiceFor) {
      var id = e.target.dataset.voiceFor;
      Store.setVoice(id, e.target.value);
      applyVoicePreference(id);
      Speech.speakItem(chapterItems(id, 'L1C1')[0], pack(id), 0.7);
      render();
    }
  });

  /** Native locale is the default; a saved pick wins, 'auto' means let the chain decide. */
  function applyVoicePreference(langId) {
    var pref = Store.state.voice[langId];
    if (pref === 'auto') return Speech.setVoiceOverride(langId, '');
    Speech.setVoiceOverride(langId, pref || Speech.defaultVoiceURI(pack(langId)));
  }

  Object.keys(PACKS).forEach(applyVoicePreference);

  // Voices arrive asynchronously; adopt a native voice the moment it appears.
  Speech.onVoicesChanged = function () {
    Object.keys(PACKS).forEach(applyVoicePreference);
    if (view.name === 'voices' || view.name === 'home' || view.name === 'chapter') render();
  };

  render();
})();
