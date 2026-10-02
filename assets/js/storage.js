/* Local progress + assessment record store (localStorage, works offline on any device). */
(function () {
  'use strict';

  var KEY = 'learn.bhasha.v1';

  function blank() {
    return { learner: '', track: 'beginner', records: [], progress: {}, voice: {} };
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? Object.assign(blank(), JSON.parse(raw)) : blank();
    } catch (e) {
      return blank();
    }
  }

  function write(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save progress locally.', e);
    }
  }

  var Store = {
    state: read(),

    save: function () { write(this.state); },

    setLearner: function (name) {
      this.state.learner = name;
      this.save();
      if (window.UserDB && name) window.UserDB.upsertUser(name);
    },

    setTrack: function (track) {
      this.state.track = window.CURRICULUM.track(track).id;
      this.save();
    },

    setVoice: function (langId, voiceURI) {
      this.state.voice[langId] = voiceURI;
      this.save();
    },

    progressKey: function (langId, chapterId) { return langId + '::' + chapterId; },

    /** A chapter is unlocked when the previous chapter of the same language is passed. */
    isChapterPassed: function (langId, chapterId) {
      var p = this.state.progress[this.progressKey(langId, chapterId)];
      return !!(p && p.passed);
    },

    passCount: function (langId, chapterId) {
      var p = this.state.progress[this.progressKey(langId, chapterId)];
      return p ? (p.passes || 0) : 0;
    },

    bestScore: function (langId, chapterId) {
      var p = this.state.progress[this.progressKey(langId, chapterId)];
      return p ? p.bestScore : null;
    },

    /** Persist a completed assessment attempt. */
    addRecord: function (record) {
      record.id = 'A' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
      record.learner = this.state.learner || 'Learner';
      record.at = new Date().toISOString();
      this.state.records.unshift(record);
      if (this.state.records.length > 500) this.state.records.length = 500;

      var key = this.progressKey(record.langId, record.chapterId);
      var prev = this.state.progress[key] || { attempts: 0, bestScore: 0, passed: false, passes: 0 };
      var passes = (prev.passes || 0) + (record.passed ? 1 : 0);
      this.state.progress[key] = {
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, record.score),
        passes: passes,
        passed: prev.passed || passes >= window.CURRICULUM.requiredPasses,
        lastAt: record.at
      };
      record.passNumber = record.passed ? passes : null;
      this.save();
      if (window.UserDB) window.UserDB.saveAttempt(record);
      return record;
    },

    recordsFor: function (langId) {
      return this.state.records.filter(function (r) { return !langId || r.langId === langId; });
    },

    clearAll: function () {
      this.state = blank();
      this.save();
    },

    exportJson: function () {
      return JSON.stringify(this.state, null, 2);
    },

    exportCsv: function () {
      var head = 'Date,Learner,Language,Level,Chapter,Score %,Result,Items,Items Correct,Retries\n';
      var rows = this.state.records.map(function (r) {
        return [
          r.at, JSON.stringify(r.learner), r.langName, r.levelId, JSON.stringify(r.chapterTitle),
          r.score, r.passed ? 'PASS' : 'FAIL', r.total, r.correct, r.retries
        ].join(',');
      });
      return head + rows.join('\n');
    }
  };

  window.Store = Store;
})();
