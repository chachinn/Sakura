/* =====================================================
   Sakura Study Suite v1
   Pronunciation, shadowing, writing, SRS review,
   grammar lessons, conversation practice, quick practice.
   Loaded lazily by app.js to protect startup performance.
===================================================== */
(function initializeSakuraStudySuite() {
    if (window.SakuraStudySuite) return;

    const STORE = Object.freeze({
        prefs: "sakuraStudySuitePrefsV1",
        srs: "sakuraSrsV1",
        lessonProgress: "sakuraLessonProgressV1",
        conversationStats: "sakuraConversationStatsV1",
        quickStats: "sakuraQuickPracticeStatsV1"
    });
    const KANJIVG_CACHE = "sakura-kanjivg-v1";
    const KANJIVG_ROOT = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/";
    const MS_DAY = 86400000;
    const MAX_SRS_HISTORY = 24;
    const DEFAULT_PREFS = Object.freeze({
        speechRate: 1,
        shadowPauseMs: 2200,
        showJapanese: true,
        showKana: true,
        showRomaji: true,
        showEnglish: true,
        reviewBeforeNew: true,
        writingGuideOpacity: 0.18,
        writingGuideVisible: true
    });
    const KANA = Object.freeze([
        ["あ","a","Hiragana"],["い","i","Hiragana"],["う","u","Hiragana"],["え","e","Hiragana"],["お","o","Hiragana"],
        ["か","ka","Hiragana"],["き","ki","Hiragana"],["く","ku","Hiragana"],["け","ke","Hiragana"],["こ","ko","Hiragana"],
        ["さ","sa","Hiragana"],["し","shi","Hiragana"],["す","su","Hiragana"],["せ","se","Hiragana"],["そ","so","Hiragana"],
        ["た","ta","Hiragana"],["ち","chi","Hiragana"],["つ","tsu","Hiragana"],["て","te","Hiragana"],["と","to","Hiragana"],
        ["な","na","Hiragana"],["に","ni","Hiragana"],["ぬ","nu","Hiragana"],["ね","ne","Hiragana"],["の","no","Hiragana"],
        ["は","ha","Hiragana"],["ひ","hi","Hiragana"],["ふ","fu","Hiragana"],["へ","he","Hiragana"],["ほ","ho","Hiragana"],
        ["ま","ma","Hiragana"],["み","mi","Hiragana"],["む","mu","Hiragana"],["め","me","Hiragana"],["も","mo","Hiragana"],
        ["や","ya","Hiragana"],["ゆ","yu","Hiragana"],["よ","yo","Hiragana"],["ら","ra","Hiragana"],["り","ri","Hiragana"],
        ["る","ru","Hiragana"],["れ","re","Hiragana"],["ろ","ro","Hiragana"],["わ","wa","Hiragana"],["を","wo","Hiragana"],["ん","n","Hiragana"],
        ["ア","a","Katakana"],["イ","i","Katakana"],["ウ","u","Katakana"],["エ","e","Katakana"],["オ","o","Katakana"],
        ["カ","ka","Katakana"],["キ","ki","Katakana"],["ク","ku","Katakana"],["ケ","ke","Katakana"],["コ","ko","Katakana"],
        ["サ","sa","Katakana"],["シ","shi","Katakana"],["ス","su","Katakana"],["セ","se","Katakana"],["ソ","so","Katakana"],
        ["タ","ta","Katakana"],["チ","chi","Katakana"],["ツ","tsu","Katakana"],["テ","te","Katakana"],["ト","to","Katakana"],
        ["ナ","na","Katakana"],["ニ","ni","Katakana"],["ヌ","nu","Katakana"],["ネ","ne","Katakana"],["ノ","no","Katakana"],
        ["ハ","ha","Katakana"],["ヒ","hi","Katakana"],["フ","fu","Katakana"],["ヘ","he","Katakana"],["ホ","ho","Katakana"],
        ["マ","ma","Katakana"],["ミ","mi","Katakana"],["ム","mu","Katakana"],["メ","me","Katakana"],["モ","mo","Katakana"],
        ["ヤ","ya","Katakana"],["ユ","yu","Katakana"],["ヨ","yo","Katakana"],["ラ","ra","Katakana"],["リ","ri","Katakana"],
        ["ル","ru","Katakana"],["レ","re","Katakana"],["ロ","ro","Katakana"],["ワ","wa","Katakana"],["ヲ","wo","Katakana"],["ン","n","Katakana"]
    ]);

    const CONVERSATIONS = Object.freeze([
        {
            id:"cafe", title:"Café Order", icon:"☕", context:"Café", level:"Beginner",
            turns:[
                { npc:["いらっしゃいませ。ご注文はお決まりですか？","いらっしゃいませ。ごちゅうもんは おきまりですか？","irasshaimase. gochuumon wa okimari desu ka?","Welcome. Are you ready to order?"], prompt:"Order a coffee politely.", choices:[
                    ["コーヒーを一つお願いします。","コーヒーを ひとつ おねがいします。","koohii o hitotsu onegai shimasu.","One coffee, please.",true],
                    ["コーヒーある？","コーヒー ある？","koohii aru?","You got coffee?",false],
                    ["コーヒーです。","コーヒーです。","koohii desu.","It is coffee.",false]
                ]},
                { npc:["ホットとアイス、どちらになさいますか？","ホットと アイス、どちらに なさいますか？","hotto to aisu, dochira ni nasaimasu ka?","Hot or iced?"], prompt:"Choose iced coffee.", choices:[
                    ["アイスでお願いします。","アイスで おねがいします。","aisu de onegai shimasu.","Iced, please.",true],
                    ["アイスが好きです。","アイスが すきです。","aisu ga suki desu.","I like iced drinks.",false],
                    ["冷たいです。","つめたいです。","tsumetai desu.","It is cold.",false]
                ]},
                { npc:["サイズはいかがなさいますか？","サイズは いかが なさいますか？","saizu wa ikaga nasaimasu ka?","What size would you like?"], prompt:"Ask for a small size.", choices:[
                    ["小さいサイズでお願いします。","ちいさい サイズで おねがいします。","chiisai saizu de onegai shimasu.","The small size, please.",true],
                    ["小さいですか？","ちいさいですか？","chiisai desu ka?","Is it small?",false],
                    ["サイズはありません。","サイズは ありません。","saizu wa arimasen.","There is no size.",false]
                ]},
                { npc:["店内でお召し上がりですか？","てんないで おめしあがりですか？","tennai de omeshiagari desu ka?","Will you have it here?"], prompt:"Say you are taking it to go.", choices:[
                    ["持ち帰りでお願いします。","もちかえりで おねがいします。","mochikaeri de onegai shimasu.","To go, please.",true],
                    ["帰ります。","かえります。","kaerimasu.","I am going home.",false],
                    ["店内じゃないです。","てんないじゃ ないです。","tennai ja nai desu.","Not inside the shop.",false]
                ]}
            ]
        },
        {
            id:"restaurant", title:"Restaurant", icon:"🍜", context:"Restaurant", level:"Beginner",
            turns:[
                { npc:["何名様ですか？","なんめいさまですか？","nanmei-sama desu ka?","How many people?"], prompt:"Say there are two people.", choices:[
                    ["二人です。","ふたりです。","futari desu.","Two people.",true],
                    ["二つです。","ふたつです。","futatsu desu.","Two things.",false],
                    ["二人あります。","ふたり あります。","futari arimasu.","There are two people (unnatural here).",false]
                ]},
                { npc:["ご注文をどうぞ。","ごちゅうもんを どうぞ。","gochuumon o douzo.","Please tell me your order."], prompt:"Order this item while pointing at the menu.", choices:[
                    ["これをお願いします。","これを おねがいします。","kore o onegai shimasu.","This, please.",true],
                    ["これですか？","これですか？","kore desu ka?","Is it this?",false],
                    ["これがあります。","これが あります。","kore ga arimasu.","There is this.",false]
                ]},
                { npc:["ほかにご注文はございますか？","ほかに ごちゅうもんは ございますか？","hoka ni gochuumon wa gozaimasu ka?","Anything else?"], prompt:"Say that is all.", choices:[
                    ["以上です。","いじょうです。","ijou desu.","That's all.",true],
                    ["大丈夫です。","だいじょうぶです。","daijoubu desu.","I'm okay / No thank you.",false],
                    ["終わりました。","おわりました。","owarimashita.","It ended.",false]
                ]},
                { npc:["ありがとうございました。","ありがとうございました。","arigatou gozaimashita.","Thank you very much."], prompt:"Ask for the bill before leaving.", choices:[
                    ["お会計お願いします。","おかいけい おねがいします。","okaikei onegai shimasu.","The bill, please.",true],
                    ["お金お願いします。","おかね おねがいします。","okane onegai shimasu.","Money, please.",false],
                    ["会計がありますか？","かいけいが ありますか？","kaikei ga arimasu ka?","Is there a bill?",false]
                ]}
            ]
        },
        {
            id:"hotel", title:"Hotel Check-in", icon:"🏨", context:"Hotel", level:"Beginner",
            turns:[
                { npc:["ご予約のお名前をお願いします。","ごよやくの おなまえを おねがいします。","goyoyaku no onamae o onegai shimasu.","May I have the name on the reservation?"], prompt:"Say the reservation is under your name.", choices:[
                    ["予約しています。名前は田中です。","よやくしています。なまえは たなかです。","yoyaku shite imasu. namae wa Tanaka desu.","I have a reservation. The name is Tanaka.",true],
                    ["田中です。予約です。","たなかです。よやくです。","Tanaka desu. yoyaku desu.","I'm Tanaka. Reservation.",false],
                    ["名前があります。","なまえが あります。","namae ga arimasu.","There is a name.",false]
                ]},
                { npc:["パスポートを拝見してもよろしいですか？","パスポートを はいけんしても よろしいですか？","pasupooto o haiken shite mo yoroshii desu ka?","May I see your passport?"], prompt:"Hand it over politely.", choices:[
                    ["はい、どうぞ。","はい、どうぞ。","hai, douzo.","Yes, here you are.",true],
                    ["見てください。","みてください。","mite kudasai.","Please look.",false],
                    ["これがパスポート。","これが パスポート。","kore ga pasupooto.","This is the passport (very blunt).",false]
                ]},
                { npc:["チェックインは以上です。","チェックインは いじょうです。","chekku-in wa ijou desu.","That completes check-in."], prompt:"Ask what time breakfast starts.", choices:[
                    ["朝食は何時からですか？","ちょうしょくは なんじからですか？","choushoku wa nanji kara desu ka?","What time does breakfast start?",true],
                    ["朝ごはんはどこ？","あさごはんは どこ？","asagohan wa doko?","Where's breakfast? (casual)",false],
                    ["朝食を始めますか？","ちょうしょくを はじめますか？","choushoku o hajimemasu ka?","Will you start breakfast?",false]
                ]},
                { npc:["朝食は七時からです。","ちょうしょくは しちじからです。","choushoku wa shichiji kara desu.","Breakfast starts at 7."], prompt:"Thank the staff politely.", choices:[
                    ["ありがとうございます。","ありがとうございます。","arigatou gozaimasu.","Thank you very much.",true],
                    ["ありがとうね。","ありがとうね。","arigatou ne.","Thanks, okay? (too casual here)",false],
                    ["分かる。","わかる。","wakaru.","I get it. (casual)",false]
                ]}
            ]
        },
        {
            id:"train", title:"Train Station", icon:"🚃", context:"Train", level:"Beginner",
            turns:[
                { npc:["どちらまで行かれますか？","どちらまで いかれますか？","dochira made ikaremasu ka?","Where are you going?"], prompt:"Say you are going to Shinjuku.", choices:[
                    ["新宿まで行きたいです。","しんじゅくまで いきたいです。","Shinjuku made ikitai desu.","I'd like to go to Shinjuku.",true],
                    ["新宿が好きです。","しんじゅくが すきです。","Shinjuku ga suki desu.","I like Shinjuku.",false],
                    ["新宿にいます。","しんじゅくに います。","Shinjuku ni imasu.","I am in Shinjuku.",false]
                ]},
                { npc:["この電車で行けます。","この でんしゃで いけます。","kono densha de ikemasu.","You can get there on this train."], prompt:"Ask whether you need to transfer.", choices:[
                    ["乗り換えは必要ですか？","のりかえは ひつようですか？","norikae wa hitsuyou desu ka?","Do I need to transfer?",true],
                    ["電車を変えますか？","でんしゃを かえますか？","densha o kaemasu ka?","Will I change the train?",false],
                    ["乗り換えが好きですか？","のりかえが すきですか？","norikae ga suki desu ka?","Do you like transfers?",false]
                ]},
                { npc:["乗り換えはありません。","のりかえは ありません。","norikae wa arimasen.","There is no transfer."], prompt:"Ask which platform to use.", choices:[
                    ["何番ホームですか？","なんばん ホームですか？","nanban hoomu desu ka?","Which platform is it?",true],
                    ["ホームは何ですか？","ホームは なんですか？","hoomu wa nan desu ka?","What is a platform?",false],
                    ["どの番号ですか？","どの ばんごうですか？","dono bangou desu ka?","Which number?",false]
                ]},
                { npc:["三番ホームです。","さんばん ホームです。","sanban hoomu desu.","Platform 3."], prompt:"Confirm that you understood.", choices:[
                    ["分かりました。ありがとうございます。","わかりました。ありがとうございます。","wakarimashita. arigatou gozaimasu.","Understood. Thank you.",true],
                    ["分かるよ。","わかるよ。","wakaru yo.","I know. (too casual)",false],
                    ["いいです。","いいです。","ii desu.","It's fine.",false]
                ]}
            ]
        },
        {
            id:"shopping", title:"Shopping", icon:"🛍", context:"Shopping", level:"Beginner",
            turns:[
                { npc:["何かお探しですか？","なにか おさがしですか？","nanika osagashi desu ka?","Are you looking for something?"], prompt:"Say you are looking for a smaller size.", choices:[
                    ["もう少し小さいサイズを探しています。","もう すこし ちいさい サイズを さがしています。","mou sukoshi chiisai saizu o sagashite imasu.","I'm looking for a slightly smaller size.",true],
                    ["小さいのが好きです。","ちいさいのが すきです。","chiisai no ga suki desu.","I like small ones.",false],
                    ["小さくしてください。","ちいさく してください。","chiisaku shite kudasai.","Please make it smaller.",false]
                ]},
                { npc:["こちらはいかがですか？","こちらは いかがですか？","kochira wa ikaga desu ka?","How about this one?"], prompt:"Ask if you can try it on.", choices:[
                    ["試着してもいいですか？","しちゃくしても いいですか？","shichaku shite mo ii desu ka?","May I try it on?",true],
                    ["着ますか？","きますか？","kimasu ka?","Will I wear it?",false],
                    ["試着がありますか？","しちゃくが ありますか？","shichaku ga arimasu ka?","Is there a fitting?",false]
                ]},
                { npc:["はい、試着室はこちらです。","はい、しちゃくしつは こちらです。","hai, shichakushitsu wa kochira desu.","Yes, the fitting room is here."], prompt:"Say it fits well.", choices:[
                    ["ちょうどいいです。","ちょうど いいです。","choudo ii desu.","It fits just right.",true],
                    ["ぴったりじゃないです。","ぴったりじゃ ないです。","pittari ja nai desu.","It doesn't fit perfectly.",false],
                    ["サイズです。","サイズです。","saizu desu.","It is size.",false]
                ]},
                { npc:["こちらでよろしいですか？","こちらで よろしいですか？","kochira de yoroshii desu ka?","Will this be all right?"], prompt:"Say you will take it.", choices:[
                    ["これにします。","これに します。","kore ni shimasu.","I'll take this one.",true],
                    ["これを持っています。","これを もっています。","kore o motte imasu.","I am holding this.",false],
                    ["これがいいでした。","これが いいでした。","kore ga ii deshita.","This was good (incorrect form).",false]
                ]}
            ]
        },
        {
            id:"friend", title:"Casual Friend Chat", icon:"💬", context:"Friends", level:"Intermediate",
            turns:[
                { npc:["今日ひま？","きょう ひま？","kyou hima?","Free today?"], prompt:"Say you are free after work.", choices:[
                    ["仕事のあとなら空いてるよ。","しごとの あとなら あいてるよ。","shigoto no ato nara aiteru yo.","I'm free after work.",true],
                    ["仕事のあとです。","しごとの あとです。","shigoto no ato desu.","It's after work.",false],
                    ["空いていますか？","あいていますか？","aite imasu ka?","Are you free?",false]
                ]},
                { npc:["じゃあ、ごはん行かない？","じゃあ、ごはん いかない？","jaa, gohan ikanai?","Then, wanna grab food?"], prompt:"Say yes enthusiastically.", choices:[
                    ["行く行く！","いく いく！","iku iku!","Yeah, I'm in!",true],
                    ["行きます。","いきます。","ikimasu.","I will go. (too formal for this vibe)",false],
                    ["ごはんです。","ごはんです。","gohan desu.","It's food.",false]
                ]},
                { npc:["何食べたい？","なに たべたい？","nani tabetai?","What do you want to eat?"], prompt:"Say anything is fine.", choices:[
                    ["なんでもいいよ。","なんでも いいよ。","nandemo ii yo.","Anything is fine.",true],
                    ["何もいい。","なにも いい。","nani mo ii.","Anything is good (incorrect).",false],
                    ["食べない。","たべない。","tabenai.","I won't eat.",false]
                ]},
                { npc:["じゃ、駅前で七時ね。","じゃ、えきまえで しちじね。","ja, ekimae de shichiji ne.","Okay, 7 in front of the station."], prompt:"Confirm casually.", choices:[
                    ["オッケー、あとでね！","オッケー、あとでね！","okkee, ato de ne!","Okay, see you later!",true],
                    ["承知しました。","しょうちしました。","shouchi shimashita.","Understood. (very formal)",false],
                    ["七時があります。","しちじが あります。","shichiji ga arimasu.","There is 7 o'clock.",false]
                ]}
            ]
        }
    ]);

    let prefs = normalizePrefs(readJson(STORE.prefs, DEFAULT_PREFS));
    let srs = normalizeSrs(readJson(STORE.srs, {}));
    let lessonProgress = normalizeObject(readJson(STORE.lessonProgress, {}));
    let conversationStats = normalizeObject(readJson(STORE.conversationStats, {}));
    let quickStats = normalizeObject(readJson(STORE.quickStats, { correct:0, missed:0, sessions:0 }));
    let speechToken = 0;
    let activeUtterance = null;
    let activeSpeechResolve = null;
    let voices = [];
    let shadowSession = null;
    let reviewSession = null;
    let lessonData = null;
    let lessonPromise = null;
    let activeLesson = null;
    let conversationSession = null;
    let quickSession = null;
    let writingMode = "kana";
    let writingCharacter = "あ";
    let writingKanaSet = "Hiragana";
    let writingMemoryMode = false;
    let writingStrokes = [];
    let activeStroke = null;
    let writingPointerId = null;
    let writingRedrawScheduled = false;
    let kanjiVg = { character:"", paths:[], step:0, timer:0, playing:false };
    let initialized = false;

    function readJson(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "null");
            return value === null ? fallback : value;
        }
        catch { return fallback; }
    }
    function writeJson(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); return true; }
        catch { return false; }
    }
    function normalizeObject(value) { return value && typeof value === "object" && !Array.isArray(value) ? value : {}; }
    function normalizePrefs(value) {
        const source = normalizeObject(value);
        return {
            speechRate: [0.7, 1].includes(Number(source.speechRate)) ? Number(source.speechRate) : DEFAULT_PREFS.speechRate,
            shadowPauseMs: Math.min(5000, Math.max(1000, Number(source.shadowPauseMs) || DEFAULT_PREFS.shadowPauseMs)),
            showJapanese: source.showJapanese !== false,
            showKana: source.showKana !== false,
            showRomaji: source.showRomaji !== false,
            showEnglish: source.showEnglish !== false,
            reviewBeforeNew: source.reviewBeforeNew !== false,
            writingGuideOpacity: Number.isFinite(Number(source.writingGuideOpacity)) ? Math.min(.45, Math.max(0, Number(source.writingGuideOpacity))) : DEFAULT_PREFS.writingGuideOpacity,
            writingGuideVisible: source.writingGuideVisible !== false
        };
    }
    function normalizeSrs(value) {
        const source = normalizeObject(value);
        const clean = {};
        Object.entries(source).forEach(([key, record]) => {
            if (!record || typeof record !== "object") return;
            clean[key] = {
                ease: Math.min(3.2, Math.max(1.3, Number(record.ease) || 2.5)),
                intervalDays: Math.max(0, Number(record.intervalDays) || 0),
                due: Math.max(0, Number(record.due) || 0),
                reps: Math.max(0, Number(record.reps) || 0),
                lapses: Math.max(0, Number(record.lapses) || 0),
                last: Math.max(0, Number(record.last) || 0),
                lastRating: ["again","hard","good","easy"].includes(record.lastRating) ? record.lastRating : "",
                history: Array.isArray(record.history) ? record.history.slice(-MAX_SRS_HISTORY) : []
            };
        });
        return clean;
    }
    function html(value) {
        return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
    }
    function array(value) { return Array.isArray(value) ? value : []; }
    function now() { return Date.now(); }
    function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
    function shuffle(values) {
        const result = [...values];
        for (let i = result.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    function toast(message) {
        const element = document.getElementById("kaomoji-copy-toast");
        if (!element) return;
        element.textContent = message;
        element.hidden = false;
        element.classList.add("show");
        window.clearTimeout(toast.timer);
        toast.timer = window.setTimeout(() => { element.classList.remove("show"); element.hidden = true; }, 1800);
    }
    function persistPrefs() { writeJson(STORE.prefs, prefs); applyReadingPrefs(); renderStudyLab(); }
    function persistSrs() { writeJson(STORE.srs, srs); }

    function getSavedItems() {
        const value = readJson("chaSavedLearningItems", []);
        return Array.isArray(value) ? value : [];
    }
    function itemKey(item) {
        if (!item) return "";
        const type = item.migratedFrom === "native" ? "native" : String(item.type || "item");
        const id = item.id || item.character || item.word || item.expression || item.japanese || item.kana || "unknown";
        return `${type}:${id}`;
    }
    function readingItem(item) {
        if (!item) return null;
        const type = item.migratedFrom === "native" ? "native" : String(item.type || "item");
        if (type === "kanji") return { key:itemKey(item), type, japanese:item.character||"", kana:item.reading||"", romaji:item.romaji||"", english:item.meaning||item.literalMeaning||"", level:item.jlpt||"" };
        if (type === "vocabulary") return { key:itemKey(item), type, japanese:item.word||"", kana:item.kana||item.reading||"", romaji:item.romaji||"", english:item.meaning||item.naturalMeaning||"", level:item.jlpt||"" };
        if (type === "native" || type === "slang") return { key:itemKey(item), type, japanese:item.expression||item.japanese||"", kana:item.kana||item.reading||"", romaji:item.romaji||"", english:item.meaning||item.naturalMeaning||item.english||"", level:item.difficulty||"" };
        if (type === "travel") return { key:itemKey(item), type, japanese:item.japanese||"", kana:item.reading||item.kana||"", romaji:item.romaji||"", english:item.english||item.naturalMeaning||"", level:item.priority||"" };
        if (type === "translation") return { key:itemKey(item), type, japanese:item.japanese||"", kana:item.kana||"", romaji:item.romaji||"", english:item.naturalMeaning||item.english||item.meaning||"", level:"" };
        if (type === "kana") return { key:itemKey(item), type, japanese:item.character||item.kana||"", kana:item.character||item.kana||"", romaji:item.romaji||"", english:item.romaji||"", level:"" };
        return { key:itemKey(item), type, japanese:item.japanese||item.word||item.expression||item.character||"", kana:item.kana||item.reading||"", romaji:item.romaji||"", english:item.english||item.meaning||item.naturalMeaning||"", level:item.jlpt||item.difficulty||"" };
    }
    function savedReadingItems() { return getSavedItems().map(readingItem).filter(item => item?.japanese); }

    function ensureRecord(key) {
        if (!srs[key]) srs[key] = { ease:2.5, intervalDays:0, due:0, reps:0, lapses:0, last:0, lastRating:"", history:[] };
        return srs[key];
    }
    function rateSrs(key, rating, meta = {}) {
        if (!key || !["again","hard","good","easy"].includes(rating)) return null;
        const record = ensureRecord(key);
        const previous = record.intervalDays;
        if (rating === "again") {
            record.intervalDays = 10 / 1440;
            record.ease = Math.max(1.3, record.ease - .2);
            record.lapses += 1;
        }
        else if (rating === "hard") {
            record.intervalDays = previous < 1 ? 1 : Math.max(1, previous * 1.2);
            record.ease = Math.max(1.3, record.ease - .05);
            record.reps += 1;
        }
        else if (rating === "good") {
            record.intervalDays = previous < 1 ? 1 : previous < 3 ? 3 : previous * record.ease;
            record.reps += 1;
        }
        else {
            record.intervalDays = previous < 1 ? 4 : Math.max(4, previous * record.ease * 1.3);
            record.ease = Math.min(3.2, record.ease + .1);
            record.reps += 1;
        }
        record.intervalDays = record.intervalDays < 1 ? Math.round(record.intervalDays * 1000000) / 1000000 : Math.round(record.intervalDays * 100) / 100;
        record.last = now();
        record.lastRating = rating;
        record.due = record.last + record.intervalDays * MS_DAY;
        record.history = [...array(record.history), { at:record.last, rating, source:meta.source||"review" }].slice(-MAX_SRS_HISTORY);
        persistSrs();
        return record;
    }
    function isWeakRecord(record) { return Boolean(record && (record.lapses >= 2 || record.ease < 2.2 || ["again","hard"].includes(record.lastRating))); }
    function recentMiss(record) { return Boolean(record?.history?.some(entry => now() - Number(entry.at||0) <= 14*MS_DAY && ["again","hard"].includes(entry.rating))); }
    function dueRecord(record) { return !record || !record.due || record.due <= now(); }
    function dueLabel(record) {
        if (!record || !record.due) return "New";
        const diff = record.due - now();
        if (diff <= 0) return "Due now";
        const minutes = Math.ceil(diff / 60000);
        if (minutes < 60) return `Due in ${minutes}m`;
        const hours = Math.ceil(diff / 3600000);
        if (hours < 24) return `Due in ${hours}h`;
        return `Due in ${Math.ceil(hours/24)}d`;
    }

    function refreshVoices() {
        if (!window.speechSynthesis) return [];
        voices = window.speechSynthesis.getVoices() || [];
        return voices;
    }
    function japaneseVoice() {
        const list = voices.length ? voices : refreshVoices();
        return list.find(voice => /^ja(?:-|_)/i.test(voice.lang) && /Kyoko|O-ren|Nanami|Japanese/i.test(voice.name))
            || list.find(voice => /^ja(?:-|_)/i.test(voice.lang))
            || null;
    }
    function stopSpeech() {
        speechToken += 1;
        const finish = activeSpeechResolve;
        activeSpeechResolve = null;
        activeUtterance = null;
        try { window.speechSynthesis?.cancel(); } catch {}
        if (finish) finish(false);
        document.querySelectorAll("[data-sakura-speak].is-speaking").forEach(button => button.classList.remove("is-speaking"));
    }
    function speak(text, options = {}) {
        const content = String(text || "").trim();
        if (!content) return Promise.resolve(false);
        if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
            toast("Japanese audio is not supported by this browser.");
            return Promise.resolve(false);
        }
        stopSpeech();
        const token = ++speechToken;
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = "ja-JP";
        utterance.rate = clamp(Number(options.rate) || prefs.speechRate, .55, 1.15);
        utterance.pitch = 1;
        const voice = japaneseVoice();
        if (voice) utterance.voice = voice;
        activeUtterance = utterance;
        return new Promise(resolve => {
            let settled = false;
            const finish = success => {
                if (settled) return;
                settled = true;
                if (activeSpeechResolve === finish) activeSpeechResolve = null;
                if (speechToken === token) activeUtterance = null;
                resolve(success);
            };
            activeSpeechResolve = finish;
            utterance.onend = () => finish(true);
            utterance.onerror = () => finish(false);
            try { window.speechSynthesis.speak(utterance); }
            catch { finish(false); }
        });
    }
    function textFromSpeakButton(button) {
        const selector = button?.dataset?.speakSelector;
        if (selector) {
            const element = document.querySelector(selector);
            return element?.textContent?.trim() || "";
        }
        const own = button?.dataset?.speakText;
        return own ? own : "";
    }
    async function handleSpeakButton(button) {
        if (!button) return;
        const text = textFromSpeakButton(button);
        if (!text) { toast("Nothing to read yet."); return; }
        document.querySelectorAll("[data-sakura-speak].is-speaking").forEach(item => item.classList.remove("is-speaking"));
        button.classList.add("is-speaking");
        await speak(text, { rate:button.dataset.speakSlow === "true" ? .7 : prefs.speechRate });
        button.classList.remove("is-speaking");
    }

    function applyReadingPrefs(root = document) {
        const applyPart = (selector, visible, part) => root.querySelectorAll(selector).forEach(el => {
            if (el.closest?.("#smart-review-session") && reviewSession && !reviewSession.revealed) {
                el.hidden = part !== "japanese";
                return;
            }
            el.hidden = !visible;
        });
        applyPart("[data-reading-part='japanese']", prefs.showJapanese, "japanese");
        applyPart("[data-reading-part='kana']", prefs.showKana, "kana");
        applyPart("[data-reading-part='romaji']", prefs.showRomaji, "romaji");
        applyPart("[data-reading-part='english']", prefs.showEnglish, "english");
        document.querySelectorAll("[data-study-reading-toggle]").forEach(input => {
            const key = input.dataset.studyReadingToggle;
            if (key === "japanese") input.checked = prefs.showJapanese;
            if (key === "kana") input.checked = prefs.showKana;
            if (key === "romaji") input.checked = prefs.showRomaji;
            if (key === "english") input.checked = prefs.showEnglish;
        });
    }

    function renderStudyLab() {
        const root = document.getElementById("study-lab-view");
        if (!root) return;
        const saved = savedReadingItems();
        const due = saved.filter(item => dueRecord(srs[item.key])).length;
        const weak = saved.filter(item => isWeakRecord(srs[item.key])).length;
        const completedLessons = Object.values(lessonProgress).filter(value => value?.completed).length;
        const statDue = document.getElementById("study-lab-due");
        const statWeak = document.getElementById("study-lab-weak");
        const statLessons = document.getElementById("study-lab-lessons");
        if (statDue) statDue.textContent = String(due);
        if (statWeak) statWeak.textContent = String(weak);
        if (statLessons) statLessons.textContent = String(completedLessons);
        const rate = document.getElementById("study-speech-rate");
        if (rate) rate.value = String(prefs.speechRate);
        const pause = document.getElementById("study-shadow-pause");
        if (pause) pause.value = String(prefs.shadowPauseMs);
        const review = document.getElementById("study-review-before-new");
        if (review) review.checked = prefs.reviewBeforeNew;
        applyReadingPrefs(root);
    }

    function shadowSources() {
        const saved = savedReadingItems();
        const source = document.getElementById("shadow-source")?.value || "saved";
        const builtinVocabulary = array(window.VOCABULARY_DATA).map(readingItem).filter(Boolean);
        const builtinNative = array(window.NATIVE_JAPANESE_DATA).map(readingItem).filter(Boolean);
        const builtinSlang = array(window.SLANG_DATA).map(readingItem).filter(Boolean);
        const builtinTravel = (window.SakuraTravelLoader?.getLoadedTravelPhrases?.() || []).map(readingItem).filter(Boolean);
        const unique = values => [...new Map(values.filter(item=>item?.japanese).map(item=>[item.key,item])).values()];
        if (source === "saved") return unique(saved);
        if (source === "travel") return unique([...builtinTravel, ...saved.filter(item => item.type === "travel")]);
        if (source === "native") return unique([...builtinNative, ...saved.filter(item => item.type === "native")]);
        if (source === "slang") return unique([...builtinSlang, ...saved.filter(item => item.type === "slang")]);
        if (source === "vocabulary") return unique([...builtinVocabulary, ...saved.filter(item => item.type === "vocabulary")]);
        return unique([...builtinVocabulary, ...builtinNative, ...builtinSlang, ...builtinTravel, ...saved]).filter(item => ["travel","native","slang","vocabulary","translation"].includes(item.type));
    }
    async function startShadowing() {
        const source=document.getElementById("shadow-source")?.value||"saved";
        const message=document.getElementById("shadow-message");
        if (["travel","mixed"].includes(source) && !(window.SakuraTravelLoader?.getLoadedTravelPhrases?.() || []).length) {
            if(message)message.textContent="Preparing a few travel phrase sets…";
            const categories=["trains","restaurants","shopping"].filter(category=>window.TRAVEL_CATEGORIES?.[category]);
            await Promise.allSettled(categories.map(category=>window.SakuraTravelLoader?.loadTravelCategory?.(category)));
        }
        const items = shuffle(shadowSources()).slice(0, 30);
        if (!items.length) {
            if(message)message.textContent = source==="saved" ? "Save some Japanese first, or choose another source." : "No phrases are available for this source yet.";
            return;
        }
        if(message)message.textContent="";
        shadowSession = { items, index:0, phase:"ready", autoReplay:document.getElementById("shadow-auto-replay")?.checked === true };
        renderShadowing();
    }
    function renderShadowing() {
        const empty = document.getElementById("shadow-empty");
        const card = document.getElementById("shadow-card");
        if (!shadowSession?.items?.length) { if (empty) empty.hidden=false; if(card)card.hidden=true; return; }
        empty.hidden = true;
        card.hidden = false;
        const item = shadowSession.items[shadowSession.index];
        document.getElementById("shadow-progress").textContent = `${shadowSession.index + 1} / ${shadowSession.items.length}`;
        document.getElementById("shadow-type").textContent = item.type;
        document.getElementById("shadow-japanese").textContent = item.japanese;
        document.getElementById("shadow-kana").textContent = item.kana || "";
        document.getElementById("shadow-romaji").textContent = item.romaji || "";
        document.getElementById("shadow-english").textContent = item.english || "";
        document.getElementById("shadow-status").textContent = "Listen, repeat aloud, then replay if needed.";
        applyReadingPrefs(card);
    }
    async function shadowPlaySequence() {
        if (!shadowSession) return;
        const token = shadowSession.index;
        const item = shadowSession.items[token];
        const status = document.getElementById("shadow-status");
        status.textContent = "Listen…";
        const success = await speak(item.japanese, { rate:prefs.speechRate });
        if (!success || !shadowSession || shadowSession.index !== token) return;
        status.textContent = "Your turn — repeat it aloud.";
        await new Promise(resolve => window.setTimeout(resolve, prefs.shadowPauseMs));
        if (!shadowSession || shadowSession.index !== token) return;
        if (shadowSession.autoReplay) {
            status.textContent = "Replay…";
            await speak(item.japanese, { rate:prefs.speechRate });
        }
        if (shadowSession && shadowSession.index === token) status.textContent = "Nice. Replay, slow it down, or move on.";
    }
    function shadowMove(delta) {
        if (!shadowSession) return;
        stopSpeech();
        shadowSession.index = (shadowSession.index + delta + shadowSession.items.length) % shadowSession.items.length;
        renderShadowing();
    }

    function setWritingMode(mode) {
        writingMode = mode === "kanji" ? "kanji" : "kana";
        document.querySelectorAll("[data-writing-mode]").forEach(button => button.classList.toggle("active", button.dataset.writingMode === writingMode));
        document.getElementById("writing-kana-controls").hidden = writingMode !== "kana";
        document.getElementById("writing-kanji-controls").hidden = writingMode !== "kanji";
        document.getElementById("stroke-order-panel").hidden = writingMode !== "kanji";
        clearWritingCanvas();
        if (writingMode === "kana") {
            writingCharacter = KANA.find(item => item[2] === writingKanaSet)?.[0] || "あ";
            renderKanaChoices();
            renderWritingReference();
        }
        else {
            loadWritingKanjiLevel();
        }
    }
    function renderKanaChoices() {
        const select = document.getElementById("writing-kana-character");
        if (!select) return;
        const choices = KANA.filter(item => item[2] === writingKanaSet);
        select.innerHTML = choices.map(item => `<option value="${html(item[0])}">${html(item[0])} · ${html(item[1])}</option>`).join("");
        if (!choices.some(item => item[0] === writingCharacter)) writingCharacter = choices[0]?.[0] || "あ";
        select.value = writingCharacter;
    }
    async function loadWritingKanjiLevel() {
        const level = document.getElementById("writing-kanji-level")?.value || "N5";
        const select = document.getElementById("writing-kanji-character");
        const status = document.getElementById("writing-kanji-status");
        if (status) status.textContent = `Loading ${level} Kanji…`;
        try {
            if (window.SakuraKanjiLoader?.loadKanjiLevel) await window.SakuraKanjiLoader.loadKanjiLevel(level);
            const items = window.SakuraKanjiLoader?.getLoadedKanji?.().filter(item => item.jlpt === level) || array(window.KANJI_DATA).filter(item => item.jlpt === level);
            if (!items.length) throw new Error("No Kanji loaded for this level.");
            select.innerHTML = items.map(item => `<option value="${html(item.character)}">${html(item.character)} · ${html(item.meaning)}</option>`).join("");
            if (!items.some(item => item.character === writingCharacter)) writingCharacter = items[0].character;
            select.value = writingCharacter;
            if (status) status.textContent = `${items.length} ${level} Kanji available.`;
            clearWritingCanvas();
            renderWritingReference();
            loadKanjiStrokeOrder(writingCharacter);
        }
        catch (error) {
            if (status) status.textContent = error?.message || "Kanji could not be loaded.";
        }
    }
    function canvasContext() {
        const canvas = document.getElementById("writing-canvas");
        return canvas ? canvas.getContext("2d", { alpha:true }) : null;
    }
    function fitCanvas() {
        const canvas = document.getElementById("writing-canvas");
        if (!canvas) return;
        const cssSize = Math.min(360, Math.max(250, canvas.parentElement?.clientWidth || 300));
        const ratio = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
        canvas.style.width = `${cssSize}px`;
        canvas.style.height = `${cssSize}px`;
        const width = Math.round(cssSize * ratio);
        if (canvas.width !== width || canvas.height !== width) { canvas.width = width; canvas.height = width; }
        redrawWritingCanvas();
    }
    function scheduleWritingRedraw() {
        if (writingRedrawScheduled) return;
        writingRedrawScheduled = true;
        requestAnimationFrame(() => { writingRedrawScheduled = false; redrawWritingCanvas(); });
    }
    function redrawWritingCanvas() {
        const canvas = document.getElementById("writing-canvas");
        const ctx = canvasContext();
        if (!canvas || !ctx) return;
        const ratio = canvas.width / parseFloat(canvas.style.width || canvas.width);
        const size = canvas.width;
        ctx.clearRect(0,0,size,size);
        ctx.save();
        ctx.strokeStyle = "rgba(120,110,120,.16)";
        ctx.lineWidth = Math.max(1, ratio);
        ctx.setLineDash([5*ratio,5*ratio]);
        ctx.beginPath(); ctx.moveTo(size/2,0); ctx.lineTo(size/2,size); ctx.moveTo(0,size/2); ctx.lineTo(size,size/2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = prefs.writingGuideVisible && !writingMemoryMode ? prefs.writingGuideOpacity : 0;
        ctx.fillStyle = "#444";
        ctx.font = `${Math.round(size*.72)}px -apple-system, BlinkMacSystemFont, 'Hiragino Sans', 'Yu Gothic', 'Noto Sans JP', sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(writingCharacter || "あ", size/2, size*.52);
        ctx.restore();
        ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#2f2c33"; ctx.lineWidth = Math.max(4, 6*ratio);
        writingStrokes.forEach(stroke => drawStroke(ctx, stroke, ratio));
        if (activeStroke) drawStroke(ctx, activeStroke, ratio);
    }
    function drawStroke(ctx, stroke, ratio) {
        if (!stroke?.length) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x*ratio, stroke[0].y*ratio);
        for (let i=1;i<stroke.length;i+=1) ctx.lineTo(stroke[i].x*ratio, stroke[i].y*ratio);
        ctx.stroke();
    }
    function canvasPoint(event) {
        const canvas = document.getElementById("writing-canvas");
        const rect = canvas.getBoundingClientRect();
        return { x:clamp(event.clientX-rect.left,0,rect.width), y:clamp(event.clientY-rect.top,0,rect.height) };
    }
    function clearWritingCanvas() { writingStrokes = []; activeStroke = null; const message = document.getElementById("writing-rating-message"); if (message) message.textContent = ""; redrawWritingCanvas(); }
    function undoWritingStroke() { writingStrokes.pop(); redrawWritingCanvas(); }
    function renderWritingReference() {
        const reference = document.querySelector(".writing-reference");
        if (reference) reference.hidden = writingMemoryMode;
        const ref = document.getElementById("writing-reference-character");
        if (ref) ref.textContent = writingCharacter || "あ";
        const meta = document.getElementById("writing-reference-meta");
        if (!meta) return;
        if (writingMode === "kana") {
            const item = KANA.find(entry => entry[0] === writingCharacter);
            meta.textContent = item ? `${item[2]} · ${item[1]}` : "Kana";
        }
        else {
            const item = window.SakuraKanjiLoader?.getLoadedKanji?.().find(entry => entry.character === writingCharacter) || array(window.KANJI_DATA).find(entry => entry.character === writingCharacter);
            meta.textContent = item ? `${item.jlpt} · ${item.reading} · ${item.meaning}` : "Kanji";
        }
        redrawWritingCanvas();
    }
    function kanjiSvgFile(character) {
        const cp = character?.codePointAt(0);
        return Number.isFinite(cp) ? `${cp.toString(16).padStart(5,"0")}.svg` : "";
    }
    async function fetchKanjiVgSvg(character) {
        const file = kanjiSvgFile(character);
        if (!file) throw new Error("Choose a Kanji first.");
        const url = `${KANJIVG_ROOT}${file}`;
        let cache = null;
        try { if ("caches" in window) cache = await caches.open(KANJIVG_CACHE); } catch {}
        if (cache) {
            const cached = await cache.match(url);
            if (cached) return cached.text();
        }
        const response = await fetch(url, { mode:"cors", credentials:"omit", cache:"no-store", referrerPolicy:"no-referrer" });
        if (!response.ok) throw new Error(`Stroke order is unavailable for ${character} (HTTP ${response.status}).`);
        try { if (cache) await cache.put(url, response.clone()); } catch {}
        return response.text();
    }
    function parseKanjiVgPaths(svgText) {
        const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
        if (doc.querySelector("parsererror")) throw new Error("Stroke-order data could not be parsed.");
        return [...doc.querySelectorAll('g[id*="StrokePaths"] path')].map(path => path.getAttribute("d")).filter(Boolean);
    }
    async function loadKanjiStrokeOrder(character) {
        stopStrokePlayback();
        kanjiVg = { character, paths:[], step:0, timer:0, playing:false };
        const status = document.getElementById("stroke-order-status");
        if (status) status.textContent = navigator.onLine ? "Loading stroke order…" : "Checking saved stroke order…";
        renderStrokeOrder();
        try {
            const paths = parseKanjiVgPaths(await fetchKanjiVgSvg(character));
            if (!paths.length) throw new Error("No stroke paths were found.");
            kanjiVg.paths = paths;
            kanjiVg.step = 0;
            if (status) status.textContent = `${paths.length} strokes · cached after first load for offline reuse.`;
            renderStrokeOrder();
        }
        catch (error) {
            if (status) status.textContent = `${error?.message || "Stroke order is unavailable."} Connect once to download this Kanji's stroke data.`;
            renderStrokeOrder();
        }
    }
    function renderStrokeOrder() {
        const stage = document.getElementById("stroke-order-stage");
        if (!stage) return;
        const total = kanjiVg.paths.length;
        const shown = total ? clamp(kanjiVg.step,0,total) : 0;
        stage.innerHTML = `<svg viewBox="0 0 109 109" role="img" aria-label="Stroke order for ${html(kanjiVg.character || "Kanji")}">
            <path class="stroke-grid" d="M54.5 2v105M2 54.5h105"/>
            ${kanjiVg.paths.map((d,index)=>`<path class="stroke-path ${index < shown ? "done" : index === shown ? "current" : "future"}" data-stroke-index="${index}" d="${html(d)}"/>`).join("")}
        </svg>`;
        const counter = document.getElementById("stroke-order-counter");
        if (counter) counter.textContent = total ? `${Math.min(shown+1,total)} / ${total}` : "0 / 0";
        ["stroke-prev","stroke-next","stroke-play"].forEach(id => { const button=document.getElementById(id); if(button)button.disabled=!total; });
        if (total && shown < total) {
            requestAnimationFrame(() => {
                const path = stage.querySelector(`path[data-stroke-index="${shown}"]`);
                if (!path || typeof path.getTotalLength !== "function") return;
                const length = path.getTotalLength();
                path.style.strokeDasharray = String(length);
                path.style.strokeDashoffset = String(length);
                requestAnimationFrame(() => { path.style.strokeDashoffset = "0"; });
            });
        }
    }
    function stopStrokePlayback() {
        if (kanjiVg.timer) window.clearTimeout(kanjiVg.timer);
        kanjiVg.timer = 0; kanjiVg.playing = false;
        const play = document.getElementById("stroke-play"); if (play) play.textContent = "▶ Play";
    }
    function changeStrokeStep(delta) {
        stopStrokePlayback();
        if (!kanjiVg.paths.length) return;
        kanjiVg.step = clamp(kanjiVg.step + delta, 0, kanjiVg.paths.length - 1);
        renderStrokeOrder();
    }
    function playStrokeOrder() {
        if (!kanjiVg.paths.length) return;
        if (kanjiVg.playing) { stopStrokePlayback(); return; }
        kanjiVg.playing = true;
        kanjiVg.step = 0;
        const play = document.getElementById("stroke-play"); if (play) play.textContent = "■ Stop";
        const speed = Number(document.getElementById("stroke-speed")?.value || 850);
        const advance = () => {
            if (!kanjiVg.playing) return;
            renderStrokeOrder();
            if (kanjiVg.step >= kanjiVg.paths.length - 1) { stopStrokePlayback(); return; }
            kanjiVg.step += 1;
            kanjiVg.timer = window.setTimeout(advance, speed);
        };
        advance();
    }

    function reviewPool() {
        const items = savedReadingItems();
        const filter = document.getElementById("review-queue-filter")?.value || "due";
        const type = document.getElementById("review-type-filter")?.value || "all";
        const filtered = items.filter(item => type === "all" || item.type === type).filter(item => {
            const record = srs[item.key];
            if (filter === "due") return dueRecord(record);
            if (filter === "weak") return isWeakRecord(record);
            if (filter === "new") return !record || !record.last;
            return true;
        });
        return filtered.sort((a,b) => {
            const ra=srs[a.key], rb=srs[b.key];
            if (prefs.reviewBeforeNew) {
                const aNew=!ra?.last, bNew=!rb?.last;
                if (aNew !== bNew) return aNew ? 1 : -1;
            }
            const aDue=ra?.due||0, bDue=rb?.due||0;
            return aDue-bDue;
        });
    }
    function renderReviewDashboard() {
        const items = savedReadingItems();
        const due = items.filter(item => srs[item.key]?.last && dueRecord(srs[item.key])).length;
        const weak = items.filter(item => isWeakRecord(srs[item.key])).length;
        const fresh = items.filter(item => !srs[item.key]?.last).length;
        const set = (id,value)=>{const el=document.getElementById(id);if(el)el.textContent=String(value);};
        set("review-due-count",due); set("review-weak-count",weak); set("review-new-count",fresh);
        const available = reviewPool().length;
        set("review-available-count",available);
        const start=document.getElementById("start-smart-review"); if(start)start.disabled=!available;
        const mistakeBox=document.getElementById("review-mistake-history");
        if(mistakeBox){
            const byKey=new Map(items.map(item=>[item.key,item]));
            const mistakes=Object.entries(srs).flatMap(([key,record])=>array(record.history).filter(entry=>["again","hard"].includes(entry.rating)).map(entry=>({key,entry}))).sort((a,b)=>Number(b.entry.at||0)-Number(a.entry.at||0)).slice(0,6);
            mistakeBox.innerHTML=mistakes.length?mistakes.map(({key,entry})=>{const item=byKey.get(key);const title=item?.japanese||key;const when=new Date(Number(entry.at||0));const date=Number.isFinite(when.getTime())?when.toLocaleDateString():"";return `<div><span>${html(title)}</span><small>${html(entry.rating)} · ${html(date)}</small></div>`;}).join(""):'<p>No review mistakes yet.</p>';
        }
    }
    function startReview() {
        const limit = clamp(Number(document.getElementById("review-session-size")?.value || 10), 1, 50);
        const queue = reviewPool().slice(0,limit);
        if (!queue.length) { toast("No cards match this review queue."); return; }
        reviewSession = { items:queue, index:0, revealed:false, completed:0 };
        renderReviewCard();
    }
    function renderReviewCard() {
        const setup = document.getElementById("review-setup");
        const card = document.getElementById("smart-review-session");
        if (!reviewSession) { setup.hidden=false; card.hidden=true; renderReviewDashboard(); return; }
        setup.hidden=true; card.hidden=false;
        if (reviewSession.index >= reviewSession.items.length) {
            card.innerHTML = `<div class="suite-complete"><span aria-hidden="true">🌸</span><h2>Review complete</h2><p>You reviewed <strong>${reviewSession.completed}</strong> item${reviewSession.completed===1?"":"s"}.</p><button class="primary-button" type="button" data-review-finish>Done</button></div>`;
            return;
        }
        const item = reviewSession.items[reviewSession.index];
        const record = srs[item.key];
        card.innerHTML = `<div class="suite-progress-row"><span class="tag">${html(item.type)}</span><span>${html(dueLabel(record))}</span><strong>${reviewSession.index+1} / ${reviewSession.items.length}</strong></div>
            <button class="smart-review-card" type="button" data-review-reveal aria-expanded="${reviewSession.revealed}">
                <span class="section-kicker">${reviewSession.revealed?"Answer":"Recall"}</span>
                <strong data-reading-part="japanese">${html(item.japanese)}</strong>
                <span data-reading-part="kana" ${reviewSession.revealed?"":"hidden"}>${html(item.kana)}</span>
                <span data-reading-part="romaji" ${reviewSession.revealed?"":"hidden"}>${html(item.romaji)}</span>
                <p data-reading-part="english" ${reviewSession.revealed?"":"hidden"}>${html(item.english)}</p>
            </button>
            <div class="suite-inline-actions"><button class="secondary-button" type="button" data-sakura-speak data-speak-text="${html(item.japanese)}">🔊 Hear</button><button class="secondary-button" type="button" data-sakura-speak data-speak-text="${html(item.japanese)}" data-speak-slow="true">🐢 Slow</button></div>
            <div class="srs-rating-grid" ${reviewSession.revealed?"":"hidden"}>
                <button type="button" data-srs-rate="again"><strong>Again</strong><small>10 min</small></button>
                <button type="button" data-srs-rate="hard"><strong>Hard</strong><small>~1 day</small></button>
                <button type="button" data-srs-rate="good"><strong>Good</strong><small>normal interval</small></button>
                <button type="button" data-srs-rate="easy"><strong>Easy</strong><small>longer interval</small></button>
            </div>`;
        if (reviewSession.revealed) applyReadingPrefs(card);
    }
    function rateReview(rating) {
        if (!reviewSession) return;
        const item = reviewSession.items[reviewSession.index];
        rateSrs(item.key, rating, { source:"smart-review" });
        reviewSession.completed += 1;
        reviewSession.index += 1;
        reviewSession.revealed = false;
        renderReviewCard();
    }

    function loadLessons() {
        if (lessonData) return Promise.resolve(lessonData);
        if (lessonPromise) return lessonPromise;
        lessonPromise = fetch("./data/grammar.json?v=2").then(response => {
            if (!response.ok) throw new Error(`Grammar data returned ${response.status}.`);
            return response.json();
        }).then(records => {
            if (!Array.isArray(records) || !records.length) throw new Error("Grammar lesson data is empty.");
            lessonData = records.filter(item => item?.type === "grammar" && item.id && item.pattern && item.meaning && array(item.examples).length);
            return lessonData;
        }).catch(error => { lessonPromise=null; throw error; });
        return lessonPromise;
    }
    async function openLessons() {
        const loading = document.getElementById("lesson-loading");
        if (loading) { loading.hidden=false; loading.textContent="Preparing lesson path…"; }
        try {
            await loadLessons();
            if (loading) loading.hidden=true;
            renderLessonList();
        }
        catch (error) { if(loading){loading.hidden=false;loading.textContent=error?.message||"Lessons could not load.";} }
    }
    function renderLessonList() {
        const list = document.getElementById("lesson-list");
        const level = document.getElementById("lesson-level")?.value || "N5";
        const items = array(lessonData).filter(item => item.jlpt === level);
        if (!list) return;
        list.innerHTML = items.map(item => {
            const progress = lessonProgress[item.id] || {};
            return `<button class="lesson-card" type="button" data-lesson-id="${html(item.id)}"><span class="grammar-level-badge">${html(item.jlpt)}</span><span><strong>${html(item.pattern)}</strong><small>${html(item.meaning)}</small></span><b>${progress.completed?"✓":"›"}</b></button>`;
        }).join("");
        document.getElementById("lesson-empty").hidden = Boolean(items.length);
        const done = items.filter(item => lessonProgress[item.id]?.completed).length;
        document.getElementById("lesson-level-progress").textContent = `${done} / ${items.length} completed`;
        document.getElementById("lesson-list-panel").hidden = false;
        document.getElementById("lesson-detail-panel").hidden = true;
    }
    function openLesson(id) {
        activeLesson = lessonData?.find(item => item.id === id) || null;
        if (!activeLesson) return;
        document.getElementById("lesson-list-panel").hidden = true;
        document.getElementById("lesson-detail-panel").hidden = false;
        const item = activeLesson;
        document.getElementById("lesson-detail-level").textContent=item.jlpt;
        document.getElementById("lesson-detail-pattern").textContent=item.pattern;
        document.getElementById("lesson-detail-reading").textContent=item.reading;
        document.getElementById("lesson-detail-romaji").textContent=item.romaji;
        document.getElementById("lesson-detail-meaning").textContent=item.meaning;
        document.getElementById("lesson-detail-explanation").textContent=item.explanation;
        document.getElementById("lesson-detail-formation").innerHTML=array(item.formation).map(value=>`<li>${html(value)}</li>`).join("");
        const caution=[item.nuance,item.commonMistakes?`Common mistake: ${item.commonMistakes}`:""].filter(Boolean).join("\n");
        document.getElementById("lesson-detail-caution").textContent=caution||"No extra caution is listed for this pattern.";
        const example=item.examples[0];
        document.getElementById("lesson-example-japanese").textContent=example.japanese;
        document.getElementById("lesson-example-kana").textContent=example.kana;
        document.getElementById("lesson-example-romaji").textContent=example.romaji;
        document.getElementById("lesson-example-english").textContent=example.english;
        const pool=shuffle(lessonData.filter(other=>other.id!==item.id&&other.jlpt===item.jlpt)).slice(0,3);
        const choices=shuffle([{id:item.id,text:item.meaning,correct:true},...pool.map(other=>({id:other.id,text:other.meaning,correct:false}))]);
        document.getElementById("lesson-check-prompt").textContent=`What does ${item.pattern} mean here?`;
        document.getElementById("lesson-check-choices").innerHTML=choices.map(choice=>`<button type="button" data-lesson-choice="${choice.correct?"true":"false"}">${html(choice.text)}</button>`).join("");
        document.getElementById("lesson-check-feedback").textContent="";
        document.getElementById("lesson-recall-prompt").textContent=`Recall the Japanese pattern for: “${item.meaning}”`;
        document.getElementById("lesson-recall-answer").textContent=item.pattern;
        document.getElementById("lesson-recall-answer").hidden=true;
        document.getElementById("lesson-complete-button").textContent=lessonProgress[item.id]?.completed?"Completed ✓":"Mark Lesson Complete";
        applyReadingPrefs(document.getElementById("lesson-detail-panel"));
        window.scrollTo({top:0,behavior:"smooth"});
    }
    function completeLesson() {
        if (!activeLesson) return;
        lessonProgress[activeLesson.id] = { ...(lessonProgress[activeLesson.id]||{}), completed:true, completedAt:new Date().toISOString() };
        writeJson(STORE.lessonProgress, lessonProgress);
        document.getElementById("lesson-complete-button").textContent="Completed ✓";
        toast("Lesson marked complete 🌸");
    }

    function renderConversationHome() {
        const list=document.getElementById("conversation-scenarios");
        if(!list)return;
        list.innerHTML=CONVERSATIONS.map(scenario=>`<button class="conversation-scenario-card" type="button" data-conversation-scenario="${html(scenario.id)}"><span>${scenario.icon}</span><span><strong>${html(scenario.title)}</strong><small>${html(scenario.context)} · ${html(scenario.level)}</small></span><b>›</b></button>`).join("");
        document.getElementById("conversation-home").hidden=false;
        document.getElementById("conversation-session").hidden=true;
    }
    function startConversation(id) {
        const scenario=CONVERSATIONS.find(item=>item.id===id);
        if(!scenario)return;
        conversationSession={ scenario,index:0,score:0,answered:false,selected:null };
        renderConversationTurn();
    }
    function renderConversationTurn() {
        const home=document.getElementById("conversation-home"), session=document.getElementById("conversation-session");
        home.hidden=true; session.hidden=false;
        const {scenario,index}=conversationSession;
        if(index>=scenario.turns.length){
            const best=conversationSession.score;
            conversationStats[scenario.id]={ best:Math.max(Number(conversationStats[scenario.id]?.best||0),best),last:best,updatedAt:new Date().toISOString() };
            writeJson(STORE.conversationStats,conversationStats);
            session.innerHTML=`<div class="suite-complete"><span aria-hidden="true">🌸</span><h2>Conversation complete</h2><p>You chose the best response <strong>${best} / ${scenario.turns.length}</strong> times.</p><div class="suite-inline-actions"><button class="primary-button" type="button" data-conversation-restart="${html(scenario.id)}">Practice Again</button><button class="secondary-button" type="button" data-conversation-home>Scenarios</button></div></div>`;
            return;
        }
        const turn=scenario.turns[index];
        const npc=turn.npc;
        session.innerHTML=`<div class="suite-progress-row"><span class="tag">${html(scenario.title)}</span><span>Turn ${index+1}</span><strong>${index+1} / ${scenario.turns.length}</strong></div>
            <article class="conversation-bubble npc"><span>Staff / Partner</span><strong data-reading-part="japanese">${html(npc[0])}</strong><p data-reading-part="kana">${html(npc[1])}</p><p data-reading-part="romaji">${html(npc[2])}</p><small data-reading-part="english">${html(npc[3])}</small><button class="suite-audio-mini" type="button" data-sakura-speak data-speak-text="${html(npc[0])}">🔊 Hear</button></article>
            <section class="conversation-prompt"><span>Your turn</span><h2>${html(turn.prompt)}</h2></section>
            <div class="conversation-choice-list">${turn.choices.map((choice,i)=>`<button type="button" data-conversation-choice="${i}"><strong>${html(choice[0])}</strong><span data-reading-part="kana">${html(choice[1])}</span><span data-reading-part="romaji">${html(choice[2])}</span><small data-reading-part="english">${html(choice[3])}</small></button>`).join("")}</div>
            <details class="conversation-own-line"><summary>Try your own line</summary><textarea id="conversation-own-input" rows="3" placeholder="Type Japanese here for self-practice. Sakura won't pretend to score arbitrary text offline."></textarea><button class="secondary-button" type="button" data-conversation-show-model>Show a model line</button><p id="conversation-model-line"></p></details>
            <div id="conversation-feedback" class="practice-feedback" hidden></div>`;
        applyReadingPrefs(session);
    }
    function chooseConversation(index) {
        if (!conversationSession || conversationSession.answered) return;
        const turn=conversationSession.scenario.turns[conversationSession.index];
        const choice=turn.choices[index];
        if(!choice)return;
        conversationSession.answered=true;
        conversationSession.selected=index;
        if(choice[4])conversationSession.score+=1;
        const feedback=document.getElementById("conversation-feedback");
        feedback.hidden=false;
        const best=turn.choices.find(item=>item[4]);
        feedback.innerHTML=`<h2>${choice[4]?"Natural choice 🌸":"A better fit"}</h2><p>${choice[4]?"That response matches the situation and register.":`A more natural choice here is <strong>${html(best[0])}</strong> (${html(best[2])}).`}</p><button class="primary-button full-width-button" type="button" data-conversation-next>Next</button>`;
        document.querySelectorAll("[data-conversation-choice]").forEach((button,i)=>{button.disabled=true;button.classList.toggle("correct",Boolean(turn.choices[i]?.[4]));button.classList.toggle("selected",i===index);});
    }

    async function quickPool() {
        const source=document.getElementById("quick-source")?.value||"mixed";
        const level=document.getElementById("quick-level")?.value||"N5";
        const mode=document.getElementById("quick-mode")?.value||"random";
        const items=[];
        if(source==="kana"||source==="mixed") KANA.filter(item=>item[2]==="Hiragana").forEach((entry,i)=>items.push({key:`kana:${entry[0]}`,type:"kana",japanese:entry[0],kana:entry[0],romaji:entry[1],english:entry[1],level:"Kana",answer:[entry[1]]}));
        if(source==="kanji"||source==="mixed") {
            try{await window.SakuraKanjiLoader?.loadKanjiLevel?.(level);}catch{}
            const list=window.SakuraKanjiLoader?.getLoadedKanji?.().filter(item=>item.jlpt===level)||array(window.KANJI_DATA).filter(item=>item.jlpt===level);
            list.forEach(item=>items.push({...readingItem(item),answer:[item.meaning,...String(item.meaning||"").split(/[;,/]/).map(x=>x.trim()).filter(Boolean),item.romaji,...array(item.onyomi),...array(item.kunyomi)]}));
        }
        if(source==="vocabulary"||source==="mixed") {
            try{await window.SakuraVocabularyLoader?.loadVocabularyLevel?.(level);}catch{}
            const list=window.SakuraVocabularyLoader?.getLoadedVocabulary?.().filter(item=>item.jlpt===level)||array(window.VOCABULARY_DATA).filter(item=>item.jlpt===level);
            list.forEach(item=>items.push({...readingItem(item),answer:[item.meaning,...String(item.meaning||"").split(/[;,/]/).map(x=>x.trim()).filter(Boolean)]}));
        }
        let result=items;
        if(mode==="weak") result=result.filter(item=>isWeakRecord(srs[item.key]));
        if(mode==="missed") result=result.filter(item=>recentMiss(srs[item.key]));
        return shuffle(result);
    }
    function normalizeAnswer(value){return String(value||"").trim().toLowerCase().replace(/[.,!?;:'"()\[\]{}]/g,"").replace(/\s+/g," ");}
    async function startQuickPractice() {
        const count=clamp(Number(document.getElementById("quick-count")?.value||10),1,50);
        const pool=await quickPool();
        if(!pool.length){document.getElementById("quick-message").textContent="No items match those filters yet. Try Random or another source/level.";return;}
        quickSession={items:pool.slice(0,count),index:0,correct:0,revealed:false,answered:false};
        renderQuickQuestion();
    }
    function renderQuickQuestion() {
        const setup=document.getElementById("quick-setup"),session=document.getElementById("quick-session");
        if(!quickSession){setup.hidden=false;session.hidden=true;return;}
        setup.hidden=true;session.hidden=false;
        if(quickSession.index>=quickSession.items.length){
            quickStats.correct=Number(quickStats.correct||0)+quickSession.correct;
            quickStats.missed=Number(quickStats.missed||0)+(quickSession.items.length-quickSession.correct);
            quickStats.sessions=Number(quickStats.sessions||0)+1; writeJson(STORE.quickStats,quickStats);
            session.innerHTML=`<div class="suite-complete"><span aria-hidden="true">🌸</span><h2>Quick Practice complete</h2><p><strong>${quickSession.correct} / ${quickSession.items.length}</strong> correct</p><button class="primary-button" type="button" data-quick-finish>Done</button></div>`;
            return;
        }
        const item=quickSession.items[quickSession.index];
        const prompt=item.type==="kana"?"Type the romaji":item.type==="kanji"?"Type a meaning or reading":"Type the English meaning";
        session.innerHTML=`<div class="suite-progress-row"><span class="tag">${html(item.type)}</span><span>${html(item.level||"")}</span><strong>${quickSession.index+1} / ${quickSession.items.length}</strong></div>
            <article class="quick-question-card"><span>${prompt}</span><strong>${html(item.japanese)}</strong>${item.type==="vocabulary"?`<small>${html(item.kana)}</small>`:""}</article>
            <input id="quick-answer" class="answer-input" type="text" autocomplete="off" placeholder="Your answer">
            <div class="suite-inline-actions"><button class="primary-button" type="button" data-quick-check>Check</button><button class="secondary-button" type="button" data-quick-reveal>Reveal</button><button class="secondary-button" type="button" data-sakura-speak data-speak-text="${html(item.japanese)}">🔊 Hear</button></div>
            <div id="quick-feedback" class="practice-feedback" hidden></div>`;
        requestAnimationFrame(()=>document.getElementById("quick-answer")?.focus());
    }
    function checkQuick(reveal=false) {
        if(!quickSession||quickSession.answered)return;
        const item=quickSession.items[quickSession.index];
        const value=normalizeAnswer(document.getElementById("quick-answer")?.value);
        const accepted=array(item.answer).map(normalizeAnswer).filter(Boolean);
        const correct=!reveal&&value&&accepted.some(answer=>answer===value||answer.includes(value)&&value.length>=3||value.includes(answer)&&answer.length>=3);
        quickSession.answered=true;
        if(correct)quickSession.correct+=1;
        rateSrs(item.key,correct?"good":"again",{source:"quick-practice"});
        const feedback=document.getElementById("quick-feedback");feedback.hidden=false;
        feedback.innerHTML=`<h2>${correct?"Correct 🌸":reveal?"Answer revealed":"Not quite"}</h2><div class="practice-answer-reading"><strong>${html(item.japanese)}</strong><span>${html(item.kana)}</span><span>${html(item.romaji)}</span><span>${html(item.english)}</span></div><button class="primary-button full-width-button" type="button" data-quick-next>Next</button>`;
    }

    function setupCanvasEvents() {
        const canvas=document.getElementById("writing-canvas");
        if(!canvas||canvas.dataset.suiteBound)return;
        canvas.dataset.suiteBound="true";
        canvas.addEventListener("pointerdown",event=>{
            if(event.button!==undefined&&event.button!==0)return;
            event.preventDefault(); writingPointerId=event.pointerId; canvas.setPointerCapture?.(event.pointerId); activeStroke=[canvasPoint(event)]; scheduleWritingRedraw();
        });
        canvas.addEventListener("pointermove",event=>{
            if(writingPointerId!==event.pointerId||!activeStroke)return;
            event.preventDefault(); const point=canvasPoint(event); const last=activeStroke[activeStroke.length-1]; if(!last||Math.hypot(point.x-last.x,point.y-last.y)>=1.5){activeStroke.push(point);scheduleWritingRedraw();}
        });
        const finish=event=>{
            if(writingPointerId!==event.pointerId)return;
            if(activeStroke?.length>1)writingStrokes.push(activeStroke); activeStroke=null; writingPointerId=null; try{if(canvas.hasPointerCapture?.(event.pointerId))canvas.releasePointerCapture(event.pointerId);}catch{} scheduleWritingRedraw();
        };
        canvas.addEventListener("pointerup",finish);canvas.addEventListener("pointercancel",finish);
    }

    function routeOpen(route) {
        if(route==="study-lab") renderStudyLab();
        if(route==="practice-shadowing") { renderShadowing(); applyReadingPrefs(); }
        if(route==="study-writing") {
            const guide=document.getElementById("writing-guide-opacity"); if(guide)guide.value=String(prefs.writingGuideOpacity);
            const guideVisible=document.getElementById("writing-guide-visible"); if(guideVisible)guideVisible.checked=prefs.writingGuideVisible;
            const memory=document.getElementById("writing-memory-mode"); if(memory)memory.checked=writingMemoryMode;
            setupCanvasEvents(); requestAnimationFrame(()=>{fitCanvas();setWritingMode(writingMode);});
        }
        if(route==="study-review") { reviewSession=null; renderReviewCard(); renderReviewDashboard(); }
        if(route==="study-lessons") { activeLesson=null; openLessons(); }
        if(route==="practice-conversation") renderConversationHome();
        if(route==="practice-quick") { quickSession=null; renderQuickQuestion(); }
        requestAnimationFrame(()=>augmentAudioButtons(route));
    }

    function addSpeakButton(container, selector, label="Hear") {
        if(!container||container.querySelector(`[data-speak-selector="${selector}"]`))return;
        const button=document.createElement("button");button.type="button";button.className="suite-audio-mini";button.dataset.sakuraSpeak="";button.dataset.speakSelector=selector;button.textContent=`🔊 ${label}`;container.appendChild(button);
    }
    function augmentAudioButtons(route) {
        if(route==="translate") addSpeakButton(document.querySelector("#translation-result .translation-result-actions"),"#translation-japanese");
        if(route==="learn-native"||route==="learn-slang") addSpeakButton(document.querySelector("#native-view .card-topline"),"#native-expression");
        if(route==="kanji-detail") addSpeakButton(document.querySelector("#kanji-detail-view .detail-header"),"#detail-kanji-sentence","Example");
        if(route==="word-detail") addSpeakButton(document.querySelector("#word-detail-view .detail-header"),"#detail-word-text");
        if(route==="grammar") document.querySelectorAll("#grammar-example-list .grammar-example-card").forEach(card=>{if(!card.querySelector("[data-sakura-speak]")){const b=document.createElement("button");b.type="button";b.className="suite-audio-mini";b.dataset.sakuraSpeak="";b.dataset.speakText=card.querySelector("strong")?.textContent||"";b.textContent="🔊";card.appendChild(b);}});
        if(route.startsWith("travel-")) document.querySelectorAll("#travel-phrase-list .travel-phrase-card").forEach(card=>{if(!card.querySelector("[data-sakura-speak]")){const b=document.createElement("button");b.type="button";b.className="suite-audio-mini";b.dataset.sakuraSpeak="";b.dataset.speakText=card.querySelector("h2")?.textContent||"";b.textContent="🔊 Hear";card.querySelector(".card-topline")?.appendChild(b);}});
    }

    function handleClick(event) {
        const target=event.target;
        const routeButton=target.closest("[data-suite-route]"); if(routeButton){event.preventDefault();window.showRoute?.(routeButton.dataset.suiteRoute);return;}
        const speakButton=target.closest("[data-sakura-speak]"); if(speakButton){event.preventDefault();handleSpeakButton(speakButton);return;}
        if(target.closest("[data-stop-speech]")){stopSpeech();return;}
        const writingModeButton=target.closest("[data-writing-mode]"); if(writingModeButton){setWritingMode(writingModeButton.dataset.writingMode);return;}
        if(target.closest("#writing-clear")){clearWritingCanvas();return;}
        if(target.closest("#writing-undo")){undoWritingStroke();return;}
        const writingRate=target.closest("[data-writing-rate]");if(writingRate){
            const rating=writingRate.dataset.writingRate;
            let key=`kana:${writingCharacter}`;
            if(writingMode==="kanji"){const item=window.SakuraKanjiLoader?.getLoadedKanji?.().find(entry=>entry.character===writingCharacter)||array(window.KANJI_DATA).find(entry=>entry.character===writingCharacter);if(item)key=itemKey(item);}
            rateSrs(key,rating,{source:"writing"});
            const message=document.getElementById("writing-rating-message");if(message)message.textContent=rating==="again"?"Marked Again — this will return sooner.":rating==="hard"?"Marked Learning — keep practicing this one.":"Got it — Sakura will give it more space.";
            return;
        }
        if(target.closest("#stroke-prev")){changeStrokeStep(-1);return;}
        if(target.closest("#stroke-next")){changeStrokeStep(1);return;}
        if(target.closest("#stroke-play")){playStrokeOrder();return;}
        if(target.closest("#start-shadowing")){startShadowing();return;}
        if(target.closest("#shadow-play")){shadowPlaySequence();return;}
        if(target.closest("#shadow-slow")){if(shadowSession)speak(shadowSession.items[shadowSession.index].japanese,{rate:.7});return;}
        if(target.closest("#shadow-prev")){shadowMove(-1);return;}
        if(target.closest("#shadow-next")){shadowMove(1);return;}
        if(target.closest("#start-smart-review")){startReview();return;}
        if(target.closest("[data-review-reveal]")){if(reviewSession){reviewSession.revealed=true;renderReviewCard();}return;}
        const rate=target.closest("[data-srs-rate]");if(rate){rateReview(rate.dataset.srsRate);return;}
        if(target.closest("[data-review-finish]")){reviewSession=null;renderReviewCard();return;}
        const lesson=target.closest("[data-lesson-id]");if(lesson){openLesson(lesson.dataset.lessonId);return;}
        if(target.closest("#lesson-back")){activeLesson=null;renderLessonList();return;}
        const lessonChoice=target.closest("[data-lesson-choice]");if(lessonChoice){document.getElementById("lesson-check-feedback").textContent=lessonChoice.dataset.lessonChoice==="true"?"Correct 🌸":"Not this one. Re-read the Meaning and How it works sections.";return;}
        if(target.closest("#lesson-reveal-recall")){document.getElementById("lesson-recall-answer").hidden=false;return;}
        if(target.closest("#lesson-complete-button")){completeLesson();return;}
        const scenario=target.closest("[data-conversation-scenario]");if(scenario){startConversation(scenario.dataset.conversationScenario);return;}
        const choice=target.closest("[data-conversation-choice]");if(choice){chooseConversation(Number(choice.dataset.conversationChoice));return;}
        if(target.closest("[data-conversation-next]")){conversationSession.index+=1;conversationSession.answered=false;conversationSession.selected=null;renderConversationTurn();return;}
        const restart=target.closest("[data-conversation-restart]");if(restart){startConversation(restart.dataset.conversationRestart);return;}
        if(target.closest("[data-conversation-home]")){conversationSession=null;renderConversationHome();return;}
        if(target.closest("[data-conversation-show-model]")){if(conversationSession){const turn=conversationSession.scenario.turns[conversationSession.index];const best=turn.choices.find(item=>item[4]);document.getElementById("conversation-model-line").textContent=best?`${best[0]} · ${best[2]} · ${best[3]}`:"";}return;}
        if(target.closest("#start-quick-practice")){startQuickPractice();return;}
        if(target.closest("[data-quick-check]")){checkQuick(false);return;}
        if(target.closest("[data-quick-reveal]")){checkQuick(true);return;}
        if(target.closest("[data-quick-next]")){quickSession.index+=1;quickSession.answered=false;renderQuickQuestion();return;}
        if(target.closest("[data-quick-finish]")){quickSession=null;renderQuickQuestion();return;}
    }
    function handleChange(event) {
        const target=event.target;
        if(target.matches("[data-study-reading-toggle]")){
            const key=target.dataset.studyReadingToggle;
            if(key==="japanese")prefs.showJapanese=target.checked;
            if(key==="kana")prefs.showKana=target.checked;
            if(key==="romaji")prefs.showRomaji=target.checked;
            if(key==="english")prefs.showEnglish=target.checked;
            persistPrefs();applyReadingPrefs();return;
        }
        if(target.id==="study-speech-rate"){prefs.speechRate=Number(target.value)===.7?.7:1;persistPrefs();return;}
        if(target.id==="study-shadow-pause"){prefs.shadowPauseMs=clamp(Number(target.value)||2200,1000,5000);persistPrefs();return;}
        if(target.id==="study-review-before-new"){prefs.reviewBeforeNew=target.checked;persistPrefs();return;}
        if(target.id==="shadow-auto-replay"&&shadowSession){shadowSession.autoReplay=target.checked;return;}
        if(target.id==="writing-kana-set"){writingKanaSet=target.value==="Katakana"?"Katakana":"Hiragana";writingCharacter=KANA.find(item=>item[2]===writingKanaSet)?.[0]||"あ";renderKanaChoices();renderWritingReference();clearWritingCanvas();return;}
        if(target.id==="writing-kana-character"){writingCharacter=target.value;renderWritingReference();clearWritingCanvas();return;}
        if(target.id==="writing-kanji-level"){loadWritingKanjiLevel();return;}
        if(target.id==="writing-kanji-character"){writingCharacter=target.value;renderWritingReference();clearWritingCanvas();loadKanjiStrokeOrder(writingCharacter);return;}
        if(target.id==="writing-guide-opacity"){prefs.writingGuideOpacity=clamp(Number(target.value),0,.45);writeJson(STORE.prefs,prefs);redrawWritingCanvas();return;}
        if(target.id==="writing-guide-visible"){prefs.writingGuideVisible=target.checked;writeJson(STORE.prefs,prefs);redrawWritingCanvas();return;}
        if(target.id==="writing-memory-mode"){writingMemoryMode=target.checked;renderWritingReference();redrawWritingCanvas();return;}
        if(target.id==="review-queue-filter"||target.id==="review-type-filter"||target.id==="review-session-size"){renderReviewDashboard();return;}
        if(target.id==="lesson-level"){activeLesson=null;renderLessonList();return;}
    }
    function handleKeydown(event){
        if(event.key==="Enter"&&event.target?.id==="quick-answer"&&!quickSession?.answered){event.preventDefault();checkQuick(false);}
    }

    function init() {
        if(initialized)return;
        initialized=true;
        refreshVoices();
        window.speechSynthesis?.addEventListener?.("voiceschanged",refreshVoices);
        document.addEventListener("click",handleClick);
        document.addEventListener("change",handleChange);
        document.addEventListener("keydown",handleKeydown);
        document.addEventListener("visibilitychange",()=>{if(document.hidden)stopSpeech();});
        window.addEventListener("pagehide",()=>{stopSpeech();stopStrokePlayback();});
        window.addEventListener("resize",()=>{if(!document.getElementById("study-writing-view")?.hidden)fitCanvas();},{passive:true});
        setupCanvasEvents();
        renderStudyLab();
        applyReadingPrefs();
    }

    window.SakuraStudySuite = Object.freeze({ init, open:routeOpen, speak, stopSpeech, handleSpeakButton, rateSrs, renderStudyLab, augmentAudioButtons });
}());
