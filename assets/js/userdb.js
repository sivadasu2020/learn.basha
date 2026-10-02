/* Learner profiles + attempt history in a dedicated IndexedDB database (separate from localStorage progress). */
(function () {
  'use strict';

  var DB_NAME = 'learn-bhasha-users';
  var DB_VERSION = 1;
  var dbPromise = null;

  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error('IndexedDB is not available.'));
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('users')) {
          var users = db.createObjectStore('users', { keyPath: 'id' });
          users.createIndex('nameKey', 'nameKey', { unique: true });
        }
        if (!db.objectStoreNames.contains('attempts')) {
          var attempts = db.createObjectStore('attempts', { keyPath: 'id' });
          attempts.createIndex('userId', 'userId');
          attempts.createIndex('chapterKey', 'chapterKey');
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return dbPromise;
  }

  function nameKey(name) { return String(name || 'Learner').trim().toLowerCase(); }

  function done(tx) {
    return new Promise(function (resolve, reject) {
      tx.oncomplete = function () { resolve(); };
      tx.onerror = tx.onabort = function () { reject(tx.error); };
    });
  }

  /** Find or create the user row inside an open transaction, then hand it to `mutate`. */
  function withUser(tx, name, mutate) {
    var store = tx.objectStore('users');
    var now = new Date().toISOString();
    var req = store.index('nameKey').get(nameKey(name));
    req.onsuccess = function () {
      var user = req.result || {
        id: 'U' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        nameKey: nameKey(name),
        createdAt: now,
        attempts: 0,
        passes: 0,
        languages: []
      };
      user.name = String(name || 'Learner').trim();
      user.lastSeenAt = now;
      user.device = { userAgent: navigator.userAgent, language: navigator.language };
      if (mutate) mutate(user);
      store.put(user);
    };
  }

  function warn(e) { console.warn('UserDB:', e); }

  var UserDB = {
    upsertUser: function (name) {
      return open().then(function (db) {
        var tx = db.transaction('users', 'readwrite');
        withUser(tx, name);
        return done(tx);
      }).catch(warn);
    },

    saveAttempt: function (record) {
      return open().then(function (db) {
        var tx = db.transaction(['users', 'attempts'], 'readwrite');
        withUser(tx, record.learner, function (user) {
          user.attempts += 1;
          if (record.passed) user.passes += 1;
          if (user.languages.indexOf(record.langId) === -1) user.languages.push(record.langId);
          tx.objectStore('attempts').put(Object.assign({}, record, {
            userId: user.id,
            chapterKey: record.langId + '::' + record.chapterId
          }));
        });
        return done(tx);
      }).catch(warn);
    },

    getUsers: function () {
      return open().then(function (db) {
        return new Promise(function (resolve, reject) {
          var req = db.transaction('users').objectStore('users').getAll();
          req.onsuccess = function () { resolve(req.result); };
          req.onerror = function () { reject(req.error); };
        });
      });
    },

    getAttempts: function (userId) {
      return open().then(function (db) {
        return new Promise(function (resolve, reject) {
          var store = db.transaction('attempts').objectStore('attempts');
          var req = userId ? store.index('userId').getAll(userId) : store.getAll();
          req.onsuccess = function () { resolve(req.result); };
          req.onerror = function () { reject(req.error); };
        });
      });
    }
  };

  window.UserDB = UserDB;
})();
