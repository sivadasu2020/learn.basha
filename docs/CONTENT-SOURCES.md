# Why this content was chosen

This is the justification you asked for: every word and phrase in the app was picked against
published, evidence-based criteria for **spoken** beginner ability - not from a random word list.

## 1. Selection principles (the "why")

| Principle | Source of the idea | How it shaped the content |
|---|---|---|
| **High-frequency core vocabulary first** | Zipf's law / lexical frequency research: ~1,000 most frequent words cover roughly 80% of everyday conversation (Nation, *Learning Vocabulary in Another Language*). | Levels 1-3 are only greetings, pronouns, numbers, time, money - the items that repeat in almost every exchange. |
| **Survival / "can-do" functions before grammar** | CEFR A1 descriptors (Council of Europe) are written as spoken *can-do* statements: greet, introduce, ask and answer simple personal questions, ask prices, ask for things. | Each chapter maps to one A1 can-do statement (chapter `focus` line in [assets/js/curriculum.js](../assets/js/curriculum.js)). |
| **Survival phrasebook coverage** | Peace Corps and Defense Language Institute survival-language courses, and traveller phrasebook structure (greetings, numbers, food, directions, emergencies, transport). | Levels 4-6 mirror exactly those categories: food, directions, help, travel, shop, small talk. |
| **Chunks, not rules** | Lexical Approach (Michael Lewis) and formulaic-language research: fluent beginners rely on memorised chunks such as *"how much is this?"*. | Every chapter has 4 whole sentences learned as fixed chunks. No grammar tables anywhere. |
| **Spaced repetition + production** | Testing effect / retrieval practice (Roediger & Karpicke) - recall beats re-reading. | Items are shuffled at test time and must be *produced aloud*, never recognised from a multiple choice. |
| **Mastery learning, 100% pass** | Bloom's mastery-learning model: proceed only after full mastery of the prerequisite. | Next chapter unlocks only at 100%; failed items go into a forced repeat list. |
| **Polite register for adults** | Sociolinguistic norm in Kannada/Telugu: adults use the plural-polite form with strangers. | Level 5 teaches `ಬನ್ನಿ / రండి` style polite imperatives explicitly, not only the familiar forms. |

## 2. Why Kannada and Telugu share one identical syllabus

Both are Dravidian languages with the same word order (Subject-Object-Verb), the same
postposition system, the same polite-plural register and near-identical everyday discourse
(the same greetings, the same auto-rickshaw conversation, the same shop conversation).
That makes a **single chapter skeleton valid for both**, so:

- a learner can do Kannada Level 1 and Telugu Level 1 back-to-back and compare directly,
- adding a third language only means adding one more file with the same 18 chapter keys.

The skeleton is defined once in [assets/js/curriculum.js](../assets/js/curriculum.js);
the language packs
([lang-kannada.js](../assets/js/lang-kannada.js), [lang-telugu.js](../assets/js/lang-telugu.js))
only fill the same keys.

## 3. Why these exact 180 items

- **6 words + 4 phrases per chapter = 10 items.** Working-memory research (Miller's 7±2, and
  Nation's recommendation of 5-12 new items per study session) says a beginner session should
  stay around 10 new items. A 10-item test also makes the maths honest: each item is worth
  exactly 10% of the chapter.
- **18 chapters x 10 items = 180 items per language.** That is deliberately close to the
  "survival kit" size used by military and Peace Corps crash courses (150-200 items), which is
  enough to handle a full day without English.
- **Nothing about writing or grammar.** You asked for speaking, so the native script is shown
  only as a pronunciation reference and is blurred during the test until your first attempt.

## 4. Why the scoring works the way it does

| Rule | Reason |
|---|---|
| Speech is captured with the browser `SpeechRecognition` API using `kn-IN` / `te-IN` | Gives a real transcript in the native script, so the judgement is on what you actually said, not self-reported. |
| Answer is compared to **both** the native script and a folded roman form | Recognisers often return a phonetic or English-ish transcript; folding (`aa`->`a`, `sh`->`s`, `v`/`w`, doubled letters) avoids failing a learner for spelling variation. |
| Similarity = normalised Levenshtein, pass at 0.8 | Tolerates one small sound slip in a short word but rejects a different word. Implemented in [assets/js/scoring.js](../assets/js/scoring.js). |
| 3 tries: 100 / 80 / 60 marks | Rewards first-attempt recall (retrieval strength) while still teaching through the repeat-after-the-voice loop. |
| Pass = every item correct **and** score 100 | Your requirement: 100% pass. Anything less keeps the chapter locked and returns a practice list. |
| Every attempt is stored with date, score, retries and what the mic heard | So progress is auditable and exportable (CSV/JSON). |

## 5. Language accuracy note

All Kannada and Telugu items are standard, everyday-spoken forms (the register you hear in
Bengaluru and Hyderabad), cross-checked against common phrasebook usage. Regional variation
exists - for example Kannada `ಇವತ್ತು / ಇಂದು` (colloquial vs formal "today") - and the colloquial
spoken form was always preferred, because the goal is speaking, not exams.
