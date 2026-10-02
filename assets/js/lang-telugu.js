/*
 * Telugu pack - identical chapter keys and item format as Kannada.
 * Item format: [native script, roman pronunciation, English meaning]
 */
window.LANG_PACKS = window.LANG_PACKS || {};
window.LANG_PACKS.telugu = {
  id: 'telugu',
  name: 'Telugu',
  nativeName: 'తెలుగు',
  speechLang: 'te-IN',
  // Some engines (Android) report three-letter locales such as tel-IND.
  voiceLocales: ['te', 'tel'],
  voiceNamePattern: /telugu/i,
  ttsFallbacks: ['te-IN', 'hi-IN', 'en-IN'],
  script: 'Telugu',
  chapters: {
    L1C1: {
      words: [
        ['నమస్కారం', 'namaskaaram', 'Hello / Greetings'],
        ['శుభోదయం', 'shubhodayam', 'Good morning'],
        ['ధన్యవాదాలు', 'dhanyavaadaalu', 'Thank you'],
        ['దయచేసి', 'dayachesi', 'Please'],
        ['క్షమించండి', 'kshaminchandi', 'Sorry / Excuse me'],
        ['స్వాగతం', 'swaagatam', 'Welcome']
      ],
      phrases: [
        ['ఎలా ఉన్నారు', 'elaa unnaaru', 'How are you?'],
        ['బాగున్నాను', 'baagunnaanu', 'I am fine'],
        ['వెళ్ళొస్తాను', 'vellostaanu', 'Goodbye (I will go and come)'],
        ['మళ్ళీ కలుద్దాం', 'mallee kaluddaam', 'See you again']
      ]
    },
    L1C2: {
      words: [
        ['అవును', 'avunu', 'Yes'],
        ['లేదు', 'ledu', 'No / Not there'],
        ['సరే', 'sare', 'Okay'],
        ['తెలియదు', 'teliyadu', "Don't know"],
        ['కావాలి', 'kaavaali', 'Want / Need'],
        ['వద్దు', 'vaddu', "Don't want"]
      ],
      phrases: [
        ['నాకు తెలియదు', 'naaku teliyadu', "I don't know"],
        ['నాకు అర్థం కాలేదు', 'naaku artham kaaledu', "I didn't understand"],
        ['కొంచెం నెమ్మదిగా చెప్పండి', 'koncham nemmadigaa cheppandi', 'Please say it slowly'],
        ['మళ్ళీ చెప్పండి', 'mallee cheppandi', 'Say it once more']
      ]
    },
    L1C3: {
      words: [
        ['పేరు', 'peru', 'Name'],
        ['ఊరు', 'ooru', 'Town / Native place'],
        ['పని', 'pani', 'Work / Job'],
        ['భాష', 'bhaasha', 'Language'],
        ['స్నేహితుడు', 'snehitudu', 'Friend'],
        ['వయసు', 'vayasu', 'Age']
      ],
      phrases: [
        ['మీ పేరు ఏమిటి', 'mee peru emiti', 'What is your name?'],
        ['నా పేరు రవి', 'naa peru ravi', 'My name is Ravi'],
        ['మీరు ఎక్కడి నుంచి వచ్చారు', 'meeru ekkadi nunchi vachchaaru', 'Where have you come from?'],
        ['నేను హైదరాబాద్ నుంచి వచ్చాను', 'nenu hyderabad nunchi vachchaanu', 'I have come from Hyderabad']
      ]
    },
    L2C1: {
      words: [
        ['నేను', 'nenu', 'I'],
        ['మీరు', 'meeru', 'You (polite)'],
        ['అతను', 'atanu', 'He'],
        ['ఆమె', 'aame', 'She'],
        ['మేము', 'memu', 'We'],
        ['వాళ్ళు', 'vaallu', 'They']
      ],
      phrases: [
        ['నేను విద్యార్థిని', 'nenu vidyaarthini', 'I am a student'],
        ['మీరు టీచరా', 'meeru teecharaa', 'Are you a teacher?'],
        ['అతను నా స్నేహితుడు', 'atanu naa snehitudu', 'He is my friend'],
        ['ఇది నాది', 'idi naadi', 'This is mine']
      ]
    },
    L2C2: {
      words: [
        ['నాన్న', 'naanna', 'Father'],
        ['అమ్మ', 'amma', 'Mother'],
        ['అన్న', 'anna', 'Elder brother'],
        ['అక్క', 'akka', 'Elder sister'],
        ['కొడుకు', 'koduku', 'Son'],
        ['కూతురు', 'kooturu', 'Daughter']
      ],
      phrases: [
        ['ఇది నా కుటుంబం', 'idi naa kutumbam', 'This is my family'],
        ['నాకు ఒక తమ్ముడు ఉన్నాడు', 'naaku oka tammudu unnaadu', 'I have a younger brother'],
        ['మా ఇల్లు ఇక్కడ ఉంది', 'maa illu ikkada undi', 'Our house is here'],
        ['మీ కుటుంబం ఎలా ఉంది', 'mee kutumbam elaa undi', 'How is your family?']
      ]
    },
    L2C3: {
      words: [
        ['మంచిది', 'manchidi', 'Good'],
        ['చెడ్డది', 'cheddadi', 'Bad'],
        ['పెద్ద', 'pedda', 'Big'],
        ['చిన్న', 'chinna', 'Small'],
        ['కొత్త', 'kotta', 'New'],
        ['పాత', 'paata', 'Old']
      ],
      phrases: [
        ['నేను బాగున్నాను', 'nenu baagunnaanu', 'I am doing well'],
        ['ఇది చాలా బాగుంది', 'idi chaalaa baagundi', 'This is very good'],
        ['అది పెద్దది', 'adi peddadi', 'That is big'],
        ['నాకు ఇది ఇష్టం', 'naaku idi ishtam', 'I like this']
      ]
    },
    L3C1: {
      words: [
        ['ఒకటి', 'okati', 'One'],
        ['రెండు', 'rendu', 'Two'],
        ['మూడు', 'moodu', 'Three'],
        ['నాలుగు', 'naalugu', 'Four'],
        ['ఐదు', 'aidu', 'Five'],
        ['ఆరు', 'aaru', 'Six']
      ],
      phrases: [
        ['ఏడు ఎనిమిది తొమ్మిది పది', 'edu enimidi tommidi padi', 'Seven eight nine ten'],
        ['నాకు రెండు కావాలి', 'naaku rendu kaavaali', 'I need two'],
        ['ఎంత మంది', 'enta mandi', 'How many people?'],
        ['పది రూపాయలు', 'padi roopaayalu', 'Ten rupees']
      ]
    },
    L3C2: {
      words: [
        ['ఇప్పుడు', 'ippudu', 'Now'],
        ['ఈరోజు', 'eeroju', 'Today'],
        ['రేపు', 'repu', 'Tomorrow'],
        ['నిన్న', 'ninna', 'Yesterday'],
        ['ఉదయం', 'udayam', 'Morning'],
        ['రాత్రి', 'raatri', 'Night']
      ],
      phrases: [
        ['ఇప్పుడు టైం ఎంత', 'ippudu time enta', 'What is the time now?'],
        ['రేపు కలుద్దాం', 'repu kaluddaam', 'Let us meet tomorrow'],
        ['కొంచెం టైం కావాలి', 'koncham time kaavaali', 'I need some time'],
        ['నేను ఉదయం వస్తాను', 'nenu udayam vastaanu', 'I will come in the morning']
      ]
    },
    L3C3: {
      words: [
        ['డబ్బు', 'dabbu', 'Money'],
        ['ధర', 'dhara', 'Price'],
        ['తక్కువ', 'takkuva', 'Less'],
        ['ఎక్కువ', 'ekkuva', 'More'],
        ['దుకాణం', 'dukaanam', 'Shop'],
        ['చిల్లర', 'chillara', 'Change (coins)']
      ],
      phrases: [
        ['ఇది ఎంత', 'idi enta', 'How much is this?'],
        ['చాలా ఖరీదు', 'chaalaa khareedu', 'Too expensive'],
        ['కొంచెం తగ్గించండి', 'koncham tagginchandi', 'Reduce it a little'],
        ['నాకు ఇది కావాలి', 'naaku idi kaavaali', 'I want this']
      ]
    },
    L4C1: {
      words: [
        ['నీళ్ళు', 'neellu', 'Water'],
        ['భోజనం', 'bhojanam', 'Meal'],
        ['టిఫిన్', 'tiffin', 'Breakfast / Snack'],
        ['పాలు', 'paalu', 'Milk'],
        ['అన్నం', 'annam', 'Rice'],
        ['ఆకలి', 'aakali', 'Hunger']
      ],
      phrases: [
        ['నాకు ఆకలిగా ఉంది', 'naaku aakaligaa undi', 'I am hungry'],
        ['ఒక గ్లాసు నీళ్ళు ఇవ్వండి', 'oka glaasu neellu ivvandi', 'Give one glass of water'],
        ['భోజనం అయిందా', 'bhojanam ayindaa', 'Have you eaten?'],
        ['చాలా రుచిగా ఉంది', 'chaalaa ruchigaa undi', 'It is very tasty']
      ]
    },
    L4C2: {
      words: [
        ['ఎడమ', 'edama', 'Left'],
        ['కుడి', 'kudi', 'Right'],
        ['నేరుగా', 'nerugaa', 'Straight'],
        ['దగ్గర', 'daggara', 'Near'],
        ['దూరం', 'dooram', 'Far'],
        ['ఇల్లు', 'illu', 'House']
      ],
      phrases: [
        ['ఇది ఎక్కడ ఉంది', 'idi ekkada undi', 'Where is this?'],
        ['ఎడమ వైపు వెళ్ళండి', 'edama vaipu vellandi', 'Go to the left'],
        ['ఇక్కడ ఆపండి', 'ikkada aapandi', 'Stop here'],
        ['ఎంత దూరం', 'enta dooram', 'How far?']
      ]
    },
    L4C3: {
      words: [
        ['సహాయం', 'sahaayam', 'Help'],
        ['ఆసుపత్రి', 'aasupatri', 'Hospital'],
        ['మందు', 'mandu', 'Medicine'],
        ['పోలీస్', 'polees', 'Police'],
        ['సమస్య', 'samasya', 'Problem'],
        ['దారి', 'daari', 'Way / Road']
      ],
      phrases: [
        ['కొంచెం సహాయం చేయండి', 'koncham sahaayam cheyandi', 'Please help me a little'],
        ['నాకు ఒంట్లో బాగోలేదు', 'naaku ontlo baagoledu', 'I am not well'],
        ['దారి తప్పాను', 'daari tappaanu', 'I have lost the way'],
        ['దయచేసి తొందరగా రండి', 'dayachesi tondaragaa randi', 'Please come quickly']
      ]
    },
    L5C1: {
      words: [
        ['రా', 'raa', 'Come'],
        ['వెళ్ళు', 'vellu', 'Go'],
        ['తిను', 'tinu', 'Eat'],
        ['తాగు', 'taagu', 'Drink'],
        ['ఇవ్వు', 'ivvu', 'Give'],
        ['చూడు', 'choodu', 'See / Look']
      ],
      phrases: [
        ['నేను వెళ్తాను', 'nenu veltaanu', 'I will go'],
        ['మీరు వస్తారా', 'meeru vastaaraa', 'Will you come?'],
        ['నేను భోజనం చేస్తాను', 'nenu bhojanam chestaanu', 'I will eat'],
        ['అతను చూస్తాడు', 'atanu choostaadu', 'He looks / He will see']
      ]
    },
    L5C2: {
      words: [
        ['రండి', 'randi', 'Come (polite)'],
        ['వెళ్ళండి', 'vellandi', 'Go (polite)'],
        ['ఇవ్వండి', 'ivvandi', 'Give (polite)'],
        ['చెప్పండి', 'cheppandi', 'Say (polite)'],
        ['చేయండి', 'cheyandi', 'Do (polite)'],
        ['కూర్చోండి', 'koorchondi', 'Please sit']
      ],
      phrases: [
        ['దయచేసి లోపలికి రండి', 'dayachesi lopaliki randi', 'Please come inside'],
        ['కొంచెం నీళ్ళు ఇవ్వండి', 'koncham neellu ivvandi', 'Please give some water'],
        ['నాకు చెప్పండి', 'naaku cheppandi', 'Please tell me'],
        ['ఇక్కడ కూర్చోండి', 'ikkada koorchondi', 'Please sit here']
      ]
    },
    L5C3: {
      words: [
        ['ఏమిటి', 'emiti', 'What'],
        ['ఎక్కడ', 'ekkada', 'Where'],
        ['ఎవరు', 'evaru', 'Who'],
        ['ఎప్పుడు', 'eppudu', 'When'],
        ['ఎందుకు', 'enduku', 'Why'],
        ['ఎలా', 'elaa', 'How']
      ],
      phrases: [
        ['ఇది ఏమిటి', 'idi emiti', 'What is this?'],
        ['మీరు ఎక్కడ ఉన్నారు', 'meeru ekkada unnaaru', 'Where are you?'],
        ['నాకు తెలుగు రాదు', 'naaku telugu raadu', "I don't know Telugu"],
        ['అది సరి కాదు', 'adi sari kaadu', 'That is not correct']
      ]
    },
    L6C1: {
      words: [
        ['ఆటో', 'auto', 'Auto rickshaw'],
        ['బస్సు', 'bassu', 'Bus'],
        ['స్టేషన్', 'station', 'Station / Stop'],
        ['టికెట్', 'ticket', 'Ticket'],
        ['రోడ్డు', 'roddu', 'Road'],
        ['తొందరగా', 'tondaragaa', 'Quickly']
      ],
      phrases: [
        ['స్టేషన్ కి వెళ్దాం', 'station ki veldaam', 'Let us go to the station'],
        ['ఎంత అవుతుంది', 'enta avutundi', 'How much will it be?'],
        ['మీటర్ వేయండి', 'meter veyandi', 'Put the meter on'],
        ['ఇక్కడ ఎడమకు తిరగండి', 'ikkada edamaku tiragandi', 'Turn left here']
      ]
    },
    L6C2: {
      words: [
        ['హోటల్', 'hotel', 'Restaurant / Hotel'],
        ['వేడి', 'vedi', 'Hot'],
        ['తీపి', 'teepi', 'Sweet'],
        ['కారం', 'kaaram', 'Spicy'],
        ['బిల్లు', 'billu', 'Bill'],
        ['కాఫీ', 'kaaphee', 'Coffee']
      ],
      phrases: [
        ['ఒక కాఫీ ఇవ్వండి', 'oka kaaphee ivvandi', 'Give me one coffee'],
        ['బిల్లు ఇవ్వండి', 'billu ivvandi', 'Please give the bill'],
        ['కొంచెం వేడి చేయండి', 'koncham vedi cheyandi', 'Please heat it a little'],
        ['చాలా కారం వద్దు', 'chaalaa kaaram vaddu', 'Not too spicy please']
      ]
    },
    L6C3: {
      words: [
        ['వాతావరణం', 'vaataavaranam', 'Weather'],
        ['వర్షం', 'varsham', 'Rain'],
        ['ఎండ', 'enda', 'Sunshine'],
        ['పని', 'pani', 'Work'],
        ['సినిమా', 'cinema', 'Movie'],
        ['ఆట', 'aata', 'Game']
      ],
      phrases: [
        ['ఈరోజు వర్షం వస్తుంది', 'eeroju varsham vastundi', 'It will rain today'],
        ['మీ పని ఎలా ఉంది', 'mee pani elaa undi', 'How is your work?'],
        ['నాకు సినిమా ఇష్టం', 'naaku cinema ishtam', 'I like movies'],
        ['మళ్ళీ మాట్లాడదాం', 'mallee maatlaadadaam', 'Let us talk again']
      ]
    }
  }
};
