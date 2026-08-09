/* =====================================================
   Sakura — mobile Japanese-learning PWA
   Plain JavaScript, local data with optional API enhancement
===================================================== */

const STORAGE = {
    saved: "chaSavedLearningItems",
    statuses: "chaFlashcardStatuses",
    globalLevels: "chaGlobalJlptLevels",
    sectionLevels: "chaSectionJlptLevels",
    quizStats: "chaQuizStats",
    activeQuiz: "chaActiveQuizType",
    kanaQuizGroups: "sakuraKanaQuizGroups",
    recentSearches: "chaRecentSearches",
    userNative: "sakura_user_native_entries",
    userSlang: "sakura_user_slang_entries",
    nativeHistory: "sakura_native_recent_history",
    appearanceTheme: "sakuraAppearanceTheme",
    wallpaperOverlay: "sakuraWallpaperOverlay",
    wallpaperFraming: "sakuraWallpaperFraming",
    translationHistory: "sakuraTranslationHistory",
    pinnedTravelPhrases: "sakuraPinnedTravelPhrases",
    travelPhraseDecks: "sakuraTravelPhraseDecks",
    travelNotes: "sakuraTravelNotes",
    travelCountdown: "sakuraTravelCountdown",
    travelModeEnabled: "sakuraTravelModeEnabled",
    travelOfflinePack: "sakuraTravelOfflinePack",
    yenConverter: "sakuraYenConverter",
    migrationVersion: "sakuraDataMigrationVersion",
    nativeDifficulty: "chaNativeDifficulty",
    wallpaperEnabled: "chaWallpaperEnabled",
    wallpaper: "lastWallpaper"
};

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const DEFAULT_LEVELS = ["N5"];
function normalizeJlptLevels(values, fallback = DEFAULT_LEVELS) {
    const requested = new Set(Array.isArray(values) ? values : []);
    const normalized = JLPT_LEVELS.filter(level => requested.has(level));
    return normalized.length ? normalized : [...fallback];
}

const DATA_MIGRATION_VERSION = 1;
const LEGACY_KANJI_IDS = {
    "kanji-n5-day": "kanji-65e5",
    "kanji-n5-study": "kanji-5b66",
    "kanji-n4-trip": "kanji-65c5",
    "kanji-n4-special": "kanji-7279",
    "kanji-n3-deep": "kanji-6df1",
    "kanji-n3-continue": "kanji-7d9a",
    "kanji-n2-support": "kanji-652f",
    "kanji-n2-recognize": "kanji-8a8d",
    "kanji-n1-carry": "kanji-643a",
    "kanji-n1-moment": "kanji-77ac"
};
const PERMANENT_KANJI_IDS = new Set(Object.values(LEGACY_KANJI_IDS));
const SECTION_NAMES = ["kanjiOfDay", "wordOfDay", "randomKanji", "randomVocabulary", "kanjiQuiz", "vocabularyQuiz"];
const NATIVE_CATEGORIES = ["Everyday casual", "Natural polite speech", "Reactions", "Travel", "Workplace", "Friends", "Texting", "Restaurants", "Shopping", "Transportation", "Hotels", "Social situations"];
const SLANG_CATEGORIES = ["Gyaru", "SNS / Social Media", "Internet", "Youth", "Casual Spoken", "Workplace / Office", "Anime / Otaku", "Oshi / Fandom", "Gaming", "Dating / Romance", "Friendship / Social", "School / Student", "Beauty / Fashion", "Food / Going Out", "Drinking / Nightlife", "Music / Concert", "Memes / Reactions", "Texting / LINE / DMs", "Gen Z / Reiwa", "Heisei / Retro", "Kansai", "Regional Dialects", "Strong Language / Insults", "Sarcasm / Passive Aggressive", "Fillers / Reaction Words", "Abbreviations", "Loanword Slang", "Things Textbooks Never Teach"];
const SLANG_CATEGORY_OPTIONS = [
    ["All", "All Slang"], ["Gyaru", "Gyaru"], ["SNS / Social Media", "SNS / Social Media"], ["Internet", "Internet"], ["Youth", "Youth"], ["Casual Spoken", "Casual Spoken"], ["Workplace / Office", "Workplace / Office"], ["Anime / Otaku", "Anime / Otaku"], ["Oshi / Fandom", "Oshi / Fandom"], ["Gaming", "Gaming"], ["Dating / Romance", "Dating / Romance"], ["Friendship / Social", "Friendship / Social"], ["School / Student", "School / Student"], ["Beauty / Fashion", "Beauty / Fashion"], ["Food / Going Out", "Food / Going Out"], ["Drinking / Nightlife", "Drinking / Nightlife"], ["Music / Concert", "Music / Concert"], ["Memes / Reactions", "Memes / Reactions"], ["Texting / LINE / DMs", "Texting / LINE / DMs"], ["Gen Z / Reiwa", "Gen Z / Reiwa"], ["Heisei / Retro", "Heisei / Retro"], ["Kansai", "Kansai"], ["Regional Dialects", "Regional Dialects"], ["Strong Language / Insults", "Strong Language / Insults"], ["Sarcasm / Passive Aggressive", "Sarcasm / Passive Aggressive"], ["Fillers / Reaction Words", "Fillers / Reaction Words"], ["Abbreviations", "Abbreviations"], ["Loanword Slang", "Loanword Slang"], ["Things Textbooks Never Teach", "Things Textbooks Never Teach"]
];
const LEGACY_SLANG_CATEGORY_MAP = { "Youth slang":"Youth", "Social media":"SNS / Social Media", "Internet":"Internet", "Everyday casual":"Casual Spoken", "Workplace":"Workplace / Office", "Anime versus real life":"Anime / Otaku", "Gaming":"Gaming", "Friends":"Friendship / Social", "Reactions":"Memes / Reactions", "Texting":"Texting / LINE / DMs", "Gyaru":"Gyaru", "TikTok / short-form social media":"SNS / Social Media", "X / online posts":"SNS / Social Media" };
function authoritativeSlangCategories(values) {
    return [...new Set((Array.isArray(values) ? values : []).map(value => LEGACY_SLANG_CATEGORY_MAP[cleanEntryText(value)] || cleanEntryText(value)).filter(value => SLANG_CATEGORIES.includes(value)))];
}
const TRANSLATION_API_ENDPOINT = ""; // Set to a secure serverless endpoint such as /api/translate. Never put an API key in this app.
const APPEARANCE_DB = "sakuraAppearanceDB";
const APPEARANCE_STORE = "wallpapers";
const WALLPAPER_RECORD = "activeWallpaper";
const DEFAULT_WALLPAPER_FRAMING = Object.freeze({ positionX: 50, positionY: 50, zoom: 1 });
const THEMES = { pink:{name:"Sakura Pink",swatch:"#ef5b87"},purple:{name:"Lavender Purple",swatch:"#9b70c8"},blue:{name:"Sky Blue",swatch:"#68a9dc"},green:{name:"Mint Green",swatch:"#68b99a"},yellow:{name:"Soft Yellow",swatch:"#d6a94d"} };
const TRANSLATION_CONTEXTS = ["Everyday","Travel","Restaurant","Café","Shopping","Hotel","Train","Airport","Workplace","Friends","Social media","Other"];
const TRANSLATION_TONES = ["Polite and natural","Casual","Very polite","Friendly","Social media / texting"];
const KANA_QUIZ_GROUPS = ["Basic", "Dakuten", "Handakuten", "Yoon", "Extended"];
let activeKanaQuizGroups = readJson(STORAGE.kanaQuizGroups, ["Basic"])
    .filter(group => KANA_QUIZ_GROUPS.includes(group));
if (!activeKanaQuizGroups.length) activeKanaQuizGroups = ["Basic"];

const KANA_DATA = [
    ["あ", "a", "Hiragana"], ["い", "i", "Hiragana"], ["う", "u", "Hiragana"], ["え", "e", "Hiragana"], ["お", "o", "Hiragana"],
    ["か", "ka", "Hiragana"], ["き", "ki", "Hiragana"], ["く", "ku", "Hiragana"], ["け", "ke", "Hiragana"], ["こ", "ko", "Hiragana"],
    ["さ", "sa", "Hiragana"], ["し", "shi", "Hiragana"], ["す", "su", "Hiragana"], ["せ", "se", "Hiragana"], ["そ", "so", "Hiragana"],
    ["た", "ta", "Hiragana"], ["ち", "chi", "Hiragana"], ["つ", "tsu", "Hiragana"], ["て", "te", "Hiragana"], ["と", "to", "Hiragana"],
    ["な", "na", "Hiragana"], ["に", "ni", "Hiragana"], ["ぬ", "nu", "Hiragana"], ["ね", "ne", "Hiragana"], ["の", "no", "Hiragana"],
    ["は", "ha", "Hiragana"], ["ひ", "hi", "Hiragana"], ["ふ", "fu", "Hiragana"], ["へ", "he", "Hiragana"], ["ほ", "ho", "Hiragana"],
    ["ま", "ma", "Hiragana"], ["み", "mi", "Hiragana"], ["む", "mu", "Hiragana"], ["め", "me", "Hiragana"], ["も", "mo", "Hiragana"],
    ["や", "ya", "Hiragana"], ["ゆ", "yu", "Hiragana"], ["よ", "yo", "Hiragana"], ["ら", "ra", "Hiragana"], ["り", "ri", "Hiragana"],
    ["る", "ru", "Hiragana"], ["れ", "re", "Hiragana"], ["ろ", "ro", "Hiragana"], ["わ", "wa", "Hiragana"], ["を", "wo", "Hiragana"], ["ん", "n", "Hiragana"],
    ["ア", "a", "Katakana"], ["イ", "i", "Katakana"], ["ウ", "u", "Katakana"], ["エ", "e", "Katakana"], ["オ", "o", "Katakana"],
    ["カ", "ka", "Katakana"], ["キ", "ki", "Katakana"], ["ク", "ku", "Katakana"], ["ケ", "ke", "Katakana"], ["コ", "ko", "Katakana"],
    ["サ", "sa", "Katakana"], ["シ", "shi", "Katakana"], ["ス", "su", "Katakana"], ["セ", "se", "Katakana"], ["ソ", "so", "Katakana"],
    ["タ", "ta", "Katakana"], ["チ", "chi", "Katakana"], ["ツ", "tsu", "Katakana"], ["テ", "te", "Katakana"], ["ト", "to", "Katakana"],
    ["ナ", "na", "Katakana"], ["ニ", "ni", "Katakana"], ["ヌ", "nu", "Katakana"], ["ネ", "ne", "Katakana"], ["ノ", "no", "Katakana"],
    ["ハ", "ha", "Katakana"], ["ヒ", "hi", "Katakana"], ["フ", "fu", "Katakana"], ["ヘ", "he", "Katakana"], ["ホ", "ho", "Katakana"],
    ["マ", "ma", "Katakana"], ["ミ", "mi", "Katakana"], ["ム", "mu", "Katakana"], ["メ", "me", "Katakana"], ["モ", "mo", "Katakana"],
    ["ヤ", "ya", "Katakana"], ["ユ", "yu", "Katakana"], ["ヨ", "yo", "Katakana"], ["ラ", "ra", "Katakana"], ["リ", "ri", "Katakana"],
    ["ル", "ru", "Katakana"], ["レ", "re", "Katakana"], ["ロ", "ro", "Katakana"], ["ワ", "wa", "Katakana"], ["ヲ", "wo", "Katakana"], ["ン", "n", "Katakana"],

    ["が", "ga", "Hiragana", "Dakuten"], ["ぎ", "gi", "Hiragana", "Dakuten"], ["ぐ", "gu", "Hiragana", "Dakuten"], ["げ", "ge", "Hiragana", "Dakuten"], ["ご", "go", "Hiragana", "Dakuten"],
    ["ざ", "za", "Hiragana", "Dakuten"], ["じ", "ji", "Hiragana", "Dakuten"], ["ず", "zu", "Hiragana", "Dakuten"], ["ぜ", "ze", "Hiragana", "Dakuten"], ["ぞ", "zo", "Hiragana", "Dakuten"],
    ["だ", "da", "Hiragana", "Dakuten"], ["ぢ", "ji", "Hiragana", "Dakuten"], ["づ", "zu", "Hiragana", "Dakuten"], ["で", "de", "Hiragana", "Dakuten"], ["ど", "do", "Hiragana", "Dakuten"],
    ["ば", "ba", "Hiragana", "Dakuten"], ["び", "bi", "Hiragana", "Dakuten"], ["ぶ", "bu", "Hiragana", "Dakuten"], ["べ", "be", "Hiragana", "Dakuten"], ["ぼ", "bo", "Hiragana", "Dakuten"],
    ["ぱ", "pa", "Hiragana", "Handakuten"], ["ぴ", "pi", "Hiragana", "Handakuten"], ["ぷ", "pu", "Hiragana", "Handakuten"], ["ぺ", "pe", "Hiragana", "Handakuten"], ["ぽ", "po", "Hiragana", "Handakuten"],
    ["きゃ", "kya", "Hiragana", "Yoon"], ["きゅ", "kyu", "Hiragana", "Yoon"], ["きょ", "kyo", "Hiragana", "Yoon"],
    ["ぎゃ", "gya", "Hiragana", "Yoon"], ["ぎゅ", "gyu", "Hiragana", "Yoon"], ["ぎょ", "gyo", "Hiragana", "Yoon"],
    ["しゃ", "sha", "Hiragana", "Yoon"], ["しゅ", "shu", "Hiragana", "Yoon"], ["しょ", "sho", "Hiragana", "Yoon"],
    ["じゃ", "ja", "Hiragana", "Yoon"], ["じゅ", "ju", "Hiragana", "Yoon"], ["じょ", "jo", "Hiragana", "Yoon"],
    ["ちゃ", "cha", "Hiragana", "Yoon"], ["ちゅ", "chu", "Hiragana", "Yoon"], ["ちょ", "cho", "Hiragana", "Yoon"],
    ["にゃ", "nya", "Hiragana", "Yoon"], ["にゅ", "nyu", "Hiragana", "Yoon"], ["にょ", "nyo", "Hiragana", "Yoon"],
    ["ひゃ", "hya", "Hiragana", "Yoon"], ["ひゅ", "hyu", "Hiragana", "Yoon"], ["ひょ", "hyo", "Hiragana", "Yoon"],
    ["びゃ", "bya", "Hiragana", "Yoon"], ["びゅ", "byu", "Hiragana", "Yoon"], ["びょ", "byo", "Hiragana", "Yoon"],
    ["ぴゃ", "pya", "Hiragana", "Yoon"], ["ぴゅ", "pyu", "Hiragana", "Yoon"], ["ぴょ", "pyo", "Hiragana", "Yoon"],
    ["みゃ", "mya", "Hiragana", "Yoon"], ["みゅ", "myu", "Hiragana", "Yoon"], ["みょ", "myo", "Hiragana", "Yoon"],
    ["りゃ", "rya", "Hiragana", "Yoon"], ["りゅ", "ryu", "Hiragana", "Yoon"], ["りょ", "ryo", "Hiragana", "Yoon"],
    ["っ", "small tsu", "Hiragana", "Special", false],

    ["ガ", "ga", "Katakana", "Dakuten"], ["ギ", "gi", "Katakana", "Dakuten"], ["グ", "gu", "Katakana", "Dakuten"], ["ゲ", "ge", "Katakana", "Dakuten"], ["ゴ", "go", "Katakana", "Dakuten"],
    ["ザ", "za", "Katakana", "Dakuten"], ["ジ", "ji", "Katakana", "Dakuten"], ["ズ", "zu", "Katakana", "Dakuten"], ["ゼ", "ze", "Katakana", "Dakuten"], ["ゾ", "zo", "Katakana", "Dakuten"],
    ["ダ", "da", "Katakana", "Dakuten"], ["ヂ", "ji", "Katakana", "Dakuten"], ["ヅ", "zu", "Katakana", "Dakuten"], ["デ", "de", "Katakana", "Dakuten"], ["ド", "do", "Katakana", "Dakuten"],
    ["バ", "ba", "Katakana", "Dakuten"], ["ビ", "bi", "Katakana", "Dakuten"], ["ブ", "bu", "Katakana", "Dakuten"], ["ベ", "be", "Katakana", "Dakuten"], ["ボ", "bo", "Katakana", "Dakuten"],
    ["パ", "pa", "Katakana", "Handakuten"], ["ピ", "pi", "Katakana", "Handakuten"], ["プ", "pu", "Katakana", "Handakuten"], ["ペ", "pe", "Katakana", "Handakuten"], ["ポ", "po", "Katakana", "Handakuten"],
    ["キャ", "kya", "Katakana", "Yoon"], ["キュ", "kyu", "Katakana", "Yoon"], ["キョ", "kyo", "Katakana", "Yoon"],
    ["ギャ", "gya", "Katakana", "Yoon"], ["ギュ", "gyu", "Katakana", "Yoon"], ["ギョ", "gyo", "Katakana", "Yoon"],
    ["シャ", "sha", "Katakana", "Yoon"], ["シュ", "shu", "Katakana", "Yoon"], ["ショ", "sho", "Katakana", "Yoon"],
    ["ジャ", "ja", "Katakana", "Yoon"], ["ジュ", "ju", "Katakana", "Yoon"], ["ジョ", "jo", "Katakana", "Yoon"],
    ["チャ", "cha", "Katakana", "Yoon"], ["チュ", "chu", "Katakana", "Yoon"], ["チョ", "cho", "Katakana", "Yoon"],
    ["ニャ", "nya", "Katakana", "Yoon"], ["ニュ", "nyu", "Katakana", "Yoon"], ["ニョ", "nyo", "Katakana", "Yoon"],
    ["ヒャ", "hya", "Katakana", "Yoon"], ["ヒュ", "hyu", "Katakana", "Yoon"], ["ヒョ", "hyo", "Katakana", "Yoon"],
    ["ビャ", "bya", "Katakana", "Yoon"], ["ビュ", "byu", "Katakana", "Yoon"], ["ビョ", "byo", "Katakana", "Yoon"],
    ["ピャ", "pya", "Katakana", "Yoon"], ["ピュ", "pyu", "Katakana", "Yoon"], ["ピョ", "pyo", "Katakana", "Yoon"],
    ["ミャ", "mya", "Katakana", "Yoon"], ["ミュ", "myu", "Katakana", "Yoon"], ["ミョ", "myo", "Katakana", "Yoon"],
    ["リャ", "rya", "Katakana", "Yoon"], ["リュ", "ryu", "Katakana", "Yoon"], ["リョ", "ryo", "Katakana", "Yoon"],
    ["ヴァ", "va", "Katakana", "Extended"], ["ヴィ", "vi", "Katakana", "Extended"], ["ヴ", "vu", "Katakana", "Extended"], ["ヴェ", "ve", "Katakana", "Extended"], ["ヴォ", "vo", "Katakana", "Extended"],
    ["ウィ", "wi", "Katakana", "Extended"], ["ウェ", "we", "Katakana", "Extended"], ["ウォ", "wo", "Katakana", "Extended"],
    ["ファ", "fa", "Katakana", "Extended"], ["フィ", "fi", "Katakana", "Extended"], ["フェ", "fe", "Katakana", "Extended"], ["フォ", "fo", "Katakana", "Extended"], ["フュ", "fyu", "Katakana", "Extended"],
    ["ティ", "ti", "Katakana", "Extended"], ["トゥ", "tu", "Katakana", "Extended"], ["ディ", "di", "Katakana", "Extended"], ["ドゥ", "du", "Katakana", "Extended"],
    ["チェ", "che", "Katakana", "Extended"], ["シェ", "she", "Katakana", "Extended"], ["ジェ", "je", "Katakana", "Extended"],
    ["ツァ", "tsa", "Katakana", "Extended"], ["ツィ", "tsi", "Katakana", "Extended"], ["ツェ", "tse", "Katakana", "Extended"], ["ツォ", "tso", "Katakana", "Extended"],
    ["クァ", "kwa", "Katakana", "Extended"], ["クィ", "kwi", "Katakana", "Extended"], ["クェ", "kwe", "Katakana", "Extended"], ["クォ", "kwo", "Katakana", "Extended"], ["グァ", "gwa", "Katakana", "Extended"],
    ["イェ", "ye", "Katakana", "Extended"], ["キェ", "kye", "Katakana", "Extended"], ["ギェ", "gye", "Katakana", "Extended"], ["ニェ", "nye", "Katakana", "Extended"], ["ヒェ", "hye", "Katakana", "Extended"], ["ビェ", "bye", "Katakana", "Extended"], ["ピェ", "pye", "Katakana", "Extended"], ["ミェ", "mye", "Katakana", "Extended"], ["リェ", "rye", "Katakana", "Extended"],
    ["ッ", "small tsu", "Katakana", "Special", false], ["ー", "long vowel mark", "Katakana", "Special", false]
];

function readJson(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    }
    catch (error) {
        console.warn(`Could not read ${key}.`, error);
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function recordCompleteness(value) {
    if (value == null || value === "") return 0;
    if (Array.isArray(value)) return value.reduce((score, entry) => score + recordCompleteness(entry), value.length ? 1 : 0);
    if (typeof value === "object") return Object.values(value).reduce((score, entry) => score + recordCompleteness(entry), 1);
    return 1;
}

function mergeSavedKanjiRecords(existing, candidate, preferCandidate) {
    const existingScore = recordCompleteness(existing);
    const candidateScore = recordCompleteness(candidate);
    const candidateWins = candidateScore > existingScore || (candidateScore === existingScore && preferCandidate);
    const primary = candidateWins ? candidate : existing;
    const secondary = candidateWins ? existing : candidate;
    const savedDates = [existing.savedAt, candidate.savedAt].filter(value => value && !Number.isNaN(Date.parse(value))).sort();
    return { ...secondary, ...primary, id: candidate.id, ...(savedDates.length ? { savedAt: savedDates[0] } : {}) };
}

function migrateSavedKanjiIds(items) {
    const migrated = [];
    const knownKanjiIndexes = new Map();
    let changed = 0;
    let duplicatesRemoved = 0;

    items.forEach(item => {
        if (!item || item.type !== "kanji") { migrated.push(item); return; }
        const mappedId = LEGACY_KANJI_IDS[item.id];
        const finalId = mappedId || item.id;
        if (!mappedId && !PERMANENT_KANJI_IDS.has(finalId)) { migrated.push(item); return; }

        const candidate = mappedId ? { ...item, id: finalId } : item;
        if (mappedId) changed += 1;
        const key = `kanji:${finalId}`;
        if (!knownKanjiIndexes.has(key)) {
            knownKanjiIndexes.set(key, migrated.length);
            migrated.push(candidate);
            return;
        }

        const existingIndex = knownKanjiIndexes.get(key);
        migrated[existingIndex] = mergeSavedKanjiRecords(migrated[existingIndex], candidate, !mappedId);
        duplicatesRemoved += 1;
    });

    return { items: migrated, changed, duplicatesRemoved };
}

function migrateKanjiFlashcardStatuses(statuses) {
    const migrated = { ...statuses };
    let changed = 0;
    Object.entries(LEGACY_KANJI_IDS).forEach(([oldId, newId]) => {
        const oldKey = `kanji:${oldId}`;
        if (!Object.prototype.hasOwnProperty.call(migrated, oldKey)) return;
        const newKey = `kanji:${newId}`;
        const oldValue = migrated[oldKey];
        const newValue = migrated[newKey];
        const newHasValidValue = newValue !== undefined && newValue !== null && newValue !== "";
        const oldHasValidValue = oldValue !== undefined && oldValue !== null && oldValue !== "";
        if (!newHasValidValue && oldHasValidValue) migrated[newKey] = oldValue;
        delete migrated[oldKey];
        changed += 1;
    });
    return { statuses: migrated, changed };
}

function runSakuraDataMigrations() {
    try {
        const currentVersion = Number(localStorage.getItem(STORAGE.migrationVersion) || 0);
        if (currentVersion >= DATA_MIGRATION_VERSION) return { skipped: true };

        const savedRaw = localStorage.getItem(STORAGE.saved);
        const statusesRaw = localStorage.getItem(STORAGE.statuses);
        const saved = savedRaw ? JSON.parse(savedRaw) : [];
        const statuses = statusesRaw ? JSON.parse(statusesRaw) : {};
        if (!Array.isArray(saved)) throw new Error(`${STORAGE.saved} must contain an array.`);
        if (!statuses || typeof statuses !== "object" || Array.isArray(statuses)) throw new Error(`${STORAGE.statuses} must contain an object.`);

        const savedResult = migrateSavedKanjiIds(saved);
        const statusResult = migrateKanjiFlashcardStatuses(statuses);
        if (savedRaw !== null && (savedResult.changed || savedResult.duplicatesRemoved)) writeJson(STORAGE.saved, savedResult.items);
        if (statusesRaw !== null && statusResult.changed) writeJson(STORAGE.statuses, statusResult.statuses);
        localStorage.setItem(STORAGE.migrationVersion, String(DATA_MIGRATION_VERSION));
        console.info(`Sakura data migration ${DATA_MIGRATION_VERSION} complete: ${savedResult.changed} saved Kanji updated, ${savedResult.duplicatesRemoved} duplicate saved Kanji removed, ${statusResult.changed} flashcard status keys updated.`);
        return { skipped: false, savedResult, statusResult };
    }
    catch (error) {
        console.warn("Sakura data migration could not be completed; it will retry next launch.", error);
        return { skipped: false, error };
    }
}

runSakuraDataMigrations();

function normalizeAnswer(value) {
    return String(value || "").trim().toLowerCase().replace(/[.,!?;:'"()\[\]{}]/g, "").replace(/\s+/g, " ");
}

let savedItems = readJson(STORAGE.saved, []);
let flashcardStatuses = readJson(STORAGE.statuses, {});
let pinnedTravelPhraseIds = readJson(STORAGE.pinnedTravelPhrases, []);
if (!Array.isArray(pinnedTravelPhraseIds)) pinnedTravelPhraseIds = [];
let travelPhraseDecks = readJson(STORAGE.travelPhraseDecks, []);
if (!Array.isArray(travelPhraseDecks)) travelPhraseDecks = [];
let travelNotes = readJson(STORAGE.travelNotes, []);
if (!Array.isArray(travelNotes)) travelNotes = [];
let travelCountdown = readJson(STORAGE.travelCountdown, null);
if (!travelCountdown || typeof travelCountdown !== "object" || Array.isArray(travelCountdown)) travelCountdown = null;
const storedTravelModeEnabled = localStorage.getItem(STORAGE.travelModeEnabled);
let travelModeEnabled = storedTravelModeEnabled === null ? true : storedTravelModeEnabled === "true";
if (storedTravelModeEnabled === null) localStorage.setItem(STORAGE.travelModeEnabled, "true");
let travelOfflinePackMetadata = readJson(STORAGE.travelOfflinePack, null);
if (!travelOfflinePackMetadata || typeof travelOfflinePackMetadata !== "object" || Array.isArray(travelOfflinePackMetadata)) travelOfflinePackMetadata = null;
const TRAVEL_OFFLINE_CACHE = "sakura-travel-content-v1";
const TRAVEL_OFFLINE_PACK_VERSION = "v1";
let travelOfflinePackState = { status:"checking", ready:[], failed:[], processed:0 };
let travelOfflinePackOperation = null;
let yenConverterSettings = readJson(STORAGE.yenConverter, null);
if (!yenConverterSettings || !Number.isFinite(Number(yenConverterSettings.phpPerJpy)) || Number(yenConverterSettings.phpPerJpy) <= 0) yenConverterSettings = null;
const YEN_CURRENCIES = Object.freeze({ JPY:{ symbol:"¥", label:"Japanese yen" }, PHP:{ symbol:"₱", label:"Philippine pesos" } });
let yenConverterState = { currencies:{ top:"JPY", bottom:"PHP" }, activeSide:"top", expressions:{ top:"", bottom:"" } };
let globalLevels = normalizeJlptLevels(readJson(STORAGE.globalLevels, DEFAULT_LEVELS));
let sectionSettings = readJson(STORAGE.sectionLevels, {});
if (!sectionSettings || typeof sectionSettings !== "object" || Array.isArray(sectionSettings)) sectionSettings = {};
let quizStats = {
    kana: { blooms: 0, misses: 0, questions: 0 },
    kanji: { blooms: 0, misses: 0, questions: 0 },
    vocabulary: { blooms: 0, misses: 0, questions: 0 }
};
const quizTransitionLocks = { kana: false, kanji: false, vocabulary: false };
const quizTransitionTimers = { kana: null, kanji: null, vocabulary: null };

let currentRoute = "home";
let detailReturnRoute = "home";
let currentDailyKanji = null;
let currentDailyWord = null;
let currentBrowseKanji = null;
let currentBrowseWord = null;
let currentDetailKanji = null;
let currentDetailWord = null;
let currentKana = null;
let currentKanjiQuiz = null;
let currentVocabularyQuiz = null;
let currentNativeItem = null;
let currentNativeMode = "native";
let currentTravelCategory = null;
let currentTravelFilter = "All";
let currentTravelPhrase = null;
let currentTravelIndex = 0;
let savedTravelCategoryFilter = "all";
let currentTravelDeckId = "";
let travelDeckIconChoice = "🌸";
let travelDeckPickerFilter = "all";
let travelDeckPickerSelection = new Set();
let travelNoteCategoryFilter = "all";
let currentTravelNoteId = "";
let pendingTravelSmartPhrase = null;
let travelRenderRevision = 0;
let flashcardDeck = [];
let flashcardIndex = 0;
let flashcardRevealed = false;
let searchType = "all";
let searchLevels = [...globalLevels];
let recentSearches = readJson(STORAGE.recentSearches, []);
let searchReturnRoute = "learn";
let universalSearchIndex = [];
let searchIndexDirty = true;
let searchWarmRevision = 0;
let transientSearchItems = new Map();
let travelSearchPreparation = null;
let searchVisibleCount = 40;
const searchFieldCache = new WeakMap();
const levelPoolCache = new WeakMap();
const LIBRARY_BATCH_SIZE = 48;
const LIBRARY_TOTALS = Object.freeze({ kanji:306, vocabulary:1506, travel:720 });
let libraryInitialized = false;
let libraryRepository = "";
let libraryFilter = "N5";
let libraryVisibleCount = LIBRARY_BATCH_SIZE;
let libraryLoadingRevision = 0;
let libraryCurrentItems = [];
let normalizedNativeDataCache = null;
let normalizedSlangDataCache = null;
let pendingTravelPhraseId = "";
let userNativeEntries = readJson(STORAGE.userNative, []);
let userSlangEntries = readJson(STORAGE.userSlang, []);
let nativeRecentHistory = readJson(STORAGE.nativeHistory, { native: [], slang: [] });
let nativeQueues = { native: [], slang: [] };
let nativeQueueKeys = { native: "", slang: "" };
let wallpaperObjectUrl = "";
let pendingWallpaperBlob = null;
let wallpaperFraming = normalizeWallpaperFraming(readJson(STORAGE.wallpaperFraming, DEFAULT_WALLPAPER_FRAMING));
let wallpaperFramingDraft = { ...wallpaperFraming };
let wallpaperDragState = null;
let translationHistory = readJson(STORAGE.translationHistory, []);
let currentTranslationResult = null;
let translationContext = "Everyday";
let translationTone = "Polite and natural";
let translationLoading = false;
const kanjiSelectionRevisions = new Map();
const vocabularySelectionRevisions = new Map();
const KANJI_FILTER_SECTIONS = new Set(["kanjiOfDay", "randomKanji", "kanjiQuiz"]);
const VOCABULARY_FILTER_SECTIONS = new Set(["wordOfDay", "randomVocabulary", "vocabularyQuiz"]);

async function ensureKanjiLevels(requestedLevels) {
    const levels = normalizeJlptLevels(requestedLevels);
    const loader = window.SakuraKanjiLoader;
    if (!loader) throw new Error("Sakura Kanji loader is unavailable.");
    const before = loader.getLoadedKanjiLevels().join("|");
    let loadError = null;

    try {
        await loader.loadKanjiLevels(levels);
    }
    catch (error) {
        loadError = error;
    }
    finally {
        const after = loader.getLoadedKanjiLevels().join("|");
        const loadedKanji = loader.getLoadedKanji();
        if (before !== after || window.KANJI_DATA.length !== loadedKanji.length) {
            window.KANJI_DATA = loadedKanji;
            validateKanjiDataset(window.KANJI_DATA);
            invalidateSearchIndex();
        }
    }

    if (loadError) throw loadError;
    return window.KANJI_DATA;
}

async function loadKanjiForSelection(scope, levels, onSettled) {
    const revision = (kanjiSelectionRevisions.get(scope) || 0) + 1;
    kanjiSelectionRevisions.set(scope, revision);
    let loaded = false;
    try {
        await ensureKanjiLevels(levels);
        loaded = true;
    }
    catch (error) {
        // The loader already reports the failing level. Keep the current working content.
    }
    if (kanjiSelectionRevisions.get(scope) === revision) onSettled?.(loaded);
    return loaded;
}

async function ensureVocabularyLevels(requestedLevels) {
    const levels = normalizeJlptLevels(requestedLevels);
    const loader = window.SakuraVocabularyLoader;
    if (!loader) throw new Error("Sakura Vocabulary loader is unavailable.");
    const before = loader.getLoadedVocabularyLevels().join("|");
    let loadError = null;
    try {
        await loader.loadVocabularyLevels(levels);
    }
    catch (error) {
        loadError = error;
    }
    finally {
        const after = loader.getLoadedVocabularyLevels().join("|");
        const loadedVocabulary = loader.getLoadedVocabulary();
        if (before !== after || window.VOCABULARY_DATA.length !== loadedVocabulary.length) {
            window.VOCABULARY_DATA = loadedVocabulary;
            invalidateSearchIndex();
        }
    }
    if (loadError) throw loadError;
    return window.VOCABULARY_DATA;
}

async function loadVocabularyForSelection(scope, levels, onSettled) {
    const revision = (vocabularySelectionRevisions.get(scope) || 0) + 1;
    vocabularySelectionRevisions.set(scope, revision);
    let loaded = false;
    try {
        await ensureVocabularyLevels(levels);
        loaded = true;
    }
    catch (error) {
        // The loader reports the failing level. Keep currently loaded Vocabulary usable.
    }
    if (vocabularySelectionRevisions.get(scope) === revision) onSettled?.(loaded);
    return loaded;
}

async function loadGlobalLearningContent() {
    const [kanjiLoaded, vocabularyLoaded] = await Promise.all([
        loadKanjiForSelection("global", globalLevels),
        loadVocabularyForSelection("global", globalLevels)
    ]);
    if (kanjiLoaded || vocabularyLoaded) refreshAllFilteredContent();
}

function refreshSectionForLevelChange(sectionName) {
    if (VOCABULARY_FILTER_SECTIONS.has(sectionName)) {
        loadVocabularyForSelection(sectionName, getActiveLevels(sectionName), loaded => {
            if (loaded) refreshSection(sectionName);
        });
        return;
    }
    if (!KANJI_FILTER_SECTIONS.has(sectionName)) {
        refreshSection(sectionName);
        return;
    }
    loadKanjiForSelection(sectionName, getActiveLevels(sectionName), loaded => {
        if (loaded) refreshSection(sectionName);
    });
}

function itemKey(item) {
    if (!item) return "";
    return `${item.migratedFrom === "native" ? "native" : item.type}:${item.id}`;
}

function isSaved(item) {
    return Boolean(item) && savedItems.some(saved => itemKey(saved) === itemKey(item));
}

function setSaveButton(button, item) {
    if (!button) return;
    const saved = isSaved(item);
    button.classList.toggle("saved", saved);
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(saved));
}

function updateSavedCounts() {
    document.getElementById("home-saved-count").textContent = savedItems.length;
}

function saveItem(item) {
    if (!item || isSaved(item)) return false;
    savedItems.push({ ...item, savedAt: new Date().toISOString() });
    writeJson(STORAGE.saved, savedItems);
    updateSavedUi();
    return true;
}

function removeItem(item) {
    if (!item) return;
    savedItems = savedItems.filter(saved => itemKey(saved) !== itemKey(item));
    delete flashcardStatuses[itemKey(item)];
    writeJson(STORAGE.saved, savedItems);
    writeJson(STORAGE.statuses, flashcardStatuses);
    updateSavedUi();
}

function toggleSaved(item) {
    if (isSaved(item)) removeItem(item);
    else saveItem(item);
}

function syncSaveButtons() {
    setSaveButton(document.getElementById("save-daily-kanji"), currentDailyKanji);
    setSaveButton(document.getElementById("save-daily-word"), currentDailyWord);
    setSaveButton(document.getElementById("save-browse-kanji"), currentBrowseKanji);
    setSaveButton(document.getElementById("save-browse-word"), currentBrowseWord);
    setSaveButton(document.getElementById("save-native-item"), currentNativeItem);
    setSaveButton(document.getElementById("save-detail-kanji"), currentDetailKanji);
    setSaveButton(document.getElementById("save-detail-word"), currentDetailWord);
}

function updateSavedUi() {
    updateSavedCounts();
    syncSaveButtons();
    renderSavedItems();
    renderMyTravelPhrases();
    if (currentRoute === "library" && libraryRepository) renderLibraryResults();
    cleanTravelDecks();
    renderTravelDecks();
    renderCurrentTravelDeck();
    buildFlashcardDeck();
}

function getGlobalLevels() {
    return normalizeJlptLevels(globalLevels);
}

function getActiveLevels(sectionName) {
    const setting = sectionSettings[sectionName];
    if (!setting || setting.useGlobal !== false) return getGlobalLevels();
    return normalizeJlptLevels(setting.levels, JLPT_LEVELS);
}

function itemsForLevels(items, sectionName) {
    const levels = getActiveLevels(sectionName);
    if (!Array.isArray(items)) return [];
    let cachedPools = levelPoolCache.get(items);
    if (!cachedPools) { cachedPools = new Map(); levelPoolCache.set(items, cachedPools); }
    const key = levels.join("|");
    if (!cachedPools.has(key)) {
        const levelSet = new Set(levels);
        cachedPools.set(key, items.filter(item => levelSet.has(item.jlpt)));
    }
    return cachedPools.get(key);
}

function createLevelChip(level, checked, onChange, disabled = false) {
    const label = document.createElement("label");
    label.className = "level-chip";
    label.innerHTML = `<input type="checkbox" value="${level}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}><span>${level}</span>`;
    label.querySelector("input").addEventListener("change", onChange);
    return label;
}

function renderGlobalLevels() {
    const container = document.getElementById("global-jlpt-selector");
    container.innerHTML = "";
    JLPT_LEVELS.forEach(level => {
        container.appendChild(createLevelChip(level, globalLevels.includes(level), event => {
            globalLevels = event.target.checked
                ? [...new Set([...globalLevels, level])]
                : globalLevels.filter(value => value !== level);
            if (!globalLevels.length) globalLevels = [...JLPT_LEVELS];
            globalLevels = normalizeJlptLevels(globalLevels, JLPT_LEVELS);
            writeJson(STORAGE.globalLevels, globalLevels);
            renderGlobalLevels();
            renderAllSectionControls();
            loadGlobalLearningContent();
        }));
    });
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = `all-level-button ${globalLevels.length === JLPT_LEVELS.length ? "active" : ""}`;
    allButton.textContent = "◎ All";
    allButton.addEventListener("click", () => {
        globalLevels = [...JLPT_LEVELS];
        writeJson(STORAGE.globalLevels, globalLevels);
        renderGlobalLevels();
        renderAllSectionControls();
        loadGlobalLearningContent();
    });
    container.appendChild(allButton);
    document.getElementById("global-level-summary").textContent = `Selected: ${globalLevels.length === JLPT_LEVELS.length ? "All" : globalLevels.join(" + ")}`;
}

function renderSectionControl(sectionName) {
    const container = document.getElementById(`${sectionName}-levels`);
    if (!container) return;
    const setting = sectionSettings[sectionName] || { useGlobal: true, levels: [...DEFAULT_LEVELS] };
    const activeLevels = getActiveLevels(sectionName);
    container.innerHTML = "";

    const top = document.createElement("div");
    top.className = "level-control-top";
    top.innerHTML = `<span class="active-level-text">Active: ${activeLevels.length === JLPT_LEVELS.length ? "All" : activeLevels.join(" + ")}</span><label class="global-toggle"><span>Use Global</span><input type="checkbox" ${setting.useGlobal !== false ? "checked" : ""}></label>`;
    top.querySelector("input").addEventListener("change", event => {
        sectionSettings[sectionName] = { ...setting, useGlobal: event.target.checked };
        writeJson(STORAGE.sectionLevels, sectionSettings);
        renderAllSectionControls();
        refreshSectionForLevelChange(sectionName);
    });
    container.appendChild(top);

    const chips = document.createElement("div");
    chips.className = "section-level-chips";
    JLPT_LEVELS.forEach(level => {
        chips.appendChild(createLevelChip(level, activeLevels.includes(level), event => {
            const current = sectionSettings[sectionName] || setting;
            const levels = event.target.checked
                ? [...new Set([...(current.levels || []), level])]
                : (current.levels || []).filter(value => value !== level);
            sectionSettings[sectionName] = { useGlobal: false, levels: levels.length ? levels : [...JLPT_LEVELS] };
            writeJson(STORAGE.sectionLevels, sectionSettings);
            renderAllSectionControls();
            refreshSectionForLevelChange(sectionName);
        }, setting.useGlobal !== false));
    });
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = `all-level-button ${!setting.useGlobal && activeLevels.length === JLPT_LEVELS.length ? "active" : ""}`;
    allButton.textContent = "◎ All";
    allButton.disabled = setting.useGlobal !== false;
    allButton.addEventListener("click", () => {
        sectionSettings[sectionName] = { useGlobal: false, levels: [...JLPT_LEVELS] };
        writeJson(STORAGE.sectionLevels, sectionSettings);
        renderAllSectionControls();
        refreshSectionForLevelChange(sectionName);
    });
    chips.appendChild(allButton);
    container.appendChild(chips);
}

function renderAllSectionControls() {
    SECTION_NAMES.forEach(renderSectionControl);
}

function pickIndex(pool, current, direction = 1, random = false) {
    if (!pool.length) return -1;
    const currentIndex = pool.findIndex(item => current && item.id === current.id);
    if (random && pool.length > 1) {
        let result;
        do result = Math.floor(Math.random() * pool.length);
        while (result === currentIndex);
        return result;
    }
    if (currentIndex < 0) return direction < 0 ? pool.length - 1 : 0;
    return (currentIndex + direction + pool.length) % pool.length;
}

async function enhanceVocabulary(item) {
    try {
        const response = await fetch("https://jotoba.de/api/search/words", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: item.word, language: "English", no_english: false })
        });
        if (!response.ok) throw new Error("Jotoba request failed.");
        const data = await response.json();
        const entry = Array.isArray(data.words) ? data.words.find(word => word?.reading && word.reading.kanji === item.word) || data.words[0] : null;
        const sense = entry?.senses?.find(value => value.language === "English" && value.glosses?.length) || entry?.senses?.find(value => value.glosses?.length);
        if (!entry) return item;
        return {
            ...item,
            kana: entry.reading?.kana || item.kana,
            meaning: sense?.glosses?.slice(0, 3).join("; ") || item.meaning
        };
    }
    catch (error) {
        console.info("Using local vocabulary fallback.", error);
        return item;
    }
}

function renderOptionalText(id, value, containerId = "") {
    const element = document.getElementById(id);
    const text = typeof value === "string" ? value.trim() : "";
    element.textContent = text;
    (containerId ? document.getElementById(containerId) : element).hidden = !text;
}

function renderDailyKanji(item) {
    currentDailyKanji = item;
    document.getElementById("daily-kanji-character").textContent = item?.character || "—";
    document.getElementById("daily-kanji-reading").textContent = item?.reading || "No reading available";
    renderOptionalText("daily-kanji-romaji", item?.romaji);
    document.getElementById("daily-kanji-meaning").textContent = item?.meaning || "No content for these levels";
    document.getElementById("daily-kanji-level").textContent = item?.jlpt || "—";
    const example = item?.examples?.[0];
    document.getElementById("daily-kanji-example").textContent = example ? `${example.word}（${example.reading}）— ${example.meaning}` : "Choose another JLPT level.";
    setSaveButton(document.getElementById("save-daily-kanji"), item);
}

function browseDailyKanji(direction = 1, random = false) {
    const pool = itemsForLevels(window.KANJI_DATA, "kanjiOfDay");
    const index = pickIndex(pool, currentDailyKanji, direction, random);
    const selected = index < 0 ? null : pool[index];
    renderDailyKanji(selected);
}

function renderDailyWord(item) {
    currentDailyWord = item;
    document.getElementById("daily-word-text").textContent = item?.word || "—";
    document.getElementById("daily-word-reading").textContent = item?.kana || "No reading available";
    renderOptionalText("daily-word-romaji", item?.romaji);
    document.getElementById("daily-word-meaning").textContent = item?.meaning || "No content for these levels";
    document.getElementById("daily-word-tags").innerHTML = item ? `<span class="tag">${item.jlpt}</span><span class="tag">${partOfSpeech(item)}</span>` : "";
    document.getElementById("daily-word-example").textContent = item?.exampleSentence || "Choose another JLPT level.";
    setSaveButton(document.getElementById("save-daily-word"), item);
}

async function browseDailyWord(direction = 1, random = false) {
    const pool = itemsForLevels(window.VOCABULARY_DATA, "wordOfDay");
    const index = pickIndex(pool, currentDailyWord, direction, random);
    const selected = index < 0 ? null : pool[index];
    renderDailyWord(selected);
    if (!selected) return;
    const enhanced = await enhanceVocabulary(selected);
    if (currentDailyWord?.id === selected.id) renderDailyWord(enhanced);
}

function renderBrowseKanji(item) {
    currentBrowseKanji = item;
    document.getElementById("browse-kanji-character").textContent = item?.character || "—";
    document.getElementById("browse-kanji-reading").textContent = item?.reading || "No reading available";
    renderOptionalText("browse-kanji-romaji", item?.romaji);
    document.getElementById("browse-kanji-meaning").textContent = item?.meaning || "No content for these levels";
    document.getElementById("browse-kanji-level").textContent = item?.jlpt || "—";
    setSaveButton(document.getElementById("save-browse-kanji"), item);
}

function browseKanji(direction = 1, random = false) {
    const pool = itemsForLevels(window.KANJI_DATA, "randomKanji");
    const index = pickIndex(pool, currentBrowseKanji, direction, random);
    renderBrowseKanji(index < 0 ? null : pool[index]);
}

function renderBrowseWord(item) {
    currentBrowseWord = item;
    document.getElementById("browse-word-text").textContent = item?.word || "—";
    document.getElementById("browse-word-reading").textContent = item?.kana || "No reading available";
    renderOptionalText("browse-word-romaji", item?.romaji);
    document.getElementById("browse-word-meaning").textContent = item?.meaning || "No content for these levels";
    document.getElementById("browse-word-level").textContent = item?.jlpt || "—";
    setSaveButton(document.getElementById("save-browse-word"), item);
}

function browseWord(direction = 1, random = false) {
    const pool = itemsForLevels(window.VOCABULARY_DATA, "randomVocabulary");
    const index = pickIndex(pool, currentBrowseWord, direction, random);
    renderBrowseWord(index < 0 ? null : pool[index]);
}

function partOfSpeech(item) {
    const notes = String(item?.notes || "").toLowerCase();
    if (notes.includes("する")) return "Noun / する verb";
    if (notes.includes("adverb")) return "Adverb";
    if (notes.includes("adjective")) return "Adjective";
    if (notes.includes("verb")) return "Verb";
    return "Vocabulary";
}

function renderKanjiDetail(item) {
    currentDetailKanji = item;
    document.getElementById("detail-kanji-character").textContent = item?.character || "—";
    document.getElementById("detail-kanji-level").textContent = item?.jlpt || "—";
    document.getElementById("detail-kanji-meaning").textContent = item?.literalMeaning || item?.meaning || "No content available";
    document.getElementById("detail-kanji-core-concept").textContent = item?.coreConcept || item?.meaning || "No content available";
    renderOptionalText("detail-kanji-primary-reading", item?.reading, "detail-kanji-primary-reading-group");
    renderOptionalText("detail-kanji-romaji", item?.romaji, "detail-kanji-romaji-group");
    document.getElementById("detail-kanji-usage-note").textContent = item?.naturalUsageNotes || "This kanji is usually encountered as part of complete words.";
    document.getElementById("detail-kanji-onyomi").textContent = item?.onyomi?.join(", ") || "—";
    document.getElementById("detail-kanji-kunyomi").textContent = item?.kunyomi?.join(", ") || "—";
    document.getElementById("detail-kanji-sentence").textContent = item?.exampleSentence || "";
    document.getElementById("detail-kanji-translation").textContent = item?.exampleTranslation || "";
    document.getElementById("detail-kanji-examples").innerHTML = (item?.commonWords || item?.examples || []).map(example => {
        const savedExample = { id: `example-${item.id}-${example.word}`, type: "vocabulary", word: example.word, kana: example.reading, romaji: "", meaning: example.meaning, jlpt: item.jlpt, exampleSentence: item.exampleSentence, exampleTranslation: item.exampleTranslation, notes: `Example word for ${item.character}` };
        return `<article class="example-word"><span><strong>${example.word}（${example.reading}）</strong><small>${example.meaning}</small></span><button class="example-save-button ${isSaved(savedExample) ? "saved" : ""}" type="button" data-example-id="${encodeURIComponent(JSON.stringify(savedExample))}" aria-label="Save ${example.word}">${isSaved(savedExample) ? "♥" : "♡"}</button></article>`;
    }).join("") || '<p class="empty-state">No example words available.</p>';
    setSaveButton(document.getElementById("save-detail-kanji"), item);
}

function renderWordDetail(item) {
    currentDetailWord = item;
    document.getElementById("detail-word-level").textContent = item?.jlpt || "—";
    document.getElementById("detail-word-text").textContent = item?.word || "—";
    renderOptionalText("detail-word-kana", item?.kana);
    renderOptionalText("detail-word-romaji", item?.romaji);
    document.getElementById("detail-word-dictionary-meaning").textContent = item?.dictionaryMeaning || item?.meaning || "No content available";
    document.getElementById("detail-word-meaning").textContent = item?.naturalMeaning || item?.meaning || "No content available";
    document.getElementById("detail-word-pos").textContent = partOfSpeech(item);
    document.getElementById("detail-word-sentence").textContent = item?.exampleSentence || "";
    document.getElementById("detail-word-translation").textContent = item?.exampleTranslation || "";
    document.getElementById("detail-word-notes").textContent = item?.naturalUsageNotes || item?.notes || "No usage note available.";
    setSaveButton(document.getElementById("save-detail-word"), item);
}

function openKanjiDetail(item, returnRoute = currentRoute) {
    if (!item) return;
    detailReturnRoute = returnRoute;
    renderKanjiDetail(item);
    showRoute("kanji-detail", false);
}

function openWordDetail(item, returnRoute = currentRoute) {
    if (!item) return;
    detailReturnRoute = returnRoute;
    renderWordDetail(item);
    showRoute("word-detail", false);
}

function moveDetailKanji(direction = 1, random = false) {
    const section = detailReturnRoute === "learn" ? "randomKanji" : "kanjiOfDay";
    const pool = detailReturnRoute === "library" ? libraryCurrentItems : detailReturnRoute === "search" ? window.KANJI_DATA : itemsForLevels(window.KANJI_DATA, section);
    const index = pickIndex(pool, currentDetailKanji, direction, random);
    const item = index < 0 ? null : pool[index];
    renderKanjiDetail(item);
    if (detailReturnRoute === "learn") renderBrowseKanji(item);
    else if (detailReturnRoute !== "search") renderDailyKanji(item);
}

function moveDetailWord(direction = 1, random = false) {
    const section = detailReturnRoute === "learn" ? "randomVocabulary" : "wordOfDay";
    const pool = detailReturnRoute === "library" ? libraryCurrentItems : detailReturnRoute === "search" ? window.VOCABULARY_DATA : itemsForLevels(window.VOCABULARY_DATA, section);
    const index = pickIndex(pool, currentDetailWord, direction, random);
    const item = index < 0 ? null : pool[index];
    renderWordDetail(item);
    if (detailReturnRoute === "learn") renderBrowseWord(item);
    else if (detailReturnRoute !== "search") renderDailyWord(item);
}

function kanaGroup(item) {
    return item[3] || "Basic";
}

function kanaQuizEligible(item) {
    return item[4] !== false;
}

function kanaToRomaji(value) {
    const kana = String(value || "").normalize("NFKC");
    const readings = new Map(KANA_DATA.filter(kanaQuizEligible).map(item => [item[0], item[1]]));
    const tokens = [...readings.keys()].sort((left, right) => right.length - left.length);
    let result = "";
    for (let index = 0; index < kana.length;) {
        const character = kana[index];
        if (character === "っ" || character === "ッ") {
            const nextToken = tokens.find(token => kana.startsWith(token, index + 1));
            const nextReading = nextToken ? readings.get(nextToken) : "";
            result += nextReading.startsWith("ch") ? "c" : (/^[bcdfghjklmnpqrstvwxyz]/.exec(nextReading)?.[0] || "");
            index += 1;
            continue;
        }
        if (character === "ー") {
            result += /[aeiou](?!.*[aeiou])/.exec(result)?.[0] || "";
            index += 1;
            continue;
        }
        const token = tokens.find(candidate => kana.startsWith(candidate, index));
        if (!token) {
            result += character;
            index += 1;
            continue;
        }
        result += readings.get(token);
        index += token.length;
    }
    return result;
}

function renderKanaQuizGroups() {
    const container = document.getElementById("kana-quiz-groups");
    if (!container) return;
    container.innerHTML = KANA_QUIZ_GROUPS.map(group => `<button class="kana-group-chip ${activeKanaQuizGroups.includes(group) ? "active" : ""}" type="button" data-kana-group="${group}" aria-pressed="${activeKanaQuizGroups.includes(group)}">${group === "Yoon" ? "Yōon" : group}</button>`).join("");
}

function toggleKanaQuizGroup(group) {
    if (!KANA_QUIZ_GROUPS.includes(group)) return;
    if (activeKanaQuizGroups.includes(group)) {
        if (activeKanaQuizGroups.length === 1) return;
        activeKanaQuizGroups = activeKanaQuizGroups.filter(value => value !== group);
    }
    else activeKanaQuizGroups = KANA_QUIZ_GROUPS.filter(value => activeKanaQuizGroups.includes(value) || value === group);
    writeJson(STORAGE.kanaQuizGroups, activeKanaQuizGroups);
    renderKanaQuizGroups();
    newKana();
}

function newKana() {
    cancelQuizTransition("kana");
    const pool = KANA_DATA.filter(item => kanaQuizEligible(item) && activeKanaQuizGroups.includes(kanaGroup(item)));
    const choices = pool.filter(item => !currentKana || item[0] !== currentKana[0]);
    const available = choices.length ? choices : pool;
    currentKana = available[Math.floor(Math.random() * available.length)];
    document.getElementById("kana-character").textContent = currentKana[0];
    document.getElementById("kana-type").textContent = `${currentKana[2]} · ${kanaGroup(currentKana) === "Yoon" ? "Yōon" : kanaGroup(currentKana)}`;
    document.getElementById("kana-answer").value = "";
    setFeedback("kana-feedback", "");
    recordQuizQuestion("kana");
}

function newKanjiQuiz() {
    cancelQuizTransition("kanji");
    const pool = itemsForLevels(window.KANJI_DATA, "kanjiQuiz");
    const index = pickIndex(pool, currentKanjiQuiz, 1, true);
    currentKanjiQuiz = index < 0 ? null : pool[index];
    document.getElementById("kanji-quiz-character").textContent = currentKanjiQuiz?.character || "—";
    document.getElementById("kanji-quiz-answer").value = "";
    setFeedback("kanji-quiz-feedback", currentKanjiQuiz ? "" : "No content is available for these levels.", "incorrect");
    if (currentKanjiQuiz) recordQuizQuestion("kanji");
}

function newVocabularyQuiz() {
    cancelQuizTransition("vocabulary");
    const pool = itemsForLevels(window.VOCABULARY_DATA, "vocabularyQuiz");
    const index = pickIndex(pool, currentVocabularyQuiz, 1, true);
    currentVocabularyQuiz = index < 0 ? null : pool[index];
    document.getElementById("vocabulary-quiz-word").textContent = currentVocabularyQuiz?.word || "—";
    document.getElementById("vocabulary-quiz-reading").textContent = currentVocabularyQuiz?.kana || "No content is available for these levels.";
    document.getElementById("vocabulary-quiz-answer").value = "";
    setFeedback("vocabulary-quiz-feedback", "");
    if (currentVocabularyQuiz) recordQuizQuestion("vocabulary");
}

function setFeedback(id, message, state = "") {
    const element = document.getElementById(id);
    element.textContent = message;
    element.className = `feedback ${state}`;
}

const QUIZ_UI = {
    kana: { panel: "kana-quiz-panel", input: "kana-answer", check: "check-kana", blooms: "kana-quiz-blooms", misses: "kana-quiz-misses" },
    kanji: { panel: "kanji-quiz-panel", input: "kanji-quiz-answer", check: "check-kanji-quiz", blooms: "kanji-quiz-blooms", misses: "kanji-quiz-misses" },
    vocabulary: { panel: "vocabulary-quiz-panel", input: "vocabulary-quiz-answer", check: "check-vocabulary-quiz", blooms: "vocabulary-quiz-blooms", misses: "vocabulary-quiz-misses" }
};

function normalizedQuizStats(type) {
    const stored = quizStats[type] || {};
    return { blooms: Number(stored.blooms) || 0, misses: Number(stored.misses) || 0, questions: Number(stored.questions) || 0 };
}

function updateQuizStatus(type) {
    const stats = normalizedQuizStats(type);
    quizStats[type] = stats;
    document.getElementById(QUIZ_UI[type].blooms).textContent = stats.blooms;
    document.getElementById(QUIZ_UI[type].misses).textContent = stats.misses;
}

function recordQuizQuestion(type) {
    const stats = normalizedQuizStats(type);
    stats.questions += 1;
    quizStats[type] = stats;
    updateQuizStatus(type);
}

function recordQuizMiss(type) {
    const stats = normalizedQuizStats(type);
    stats.misses += 1;
    quizStats[type] = stats;
    updateQuizStatus(type);
}

function resetQuizSession(type) {
    if (!QUIZ_UI[type]) return;
    const stats = normalizedQuizStats(type);
    if ((stats.blooms || stats.misses) && !window.confirm("Reset your Quiz Garden?\n\nYour Blooms and Misses will return to zero.")) return;
    cancelQuizTransition(type);
    quizStats[type] = { blooms: 0, misses: 0, questions: 0 };
    updateQuizStatus(type);
    ({ kana: newKana, kanji: newKanjiQuiz, vocabulary: newVocabularyQuiz })[type]();
}

function cancelQuizTransition(type) {
    clearTimeout(quizTransitionTimers[type]);
    quizTransitionTimers[type] = null;
    quizTransitionLocks[type] = false;
    const ui = QUIZ_UI[type];
    document.getElementById(ui.panel)?.classList.remove("correct-transition");
    const input = document.getElementById(ui.input);
    const check = document.getElementById(ui.check);
    if (input) input.disabled = false;
    if (check) check.disabled = false;
}

function completeCorrectAnswer(type, feedbackId, message, nextQuestion) {
    if (quizTransitionLocks[type]) return;
    quizTransitionLocks[type] = true;
    const stats = normalizedQuizStats(type);
    stats.blooms += 1;
    quizStats[type] = stats;
    updateQuizStatus(type);
    setFeedback(feedbackId, message, "correct");
    const ui = QUIZ_UI[type];
    document.getElementById(ui.panel).classList.add("correct-transition");
    document.getElementById(ui.input).disabled = true;
    document.getElementById(ui.check).disabled = true;
    quizTransitionTimers[type] = setTimeout(nextQuestion, 850);
}

function checkKana() {
    if (quizTransitionLocks.kana || !currentKana) return;
    const answer = normalizeAnswer(document.getElementById("kana-answer").value);
    if (answer === currentKana[1]) {
        completeCorrectAnswer("kana", "kana-feedback", `Correct! ${currentKana[0]} is ${currentKana[1]}.`, newKana);
        return;
    }
    recordQuizMiss("kana");
    setFeedback("kana-feedback", "Try again. Enter the romaji reading.", "incorrect");
    return;
    setFeedback("kana-feedback", answer === currentKana[1] ? `Correct! ${currentKana[0]} is ${currentKana[1]}.` : "Not quite—try again.", answer === currentKana[1] ? "correct" : "incorrect");
}

function normalizeKanjiReading(value) {
    return normalizeAnswer(String(value || "").normalize("NFKC"))
        .replace(/[。、．・･]/g, "")
        .replace(/[ァ-ヶ]/g, character => String.fromCharCode(character.charCodeAt(0) - 0x60));
}

function kanjiReadingAnswers(item) {
    return [...(item?.onyomi || []), ...(item?.kunyomi || [])]
        .flatMap(reading => String(reading || "").split(/[\/／,，、;；|｜]+/))
        .map(normalizeKanjiReading)
        .filter(Boolean);
}

function normalizeKanjiRomaji(value) {
    return normalizeAnswer(String(value || "").normalize("NFKC"))
        .replace(/[\s\-\u2010-\u2015・･]+/g, "");
}

function kanjiRomajiAnswers(item) {
    return String(item?.romaji || "")
        .split(/[\/／,，、;；|｜]+/)
        .map(normalizeKanjiRomaji)
        .filter(Boolean);
}

function isKanjiQuizAnswerCorrect(item, rawAnswer) {
    const answer = normalizeAnswer(rawAnswer);
    const meaningAnswers = String(item?.meaning || "").split(/[;,]/).map(normalizeAnswer).filter(Boolean);
    const readingAnswer = normalizeKanjiReading(rawAnswer);
    const readingAnswers = kanjiReadingAnswers(item);
    const romajiAnswer = normalizeKanjiRomaji(rawAnswer);
    const romajiAnswers = kanjiRomajiAnswers(item);
    const exactMatch = meaningAnswers.includes(answer) || readingAnswers.includes(readingAnswer) || romajiAnswers.includes(romajiAnswer);
    const escapedAnswer = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const meaningfulEnglishPartial = answer.length >= 3 && /^[a-z][a-z\s'-]*$/i.test(answer) && meaningAnswers.some(value => new RegExp(`(^|\\s)${escapedAnswer}(?=$|\\s)`, "i").test(value));
    return Boolean(answer) && (exactMatch || meaningfulEnglishPartial);
}

function checkKanjiQuiz() {
    if (quizTransitionLocks.kanji || !currentKanjiQuiz) return;
    const correct = isKanjiQuizAnswerCorrect(currentKanjiQuiz, document.getElementById("kanji-quiz-answer").value);
    if (correct) completeCorrectAnswer("kanji", "kanji-quiz-feedback", `Correct! ${currentKanjiQuiz.character}: ${currentKanjiQuiz.meaning}`, newKanjiQuiz);
    else { recordQuizMiss("kanji"); setFeedback("kanji-quiz-feedback", "Try again with a reading or English meaning.", "incorrect"); }
    return;
    setFeedback("kanji-quiz-feedback", correct ? `Correct! ${currentKanjiQuiz.character}: ${currentKanjiQuiz.meaning}` : "Not quite—try a reading or English meaning.", correct ? "correct" : "incorrect");
}

function checkVocabularyQuiz() {
    if (quizTransitionLocks.vocabulary || !currentVocabularyQuiz) return;
    const answer = normalizeAnswer(document.getElementById("vocabulary-quiz-answer").value);
    const meanings = currentVocabularyQuiz.meaning.split(/[;,]/).map(normalizeAnswer);
    const correct = answer && meanings.some(value => value === answer || value.includes(answer));
    if (correct) completeCorrectAnswer("vocabulary", "vocabulary-quiz-feedback", `Correct! ${currentVocabularyQuiz.word}: ${currentVocabularyQuiz.meaning}`, newVocabularyQuiz);
    else { recordQuizMiss("vocabulary"); setFeedback("vocabulary-quiz-feedback", "Try again with the English meaning.", "incorrect"); }
    return;
    setFeedback("vocabulary-quiz-feedback", correct ? `Correct! ${currentVocabularyQuiz.word}: ${currentVocabularyQuiz.meaning}` : "Not quite—try again.", correct ? "correct" : "incorrect");
}

function showQuizTab(name) {
    if (!QUIZ_UI[name]) name = "kana";
    document.querySelectorAll("[data-quiz-tab]").forEach(button => button.classList.toggle("active", button.dataset.quizTab === name));
    document.querySelectorAll("[data-quiz-panel]").forEach(panel => { panel.hidden = panel.dataset.quizPanel !== name; });
    localStorage.setItem(STORAGE.activeQuiz, name);
}

const SEARCH_NUMBER_WORDS = Object.freeze(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]);
const PARTY_SIZE_FORMS = Object.freeze({
    1: { kanji:"一人", kana:"ひとり", romaji:"hitori", english:"one" },
    2: { kanji:"二人", kana:"ふたり", romaji:"futari", english:"two" },
    3: { kanji:"三人", kana:"さんにん", romaji:"sannin", english:"three" },
    4: { kanji:"四人", kana:"よにん", romaji:"yonin", english:"four" },
    5: { kanji:"五人", kana:"ごにん", romaji:"gonin", english:"five" },
    6: { kanji:"六人", kana:"ろくにん", romaji:"rokunin", english:"six" },
    7: { kanji:"七人", kana:"ななにん", romaji:"nananin", english:"seven" },
    8: { kanji:"八人", kana:"はちにん", romaji:"hachinin", english:"eight" },
    9: { kanji:"九人", kana:"きゅうにん", romaji:"kyuunin", english:"nine" },
    10: { kanji:"十人", kana:"じゅうにん", romaji:"juunin", english:"ten" }
});
const TICKET_QUANTITY_FORMS = Object.freeze({
    1: { kanji:"一枚", kana:"いちまい", romaji:"ichimai", english:"one" },
    2: { kanji:"二枚", kana:"にまい", romaji:"nimai", english:"two" },
    3: { kanji:"三枚", kana:"さんまい", romaji:"sanmai", english:"three" },
    4: { kanji:"四枚", kana:"よんまい", romaji:"yonmai", english:"four" },
    5: { kanji:"五枚", kana:"ごまい", romaji:"gomai", english:"five" },
    6: { kanji:"六枚", kana:"ろくまい", romaji:"rokumai", english:"six" },
    7: { kanji:"七枚", kana:"ななまい", romaji:"nanamai", english:"seven" },
    8: { kanji:"八枚", kana:"はちまい", romaji:"hachimai", english:"eight" },
    9: { kanji:"九枚", kana:"きゅうまい", romaji:"kyuumai", english:"nine" },
    10: { kanji:"十枚", kana:"じゅうまい", romaji:"juumai", english:"ten" }
});
const SHOPPING_QUANTITY_FORMS = Object.freeze({
    1: { kanji:"一つ", kana:"ひとつ", romaji:"hitotsu", english:"one" },
    2: { kanji:"二つ", kana:"ふたつ", romaji:"futatsu", english:"two" },
    3: { kanji:"三つ", kana:"みっつ", romaji:"mittsu", english:"three" },
    4: { kanji:"四つ", kana:"よっつ", romaji:"yottsu", english:"four" },
    5: { kanji:"五つ", kana:"いつつ", romaji:"itsutsu", english:"five" },
    6: { kanji:"六つ", kana:"むっつ", romaji:"muttsu", english:"six" },
    7: { kanji:"七つ", kana:"ななつ", romaji:"nanatsu", english:"seven" },
    8: { kanji:"八つ", kana:"やっつ", romaji:"yattsu", english:"eight" },
    9: { kanji:"九つ", kana:"ここのつ", romaji:"kokonotsu", english:"nine" },
    10: { kanji:"十", kana:"とお", romaji:"too", english:"ten" }
});

function searchText(value) {
    let normalized = String(Array.isArray(value) ? value.join(" ") : value || "")
        .normalize("NFKC")
        .replace(/\bwhere[\u2019']s\b/gi, "where is")
        .replace(/\bwe[\u2019']re\b/gi, "we are")
        .replace(/\bi[\u2019']ll\b/gi, "i will")
        .replace(/[.,!?;:\uFF0C\u3002\uFF01\uFF1F\u3001]+/g, " ")
        .replace(/[-\u2010-\u2015]+/g, " ")
        .replace(/[\u3000\s]+/g, " ")
        .trim()
        .toLocaleLowerCase();
    return normalized
        .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/g, word => String(SEARCH_NUMBER_WORDS.indexOf(word)))
        .replace(/\bpersons?\b|\bpeople\b/g, "people")
        .replace(/\bbookings?\b|\breservations?\b/g, "reservation")
        .replace(/\bwi\s+fi\b/g, "wifi")
        .replace(/\bmicrowav(?:e|ed|ing)\b/g, "heat")
        .replace(/\bpictures?\b/g, "photo")
        .replace(/[\s]+/g, " ")
        .trim();
}

function searchQuantity(query) {
    const match = searchText(query).match(/(?:^|\s)(10|[1-9])(?:\s|$)/);
    return match ? Number(match[1]) : null;
}

function detectTicketQuantity(query) {
    const normalized = searchText(query);
    if (!/\b(?:tickets?|admission|passes?)\b/.test(normalized)) return null;
    return searchQuantity(normalized);
}

function buildTicketQuantityVariant(quantity) {
    const form = TICKET_QUANTITY_FORMS[quantity];
    if (!form) return null;
    return {
        id: `smart-travel:travel.ticket-quantity:${quantity}`,
        type:"travel", category:"others", subcategory:"Tickets & Admission",
        japanese:`${form.kanji}お願いします。`, reading:`${form.kana} おねがいします。`, romaji:`${form.romaji} onegai shimasu.`,
        english:`${form.english.charAt(0).toUpperCase()}${form.english.slice(1)} ticket${quantity === 1 ? "" : "s"}, please.`, literalMeaning:`${form.english.charAt(0).toUpperCase()}${form.english.slice(1)} flat item${quantity === 1 ? "" : "s"}, please.`,
        naturalUsage:"A concise, polite request for a ticket or admission quantity. Japanese commonly counts tickets with 枚 (mai).",
        politeness:"polite", priority:"essential", tags:["ticket-quantity", "admission", `quantity-${quantity}`],
        smartVariant:true, transient:true, intent:"travel.ticket-quantity"
    };
}

function detectShoppingQuantity(query) {
    const normalized = searchText(query);
    const shoppingContext = /\bof these\b/.test(normalized) || /\bi will take\b/.test(normalized) || /\bcan i get\b.*\bthese\b/.test(normalized);
    if (!shoppingContext || /\b(?:tickets?|admission|passes?|table|people|party|platform|room|gate|exit|size|floor|pm|am)\b/.test(normalized)) return null;
    return searchQuantity(normalized);
}

function buildShoppingQuantityVariant(quantity) {
    const form = SHOPPING_QUANTITY_FORMS[quantity];
    if (!form) return null;
    return {
        id:`smart-travel:shopping.quantity:${quantity}`,
        type:"travel", category:"shopping", subcategory:"Essential",
        japanese:`これを${form.kanji}お願いします。`, reading:`これを ${form.kana} おねがいします。`, romaji:`Kore o ${form.romaji} onegai shimasu.`,
        english:`I’ll take ${form.english} of these, please.`, literalMeaning:`This, ${form.english} item${quantity === 1 ? "" : "s"}, please.`,
        naturalUsage:"A polite general-purpose shopping request when pointing to an item. The native Japanese ～つ counter is used through nine; ten is 十 (とお).",
        politeness:"polite", priority:"essential", tags:["shopping-quantity", "pointing", `quantity-${quantity}`],
        smartVariant:true, transient:true, intent:"shopping.quantity"
    };
}

function detectRestaurantPartySize(query) {
    const normalized = searchText(query);
    const partySize = searchQuantity(normalized);
    if (!partySize) return null;
    const strongContext = /\btable\b|\bpeople\b|\bparty\b|\bwe are\b|\bof us\b|\breservation\b/.test(normalized) || new RegExp(`\\bjust\\s+${partySize}\\b`).test(normalized);
    return strongContext ? partySize : null;
}

function buildRestaurantPartySizeVariant(partySize) {
    const form = PARTY_SIZE_FORMS[partySize];
    if (!form) return null;
    const peopleMeaning = partySize === 1 ? "One person" : `${form.english.charAt(0).toUpperCase()}${form.english.slice(1)} people`;
    return {
        id: `smart-travel:restaurant.party-size:${partySize}`,
        type: "travel", category: "restaurants", subcategory: "Essential",
        japanese: `すみません、${form.kanji}です。`, reading: `すみません、${form.kana}です。`, romaji: `sumimasen, ${form.romaji} desu.`,
        english: `Excuse me, table for ${form.english}.`, literalMeaning: `${peopleMeaning}.`,
        naturalUsage: "Suggested restaurant arrival phrase based on Sakura's trusted party-size template.",
        politeness: "polite", priority: "essential", tags: ["party-size", "restaurant-arrival", `people-${partySize}`],
        smartVariant: true, transient: true, intent: "restaurant.party-size", sourceId: "travel-restaurants-001"
    };
}

const TRAVEL_SEARCH_INTENTS = Object.freeze([
    Object.freeze({ id:"travel.ticket-quantity", detect:detectTicketQuantity, build:buildTicketQuantityVariant }),
    Object.freeze({ id:"shopping.quantity", detect:detectShoppingQuantity, build:buildShoppingQuantityVariant }),
    Object.freeze({ id:"restaurant.party-size", detect:detectRestaurantPartySize, build:buildRestaurantPartySizeVariant })
]);

function smartTravelSearchResults(query) {
    if (!query || !["all", "travel"].includes(searchType)) return [];
    for (const intent of TRAVEL_SEARCH_INTENTS) {
        const value = intent.detect(query);
        const item = value === null ? null : intent.build(value);
        if (item) return [{ item, score:2000 }];
    }
    return [];
}

function cleanEntryText(value) {
    return String(value || "").normalize("NFKC").replace(/[\u3000\t ]+/g, " ").trim();
}

function normalizeContentEntry(entry, forcedType = entry?.type) {
    const type = forcedType === "slang" ? "slang" : "native";
    const categories = type === "slang" ? authoritativeSlangCategories(entry?.categories) : [...new Set((Array.isArray(entry?.categories) ? entry.categories : []).map(cleanEntryText).filter(Boolean))];
    const normalized = {
        id: cleanEntryText(entry?.id), type,
        expression: cleanEntryText(entry?.expression), kana: cleanEntryText(entry?.kana), romaji: cleanEntryText(entry?.romaji),
        naturalMeaning: cleanEntryText(entry?.naturalMeaning || entry?.meaning), literalMeaning: cleanEntryText(entry?.literalMeaning || entry?.literal),
        difficulty: cleanEntryText(entry?.difficulty), categories,
        tone: cleanEntryText(entry?.tone), formality: cleanEntryText(entry?.formality), commonUsers: cleanEntryText(entry?.commonUsers || entry?.users),
        commonSituation: cleanEntryText(entry?.commonSituation || entry?.situation), whereUsed: cleanEntryText(entry?.whereUsed || entry?.whereSeen),
        learnerSafety: cleanEntryText(entry?.learnerSafety || entry?.safe), currentStatus: cleanEntryText(entry?.currentStatus || entry?.status),
        rudeOrRisky: typeof entry?.rudeOrRisky === "boolean" ? entry.rudeOrRisky : !["", "no"].includes(cleanEntryText(entry?.rude).toLowerCase()),
        exampleSentence: cleanEntryText(entry?.exampleSentence), exampleTranslation: cleanEntryText(entry?.exampleTranslation),
        conversation: cleanEntryText(entry?.conversation), nuanceNotes: cleanEntryText(entry?.nuanceNotes || entry?.notes),
        tags: [...new Set((Array.isArray(entry?.tags) ? entry.tags : []).map(cleanEntryText).filter(Boolean))], userCreated: Boolean(entry?.userCreated),
        migratedFrom: cleanEntryText(entry?.migratedFrom)
    };
    return { ...normalized, meaning: normalized.naturalMeaning, literal: normalized.literalMeaning, users: normalized.commonUsers, situation: normalized.commonSituation, whereSeen: normalized.whereUsed, safe: normalized.learnerSafety, status: normalized.currentStatus, rude: normalized.rudeOrRisky ? "Yes" : "No", notes: normalized.nuanceNotes };
}

function invalidateNormalizedContentCaches() {
    normalizedNativeDataCache = null;
    normalizedSlangDataCache = null;
}

function nativeData() {
    if (!normalizedNativeDataCache) normalizedNativeDataCache = [...loadedSearchData("NATIVE_JAPANESE_DATA", "Native Japanese").filter(entry => !entry.slangCategories?.length), ...userNativeEntries].map(entry => normalizeContentEntry(entry, "native"));
    return normalizedNativeDataCache;
}

function slangData() {
    if (!normalizedSlangDataCache) {
        const migratedNative = loadedSearchData("NATIVE_JAPANESE_DATA", "Native Japanese")
            .filter(entry => entry.slangCategories?.length)
            .map(entry => ({ ...entry, categories: entry.slangCategories, migratedFrom: "native" }));
        normalizedSlangDataCache = [...loadedSearchData("SLANG_DATA", "Slang"), ...migratedNative, ...userSlangEntries].map(entry => normalizeContentEntry(entry, "slang"));
    }
    return normalizedSlangDataCache;
}

function searchMainText(item) {
    return item.character || item.word || item.expression || item.japanese || "";
}

function searchReading(item) {
    if (item.type === "kanji") return [item.reading, ...(item.onyomi || []), ...(item.kunyomi || [])].filter(Boolean).join(" · ");
    return item.kana || item.reading || "";
}

function loadedSearchData(globalName, label) {
    const data = window[globalName];
    if (!Array.isArray(data)) {
        console.warn(`Universal Search: ${label} data failed to load (${globalName}).`);
        return [];
    }
    return data;
}

function buildSearchIndex() {
    if (!searchIndexDirty) return universalSearchIndex;
    const groups = {
        Kanji: loadedSearchData("KANJI_DATA", "Kanji"),
        Vocabulary: loadedSearchData("VOCABULARY_DATA", "Vocabulary"),
        Native: nativeData(),
        Slang: slangData(),
        Travel: window.SakuraTravelLoader?.getLoadedTravelPhrases() || [],
        Translations: savedItems.filter(item => item.type === "translation")
    };
    universalSearchIndex = Object.values(groups).flat();
    searchIndexDirty = false;
    warmSearchFields(universalSearchIndex);
    console.info(`Indexed:\n${groups.Kanji.length} Kanji\n${groups.Vocabulary.length} Vocabulary\n${groups.Native.length} Native\n${groups.Slang.length} Slang\n${groups.Travel.length} Travel`);
    return universalSearchIndex;
}

function invalidateSearchIndex() {
    searchIndexDirty = true;
    searchWarmRevision += 1;
    if (currentRoute === "search") buildSearchIndex();
}

function warmSearchFields(items) {
    const revision = ++searchWarmRevision;
    let index = 0;
    const schedule = callback => {
        if ("requestIdleCallback" in window) window.requestIdleCallback(callback, { timeout:200 });
        else setTimeout(() => callback(null), 0);
    };
    const warmChunk = deadline => {
        if (revision !== searchWarmRevision) return;
        let processed = 0;
        while (index < items.length && processed < 120 && (!deadline || deadline.didTimeout || deadline.timeRemaining() > 1)) {
            searchableFields(items[index]);
            index += 1;
            processed += 1;
        }
        if (index < items.length) schedule(warmChunk);
    };
    schedule(warmChunk);
}

function prepareTravelSearch() {
    if (travelSearchPreparation) return travelSearchPreparation;
    const loader = window.SakuraTravelLoader;
    const categories = Object.keys(window.TRAVEL_CATEGORIES || {});
    if (!loader || !categories.length) return Promise.resolve();
    const loaded = new Set(loader.getLoadedTravelCategories());
    const missing = categories.filter(category => !loaded.has(category));
    if (!missing.length) return Promise.resolve();
    travelSearchPreparation = Promise.allSettled(missing.map(category => loader.loadTravelCategory(category)))
        .then(results => {
            const unavailable = missing.filter((category, index) => results[index].status === "rejected");
            if (unavailable.length) console.warn(`Universal Search: Travel categories unavailable: ${unavailable.join(", ")}. Searching available Travel content.`);
            invalidateSearchIndex();
        })
        .finally(() => { travelSearchPreparation = null; });
    return travelSearchPreparation;
}

function prepareTravelSearchForCurrentQuery() {
    const input = document.getElementById("universal-search-input");
    if (!input?.value.trim()) return;
    prepareTravelSearch().then(() => {
        if (currentRoute === "search" && input.value.trim()) renderSearchResults();
    });
}

function searchIndex() {
    return universalSearchIndex;
}

function searchableFields(item) {
    if (!item || typeof item !== "object") return [];
    const cached = searchFieldCache.get(item);
    if (cached) return cached.all;
    const exampleFields = [...(item.examples || []), ...(item.commonWords || [])].flatMap(example => [example.word, example.reading, example.kana, example.romaji, example.meaning]);
    const primary = [
        item.character, item.kanji, item.word, item.expression, item.japanese,
        item.kana, item.reading, item.romaji, item.meaning, item.english,
        item.naturalMeaning, item.literalMeaning, item.dictionaryMeaning,
        ...(item.onyomi || []), ...(item.kunyomi || []), ...exampleFields
    ].filter(Boolean).map(searchText);
    const all = [
        ...primary, item.literal, item.notes, item.exampleSentence, item.exampleTranslation,
        item.dictionaryMeaning, item.coreConcept, item.naturalUsageNotes,
        item.naturalUsage, item.commonUsers, item.commonSituation,
        item.whereUsed, item.learnerSafety, item.currentStatus, item.nuanceNotes,
        item.conversation, item.tone, item.formality, item.users, item.situation,
        item.whereSeen, item.status, item.safe, item.rude, item.category, item.subcategory,
        item.politeness, item.priority, ...(item.categories || []), ...(item.tags || [])
    ].filter(Boolean).map(searchText);
    const result = { all:[...new Set(all)], primary:new Set(primary) };
    searchFieldCache.set(item, result);
    return result.all;
}

function searchScore(item, query) {
    const fields = searchableFields(item);
    const primary = searchFieldCache.get(item)?.primary || new Set();
    let score = 0;
    fields.forEach((field, index) => {
        if (field === query) score = Math.max(score, 1000 - index * 8);
        else if (field.startsWith(query)) score = Math.max(score, 700 - index * 6);
        else if (field.split(/\s+/).some(word => word.startsWith(query))) score = Math.max(score, 500 - index * 4);
        else if (field.includes(query)) score = Math.max(score, 300 - index * 2);
        if (primary.has(field)) {
            if (field === query) score = Math.max(score, 1200 - index * 4);
            else if (field.startsWith(query)) score = Math.max(score, 1050 - index * 3);
            else if (field.split(/\s+/).some(word => word.startsWith(query))) score = Math.max(score, 980 - index * 2);
            else if (field.includes(query)) score = Math.max(score, 760 - index);
        }
    });
    const queryTokens = query.split(/\s+/).filter(token => token.length > 1);
    if (queryTokens.length > 1 && queryTokens.every(token => fields.some(field => field.split(/\s+/).some(word => word.startsWith(token))))) score = Math.max(score, 180);
    return score;
}

function filteredSearchResults(query) {
    const normalized = searchText(query);
    if (!normalized) return [];
    const seen = new Set();
    return [...smartTravelSearchResults(query), ...searchIndex().map(item => ({ item, score: searchScore(item, normalized) }))]
        .filter(result => result.score > 0)
        .filter(result => searchType === "all" || result.item.type === searchType)
        .filter(result => !["kanji", "vocabulary"].includes(result.item.type) || searchLevels.includes(result.item.jlpt))
        .filter(result => {
            const key = itemKey(result.item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .sort((a, b) => b.score - a.score || searchMainText(a.item).localeCompare(searchMainText(b.item), "ja"));
}

function escapeSearchHtml(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function searchTypeLabel(type) {
    return ({ kanji: "Kanji", vocabulary: "Vocabulary", native: "Native", slang: "Slang", travel: "Travel", translation:"Translation" })[type] || type;
}

function searchResultMeta(item) {
    if (item.type === "travel") {
        const category = travelCategoryMetadata(item.category)?.title || travelTagLabel(item.category);
        return [category, travelTagLabel(item.priority)].filter(Boolean).join(" · ");
    }
    return item.jlpt || item.difficulty || "";
}

function renderSearchResults() {
    const input = document.getElementById("universal-search-input");
    const query = input.value.trim();
    const resultsSection = document.getElementById("search-results-section");
    const recentSection = document.getElementById("recent-searches-section");
    const clearButton = document.getElementById("clear-search-input");
    clearButton.hidden = !query;
    resultsSection.hidden = !query;
    recentSection.hidden = Boolean(query);
    if (!query) return;

    const results = filteredSearchResults(query);
    const visibleResults = results.slice(0, searchVisibleCount);
    transientSearchItems = new Map(results.filter(result => result.item.transient).map(result => [itemKey(result.item), result.item]));
    document.getElementById("search-result-summary").textContent = `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`;
    document.getElementById("search-results").innerHTML = visibleResults.map(({ item }) => {
        const saved = !item.transient && isSaved(item);
        const reading = searchReading(item);
        const meta = searchResultMeta(item);
        return `<article class="search-result-card" data-search-key="${escapeSearchHtml(itemKey(item))}">
            <button class="search-result-main" type="button" data-search-open="${escapeSearchHtml(itemKey(item))}">
                <span class="search-result-topline"><span class="search-type-tag">${searchTypeLabel(item.type)}</span>${item.smartVariant ? `<span class="status-label">Suggested phrase</span>` : ""}${meta ? `<span class="tag">${escapeSearchHtml(meta)}</span>` : ""}</span>
                <h2>${escapeSearchHtml(searchMainText(item))}</h2>
                ${reading ? `<p class="search-result-reading">${escapeSearchHtml(reading)}${item.romaji && !reading.includes(item.romaji) ? ` · ${escapeSearchHtml(item.romaji)}` : ""}</p>` : ""}
                <p class="search-result-meaning">${escapeSearchHtml(item.meaning || item.english)}</p>
            </button>
            ${item.transient ? "" : `<button class="save-button search-result-save ${saved ? "saved" : ""}" type="button" data-search-save="${escapeSearchHtml(itemKey(item))}" aria-label="${saved ? "Unsave" : "Save"} ${escapeSearchHtml(searchMainText(item))}" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>`}
        </article>`;
    }).join("");
    document.getElementById("search-empty").hidden = results.length > 0;
    const showMore = document.getElementById("show-more-search-results");
    showMore.hidden = visibleResults.length >= results.length;
    showMore.textContent = showMore.hidden ? "Show more" : `Show ${Math.min(40, results.length - visibleResults.length)} more`;
}

function resetSearchResultLimit() {
    searchVisibleCount = 40;
}

function findSearchItem(key) {
    return transientSearchItems.get(key) || searchIndex().find(item => itemKey(item) === key);
}

function addRecentSearch(query) {
    const clean = String(query || "").trim();
    if (!clean) return;
    recentSearches = [clean, ...recentSearches.filter(value => value.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    writeJson(STORAGE.recentSearches, recentSearches);
    renderRecentSearches();
}

function renderRecentSearches() {
    const list = document.getElementById("recent-search-list");
    list.innerHTML = recentSearches.map((query, index) => `<span class="recent-search-chip"><button class="recent-search-use" type="button" data-recent-index="${index}">${escapeSearchHtml(query)}</button><button class="recent-search-remove" type="button" data-remove-recent="${index}" aria-label="Remove ${escapeSearchHtml(query)}">×</button></span>`).join("");
    document.getElementById("recent-searches-empty").hidden = recentSearches.length > 0;
    document.getElementById("clear-recent-searches").hidden = recentSearches.length === 0;
}

function renderSearchJlptFilters() {
    const container = document.getElementById("search-jlpt-filters");
    container.innerHTML = "";
    JLPT_LEVELS.forEach(level => container.appendChild(createLevelChip(level, searchLevels.includes(level), event => {
        searchLevels = event.target.checked ? [...new Set([...searchLevels, level])] : searchLevels.filter(value => value !== level);
        if (!searchLevels.length) searchLevels = [...JLPT_LEVELS];
        searchLevels = normalizeJlptLevels(searchLevels, JLPT_LEVELS);
        resetSearchResultLimit();
        renderSearchJlptFilters();
        Promise.all([loadKanjiForSelection("search", searchLevels), loadVocabularyForSelection("search", searchLevels)]).then(() => renderSearchResults());
    })));
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = `all-level-button ${searchLevels.length === JLPT_LEVELS.length ? "active" : ""}`;
    allButton.textContent = "◎ All";
    allButton.addEventListener("click", () => {
        searchLevels = [...JLPT_LEVELS];
        resetSearchResultLimit();
        renderSearchJlptFilters();
        Promise.all([loadKanjiForSelection("search", searchLevels), loadVocabularyForSelection("search", searchLevels)]).then(() => renderSearchResults());
    });
    container.appendChild(allButton);
    document.getElementById("search-jlpt-summary").textContent = searchLevels.length === JLPT_LEVELS.length ? "All levels" : searchLevels.join(" + ");
}

function openSearch(returnRoute = currentRoute) {
    searchReturnRoute = ["search", "kanji-detail", "word-detail"].includes(returnRoute) ? "learn" : returnRoute;
    showRoute("search");
    Promise.all([loadKanjiForSelection("search", searchLevels), loadVocabularyForSelection("search", searchLevels)]).then(() => {
        if (currentRoute === "search") renderSearchResults();
    });
    prepareTravelSearchForCurrentQuery();
    requestAnimationFrame(() => document.getElementById("universal-search-input").focus());
}

function openSearchResult(item) {
    if (!item) return;
    addRecentSearch(document.getElementById("universal-search-input").value);
    if (item.type === "kanji") openKanjiDetail(item, "search");
    else if (item.type === "vocabulary") openWordDetail(item, "search");
    else if (item.type === "travel" && travelCategoryMetadata(item.category)) {
        if (item.smartVariant) pendingTravelSmartPhrase = item;
        else pendingTravelPhraseId = item.id;
        currentTravelFilter = "All";
        showRoute(`travel-${item.category}`);
    }
    else if (item.type === "translation") { showRoute("translate"); renderTranslationResult({id:item.id,japanese:item.expression,kana:item.kana,romaji:item.romaji,naturalMeaning:item.naturalMeaning||item.meaning,literalMeaning:item.literalMeaning||"",tone:item.tone||"",usageNote:item.notes||"",alternative:item.alternative||"",offline:false}); }
    else {
        showRoute(`learn-${item.type}`);
        document.getElementById("native-difficulty-filter").value = "All";
        refreshNativeCategories();
        document.getElementById("native-category-filter").value = "All";
        renderNative(item);
    }
}

function userEntries() {
    return [...userNativeEntries.map(entry => normalizeContentEntry(entry, "native")), ...userSlangEntries.map(entry => normalizeContentEntry(entry, "slang"))];
}

function persistUserEntries() {
    writeJson(STORAGE.userNative, userNativeEntries);
    writeJson(STORAGE.userSlang, userSlangEntries);
    nativeQueues = { native: [], slang: [] };
    nativeQueueKeys = { native: "", slang: "" };
    invalidateNormalizedContentCaches();
    invalidateSearchIndex();
    refreshNativeCategories();
    renderMyEntries();
    updateSavedUi();
}

function entryCategories(type = document.getElementById("entry-type").value) {
    return type === "slang" ? SLANG_CATEGORIES : NATIVE_CATEGORIES;
}

function renderEntryCategoryChips(selected = []) {
    const container = document.getElementById("entry-category-chips");
    container.innerHTML = "";
    entryCategories().forEach(category => {
        const label = document.createElement("label");
        label.className = "level-chip";
        label.innerHTML = `<input type="checkbox" value="${escapeSearchHtml(category)}" ${selected.includes(category) ? "checked" : ""}><span>${escapeSearchHtml(category)}</span>`;
        container.appendChild(label);
    });
}

function selectedEntryCategories() {
    return [...document.querySelectorAll("#entry-category-chips input:checked")].map(input => input.value);
}

function generateEntryId(type, expression) {
    const slug = searchText(expression).replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "entry";
    return `user-${type}-${slug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function readEntryForm() {
    const type = document.getElementById("entry-type").value;
    return normalizeContentEntry({
        id: document.getElementById("entry-edit-id").value || generateEntryId(type, document.getElementById("entry-expression").value), type,
        expression: document.getElementById("entry-expression").value, kana: document.getElementById("entry-kana").value,
        romaji: document.getElementById("entry-romaji").value, naturalMeaning: document.getElementById("entry-natural-meaning").value,
        literalMeaning: document.getElementById("entry-literal-meaning").value, difficulty: document.getElementById("entry-difficulty").value,
        categories: selectedEntryCategories(), tone: document.getElementById("entry-tone").value, formality: document.getElementById("entry-formality").value,
        commonUsers: document.getElementById("entry-common-users").value, commonSituation: document.getElementById("entry-common-situation").value,
        whereUsed: document.getElementById("entry-where-used").value, learnerSafety: document.getElementById("entry-learner-safety").value,
        currentStatus: document.getElementById("entry-current-status").value, rudeOrRisky: document.getElementById("entry-rude-risky").checked,
        exampleSentence: document.getElementById("entry-example-sentence").value, exampleTranslation: document.getElementById("entry-example-translation").value,
        conversation: document.getElementById("entry-conversation").value, nuanceNotes: document.getElementById("entry-nuance-notes").value,
        tags: document.getElementById("entry-tags").value.split(",").map(cleanEntryText).filter(Boolean), userCreated: true
    }, type);
}

function validateUserEntry(entry, editingId = "", checkDuplicates = true) {
    const errors = [];
    if (!entry.expression) errors.push("Expression is required.");
    if (!entry.naturalMeaning) errors.push("Natural English meaning is required.");
    if (!["Beginner", "Intermediate", "Advanced"].includes(entry.difficulty)) errors.push("Choose a difficulty.");
    if (!entry.categories.length) errors.push("Choose at least one category.");
    if (checkDuplicates) {
        const duplicate = [...nativeData(), ...slangData()].find(item => item.id !== editingId && searchText(item.expression) === searchText(entry.expression));
        if (duplicate) errors.push(`“${entry.expression}” already exists.`);
    }
    return errors;
}

function possibleNearDuplicate(entry, editingId = "") {
    const needle = searchText(entry.expression);
    return [...nativeData(), ...slangData()].find(item => item.id !== editingId && needle && (searchText(item.expression).includes(needle) || needle.includes(searchText(item.expression))) && searchText(item.expression) !== needle);
}

function resetEntryForm(entry = null) {
    document.getElementById("entry-form").reset();
    const value = entry ? normalizeContentEntry(entry, entry.type) : null;
    document.getElementById("entry-edit-id").value = value?.id || "";
    document.getElementById("entry-type").value = value?.type || "native";
    const fields = { expression: "entry-expression", kana: "entry-kana", romaji: "entry-romaji", naturalMeaning: "entry-natural-meaning", literalMeaning: "entry-literal-meaning", difficulty: "entry-difficulty", tone: "entry-tone", formality: "entry-formality", commonUsers: "entry-common-users", commonSituation: "entry-common-situation", whereUsed: "entry-where-used", learnerSafety: "entry-learner-safety", currentStatus: "entry-current-status", exampleSentence: "entry-example-sentence", exampleTranslation: "entry-example-translation", conversation: "entry-conversation", nuanceNotes: "entry-nuance-notes" };
    Object.entries(fields).forEach(([key, id]) => { document.getElementById(id).value = value?.[key] || (key === "currentStatus" ? "Still common" : ""); });
    document.getElementById("entry-rude-risky").checked = Boolean(value?.rudeOrRisky);
    document.getElementById("entry-tags").value = value?.tags?.join(", ") || "";
    renderEntryCategoryChips(value?.categories || []);
    document.getElementById("entry-form-message").textContent = "";
}

function showEntryTab(name) {
    document.querySelectorAll("[data-entry-tab]").forEach(button => button.classList.toggle("active", button.dataset.entryTab === name));
    document.querySelectorAll("[data-entry-panel]").forEach(panel => { panel.hidden = panel.dataset.entryPanel !== name; });
    if (name === "list") renderMyEntries();
}

function renderMyEntries() {
    const query = searchText(document.getElementById("my-entry-search")?.value || "");
    const type = document.getElementById("my-entry-type-filter")?.value || "all";
    const entries = userEntries().filter(entry => (type === "all" || entry.type === type) && (!query || searchableFields(entry).some(field => field.includes(query))));
    const container = document.getElementById("my-entry-list");
    if (!container) return;
    container.innerHTML = entries.map(entry => `<article class="my-entry-card"><span class="search-type-tag">${searchTypeLabel(entry.type)}</span><h3>${escapeSearchHtml(entry.expression)}</h3><p>${escapeSearchHtml(entry.naturalMeaning)}</p><div><button type="button" data-edit-user-entry="${entry.id}">Edit</button><button type="button" data-delete-user-entry="${entry.id}">Delete</button></div></article>`).join("");
    document.getElementById("my-entry-empty").hidden = entries.length > 0;
}

function exportUserEntries() {
    const payload = { app: "Sakura", schemaVersion: 1, exportedAt: new Date().toISOString(), native: userNativeEntries, slang: userSlangEntries };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = `sakura-user-entries-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url);
}

async function importUserEntries(file) {
    let payload;
    try { payload = JSON.parse(await file.text()); }
    catch { document.getElementById("entry-import-message").textContent = "Import failed: the file is not valid JSON."; return; }
    if (!payload || (!Array.isArray(payload.native) && !Array.isArray(payload.slang))) {
        document.getElementById("entry-import-message").textContent = "Import failed: this JSON does not contain Native or Slang entry arrays.";
        return;
    }
    const candidates = [...(Array.isArray(payload?.native) ? payload.native.map(entry => ({ ...entry, type: "native" })) : []), ...(Array.isArray(payload?.slang) ? payload.slang.map(entry => ({ ...entry, type: "slang" })) : [])];
    let added = 0, skipped = 0, invalid = 0;
    candidates.forEach(raw => {
        const entry = normalizeContentEntry({ ...raw, userCreated: true }, raw.type);
        if (validateUserEntry(entry, "", false).length) { invalid += 1; return; }
        if ([...nativeData(), ...slangData()].some(item => item.id === entry.id || searchText(item.expression) === searchText(entry.expression))) { skipped += 1; return; }
        (entry.type === "slang" ? userSlangEntries : userNativeEntries).push(entry); added += 1;
    });
    persistUserEntries();
    document.getElementById("entry-import-message").textContent = `Import complete: ${added} added, ${skipped} skipped, ${invalid} invalid.`;
}

function nativePool() {
    const source = currentNativeMode === "slang" ? slangData() : nativeData();
    const difficulty = document.getElementById("native-difficulty-filter").value;
    const category = document.getElementById("native-category-filter").value;
    return source.filter(item => (difficulty === "All" || item.difficulty === difficulty) && (category === "All" || item.categories.includes(category)));
}

function refreshNativeCategories() {
    const select = document.getElementById("native-category-filter");
    const previous = select.value;
    if (currentNativeMode === "slang") {
        select.innerHTML = SLANG_CATEGORY_OPTIONS.map(([value, label]) => `<option value="${escapeSearchHtml(value)}">${escapeSearchHtml(label)}</option>`).join("");
        select.value = SLANG_CATEGORY_OPTIONS.some(([value]) => value === previous) ? previous : "All";
        return;
    }
    const categories = [...new Set(nativeData().flatMap(item => item.categories))].sort();
    select.innerHTML = `<option>All</option>${categories.map(category => `<option>${category}</option>`).join("")}`;
    select.value = categories.includes(previous) ? previous : "All";
}

function renderNative(item) {
    currentNativeItem = item;
    const empty = document.getElementById("native-empty");
    empty.hidden = Boolean(item);
    empty.textContent = currentNativeMode === "slang" ? "No entries here yet 🌸 This collection is still growing." : "No content is available for these filters.";
    document.getElementById("native-status").textContent = item?.status || "No match";
    document.getElementById("native-expression").textContent = item?.expression || "—";
    renderOptionalText("native-reading", item?.kana);
    renderOptionalText("native-romaji", item?.romaji);
    document.getElementById("native-meaning").textContent = item?.meaning || "No content is available for these filters.";
    document.getElementById("native-details").innerHTML = item ? `
        <div class="detail-box"><strong>Literal meaning</strong><p>${item.literal}</p></div>
        <div class="detail-box"><strong>Example</strong><p>${item.exampleSentence}<br>${item.exampleTranslation}</p></div>
        <div class="detail-box"><strong>Conversation</strong><pre>${item.conversation}</pre></div>
        <div class="detail-box"><strong>Tone &amp; formality</strong><p>${item.tone}<br>${item.formality}</p></div>
        <div class="detail-box"><strong>Who &amp; where</strong><p>${item.users}<br>${item.whereSeen}</p></div>
        <div class="detail-box"><strong>Learner note</strong><p>Rude? ${item.rude}<br>Safe? ${item.safe}<br>${item.notes}</p></div>` : "";
    setSaveButton(document.getElementById("save-native-item"), item);
}

function browseNative(direction = 1, random = false) {
    const pool = nativePool();
    if (random) {
        const filterKey = `${currentNativeMode}|${document.getElementById("native-difficulty-filter").value}|${document.getElementById("native-category-filter").value}|${pool.map(item => item.id).join(",")}`;
        if (nativeQueueKeys[currentNativeMode] !== filterKey || !nativeQueues[currentNativeMode].length) {
            const recent = new Set((nativeRecentHistory[currentNativeMode] || []).slice(-10));
            const fresh = pool.filter(item => !recent.has(item.id));
            const delayed = pool.filter(item => recent.has(item.id));
            nativeQueues[currentNativeMode] = shuffleItems(fresh).concat(shuffleItems(delayed));
            if (nativeQueues[currentNativeMode].length > 1 && nativeQueues[currentNativeMode][0]?.id === currentNativeItem?.id) {
                [nativeQueues[currentNativeMode][0], nativeQueues[currentNativeMode][1]] = [nativeQueues[currentNativeMode][1], nativeQueues[currentNativeMode][0]];
            }
            nativeQueueKeys[currentNativeMode] = filterKey;
        }
        const item = nativeQueues[currentNativeMode].shift() || null;
        if (item) {
            nativeRecentHistory[currentNativeMode] = [...(nativeRecentHistory[currentNativeMode] || []), item.id].slice(-10);
            writeJson(STORAGE.nativeHistory, nativeRecentHistory);
        }
        renderNative(item);
        return;
    }
    const index = pickIndex(pool, currentNativeItem, direction, random);
    renderNative(index < 0 ? null : pool[index]);
}

function travelCategoryMetadata(category) {
    return window.TRAVEL_CATEGORIES?.[category] || null;
}

function travelPhrasePool() {
    if (!currentTravelCategory || !window.SakuraTravelLoader) return [];
    const phrases = window.SakuraTravelLoader.getTravelPhrasesByCategory(currentTravelCategory);
    return currentTravelFilter === "All" ? phrases : phrases.filter(phrase => phrase.subcategory === currentTravelFilter);
}

function travelTagLabel(value) {
    return String(value || "").split("-").map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function renderTravelPhraseCard(phrase) {
    currentTravelPhrase = phrase || null;
    const list = document.getElementById("travel-phrase-list");
    const empty = document.getElementById("travel-category-empty");
    const controls = ["previous-travel-phrase", "random-travel-phrase", "next-travel-phrase"].map(id => document.getElementById(id));
    const pool = travelPhrasePool();
    const isSmartVariant = Boolean(phrase?.smartVariant);
    controls.forEach(button => { button.disabled = !phrase || !pool.length || isSmartVariant; });
    empty.hidden = Boolean(phrase);
    if (!phrase) {
        list.innerHTML = "";
        document.getElementById("travel-category-status").textContent = "0 phrases";
        return;
    }
    const position = Math.max(0, pool.findIndex(item => item.id === phrase.id));
    currentTravelIndex = position;
    document.getElementById("travel-category-status").textContent = isSmartVariant ? `Suggested phrase · ${travelCategoryMetadata(phrase.category)?.title || "Travel"}` : pool.length ? `${position + 1} of ${pool.length} · ${currentTravelFilter}` : "Saved travel phrase";
    const saved = !isSmartVariant && isSaved(phrase);
    list.innerHTML = `<article class="travel-phrase-card">
        <div class="card-topline"><span class="status-label">${escapeSearchHtml(isSmartVariant ? "Suggested phrase" : phrase.subcategory)}</span>${isSmartVariant ? "" : `<button class="save-button ${saved ? "saved" : ""}" type="button" data-save-travel-phrase aria-label="${saved ? "Unsave" : "Save"} travel phrase" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>`}</div>
        <h2>${escapeSearchHtml(phrase.japanese)}</h2>
        <p class="travel-reading">${escapeSearchHtml(phrase.reading)}</p>
        <p class="travel-romaji">${escapeSearchHtml(phrase.romaji)}</p>
        <p class="travel-english">${escapeSearchHtml(phrase.english)}</p>
        <div class="travel-phrase-tags"><span>${escapeSearchHtml(travelTagLabel(phrase.priority))}</span><span>${escapeSearchHtml(travelTagLabel(phrase.politeness))}</span></div>
        <details class="travel-phrase-details"><summary>Usage details</summary><div><strong>Literal meaning</strong><p>${escapeSearchHtml(phrase.literalMeaning || "—")}</p><strong>Natural usage</strong><p>${escapeSearchHtml(phrase.naturalUsage || "—")}</p>${phrase.tags?.length ? `<strong>Tags</strong><p>${phrase.tags.map(escapeSearchHtml).join(" · ")}</p>` : ""}</div></details>
    </article>`;
}

function renderTravelFilters(category) {
    const metadata = travelCategoryMetadata(category);
    const container = document.getElementById("travel-category-filters");
    if (!metadata) { container.innerHTML = ""; return; }
    container.innerHTML = metadata.filters.map(filter => `<button class="search-filter-chip ${filter === currentTravelFilter ? "active" : ""}" type="button" data-travel-filter="${escapeSearchHtml(filter)}" aria-pressed="${filter === currentTravelFilter}">${escapeSearchHtml(filter)}</button>`).join("");
}

function browseTravelPhrase(direction = 1, random = false) {
    const pool = travelPhrasePool();
    if (!pool.length) { renderTravelPhraseCard(null); return; }
    const existingIndex = pool.findIndex(phrase => phrase.id === currentTravelPhrase?.id);
    if (random && pool.length > 1) {
        const alternatives = pool.filter(phrase => phrase.id !== currentTravelPhrase?.id);
        currentTravelIndex = Math.floor(Math.random() * alternatives.length);
        renderTravelPhraseCard(alternatives[currentTravelIndex]);
        return;
    }
    const baseIndex = existingIndex >= 0 ? existingIndex : 0;
    currentTravelIndex = (baseIndex + direction + pool.length) % pool.length;
    renderTravelPhraseCard(pool[currentTravelIndex]);
}

async function renderTravelCategory(category) {
    const metadata = travelCategoryMetadata(category);
    if (!metadata) {
        console.warn(`Travel Mode: invalid category ${JSON.stringify(category)}.`);
        showRoute("travel");
        return;
    }
    const revision = ++travelRenderRevision;
    const categoryChanged = currentTravelCategory !== category;
    currentTravelCategory = category;
    if (categoryChanged) currentTravelFilter = "All";
    document.getElementById("travel-category-icon").textContent = metadata.icon;
    document.getElementById("travel-category-heading").textContent = metadata.title;
    document.getElementById("travel-category-description").textContent = metadata.description;
    document.getElementById("travel-category-status").textContent = "Loading travel phrases…";
    document.getElementById("travel-category-empty").hidden = true;
    document.getElementById("travel-phrase-list").innerHTML = "";
    renderTravelFilters(category);
    if (pendingTravelSmartPhrase?.category === category) {
        const smartPhrase = pendingTravelSmartPhrase;
        pendingTravelSmartPhrase = null;
        renderTravelPhraseCard(smartPhrase);
        return;
    }
    try {
        await window.SakuraTravelLoader.loadTravelCategory(category);
        if (revision !== travelRenderRevision || currentRoute !== `travel-${category}`) return;
        invalidateSearchIndex();
        const pool = travelPhrasePool();
        currentTravelIndex = 0;
        const requestedPhrase = pendingTravelPhraseId ? pool.find(phrase => phrase.id === pendingTravelPhraseId) : null;
        pendingTravelPhraseId = "";
        renderTravelPhraseCard(requestedPhrase || pool[0] || null);
    }
    catch (error) {
        if (revision !== travelRenderRevision || currentRoute !== `travel-${category}`) return;
        pendingTravelPhraseId = "";
        console.warn(`Travel Mode: ${category} is unavailable.`, error);
        document.getElementById("travel-category-status").textContent = "Travel phrases could not be loaded.";
        document.getElementById("travel-category-empty").hidden = false;
        document.getElementById("travel-category-empty").querySelector("strong").textContent = "This category is unavailable offline.";
        document.getElementById("travel-category-empty").querySelector("p").textContent = "Open it once while online to make it available offline.";
        ["previous-travel-phrase", "random-travel-phrase", "next-travel-phrase"].forEach(id => { document.getElementById(id).disabled = true; });
    }
}

function shuffleItems(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const other = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
}

function itemTitle(item) {
    return item?.character || item?.word || item?.expression || item?.japanese || "Saved item";
}

function itemReading(item) {
    return item?.reading || item?.kana || "";
}

function renderSavedItems() {
    const type = document.getElementById("saved-type-filter").value;
    const level = document.getElementById("saved-level-filter").value;
    const filtered = savedItems.filter(item => (type === "all" || item.type === type) && (level === "all" || item.jlpt === level));
    document.getElementById("saved-items").innerHTML = filtered.map(item => `<article class="saved-item-card"><span class="tag">${item.jlpt || item.difficulty || item.category || item.type}</span><button class="saved-item-open" type="button" data-open-saved-key="${itemKey(item)}"><strong class="saved-item-title">${itemTitle(item)}</strong><span>${itemReading(item)}</span><span>${item.meaning || item.english || ""}</span></button><button class="remove-saved-button" type="button" data-remove-key="${itemKey(item)}">Remove</button></article>`).join("");
    document.getElementById("saved-empty").hidden = filtered.length > 0;
    document.getElementById("start-flashcards").disabled = savedItems.length === 0;
}

function openSavedItem(item) {
    if (!item) return;
    if (item.type === "kanji") openKanjiDetail(item, "saved");
    else if (item.type === "vocabulary") openWordDetail(item, "saved");
    else if (["native", "slang"].includes(item.type)) {
        showRoute(`learn-${item.type}`);
        document.getElementById("native-difficulty-filter").value = "All";
        refreshNativeCategories();
        document.getElementById("native-category-filter").value = "All";
        renderNative(item);
    }
    else if (item.type === "travel" && travelCategoryMetadata(item.category)) {
        showRoute(`travel-${item.category}`);
        window.SakuraTravelLoader.loadTravelCategory(item.category).then(records => {
            if (currentRoute !== `travel-${item.category}`) return;
            const phrase = records.find(record => record.id === item.id) || item;
            currentTravelFilter = phrase.subcategory || "All";
            renderTravelFilters(item.category);
            renderTravelPhraseCard(phrase);
        }).catch(() => {
            if (currentRoute === `travel-${item.category}`) renderTravelPhraseCard(item);
        });
    }
    else if (item.type === "translation") {
        showRoute("translate");
        renderTranslationResult({ id:item.id, japanese:item.expression, kana:item.kana, romaji:item.romaji, naturalMeaning:item.naturalMeaning || item.meaning, literalMeaning:item.literalMeaning || "", tone:item.tone || "", usageNote:item.notes || "", alternative:item.alternative || "", offline:false });
    }
}

const SAVED_TRAVEL_FILTERS = Object.freeze([
    ["all", "All"], ["trains", "Trains"], ["restaurants", "Food"], ["shopping", "Shopping"],
    ["hotels", "Hotels"], ["taxi", "Taxi"], ["emergencies", "Emergency"], ["others", "Others"]
]);

function savedTravelItems() {
    return savedItems.filter(item => item?.type === "travel" && !item.transient && !item.smartVariant);
}

function cleanPinnedTravelIds(items = savedTravelItems()) {
    const savedIds = new Set(items.map(item => item.id));
    const clean = [...new Set(pinnedTravelPhraseIds.filter(id => savedIds.has(id)))];
    if (clean.length !== pinnedTravelPhraseIds.length || clean.some((id, index) => id !== pinnedTravelPhraseIds[index])) {
        pinnedTravelPhraseIds = clean;
        writeJson(STORAGE.pinnedTravelPhrases, pinnedTravelPhraseIds);
    }
    return clean;
}

function travelPouchCard(item, pinned = false) {
    const isPinned = pinnedTravelPhraseIds.includes(item.id);
    return `<article class="travel-pouch-card ${pinned ? "pinned" : ""}"><button class="travel-pouch-open" type="button" data-open-travel-saved="${escapeSearchHtml(itemKey(item))}"><strong>${escapeSearchHtml(item.japanese)}</strong><span>${escapeSearchHtml(item.reading || item.romaji || "")}</span><small>${escapeSearchHtml(item.english || "")}</small></button><button class="travel-pin-button ${isPinned ? "active" : ""}" type="button" data-pin-travel-id="${escapeSearchHtml(item.id)}" aria-pressed="${isPinned}">${isPinned ? "Unpin" : "Pin"}</button></article>`;
}

function renderMyTravelPhrases() {
    const content = document.getElementById("travel-pouch-content");
    if (!content) return;
    const items = savedTravelItems();
    const cleanPins = cleanPinnedTravelIds(items);
    const byId = new Map(items.map(item => [item.id, item]));
    const pinned = cleanPins.map(id => byId.get(id)).filter(Boolean);
    const recent = items.map((item, index) => ({ item, index, time: Number.isNaN(Date.parse(item.savedAt)) ? 0 : Date.parse(item.savedAt) }))
        .sort((a, b) => b.time - a.time || b.index - a.index).slice(0, 8).map(entry => entry.item);
    const filtered = savedTravelCategoryFilter === "all" ? items : items.filter(item => item.category === savedTravelCategoryFilter);
    document.getElementById("travel-pouch-empty").hidden = items.length > 0;
    content.hidden = items.length === 0;
    document.getElementById("travel-pinned-list").innerHTML = pinned.map(item => travelPouchCard(item, true)).join("");
    document.getElementById("travel-pinned-empty").hidden = pinned.length > 0;
    document.getElementById("travel-pinned-count").textContent = String(pinned.length);
    document.getElementById("travel-recent-list").innerHTML = recent.map(item => travelPouchCard(item)).join("");
    document.getElementById("travel-all-list").innerHTML = filtered.map(item => travelPouchCard(item)).join("");
    document.getElementById("travel-all-count").textContent = String(items.length);
    document.getElementById("travel-filter-empty").hidden = filtered.length > 0;
    document.getElementById("travel-saved-filters").innerHTML = SAVED_TRAVEL_FILTERS.map(([category, label]) => `<button class="search-filter-chip ${category === savedTravelCategoryFilter ? "active" : ""}" type="button" data-saved-travel-filter="${category}" aria-pressed="${category === savedTravelCategoryFilter}">${label}</button>`).join("");
}

function togglePinnedTravelPhrase(id) {
    const item = savedTravelItems().find(saved => saved.id === id);
    if (!item) return;
    pinnedTravelPhraseIds = pinnedTravelPhraseIds.includes(id) ? pinnedTravelPhraseIds.filter(savedId => savedId !== id) : [...pinnedTravelPhraseIds, id];
    writeJson(STORAGE.pinnedTravelPhrases, pinnedTravelPhraseIds);
    renderMyTravelPhrases();
}

const TRAVEL_DECK_ICONS = Object.freeze(["🌸", "🚆", "🍜", "🛍️", "🏨", "🚕", "🎟️", "🎤", "⛩️", "🎢", "📍", "🗺️", "❤️", "⭐"]);

function writeTravelDecks() {
    writeJson(STORAGE.travelPhraseDecks, travelPhraseDecks);
}

function makeTravelDeckId() {
    return `deck-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`;
}

function cleanTravelDecks() {
    const validIds = new Set(savedTravelItems().map(item => item.id));
    let changed = false;
    travelPhraseDecks = travelPhraseDecks.filter(deck => deck && typeof deck.id === "string").map(deck => {
        const phraseIds = [...new Set((Array.isArray(deck.phraseIds) ? deck.phraseIds : []).filter(id => validIds.has(id)))];
        if (phraseIds.length !== (deck.phraseIds?.length || 0)) changed = true;
        return { ...deck, phraseIds };
    });
    if (changed) writeTravelDecks();
}

function travelDeckById(id = currentTravelDeckId) {
    return travelPhraseDecks.find(deck => deck.id === id) || null;
}

function renderTravelDecks() {
    const list = document.getElementById("travel-deck-list");
    if (!list) return;
    list.innerHTML = travelPhraseDecks.map(deck => `<button class="travel-deck-card" type="button" data-open-travel-deck="${escapeSearchHtml(deck.id)}"><span aria-hidden="true">${escapeSearchHtml(deck.icon || "🌸")}</span><strong>${escapeSearchHtml(deck.name)}</strong><small>${deck.phraseIds.length} phrase${deck.phraseIds.length === 1 ? "" : "s"}</small><b aria-hidden="true">→</b></button>`).join("");
    document.getElementById("travel-decks-empty").hidden = travelPhraseDecks.length > 0;
}

function deckPhraseCard(item) {
    return `<article class="travel-pouch-card"><button class="travel-pouch-open" type="button" data-open-deck-phrase="${escapeSearchHtml(itemKey(item))}"><strong>${escapeSearchHtml(item.japanese)}</strong><span>${escapeSearchHtml(item.reading || item.romaji || "")}</span><small>${escapeSearchHtml(item.english || "")}</small></button><button class="travel-pin-button" type="button" data-remove-deck-phrase="${escapeSearchHtml(item.id)}">Remove</button></article>`;
}

function renderCurrentTravelDeck() {
    const heading = document.getElementById("travel-deck-heading");
    if (!heading) return;
    const deck = travelDeckById();
    if (!deck) {
        heading.textContent = "Deck not found";
        document.getElementById("travel-deck-phrases").innerHTML = "";
        document.getElementById("travel-deck-empty").hidden = false;
        return;
    }
    const byId = new Map(savedTravelItems().map(item => [item.id, item]));
    const phrases = deck.phraseIds.map(id => byId.get(id)).filter(Boolean);
    document.getElementById("travel-deck-icon").textContent = deck.icon || "🌸";
    heading.textContent = deck.name;
    document.getElementById("travel-deck-count").textContent = `${phrases.length} phrase${phrases.length === 1 ? "" : "s"}`;
    document.getElementById("travel-deck-phrases").innerHTML = phrases.map(deckPhraseCard).join("");
    document.getElementById("travel-deck-empty").hidden = phrases.length > 0;
}

function renderTravelDeckIcons() {
    document.getElementById("travel-deck-icons").innerHTML = TRAVEL_DECK_ICONS.map(icon => `<button class="deck-icon-button ${icon === travelDeckIconChoice ? "active" : ""}" type="button" data-deck-icon="${icon}" aria-pressed="${icon === travelDeckIconChoice}">${icon}</button>`).join("");
}

function openTravelDeckEditor(deck = null) {
    travelDeckIconChoice = deck?.icon || "🌸";
    document.getElementById("travel-deck-edit-id").value = deck?.id || "";
    document.getElementById("travel-deck-name").value = deck?.name || "";
    document.getElementById("travel-deck-editor-heading").textContent = deck ? "Edit Deck" : "Create Deck";
    document.getElementById("delete-travel-deck").hidden = !deck;
    document.getElementById("travel-deck-form-message").textContent = "";
    renderTravelDeckIcons();
    document.getElementById("travel-deck-editor").showModal();
}

function saveTravelDeck(event) {
    event.preventDefault();
    const name = document.getElementById("travel-deck-name").value.trim();
    const message = document.getElementById("travel-deck-form-message");
    if (!name) { message.textContent = "Enter a deck name."; return; }
    if (name.length > 50) { message.textContent = "Keep the deck name to 50 characters or fewer."; return; }
    const id = document.getElementById("travel-deck-edit-id").value;
    const now = new Date().toISOString();
    if (id) travelPhraseDecks = travelPhraseDecks.map(deck => deck.id === id ? { ...deck, name, icon:travelDeckIconChoice, updatedAt:now } : deck);
    else {
        const deck = { id:makeTravelDeckId(), name, icon:travelDeckIconChoice, phraseIds:[], createdAt:now, updatedAt:now };
        travelPhraseDecks.push(deck);
        currentTravelDeckId = deck.id;
    }
    writeTravelDecks();
    document.getElementById("travel-deck-editor").close();
    renderTravelDecks();
    if (currentTravelDeckId) showRoute(`travel-deck-${currentTravelDeckId}`);
}

function deleteCurrentTravelDeck() {
    const id = document.getElementById("travel-deck-edit-id").value;
    const deck = travelDeckById(id);
    if (!deck || !window.confirm(`Delete “${deck.name}”? Saved phrases and pins will not be removed.`)) return;
    travelPhraseDecks = travelPhraseDecks.filter(item => item.id !== id);
    writeTravelDecks();
    currentTravelDeckId = "";
    document.getElementById("travel-deck-editor").close();
    showRoute("travel-decks");
}

function pickerEligibleTravelItems() {
    const query = searchText(document.getElementById("travel-deck-picker-search")?.value || "");
    return savedTravelItems().filter(item => travelDeckPickerFilter === "all" || item.category === travelDeckPickerFilter).filter(item => !query || searchableFields(item).some(field => field.includes(query)));
}

function renderTravelDeckPicker() {
    const deck = travelDeckById();
    if (!deck) return;
    document.getElementById("travel-deck-picker-filters").innerHTML = SAVED_TRAVEL_FILTERS.map(([category, label]) => `<button class="search-filter-chip ${category === travelDeckPickerFilter ? "active" : ""}" type="button" data-deck-picker-filter="${category}" aria-pressed="${category === travelDeckPickerFilter}">${label}</button>`).join("");
    const items = pickerEligibleTravelItems();
    document.getElementById("travel-deck-picker-list").innerHTML = items.map(item => { const selected=travelDeckPickerSelection.has(item.id); return `<label class="travel-deck-picker-item ${selected ? "selected" : ""}"><input type="checkbox" data-deck-picker-id="${escapeSearchHtml(item.id)}" ${selected ? "checked" : ""}><span><strong>${escapeSearchHtml(item.japanese)}</strong><small>${escapeSearchHtml(item.reading || item.romaji || "")}<br>${escapeSearchHtml(item.english || "")}</small></span></label>`; }).join("");
    document.getElementById("travel-deck-picker-empty").hidden = items.length > 0;
}

function openTravelDeckPicker() {
    const deck = travelDeckById();
    if (!deck) return;
    travelDeckPickerFilter = "all";
    travelDeckPickerSelection = new Set(deck.phraseIds);
    document.getElementById("travel-deck-picker-search").value = "";
    renderTravelDeckPicker();
    document.getElementById("travel-deck-picker").showModal();
}

function saveTravelDeckPicker() {
    const deck = travelDeckById();
    if (!deck) return;
    const validIds = new Set(savedTravelItems().map(item => item.id));
    deck.phraseIds = [...new Set([...deck.phraseIds, ...travelDeckPickerSelection].filter(id => validIds.has(id)))];
    deck.updatedAt = new Date().toISOString();
    writeTravelDecks();
    document.getElementById("travel-deck-picker").close();
    renderTravelDecks();
    renderCurrentTravelDeck();
}

function removePhraseFromCurrentDeck(id) {
    const deck = travelDeckById();
    if (!deck) return;
    deck.phraseIds = deck.phraseIds.filter(phraseId => phraseId !== id);
    deck.updatedAt = new Date().toISOString();
    writeTravelDecks();
    renderTravelDecks();
    renderCurrentTravelDeck();
}

const TRAVEL_NOTE_CATEGORIES = Object.freeze({
    general:{ label:"General", icon:"🌸" }, hotel:{ label:"Hotel", icon:"🏨" }, food:{ label:"Food", icon:"🍜" },
    transport:{ label:"Transport", icon:"🚆" }, event:{ label:"Event", icon:"🎟️" }, shopping:{ label:"Shopping", icon:"🛍️" }, place:{ label:"Place", icon:"📍" }
});

function writeTravelNotes() {
    writeJson(STORAGE.travelNotes, travelNotes);
}

function makeTravelNoteId() {
    return `note-${globalThis.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`}`;
}

function travelNoteById(id = currentTravelNoteId) {
    return travelNotes.find(note => note.id === id) || null;
}

function normalizedTravelNotes() {
    return travelNotes.filter(note => note && typeof note.id === "string" && typeof note.content === "string").sort((a, b) => {
        const aTime = Date.parse(a.updatedAt || a.createdAt) || 0;
        const bTime = Date.parse(b.updatedAt || b.createdAt) || 0;
        return bTime - aTime;
    });
}

function filteredTravelNotes() {
    const input = document.getElementById("travel-note-search");
    const query = String(input?.value || "").normalize("NFKC").trim().toLocaleLowerCase();
    return normalizedTravelNotes().filter(note => travelNoteCategoryFilter === "all" || note.category === travelNoteCategoryFilter).filter(note => {
        if (!query) return true;
        const category = TRAVEL_NOTE_CATEGORIES[note.category]?.label || "General";
        return [note.title, note.content, category].some(value => String(value || "").normalize("NFKC").toLocaleLowerCase().includes(query));
    });
}

function travelNoteCard(note) {
    const category = TRAVEL_NOTE_CATEGORIES[note.category] || TRAVEL_NOTE_CATEGORIES.general;
    const preview = note.content.replace(/\s+/g, " ").trim().slice(0, 120);
    return `<button class="travel-note-card" type="button" data-open-travel-note="${escapeSearchHtml(note.id)}"><span class="travel-note-card-icon" aria-hidden="true">${category.icon}</span><span><strong>${escapeSearchHtml(note.title?.trim() || "Untitled Note")}</strong><small>${escapeSearchHtml(preview)}${note.content.length > 120 ? "…" : ""}</small><em>${escapeSearchHtml(category.label)}${note.pinned ? " · Pinned" : ""}</em></span><b aria-hidden="true">→</b></button>`;
}

function renderTravelNotes() {
    const allList = document.getElementById("travel-notes-all");
    if (!allList) return;
    const allNotes = normalizedTravelNotes();
    const filtered = filteredTravelNotes();
    const pinned = filtered.filter(note => note.pinned);
    document.getElementById("travel-note-filters").innerHTML = [["all", "All"], ...Object.entries(TRAVEL_NOTE_CATEGORIES).map(([id, category]) => [id, category.label])].map(([id, label]) => `<button class="search-filter-chip ${id === travelNoteCategoryFilter ? "active" : ""}" type="button" data-travel-note-filter="${id}" aria-pressed="${id === travelNoteCategoryFilter}">${label}</button>`).join("");
    document.getElementById("travel-notes-empty").hidden = allNotes.length > 0;
    document.getElementById("travel-notes-all-section").hidden = allNotes.length === 0;
    document.getElementById("travel-notes-pinned-section").hidden = pinned.length === 0;
    document.getElementById("travel-notes-pinned").innerHTML = pinned.map(travelNoteCard).join("");
    document.getElementById("travel-notes-pinned-count").textContent = String(pinned.length);
    allList.innerHTML = filtered.map(travelNoteCard).join("");
    document.getElementById("travel-notes-count").textContent = String(filtered.length);
    document.getElementById("travel-notes-filter-empty").hidden = filtered.length > 0;
}

function openTravelNoteEditor(note = null) {
    document.getElementById("travel-note-edit-id").value = note?.id || "";
    document.getElementById("travel-note-title").value = note?.title || "";
    document.getElementById("travel-note-category").value = TRAVEL_NOTE_CATEGORIES[note?.category] ? note.category : "general";
    document.getElementById("travel-note-content").value = note?.content || "";
    document.getElementById("travel-note-editor-heading").textContent = note ? "Edit Note" : "Create Note";
    document.getElementById("travel-note-form-message").textContent = "";
    document.getElementById("travel-note-editor").showModal();
}

function saveTravelNote(event) {
    event.preventDefault();
    const id = document.getElementById("travel-note-edit-id").value;
    const title = document.getElementById("travel-note-title").value.trim();
    const categoryValue = document.getElementById("travel-note-category").value;
    const category = TRAVEL_NOTE_CATEGORIES[categoryValue] ? categoryValue : "general";
    const content = document.getElementById("travel-note-content").value.trim();
    const message = document.getElementById("travel-note-form-message");
    if (!content) { message.textContent = "Enter some note content."; return; }
    const now = new Date().toISOString();
    if (id) travelNotes = travelNotes.map(note => note.id === id ? { ...note, title, category, content, updatedAt:now } : note);
    else travelNotes.push({ id:makeTravelNoteId(), title, content, category, pinned:false, createdAt:now, updatedAt:now });
    writeTravelNotes();
    document.getElementById("travel-note-editor").close();
    renderTravelNotes();
    if (id && currentTravelNoteId === id) openTravelNoteDetail(id);
}

function openTravelNoteDetail(id) {
    const note = travelNoteById(id);
    if (!note) return;
    currentTravelNoteId = id;
    const category = TRAVEL_NOTE_CATEGORIES[note.category] || TRAVEL_NOTE_CATEGORIES.general;
    document.getElementById("travel-note-detail-category").textContent = `${category.icon} ${category.label}`;
    document.getElementById("travel-note-detail-title").textContent = note.title?.trim() || "Untitled Note";
    document.getElementById("travel-note-detail-content").textContent = note.content;
    document.getElementById("pin-travel-note").textContent = note.pinned ? "Unpin" : "Pin";
    const dialog = document.getElementById("travel-note-detail");
    if (!dialog.open) dialog.showModal();
}

function toggleCurrentTravelNotePin() {
    const note = travelNoteById();
    if (!note) return;
    note.pinned = !note.pinned;
    note.updatedAt = new Date().toISOString();
    writeTravelNotes();
    renderTravelNotes();
    openTravelNoteDetail(note.id);
}

function deleteCurrentTravelNote() {
    const note = travelNoteById();
    if (!note || !window.confirm(`Delete “${note.title?.trim() || "Untitled Note"}”?`)) return;
    travelNotes = travelNotes.filter(item => item.id !== note.id);
    writeTravelNotes();
    currentTravelNoteId = "";
    document.getElementById("travel-note-detail").close();
    renderTravelNotes();
}

const CALENDAR_DAY_MS = 86400000;

function parseCalendarDate(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value || ""));
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const localDate = new Date(year, month - 1, day, 12);
    if (localDate.getFullYear() !== year || localDate.getMonth() !== month - 1 || localDate.getDate() !== day) return null;
    return { year, month, day, dayNumber: Math.floor(Date.UTC(year, month - 1, day) / CALENDAR_DAY_MS) };
}

function localCalendarDay(now = new Date()) {
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    return { year, month, day, dayNumber: Math.floor(Date.UTC(year, month - 1, day) / CALENDAR_DAY_MS) };
}

function getTravelCountdownState(record = travelCountdown, today = localCalendarDay()) {
    const start = parseCalendarDate(record?.startDate);
    if (!start) return null;
    const end = parseCalendarDate(record?.endDate) || start;
    const daysUntilStart = start.dayNumber - today.dayNumber;
    if (daysUntilStart > 0) return { kind:"upcoming", label:"Upcoming trip", text:`${daysUntilStart} day${daysUntilStart === 1 ? "" : "s"} to go` };
    if (today.dayNumber === start.dayNumber) return { kind:"active", label:"Trip starts today", text:"Trip time! 🌸", day:1 };
    if (today.dayNumber <= end.dayNumber) return { kind:"active", label:"Trip in progress", text:"You’re on your trip 🌸", day:today.dayNumber - start.dayNumber + 1 };
    return { kind:"completed", label:"Completed trip", text:"Trip completed 🌸" };
}

function renderTravelHeaderCountdown() {
    const label = document.getElementById("travel-header-countdown-label");
    const button = document.getElementById("travel-header-countdown");
    if (!label || !button) return;
    const state = getTravelCountdownState();
    button.dataset.countdownState = state?.kind || "empty";
    if (!state) label.textContent = "Set trip →";
    else if (state.kind === "upcoming") {
        const days = parseCalendarDate(travelCountdown.startDate).dayNumber - localCalendarDay().dayNumber;
        label.textContent = `🌸 ${days} day${days === 1 ? "" : "s"}`;
    }
    else if (state.kind === "active" && state.day === 1) label.textContent = "✈️ Today";
    else if (state.kind === "active") label.textContent = `✈️ Day ${state.day}`;
    else label.textContent = "Trip complete";
}

function formatTravelCalendarDate(date, includeYear = true) {
    return new Intl.DateTimeFormat(undefined, { month:"short", day:"numeric", ...(includeYear ? { year:"numeric" } : {}) }).format(new Date(date.year, date.month - 1, date.day, 12));
}

function formatTravelCountdownDates(record = travelCountdown) {
    const start = parseCalendarDate(record?.startDate);
    const end = parseCalendarDate(record?.endDate);
    if (!start) return "";
    if (!end || start.dayNumber === end.dayNumber) return formatTravelCalendarDate(start);
    if (start.year === end.year) return `${formatTravelCalendarDate(start, false)} – ${formatTravelCalendarDate(end)}`;
    return `${formatTravelCalendarDate(start)} – ${formatTravelCalendarDate(end)}`;
}

function renderTravelCountdown() {
    renderTravelHeaderCountdown();
    const empty = document.getElementById("travel-countdown-empty");
    if (!empty) return;
    const detail = document.getElementById("travel-countdown-card");
    const summary = document.getElementById("travel-countdown-card-summary");
    const state = getTravelCountdownState();
    const hasCountdown = Boolean(travelCountdown && state);
    empty.hidden = hasCountdown;
    detail.hidden = !hasCountdown;
    if (!hasCountdown) {
        if (summary) summary.textContent = "Plan your next adventure.";
        return;
    }
    const tripName = String(travelCountdown.tripName || "").trim() || "Japan Trip";
    document.getElementById("travel-countdown-status-label").textContent = state.label;
    document.getElementById("travel-countdown-trip-name").textContent = tripName;
    document.getElementById("travel-countdown-status").textContent = state.text;
    document.getElementById("travel-countdown-dates").textContent = formatTravelCountdownDates();
    detail.dataset.countdownState = state.kind;
    if (summary) summary.textContent = `${tripName} · ${state.text}`;
}

function renderTravelModeNavigation() {
    const nav = document.getElementById("dynamic-fourth-nav");
    const toggle = document.getElementById("travel-mode-toggle");
    if (toggle) toggle.checked = travelModeEnabled;
    if (!nav) return;
    nav.dataset.route = travelModeEnabled ? "travel" : "practice";
    nav.querySelector("span").textContent = travelModeEnabled ? "✈" : "✿";
    nav.querySelector("small").textContent = travelModeEnabled ? "Travel" : "Practice";
    nav.setAttribute("aria-label", travelModeEnabled ? "Travel" : "Practice");
}

function setTravelModeEnabled(enabled) {
    travelModeEnabled = Boolean(enabled);
    localStorage.setItem(STORAGE.travelModeEnabled, String(travelModeEnabled));
    renderTravelModeNavigation();
    if (!travelModeEnabled && (currentRoute === "travel" || currentRoute.startsWith("travel-"))) showRoute("home");
}

function openTravelCountdownEditor() {
    document.getElementById("travel-countdown-editor-heading").textContent = travelCountdown ? "Edit Your Trip" : "Set Your Trip";
    document.getElementById("travel-countdown-name").value = travelCountdown?.tripName || "";
    document.getElementById("travel-countdown-start").value = travelCountdown?.startDate || "";
    document.getElementById("travel-countdown-end").value = travelCountdown?.endDate || "";
    document.getElementById("travel-countdown-form-message").textContent = "";
    document.getElementById("travel-countdown-editor").showModal();
}

function saveTravelCountdown(event) {
    event.preventDefault();
    const message = document.getElementById("travel-countdown-form-message");
    const tripName = document.getElementById("travel-countdown-name").value.normalize("NFKC").trim();
    const startDate = document.getElementById("travel-countdown-start").value;
    const endDate = document.getElementById("travel-countdown-end").value;
    const start = parseCalendarDate(startDate);
    const end = endDate ? parseCalendarDate(endDate) : null;
    if (!start) { message.textContent = "Choose a valid start date."; return; }
    if (endDate && !end) { message.textContent = "Choose a valid end date."; return; }
    if (end && end.dayNumber < start.dayNumber) { message.textContent = "The end date cannot be before the start date."; return; }
    const now = new Date().toISOString();
    travelCountdown = { tripName, startDate, endDate, createdAt:travelCountdown?.createdAt || now, updatedAt:now };
    writeJson(STORAGE.travelCountdown, travelCountdown);
    document.getElementById("travel-countdown-editor").close();
    renderTravelCountdown();
}

function removeTravelCountdown() {
    if (!travelCountdown || !window.confirm("Remove this travel countdown?")) return;
    travelCountdown = null;
    localStorage.removeItem(STORAGE.travelCountdown);
    renderTravelCountdown();
}

function travelOfflineCategories() {
    return Object.keys(window.TRAVEL_CATEGORIES || {});
}

function travelOfflineAssetUrl(category) {
    const asset = window.SakuraTravelLoader?.getTravelCategoryAsset?.(category);
    if (!asset) throw new Error(`Travel asset information is unavailable for ${category}.`);
    return new URL(asset, document.baseURI).href;
}

async function inspectTravelOfflineCache() {
    const categories = travelOfflineCategories();
    if (!window.caches) return { supported:false, ready:[], missing:[...categories] };
    const cache = await caches.open(TRAVEL_OFFLINE_CACHE);
    const checks = await Promise.all(categories.map(async category => [category, Boolean(await cache.match(travelOfflineAssetUrl(category)))]));
    return {
        supported:true,
        ready:checks.filter(([, isReady]) => isReady).map(([category]) => category),
        missing:checks.filter(([, isReady]) => !isReady).map(([category]) => category)
    };
}

function formatTravelOfflineTimestamp(value) {
    const date = new Date(value || "");
    return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(undefined, { dateStyle:"medium", timeStyle:"short" }).format(date);
}

function renderTravelOfflinePack() {
    const card = document.getElementById("travel-offline-card");
    if (!card) return;
    const categories = travelOfflineCategories();
    const total = categories.length || 7;
    const readyCount = travelOfflinePackState.ready.length;
    const status = travelOfflinePackState.status;
    const configurations = {
        checking:["Checking availability", "Checking your Travel Pack…", "Sakura is checking which phrases are ready offline.", "🌸"],
        unavailable:["Unavailable", "Offline downloads aren't available", "Sakura can still load Travel phrases normally while you are online.", "!"],
        empty:["Not downloaded", "Prepare for your trip", "Download all 720 Travel phrases before you leave.", "⇩"],
        downloading:["Downloading", "Downloading Travel Pack…", `${readyCount} of ${total} categories are ready.`, "⇩"],
        partial:["Incomplete", "Travel Pack is partly ready", `${readyCount} of ${total} categories are available offline. Retry the remaining categories.`, "!"],
        error:["Download interrupted", "Travel Pack couldn't be completed", "Your completed downloads were kept. Try again when you have a connection.", "!"],
        ready:["Ready Offline", "Your Travel Pack is ready", "All 720 Travel phrases are prepared for your trip.", "✓"]
    };
    const configuration = configurations[status] || configurations.empty;
    document.getElementById("travel-offline-label").textContent = configuration[0];
    document.getElementById("travel-offline-status").textContent = configuration[1];
    document.getElementById("travel-offline-description").textContent = configuration[2];
    document.getElementById("travel-offline-icon").textContent = configuration[3];
    document.getElementById("travel-offline-progress-text").textContent = `${readyCount} of ${total} categories ready`;
    const progress = card.querySelector("[role='progressbar']");
    progress.setAttribute("aria-valuemax", String(total));
    progress.setAttribute("aria-valuenow", String(readyCount));
    document.getElementById("travel-offline-progress-bar").style.width = `${total ? (readyCount / total) * 100 : 0}%`;
    card.dataset.offlineState = status;
    const action = document.getElementById("travel-offline-action");
    action.disabled = status === "checking" || status === "downloading" || status === "unavailable";
    action.textContent = status === "ready" ? "Refresh Travel Pack" : readyCount ? "Retry Remaining" : "Download Travel Pack";
    document.getElementById("remove-travel-offline-pack").hidden = readyCount === 0 || status === "downloading";
    const completed = formatTravelOfflineTimestamp(travelOfflinePackMetadata?.lastCompletedAt);
    document.getElementById("travel-offline-last-updated").textContent = completed ? `Last completed ${completed}` : "";
    const summary = document.getElementById("travel-offline-card-summary");
    if (summary) summary.textContent = status === "ready" ? "All 720 phrases are ready offline." : readyCount ? `${readyCount} of ${total} categories ready.` : "Prepare all 720 phrases for your trip.";
}

function saveTravelOfflineMetadata(ready, completed = false, updateCompletion = false) {
    const now = new Date().toISOString();
    travelOfflinePackMetadata = {
        version:TRAVEL_OFFLINE_PACK_VERSION,
        categories:[...ready],
        lastCheckedAt:now,
        lastCompletedAt:completed ? (updateCompletion ? now : travelOfflinePackMetadata?.lastCompletedAt || now) : travelOfflinePackMetadata?.lastCompletedAt || null
    };
    writeJson(STORAGE.travelOfflinePack, travelOfflinePackMetadata);
}

async function verifyTravelOfflinePack() {
    if (travelOfflinePackOperation) return travelOfflinePackOperation;
    travelOfflinePackState = { status:"checking", ready:[], failed:[], processed:0 };
    renderTravelOfflinePack();
    try {
        const inspection = await inspectTravelOfflineCache();
        if (!inspection.supported) travelOfflinePackState = { status:"unavailable", ready:[], failed:[], processed:0 };
        else {
            const status = inspection.ready.length === travelOfflineCategories().length ? "ready" : inspection.ready.length ? "partial" : "empty";
            travelOfflinePackState = { status, ready:inspection.ready, failed:inspection.missing, processed:0 };
            saveTravelOfflineMetadata(inspection.ready, status === "ready");
        }
    }
    catch (error) {
        console.warn("Offline Travel Pack: cache availability could not be checked.", error);
        travelOfflinePackState = { status:"unavailable", ready:[], failed:[], processed:0 };
    }
    renderTravelOfflinePack();
}

async function downloadTravelOfflinePack(refresh = false) {
    if (travelOfflinePackOperation) return travelOfflinePackOperation;
    travelOfflinePackOperation = (async () => {
        const loader = window.SakuraTravelLoader;
        const message = document.getElementById("travel-offline-message");
        message.textContent = "";
        let inspection;
        try { inspection = await inspectTravelOfflineCache(); }
        catch (error) { inspection = { supported:false, ready:[], missing:travelOfflineCategories() }; }
        if (!inspection.supported || !loader?.refreshTravelCategory) {
            travelOfflinePackState = { status:"unavailable", ready:[], failed:inspection.missing, processed:0 };
            renderTravelOfflinePack();
            return;
        }
        const categories = travelOfflineCategories();
        const pending = refresh ? categories : inspection.missing;
        const ready = new Set(inspection.ready);
        const failed = [];
        travelOfflinePackState = { status:"downloading", ready:[...ready], failed:[], processed:0 };
        renderTravelOfflinePack();
        for (const category of pending) {
            try {
                await loader.refreshTravelCategory(category);
                const cache = await caches.open(TRAVEL_OFFLINE_CACHE);
                if (!await cache.match(travelOfflineAssetUrl(category))) throw new Error("The downloaded response was not saved for offline use.");
                ready.add(category);
            }
            catch (error) {
                failed.push(category);
                console.warn(`Offline Travel Pack: ${category} could not be prepared.`, error);
            }
            travelOfflinePackState = { status:"downloading", ready:[...ready], failed:[...failed], processed:travelOfflinePackState.processed + 1 };
            renderTravelOfflinePack();
        }
        const finalInspection = await inspectTravelOfflineCache();
        const complete = finalInspection.ready.length === categories.length;
        travelOfflinePackState = { status:complete ? "ready" : finalInspection.ready.length ? "partial" : "error", ready:finalInspection.ready, failed:finalInspection.missing, processed:pending.length };
        saveTravelOfflineMetadata(finalInspection.ready, complete, complete);
        invalidateSearchIndex();
        message.textContent = complete ? "Travel Pack download complete." : "Some categories could not be downloaded. Your completed categories were kept.";
        renderTravelOfflinePack();
    })().catch(error => {
        console.warn("Offline Travel Pack: download failed.", error);
        travelOfflinePackState.status = travelOfflinePackState.ready.length ? "partial" : "error";
        document.getElementById("travel-offline-message").textContent = "The download was interrupted. Try again when you have a connection.";
        renderTravelOfflinePack();
    }).finally(() => { travelOfflinePackOperation = null; });
    return travelOfflinePackOperation;
}

async function removeTravelOfflinePack() {
    if (travelOfflinePackOperation || !window.confirm("Remove the downloaded Travel Pack? Your saved phrases, decks, notes, pins, and countdown will stay safe.")) return;
    const message = document.getElementById("travel-offline-message");
    try {
        if (!window.caches) throw new Error("Offline storage is unavailable.");
        const categories = travelOfflineCategories();
        const cache = await caches.open(TRAVEL_OFFLINE_CACHE);
        await Promise.all(categories.map(category => cache.delete(travelOfflineAssetUrl(category))));
        window.SakuraTravelLoader?.forgetTravelCategories?.(categories);
        travelSearchPrepared = false;
        invalidateSearchIndex();
        localStorage.removeItem(STORAGE.travelOfflinePack);
        travelOfflinePackMetadata = null;
        travelOfflinePackState = { status:"empty", ready:[], failed:[...categories], processed:0 };
        message.textContent = "Offline Travel Pack removed. Your saved Travel items and trip tools were not changed.";
    }
    catch (error) {
        console.warn("Offline Travel Pack: removal failed.", error);
        message.textContent = "Sakura couldn't remove the downloaded pack. Please try again.";
    }
    renderTravelOfflinePack();
}

function parseCurrencyExpression(expression) {
    const source = String(expression || "");
    if (!source.trim()) return { status:"empty", value:null, message:"" };
    if (source.length > 200) return { status:"invalid", value:null, message:"Keep the calculation under 200 characters." };
    if (/[^0-9.+\-*/()\s]/.test(source)) return { status:"invalid", value:null, message:"Use only numbers and the arithmetic controls." };
    const tokens = [];
    let position = 0;
    while (position < source.length) {
        const character = source[position];
        if (/\s/.test(character)) { position += 1; continue; }
        if (/[+\-*/()]/.test(character)) { tokens.push({ type:character }); position += 1; continue; }
        const numberMatch = source.slice(position).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
        if (!numberMatch) return { status:"invalid", value:null, message:"Check the number or operator near the end." };
        const value = Number(numberMatch[0]);
        if (!Number.isFinite(value)) return { status:"invalid", value:null, message:"That number is too large." };
        tokens.push({ type:"number", value });
        position += numberMatch[0].length;
    }
    let index = 0;
    const fail = (message, incomplete = false) => { const error = new Error(message); error.incomplete = incomplete; throw error; };
    const bounded = value => {
        if (!Number.isFinite(value) || Math.abs(value) > 1e12) fail("That result is too large.");
        return value;
    };
    const parseFactor = () => {
        const token = tokens[index];
        if (!token) fail("Keep typing to finish the calculation.", true);
        if (token.type === "+" || token.type === "-") { index += 1; const value = parseFactor(); return token.type === "-" ? -value : value; }
        if (token.type === "number") { index += 1; return token.value; }
        if (token.type === "(") {
            index += 1;
            if (tokens[index]?.type === ")") fail("Parentheses need a calculation inside them.");
            const value = parseExpression();
            if (!tokens[index]) fail("Add a closing parenthesis.", true);
            if (tokens[index].type !== ")") fail("Check the parentheses in this calculation.");
            index += 1;
            return value;
        }
        fail("Check the number or operator near the end.");
    };
    const parseTerm = () => {
        let value = parseFactor();
        while (["*", "/"].includes(tokens[index]?.type)) {
            const operator = tokens[index++].type;
            const right = parseFactor();
            if (operator === "/" && right === 0) fail("Division by zero isn't allowed.");
            value = bounded(operator === "*" ? value * right : value / right);
        }
        return value;
    };
    const parseExpression = () => {
        let value = parseTerm();
        while (["+", "-"].includes(tokens[index]?.type)) {
            const operator = tokens[index++].type;
            const right = parseTerm();
            value = bounded(operator === "+" ? value + right : value - right);
        }
        return value;
    };
    try {
        const value = bounded(parseExpression());
        if (index !== tokens.length) fail("Check the order of the numbers and operators.");
        return { status:"valid", value, message:"" };
    }
    catch (error) {
        return { status:error.incomplete ? "incomplete" : "invalid", value:null, message:error.incomplete ? "" : error.message || "Check this calculation." };
    }
}

function formatYenCurrency(value, currency, converted = false) {
    if (!Number.isFinite(value)) return "—";
    const fractionDigits = currency === "PHP" ? 2 : converted || Number.isInteger(value) ? 0 : 2;
    return new Intl.NumberFormat("en-US", { style:"currency", currency, currencyDisplay:"narrowSymbol", minimumFractionDigits:fractionDigits, maximumFractionDigits:fractionDigits }).format(value);
}

function convertYenCurrency(value, fromCurrency, toCurrency) {
    const rate = Number(yenConverterSettings?.phpPerJpy);
    if (!Number.isFinite(value) || !Number.isFinite(rate) || rate <= 0 || fromCurrency === toCurrency) return null;
    const converted = fromCurrency === "JPY" ? value * rate : value / rate;
    return Number.isFinite(converted) && Math.abs(converted) <= 1e12 ? converted : null;
}

function renderYenConverter() {
    const view = document.getElementById("travel-yen-view");
    if (!view) return;
    const activeSide = yenConverterState.activeSide;
    const inactiveSide = activeSide === "top" ? "bottom" : "top";
    const result = parseCurrencyExpression(yenConverterState.expressions[activeSide]);
    const sourceCurrency = yenConverterState.currencies[activeSide];
    const destinationCurrency = yenConverterState.currencies[inactiveSide];
    const convertedValue = result.status === "valid" ? convertYenCurrency(result.value, sourceCurrency, destinationCurrency) : null;
    for (const side of ["top", "bottom"]) {
        const currency = yenConverterState.currencies[side];
        const active = side === activeSide;
        const panel = document.getElementById(`yen-panel-${side}`);
        panel.classList.toggle("active", active);
        document.getElementById(`yen-${side}-mode`).textContent = active ? "Editing" : "Converted";
        document.getElementById(`yen-${side}-currency`).value = currency;
        document.getElementById(`yen-${side}-symbol`).textContent = YEN_CURRENCIES[currency].symbol;
        const input = document.getElementById(`yen-${side}-expression`);
        if (input.value !== yenConverterState.expressions[side]) input.value = yenConverterState.expressions[side];
        input.placeholder = active ? "Enter an amount or calculation" : `Tap to calculate from ${currency}`;
        document.getElementById(`yen-${side}-total-label`).textContent = active ? "Evaluated total" : "Converted amount";
        document.getElementById(`yen-${side}-total`).textContent = active
            ? result.status === "valid" ? formatYenCurrency(result.value, currency) : "—"
            : convertedValue !== null ? formatYenCurrency(convertedValue, currency, true) : result.status === "valid" && !yenConverterSettings ? "Set rate" : "—";
        document.getElementById(`yen-${side}-message`).textContent = active && result.status === "invalid" ? result.message : "";
        input.setAttribute("aria-invalid", String(active && result.status === "invalid"));
    }
    const rate = Number(yenConverterSettings?.phpPerJpy);
    const hasRate = Number.isFinite(rate) && rate > 0;
    document.getElementById("yen-rate-display").textContent = hasRate ? `¥1 = ₱${new Intl.NumberFormat("en-US", { minimumFractionDigits:2, maximumFractionDigits:6 }).format(rate)}` : "Set exchange rate";
    document.getElementById("yen-rate-helper").textContent = hasRate ? `Saved manually${yenConverterSettings.updatedAt ? ` · ${new Intl.DateTimeFormat(undefined, { dateStyle:"medium" }).format(new Date(yenConverterSettings.updatedAt))}` : ""}` : "Enter how many Philippine pesos equal ¥1.";
    document.getElementById("edit-yen-rate").textContent = hasRate ? "Edit Rate" : "Set Rate";
}

function activateYenSide(side, focus = false) {
    if (!['top', 'bottom'].includes(side)) return;
    if (yenConverterState.activeSide !== side) {
        const other = side === "top" ? "bottom" : "top";
        yenConverterState.activeSide = side;
        yenConverterState.expressions[other] = "";
        renderYenConverter();
    }
    if (focus) document.getElementById(`yen-${side}-expression`).focus();
}

function setYenCurrency(side, currency) {
    if (!YEN_CURRENCIES[currency]) return;
    const other = side === "top" ? "bottom" : "top";
    yenConverterState.currencies[side] = currency;
    yenConverterState.currencies[other] = currency === "JPY" ? "PHP" : "JPY";
    renderYenConverter();
}

function editYenExpression(side, value) {
    activateYenSide(side);
    yenConverterState.expressions[side] = String(value || "");
    renderYenConverter();
}

function insertYenKey(side, key) {
    activateYenSide(side);
    const input = document.getElementById(`yen-${side}-expression`);
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    let before = input.value.slice(0, start);
    let after = input.value.slice(end);
    let insertion = key;
    if (key === "backspace") {
        if (start !== end) before = input.value.slice(0, start);
        else {
            before = before.replace(/\s+$/, "");
            if (/[+\-*/]$/.test(before)) before = before.slice(0, -1).replace(/\s+$/, "");
            else before = before.slice(0, -1);
        }
        insertion = "";
    }
    else if (["+", "-", "*", "/"].includes(key)) insertion = ` ${key} `;
    const nextValue = `${before}${insertion}${after}`.slice(0, 200);
    yenConverterState.expressions[side] = nextValue;
    renderYenConverter();
    input.focus();
    const caret = Math.min(before.length + insertion.length, nextValue.length);
    input.setSelectionRange(caret, caret);
}

function clearYenExpression(side) {
    activateYenSide(side);
    yenConverterState.expressions.top = "";
    yenConverterState.expressions.bottom = "";
    renderYenConverter();
    document.getElementById(`yen-${side}-expression`).focus();
}

function swapYenCurrencies() {
    const { top, bottom } = yenConverterState.currencies;
    yenConverterState.currencies = { top:bottom, bottom:top };
    const topExpression = yenConverterState.expressions.top;
    yenConverterState.expressions.top = yenConverterState.expressions.bottom;
    yenConverterState.expressions.bottom = topExpression;
    yenConverterState.activeSide = yenConverterState.activeSide === "top" ? "bottom" : "top";
    renderYenConverter();
}

function openYenRateEditor() {
    document.getElementById("yen-rate-input").value = yenConverterSettings?.phpPerJpy || "";
    document.getElementById("yen-rate-message").textContent = "";
    document.getElementById("yen-rate-editor").showModal();
}

function saveYenRate(event) {
    event.preventDefault();
    const rawValue = document.getElementById("yen-rate-input").value.trim();
    const message = document.getElementById("yen-rate-message");
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(rawValue)) { message.textContent = "Enter a valid positive number, such as 0.38."; return; }
    const phpPerJpy = Number(rawValue);
    if (!Number.isFinite(phpPerJpy) || phpPerJpy <= 0) { message.textContent = "The exchange rate must be greater than zero."; return; }
    yenConverterSettings = { phpPerJpy, updatedAt:new Date().toISOString(), source:"manual" };
    writeJson(STORAGE.yenConverter, yenConverterSettings);
    document.getElementById("yen-rate-editor").close();
    renderYenConverter();
}

function flashcardBack(item) {
    return [item.kana || item.reading, item.romaji, item.meaning || item.english, item.onyomi?.length ? `On: ${item.onyomi.join(", ")}` : "", item.kunyomi?.length ? `Kun: ${item.kunyomi.join(", ")}` : "", item.jlpt || item.difficulty || item.category, item.exampleSentence, item.exampleTranslation, item.naturalUsage, item.formality ? `Formality: ${item.formality}` : "", item.notes].filter(Boolean).join("\n");
}

function selectedFlashcardLevels() {
    return [...document.querySelectorAll("#flashcard-levels input:checked")].map(input => input.value);
}

function buildFlashcardDeck() {
    if (!document.getElementById("deck-type-filter")) return;
    const type = document.getElementById("deck-type-filter").value;
    const reviewOnly = document.getElementById("review-only-filter").checked;
    const levels = selectedFlashcardLevels();
    flashcardDeck = savedItems.filter(item => (type === "all" || item.type === type) && (!item.jlpt || levels.includes(item.jlpt)) && (!reviewOnly || flashcardStatuses[itemKey(item)] === "review"));
    flashcardIndex = 0;
    flashcardRevealed = false;
    renderFlashcard();
}

function renderFlashcard() {
    const item = flashcardDeck[flashcardIndex];
    document.getElementById("flashcard-progress").textContent = item ? `Card ${flashcardIndex + 1} of ${flashcardDeck.length}` : "Card 0 of 0";
    document.getElementById("flashcard-front").textContent = item ? itemTitle(item) : "No matching saved items";
    document.getElementById("flashcard-back").textContent = item ? flashcardBack(item) : "";
    document.getElementById("flashcard-back").hidden = !flashcardRevealed;
    document.getElementById("flashcard-side-label").textContent = flashcardRevealed ? "Answer" : "Front";
    document.getElementById("flashcard").classList.toggle("revealed", flashcardRevealed);
    document.getElementById("flashcard-empty").hidden = Boolean(item);
    const status = item ? flashcardStatuses[itemKey(item)] : "";
    document.getElementById("known-flashcard").classList.toggle("selected", status === "known");
    document.getElementById("review-flashcard").classList.toggle("selected", status === "review");
}

function renderFlashcardLevels() {
    const container = document.getElementById("flashcard-levels");
    container.innerHTML = "";
    JLPT_LEVELS.forEach(level => container.appendChild(createLevelChip(level, true, buildFlashcardDeck)));
}

function showSavedTab(name) {
    document.querySelectorAll("[data-saved-tab]").forEach(button => button.classList.toggle("active", button.dataset.savedTab === name));
    document.querySelectorAll("[data-saved-panel]").forEach(panel => { panel.hidden = panel.dataset.savedPanel !== name; });
    if (name === "flashcards") buildFlashcardDeck();
}

function shuffleDeck() {
    for (let index = flashcardDeck.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [flashcardDeck[index], flashcardDeck[randomIndex]] = [flashcardDeck[randomIndex], flashcardDeck[index]];
    }
    flashcardIndex = 0;
    flashcardRevealed = false;
    renderFlashcard();
}

function setFlashcardStatus(status) {
    const item = flashcardDeck[flashcardIndex];
    if (!item) return;
    flashcardStatuses[itemKey(item)] = status;
    writeJson(STORAGE.statuses, flashcardStatuses);
    renderFlashcard();
}

function renderTranslationChips() {
    const render = (id, values, selected, attribute) => { document.getElementById(id).innerHTML = values.map(value => `<button class="translation-chip ${value === selected ? "active" : ""}" type="button" data-${attribute}="${escapeSearchHtml(value)}">${escapeSearchHtml(value)}</button>`).join(""); };
    render("translation-contexts", TRANSLATION_CONTEXTS, translationContext, "translation-context");
    render("translation-tones", TRANSLATION_TONES, translationTone, "translation-tone");
}

function relatedOfflinePhrases(english) {
    const stopWords = new Set(["a","an","and","are","at","be","can","could","do","for","from","i","in","is","it","me","my","of","on","please","the","this","to","until","we","with","you","your"]);
    const queryWords = new Set(searchText(english).split(" ").map(word => word.replace(/[^\p{L}\p{N}'-]/gu, "")).filter(word => word.length > 2 && !stopWords.has(word)));
    const pool = [...nativeData(), ...slangData(), ...window.VOCABULARY_DATA, ...savedItems].filter((item,index,array) => array.findIndex(other => itemKey(other) === itemKey(item)) === index);
    const ranked = pool.map(item => { const haystack=searchableFields(item).join(" "); let score=0; queryWords.forEach(word => { if(haystack.includes(word)) score+=word.length; }); return {item,score}; }).filter(result=>result.score>0).sort((a,b)=>b.score-a.score);
    const bestScore = ranked[0]?.score || 0;
    return ranked.filter(result => result.score >= bestScore * .75).slice(0,5).map(result=>result.item);
}

function validateTranslationResponse(data) {
    if (!data || typeof data !== "object" || !cleanEntryText(data.japanese) || !cleanEntryText(data.naturalMeaning)) throw new Error("The translation service returned an incomplete response.");
    return { japanese:cleanEntryText(data.japanese), kana:cleanEntryText(data.kana), romaji:cleanEntryText(data.romaji), naturalMeaning:cleanEntryText(data.naturalMeaning), literalMeaning:cleanEntryText(data.literalMeaning), tone:cleanEntryText(data.tone), usageNote:cleanEntryText(data.usageNote), alternative:cleanEntryText(data.alternative), offline:false };
}

function renderTranslationResult(result) {
    if (result && !result.id) result.id = `translation-${searchText(result.japanese).slice(0,30)}-${Date.now().toString(36)}`;
    currentTranslationResult = result;
    const card=document.getElementById("translation-result"); card.hidden=!result;
    if(!result)return;
    document.getElementById("translation-result-label").textContent=result.offline?"Related Sakura phrase":"Recommended";
    document.getElementById("translation-japanese").textContent=result.japanese;
    document.getElementById("translation-kana").textContent=result.kana;
    document.getElementById("translation-romaji").textContent=result.romaji;
    document.getElementById("translation-natural-meaning").textContent=result.naturalMeaning;
    document.getElementById("translation-literal-meaning").textContent=result.literalMeaning;
    document.getElementById("translation-literal-group").hidden=!result.literalMeaning;
    document.getElementById("translation-usage").textContent=[result.tone,result.usageNote].filter(Boolean).join(" · ");
    document.getElementById("translation-alternative").textContent=result.alternative;
    document.getElementById("translation-alternative-group").hidden=!result.alternative;
    const savedItem=translationResultItem(result); setSaveButton(document.getElementById("save-translation"),savedItem); document.getElementById("save-translation").textContent=isSaved(savedItem)?"Saved":"Save";
}

function translationResultItem(result=currentTranslationResult) {
    if(!result)return null;
    return { id:result.id, type:"translation", expression:result.japanese, kana:result.kana, romaji:result.romaji, meaning:result.naturalMeaning, naturalMeaning:result.naturalMeaning, literalMeaning:result.literalMeaning, tone:result.tone, notes:result.usageNote, alternative:result.alternative, context:translationContext };
}

function addTranslationHistory(request,result) {
    const record={id:`history-${Date.now().toString(36)}`,english:request.english,context:request.context,tone:request.tone,result,createdAt:new Date().toISOString()};
    translationHistory=[record,...translationHistory.filter(item=>searchText(item.english)!==searchText(request.english))].slice(0,20); writeJson(STORAGE.translationHistory,translationHistory); renderTranslationHistory();
}

function renderTranslationHistory() {
    const container=document.getElementById("translation-history"); if(!container)return;
    container.innerHTML=translationHistory.map(item=>`<article class="translation-history-item"><button type="button" data-translation-history="${item.id}"><strong>${escapeSearchHtml(item.english)}</strong><small>${escapeSearchHtml(item.context)} · ${escapeSearchHtml(item.tone)}</small></button><button class="history-delete" type="button" data-delete-translation-history="${item.id}" aria-label="Delete ${escapeSearchHtml(item.english)}">×</button></article>`).join("");
    document.getElementById("translation-history-empty").hidden=translationHistory.length>0; document.getElementById("clear-translation-history").hidden=!translationHistory.length;
}

async function requestTranslation(event) {
    event.preventDefault(); if(translationLoading)return;
    const english=cleanEntryText(document.getElementById("translation-english").value); const message=document.getElementById("translation-message");
    if(!english){message.textContent="Enter an English sentence first.";return;} if(english.length>500){message.textContent="Keep the sentence under 500 characters.";return;}
    const request={english,context:translationContext,tone:translationTone}; translationLoading=true; document.getElementById("submit-translation").disabled=true; message.textContent="Finding natural Japanese…";
    try {
        let result;
        if(TRANSLATION_API_ENDPOINT && navigator.onLine){ const response=await fetch(TRANSLATION_API_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(request)}); if(!response.ok)throw new Error("The translation service is unavailable right now."); result=validateTranslationResponse(await response.json()); message.textContent=""; }
        else { const related=relatedOfflinePhrases(english); if(!related.length){renderTranslationResult(null); message.textContent=TRANSLATION_API_ENDPOINT?"AI translation requires internet. No related built-in phrases were found.":"AI translation is not configured yet. No related built-in phrases were found.";return;} const item=related[0]; result={id:`offline-${itemKey(item)}`,japanese:item.expression||item.word||item.character,kana:item.kana||item.reading||"",romaji:item.romaji||"",naturalMeaning:item.naturalMeaning||item.meaning,literalMeaning:item.literalMeaning||item.literal||"",tone:item.tone||item.formality||"",usageNote:`Related phrase already in Sakura for ${item.categories?.join(", ")||item.jlpt||"general use"}.`,alternative:related.slice(1,3).map(other=>other.expression||other.word).join(" / "),offline:true}; message.textContent=TRANSLATION_API_ENDPOINT?"AI translation requires internet. Here are related phrases already in Sakura.":"AI translation is not configured. Here are related phrases already in Sakura."; }
        renderTranslationResult(result); addTranslationHistory(request,result);
    } catch(error){renderTranslationResult(null);message.textContent=error.message||"Sakura could not complete that translation.";} finally{translationLoading=false;document.getElementById("submit-translation").disabled=false;}
}

function initializeLibrary() {
    if (libraryInitialized) return;
    libraryInitialized = true;
    document.getElementById("library-kanji-count").textContent = LIBRARY_TOTALS.kanji.toLocaleString();
    document.getElementById("library-vocabulary-count").textContent = LIBRARY_TOTALS.vocabulary.toLocaleString();
    document.getElementById("library-slang-count").textContent = slangData().length.toLocaleString();
    document.getElementById("library-kana-count").textContent = KANA_DATA.length.toLocaleString();
    document.getElementById("library-travel-count").textContent = LIBRARY_TOTALS.travel.toLocaleString();
}

function libraryHome() {
    libraryRepository = "";
    document.getElementById("library-home").hidden = false;
    document.getElementById("library-repository").hidden = true;
    document.getElementById("library-search-input").value = "";
}

function libraryFilterOptions(type) {
    if (type === "kanji") return [{value:"All",label:"All Kanji"}, ...["N5","N4","N3","N2","N1"].map(value=>({value,label:value}))];
    if (type === "vocabulary") return [{value:"All",label:"All Vocabulary"}, ...["N5","N4","N3","N2","N1"].map(value=>({value,label:value}))];
    if (type === "slang") return SLANG_CATEGORY_OPTIONS.map(([value, label]) => ({ value, label }));
    if (type === "travel") return [{value:"All",label:"All Travel"}, ...Object.entries(window.TRAVEL_CATEGORIES || {}).map(([value,metadata])=>({value,label:metadata.title}))];
    return [
        {value:"All",label:"All Kana"}, {value:"script:Hiragana",label:"Hiragana"}, {value:"script:Katakana",label:"Katakana"},
        {value:"group:Basic",label:"Basic"}, {value:"group:Dakuten",label:"Dakuten"}, {value:"group:Handakuten",label:"Handakuten"},
        {value:"group:Yoon",label:"Yōon"}, {value:"group:Extended",label:"Extended Katakana"}
    ];
}

function renderLibraryFilters() {
    document.getElementById("library-collection-select").value = libraryRepository;
    const options = libraryFilterOptions(libraryRepository);
    const category = document.getElementById("library-category-select");
    category.innerHTML = options.map(option => `<option value="${escapeSearchHtml(option.value)}">${escapeSearchHtml(option.label)}</option>`).join("");
    category.value = options.some(option=>option.value===libraryFilter) ? libraryFilter : options[0]?.value || "All";
    libraryFilter = category.value;
}

function libraryKanaItem(item, index) {
    return { id:`kana-${index}-${item[0]}`, type:"kana", kana:item[0], romaji:item[1], script:item[2], group:kanaGroup(item), quizEligible:kanaQuizEligible(item) };
}

function librarySource(type = libraryRepository) {
    if (type === "kanji") return window.SakuraKanjiLoader?.getLoadedKanji() || [];
    if (type === "vocabulary") return window.SakuraVocabularyLoader?.getLoadedVocabulary() || [];
    if (type === "slang") return slangData();
    if (type === "kana") return KANA_DATA.map(libraryKanaItem);
    if (type === "travel") return window.SakuraTravelLoader?.getLoadedTravelPhrases() || [];
    return [];
}

function libraryMatches(item, query) {
    if (!query) return true;
    let values = [];
    if (libraryRepository === "kanji") values = [item.character, item.reading, item.romaji, item.meaning];
    if (libraryRepository === "vocabulary") values = [item.word, item.kana, item.romaji, item.meaning];
    if (libraryRepository === "slang") values = [item.expression, item.kana, item.romaji, item.meaning, ...(item.categories || [])];
    if (libraryRepository === "kana") values = [item.kana, item.romaji, item.script, item.group];
    if (libraryRepository === "travel") values = [item.japanese, item.reading, item.romaji, item.english];
    return values.some(value => searchText(value).includes(query));
}

function filteredLibraryItems() {
    const query = searchText(document.getElementById("library-search-input").value);
    const seen = new Set();
    return librarySource().filter(item => {
        const identity = itemKey(item) || `${item.type}:${item.kana}`;
        if (seen.has(identity)) return false;
        seen.add(identity);
        if (["kanji", "vocabulary"].includes(libraryRepository) && libraryFilter !== "All" && item.jlpt !== libraryFilter) return false;
        if (libraryRepository === "slang" && libraryFilter !== "All" && !item.categories.includes(libraryFilter)) return false;
        if (libraryRepository === "kana" && libraryFilter.startsWith("script:") && item.script !== libraryFilter.slice(7)) return false;
        if (libraryRepository === "kana" && libraryFilter.startsWith("group:") && item.group !== libraryFilter.slice(6)) return false;
        if (libraryRepository === "travel" && libraryFilter !== "All" && item.category !== libraryFilter) return false;
        return libraryMatches(item, query);
    });
}

function libraryCard(item) {
    const key = encodeURIComponent(itemKey(item) || `${item.type}:${item.kana}`);
    if (item.type === "kanji") return `<article class="library-item-card"><button type="button" class="library-item-main" data-library-open="${key}"><strong class="library-japanese">${escapeSearchHtml(item.character)}</strong><span>${escapeSearchHtml(item.reading || "")}</span><span class="learning-romaji">${escapeSearchHtml(item.romaji || "")}</span><b>${escapeSearchHtml(item.meaning)}</b><em>${escapeSearchHtml(item.jlpt)}</em></button><button type="button" class="library-save ${isSaved(item) ? "saved" : ""}" data-library-save="${key}" aria-label="${isSaved(item) ? "Unsave" : "Save"} ${escapeSearchHtml(item.character)}">${isSaved(item) ? "♥" : "♡"}</button></article>`;
    if (item.type === "vocabulary") return `<article class="library-item-card"><button type="button" class="library-item-main" data-library-open="${key}"><strong class="library-japanese library-word">${escapeSearchHtml(item.word)}</strong><span>${escapeSearchHtml(item.kana || "")}</span><span class="learning-romaji">${escapeSearchHtml(item.romaji || "")}</span><b>${escapeSearchHtml(item.meaning)}</b><em>${escapeSearchHtml(item.jlpt)}</em></button><button type="button" class="library-save ${isSaved(item) ? "saved" : ""}" data-library-save="${key}" aria-label="${isSaved(item) ? "Unsave" : "Save"} ${escapeSearchHtml(item.word)}">${isSaved(item) ? "♥" : "♡"}</button></article>`;
    if (item.type === "slang") return `<article class="library-item-card"><button type="button" class="library-item-main" data-library-open="${key}"><strong class="library-japanese library-word">${escapeSearchHtml(item.expression)}</strong><span>${escapeSearchHtml(item.kana || "")}</span><span class="learning-romaji">${escapeSearchHtml(item.romaji || "")}</span><b>${escapeSearchHtml(item.meaning)}</b><em>${escapeSearchHtml(item.categories.slice(0,2).join(" · "))}</em></button><button type="button" class="library-save ${isSaved(item) ? "saved" : ""}" data-library-save="${key}" aria-label="${isSaved(item) ? "Unsave" : "Save"} ${escapeSearchHtml(item.expression)}">${isSaved(item) ? "♥" : "♡"}</button></article>`;
    if (item.type === "travel") return `<article class="library-item-card library-travel-card"><button type="button" class="library-item-main" data-library-open="${key}"><strong class="library-japanese library-word">${escapeSearchHtml(item.japanese)}</strong><span>${escapeSearchHtml(item.reading || "")}</span><span class="learning-romaji">${escapeSearchHtml(item.romaji || "")}</span><b>${escapeSearchHtml(item.english)}</b><em>${escapeSearchHtml(travelCategoryMetadata(item.category)?.title || item.category)}</em></button><button type="button" class="library-save ${isSaved(item) ? "saved" : ""}" data-library-save="${key}" aria-label="${isSaved(item) ? "Unsave" : "Save"} ${escapeSearchHtml(item.japanese)}">${isSaved(item) ? "♥" : "♡"}</button></article>`;
    return `<article class="library-item-card kana-library-card"><div class="library-item-main"><strong class="library-japanese">${escapeSearchHtml(item.kana)}</strong><b>${escapeSearchHtml(item.romaji)}</b><span>${escapeSearchHtml(item.script)}</span><em>${escapeSearchHtml(item.group === "Yoon" ? "Yōon" : item.group)}</em></div></article>`;
}

function renderLibraryResults() {
    libraryCurrentItems = filteredLibraryItems();
    const visible = libraryCurrentItems.slice(0, libraryVisibleCount);
    document.getElementById("library-results").innerHTML = visible.map(libraryCard).join("");
    document.getElementById("library-empty").hidden = libraryCurrentItems.length > 0;
    document.getElementById("library-show-more").hidden = visible.length >= libraryCurrentItems.length;
    document.getElementById("library-status").textContent = `${libraryCurrentItems.length.toLocaleString()} ${libraryCurrentItems.length === 1 ? "entry" : "entries"}${visible.length < libraryCurrentItems.length ? ` · showing ${visible.length.toLocaleString()}` : ""}`;
}

async function loadLibraryLevels(type, filter, revision) {
    const levels = filter === "All" ? ["N5", "N4", "N3", "N2", "N1"] : [filter];
    const ensure = type === "kanji" ? ensureKanjiLevels : ensureVocabularyLevels;
    document.getElementById("library-status").textContent = filter === "All" ? "Loading available levels…" : `Loading ${filter}…`;
    document.getElementById("library-empty").hidden = true;
    try {
        for (const level of levels) {
            await ensure([level]);
            if (revision !== libraryLoadingRevision || currentRoute !== "library") return;
            renderLibraryResults();
        }
    }
    catch {
        if (revision === libraryLoadingRevision) document.getElementById("library-status").textContent = "This level could not be loaded. Check your connection and try again.";
    }
}

async function loadLibraryTravel(filter, revision) {
    const categories = filter === "All" ? Object.keys(window.TRAVEL_CATEGORIES || {}) : [filter];
    document.getElementById("library-status").textContent = filter === "All" ? "Loading Travel collections…" : `Loading ${travelCategoryMetadata(filter)?.title || "Travel"}…`;
    document.getElementById("library-empty").hidden = true;
    try {
        for (const category of categories) {
            await window.SakuraTravelLoader.loadTravelCategory(category);
            if (revision !== libraryLoadingRevision || currentRoute !== "library") return;
            renderLibraryResults();
        }
        invalidateSearchIndex();
    }
    catch {
        if (revision === libraryLoadingRevision) document.getElementById("library-status").textContent = "This Travel collection could not be loaded. Check your connection and try again.";
    }
}

function openLibraryRepository(type) {
    initializeLibrary();
    libraryRepository = type;
    libraryFilter = ["kanji", "vocabulary"].includes(type) ? "N5" : "All";
    libraryVisibleCount = LIBRARY_BATCH_SIZE;
    document.getElementById("library-home").hidden = true;
    document.getElementById("library-repository").hidden = false;
    document.getElementById("library-search-input").value = "";
    const titles = { kana:"Kana", kanji:"Kanji", vocabulary:"Vocabulary", slang:"Slang", travel:"Travel" };
    document.getElementById("library-repository-title").textContent = titles[type];
    document.getElementById("library-repository-summary").textContent = `Browse Sakura’s ${titles[type].toLowerCase()} collection.`;
    renderLibraryFilters();
    renderLibraryResults();
    if (["kanji", "vocabulary"].includes(type)) loadLibraryLevels(type, libraryFilter, ++libraryLoadingRevision);
    if (type === "travel") loadLibraryTravel(libraryFilter, ++libraryLoadingRevision);
}

function findLibraryItem(encodedKey) {
    const key = decodeURIComponent(encodedKey);
    return libraryCurrentItems.find(item => (itemKey(item) || `${item.type}:${item.kana}`) === key);
}

function openLibraryItem(item) {
    if (!item) return;
    if (item.type === "kanji") openKanjiDetail(item, "library");
    else if (item.type === "vocabulary") openWordDetail(item, "library");
    else if (item.type === "slang") {
        showRoute("learn-slang", false);
        document.getElementById("native-difficulty-filter").value = "All";
        refreshNativeCategories();
        document.getElementById("native-category-filter").value = "All";
        renderNative(item);
    }
    else if (item.type === "travel" && travelCategoryMetadata(item.category)) {
        pendingTravelPhraseId = item.id;
        currentTravelFilter = "All";
        showRoute(`travel-${item.category}`, false);
    }
}

function showRoute(route, updateHash = true) {
    const normalizedRoute = route === "native" ? "learn-native" : route;
    const previousRoute = currentRoute;
    const nativeMode = normalizedRoute === "learn-slang" ? "slang" : normalizedRoute === "learn-native" ? "native" : null;
    const deckRouteMatch = normalizedRoute.match(/^travel-deck-(deck-.+)$/);
    if (deckRouteMatch) currentTravelDeckId = deckRouteMatch[1];
    const requestedTravelCategory = normalizedRoute.startsWith("travel-") && !deckRouteMatch ? normalizedRoute.slice(7) : null;
    const travelCategory = travelCategoryMetadata(requestedTravelCategory) ? requestedTravelCategory : null;
    const isTravelUtilityRoute = ["travel-my-phrases", "travel-decks", "travel-notes", "travel-countdown", "travel-offline", "travel-yen"].includes(normalizedRoute) || Boolean(deckRouteMatch);
    const viewRoute = nativeMode ? "native" : travelCategory ? "travel-category" : deckRouteMatch ? "travel-deck" : normalizedRoute;
    currentRoute = normalizedRoute;
    if (normalizedRoute === "library") initializeLibrary();
    if (normalizedRoute === "search") buildSearchIndex();
    if (nativeMode) {
        currentNativeMode = nativeMode;
        document.getElementById("native-heading").textContent = nativeMode === "slang" ? "Slang" : "Native Japanese";
        document.querySelector(".native-page-heading p").textContent = nativeMode === "slang" ? "Current expressions, online language, and casual slang." : "Everyday expressions and natural Japanese.";
        refreshNativeCategories();
        if (currentNativeItem?.type !== nativeMode) browseNative(1, true);
    }
    document.querySelectorAll(".view").forEach(view => {
        const active = view.dataset.view === viewRoute;
        view.hidden = !active;
        view.classList.toggle("active-view", active);
    });
    if (travelCategory) {
        const travelBack = document.querySelector("#travel-category-view .back-button");
        travelBack.dataset.route = previousRoute === "library" ? "library" : "travel";
        travelBack.setAttribute("aria-label", previousRoute === "library" ? "Back to Library" : "Back to Travel");
        renderTravelCategory(travelCategory);
    }
    if (normalizedRoute === "travel-my-phrases") renderMyTravelPhrases();
    if (normalizedRoute === "travel-decks") renderTravelDecks();
    if (normalizedRoute === "travel-notes") renderTravelNotes();
    if (normalizedRoute === "travel-countdown") renderTravelCountdown();
    if (normalizedRoute === "travel-offline") verifyTravelOfflinePack();
    if (normalizedRoute === "travel-yen") renderYenConverter();
    if (normalizedRoute === "travel") renderTravelHeaderCountdown();
    if (deckRouteMatch) renderCurrentTravelDeck();
    const mainRoute = travelCategory || isTravelUtilityRoute ? "travel" : ["search", "translate", "learn-native", "learn-slang", "library"].includes(normalizedRoute) || (normalizedRoute.includes("detail") && detailReturnRoute === "library") ? "learn" : normalizedRoute.replace("-detail", "");
    document.querySelectorAll(".nav-button").forEach(button => button.classList.toggle("active", button.dataset.route === mainRoute || (normalizedRoute.includes("detail") && button.dataset.route === detailReturnRoute)));
    const learnView = normalizedRoute === "learn" ? "library" : nativeMode;
    document.querySelectorAll("[data-learn-view]").forEach(button => {
        const active = button.dataset.learnView === learnView;
        button.classList.toggle("active", active);
        button.setAttribute("aria-selected", String(active));
    });
    if (updateHash && !normalizedRoute.includes("detail")) history.replaceState(null, "", `#${normalizedRoute}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function refreshSection(sectionName) {
    const actions = {
        kanjiOfDay: () => browseDailyKanji(1, true),
        wordOfDay: () => browseDailyWord(1, true),
        randomKanji: () => browseKanji(1, true),
        randomVocabulary: () => browseWord(1, true),
        kanjiQuiz: newKanjiQuiz,
        vocabularyQuiz: newVocabularyQuiz
    };
    actions[sectionName]?.();
}

function refreshAllFilteredContent() {
    SECTION_NAMES.forEach(refreshSection);
}

function initializePwaUpdates() {
    if (!("serviceWorker" in navigator)) return;
    const notification = document.getElementById("update-notification");
    const updateButton = document.getElementById("apply-update");
    let waitingWorker = null;
    let reloading = false;

    const showUpdate = worker => {
        waitingWorker = worker;
        notification.hidden = false;
    };

    const registerServiceWorker = async () => {
        try {
            const registration = await navigator.serviceWorker.register("service-worker.js");
            if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration.waiting);
            registration.addEventListener("updatefound", () => {
                const installing = registration.installing;
                installing?.addEventListener("statechange", () => {
                    if (installing.state === "installed" && navigator.serviceWorker.controller) showUpdate(installing);
                });
            });
            registration.update().catch(() => {});
        }
        catch (error) {
            console.warn("Service worker registration failed.", error);
        }
    };

    if (document.readyState === "complete") registerServiceWorker();
    else window.addEventListener("load", registerServiceWorker, { once: true });

    updateButton.addEventListener("click", () => {
        updateButton.disabled = true;
        waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (reloading) return;
        reloading = true;
        location.reload();
    });
}

function setAppearanceMessage(message, error = false) {
    const element = document.getElementById("appearance-message");
    if (!element) return;
    element.textContent = message;
    element.classList.toggle("incorrect", error);
}

function openAppearanceDb() {
    return new Promise((resolve, reject) => {
        if (!("indexedDB" in window)) { reject(new Error("IndexedDB is unavailable.")); return; }
        const request = indexedDB.open(APPEARANCE_DB, 1);
        request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(APPEARANCE_STORE)) request.result.createObjectStore(APPEARANCE_STORE); };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Could not open wallpaper storage."));
    });
}

async function wallpaperRecord(action, value) {
    const db = await openAppearanceDb();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(APPEARANCE_STORE, action === "get" ? "readonly" : "readwrite");
        const store = transaction.objectStore(APPEARANCE_STORE);
        const request = action === "get" ? store.get(WALLPAPER_RECORD) : action === "delete" ? store.delete(WALLPAPER_RECORD) : store.put(value, WALLPAPER_RECORD);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Wallpaper storage failed."));
        transaction.oncomplete = () => db.close();
    });
}

function applyTheme(theme) {
    const selected = THEMES[theme] ? theme : "pink";
    document.documentElement.dataset.theme = selected;
    localStorage.setItem(STORAGE.appearanceTheme, selected);
    renderAppearanceControls();
}

function applyOverlay(value) {
    const selected = ["light","medium","strong"].includes(value) ? value : "medium";
    const strengths = { light:"58%", medium:"76%", strong:"88%" };
    localStorage.setItem(STORAGE.wallpaperOverlay, selected);
    document.documentElement.style.setProperty("--wallpaper-overlay-strength", strengths[selected]);
    document.querySelectorAll("[data-overlay]").forEach(button => button.classList.toggle("active", button.dataset.overlay === selected));
}

function clampWallpaperValue(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number(value) || 0));
}

function normalizeWallpaperFraming(value) {
    const framing = value && typeof value === "object" ? value : DEFAULT_WALLPAPER_FRAMING;
    return {
        positionX: clampWallpaperValue(framing.positionX ?? 50, 0, 100),
        positionY: clampWallpaperValue(framing.positionY ?? 50, 0, 100),
        zoom: clampWallpaperValue(framing.zoom ?? 1, 1, 2)
    };
}

function applyWallpaperFraming(value = wallpaperFraming) {
    const framing = normalizeWallpaperFraming(value);
    document.documentElement.style.setProperty("--wallpaper-position-x", `${framing.positionX}%`);
    document.documentElement.style.setProperty("--wallpaper-position-y", `${framing.positionY}%`);
    document.documentElement.style.setProperty("--wallpaper-zoom", framing.zoom);
}

function renderWallpaperEditor() {
    const image = document.getElementById("wallpaper-editor-image");
    if (!image) return;
    wallpaperFramingDraft = normalizeWallpaperFraming(wallpaperFramingDraft);
    image.style.setProperty("--editor-wallpaper-url", `url("${wallpaperObjectUrl}")`);
    image.style.setProperty("--editor-position-x", `${wallpaperFramingDraft.positionX}%`);
    image.style.setProperty("--editor-position-y", `${wallpaperFramingDraft.positionY}%`);
    image.style.setProperty("--editor-zoom", wallpaperFramingDraft.zoom);
    document.getElementById("wallpaper-zoom").value = wallpaperFramingDraft.zoom;
    document.getElementById("wallpaper-zoom-value").value = `${wallpaperFramingDraft.zoom.toFixed(2)}×`;
}

function setWallpaperEditorMessage(message) {
    const element = document.getElementById("wallpaper-editor-message");
    if (element) element.textContent = message;
}

function openWallpaperEditor() {
    if (!wallpaperObjectUrl) return;
    wallpaperFramingDraft = { ...wallpaperFraming };
    renderWallpaperEditor();
    setWallpaperEditorMessage("");
    const dialog = document.getElementById("wallpaper-editor-dialog");
    if (!dialog.open) dialog.showModal();
    requestAnimationFrame(() => document.getElementById("wallpaper-editor-preview").focus());
}

function cancelWallpaperEditor() {
    wallpaperFramingDraft = { ...wallpaperFraming };
    applyWallpaperFraming(wallpaperFraming);
    const dialog = document.getElementById("wallpaper-editor-dialog");
    if (dialog.open) dialog.close();
}

function saveWallpaperEditor() {
    wallpaperFraming = normalizeWallpaperFraming(wallpaperFramingDraft);
    writeJson(STORAGE.wallpaperFraming, wallpaperFraming);
    applyWallpaperFraming(wallpaperFraming);
    const dialog = document.getElementById("wallpaper-editor-dialog");
    if (dialog.open) dialog.close();
    setAppearanceMessage("Wallpaper framing saved.");
}

function resetWallpaperEditorDraft() {
    wallpaperFramingDraft = { ...DEFAULT_WALLPAPER_FRAMING };
    renderWallpaperEditor();
    setWallpaperEditorMessage("Centered framing restored. Tap Save to keep it.");
}

function setWallpaperDraftZoom(value) {
    wallpaperFramingDraft.zoom = clampWallpaperValue(value, 1, 2);
    renderWallpaperEditor();
}

function nudgeWallpaper(direction, amount = 5) {
    if (direction === "left") wallpaperFramingDraft.positionX += amount;
    if (direction === "right") wallpaperFramingDraft.positionX -= amount;
    if (direction === "up") wallpaperFramingDraft.positionY += amount;
    if (direction === "down") wallpaperFramingDraft.positionY -= amount;
    wallpaperFramingDraft = normalizeWallpaperFraming(wallpaperFramingDraft);
    renderWallpaperEditor();
}

async function loadStoredWallpaper() {
    try {
        const blob = await wallpaperRecord("get");
        if (wallpaperObjectUrl) URL.revokeObjectURL(wallpaperObjectUrl);
        wallpaperObjectUrl = blob instanceof Blob ? URL.createObjectURL(blob) : "";
        if (wallpaperObjectUrl) document.body.style.setProperty("--wallpaper-url", `url("${wallpaperObjectUrl}")`);
        applyWallpaperFraming(wallpaperFraming);
        document.body.classList.toggle("wallpaper-enabled", Boolean(wallpaperObjectUrl) && localStorage.getItem(STORAGE.wallpaperEnabled) === "true");
        renderWallpaperState(Boolean(wallpaperObjectUrl));
    }
    catch (error) {
        document.body.classList.remove("wallpaper-enabled");
        renderWallpaperState(false);
        setAppearanceMessage("Custom wallpaper storage is unavailable. Color themes still work normally.", true);
    }
}

function renderWallpaperState(hasWallpaper) {
    const preview = document.getElementById("wallpaper-preview");
    if (!preview) return;
    const enabled = hasWallpaper && localStorage.getItem(STORAGE.wallpaperEnabled) === "true";
    preview.src = wallpaperObjectUrl || "";
    document.getElementById("wallpaper-preview-wrap").hidden = !hasWallpaper;
    document.getElementById("wallpaper-empty").hidden = hasWallpaper;
    document.getElementById("remove-wallpaper").hidden = !hasWallpaper;
    document.getElementById("adjust-wallpaper").hidden = !hasWallpaper;
    document.getElementById("choose-wallpaper").textContent = hasWallpaper ? "Replace Photo" : "Choose Photo";
    document.getElementById("wallpaper-toggle").checked = enabled;
    document.getElementById("wallpaper-toggle").disabled = !hasWallpaper;
    document.getElementById("wallpaper-status").textContent = enabled ? "On" : "Off";
}

function renderAppearanceControls() {
    const container = document.getElementById("theme-options");
    if (!container) return;
    const active = document.documentElement.dataset.theme || "pink";
    container.innerHTML = Object.entries(THEMES).map(([key, theme]) => `<button class="theme-card ${key === active ? "active" : ""}" type="button" data-theme-choice="${key}"><span class="theme-swatch" style="--swatch:${theme.swatch}"></span><strong>${theme.name}</strong><span class="theme-check">${key === active ? "✓" : ""}</span></button>`).join("");
    document.getElementById("selected-theme-label").textContent = THEMES[active].name;
    applyOverlay(localStorage.getItem(STORAGE.wallpaperOverlay) || "medium");
}

async function decodeAndCompressWallpaper(file) {
    if (!file || !file.type.startsWith("image/")) throw new Error("Please choose an image file.");
    let source;
    try {
        source = "createImageBitmap" in window ? await createImageBitmap(file, { imageOrientation:"from-image" }) : await new Promise((resolve, reject) => { const image=new Image(); const url=URL.createObjectURL(file); image.onload=()=>{URL.revokeObjectURL(url);resolve(image);}; image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error("Image decoding failed."));}; image.src=url; });
    }
    catch { throw new Error("Sakura could not read that image. Try a JPEG, PNG, or WebP file."); }
    const width = source.width || source.naturalWidth, height = source.height || source.naturalHeight;
    const scale = Math.min(1, 1920 / Math.max(width, height));
    const canvas = document.createElement("canvas"); canvas.width=Math.max(1,Math.round(width*scale)); canvas.height=Math.max(1,Math.round(height*scale));
    const context = canvas.getContext("2d"); if (!context) throw new Error("Image resizing is unavailable in this browser.");
    context.drawImage(source,0,0,canvas.width,canvas.height); source.close?.();
    const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", .84));
    if (blob) return blob;
    const jpeg = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", .84));
    if (!jpeg) throw new Error("Sakura could not compress that image.");
    return jpeg;
}

async function previewWallpaperFile(file) {
    if (!file) return;
    setAppearanceMessage("Preparing preview…");
    try {
        pendingWallpaperBlob = await decodeAndCompressWallpaper(file);
        const previewUrl = URL.createObjectURL(pendingWallpaperBlob);
        document.getElementById("wallpaper-preview").src = previewUrl;
        document.getElementById("wallpaper-preview-wrap").hidden = false;
        document.getElementById("wallpaper-preview-label").textContent = "Preview — not applied yet";
        document.getElementById("wallpaper-confirm-actions").hidden = false;
        setAppearanceMessage("Preview ready. Confirm to save it on this device.");
    }
    catch (error) { pendingWallpaperBlob=null; setAppearanceMessage(error.message, true); }
}

async function confirmWallpaperPreview() {
    if (!pendingWallpaperBlob) return;
    try {
        await wallpaperRecord("put", pendingWallpaperBlob);
        pendingWallpaperBlob=null; localStorage.setItem(STORAGE.wallpaperEnabled,"true");
        wallpaperFraming = { ...DEFAULT_WALLPAPER_FRAMING };
        writeJson(STORAGE.wallpaperFraming, wallpaperFraming);
        applyWallpaperFraming(wallpaperFraming);
        document.getElementById("wallpaper-confirm-actions").hidden=true; document.getElementById("wallpaper-preview-label").textContent="Saved wallpaper";
        await loadStoredWallpaper(); setAppearanceMessage("Wallpaper saved and turned on. Adjust the framing if you like."); openWallpaperEditor();
    }
    catch (error) { setAppearanceMessage(error?.name === "QuotaExceededError" ? "This photo is too large for available device storage." : "Sakura could not save this wallpaper on this device.", true); }
}

async function removeWallpaper() {
    try { await wallpaperRecord("delete"); } catch {}
    pendingWallpaperBlob=null; localStorage.setItem(STORAGE.wallpaperEnabled,"false"); localStorage.removeItem(STORAGE.wallpaperFraming);
    wallpaperFraming={...DEFAULT_WALLPAPER_FRAMING}; wallpaperFramingDraft={...wallpaperFraming}; applyWallpaperFraming(wallpaperFraming);
    if (wallpaperObjectUrl) URL.revokeObjectURL(wallpaperObjectUrl); wallpaperObjectUrl="";
    document.body.classList.remove("wallpaper-enabled"); document.body.style.removeProperty("--wallpaper-url"); renderWallpaperState(false); setAppearanceMessage("Wallpaper removed. Your color theme is unchanged.");
}

async function resetAppearance() {
    if (!window.confirm("Reset the color theme and remove the saved wallpaper?")) return;
    applyTheme("pink"); applyOverlay("medium"); await removeWallpaper(); setAppearanceMessage("Appearance reset to Sakura Pink.");
}

function openAppearanceSettings() {
    renderAppearanceControls();
    loadStoredWallpaper();
    document.getElementById("settings-dialog").showModal();
}

function addListeners() {
    document.querySelectorAll("[data-route]").forEach(control => control.addEventListener("click", event => {
        event.preventDefault();
        const quizTarget = control.dataset.quizTarget;
        showRoute(control.dataset.route);
        if (quizTarget) showQuizTab(quizTarget);
    }));
    document.getElementById("open-hub").addEventListener("click", () => showRoute("hub"));
    document.getElementById("library-view").addEventListener("click", event => {
        const repository = event.target.closest("[data-library-repository]");
        const save = event.target.closest("[data-library-save]");
        const open = event.target.closest("[data-library-open]");
        if (repository) openLibraryRepository(repository.dataset.libraryRepository);
        else if (save) { toggleSaved(findLibraryItem(save.dataset.librarySave)); }
        else if (open) openLibraryItem(findLibraryItem(open.dataset.libraryOpen));
    });
    document.getElementById("library-repository-back").addEventListener("click", libraryHome);
    document.getElementById("library-collection-select").addEventListener("change", event => openLibraryRepository(event.target.value));
    document.getElementById("library-category-select").addEventListener("change", event => {
        libraryFilter = event.target.value;
        libraryVisibleCount = LIBRARY_BATCH_SIZE;
        renderLibraryResults();
        if (["kanji", "vocabulary"].includes(libraryRepository)) loadLibraryLevels(libraryRepository, libraryFilter, ++libraryLoadingRevision);
        if (libraryRepository === "travel") loadLibraryTravel(libraryFilter, ++libraryLoadingRevision);
    });
    document.getElementById("library-search-input").addEventListener("input", () => { libraryVisibleCount=LIBRARY_BATCH_SIZE; renderLibraryResults(); });
    document.getElementById("clear-library-search").addEventListener("click", () => { document.getElementById("library-search-input").value=""; libraryVisibleCount=LIBRARY_BATCH_SIZE; renderLibraryResults(); document.getElementById("library-search-input").focus(); });
    document.getElementById("library-show-more").addEventListener("click", () => { libraryVisibleCount += LIBRARY_BATCH_SIZE; renderLibraryResults(); });
    document.getElementById("travel-mode-toggle").addEventListener("change", event => setTravelModeEnabled(event.target.checked));
    document.getElementById("header-appearance").addEventListener("click", openAppearanceSettings);
    document.querySelectorAll("[data-hub-action]").forEach(button => button.addEventListener("click", () => {
        if (button.dataset.hubAction === "appearance") openAppearanceSettings();
        if (button.dataset.hubAction === "search") openSearch("hub");
        if (button.dataset.hubAction === "flashcards") { showRoute("saved"); showSavedTab("flashcards"); }
    }));
    document.querySelectorAll("[data-learn-view]").forEach(button => button.addEventListener("click", () => {
        const learnView = button.dataset.learnView;
        showRoute(learnView === "library" ? "learn" : `learn-${learnView}`);
    }));
    document.getElementById("travel-category-filters").addEventListener("click", event => {
        const button = event.target.closest("[data-travel-filter]");
        if (!button) return;
        currentTravelFilter = button.dataset.travelFilter;
        renderTravelFilters(currentTravelCategory);
        const pool = travelPhrasePool();
        currentTravelIndex = 0;
        renderTravelPhraseCard(pool[0] || null);
    });
    document.getElementById("previous-travel-phrase").addEventListener("click", () => browseTravelPhrase(-1));
    document.getElementById("random-travel-phrase").addEventListener("click", () => browseTravelPhrase(1, true));
    document.getElementById("next-travel-phrase").addEventListener("click", () => browseTravelPhrase(1));
    document.getElementById("travel-phrase-list").addEventListener("click", event => {
        if (!event.target.closest("[data-save-travel-phrase]") || !currentTravelPhrase) return;
        toggleSaved(currentTravelPhrase);
        renderTravelPhraseCard(currentTravelPhrase);
    });
    document.getElementById("travel-my-phrases-view").addEventListener("click", event => {
        const filter = event.target.closest("[data-saved-travel-filter]");
        const pin = event.target.closest("[data-pin-travel-id]");
        const open = event.target.closest("[data-open-travel-saved]");
        if (filter) { savedTravelCategoryFilter = filter.dataset.savedTravelFilter; renderMyTravelPhrases(); }
        else if (pin) togglePinnedTravelPhrase(pin.dataset.pinTravelId);
        else if (open) openSavedItem(savedItems.find(item => itemKey(item) === open.dataset.openTravelSaved));
    });
    document.getElementById("create-travel-deck").addEventListener("click", () => openTravelDeckEditor());
    document.getElementById("travel-decks-empty").addEventListener("click", event => { if (event.target.closest("[data-create-travel-deck]")) openTravelDeckEditor(); });
    document.getElementById("travel-deck-list").addEventListener("click", event => { const button=event.target.closest("[data-open-travel-deck]"); if(button)showRoute(`travel-deck-${button.dataset.openTravelDeck}`); });
    document.getElementById("edit-travel-deck").addEventListener("click", () => openTravelDeckEditor(travelDeckById()));
    document.getElementById("add-travel-deck-phrases").addEventListener("click", openTravelDeckPicker);
    document.getElementById("travel-deck-empty").addEventListener("click", event => { if(event.target.closest("[data-add-deck-phrases]"))openTravelDeckPicker(); });
    document.getElementById("travel-deck-phrases").addEventListener("click", event => { const remove=event.target.closest("[data-remove-deck-phrase]");const open=event.target.closest("[data-open-deck-phrase]");if(remove)removePhraseFromCurrentDeck(remove.dataset.removeDeckPhrase);else if(open)openSavedItem(savedItems.find(item=>itemKey(item)===open.dataset.openDeckPhrase)); });
    document.getElementById("travel-deck-form").addEventListener("submit", saveTravelDeck);
    document.getElementById("close-travel-deck-editor").addEventListener("click", () => document.getElementById("travel-deck-editor").close());
    document.getElementById("travel-deck-icons").addEventListener("click", event => { const button=event.target.closest("[data-deck-icon]");if(button){travelDeckIconChoice=button.dataset.deckIcon;renderTravelDeckIcons();} });
    document.getElementById("delete-travel-deck").addEventListener("click", deleteCurrentTravelDeck);
    document.getElementById("close-travel-deck-picker").addEventListener("click", () => document.getElementById("travel-deck-picker").close());
    document.getElementById("cancel-travel-deck-picker").addEventListener("click", () => document.getElementById("travel-deck-picker").close());
    document.getElementById("travel-deck-picker-search").addEventListener("input", renderTravelDeckPicker);
    document.getElementById("travel-deck-picker-filters").addEventListener("click", event => { const button=event.target.closest("[data-deck-picker-filter]");if(button){travelDeckPickerFilter=button.dataset.deckPickerFilter;renderTravelDeckPicker();} });
    document.getElementById("travel-deck-picker-list").addEventListener("change", event => { const input=event.target.closest("[data-deck-picker-id]");if(!input)return;if(input.checked)travelDeckPickerSelection.add(input.dataset.deckPickerId);else travelDeckPickerSelection.delete(input.dataset.deckPickerId);renderTravelDeckPicker(); });
    document.getElementById("save-travel-deck-phrases").addEventListener("click", saveTravelDeckPicker);
    document.getElementById("create-travel-note").addEventListener("click", () => openTravelNoteEditor());
    document.getElementById("travel-notes-empty").addEventListener("click", event => { if(event.target.closest("[data-create-travel-note]"))openTravelNoteEditor(); });
    document.getElementById("travel-note-search").addEventListener("input", renderTravelNotes);
    document.getElementById("travel-note-filters").addEventListener("click", event => { const button=event.target.closest("[data-travel-note-filter]");if(button){travelNoteCategoryFilter=button.dataset.travelNoteFilter;renderTravelNotes();} });
    document.getElementById("travel-notes-view").addEventListener("click", event => { const button=event.target.closest("[data-open-travel-note]");if(button)openTravelNoteDetail(button.dataset.openTravelNote); });
    document.getElementById("travel-note-form").addEventListener("submit", saveTravelNote);
    document.getElementById("close-travel-note-editor").addEventListener("click", () => document.getElementById("travel-note-editor").close());
    document.getElementById("cancel-travel-note").addEventListener("click", () => document.getElementById("travel-note-editor").close());
    document.getElementById("close-travel-note-detail").addEventListener("click", () => document.getElementById("travel-note-detail").close());
    document.getElementById("edit-travel-note").addEventListener("click", () => { const note=travelNoteById();document.getElementById("travel-note-detail").close();openTravelNoteEditor(note); });
    document.getElementById("pin-travel-note").addEventListener("click", toggleCurrentTravelNotePin);
    document.getElementById("delete-travel-note").addEventListener("click", deleteCurrentTravelNote);
    document.querySelectorAll("[data-edit-travel-countdown]").forEach(button => button.addEventListener("click", openTravelCountdownEditor));
    document.getElementById("edit-travel-countdown").addEventListener("click", openTravelCountdownEditor);
    document.getElementById("remove-travel-countdown").addEventListener("click", removeTravelCountdown);
    document.getElementById("travel-countdown-form").addEventListener("submit", saveTravelCountdown);
    document.getElementById("close-travel-countdown-editor").addEventListener("click", () => document.getElementById("travel-countdown-editor").close());
    document.getElementById("cancel-travel-countdown").addEventListener("click", () => document.getElementById("travel-countdown-editor").close());
    document.getElementById("travel-offline-action").addEventListener("click", () => downloadTravelOfflinePack(travelOfflinePackState.status === "ready"));
    document.getElementById("remove-travel-offline-pack").addEventListener("click", removeTravelOfflinePack);
    document.querySelectorAll("[data-yen-expression]").forEach(input => {
        input.addEventListener("focus", () => activateYenSide(input.dataset.yenExpression));
        input.addEventListener("input", () => editYenExpression(input.dataset.yenExpression, input.value));
    });
    document.querySelectorAll("[data-yen-panel]").forEach(panel => panel.addEventListener("click", event => {
        if (!event.target.closest("button, input, select, label")) activateYenSide(panel.dataset.yenPanel, true);
    }));
    document.querySelectorAll("[data-yen-currency]").forEach(select => select.addEventListener("change", () => setYenCurrency(select.dataset.yenCurrency, select.value)));
    document.querySelectorAll("[data-yen-key]").forEach(button => button.addEventListener("click", () => insertYenKey(button.dataset.yenSide, button.dataset.yenKey)));
    document.querySelectorAll("[data-yen-clear]").forEach(button => button.addEventListener("click", () => clearYenExpression(button.dataset.yenClear)));
    document.getElementById("swap-yen-currencies").addEventListener("click", swapYenCurrencies);
    document.getElementById("edit-yen-rate").addEventListener("click", openYenRateEditor);
    document.getElementById("yen-rate-form").addEventListener("submit", saveYenRate);
    document.getElementById("close-yen-rate-editor").addEventListener("click", () => document.getElementById("yen-rate-editor").close());
    document.getElementById("cancel-yen-rate").addEventListener("click", () => document.getElementById("yen-rate-editor").close());
    document.getElementById("translation-contexts").addEventListener("click", event => { const button=event.target.closest("[data-translation-context]"); if(button){translationContext=button.dataset.translationContext;renderTranslationChips();} });
    document.getElementById("translation-tones").addEventListener("click", event => { const button=event.target.closest("[data-translation-tone]"); if(button){translationTone=button.dataset.translationTone;renderTranslationChips();} });
    document.getElementById("translation-form").addEventListener("submit",requestTranslation);
    document.getElementById("translation-english").addEventListener("input",event=>{document.getElementById("translation-character-count").textContent=event.target.value.length;});
    document.getElementById("clear-translation").addEventListener("click",()=>{document.getElementById("translation-form").reset();document.getElementById("translation-character-count").textContent="0";document.getElementById("translation-message").textContent="";renderTranslationResult(null);});
    document.getElementById("copy-translation").addEventListener("click",async()=>{if(!currentTranslationResult)return;try{await navigator.clipboard.writeText(currentTranslationResult.japanese);document.getElementById("translation-message").textContent="Copied Japanese to the clipboard.";}catch{document.getElementById("translation-message").textContent="Copy is unavailable. Press and hold the Japanese text to copy it.";}});
    document.getElementById("save-translation").addEventListener("click",()=>{const item=translationResultItem();if(!item)return;toggleSaved(item);invalidateSearchIndex();renderTranslationResult(currentTranslationResult);});
    document.getElementById("translation-history").addEventListener("click",event=>{const remove=event.target.closest("[data-delete-translation-history]");if(remove){translationHistory=translationHistory.filter(item=>item.id!==remove.dataset.deleteTranslationHistory);writeJson(STORAGE.translationHistory,translationHistory);renderTranslationHistory();return;}const reuse=event.target.closest("[data-translation-history]");if(reuse){const item=translationHistory.find(record=>record.id===reuse.dataset.translationHistory);if(item){document.getElementById("translation-english").value=item.english;translationContext=item.context;translationTone=item.tone;renderTranslationChips();renderTranslationResult(item.result);}}});
    document.getElementById("clear-translation-history").addEventListener("click",()=>{if(window.confirm("Clear all translation history?")){translationHistory=[];writeJson(STORAGE.translationHistory,translationHistory);renderTranslationHistory();}});
    const entryDialog = document.getElementById("entry-manager-dialog");
    document.getElementById("open-entry-manager").addEventListener("click", () => { resetEntryForm(); showEntryTab("form"); entryDialog.showModal(); });
    document.getElementById("close-entry-manager").addEventListener("click", () => entryDialog.close());
    document.querySelectorAll("[data-entry-tab]").forEach(button => button.addEventListener("click", () => showEntryTab(button.dataset.entryTab)));
    document.getElementById("entry-type").addEventListener("change", () => renderEntryCategoryChips());
    document.getElementById("cancel-entry-edit").addEventListener("click", () => resetEntryForm());
    document.getElementById("entry-form").addEventListener("submit", event => {
        event.preventDefault();
        const editingId = document.getElementById("entry-edit-id").value;
        const entry = readEntryForm();
        const errors = validateUserEntry(entry, editingId);
        if (errors.length) { document.getElementById("entry-form-message").textContent = errors.join(" "); return; }
        const near = possibleNearDuplicate(entry, editingId);
        if (near && !confirm(`Possible near duplicate: “${near.expression}”. Save anyway?`)) return;
        userNativeEntries = userNativeEntries.filter(item => item.id !== editingId);
        userSlangEntries = userSlangEntries.filter(item => item.id !== editingId);
        (entry.type === "slang" ? userSlangEntries : userNativeEntries).push(entry);
        persistUserEntries(); resetEntryForm(); showEntryTab("list");
    });
    document.getElementById("my-entry-search").addEventListener("input", renderMyEntries);
    document.getElementById("my-entry-type-filter").addEventListener("change", renderMyEntries);
    document.getElementById("my-entry-list").addEventListener("click", event => {
        const edit = event.target.closest("[data-edit-user-entry]");
        const remove = event.target.closest("[data-delete-user-entry]");
        if (edit) { resetEntryForm(userEntries().find(item => item.id === edit.dataset.editUserEntry)); showEntryTab("form"); }
        if (remove && confirm("Delete this user-created entry?")) { userNativeEntries = userNativeEntries.filter(item => item.id !== remove.dataset.deleteUserEntry); userSlangEntries = userSlangEntries.filter(item => item.id !== remove.dataset.deleteUserEntry); persistUserEntries(); }
    });
    document.getElementById("export-user-entries").addEventListener("click", exportUserEntries);
    document.getElementById("import-user-entries").addEventListener("change", event => { if (event.target.files[0]) importUserEntries(event.target.files[0]); event.target.value = ""; });
    document.getElementById("delete-all-user-entries").addEventListener("click", () => { if (confirm("Delete all user-created entries? This cannot be undone.")) { userNativeEntries = []; userSlangEntries = []; persistUserEntries(); } });
    document.getElementById("header-search").addEventListener("click", () => openSearch(currentRoute));
    document.getElementById("open-learn-search").addEventListener("click", () => openSearch("learn"));
    document.getElementById("close-search").addEventListener("click", () => showRoute(searchReturnRoute));
    document.getElementById("universal-search-input").addEventListener("input", () => {
        resetSearchResultLimit();
        renderSearchResults();
        prepareTravelSearchForCurrentQuery();
    });
    document.getElementById("search-form").addEventListener("submit", event => {
        event.preventDefault();
        addRecentSearch(document.getElementById("universal-search-input").value);
        renderSearchResults();
        prepareTravelSearchForCurrentQuery();
    });
    document.getElementById("clear-search-input").addEventListener("click", () => {
        document.getElementById("universal-search-input").value = "";
        resetSearchResultLimit();
        renderSearchResults();
        document.getElementById("universal-search-input").focus();
    });
    document.getElementById("search-type-filters").addEventListener("click", event => {
        const button = event.target.closest("[data-search-type]");
        if (!button) return;
        searchType = button.dataset.searchType;
        resetSearchResultLimit();
        document.querySelectorAll("[data-search-type]").forEach(filter => filter.classList.toggle("active", filter === button));
        document.getElementById("search-jlpt-panel").hidden = !["all", "kanji", "vocabulary"].includes(searchType);
        renderSearchResults();
        if (["all", "travel"].includes(searchType)) prepareTravelSearchForCurrentQuery();
    });
    document.getElementById("show-more-search-results").addEventListener("click", () => {
        searchVisibleCount += 40;
        renderSearchResults();
    });
    document.getElementById("search-results").addEventListener("click", event => {
        const saveButton = event.target.closest("[data-search-save]");
        if (saveButton) {
            toggleSaved(findSearchItem(saveButton.dataset.searchSave));
            renderSearchResults();
            return;
        }
        const openButton = event.target.closest("[data-search-open]");
        if (openButton) openSearchResult(findSearchItem(openButton.dataset.searchOpen));
    });
    document.getElementById("recent-search-list").addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove-recent]");
        if (removeButton) {
            recentSearches.splice(Number(removeButton.dataset.removeRecent), 1);
            writeJson(STORAGE.recentSearches, recentSearches);
            renderRecentSearches();
            return;
        }
        const useButton = event.target.closest("[data-recent-index]");
        if (useButton) {
            document.getElementById("universal-search-input").value = recentSearches[Number(useButton.dataset.recentIndex)] || "";
            resetSearchResultLimit();
            renderSearchResults();
            prepareTravelSearchForCurrentQuery();
        }
    });
    document.getElementById("clear-recent-searches").addEventListener("click", () => {
        recentSearches = [];
        writeJson(STORAGE.recentSearches, recentSearches);
        renderRecentSearches();
    });

    document.querySelectorAll("[data-open-detail]").forEach(button => button.addEventListener("click", () => button.dataset.openDetail === "kanji" ? openKanjiDetail(currentDailyKanji, "home") : openWordDetail(currentDailyWord, "home")));
    document.getElementById("open-browse-kanji-detail").addEventListener("click", () => openKanjiDetail(currentBrowseKanji, "learn"));
    document.getElementById("open-browse-word-detail").addEventListener("click", () => openWordDetail(currentBrowseWord, "learn"));
    document.querySelectorAll("[data-detail-back]").forEach(button => button.addEventListener("click", () => showRoute(detailReturnRoute)));

    document.getElementById("previous-daily-kanji").addEventListener("click", () => browseDailyKanji(-1));
    document.getElementById("random-daily-kanji").addEventListener("click", () => browseDailyKanji(1, true));
    document.getElementById("refresh-daily-kanji").addEventListener("click", () => browseDailyKanji(1, true));
    document.getElementById("next-daily-kanji").addEventListener("click", () => browseDailyKanji(1));
    document.getElementById("previous-daily-word").addEventListener("click", () => browseDailyWord(-1));
    document.getElementById("random-daily-word").addEventListener("click", () => browseDailyWord(1, true));
    document.getElementById("refresh-daily-word").addEventListener("click", () => browseDailyWord(1, true));
    document.getElementById("next-daily-word").addEventListener("click", () => browseDailyWord(1));
    document.getElementById("save-daily-kanji").addEventListener("click", () => toggleSaved(currentDailyKanji));
    document.getElementById("save-daily-word").addEventListener("click", () => toggleSaved(currentDailyWord));

    document.getElementById("previous-kanji").addEventListener("click", () => browseKanji(-1));
    document.getElementById("random-kanji").addEventListener("click", () => browseKanji(1, true));
    document.getElementById("next-kanji").addEventListener("click", () => browseKanji(1));
    document.getElementById("save-browse-kanji").addEventListener("click", () => toggleSaved(currentBrowseKanji));
    document.getElementById("previous-word").addEventListener("click", () => browseWord(-1));
    document.getElementById("random-word").addEventListener("click", () => browseWord(1, true));
    document.getElementById("next-word").addEventListener("click", () => browseWord(1));
    document.getElementById("save-browse-word").addEventListener("click", () => toggleSaved(currentBrowseWord));

    document.getElementById("save-detail-kanji").addEventListener("click", () => toggleSaved(currentDetailKanji));
    document.getElementById("save-detail-word").addEventListener("click", () => toggleSaved(currentDetailWord));
    document.getElementById("detail-previous-kanji").addEventListener("click", () => moveDetailKanji(-1));
    document.getElementById("detail-random-kanji").addEventListener("click", () => moveDetailKanji(1, true));
    document.getElementById("detail-next-kanji").addEventListener("click", () => moveDetailKanji(1));
    document.getElementById("detail-previous-word").addEventListener("click", () => moveDetailWord(-1));
    document.getElementById("detail-random-word").addEventListener("click", () => moveDetailWord(1, true));
    document.getElementById("detail-next-word").addEventListener("click", () => moveDetailWord(1));
    document.getElementById("detail-kanji-examples").addEventListener("click", event => {
        const button = event.target.closest("[data-example-id]");
        if (!button) return;
        toggleSaved(JSON.parse(decodeURIComponent(button.dataset.exampleId)));
        renderKanjiDetail(currentDetailKanji);
    });

    document.querySelectorAll("[data-quiz-tab]").forEach(button => button.addEventListener("click", () => showQuizTab(button.dataset.quizTab)));
    document.querySelectorAll("[data-reset-quiz]").forEach(button => button.addEventListener("click", () => resetQuizSession(button.dataset.resetQuiz)));
    document.getElementById("kana-quiz-groups").addEventListener("click", event => {
        const button = event.target.closest("[data-kana-group]");
        if (button) toggleKanaQuizGroup(button.dataset.kanaGroup);
    });
    document.getElementById("check-kana").addEventListener("click", checkKana);
    document.getElementById("reveal-kana").addEventListener("click", () => setFeedback("kana-feedback", `${currentKana[0]} is ${currentKana[1]}.`));
    document.getElementById("next-kana").addEventListener("click", newKana);
    document.getElementById("kana-answer").addEventListener("keydown", event => { if (event.key === "Enter") checkKana(); });
    document.getElementById("check-kanji-quiz").addEventListener("click", checkKanjiQuiz);
    document.getElementById("reveal-kanji-quiz").addEventListener("click", () => setFeedback("kanji-quiz-feedback", currentKanjiQuiz ? `${currentKanjiQuiz.meaning} · On: ${currentKanjiQuiz.onyomi.join(", ")} · Kun: ${currentKanjiQuiz.kunyomi.join(", ")}` : "No content available."));
    document.getElementById("next-kanji-quiz").addEventListener("click", newKanjiQuiz);
    document.getElementById("kanji-quiz-answer").addEventListener("keydown", event => { if (event.key === "Enter") checkKanjiQuiz(); });
    document.getElementById("check-vocabulary-quiz").addEventListener("click", checkVocabularyQuiz);
    document.getElementById("reveal-vocabulary-quiz").addEventListener("click", () => setFeedback("vocabulary-quiz-feedback", currentVocabularyQuiz?.meaning || "No content available."));
    document.getElementById("next-vocabulary-quiz").addEventListener("click", newVocabularyQuiz);
    document.getElementById("vocabulary-quiz-answer").addEventListener("keydown", event => { if (event.key === "Enter") checkVocabularyQuiz(); });

    document.getElementById("native-difficulty-filter").addEventListener("change", () => { localStorage.setItem(STORAGE.nativeDifficulty, document.getElementById("native-difficulty-filter").value); browseNative(1, true); });
    document.getElementById("native-category-filter").addEventListener("change", () => browseNative(1, true));
    document.getElementById("previous-native").addEventListener("click", () => browseNative(-1));
    document.getElementById("random-native").addEventListener("click", () => browseNative(1, true));
    document.getElementById("next-native").addEventListener("click", () => browseNative(1));
    document.getElementById("save-native-item").addEventListener("click", () => toggleSaved(currentNativeItem));

    document.querySelectorAll("[data-saved-tab]").forEach(button => button.addEventListener("click", () => showSavedTab(button.dataset.savedTab)));
    document.getElementById("saved-type-filter").addEventListener("change", renderSavedItems);
    document.getElementById("saved-level-filter").addEventListener("change", renderSavedItems);
    document.getElementById("saved-items").addEventListener("click", event => {
        const removeButton = event.target.closest("[data-remove-key]");
        const openButton = event.target.closest("[data-open-saved-key]");
        if (removeButton) removeItem(savedItems.find(item => itemKey(item) === removeButton.dataset.removeKey));
        else if (openButton) openSavedItem(savedItems.find(item => itemKey(item) === openButton.dataset.openSavedKey));
    });
    document.getElementById("clear-saved").addEventListener("click", () => {
        if (!savedItems.length || !window.confirm("Clear every saved learning item? This cannot be undone.")) return;
        savedItems = [];
        flashcardStatuses = {};
        writeJson(STORAGE.saved, savedItems);
        writeJson(STORAGE.statuses, flashcardStatuses);
        updateSavedUi();
    });
    document.getElementById("start-flashcards").addEventListener("click", () => showSavedTab("flashcards"));
    document.getElementById("deck-type-filter").addEventListener("change", buildFlashcardDeck);
    document.getElementById("review-only-filter").addEventListener("change", buildFlashcardDeck);
    document.getElementById("flashcard").addEventListener("click", () => { flashcardRevealed = !flashcardRevealed; renderFlashcard(); });
    document.getElementById("reveal-flashcard").addEventListener("click", () => { flashcardRevealed = true; renderFlashcard(); });
    document.getElementById("previous-flashcard").addEventListener("click", () => { if (flashcardDeck.length) flashcardIndex = (flashcardIndex - 1 + flashcardDeck.length) % flashcardDeck.length; flashcardRevealed = false; renderFlashcard(); });
    document.getElementById("next-flashcard").addEventListener("click", () => { if (flashcardDeck.length) flashcardIndex = (flashcardIndex + 1) % flashcardDeck.length; flashcardRevealed = false; renderFlashcard(); });
    document.getElementById("shuffle-flashcards").addEventListener("click", shuffleDeck);
    document.getElementById("known-flashcard").addEventListener("click", () => setFlashcardStatus("known"));
    document.getElementById("review-flashcard").addEventListener("click", () => setFlashcardStatus("review"));
    document.getElementById("restart-flashcards").addEventListener("click", buildFlashcardDeck);

    const settings = document.getElementById("settings-dialog");
    document.getElementById("close-settings").addEventListener("click", () => settings.close());
    document.getElementById("done-settings").addEventListener("click", () => settings.close());
    document.getElementById("theme-options").addEventListener("click", event => { const button=event.target.closest("[data-theme-choice]"); if(button) applyTheme(button.dataset.themeChoice); });
    document.getElementById("overlay-options").addEventListener("click", event => { const button=event.target.closest("[data-overlay]"); if(button) applyOverlay(button.dataset.overlay); });
    document.getElementById("choose-wallpaper").addEventListener("click", () => document.getElementById("wallpaper-file-input").click());
    document.getElementById("wallpaper-file-input").addEventListener("change", event => { if(event.target.files[0]) previewWallpaperFile(event.target.files[0]); event.target.value=""; });
    document.getElementById("apply-wallpaper-preview").addEventListener("click", confirmWallpaperPreview);
    document.getElementById("cancel-wallpaper-preview").addEventListener("click", () => { pendingWallpaperBlob=null; document.getElementById("wallpaper-confirm-actions").hidden=true; loadStoredWallpaper(); setAppearanceMessage("Preview cancelled."); });
    document.getElementById("remove-wallpaper").addEventListener("click", removeWallpaper);
    document.getElementById("wallpaper-toggle").addEventListener("change", event => { localStorage.setItem(STORAGE.wallpaperEnabled,String(event.target.checked)); document.body.classList.toggle("wallpaper-enabled",event.target.checked&&Boolean(wallpaperObjectUrl)); renderWallpaperState(Boolean(wallpaperObjectUrl)); });
    const wallpaperEditor = document.getElementById("wallpaper-editor-dialog");
    const wallpaperEditorPreview = document.getElementById("wallpaper-editor-preview");
    document.getElementById("adjust-wallpaper").addEventListener("click", openWallpaperEditor);
    document.getElementById("close-wallpaper-editor").addEventListener("click", cancelWallpaperEditor);
    document.getElementById("cancel-wallpaper-editor").addEventListener("click", cancelWallpaperEditor);
    document.getElementById("save-wallpaper-position").addEventListener("click", saveWallpaperEditor);
    document.getElementById("reset-wallpaper-position").addEventListener("click", resetWallpaperEditorDraft);
    document.getElementById("wallpaper-zoom").addEventListener("input", event => setWallpaperDraftZoom(event.target.value));
    document.getElementById("wallpaper-zoom-out").addEventListener("click", () => setWallpaperDraftZoom(wallpaperFramingDraft.zoom - .1));
    document.getElementById("wallpaper-zoom-in").addEventListener("click", () => setWallpaperDraftZoom(wallpaperFramingDraft.zoom + .1));
    document.querySelectorAll("[data-wallpaper-nudge]").forEach(button => button.addEventListener("click", () => nudgeWallpaper(button.dataset.wallpaperNudge)));
    wallpaperEditorPreview.addEventListener("pointerdown", event => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        wallpaperEditorPreview.setPointerCapture(event.pointerId);
        wallpaperDragState = { pointerId:event.pointerId, x:event.clientX, y:event.clientY, positionX:wallpaperFramingDraft.positionX, positionY:wallpaperFramingDraft.positionY };
    });
    wallpaperEditorPreview.addEventListener("pointermove", event => {
        if (!wallpaperDragState || wallpaperDragState.pointerId !== event.pointerId) return;
        event.preventDefault();
        const bounds = wallpaperEditorPreview.getBoundingClientRect();
        wallpaperFramingDraft.positionX = wallpaperDragState.positionX - ((event.clientX - wallpaperDragState.x) / Math.max(1, bounds.width)) * 100;
        wallpaperFramingDraft.positionY = wallpaperDragState.positionY - ((event.clientY - wallpaperDragState.y) / Math.max(1, bounds.height)) * 100;
        wallpaperFramingDraft = normalizeWallpaperFraming(wallpaperFramingDraft);
        renderWallpaperEditor();
    });
    const finishWallpaperDrag = event => {
        if (!wallpaperDragState || wallpaperDragState.pointerId !== event.pointerId) return;
        if (wallpaperEditorPreview.hasPointerCapture(event.pointerId)) wallpaperEditorPreview.releasePointerCapture(event.pointerId);
        wallpaperDragState = null;
    };
    wallpaperEditorPreview.addEventListener("pointerup", finishWallpaperDrag);
    wallpaperEditorPreview.addEventListener("pointercancel", finishWallpaperDrag);
    wallpaperEditorPreview.addEventListener("keydown", event => {
        const directions = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
        if (!directions[event.key]) return;
        event.preventDefault();
        nudgeWallpaper(directions[event.key], event.shiftKey ? 10 : 3);
    });
    wallpaperEditor.addEventListener("cancel", event => { event.preventDefault(); cancelWallpaperEditor(); });
    document.getElementById("reset-appearance").addEventListener("click", resetAppearance);
}

function initializeApp() {
    if (!Array.isArray(globalLevels) || !globalLevels.length) globalLevels = [...DEFAULT_LEVELS];
    applyTheme(localStorage.getItem(STORAGE.appearanceTheme) || "pink");
    applyOverlay(localStorage.getItem(STORAGE.wallpaperOverlay) || "medium");
    applyWallpaperFraming(wallpaperFraming);
    loadStoredWallpaper();
    renderGlobalLevels();
    renderAllSectionControls();
    renderFlashcardLevels();
    renderSearchJlptFilters();
    renderRecentSearches();
    renderTranslationChips();
    renderTranslationHistory();
    renderTravelCountdown();
    renderTravelModeNavigation();
    renderTravelOfflinePack();
    renderYenConverter();
    refreshNativeCategories();
    const storedDifficulty = localStorage.getItem(STORAGE.nativeDifficulty);
    if (["All", "Beginner", "Intermediate", "Advanced"].includes(storedDifficulty)) document.getElementById("native-difficulty-filter").value = storedDifficulty;
    addListeners();
    browseDailyKanji(1, true);
    browseDailyWord(1, true);
    browseKanji(1, true);
    browseWord(1, true);
    renderKanaQuizGroups();
    newKana();
    newKanjiQuiz();
    newVocabularyQuiz();
    Object.keys(QUIZ_UI).forEach(updateQuizStatus);
    showQuizTab(localStorage.getItem(STORAGE.activeQuiz) || "kana");
    browseNative(1, true);
    updateSavedUi();
    const requestedRoute = location.hash.replace("#", "");
    const travelRoutes = Object.keys(window.TRAVEL_CATEGORIES || {}).map(category => `travel-${category}`);
    const validDeckRoute = /^travel-deck-deck-.+/.test(requestedRoute);
    showRoute(["home", "hub", "library", "learn", "learn-native", "learn-slang", "search", "translate", "quiz", "practice", "native", "travel", "travel-my-phrases", "travel-decks", "travel-notes", "travel-countdown", "travel-offline", "travel-yen", "saved", ...travelRoutes].includes(requestedRoute) || validDeckRoute ? requestedRoute : "home", false);
    initializePwaUpdates();
}

initializeApp();
