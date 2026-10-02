/*
 * Shared curriculum skeleton.
 * EVERY language pack must fill exactly these levels/chapters, so Kannada,
 * Telugu (and any future language) are learned in an identical format.
 */
window.CURRICULUM = {
  // Minimum score (%) for a single assessment attempt to count as a pass.
  passMark: 80,
  // Passed attempts of the same assessment needed before the next chapter unlocks.
  requiredPasses: 3,
  // Per-item similarity needed before the spoken attempt counts as correct.
  itemPassThreshold: 0.8,
  wordsPerChapter: 6,
  phrasesPerChapter: 4,
  levels: [
    {
      id: 'L1',
      trackId: 'beginner',
      title: 'Level 1 - Survival Basics',
      goal: 'Say hello, be polite and keep a conversation alive without knowing grammar.',
      chapters: [
        { id: 'L1C1', title: 'Greetings & Courtesy', focus: 'The 10 words you will use every single day.' },
        { id: 'L1C2', title: 'Yes, No & Simple Answers', focus: 'React to anything even when you understand only half of it.' },
        { id: 'L1C3', title: 'First Meeting', focus: 'Introduce yourself and ask who the other person is.' }
      ]
    },
    {
      id: 'L2',
      trackId: 'beginner',
      title: 'Level 2 - People & Self',
      goal: 'Talk about yourself, your people and describe things with simple adjectives.',
      chapters: [
        { id: 'L2C1', title: 'Pronouns', focus: 'I / you / he / she / we / they - the frame of every sentence.' },
        { id: 'L2C2', title: 'Family', focus: 'Family words open almost every Indian conversation.' },
        { id: 'L2C3', title: 'Describing Things', focus: 'Good, bad, big, small - instant opinions.' }
      ]
    },
    {
      id: 'L3',
      trackId: 'intermediate',
      title: 'Level 3 - Numbers, Time & Money',
      goal: 'Handle prices, counts and appointments out loud.',
      chapters: [
        { id: 'L3C1', title: 'Numbers 1-10', focus: 'Counting is needed before any shop or auto ride.' },
        { id: 'L3C2', title: 'Time Words', focus: 'Now, today, tomorrow, morning, night.' },
        { id: 'L3C3', title: 'Shopping & Money', focus: 'Ask a price and negotiate.' }
      ]
    },
    {
      id: 'L4',
      trackId: 'intermediate',
      title: 'Level 4 - Everyday Needs',
      goal: 'Get food, find places and ask for help.',
      chapters: [
        { id: 'L4C1', title: 'Food & Drink', focus: 'Order, accept and compliment food.' },
        { id: 'L4C2', title: 'Places & Directions', focus: 'Left, right, near, far, stop here.' },
        { id: 'L4C3', title: 'Asking for Help', focus: 'Emergency and problem vocabulary.' }
      ]
    },
    {
      id: 'L5',
      trackId: 'expert',
      title: 'Level 5 - Action Verbs',
      goal: 'Make requests and ask questions - the core of speaking.',
      chapters: [
        { id: 'L5C1', title: 'Core Verbs', focus: 'Come, go, eat, drink, give, see.' },
        { id: 'L5C2', title: 'Polite Requests', focus: 'The polite verb form locals expect from adults.' },
        { id: 'L5C3', title: 'Questions & Negatives', focus: 'What, where, who, when, why, how + saying "I cannot".' }
      ]
    },
    {
      id: 'L6',
      trackId: 'expert',
      title: 'Level 6 - Real Conversation',
      goal: 'Survive a full day: travel, shop, eat and make small talk.',
      chapters: [
        { id: 'L6C1', title: 'Auto, Bus & Travel', focus: 'Get from A to B and agree on a fare.' },
        { id: 'L6C2', title: 'Shop & Hotel', focus: 'Order, adjust and pay.' },
        { id: 'L6C3', title: 'Small Talk', focus: 'Weather, work, movies - keep talking.' }
      ]
    }
  ]
};

window.CURRICULUM.tracks = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Start with greetings, useful words and short everyday replies.',
    defaultChapterId: 'L1C1',
    itemMode: 'words-first'
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Build confidence with practical sentences, requests and questions.',
    defaultChapterId: 'L3C1',
    itemMode: 'sentences-first'
  },
  {
    id: 'expert',
    title: 'Expert',
    description: 'Start with real conversations, then keep improving across the full course.',
    defaultChapterId: 'L6C3',
    itemMode: 'conversation-first'
  }
];

window.CURRICULUM.track = function (id) {
  return window.CURRICULUM.tracks.find(function (track) { return track.id === id; }) || window.CURRICULUM.tracks[0];
};

window.CURRICULUM.allChapters = window.CURRICULUM.levels.flatMap(function (lvl) {
  return lvl.chapters.map(function (ch) {
    return Object.assign({ levelId: lvl.id, levelTitle: lvl.title }, ch);
  });
});
