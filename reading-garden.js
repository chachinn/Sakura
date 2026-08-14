/* =====================================================
   Sakura Reading Garden — v7
   Source-first Articles + real public-domain Japanese Short Stories.
   200 sourced Articles + 100 Aozora Bunko stories across six shelves ready.
   Manga remains roadmap-only pending legitimate licensing.
===================================================== */
(function initializeSakuraReadingGarden() {
    if (window.SakuraReadingGarden) return;

    const PREFS_KEY = "sakuraReadingGardenPrefsV3";
    const LIBRARY_KEY = "sakuraReadingGardenLibraryV2";
    const LEVELS = Object.freeze(["N5", "N4", "N3", "N2", "N1"]);
    const ARTICLE_FILES = Object.freeze({
        N5:Object.freeze(["./data/reading/articles/n5.json?v=5","./data/reading/articles/n5-b.json?v=5","./data/reading/articles/n5-c.json?v=5","./data/reading/articles/n5-d.json?v=5"]),
        N4:Object.freeze(["./data/reading/articles/n4.json?v=5","./data/reading/articles/n4-b.json?v=5","./data/reading/articles/n4-c.json?v=5","./data/reading/articles/n4-d.json?v=5"]),
        N3:Object.freeze(["./data/reading/articles/n3.json?v=5","./data/reading/articles/n3-b.json?v=5","./data/reading/articles/n3-c.json?v=5","./data/reading/articles/n3-d.json?v=5"]),
        N2:Object.freeze(["./data/reading/articles/n2.json?v=5","./data/reading/articles/n2-b.json?v=5","./data/reading/articles/n2-c.json?v=5","./data/reading/articles/n2-d.json?v=5"]),
        N1:Object.freeze(["./data/reading/articles/n1.json?v=5","./data/reading/articles/n1-b.json?v=5","./data/reading/articles/n1-c.json?v=5","./data/reading/articles/n1-d.json?v=5"])
    });
    const ARTICLE_MANIFEST = "./data/reading/articles/manifest.json?v=5";
    const ARTICLE_TOPICS = Object.freeze([
        ["all","🌸","All topics"], ["beauty","💄","Beauty & Cosmetics"], ["food","🍚","Food & Eating"],
        ["travel","✈️","Travel & Transportation"], ["digital","📱","Digital Life & Technology"], ["consumer","🛒","Consumer & Money"],
        ["health","🌿","Health & Wellness"], ["environment","🌏","Environment & Nature"], ["culture","🎨","Culture & Arts"],
        ["work","💼","Work & Careers"], ["society","👨‍👩‍👧","Society & Family"]
    ]);
    const STORY_FILES = Object.freeze({
        classics:"./data/reading/stories/classics.json?v=4",
        "modern-literature":"./data/reading/stories/modern-literature.json?v=4",
        "mystery-suspense":"./data/reading/stories/mystery-suspense.json?v=4",
        "children-stories":"./data/reading/stories/children-stories.json?v=4",
        "human-bonds":"./data/reading/stories/human-bonds.json?v=4",
        "strange-horror":"./data/reading/stories/strange-horror.json?v=4"
    });
    const STORY_MANIFEST = "./data/reading/stories/manifest.json?v=4";
    const STORY_CATEGORIES = Object.freeze([
        ["all","🌸","All stories"], ["classics","📜","Classics"], ["modern-literature","🏙️","Modern Literature"],
        ["mystery-suspense","🔎","Mystery & Suspense"], ["children-stories","🦊","Children’s Stories"], ["human-bonds","💕","Human & Relationships"], ["strange-horror","🕯️","Strange / Horror"]
    ]);
    const MATERIALS = Object.freeze([
        { id:"manga", icon:"🎀", title:"Manga", count:120, unit:"chapters", description:"Legitimate published manga only after redistribution and educational-use rights are verified.", status:"Licensing first" },
        { id:"articles", icon:"📰", title:"Articles", count:300, unit:"articles", description:"Real current official-source topics with visible provenance, learner support, and links to the originals.", status:"200 sourced · 300 target" },
        { id:"short-stories", icon:"📚", title:"Short Stories", count:250, unit:"stories", description:"Real Japanese fiction with source and rights metadata across Classics, Modern Literature, Mystery, Strange / Horror, Children’s Stories, and Human Relationships.", status:"100 real stories · 250 target" },
        { id:"news", icon:"🌏", title:"News", count:300, unit:"pieces", description:"News-style Japanese from easy to advanced, including topics rewritten across JLPT levels.", status:"Planned" },
        { id:"conversations", icon:"💬", title:"Conversations", count:250, unit:"dialogues", description:"Realistic conversations with friends, staff, coworkers, couples, strangers, and service workers.", status:"Planned" },
        { id:"diaries", icon:"📔", title:"Diary Entries", count:150, unit:"entries", description:"Personal journals, daily routines, thoughts, feelings, plans, and ordinary life.", status:"Planned" },
        { id:"texts", icon:"📱", title:"Texts & Chats", count:150, unit:"chats", description:"LINE-style messages, group chats, casual texting, abbreviations, slang, and omitted particles.", status:"Planned" },
        { id:"travel", icon:"✈️", title:"Travel Reading", count:200, unit:"readings", description:"Stations, hotels, restaurants, airports, attractions, bookings, announcements, and travel situations.", status:"Planned" },
        { id:"folklore", icon:"👹", title:"Folktales & Legends", count:100, unit:"readings", description:"Japanese folklore, legends, yōkai, ghost tales, and carefully adapted traditional material.", status:"Planned" },
        { id:"essays", icon:"✍️", title:"Essays & Opinions", count:150, unit:"essays", description:"Reflections, viewpoints, arguments, and more advanced reading for the N3–N1 transition.", status:"Planned" },
        { id:"letters", icon:"💌", title:"Letters & Emails", count:120, unit:"items", description:"Friendly notes, invitations, thank-you messages, formal email, and workplace correspondence.", status:"Planned" },
        { id:"school-work", icon:"🏫", title:"School & Work", count:120, unit:"items", description:"Notices, schedules, memos, classroom information, workplace messages, and internal announcements.", status:"Planned" },
        { id:"reviews", icon:"⭐", title:"Reviews", count:100, unit:"reviews", description:"Restaurants, hotels, games, anime, products, attractions, and recommendation language.", status:"Planned" },
        { id:"recipes", icon:"🍳", title:"Recipes & How-To", count:100, unit:"guides", description:"Recipes, tutorials, instructions, hobby guides, and practical step-by-step Japanese.", status:"Planned" },
        { id:"interviews", icon:"🎤", title:"Interviews & Q&A", count:100, unit:"interviews", description:"Student, workplace, hobby, creator, and celebrity-style interviews with natural question patterns.", status:"Planned" },
        { id:"documents", icon:"🚉", title:"Real-Life Documents", count:200, unit:"items", description:"Signs, menus, tickets, forms, posters, warnings, labels, receipts, machines, and public notices.", status:"Planned" },
        { id:"novels", icon:"📕", title:"Serialized Novels", count:80, unit:"chapters", description:"Longer continuing stories with saved progress, chapter history, vocabulary help, and comprehension.", status:"Planned" },
        { id:"micro", icon:"🌙", title:"Poetry & Micro Reads", count:100, unit:"reads", description:"Original poems, tiny scenes, short reflections, captions, and micro-fiction for quick practice.", status:"Planned" }
    ]);
    const TOTAL_TARGET = MATERIALS.reduce((sum,item) => sum + item.count, 0);
    const DEFAULT_PREFS = Object.freeze({ level:"all", mode:"furigana", material:"articles", articleTopic:"all", storyCategory:"all" });
    const DEFAULT_LIBRARY = Object.freeze({ saved:[], completed:[], lastArticleId:"", lastStoryId:"", lastReadingType:"", lastReadingId:"", offlineArticlesReadyAt:"", offlineStoriesReadyAt:"" });
    const articleCache = new Map();
    const articleInFlight = new Map();
    let currentScreen = "home";
    let currentArticle = null;
    let translationVisible = false;
    let articleVisibleCount = 30;
    let currentFilteredArticles = [];
    let storyRecords = null;
    let storyInFlight = null;
    let storyManifest = null;
    let storyManifestInFlight = null;
    let currentStory = null;
    let storyVisibleCount = 24;
    let currentFilteredStories = [];

    function readJson(key, fallback) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || "null");
            return parsed && typeof parsed === "object" ? parsed : JSON.parse(JSON.stringify(fallback));
        } catch (error) {
            console.warn("Reading Garden: stored data could not be read.", error);
            return JSON.parse(JSON.stringify(fallback));
        }
    }
    function writeJson(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); }
        catch (error) { console.warn("Reading Garden: stored data could not be saved.", error); }
    }
    let prefs = { ...DEFAULT_PREFS, ...readJson(PREFS_KEY, DEFAULT_PREFS) };
    let library = { ...DEFAULT_LIBRARY, ...readJson(LIBRARY_KEY, DEFAULT_LIBRARY) };
    if (!Array.isArray(library.saved)) library.saved = [];
    if (!Array.isArray(library.completed)) library.completed = [];

    function savePrefs() { writeJson(PREFS_KEY, prefs); }
    function saveLibrary() { writeJson(LIBRARY_KEY, library); }
    function escapeHtml(value) {
        return String(value ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
    }
    function materialById(id) { return MATERIALS.find(item => item.id === id) || MATERIALS[1]; }
    function articleById(id) {
        for (const records of articleCache.values()) {
            const found = records.find(article => article.id === id);
            if (found) return found;
        }
        return null;
    }
    function topicLabel(id) { return ARTICLE_TOPICS.find(row => row[0] === id)?.[2] || "All topics"; }
    function storyCategoryLabel(id) { return STORY_CATEGORIES.find(row => row[0] === id)?.[2] || "All stories"; }
    function storyById(id) { return storyRecords?.find(item => item.id === id) || null; }
    function isSaved(id) { return library.saved.includes(id); }
    function isCompleted(id) { return library.completed.includes(id); }

    function ensureStyles() {
        if (document.getElementById("sakura-reading-garden-styles")) return;
        const style = document.createElement("style");
        style.id = "sakura-reading-garden-styles";
        style.textContent = `
            .reading-garden-entry-card{position:relative;overflow:hidden;border-color:color-mix(in srgb,var(--color-primary) 28%,var(--color-border))!important;background:linear-gradient(145deg,color-mix(in srgb,var(--color-primary-soft) 78%,var(--color-surface)),var(--color-surface))!important}.reading-garden-entry-card::after{content:"NEW";position:absolute;top:9px;right:34px;padding:3px 6px;border-radius:999px;background:var(--color-primary);color:#fff;font-size:7px;font-weight:900;letter-spacing:.05em}
            .reading-garden-dialog{width:min(760px,100%);height:min(96dvh,960px);max-width:none;max-height:none;margin:auto 0 0;padding:0;border:0;border-radius:24px 24px 0 0;background:var(--color-background);color:var(--color-text);box-shadow:0 -16px 50px rgba(36,28,34,.18);overflow:hidden}.reading-garden-dialog::backdrop{background:rgba(35,28,33,.34);backdrop-filter:blur(2px)}
            .reading-garden-shell{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}.reading-garden-topbar{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:8px;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;border-bottom:1px solid var(--color-border);background:color-mix(in srgb,var(--color-surface) 95%,var(--color-primary-soft));z-index:3}.reading-garden-topbar button{width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);color:var(--color-text);font-size:21px}.reading-garden-title{text-align:center;min-width:0}.reading-garden-title span{display:block;color:var(--color-primary-dark);font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.reading-garden-title strong{display:block;margin-top:2px;font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
            .reading-garden-body{overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px 14px calc(32px + env(safe-area-inset-bottom))}.reading-garden-hero{position:relative;overflow:hidden;padding:18px;border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border));border-radius:21px;background:linear-gradient(145deg,color-mix(in srgb,var(--color-primary-soft) 80%,var(--color-surface)),var(--color-surface))}.reading-garden-hero::after{content:"🌸";position:absolute;right:-4px;bottom:-18px;font-size:80px;opacity:.1;transform:rotate(-12deg)}.reading-garden-hero h2{position:relative;margin:4px 0 6px;font-size:22px}.reading-garden-hero p{position:relative;max-width:590px;margin:0;color:var(--color-text-muted);font-size:10px;line-height:1.65}.reading-garden-kicker{position:relative;color:var(--color-primary-dark);font-size:8px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
            .reading-garden-stats{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:14px}.reading-garden-stat{min-width:0;padding:9px;border:1px solid color-mix(in srgb,var(--color-primary) 16%,var(--color-border));border-radius:13px;background:color-mix(in srgb,var(--color-surface) 92%,transparent)}.reading-garden-stat strong{display:block;color:var(--color-primary-dark);font-size:14px}.reading-garden-stat small{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px;line-height:1.3}
            .reading-garden-section{margin-top:18px}.reading-garden-section-heading{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:9px}.reading-garden-section-heading h3{margin:2px 0 0;font-size:14px}.reading-garden-section-heading>span{color:var(--color-text-muted);font-size:8px}.reading-garden-levels,.reading-garden-modes,.reading-browser-levels{display:flex;gap:6px;overflow:auto;padding:1px 0 4px;scrollbar-width:none}.reading-garden-levels::-webkit-scrollbar,.reading-garden-modes::-webkit-scrollbar,.reading-browser-levels::-webkit-scrollbar{display:none}.reading-garden-chip{flex:0 0 auto;min-height:36px;padding:7px 10px;border:1px solid var(--color-border);border-radius:999px;background:var(--color-surface);color:var(--color-text-muted);font-size:8px;font-weight:850}.reading-garden-chip.active{border-color:var(--color-primary);background:var(--color-primary-soft);color:var(--color-primary-dark)}
            .reading-garden-reader-options{display:grid;grid-template-columns:1.15fr .85fr;gap:8px;margin-top:9px}.reading-garden-preview,.reading-garden-mode-card{padding:12px;border:1px solid var(--color-border);border-radius:15px;background:var(--color-surface)}.reading-garden-preview>span,.reading-garden-mode-card>span{display:block;color:var(--color-text-muted);font-size:7px;font-weight:850;text-transform:uppercase}.reading-garden-preview p{margin:8px 0 4px;font-size:16px;line-height:2}.reading-garden-preview small,.reading-garden-mode-card p{color:var(--color-text-muted);font-size:8px;line-height:1.45}.reading-garden-mode-card strong{display:block;margin-top:6px;font-size:11px}.reading-garden-mode-card p{margin:4px 0 0}
            .reading-garden-material-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.reading-material-card{min-width:0;padding:11px;display:grid;grid-template-columns:34px minmax(0,1fr);grid-template-areas:"icon main" "meta meta";gap:6px 9px;text-align:left;border:1px solid var(--color-border);border-radius:15px;background:var(--color-surface);color:var(--color-text)}.reading-material-card.active{border-color:var(--color-primary);box-shadow:0 0 0 1px color-mix(in srgb,var(--color-primary) 20%,transparent);background:color-mix(in srgb,var(--color-primary-soft) 50%,var(--color-surface))}.reading-material-icon{grid-area:icon;display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:var(--color-primary-soft);font-size:17px}.reading-material-main{grid-area:main;min-width:0}.reading-material-main strong{display:block;font-size:10px}.reading-material-main small{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px}.reading-material-meta{grid-area:meta;display:flex;gap:6px;justify-content:space-between;color:var(--color-text-muted);font-size:7px}.reading-material-status{color:var(--color-primary-dark);font-weight:850}
            .reading-garden-selection{margin-top:9px;padding:12px;display:grid;grid-template-columns:36px minmax(0,1fr);gap:10px;border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border));border-radius:15px;background:var(--color-primary-soft)}.reading-garden-selection-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:var(--color-surface);font-size:18px}.reading-garden-selection strong{font-size:10px}.reading-garden-selection p,.reading-garden-selection small{display:block;margin:3px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.45}.reading-garden-selection-actions{grid-column:1/-1;display:flex;gap:7px;flex-wrap:wrap;margin-top:2px}
            .reading-garden-primary,.reading-garden-secondary{min-height:38px;padding:8px 12px;border-radius:12px;font-size:8px;font-weight:900}.reading-garden-primary{border:1px solid var(--color-primary);background:var(--color-primary);color:#fff}.reading-garden-secondary{border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text)}.reading-garden-primary:disabled,.reading-garden-secondary:disabled{opacity:.55}
            .reading-garden-library-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.reading-garden-library-item{min-width:0;padding:10px 7px;text-align:center;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface)}button.reading-garden-library-item{color:var(--color-text)}.reading-garden-library-item>span{display:block;color:var(--color-primary-dark);font-size:15px}.reading-garden-library-item strong{display:block;margin-top:3px;font-size:8px}.reading-garden-library-item small{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px}.reading-garden-empty{margin-top:9px;padding:16px;text-align:center;border:1px dashed var(--color-border);border-radius:15px;color:var(--color-text-muted)}.reading-garden-empty>span{font-size:24px}.reading-garden-empty strong{display:block;margin:5px 0 3px;color:var(--color-text);font-size:10px}.reading-garden-empty p{margin:0;font-size:8px;line-height:1.5}.reading-garden-rights-note{display:grid;grid-template-columns:32px minmax(0,1fr);gap:9px;margin-top:18px;padding:11px;border-radius:14px;background:color-mix(in srgb,var(--color-primary-soft) 58%,var(--color-surface));border:1px solid var(--color-border)}.reading-garden-rights-note>span{font-size:18px}.reading-garden-rights-note strong{font-size:9px}.reading-garden-rights-note p{margin:3px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.45}
            .reading-browser-hero{padding:15px;border-radius:18px;background:linear-gradient(145deg,var(--color-primary-soft),var(--color-surface));border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border))}.reading-browser-hero h2{margin:3px 0 5px;font-size:19px}.reading-browser-hero p{margin:0;color:var(--color-text-muted);font-size:9px;line-height:1.5}.reading-browser-toolbar{display:grid;grid-template-columns:minmax(0,1fr) minmax(145px,.6fr);gap:7px;margin:12px 0 7px}.reading-browser-toolbar input,.reading-browser-toolbar select{width:100%;min-height:40px;padding:8px 10px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text);font-size:9px}.reading-browser-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;color:var(--color-text-muted);font-size:8px}.reading-browser-offline{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin:9px 0;padding:9px 10px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface)}.reading-browser-offline span{min-width:0;flex:1;color:var(--color-text-muted);font-size:8px;line-height:1.4}.reading-article-list{display:grid;gap:8px}.reading-article-card{width:100%;min-width:0;padding:12px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;border:1px solid var(--color-border);border-radius:15px;background:var(--color-surface);color:var(--color-text);text-align:left}.reading-article-card:hover,.reading-article-card:focus-visible{border-color:var(--color-primary)}.reading-article-card h3{margin:4px 0 2px;font-size:13px;line-height:1.4}.reading-article-card .reading-en-title{display:block;color:var(--color-text-muted);font-size:8px}.reading-article-card p{margin:6px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.45}.reading-article-tags{display:flex;gap:5px;flex-wrap:wrap}.reading-article-tag{padding:3px 6px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:7px;font-weight:850}.reading-article-save{width:34px;height:34px;border:1px solid var(--color-border);border-radius:11px;background:var(--color-background);color:var(--color-primary-dark);font-size:16px}.reading-article-save.saved{background:var(--color-primary-soft);border-color:var(--color-primary)}.reading-load-more{width:100%;margin-top:9px}.reading-browser-empty{padding:24px;text-align:center;color:var(--color-text-muted);font-size:9px}
            .reading-reader-header{padding:14px;border:1px solid var(--color-border);border-radius:17px;background:color-mix(in srgb,var(--color-primary-soft) 55%,var(--color-surface))}.reading-reader-header-top{display:flex;align-items:center;justify-content:space-between;gap:9px}.reading-reader-tags{display:flex;gap:5px;flex-wrap:wrap}.reading-reader-title{margin:9px 0 2px;font-size:20px;line-height:1.55}.reading-reader-english-title{margin:0;color:var(--color-text-muted);font-size:9px}.reading-reader-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:11px}.reading-reader-actions button{min-height:36px}.reading-reader-mode-row{display:flex;gap:6px;overflow:auto;margin:11px 0 0}.reading-reader-content{margin-top:12px;padding:16px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface)}.reading-reader-paragraph{margin:0 0 15px;font-size:16px;line-height:2.05;letter-spacing:.01em}.reading-reader-paragraph:last-of-type{margin-bottom:0}.reading-reader-paragraph ruby rt{font-size:.52em;color:var(--color-primary-dark)}.reading-reader-translation{margin:-7px 0 15px;padding:9px 10px;border-radius:11px;background:var(--color-primary-soft);color:var(--color-text-muted);font-size:9px;line-height:1.55}.reading-reader-section{margin-top:12px;padding:13px;border:1px solid var(--color-border);border-radius:15px;background:var(--color-surface)}.reading-reader-section h3{margin:0 0 8px;font-size:12px}.reading-reader-vocab{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.reading-reader-vocab>div{padding:9px;border-radius:11px;background:var(--color-primary-soft)}.reading-reader-vocab strong{display:block;font-size:11px}.reading-reader-vocab span{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px}.reading-reader-grammar{display:flex;gap:5px;flex-wrap:wrap}.reading-reader-question{font-size:13px;line-height:1.8}.reading-reader-choices{display:grid;gap:6px;margin-top:9px}.reading-reader-choice{padding:10px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-background);color:var(--color-text);text-align:left;font-size:10px;line-height:1.6}.reading-reader-choice.correct{border-color:#5aa875;background:color-mix(in srgb,#dff4e5 75%,var(--color-surface))}.reading-reader-choice.wrong{border-color:#cf7480;background:color-mix(in srgb,#f8e1e5 75%,var(--color-surface))}.reading-reader-explanation{margin-top:8px;padding:9px;border-radius:11px;background:var(--color-primary-soft);color:var(--color-text-muted);font-size:8px;line-height:1.5}.reading-reader-footer{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:12px}.reading-reader-footer button:last-child{grid-column:1/-1}.reading-reader-complete.done{background:color-mix(in srgb,#5aa875 16%,var(--color-surface));border-color:#5aa875;color:var(--color-text)}
            .reading-source-inline{display:block;margin-top:6px;color:var(--color-primary-dark);font-size:7px;font-weight:800}.reading-level-note{margin:5px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.45}.reading-source-card{margin:0 0 12px;padding:12px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px 10px;border:1px solid color-mix(in srgb,var(--color-primary) 22%,var(--color-border));border-radius:15px;background:color-mix(in srgb,var(--color-primary-soft) 42%,var(--color-surface))}.reading-source-card h3{margin:4px 0;font-size:11px;line-height:1.4}.reading-source-card p{margin:0;color:var(--color-text-muted);font-size:8px}.reading-source-card a{align-self:start;padding:7px 9px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-primary-dark);font-size:8px;font-weight:900;text-decoration:none}.reading-source-card small{grid-column:1/-1;color:var(--color-text-muted);font-size:7px;line-height:1.5}.reading-source-badge{display:inline-flex;width:max-content;max-width:100%;padding:3px 7px;border-radius:999px;background:var(--color-primary);color:white;font-size:7px;font-weight:900}
            .reading-status{padding:20px;text-align:center;color:var(--color-text-muted);font-size:9px}.reading-status strong{display:block;margin-bottom:4px;color:var(--color-text)}
            html.reading-garden-open,html.reading-garden-open body{overflow:hidden}@media(max-width:540px){.reading-garden-dialog{height:97dvh}.reading-garden-reader-options{grid-template-columns:1fr}.reading-garden-material-grid{grid-template-columns:1fr 1fr}.reading-garden-library-strip{grid-template-columns:repeat(2,minmax(0,1fr))}.reading-browser-toolbar{grid-template-columns:1fr}.reading-reader-vocab{grid-template-columns:1fr}.reading-reader-title{font-size:18px}}@media(max-width:360px){.reading-garden-material-grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.reading-garden-dialog *{scroll-behavior:auto!important;transition:none!important}}
        `;
        document.head.appendChild(style);
    }

    function materialCardsMarkup() {
        return MATERIALS.map(item => `
            <button class="reading-material-card${prefs.material === item.id ? " active" : ""}" type="button" data-reading-material="${escapeHtml(item.id)}" aria-pressed="${prefs.material === item.id}">
                <span class="reading-material-icon" aria-hidden="true">${item.icon}</span>
                <span class="reading-material-main"><strong>${escapeHtml(item.title)}</strong><small>${item.count.toLocaleString()} ${escapeHtml(item.unit)}</small></span>
                <span class="reading-material-meta"><span>${item.id === "short-stories" ? "Native originals" : "JLPT N5 → N1"}</span><span class="reading-material-status">${escapeHtml(item.status)}</span></span>
            </button>`).join("");
    }

    function createDialog() {
        let dialog = document.getElementById("reading-garden-dialog");
        if (dialog) return dialog;
        dialog = document.createElement("dialog");
        dialog.id = "reading-garden-dialog";
        dialog.className = "reading-garden-dialog";
        dialog.setAttribute("aria-labelledby", "reading-garden-heading");
        dialog.innerHTML = `
            <div class="reading-garden-shell">
                <header class="reading-garden-topbar">
                    <button type="button" data-reading-back aria-label="Back">‹</button>
                    <div class="reading-garden-title"><span id="reading-garden-kicker">Practice</span><strong id="reading-garden-heading">Reading Garden</strong></div>
                    <button type="button" data-reading-close aria-label="Close Reading Garden">×</button>
                </header>
                <div id="reading-garden-body" class="reading-garden-body">
                    <div id="reading-garden-home">
                        <section class="reading-garden-hero"><span class="reading-garden-kicker">🌸 Read real Japanese at your pace</span><h2>Grow into Japanese reading.</h2><p>Browse many kinds of Japanese material, choose the help you want, and gradually move from kana and furigana toward natural Japanese-only reading.</p><div class="reading-garden-stats"><div class="reading-garden-stat"><strong>${MATERIALS.length}</strong><small>material types</small></div><div class="reading-garden-stat"><strong>${TOTAL_TARGET.toLocaleString()}</strong><small>planned readings / chapters</small></div><div class="reading-garden-stat"><strong>300</strong><small>sourced readings ready</small></div></div></section>
                        <section class="reading-garden-section"><div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Difficulty</span><h3>Your reading level</h3></div><span id="reading-level-summary">All levels</span></div><div class="reading-garden-levels" role="group">${["all",...LEVELS].map(level => `<button class="reading-garden-chip${prefs.level === level ? " active" : ""}" type="button" data-reading-level="${level}">${level === "all" ? "All Levels" : level}</button>`).join("")}</div></section>
                        <section class="reading-garden-section"><div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Display</span><h3>How do you want to read?</h3></div></div><div class="reading-garden-modes" role="group">${modeButtonsMarkup()}</div><div class="reading-garden-reader-options"><article class="reading-garden-preview"><span>Reader preview</span><p id="reading-garden-preview-text"></p><small id="reading-garden-preview-note"></small></article><article class="reading-garden-mode-card"><span>Designed to grow with you</span><strong id="reading-garden-mode-title"></strong><p id="reading-garden-mode-description"></p></article></div></section>
                        <section class="reading-garden-section"><div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Library</span><h3>Browse by material</h3></div><span>${TOTAL_TARGET.toLocaleString()} target</span></div><div class="reading-garden-material-grid">${materialCardsMarkup()}</div><div id="reading-garden-selection" class="reading-garden-selection" aria-live="polite"></div></section>
                        <section class="reading-garden-section"><div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Your shelf</span><h3>My Reading</h3></div></div><div id="reading-garden-library-strip" class="reading-garden-library-strip"></div><div class="reading-garden-empty"><span aria-hidden="true">📖</span><strong>Your reading shelf grows with you.</strong><p>Open sourced Articles or real Japanese Short Stories, save favorites, mark readings complete, and prepare packs for offline use.</p></div></section>
                        <aside class="reading-garden-rights-note"><span aria-hidden="true">🎀</span><div><strong>Manga stays on the roadmap.</strong><p>Sakura will only add legitimate third-party manga after redistribution rights are verified. Manga is intentionally skipped in this build.</p></div></aside>
                    </div>
                    <section id="reading-articles-browser" hidden></section>
                    <article id="reading-article-reader" hidden></article>
                    <section id="reading-stories-browser" hidden></section>
                    <article id="reading-story-reader" hidden></article>
                </div>
            </div>`;
        document.body.appendChild(dialog);
        return dialog;
    }

    function modeButtonsMarkup() {
        return [["furigana","漢字 + Furigana"],["kana","Kana Only"],["japanese","Japanese Only"]].map(([id,label]) => `<button class="reading-garden-chip${prefs.mode === id ? " active" : ""}" type="button" data-reading-mode="${id}" aria-pressed="${prefs.mode === id}">${label}</button>`).join("");
    }

    function injectPracticeCard() {
        const grid = document.querySelector("#practice-view .practice-coming-grid");
        if (!grid || grid.querySelector("[data-open-reading-garden]")) return;
        const button = document.createElement("button");
        button.className = "practice-coming-card practice-active-card reading-garden-entry-card";
        button.type = "button";
        button.dataset.openReadingGarden = "true";
        button.innerHTML = '<span aria-hidden="true">📖</span><span><h2>Reading Garden</h2><p>200 sourced Articles + 100 real Japanese Short Stories ready.</p></span><b aria-hidden="true">→</b>';
        grid.prepend(button);
    }

    function updateModeUi() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        dialog.querySelectorAll("[data-reading-mode]").forEach(button => {
            const active = button.dataset.readingMode === prefs.mode;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        const preview = document.getElementById("reading-garden-preview-text");
        const note = document.getElementById("reading-garden-preview-note");
        const title = document.getElementById("reading-garden-mode-title");
        const description = document.getElementById("reading-garden-mode-description");
        if (preview && note && title && description) {
            const modes = {
                furigana:{ text:"<ruby>東京<rt>とうきょう</rt></ruby>で<ruby>新<rt>あたら</rt></ruby>しい<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みました。", note:"Kanji stays visible, with its reading directly above it.", title:"Kanji + Furigana", description:"The default learning view: real Japanese writing with readings above unfamiliar kanji." },
                kana:{ text:"とうきょうであたらしいほんをよみました。", note:"Everything is shown in kana.", title:"Kana Only", description:"Focus on sound and sentence flow without needing kanji recognition." },
                japanese:{ text:"東京で新しい本を読みました。", note:"No furigana or English appears automatically.", title:"Japanese Only", description:"Immersion mode. Translation remains hidden until you choose to reveal it." }
            };
            const mode = modes[prefs.mode] || modes.furigana;
            preview.innerHTML = mode.text; note.textContent = mode.note; title.textContent = mode.title; description.textContent = mode.description;
        }
        if (currentScreen === "reader" && currentArticle) renderArticleReader(currentArticle);
    }

    function updateLevelUi() {
        document.querySelectorAll("#reading-garden-dialog [data-reading-level]").forEach(button => {
            const active = button.dataset.readingLevel === prefs.level;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        const summary = document.getElementById("reading-level-summary");
        if (summary) summary.textContent = prefs.level === "all" ? "All levels" : `${prefs.level} focus`;
    }

    function updateMaterialSelection() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        dialog.querySelectorAll("[data-reading-material]").forEach(button => button.classList.toggle("active", button.dataset.readingMaterial === prefs.material));
        const item = materialById(prefs.material);
        const selection = document.getElementById("reading-garden-selection");
        if (!selection) return;
        let extra = "This content pack is still on the Reading Garden roadmap.";
        let actions = "";
        if (item.id === "articles") {
            extra = "30 verified source-grounded readings are ready now—3 in each category. Sakura prioritizes 2026, then 2025, 2024, then the newest legally reusable source available. Every reading shows its actual source year, date, and reuse terms.";
            actions = `<div class="reading-garden-selection-actions"><button class="reading-garden-primary" type="button" data-reading-browse-articles>Browse Sourced Articles</button><button class="reading-garden-secondary" type="button" data-reading-surprise-article>Surprise Me</button></div>`;
        } else if (item.id === "short-stories") {
            extra = "100 real Japanese stories are ready across six shelves, including Classics but not limited to them. Their excerpts are original copyright-expired text from Aozora Bunko—not rewritten fiction. Publication or source-edition years are shown honestly, and the full originals open on Aozora Bunko.";
            actions = `<div class="reading-garden-selection-actions"><button class="reading-garden-primary" type="button" data-reading-browse-stories>Browse Stories</button><button class="reading-garden-secondary" type="button" data-reading-surprise-story>Surprise Story</button></div>`;
        } else if (item.id === "manga") extra = "Manga is skipped for now. Legitimate rights verification comes before any third-party manga files are added.";
        selection.innerHTML = `<span class="reading-garden-selection-icon" aria-hidden="true">${item.icon}</span><div><strong>${escapeHtml(item.title)} · ${item.count.toLocaleString()} ${escapeHtml(item.unit)}</strong><p>${escapeHtml(item.description)}</p><small>${escapeHtml(extra)}</small></div>${actions}`;
    }

    function renderLibraryStrip() {
        const strip = document.getElementById("reading-garden-library-strip");
        if (!strip) return;
        const lastId = library.lastReadingId || library.lastArticleId || library.lastStoryId;
        const lastType = library.lastReadingType || (library.lastStoryId === lastId ? "story" : "article");
        const last = lastType === "story" ? storyById(lastId) : articleById(lastId);
        const offlineParts = [library.offlineArticlesReadyAt ? "Articles" : "", library.offlineStoriesReadyAt ? "Stories" : ""].filter(Boolean);
        strip.innerHTML = `
            <button class="reading-garden-library-item" type="button" data-reading-continue ${lastId ? "" : "disabled"}><span>▶</span><strong>Continue</strong><small>${lastId ? (last ? escapeHtml(lastType === "story" ? last.title : last.jlpt) : lastType) : "nothing yet"}</small></button>
            <button class="reading-garden-library-item" type="button" data-reading-open-saved><span>♡</span><strong>Saved</strong><small>${library.saved.length} saved</small></button>
            <div class="reading-garden-library-item"><span>⇩</span><strong>Offline</strong><small>${offlineParts.length ? `${offlineParts.join(" + ")} ready` : "not prepared"}</small></div>
            <div class="reading-garden-library-item"><span>✓</span><strong>Finished</strong><small>${library.completed.length} complete</small></div>`;
    }

    function setScreen(screen) {
        currentScreen = screen;
        const home = document.getElementById("reading-garden-home");
        const articleBrowser = document.getElementById("reading-articles-browser");
        const articleReader = document.getElementById("reading-article-reader");
        const storyBrowser = document.getElementById("reading-stories-browser");
        const storyReader = document.getElementById("reading-story-reader");
        if (home) home.hidden = screen !== "home";
        if (articleBrowser) articleBrowser.hidden = screen !== "articles";
        if (articleReader) articleReader.hidden = screen !== "reader";
        if (storyBrowser) storyBrowser.hidden = screen !== "stories";
        if (storyReader) storyReader.hidden = screen !== "story-reader";
        const heading = document.getElementById("reading-garden-heading");
        const kicker = document.getElementById("reading-garden-kicker");
        if (heading) heading.textContent = screen === "home" ? "Reading Garden" : screen === "articles" ? "Articles" : screen === "stories" ? "Short Stories" : screen === "story-reader" ? (currentStory?.title || "Story") : currentArticle?.titleEnglish || "Reading";
        if (kicker) kicker.textContent = screen === "reader" ? (currentArticle?.jlpt || "Reading") : screen === "story-reader" ? "Original Japanese" : "Practice";
        document.getElementById("reading-garden-body")?.scrollTo({ top:0, behavior:"auto" });
    }

    async function loadArticleLevel(level) {
        if (!LEVELS.includes(level)) throw new Error(`Invalid reading level ${level}`);
        if (articleCache.has(level)) return articleCache.get(level);
        if (articleInFlight.has(level)) return articleInFlight.get(level);
        const request = Promise.all(ARTICLE_FILES[level].map(async url => {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Could not load ${level} Articles (HTTP ${response.status}).`);
            const records = await response.json();
            if (!Array.isArray(records) || !records.length) throw new Error(`${level} Article shard must contain at least one sourced reading.`);
            return records;
        })).then(groups => {
            const records = groups.flat();
            if (records.some(record => { const year = Number(record?.sourceYear); return record?.type !== "article" || record?.jlpt !== level || typeof record?.provenance !== "string" || !record.provenance.startsWith("sourced-") || !Number.isInteger(year) || year < 1900 || year > 2026 || !record?.sourceUrl || !record?.sourcePublisher || !record?.sourceLicense; })) throw new Error(`${level} Article data contains an invalid or unsourced record.`);
            articleCache.set(level, records);
            return records;
        }).finally(() => articleInFlight.delete(level));
        articleInFlight.set(level, request);
        return request;
    }

    async function loadArticleLevels(levelSetting = prefs.level) {
        const requested = levelSetting === "all" ? LEVELS : [levelSetting];
        const groups = await Promise.all(requested.map(loadArticleLevel));
        return groups.flat();
    }

    function articleMatches(article, query, topic, savedOnly) {
        if (topic !== "all" && article.topic !== topic) return false;
        if (savedOnly && !isSaved(article.id)) return false;
        if (!query) return true;
        const haystack = `${article.title} ${article.titleKana} ${article.titleEnglish} ${article.topicLabel} ${article.subject} ${article.subjectKana}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
    }

    async function openArticles(options = {}) {
        prefs.material = "articles";
        if (options.topic) prefs.articleTopic = options.topic;
        savePrefs();
        setScreen("articles");
        const browser = document.getElementById("reading-articles-browser");
        browser.innerHTML = `<div class="reading-status"><strong>Opening the Article Garden…</strong>Loading the reading pack you chose.</div>`;
        try {
            await loadArticleLevels(prefs.level);
            renderArticleBrowser(Boolean(options.savedOnly));
        } catch (error) {
            console.warn("Reading Garden: Articles could not load.", error);
            browser.innerHTML = `<div class="reading-status"><strong>Articles could not be loaded.</strong>Check your connection once, or use the offline pack after it has been prepared.</div>`;
        }
    }

    function renderArticleBrowser(savedOnly = false) {
        const browser = document.getElementById("reading-articles-browser");
        if (!browser) return;
        const loaded = LEVELS.flatMap(level => articleCache.get(level) || []);
        const levelPool = prefs.level === "all" ? loaded : loaded.filter(article => article.jlpt === prefs.level);
        browser.innerHTML = `
            <section class="reading-browser-hero"><span class="reading-garden-kicker">📰 2026-first · verified sources</span><h2>Article Garden</h2><p>30 source-grounded readings are ready now across 10 categories, with a 300-reading target. Sakura prioritizes 2026, then falls back by newest legally reusable year only when needed. N5–N1 labels describe Sakura’s study support—not the source’s official JLPT level.</p></section>
            <div class="reading-browser-toolbar"><input id="reading-article-search" type="search" autocomplete="off" placeholder="Search titles, topics, Japanese…" aria-label="Search Articles"><select id="reading-article-topic" aria-label="Article topic">${ARTICLE_TOPICS.map(([id,icon,label]) => `<option value="${id}"${prefs.articleTopic === id ? " selected" : ""}>${icon} ${escapeHtml(label)}</option>`).join("")}</select></div>
            <div class="reading-browser-levels" role="group">${["all",...LEVELS].map(level => `<button class="reading-garden-chip${prefs.level === level ? " active" : ""}" type="button" data-reading-level="${level}">${level === "all" ? "All Levels" : level}</button>`).join("")}</div>
            <div class="reading-browser-offline"><span id="reading-offline-status">${library.offlineArticlesReadyAt ? "✓ The current sourced Article packs are prepared for offline reading." : "Prepare the current 200 sourced readings once while online so their JSON packs are available offline."}</span><button class="reading-garden-secondary" type="button" data-reading-download-articles>${library.offlineArticlesReadyAt ? "Refresh Offline Pack" : "Download Article Pack"}</button></div>
            <div class="reading-browser-meta"><span id="reading-article-count"></span><span>${savedOnly ? "Saved only" : topicLabel(prefs.articleTopic)}</span></div><div id="reading-article-list" class="reading-article-list"></div><button id="reading-load-more" class="reading-garden-secondary reading-load-more" type="button" data-reading-load-more hidden>Show More</button>`;
        browser.dataset.savedOnly = savedOnly ? "true" : "false";
        articleVisibleCount = 30;
        currentFilteredArticles = levelPool;
        updateLevelUi();
        renderArticleResults();
    }

    function renderArticleResults() {
        const list = document.getElementById("reading-article-list");
        const count = document.getElementById("reading-article-count");
        if (!list || !count) return;
        const query = document.getElementById("reading-article-search")?.value.trim() || "";
        const topic = document.getElementById("reading-article-topic")?.value || prefs.articleTopic || "all";
        const savedOnly = document.getElementById("reading-articles-browser")?.dataset.savedOnly === "true";
        const loaded = LEVELS.flatMap(level => articleCache.get(level) || []);
        currentFilteredArticles = loaded.filter(article => (prefs.level === "all" || article.jlpt === prefs.level) && articleMatches(article, query, topic, savedOnly));
        count.textContent = `${currentFilteredArticles.length.toLocaleString()} article${currentFilteredArticles.length === 1 ? "" : "s"}`;
        if (!currentFilteredArticles.length) {
            list.innerHTML = `<div class="reading-browser-empty">🌸 No Articles match these filters.</div>`;
        } else {
            list.innerHTML = currentFilteredArticles.slice(0, articleVisibleCount).map(article => `
                <div class="reading-article-card" data-reading-open-article="${escapeHtml(article.id)}" role="button" tabindex="0" aria-label="Open ${escapeHtml(article.titleEnglish)}">
                    <div><div class="reading-article-tags"><span class="reading-article-tag">Study ${escapeHtml(article.jlpt)}</span><span class="reading-article-tag">${article.topicIcon} ${escapeHtml(article.topicLabel)}</span><span class="reading-article-tag">${escapeHtml(String(article.sourceYear))} source</span><span class="reading-article-tag">${article.estimatedMinutes} min</span>${isCompleted(article.id) ? '<span class="reading-article-tag">✓ Read</span>' : ''}</div><h3>${prefs.mode === "furigana" ? article.titleFurigana : escapeHtml(prefs.mode === "kana" ? article.titleKana : article.title)}</h3><span class="reading-en-title">${escapeHtml(article.titleEnglish)}</span><p>${escapeHtml(article.summary)}</p><small class="reading-source-inline">Source: ${escapeHtml(article.sourcePublisher)} · ${escapeHtml(article.sourceDateLabel || "Published")} ${escapeHtml(article.sourcePublishedDate)}</small></div>
                    <button class="reading-article-save${isSaved(article.id) ? " saved" : ""}" type="button" data-reading-save-article="${escapeHtml(article.id)}" aria-label="${isSaved(article.id) ? "Remove from Saved" : "Save Article"}">${isSaved(article.id) ? "♥" : "♡"}</button>
                </div>`).join("");
        }
        const more = document.getElementById("reading-load-more");
        if (more) more.hidden = articleVisibleCount >= currentFilteredArticles.length;
    }

    async function openArticleById(id) {
        let article = articleById(id);
        if (!article) {
            const levelMatch = id.match(/-(n[1-5])-/i)?.[1]?.toUpperCase();
            if (levelMatch) await loadArticleLevel(levelMatch);
            article = articleById(id);
        }
        if (!article) return;
        currentArticle = article;
        translationVisible = false;
        library.lastArticleId = article.id;
        library.lastReadingType = "article";
        library.lastReadingId = article.id;
        saveLibrary();
        setScreen("reader");
        renderArticleReader(article);
        renderLibraryStrip();
    }

    function readingText(article, field = "paragraph") {
        if (field === "title") return prefs.mode === "furigana" ? article.titleFurigana : escapeHtml(prefs.mode === "kana" ? article.titleKana : article.title);
        return paragraph => prefs.mode === "furigana" ? paragraph.furigana : escapeHtml(prefs.mode === "kana" ? paragraph.kana : paragraph.japanese);
    }

    function renderArticleReader(article) {
        const reader = document.getElementById("reading-article-reader");
        if (!reader) return;
        const question = article.comprehension?.[0];
        const displayPara = readingText(article);
        reader.innerHTML = `
            <header class="reading-reader-header"><div class="reading-reader-header-top"><div class="reading-reader-tags"><span class="reading-article-tag">Study ${escapeHtml(article.jlpt)}</span><span class="reading-article-tag">${article.topicIcon} ${escapeHtml(article.topicLabel)}</span><span class="reading-article-tag">${escapeHtml(String(article.sourceYear))} source-based</span><span class="reading-article-tag">${article.estimatedMinutes} min</span></div><button class="reading-article-save${isSaved(article.id) ? " saved" : ""}" type="button" data-reading-save-article="${escapeHtml(article.id)}">${isSaved(article.id) ? "♥" : "♡"}</button></div><h2 class="reading-reader-title">${readingText(article,"title")}</h2><p class="reading-reader-english-title">${escapeHtml(article.titleEnglish)}</p><p class="reading-level-note">${escapeHtml(article.levelNote || "")}</p><div class="reading-reader-actions"><button class="reading-garden-secondary" type="button" data-reading-hear-article>🔊 Hear Japanese</button><button class="reading-garden-secondary" type="button" data-reading-toggle-translation>${translationVisible ? "Hide Translation" : "Show Translation"}</button></div><div class="reading-reader-mode-row">${modeButtonsMarkup()}</div></header>
            <section class="reading-source-card"><div><span class="reading-source-badge">Verified source · ${escapeHtml(article.sourceDateLabel || "Published")} ${escapeHtml(article.sourcePublishedDate)}</span><h3>${escapeHtml(article.sourceTitle)}</h3><p>${escapeHtml(article.sourcePublisher)} · ${escapeHtml(article.sourceLicense)}</p></div><a href="${escapeHtml(article.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read Original ↗</a><small>${escapeHtml(article.sourceProcessing)}</small><small>${escapeHtml(article.sourceAttribution)}</small><small>${escapeHtml(article.rightsNote)}</small></section>
            <section class="reading-reader-content">${article.paragraphs.map(paragraph => `<p class="reading-reader-paragraph">${displayPara(paragraph)}</p>${translationVisible ? `<p class="reading-reader-translation">${escapeHtml(paragraph.english)}</p>` : ""}`).join("")}</section>
            <section class="reading-reader-section"><h3>🌸 Vocabulary Focus</h3><div class="reading-reader-vocab">${article.vocabularyFocus.map(word => `<div><strong>${escapeHtml(word.word)}</strong><span>${escapeHtml(word.kana)}</span><span>${escapeHtml(word.meaning)}</span></div>`).join("")}</div></section>
            <section class="reading-reader-section"><h3>文 Grammar in this reading</h3><div class="reading-reader-grammar">${article.grammarFocus.map(grammar => `<span class="reading-article-tag">${escapeHtml(grammar)}</span>`).join("")}</div></section>
            ${question ? `<section class="reading-reader-section"><h3>🧠 Check My Understanding</h3><div class="reading-reader-question">${prefs.mode === "furigana" ? question.questionFurigana : escapeHtml(prefs.mode === "kana" ? question.questionKana : question.questionJapanese)}</div><div class="reading-reader-choices">${question.choices.map((choice,index) => `<button class="reading-reader-choice" type="button" data-reading-answer="${index}">${prefs.mode === "furigana" ? choice.furigana : escapeHtml(prefs.mode === "kana" ? choice.kana : choice.japanese)}</button>`).join("")}</div><div id="reading-answer-explanation" class="reading-reader-explanation" hidden></div></section>` : ""}
            <div class="reading-reader-footer"><button class="reading-garden-secondary" type="button" data-reading-prev-article>‹ Previous</button><button class="reading-garden-secondary" type="button" data-reading-next-article>Next ›</button><button class="reading-garden-primary reading-reader-complete${isCompleted(article.id) ? " done" : ""}" type="button" data-reading-complete>${isCompleted(article.id) ? "✓ Reading Complete" : "Mark Reading Complete"}</button></div>`;
    }

    function toggleSaved(id) {
        if (!id) return;
        library.saved = isSaved(id) ? library.saved.filter(item => item !== id) : [...library.saved,id];
        saveLibrary();
        renderLibraryStrip();
        if (currentScreen === "articles") renderArticleResults();
        if (currentScreen === "reader" && currentArticle?.id === id) renderArticleReader(currentArticle);
        if (currentScreen === "stories") renderStoryResults();
        if (currentScreen === "story-reader" && currentStory?.id === id) renderStoryReader(currentStory);
    }

    function markComplete() {
        const item = currentScreen === "story-reader" ? currentStory : currentArticle;
        if (!item) return;
        if (!isCompleted(item.id)) library.completed = [...library.completed,item.id];
        saveLibrary();
        renderLibraryStrip();
        if (currentScreen === "story-reader") renderStoryReader(item); else renderArticleReader(item);
    }

    function answerQuestion(index) {
        if (!currentArticle?.comprehension?.[0]) return;
        const q = currentArticle.comprehension[0];
        document.querySelectorAll("#reading-article-reader [data-reading-answer]").forEach(button => {
            const choice = Number(button.dataset.readingAnswer);
            button.disabled = true;
            if (choice === q.answerIndex) button.classList.add("correct");
            else if (choice === index) button.classList.add("wrong");
        });
        const box = document.getElementById("reading-answer-explanation");
        if (box) { box.hidden = false; box.textContent = index === q.answerIndex ? `✓ Correct. ${q.explanation}` : `Not quite. ${q.explanation}`; }
    }

    function moveArticle(direction) {
        if (!currentArticle) return;
        const index = currentFilteredArticles.findIndex(article => article.id === currentArticle.id);
        const pool = currentFilteredArticles.length ? currentFilteredArticles : LEVELS.flatMap(level => articleCache.get(level) || []);
        const resolved = index >= 0 ? index : pool.findIndex(article => article.id === currentArticle.id);
        if (!pool.length || resolved < 0) return;
        const nextIndex = Math.max(0, Math.min(pool.length - 1, resolved + direction));
        if (nextIndex !== resolved) openArticleById(pool[nextIndex].id);
    }

    function speakArticle() {
        if (!currentArticle) return;
        const text = currentArticle.paragraphs.map(p => p.japanese).join("\n");
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ja-JP";
        utterance.rate = .9;
        const voices = window.speechSynthesis.getVoices();
        const japanese = voices.find(voice => /^ja(-|_)/i.test(voice.lang));
        if (japanese) utterance.voice = japanese;
        window.speechSynthesis.speak(utterance);
    }

    async function downloadArticlePack(button) {
        const status = document.getElementById("reading-offline-status");
        if (button) { button.disabled = true; button.textContent = "Preparing…"; }
        if (status) status.textContent = "Preparing the current sourced Article packs for offline reading…";
        try {
            if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
            const articleRequests = LEVELS.flatMap(level => ARTICLE_FILES[level].map(url => fetch(url)));
            await Promise.all([fetch(ARTICLE_MANIFEST), ...articleRequests].map(async promise => {
                const response = await promise;
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                await response.clone().arrayBuffer();
            }));
            library.offlineArticlesReadyAt = new Date().toISOString();
            saveLibrary();
            if (status) status.textContent = "✓ The current 200 sourced Articles are prepared for offline reading on this device.";
            if (button) button.textContent = "Refresh Offline Pack";
            renderLibraryStrip();
        } catch (error) {
            console.warn("Reading Garden: Article offline pack could not be prepared.", error);
            if (status) status.textContent = "The offline pack could not be completed. Your already cached Articles were kept.";
            if (button) button.textContent = "Retry Download";
        } finally { if (button) button.disabled = false; }
    }

    async function surpriseArticle() {
        try {
            const records = await loadArticleLevels(prefs.level);
            const article = records[Math.floor(Math.random() * records.length)];
            if (article) { currentFilteredArticles = records; openArticleById(article.id); }
        } catch (error) { console.warn("Reading Garden: Surprise Article failed.", error); }
    }

    async function loadStories() {
        if (storyRecords) return storyRecords;
        if (storyInFlight) return storyInFlight;
        storyInFlight = (async () => {
            const entries = Object.entries(STORY_FILES);
            const groups = await Promise.all(entries.map(async ([category,file]) => {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`Could not load ${storyCategoryLabel(category)} (HTTP ${response.status}).`);
                const records = await response.json();
                if (!Array.isArray(records) || !records.length) throw new Error(`${storyCategoryLabel(category)} must contain sourced story records.`);
                const invalid = records.find(record => record?.type !== "short-story" || record?.provenance !== "public-domain-original" || record?.category !== category || record?.sourcePublisher !== "青空文庫" || record?.aiGeneratedStoryText !== false || record?.fullTextBundled !== false || !record?.sourceUrl || !record?.sourceCardUrl || !record?.sourceTermsUrl || !record?.originalExcerpt);
                if (invalid) throw new Error(`${storyCategoryLabel(category)} contains an invalid or unsourced record: ${invalid?.id || "unknown"}.`);
                return records;
            }));
            const records = groups.flat();
            const ids = new Set(records.map(record => record.id));
            if (records.length !== 100 || ids.size !== records.length) throw new Error("Short Stories must contain exactly 100 unique sourced records in this release.");
            storyRecords = records;
            return records;
        })().finally(() => { storyInFlight = null; });
        return storyInFlight;
    }
    async function loadStoryManifest() {
        if (storyManifest) return storyManifest;
        if (storyManifestInFlight) return storyManifestInFlight;
        storyManifestInFlight = fetch(STORY_MANIFEST).then(async response => {
            if (!response.ok) throw new Error(`Could not load Short Stories manifest (HTTP ${response.status}).`);
            const data = await response.json();
            const manifestCategories = new Set((data?.categories || []).map(item => item.id));
            const expectedCategories = Object.keys(STORY_FILES);
            if (data?.material !== "short-stories" || data?.mode !== "public-domain-original-excerpts" || data?.readyCount !== 100 || expectedCategories.some(id => !manifestCategories.has(id))) throw new Error("Short Stories manifest is invalid.");
            storyManifest = data;
            return data;
        }).finally(() => { storyManifestInFlight = null; });
        return storyManifestInFlight;
    }
    function storyMatches(story, query, category, savedOnly) {
        if (category !== "all" && story.category !== category) return false;
        if (savedOnly && !isSaved(story.id)) return false;
        if (prefs.level !== "all" && story.studyDifficulty !== prefs.level) return false;
        if (!query) return true;
        const haystack = `${story.title} ${story.titleKana} ${story.author} ${story.authorKana} ${story.tags?.join(" ") || ""}`.toLowerCase();
        return haystack.includes(query.toLowerCase());
    }
    async function openStories(options = {}) {
        prefs.material = "short-stories";
        if (options.category) prefs.storyCategory = options.category;
        savePrefs();
        setScreen("stories");
        const browser = document.getElementById("reading-stories-browser");
        if (browser) browser.innerHTML = `<div class="reading-status"><strong>Opening Short Stories…</strong>Loading the small public-domain source packs.</div>`;
        try { await Promise.all([loadStories(),loadStoryManifest()]); renderStoryBrowser(Boolean(options.savedOnly)); }
        catch (error) {
            console.warn("Reading Garden: Short Stories could not load.", error);
            if (browser) browser.innerHTML = `<div class="reading-status"><strong>Short Stories could not be loaded.</strong>Check your connection once, or retry after preparing the offline Stories Pack.</div>`;
        }
    }
    function renderStoryBrowser(savedOnly = false) {
        const browser = document.getElementById("reading-stories-browser");
        if (!browser || !storyRecords) return;
        browser.innerHTML = `
            <section class="reading-browser-hero"><span class="reading-garden-kicker">📚 Real Japanese fiction · source-first</span><h2>Short Stories</h2><p>100 real Japanese works are ready across six shelves: Classics, Modern Literature, Mystery & Suspense, Strange / Horror, Children’s Stories, and Human & Relationships. Sakura preserves a short original Aozora Bunko excerpt and links to the full work. Actual first-publication or source-edition years are shown when known.</p></section>
            <div class="reading-browser-toolbar"><input id="reading-story-search" type="search" autocomplete="off" placeholder="Search title, author, category…" aria-label="Search Short Stories"><select id="reading-story-category" aria-label="Story category">${STORY_CATEGORIES.map(([id,icon,label]) => `<option value="${id}"${prefs.storyCategory === id ? " selected" : ""}>${icon} ${escapeHtml(label)}</option>`).join("")}</select></div>
            <div class="reading-browser-levels" role="group">${["all",...LEVELS].map(level => `<button class="reading-garden-chip${prefs.level === level ? " active" : ""}" type="button" data-reading-level="${level}">${level === "all" ? "All Difficulties" : `Approx ${level}`}</button>`).join("")}</div>
            <div class="reading-browser-offline"><span id="reading-story-offline-status">${library.offlineStoriesReadyAt ? "✓ The current Short Stories source packs are prepared for offline excerpt reading." : "Prepare the small Stories packs once while online. Full original works still open on Aozora Bunko."}</span><button class="reading-garden-secondary" type="button" data-reading-download-stories>${library.offlineStoriesReadyAt ? "Refresh Offline Pack" : "Download Stories Pack"}</button></div>
            <div class="reading-browser-meta"><span id="reading-story-count"></span><span>${savedOnly ? "Saved only" : escapeHtml(storyCategoryLabel(prefs.storyCategory))}</span></div><div id="reading-story-list" class="reading-article-list"></div><button id="reading-story-load-more" class="reading-garden-secondary reading-load-more" type="button" data-reading-load-more-stories hidden>Show More</button>`;
        browser.dataset.savedOnly = savedOnly ? "true" : "false";
        storyVisibleCount = 24;
        updateLevelUi();
        renderStoryResults();
    }
    function renderStoryResults() {
        const list = document.getElementById("reading-story-list");
        const count = document.getElementById("reading-story-count");
        if (!list || !count || !storyRecords) return;
        const query = document.getElementById("reading-story-search")?.value.trim() || "";
        const category = document.getElementById("reading-story-category")?.value || prefs.storyCategory || "all";
        const savedOnly = document.getElementById("reading-stories-browser")?.dataset.savedOnly === "true";
        currentFilteredStories = storyRecords.filter(story => storyMatches(story, query, category, savedOnly));
        count.textContent = `${currentFilteredStories.length.toLocaleString()} stor${currentFilteredStories.length === 1 ? "y" : "ies"}`;
        if (!currentFilteredStories.length) list.innerHTML = `<div class="reading-browser-empty">🌸 No Short Stories match these filters.</div>`;
        else list.innerHTML = currentFilteredStories.slice(0, storyVisibleCount).map(story => {
            const year = story.sourceYear ? String(story.sourceYear) : "Year not listed";
            const categoryIcon = story.categoryIcon || STORY_CATEGORIES.find(row => row[0] === story.category)?.[1] || "📚";
            const categoryLabel = story.categoryLabel || storyCategoryLabel(story.category);
            return `
            <div class="reading-article-card" data-reading-open-story="${escapeHtml(story.id)}" role="button" tabindex="0" aria-label="Open ${escapeHtml(story.title)}">
                <div><div class="reading-article-tags"><span class="reading-article-tag">Approx ${escapeHtml(story.studyDifficulty)}</span><span class="reading-article-tag">${categoryIcon} ${escapeHtml(categoryLabel)}</span><span class="reading-article-tag">${escapeHtml(year)}</span><span class="reading-article-tag">Original text</span>${isCompleted(story.id) ? '<span class="reading-article-tag">✓ Read</span>' : ''}</div><h3>${escapeHtml(story.title)}</h3><span class="reading-en-title">${escapeHtml(story.titleKana)} · ${escapeHtml(story.author)}</span><p>${escapeHtml(story.originalExcerpt)}</p><small class="reading-source-inline">Source: 青空文庫 · ${escapeHtml(year)} · copyright-expired work</small></div>
                <button class="reading-article-save${isSaved(story.id) ? " saved" : ""}" type="button" data-reading-save-story="${escapeHtml(story.id)}" aria-label="${isSaved(story.id) ? "Remove from Saved" : "Save Story"}">${isSaved(story.id) ? "♥" : "♡"}</button>
            </div>`;
        }).join("");
        const more = document.getElementById("reading-story-load-more");
        if (more) more.hidden = storyVisibleCount >= currentFilteredStories.length;
    }
    async function openStoryById(id) {
        await loadStories();
        const story = storyById(id);
        if (!story) return;
        currentStory = story;
        library.lastStoryId = story.id;
        library.lastReadingType = "story";
        library.lastReadingId = story.id;
        saveLibrary();
        setScreen("story-reader");
        renderStoryReader(story);
        renderLibraryStrip();
    }
    function renderStoryReader(story) {
        const reader = document.getElementById("reading-story-reader");
        if (!reader) return;
        const categoryIcon = story.categoryIcon || STORY_CATEGORIES.find(row => row[0] === story.category)?.[1] || "📚";
        const categoryLabel = story.categoryLabel || storyCategoryLabel(story.category);
        const publicationLabel = story.firstPublication || story.sourceEdition || (story.sourceYear ? String(story.sourceYear) : "");
        const published = publicationLabel ? `<span class="reading-article-tag">${escapeHtml(publicationLabel)}</span>` : "";
        reader.innerHTML = `
            <header class="reading-reader-header"><div class="reading-reader-header-top"><div class="reading-reader-tags"><span class="reading-article-tag">Approx ${escapeHtml(story.studyDifficulty)}</span><span class="reading-article-tag">${categoryIcon} ${escapeHtml(categoryLabel)}</span><span class="reading-article-tag">Original Japanese</span>${published}</div><button class="reading-article-save${isSaved(story.id) ? " saved" : ""}" type="button" data-reading-save-story="${escapeHtml(story.id)}">${isSaved(story.id) ? "♥" : "♡"}</button></div><h2 class="reading-reader-title">${escapeHtml(story.title)}</h2><p class="reading-reader-english-title">${escapeHtml(story.titleKana)} · ${escapeHtml(story.author)}（${escapeHtml(story.authorKana)}）</p><p class="reading-level-note">Native literature is not JLPT-graded. “Approx ${escapeHtml(story.studyDifficulty)}” is Sakura’s study-support estimate only. The displayed year is the first-publication year when known, otherwise the source-edition year.</p><div class="reading-reader-actions"><button class="reading-garden-secondary" type="button" data-reading-hear-story>🔊 Hear Original</button></div></header>
            <section class="reading-source-card"><div><span class="reading-source-badge">Public-domain original · 青空文庫</span><h3>${escapeHtml(story.title)} — ${escapeHtml(story.author)}</h3><p>${escapeHtml(story.sourceRights)}</p></div><a href="${escapeHtml(story.sourceUrl)}" target="_blank" rel="noopener noreferrer">Read Full Original ↗</a><small>${escapeHtml(story.sourceProcessing)}</small><small>${escapeHtml(story.sourceAttribution)}</small><small>${escapeHtml(story.rightsNote)}</small></section>
            <section class="reading-reader-section"><h3>📖 Original excerpt</h3><p class="reading-level-note">This is the original Aozora Bunko Japanese text, not a Sakura rewrite.</p></section>
            <section class="reading-reader-content"><p class="reading-reader-paragraph">${escapeHtml(story.originalExcerpt)}</p></section>
            <section class="reading-reader-section"><h3>Source & rights</h3><div class="reading-reader-vocab"><div><strong>Source</strong><span>${escapeHtml(story.sourcePublisher)}</span><span>Retrieved ${escapeHtml(story.sourceRetrievedDate)}</span></div><div><strong>Full text</strong><span>Not bundled</span><span>Opens the original Aozora Bunko file</span></div><div><strong>Story text</strong><span>AI-generated: No</span><span>Verbatim public-domain excerpt</span></div></div><div class="reading-reader-actions"><a class="reading-garden-secondary" href="${escapeHtml(story.sourceCardUrl)}" target="_blank" rel="noopener noreferrer">Aozora Work Card ↗</a><a class="reading-garden-secondary" href="${escapeHtml(story.sourceTermsUrl)}" target="_blank" rel="noopener noreferrer">File Handling Standard ↗</a></div></section>
            <div class="reading-reader-footer"><button class="reading-garden-secondary" type="button" data-reading-prev-story>‹ Previous</button><button class="reading-garden-secondary" type="button" data-reading-next-story>Next ›</button><button class="reading-garden-primary reading-reader-complete${isCompleted(story.id) ? " done" : ""}" type="button" data-reading-complete>${isCompleted(story.id) ? "✓ Reading Complete" : "Mark Reading Complete"}</button></div>`;
    }
    function moveStory(direction) {
        if (!currentStory) return;
        const pool = currentFilteredStories.length ? currentFilteredStories : (storyRecords || []);
        const index = pool.findIndex(item => item.id === currentStory.id);
        if (!pool.length || index < 0) return;
        const nextIndex = Math.max(0, Math.min(pool.length - 1, index + direction));
        if (nextIndex !== index) openStoryById(pool[nextIndex].id).catch(error => console.warn("Reading Garden: Story navigation failed.", error));
    }
    function speakStory() {
        if (!currentStory || !("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentStory.originalExcerpt);
        utterance.lang = "ja-JP"; utterance.rate = .82;
        const japanese = window.speechSynthesis.getVoices().find(voice => /^ja(-|_)/i.test(voice.lang));
        if (japanese) utterance.voice = japanese;
        window.speechSynthesis.speak(utterance);
    }
    async function downloadStoryPack(button) {
        const status = document.getElementById("reading-story-offline-status");
        if (button) { button.disabled = true; button.textContent = "Preparing…"; }
        try {
            if ("serviceWorker" in navigator) await navigator.serviceWorker.ready;
            const responses = await Promise.all([fetch(STORY_MANIFEST), ...Object.values(STORY_FILES).map(file => fetch(file))]);
            for (const response of responses) {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                await response.clone().arrayBuffer();
            }
            library.offlineStoriesReadyAt = new Date().toISOString();
            saveLibrary();
            if (status) status.textContent = "✓ The current 100 Short Stories excerpts are prepared for offline reading. Full original links still need internet access.";
            if (button) button.textContent = "Refresh Offline Pack";
            renderLibraryStrip();
        } catch (error) {
            console.warn("Reading Garden: Stories offline pack could not be prepared.", error);
            if (status) status.textContent = "The Stories Pack could not be completed. Already cached data was kept.";
            if (button) button.textContent = "Retry Download";
        } finally { if (button) button.disabled = false; }
    }
    async function surpriseStory() {
        try {
            const records = await loadStories();
            const pool = records.filter(item => prefs.level === "all" || item.studyDifficulty === prefs.level);
            const story = pool[Math.floor(Math.random() * pool.length)];
            if (story) { currentFilteredStories = pool; await openStoryById(story.id); }
        } catch (error) { console.warn("Reading Garden: Surprise Story failed.", error); }
    }

    function open() {
        const dialog = createDialog();
        setScreen("home");
        updateLevelUi(); updateModeUi(); updateMaterialSelection(); renderLibraryStrip();
        document.documentElement.classList.add("reading-garden-open");
        if (typeof dialog.showModal === "function") { if (!dialog.open) dialog.showModal(); }
        else dialog.setAttribute("open","");
        requestAnimationFrame(() => dialog.querySelector("[data-reading-back]")?.focus({ preventScroll:true }));
    }
    function close() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        window.speechSynthesis?.cancel?.();
        document.documentElement.classList.remove("reading-garden-open");
        if (typeof dialog.close === "function" && dialog.open) dialog.close(); else dialog.removeAttribute("open");
        document.querySelector("[data-open-reading-garden]")?.focus({ preventScroll:true });
    }
    function goBack() {
        if (currentScreen === "reader") { setScreen("articles"); if (!document.getElementById("reading-article-list")?.children.length) renderArticleBrowser(false); return; }
        if (currentScreen === "story-reader") { setScreen("stories"); if (!document.getElementById("reading-story-list")?.children.length) renderStoryBrowser(false); return; }
        if (currentScreen === "articles" || currentScreen === "stories") { setScreen("home"); renderLibraryStrip(); return; }
        close();
    }

    function bindEvents() {
        let browserRenderFrame = 0;
        document.addEventListener("click", event => {
            if (event.target.closest("[data-open-reading-garden]")) { open(); return; }
            if (event.target.closest("[data-reading-close]")) { close(); return; }
            if (event.target.closest("[data-reading-back]")) { goBack(); return; }
            const levelButton = event.target.closest("[data-reading-level]");
            if (levelButton) {
                prefs.level = levelButton.dataset.readingLevel || "all"; savePrefs(); updateLevelUi();
                if (currentScreen === "articles") openArticles({ savedOnly:document.getElementById("reading-articles-browser")?.dataset.savedOnly === "true" });
                if (currentScreen === "stories") renderStoryResults();
                return;
            }
            const modeButton = event.target.closest("[data-reading-mode]");
            if (modeButton) { prefs.mode = modeButton.dataset.readingMode || "furigana"; savePrefs(); updateModeUi(); if (currentScreen === "articles") renderArticleResults(); return; }
            const materialButton = event.target.closest("[data-reading-material]");
            if (materialButton) { prefs.material = materialButton.dataset.readingMaterial || "articles"; savePrefs(); updateMaterialSelection(); return; }
            if (event.target.closest("[data-reading-browse-articles]")) { openArticles(); return; }
            if (event.target.closest("[data-reading-browse-stories]")) { openStories(); return; }
            if (event.target.closest("[data-reading-surprise-article]")) { surpriseArticle(); return; }
            if (event.target.closest("[data-reading-surprise-story]")) { surpriseStory(); return; }
            if (event.target.closest("[data-reading-open-saved]")) { if (prefs.material === "short-stories") openStories({ savedOnly:true }); else openArticles({ savedOnly:true }); return; }
            if (event.target.closest("[data-reading-continue]")) {
                const id = library.lastReadingId || library.lastArticleId || library.lastStoryId;
                if (!id) return;
                if (library.lastReadingType === "story" || id.startsWith("classic-") || id.startsWith("story-") || id.startsWith("aozora-")) openStoryById(id).catch(error => console.warn("Reading Garden: Could not continue Story.", error));
                else openArticleById(id);
                return;
            }
            const save = event.target.closest("[data-reading-save-article]");
            if (save) { event.stopPropagation(); toggleSaved(save.dataset.readingSaveArticle); return; }
            const card = event.target.closest("[data-reading-open-article]");
            if (card) { openArticleById(card.dataset.readingOpenArticle); return; }
            const storySave = event.target.closest("[data-reading-save-story]");
            if (storySave) { event.stopPropagation(); toggleSaved(storySave.dataset.readingSaveStory); return; }
            const storyCard = event.target.closest("[data-reading-open-story]");
            if (storyCard) { openStoryById(storyCard.dataset.readingOpenStory).catch(error => console.warn("Reading Garden: Story could not open.", error)); return; }
            if (event.target.closest("[data-reading-load-more]")) { articleVisibleCount += 30; renderArticleResults(); return; }
            if (event.target.closest("[data-reading-load-more-stories]")) { storyVisibleCount += 24; renderStoryResults(); return; }
            const offline = event.target.closest("[data-reading-download-articles]");
            if (offline) { downloadArticlePack(offline); return; }
            const storyOffline = event.target.closest("[data-reading-download-stories]");
            if (storyOffline) { downloadStoryPack(storyOffline); return; }
            if (event.target.closest("[data-reading-toggle-translation]")) { translationVisible = !translationVisible; renderArticleReader(currentArticle); return; }
            if (event.target.closest("[data-reading-hear-article]")) { speakArticle(); return; }
            if (event.target.closest("[data-reading-hear-story]")) { speakStory(); return; }
            const answer = event.target.closest("[data-reading-answer]");
            if (answer) { answerQuestion(Number(answer.dataset.readingAnswer)); return; }
            if (event.target.closest("[data-reading-complete]")) { markComplete(); return; }
            if (event.target.closest("[data-reading-prev-article]")) { moveArticle(-1); return; }
            if (event.target.closest("[data-reading-next-article]")) { moveArticle(1); return; }
            if (event.target.closest("[data-reading-prev-story]")) { moveStory(-1); return; }
            if (event.target.closest("[data-reading-next-story]")) { moveStory(1); return; }
            if (event.target?.id === "reading-garden-dialog") close();
        });
        document.addEventListener("input", event => {
            if (!["reading-article-search","reading-story-search"].includes(event.target?.id)) return;
            if (browserRenderFrame) cancelAnimationFrame(browserRenderFrame);
            browserRenderFrame = requestAnimationFrame(() => {
                browserRenderFrame = 0;
                if (event.target.id === "reading-article-search") { articleVisibleCount = 30; renderArticleResults(); }
                else { storyVisibleCount = 24; renderStoryResults(); }
            });
        });
        document.addEventListener("change", event => {
            if (event.target?.id === "reading-article-topic") { prefs.articleTopic = event.target.value || "all"; savePrefs(); articleVisibleCount = 30; renderArticleResults(); }
            if (event.target?.id === "reading-story-category") { prefs.storyCategory = event.target.value || "all"; savePrefs(); storyVisibleCount = 24; renderStoryResults(); }
        });
        document.addEventListener("keydown", event => {
            const card = event.target.closest?.("[data-reading-open-article]");
            if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openArticleById(card.dataset.readingOpenArticle); return; }
            const storyCard = event.target.closest?.("[data-reading-open-story]");
            if (storyCard && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openStoryById(storyCard.dataset.readingOpenStory).catch(error => console.warn("Reading Garden: Story could not open.", error)); }
        });
        document.addEventListener("cancel", event => { if (event.target?.id === "reading-garden-dialog") { event.preventDefault(); goBack(); } });
    }

    function init() {
        ensureStyles(); injectPracticeCard(); createDialog(); updateLevelUi(); updateModeUi(); updateMaterialSelection(); renderLibraryStrip();
    }
    bindEvents(); init();

    window.SakuraReadingGarden = Object.freeze({ open, close, materials:MATERIALS, totalTarget:TOTAL_TARGET, articleFiles:ARTICLE_FILES, storyFiles:STORY_FILES, loadArticleLevel, loadArticleLevels, loadStories, refresh:init });
}());
