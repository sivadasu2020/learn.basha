/*
 * Kannada pack. Item format: [native script, roman pronunciation, English meaning]
 * Content rationale is documented in docs/CONTENT-SOURCES.md
 */
window.LANG_PACKS = window.LANG_PACKS || {};
window.LANG_PACKS.kannada = {
  id: 'kannada',
  name: 'Kannada',
  nativeName: 'ಕನ್ನಡ',
  speechLang: 'kn-IN',
  // Some engines (Android) report three-letter locales such as kan-IND.
  voiceLocales: ['kn', 'kan'],
  voiceNamePattern: /kannada/i,
  ttsFallbacks: ['kn-IN', 'hi-IN', 'en-IN'],
  script: 'Kannada',
  chapters: {
    L1C1: {
      words: [
        ['ನಮಸ್ಕಾರ', 'namaskaara', 'Hello / Greetings'],
        ['ಶುಭೋದಯ', 'shubhodaya', 'Good morning'],
        ['ಧನ್ಯವಾದ', 'dhanyavaada', 'Thank you'],
        ['ದಯವಿಟ್ಟು', 'dayavittu', 'Please'],
        ['ಕ್ಷಮಿಸಿ', 'kshamisi', 'Sorry / Excuse me'],
        ['ಸ್ವಾಗತ', 'swaagata', 'Welcome']
      ],
      phrases: [
        ['ಹೇಗಿದ್ದೀರಾ', 'hegiddeeraa', 'How are you?'],
        ['ಚೆನ್ನಾಗಿದ್ದೇನೆ', 'chennaagiddene', 'I am fine'],
        ['ಬರುತ್ತೇನೆ', 'baruttene', 'Goodbye (I will come back)'],
        ['ಮತ್ತೆ ಸಿಗೋಣ', 'matte sigona', 'See you again']
      ]
    },
    L1C2: {
      words: [
        ['ಹೌದು', 'haudu', 'Yes'],
        ['ಇಲ್ಲ', 'illa', 'No / Not there'],
        ['ಸರಿ', 'sari', 'Okay / Correct'],
        ['ಗೊತ್ತಿಲ್ಲ', 'gottilla', "Don't know"],
        ['ಬೇಕು', 'beku', 'Want / Need'],
        ['ಬೇಡ', 'beda', "Don't want"]
      ],
      phrases: [
        ['ನನಗೆ ಗೊತ್ತಿಲ್ಲ', 'nanage gottilla', "I don't know"],
        ['ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ', 'nanage arthavaagalilla', "I didn't understand"],
        ['ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಹೇಳಿ', 'swalpa nidhaanavaagi heli', 'Please say it slowly'],
        ['ಇನ್ನೊಮ್ಮೆ ಹೇಳಿ', 'innomme heli', 'Say it once more']
      ]
    },
    L1C3: {
      words: [
        ['ಹೆಸರು', 'hesaru', 'Name'],
        ['ಊರು', 'ooru', 'Town / Native place'],
        ['ಕೆಲಸ', 'kelasa', 'Work / Job'],
        ['ಭಾಷೆ', 'bhaashe', 'Language'],
        ['ಸ್ನೇಹಿತ', 'snehita', 'Friend'],
        ['ವಯಸ್ಸು', 'vayassu', 'Age']
      ],
      phrases: [
        ['ನಿಮ್ಮ ಹೆಸರೇನು', 'nimma hesarenu', 'What is your name?'],
        ['ನನ್ನ ಹೆಸರು ರವಿ', 'nanna hesaru ravi', 'My name is Ravi'],
        ['ನೀವು ಎಲ್ಲಿಂದ ಬಂದಿದ್ದೀರಿ', 'neevu ellinda bandiddeeri', 'Where have you come from?'],
        ['ನಾನು ಬೆಂಗಳೂರಿನಿಂದ ಬಂದಿದ್ದೇನೆ', 'naanu bengalurininda bandiddene', 'I have come from Bengaluru']
      ]
    },
    L2C1: {
      words: [
        ['ನಾನು', 'naanu', 'I'],
        ['ನೀವು', 'neevu', 'You (polite)'],
        ['ಅವನು', 'avanu', 'He'],
        ['ಅವಳು', 'avalu', 'She'],
        ['ನಾವು', 'naavu', 'We'],
        ['ಅವರು', 'avaru', 'They / He-She (respect)']
      ],
      phrases: [
        ['ನಾನು ವಿದ್ಯಾರ್ಥಿ', 'naanu vidyaarthi', 'I am a student'],
        ['ನೀವು ಶಿಕ್ಷಕರೇ', 'neevu shikshakare', 'Are you a teacher?'],
        ['ಅವನು ನನ್ನ ಸ್ನೇಹಿತ', 'avanu nanna snehita', 'He is my friend'],
        ['ಇದು ನನ್ನದು', 'idu nannadu', 'This is mine']
      ]
    },
    L2C2: {
      words: [
        ['ಅಪ್ಪ', 'appa', 'Father'],
        ['ಅಮ್ಮ', 'amma', 'Mother'],
        ['ಅಣ್ಣ', 'anna', 'Elder brother'],
        ['ಅಕ್ಕ', 'akka', 'Elder sister'],
        ['ಮಗ', 'maga', 'Son'],
        ['ಮಗಳು', 'magalu', 'Daughter']
      ],
      phrases: [
        ['ಇದು ನನ್ನ ಕುಟುಂಬ', 'idu nanna kutumba', 'This is my family'],
        ['ನನಗೆ ಒಬ್ಬ ತಮ್ಮ ಇದ್ದಾನೆ', 'nanage obba tamma iddaane', 'I have a younger brother'],
        ['ನಮ್ಮ ಮನೆ ಇಲ್ಲಿದೆ', 'namma mane illide', 'Our house is here'],
        ['ನಿಮ್ಮ ಕುಟುಂಬ ಹೇಗಿದೆ', 'nimma kutumba hegide', 'How is your family?']
      ]
    },
    L2C3: {
      words: [
        ['ಒಳ್ಳೆಯದು', 'olleyadu', 'Good'],
        ['ಕೆಟ್ಟದು', 'kettadu', 'Bad'],
        ['ದೊಡ್ಡ', 'dodda', 'Big'],
        ['ಸಣ್ಣ', 'sanna', 'Small'],
        ['ಹೊಸ', 'hosa', 'New'],
        ['ಹಳೆಯ', 'haleya', 'Old']
      ],
      phrases: [
        ['ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ', 'naanu chennaagiddene', 'I am doing well'],
        ['ಇದು ತುಂಬಾ ಒಳ್ಳೆಯದು', 'idu tumbaa olleyadu', 'This is very good'],
        ['ಅದು ದೊಡ್ಡದಾಗಿದೆ', 'adu doddadaagide', 'That is big'],
        ['ನನಗೆ ಇದು ಇಷ್ಟ', 'nanage idu ishta', 'I like this']
      ]
    },
    L3C1: {
      words: [
        ['ಒಂದು', 'ondu', 'One'],
        ['ಎರಡು', 'eradu', 'Two'],
        ['ಮೂರು', 'mooru', 'Three'],
        ['ನಾಲ್ಕು', 'naalku', 'Four'],
        ['ಐದು', 'aidu', 'Five'],
        ['ಆರು', 'aaru', 'Six']
      ],
      phrases: [
        ['ಏಳು ಎಂಟು ಒಂಬತ್ತು ಹತ್ತು', 'elu entu ombattu hattu', 'Seven eight nine ten'],
        ['ನನಗೆ ಎರಡು ಬೇಕು', 'nanage eradu beku', 'I need two'],
        ['ಎಷ್ಟು ಜನ', 'eshtu jana', 'How many people?'],
        ['ಹತ್ತು ರೂಪಾಯಿ', 'hattu roopaayi', 'Ten rupees']
      ]
    },
    L3C2: {
      words: [
        ['ಈಗ', 'eega', 'Now'],
        ['ಇವತ್ತು', 'ivattu', 'Today'],
        ['ನಾಳೆ', 'naale', 'Tomorrow'],
        ['ನಿನ್ನೆ', 'ninne', 'Yesterday'],
        ['ಬೆಳಗ್ಗೆ', 'belagge', 'Morning'],
        ['ರಾತ್ರಿ', 'raatri', 'Night']
      ],
      phrases: [
        ['ಈಗ ಸಮಯ ಎಷ್ಟು', 'eega samaya eshtu', 'What is the time now?'],
        ['ನಾಳೆ ಸಿಗೋಣ', 'naale sigona', 'Let us meet tomorrow'],
        ['ಸ್ವಲ್ಪ ಸಮಯ ಬೇಕು', 'swalpa samaya beku', 'I need some time'],
        ['ನಾನು ಬೆಳಗ್ಗೆ ಬರುತ್ತೇನೆ', 'naanu belagge baruttene', 'I will come in the morning']
      ]
    },
    L3C3: {
      words: [
        ['ದುಡ್ಡು', 'duddu', 'Money'],
        ['ಬೆಲೆ', 'bele', 'Price'],
        ['ಕಡಿಮೆ', 'kadime', 'Less'],
        ['ಜಾಸ್ತಿ', 'jaasti', 'More'],
        ['ಅಂಗಡಿ', 'angadi', 'Shop'],
        ['ಚಿಲ್ಲರೆ', 'chillare', 'Change (coins)']
      ],
      phrases: [
        ['ಇದು ಎಷ್ಟು', 'idu eshtu', 'How much is this?'],
        ['ತುಂಬಾ ದುಬಾರಿ', 'tumbaa dubaari', 'Too expensive'],
        ['ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', 'swalpa kadime maadi', 'Reduce it a little'],
        ['ನನಗೆ ಇದು ಬೇಕು', 'nanage idu beku', 'I want this']
      ]
    },
    L4C1: {
      words: [
        ['ನೀರು', 'neeru', 'Water'],
        ['ಊಟ', 'oota', 'Meal'],
        ['ತಿಂಡಿ', 'tindi', 'Breakfast / Snack'],
        ['ಹಾಲು', 'haalu', 'Milk'],
        ['ಅನ್ನ', 'anna', 'Rice'],
        ['ಹಸಿವು', 'hasivu', 'Hunger']
      ],
      phrases: [
        ['ನನಗೆ ಹಸಿವಾಗಿದೆ', 'nanage hasivaagide', 'I am hungry'],
        ['ಒಂದು ಲೋಟ ನೀರು ಕೊಡಿ', 'ondu lota neeru kodi', 'Give one glass of water'],
        ['ಊಟ ಆಯಿತಾ', 'oota aayitaa', 'Have you eaten?'],
        ['ತುಂಬಾ ರುಚಿಯಾಗಿದೆ', 'tumbaa ruchiyaagide', 'It is very tasty']
      ]
    },
    L4C2: {
      words: [
        ['ಎಡ', 'eda', 'Left'],
        ['ಬಲ', 'bala', 'Right'],
        ['ನೇರ', 'nera', 'Straight'],
        ['ಹತ್ತಿರ', 'hattira', 'Near'],
        ['ದೂರ', 'doora', 'Far'],
        ['ಮನೆ', 'mane', 'House']
      ],
      phrases: [
        ['ಇದು ಎಲ್ಲಿದೆ', 'idu ellide', 'Where is this?'],
        ['ಎಡಕ್ಕೆ ಹೋಗಿ', 'edakke hogi', 'Go to the left'],
        ['ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ', 'illi nillisi', 'Stop here'],
        ['ಎಷ್ಟು ದೂರ', 'eshtu doora', 'How far?']
      ]
    },
    L4C3: {
      words: [
        ['ಸಹಾಯ', 'sahaaya', 'Help'],
        ['ಆಸ್ಪತ್ರೆ', 'aaspatre', 'Hospital'],
        ['ಔಷಧಿ', 'aushadhi', 'Medicine'],
        ['ಪೊಲೀಸ್', 'polees', 'Police'],
        ['ಸಮಸ್ಯೆ', 'samasye', 'Problem'],
        ['ದಾರಿ', 'daari', 'Way / Road']
      ],
      phrases: [
        ['ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡಿ', 'swalpa sahaaya maadi', 'Please help me a little'],
        ['ನನಗೆ ಹುಷಾರಿಲ್ಲ', 'nanage hushaarilla', 'I am not well'],
        ['ದಾರಿ ತಪ್ಪಿದೆ', 'daari tappide', 'I have lost the way'],
        ['ದಯವಿಟ್ಟು ಬೇಗ ಬನ್ನಿ', 'dayavittu bega banni', 'Please come quickly']
      ]
    },
    L5C1: {
      words: [
        ['ಬಾ', 'baa', 'Come'],
        ['ಹೋಗು', 'hogu', 'Go'],
        ['ತಿನ್ನು', 'tinnu', 'Eat'],
        ['ಕುಡಿ', 'kudi', 'Drink'],
        ['ಕೊಡು', 'kodu', 'Give'],
        ['ನೋಡು', 'nodu', 'See / Look']
      ],
      phrases: [
        ['ನಾನು ಹೋಗುತ್ತೇನೆ', 'naanu hoguttene', 'I will go'],
        ['ನೀವು ಬರುತ್ತೀರಾ', 'neevu baruttiraa', 'Will you come?'],
        ['ನಾನು ಊಟ ಮಾಡುತ್ತೇನೆ', 'naanu oota maaduttene', 'I will eat'],
        ['ಅವನು ನೋಡುತ್ತಾನೆ', 'avanu noduttaane', 'He looks / He will see']
      ]
    },
    L5C2: {
      words: [
        ['ಬನ್ನಿ', 'banni', 'Come (polite)'],
        ['ಹೋಗಿ', 'hogi', 'Go (polite)'],
        ['ಕೊಡಿ', 'kodi', 'Give (polite)'],
        ['ಹೇಳಿ', 'heli', 'Say (polite)'],
        ['ಮಾಡಿ', 'maadi', 'Do (polite)'],
        ['ಕುಳಿತುಕೊಳ್ಳಿ', 'kulitukolli', 'Please sit']
      ],
      phrases: [
        ['ದಯವಿಟ್ಟು ಒಳಗೆ ಬನ್ನಿ', 'dayavittu olage banni', 'Please come inside'],
        ['ಸ್ವಲ್ಪ ನೀರು ಕೊಡಿ', 'swalpa neeru kodi', 'Please give some water'],
        ['ನನಗೆ ಹೇಳಿ', 'nanage heli', 'Please tell me'],
        ['ಇಲ್ಲಿ ಕುಳಿತುಕೊಳ್ಳಿ', 'illi kulitukolli', 'Please sit here']
      ]
    },
    L5C3: {
      words: [
        ['ಏನು', 'enu', 'What'],
        ['ಎಲ್ಲಿ', 'elli', 'Where'],
        ['ಯಾರು', 'yaaru', 'Who'],
        ['ಯಾವಾಗ', 'yaavaaga', 'When'],
        ['ಏಕೆ', 'eke', 'Why'],
        ['ಹೇಗೆ', 'hege', 'How']
      ],
      phrases: [
        ['ಇದು ಏನು', 'idu enu', 'What is this?'],
        ['ನೀವು ಎಲ್ಲಿ ಇದ್ದೀರಿ', 'neevu elli iddeeri', 'Where are you?'],
        ['ನನಗೆ ಕನ್ನಡ ಬರುವುದಿಲ್ಲ', 'nanage kannada baruvudilla', "I don't know Kannada"],
        ['ಅದು ಸರಿಯಿಲ್ಲ', 'adu sariyilla', 'That is not correct']
      ]
    },
    L6C1: {
      words: [
        ['ಆಟೋ', 'auto', 'Auto rickshaw'],
        ['ಬಸ್', 'bus', 'Bus'],
        ['ನಿಲ್ದಾಣ', 'nildaana', 'Station / Stop'],
        ['ಟಿಕೆಟ್', 'ticket', 'Ticket'],
        ['ರಸ್ತೆ', 'raste', 'Road'],
        ['ಬೇಗ', 'bega', 'Quickly']
      ],
      phrases: [
        ['ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗೋಣ', 'nildaanakke hogona', 'Let us go to the station'],
        ['ಎಷ್ಟು ಆಗುತ್ತದೆ', 'eshtu aaguttade', 'How much will it be?'],
        ['ಮೀಟರ್ ಹಾಕಿ', 'meter haaki', 'Put the meter on'],
        ['ಇಲ್ಲಿ ಎಡಕ್ಕೆ ತಿರುಗಿ', 'illi edakke tirugi', 'Turn left here']
      ]
    },
    L6C2: {
      words: [
        ['ಹೋಟೆಲ್', 'hotel', 'Restaurant / Hotel'],
        ['ಬಿಸಿ', 'bisi', 'Hot'],
        ['ಸಿಹಿ', 'sihi', 'Sweet'],
        ['ಖಾರ', 'khaara', 'Spicy'],
        ['ಬಿಲ್', 'bill', 'Bill'],
        ['ಕಾಫಿ', 'kaafi', 'Coffee']
      ],
      phrases: [
        ['ಒಂದು ಕಾಫಿ ಕೊಡಿ', 'ondu kaafi kodi', 'Give me one coffee'],
        ['ಬಿಲ್ ಕೊಡಿ', 'bill kodi', 'Please give the bill'],
        ['ಸ್ವಲ್ಪ ಬಿಸಿ ಮಾಡಿ', 'swalpa bisi maadi', 'Please heat it a little'],
        ['ತುಂಬಾ ಖಾರ ಬೇಡ', 'tumbaa khaara beda', 'Not too spicy please']
      ]
    },
    L6C3: {
      words: [
        ['ಹವಾಮಾನ', 'havaamaana', 'Weather'],
        ['ಮಳೆ', 'male', 'Rain'],
        ['ಬಿಸಿಲು', 'bisilu', 'Sunshine'],
        ['ಕೆಲಸ', 'kelasa', 'Work'],
        ['ಸಿನಿಮಾ', 'cinema', 'Movie'],
        ['ಆಟ', 'aata', 'Game']
      ],
      phrases: [
        ['ಇವತ್ತು ಮಳೆ ಬರುತ್ತದೆ', 'ivattu male baruttade', 'It will rain today'],
        ['ನಿಮ್ಮ ಕೆಲಸ ಹೇಗಿದೆ', 'nimma kelasa hegide', 'How is your work?'],
        ['ನನಗೆ ಸಿನಿಮಾ ಇಷ್ಟ', 'nanage cinema ishta', 'I like movies'],
        ['ಮತ್ತೆ ಮಾತಾಡೋಣ', 'matte maataadona', 'Let us talk again']
      ]
    }
  }
};
