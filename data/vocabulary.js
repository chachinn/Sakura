/*
    BEGINNER EDITING GUIDE
    Add vocabulary by copying an object. Use a unique id, one JLPT level, and
    include an example sentence plus its English translation.
*/
window.VOCABULARY_DATA = [
    { id: "vocab-n5-eat", type: "vocabulary", word: "食べる", kana: "たべる", romaji: "taberu", meaning: "to eat", jlpt: "N5", categories: ["Food", "Everyday verbs"], exampleSentence: "毎朝パンを食べます。", exampleTranslation: "I eat bread every morning.", notes: "Common ichidan verb." },
    { id: "vocab-n5-morning", type: "vocabulary", word: "朝", kana: "あさ", romaji: "asa", meaning: "morning", jlpt: "N5", exampleSentence: "朝、コーヒーを飲みます。", exampleTranslation: "I drink coffee in the morning.", notes: "Everyday noun." },
    { id: "vocab-n5-study", type: "vocabulary", word: "勉強", kana: "べんきょう", romaji: "benkyou", meaning: "study", jlpt: "N5", exampleSentence: "図書館で勉強します。", exampleTranslation: "I study at the library.", notes: "Often used with する." },
    { id: "vocab-n4-prepare", type: "vocabulary", word: "準備", kana: "じゅんび", romaji: "junbi", meaning: "preparation", jlpt: "N4", exampleSentence: "旅行の準備ができました。", exampleTranslation: "The travel preparations are ready.", notes: "準備する means to prepare." },
    { id: "vocab-n4-necessary", type: "vocabulary", word: "必要", kana: "ひつよう", romaji: "hitsuyou", meaning: "necessary; needed", jlpt: "N4", exampleSentence: "予約が必要です。", exampleTranslation: "A reservation is necessary.", notes: "な-adjective and noun." },
    { id: "vocab-n3-suddenly", type: "vocabulary", word: "突然", kana: "とつぜん", romaji: "totsuzen", meaning: "suddenly", jlpt: "N3", exampleSentence: "突然、雨が降り出しました。", exampleTranslation: "Suddenly, it started raining.", notes: "Common adverb." },
    { id: "vocab-n3-experience", type: "vocabulary", word: "経験", kana: "けいけん", romaji: "keiken", meaning: "experience", jlpt: "N3", exampleSentence: "いい経験になりました。", exampleTranslation: "It became a good experience.", notes: "経験する means to experience." },
    { id: "vocab-n2-tendency", type: "vocabulary", word: "傾向", kana: "けいこう", romaji: "keikou", meaning: "tendency; trend", jlpt: "N2", exampleSentence: "最近、その傾向が強いです。", exampleTranslation: "Recently, that tendency is strong.", notes: "Used in analytical speech and writing." },
    { id: "vocab-n2-respect", type: "vocabulary", word: "尊重", kana: "そんちょう", romaji: "sonchou", meaning: "respect; regard", jlpt: "N2", exampleSentence: "お互いの意見を尊重しましょう。", exampleTranslation: "Let us respect each other's opinions.", notes: "尊重する means to respect." },
    { id: "vocab-n1-remarkable", type: "vocabulary", word: "著しい", kana: "いちじるしい", romaji: "ichijirushii", meaning: "remarkable; striking", jlpt: "N1", exampleSentence: "技術は著しく進歩しました。", exampleTranslation: "Technology advanced remarkably.", notes: "Often used in formal contexts." },
    { id: "vocab-n1-consider", type: "vocabulary", word: "踏まえる", kana: "ふまえる", romaji: "fumaeru", meaning: "to take into account", jlpt: "N1", exampleSentence: "結果を踏まえて計画を直します。", exampleTranslation: "We will revise the plan based on the results.", notes: "Common in business and formal language." }
];

/*
    Dictionary glosses are kept for reference, while naturalMeaning is what a
    learner should understand and use in context. Extend this guide whenever a
    new entry needs extra nuance; the original data remains intact.
*/
const VOCABULARY_CONTEXT_GUIDE = {
    "vocab-n5-eat": ["to eat", "to eat", "The standard everyday verb for eating food."],
    "vocab-n5-morning": ["morning", "morning", "A common everyday noun; 朝に and 朝から are frequent patterns."],
    "vocab-n5-study": ["study", "studying; to study (勉強する)", "In conversation, use 勉強する when you mean ‘to study.’"],
    "vocab-n4-prepare": ["preparation", "preparation; to prepare (準備する)", "Use 準備する for the action of getting something ready."],
    "vocab-n4-necessary": ["necessary; needed", "necessary; needed", "Often used as 必要です or 必要がある, rather than as an isolated exclamation."],
    "vocab-n3-suddenly": ["suddenly; abrupt", "suddenly; out of nowhere", "Common before a verb, or as 急な + noun when something is unexpected."],
    "vocab-n3-experience": ["experience", "experience; to experience (経験する)", "Use 経験する for the verb and 経験がある for ‘have experience.’"],
    "vocab-n2-tendency": ["tendency; trend", "tendency; general pattern", "Common in explanations and reports as ～傾向がある."],
    "vocab-n2-respect": ["respect; regard", "respect; to respect (尊重する)", "Often used for respecting an opinion, choice, rights, or individuality."],
    "vocab-n1-remarkable": ["remarkable; striking", "marked; dramatic; remarkable", "More formal than すごい and often describes a clearly measurable change."],
    "vocab-n1-consider": ["to step on; to tread on", "to take into account; to base a decision on", "In modern formal usage, ～を踏まえて means ‘taking … into account.’ Do not translate it as physically stepping on something in this pattern."]
};

window.VOCABULARY_DATA.forEach(item => {
    const guide = VOCABULARY_CONTEXT_GUIDE[item.id];
    if (!guide) return;
    item.dictionaryMeaning = guide[0];
    item.naturalMeaning = guide[1];
    item.naturalUsageNotes = guide[2];
});
