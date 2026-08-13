/* =====================================================
   Sakura Reading Garden — UI shell v1
   Lightweight Practice-tab reading library interface.
   Content packs are intentionally not bundled here yet.
===================================================== */
(function initializeSakuraReadingGarden() {
    if (window.SakuraReadingGarden) return;

    const STORAGE_KEY = "sakuraReadingGardenPrefsV1";
    const MATERIALS = Object.freeze([
        { id:"manga", icon:"🎀", title:"Manga", count:120, unit:"chapters", description:"Legitimate published manga only after redistribution and educational-use rights are verified.", status:"Licensing first", accent:"rose" },
        { id:"articles", icon:"📰", title:"Articles", count:300, unit:"articles", description:"Culture, food, travel, daily life, entertainment, technology, hobbies, and more.", status:"Planned", accent:"pink" },
        { id:"short-stories", icon:"📚", title:"Short Stories", count:250, unit:"stories", description:"Romance, mystery, horror, comedy, fantasy, slice of life, travel, and drama.", status:"Planned", accent:"lavender" },
        { id:"news", icon:"🌏", title:"News", count:300, unit:"pieces", description:"News-style Japanese from easy to advanced, including the same topic rewritten across JLPT levels.", status:"Planned", accent:"blue" },
        { id:"conversations", icon:"💬", title:"Conversations", count:250, unit:"dialogues", description:"Realistic conversations with friends, staff, coworkers, couples, strangers, and service workers.", status:"Planned", accent:"peach" },
        { id:"diaries", icon:"📔", title:"Diary Entries", count:150, unit:"entries", description:"Personal journals, daily routines, thoughts, feelings, plans, and ordinary life in natural Japanese.", status:"Planned", accent:"pink" },
        { id:"texts", icon:"📱", title:"Texts & Chats", count:150, unit:"chats", description:"LINE-style messages, group chats, casual texting, abbreviations, slang, and omitted particles.", status:"Planned", accent:"lavender" },
        { id:"travel", icon:"✈️", title:"Travel Reading", count:200, unit:"readings", description:"Stations, hotels, restaurants, airports, attractions, bookings, announcements, and travel situations.", status:"Planned", accent:"blue" },
        { id:"folklore", icon:"👹", title:"Folktales & Legends", count:100, unit:"readings", description:"Japanese folklore, legends, yōkai, ghost tales, and carefully adapted traditional material.", status:"Planned", accent:"rose" },
        { id:"essays", icon:"✍️", title:"Essays & Opinions", count:150, unit:"essays", description:"Reflections, viewpoints, arguments, and more advanced reading for the N3–N1 transition.", status:"Planned", accent:"peach" },
        { id:"letters", icon:"💌", title:"Letters & Emails", count:120, unit:"items", description:"Friendly notes, invitations, thank-you messages, formal email, and workplace correspondence.", status:"Planned", accent:"pink" },
        { id:"school-work", icon:"🏫", title:"School & Work", count:120, unit:"items", description:"Notices, schedules, memos, classroom information, workplace messages, and internal announcements.", status:"Planned", accent:"lavender" },
        { id:"reviews", icon:"⭐", title:"Reviews", count:100, unit:"reviews", description:"Restaurants, hotels, games, anime, products, attractions, and everyday recommendation language.", status:"Planned", accent:"peach" },
        { id:"recipes", icon:"🍳", title:"Recipes & How-To", count:100, unit:"guides", description:"Recipes, tutorials, instructions, hobby guides, and practical step-by-step Japanese.", status:"Planned", accent:"rose" },
        { id:"interviews", icon:"🎤", title:"Interviews & Q&A", count:100, unit:"interviews", description:"Student, workplace, hobby, creator, and celebrity-style interviews with natural question patterns.", status:"Planned", accent:"blue" },
        { id:"documents", icon:"🚉", title:"Real-Life Documents", count:200, unit:"items", description:"Signs, menus, tickets, forms, posters, warnings, labels, receipts, machines, and public notices.", status:"Planned", accent:"pink" },
        { id:"novels", icon:"📕", title:"Serialized Novels", count:80, unit:"chapters", description:"Longer continuing stories with saved progress, chapter history, vocabulary help, and comprehension.", status:"Planned", accent:"lavender" },
        { id:"micro", icon:"🌙", title:"Poetry & Micro Reads", count:100, unit:"reads", description:"Original poems, tiny scenes, short reflections, captions, and micro-fiction for quick reading practice.", status:"Planned", accent:"rose" }
    ]);

    const TOTAL_TARGET = MATERIALS.reduce((total, item) => total + item.count, 0);
    const DEFAULT_PREFS = Object.freeze({ level:"all", mode:"furigana", material:"articles" });

    function readPrefs() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
            return { ...DEFAULT_PREFS, ...(saved && typeof saved === "object" ? saved : {}) };
        }
        catch (error) {
            console.warn("Reading Garden: saved preferences could not be read.", error);
            return { ...DEFAULT_PREFS };
        }
    }

    let prefs = readPrefs();

    function savePrefs() {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); }
        catch (error) { console.warn("Reading Garden: preferences could not be saved.", error); }
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function ensureStyles() {
        if (document.getElementById("sakura-reading-garden-styles")) return;
        const style = document.createElement("style");
        style.id = "sakura-reading-garden-styles";
        style.textContent = `
            .reading-garden-entry-card{position:relative;overflow:hidden;border-color:color-mix(in srgb,var(--color-primary) 28%,var(--color-border))!important;background:linear-gradient(145deg,color-mix(in srgb,var(--color-primary-soft) 78%,var(--color-surface)),var(--color-surface))!important}
            .reading-garden-entry-card::after{content:"NEW";position:absolute;top:9px;right:34px;padding:3px 6px;border-radius:999px;background:var(--color-primary);color:white;font-size:7px;font-weight:900;letter-spacing:.05em}
            .reading-garden-dialog{width:min(720px,100%);height:min(94dvh,920px);max-width:none;max-height:none;margin:auto 0 0;padding:0;border:0;border-radius:24px 24px 0 0;background:var(--color-background);color:var(--color-text);box-shadow:0 -16px 50px rgba(36,28,34,.18);overflow:hidden}
            .reading-garden-dialog::backdrop{background:rgba(35,28,33,.34);backdrop-filter:blur(2px)}
            .reading-garden-shell{height:100%;display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden}
            .reading-garden-topbar{display:grid;grid-template-columns:42px minmax(0,1fr) 42px;gap:8px;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 14px 10px;border-bottom:1px solid var(--color-border);background:color-mix(in srgb,var(--color-surface) 95%,var(--color-primary-soft));z-index:3}
            .reading-garden-topbar button{width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);color:var(--color-text);font-size:21px}
            .reading-garden-title{text-align:center;min-width:0}.reading-garden-title span{display:block;color:var(--color-primary-dark);font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.reading-garden-title strong{display:block;margin-top:2px;font-size:15px}
            .reading-garden-body{overflow:auto;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;padding:14px 14px calc(32px + env(safe-area-inset-bottom))}
            .reading-garden-hero{position:relative;overflow:hidden;padding:18px;border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border));border-radius:21px;background:linear-gradient(145deg,color-mix(in srgb,var(--color-primary-soft) 80%,var(--color-surface)),var(--color-surface))}
            .reading-garden-hero::after{content:"🌸";position:absolute;right:-4px;bottom:-18px;font-size:80px;opacity:.1;transform:rotate(-12deg)}
            .reading-garden-hero h2{position:relative;margin:4px 0 6px;font-size:22px}.reading-garden-hero p{position:relative;max-width:560px;margin:0;color:var(--color-text-muted);font-size:10px;line-height:1.6}.reading-garden-kicker{position:relative;color:var(--color-primary-dark);font-size:8px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
            .reading-garden-stats{position:relative;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:14px}.reading-garden-stat{min-width:0;padding:9px;border:1px solid color-mix(in srgb,var(--color-primary) 16%,var(--color-border));border-radius:13px;background:color-mix(in srgb,var(--color-surface) 92%,transparent)}.reading-garden-stat strong{display:block;color:var(--color-primary-dark);font-size:14px}.reading-garden-stat small{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px;line-height:1.3}
            .reading-garden-section{margin-top:18px}.reading-garden-section-heading{display:flex;align-items:end;justify-content:space-between;gap:12px;margin-bottom:9px}.reading-garden-section-heading h3{margin:2px 0 0;font-size:14px}.reading-garden-section-heading p{margin:0;color:var(--color-text-muted);font-size:8px;line-height:1.4}.reading-garden-section-heading>span{color:var(--color-text-muted);font-size:8px;white-space:nowrap}
            .reading-garden-levels,.reading-garden-modes,.reading-garden-lengths{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.reading-garden-levels::-webkit-scrollbar,.reading-garden-modes::-webkit-scrollbar,.reading-garden-lengths::-webkit-scrollbar{display:none}
            .reading-garden-chip{flex:0 0 auto;min-height:36px;padding:8px 12px;border:1px solid var(--color-border);border-radius:999px;background:var(--color-surface);color:var(--color-text);font-size:9px;font-weight:800}.reading-garden-chip.active{border-color:var(--color-primary);background:var(--color-primary-soft);color:var(--color-primary-dark);box-shadow:0 0 0 1px color-mix(in srgb,var(--color-primary) 16%,transparent)}
            .reading-garden-reader-options{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:10px}.reading-garden-preview,.reading-garden-mode-card{min-width:0;padding:13px;border:1px solid var(--color-border);border-radius:17px;background:var(--color-surface)}.reading-garden-preview>span,.reading-garden-mode-card>span{display:block;color:var(--color-primary-dark);font-size:8px;font-weight:900}.reading-garden-preview p{margin:10px 0 4px;font-size:16px;line-height:2.05}.reading-garden-preview ruby rt{font-size:.52em;color:var(--color-primary-dark)}.reading-garden-preview small{color:var(--color-text-muted);font-size:8px;line-height:1.4}.reading-garden-mode-card strong{display:block;margin:5px 0 4px;font-size:11px}.reading-garden-mode-card p{margin:0;color:var(--color-text-muted);font-size:8px;line-height:1.5}
            .reading-garden-material-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.reading-material-card{min-width:0;padding:11px;display:grid;grid-template-columns:35px minmax(0,1fr);grid-template-areas:"icon main" "meta meta";gap:8px;border:1px solid var(--color-border);border-radius:16px;background:var(--color-surface);color:var(--color-text);text-align:left}.reading-material-card.active{border-color:var(--color-primary);background:color-mix(in srgb,var(--color-primary-soft) 58%,var(--color-surface));box-shadow:0 0 0 1px color-mix(in srgb,var(--color-primary) 13%,transparent)}.reading-material-icon{grid-area:icon;display:grid;place-items:center;width:35px;height:35px;border-radius:11px;background:var(--color-primary-soft);font-size:17px}.reading-material-main{grid-area:main;min-width:0}.reading-material-main strong{display:block;font-size:10px;line-height:1.25}.reading-material-main small{display:block;margin-top:3px;color:var(--color-text-muted);font-size:8px}.reading-material-meta{grid-area:meta;display:flex;align-items:center;justify-content:space-between;gap:6px;padding-top:2px}.reading-material-meta span{color:var(--color-text-muted);font-size:7px}.reading-material-status{width:max-content;padding:3px 6px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark)!important;font-weight:850}.reading-material-card[data-material="manga"] .reading-material-status{background:color-mix(in srgb,#ffd7e5 72%,var(--color-surface));color:#9a4263!important}
            .reading-garden-selection{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;margin-top:10px;padding:12px;border:1px solid color-mix(in srgb,var(--color-primary) 18%,var(--color-border));border-radius:16px;background:color-mix(in srgb,var(--color-primary-soft) 38%,var(--color-surface))}.reading-garden-selection-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--color-surface);font-size:19px}.reading-garden-selection strong{display:block;font-size:11px}.reading-garden-selection p{margin:4px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.5}.reading-garden-selection small{display:inline-block;margin-top:6px;color:var(--color-primary-dark);font-size:7px;font-weight:850}
            .reading-garden-library-strip{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.reading-garden-library-item{padding:10px 6px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);text-align:center}.reading-garden-library-item span{display:block;font-size:16px}.reading-garden-library-item strong{display:block;margin-top:4px;font-size:9px}.reading-garden-library-item small{display:block;margin-top:2px;color:var(--color-text-muted);font-size:7px}
            .reading-garden-empty{margin-top:10px;padding:15px;border:1px dashed color-mix(in srgb,var(--color-primary) 24%,var(--color-border));border-radius:16px;background:color-mix(in srgb,var(--color-primary-soft) 24%,var(--color-surface));text-align:center}.reading-garden-empty span{font-size:24px}.reading-garden-empty strong{display:block;margin-top:5px;font-size:11px}.reading-garden-empty p{max-width:480px;margin:5px auto 0;color:var(--color-text-muted);font-size:8px;line-height:1.5}
            .reading-garden-rights-note{display:grid;grid-template-columns:auto minmax(0,1fr);gap:9px;margin-top:18px;padding:12px;border-radius:15px;background:color-mix(in srgb,#fff2f7 74%,var(--color-surface));border:1px solid color-mix(in srgb,#e878a3 22%,var(--color-border))}.reading-garden-rights-note>span{font-size:20px}.reading-garden-rights-note strong{display:block;font-size:9px}.reading-garden-rights-note p{margin:3px 0 0;color:var(--color-text-muted);font-size:8px;line-height:1.5}
            html.reading-garden-open,html.reading-garden-open body{overflow:hidden}
            @media(max-width:520px){.reading-garden-dialog{height:96dvh}.reading-garden-reader-options{grid-template-columns:1fr}.reading-garden-material-grid{grid-template-columns:1fr 1fr}.reading-garden-library-strip{grid-template-columns:repeat(2,minmax(0,1fr))}}
            @media(max-width:365px){.reading-garden-material-grid{grid-template-columns:1fr}.reading-garden-stats{grid-template-columns:1fr 1fr}.reading-garden-stat:last-child{grid-column:1/-1}}
            @media(prefers-reduced-motion:reduce){.reading-garden-dialog *{scroll-behavior:auto!important;transition:none!important}}
        `;
        document.head.appendChild(style);
    }

    function materialCardsMarkup() {
        return MATERIALS.map(item => `
            <button class="reading-material-card${prefs.material === item.id ? " active" : ""}" type="button" data-reading-material="${escapeHtml(item.id)}" data-material="${escapeHtml(item.id)}" aria-pressed="${prefs.material === item.id}">
                <span class="reading-material-icon" aria-hidden="true">${item.icon}</span>
                <span class="reading-material-main"><strong>${escapeHtml(item.title)}</strong><small>${item.count.toLocaleString()} ${escapeHtml(item.unit)}</small></span>
                <span class="reading-material-meta"><span>JLPT N5 → N1</span><span class="reading-material-status">${escapeHtml(item.status)}</span></span>
            </button>
        `).join("");
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
                    <button type="button" data-reading-close aria-label="Back to Practice">‹</button>
                    <div class="reading-garden-title"><span>Practice</span><strong id="reading-garden-heading">Reading Garden</strong></div>
                    <button type="button" data-reading-close aria-label="Close Reading Garden">×</button>
                </header>
                <div class="reading-garden-body">
                    <section class="reading-garden-hero">
                        <span class="reading-garden-kicker">🌸 Read real Japanese at your pace</span>
                        <h2>Grow into Japanese reading.</h2>
                        <p>Browse many kinds of Japanese material, choose the help you want, and gradually move from kana and furigana toward natural Japanese-only reading.</p>
                        <div class="reading-garden-stats" aria-label="Reading Garden roadmap">
                            <div class="reading-garden-stat"><strong>${MATERIALS.length}</strong><small>material types</small></div>
                            <div class="reading-garden-stat"><strong>${TOTAL_TARGET.toLocaleString()}</strong><small>planned readings / chapters</small></div>
                            <div class="reading-garden-stat"><strong>N5 → N1</strong><small>full learning path</small></div>
                        </div>
                    </section>

                    <section class="reading-garden-section" aria-labelledby="reading-level-heading">
                        <div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Difficulty</span><h3 id="reading-level-heading">Your reading level</h3></div><span id="reading-level-summary">All levels</span></div>
                        <div class="reading-garden-levels" role="group" aria-label="Reading JLPT level">
                            ${["all","N5","N4","N3","N2","N1"].map(level => `<button class="reading-garden-chip${prefs.level === level ? " active" : ""}" type="button" data-reading-level="${level}" aria-pressed="${prefs.level === level}">${level === "all" ? "All Levels" : level}</button>`).join("")}
                        </div>
                    </section>

                    <section class="reading-garden-section" aria-labelledby="reading-mode-heading">
                        <div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Display</span><h3 id="reading-mode-heading">How do you want to read?</h3></div></div>
                        <div class="reading-garden-modes" role="group" aria-label="Reading display mode">
                            <button class="reading-garden-chip${prefs.mode === "furigana" ? " active" : ""}" type="button" data-reading-mode="furigana" aria-pressed="${prefs.mode === "furigana"}">漢字 + Furigana</button>
                            <button class="reading-garden-chip${prefs.mode === "kana" ? " active" : ""}" type="button" data-reading-mode="kana" aria-pressed="${prefs.mode === "kana"}">Kana Only</button>
                            <button class="reading-garden-chip${prefs.mode === "japanese" ? " active" : ""}" type="button" data-reading-mode="japanese" aria-pressed="${prefs.mode === "japanese"}">Japanese Only</button>
                        </div>
                        <div class="reading-garden-reader-options">
                            <article class="reading-garden-preview"><span>Reader preview</span><p id="reading-garden-preview-text"></p><small id="reading-garden-preview-note"></small></article>
                            <article class="reading-garden-mode-card"><span>Designed to grow with you</span><strong id="reading-garden-mode-title"></strong><p id="reading-garden-mode-description"></p></article>
                        </div>
                    </section>

                    <section class="reading-garden-section" aria-labelledby="reading-material-heading">
                        <div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Library</span><h3 id="reading-material-heading">Browse by material</h3></div><span>${TOTAL_TARGET.toLocaleString()} target</span></div>
                        <div class="reading-garden-material-grid" role="group" aria-label="Reading material types">${materialCardsMarkup()}</div>
                        <div id="reading-garden-selection" class="reading-garden-selection" aria-live="polite"></div>
                    </section>

                    <section class="reading-garden-section" aria-labelledby="reading-library-heading">
                        <div class="reading-garden-section-heading"><div><span class="reading-garden-kicker">Your shelf</span><h3 id="reading-library-heading">My Reading</h3></div></div>
                        <div class="reading-garden-library-strip">
                            <div class="reading-garden-library-item"><span>▶</span><strong>Continue</strong><small>0 reading</small></div>
                            <div class="reading-garden-library-item"><span>♡</span><strong>Saved</strong><small>0 saved</small></div>
                            <div class="reading-garden-library-item"><span>⇩</span><strong>Offline</strong><small>0 downloaded</small></div>
                            <div class="reading-garden-library-item"><span>↻</span><strong>History</strong><small>0 finished</small></div>
                        </div>
                        <div class="reading-garden-empty"><span aria-hidden="true">📖</span><strong>Your reading shelf is ready.</strong><p>The UI is in place first. Articles, stories, news, conversations, and the other content packs can now be added without making Sakura's startup bundle heavy.</p></div>
                    </section>

                    <aside class="reading-garden-rights-note"><span aria-hidden="true">🎀</span><div><strong>Manga stays on the roadmap.</strong><p>Sakura will only add legitimate third-party manga after the right to redistribute it inside the app is verified. No copyrighted manga will be bundled just because it is free to read elsewhere.</p></div></aside>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        return dialog;
    }

    function injectPracticeCard() {
        const grid = document.querySelector("#practice-view .practice-coming-grid");
        if (!grid || grid.querySelector("[data-open-reading-garden]")) return;
        const button = document.createElement("button");
        button.className = "practice-coming-card practice-active-card reading-garden-entry-card";
        button.type = "button";
        button.dataset.openReadingGarden = "true";
        button.innerHTML = '<span aria-hidden="true">📖</span><span><h2>Reading Garden</h2><p>Articles, stories, news, chats, real-life Japanese, and more.</p></span><b aria-hidden="true">→</b>';
        grid.prepend(button);
    }

    function selectedMaterial() {
        return MATERIALS.find(item => item.id === prefs.material) || MATERIALS[1];
    }

    function updateMaterialSelection() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        dialog.querySelectorAll("[data-reading-material]").forEach(button => {
            const active = button.dataset.readingMaterial === prefs.material;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        const item = selectedMaterial();
        const selection = document.getElementById("reading-garden-selection");
        if (!selection || !item) return;
        const special = item.id === "manga"
            ? "Rights verification comes before any manga files are added."
            : "The reader UI is ready; this content pack will be populated in the next content phase.";
        selection.innerHTML = `<span class="reading-garden-selection-icon" aria-hidden="true">${item.icon}</span><div><strong>${escapeHtml(item.title)} · ${item.count.toLocaleString()} ${escapeHtml(item.unit)} planned</strong><p>${escapeHtml(item.description)}</p><small>${escapeHtml(special)}</small></div>`;
    }

    function updateLevelUi() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        dialog.querySelectorAll("[data-reading-level]").forEach(button => {
            const active = button.dataset.readingLevel === prefs.level;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        const summary = document.getElementById("reading-level-summary");
        if (summary) summary.textContent = prefs.level === "all" ? "All levels" : `${prefs.level} focus`;
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
        if (!preview || !note || !title || !description) return;

        const modes = {
            furigana: {
                text:"<ruby>東京<rt>とうきょう</rt></ruby>で<ruby>新<rt>あたら</rt></ruby>しい<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みました。",
                note:"Kanji stays visible, with its reading directly above it.",
                title:"Kanji + Furigana",
                description:"The default learning view. You see real Japanese writing while furigana keeps unfamiliar kanji readable."
            },
            kana: {
                text:"とうきょうであたらしいほんをよみました。",
                note:"Everything is shown in kana for early reading practice.",
                title:"Kana Only",
                description:"Useful when you want to focus on sound and sentence flow before relying on kanji recognition."
            },
            japanese: {
                text:"東京で新しい本を読みました。",
                note:"No furigana or English is shown automatically.",
                title:"Japanese Only",
                description:"Immersion mode for when you are ready to read naturally and only reveal help when you choose to."
            }
        };
        const mode = modes[prefs.mode] || modes.furigana;
        preview.innerHTML = mode.text;
        note.textContent = mode.note;
        title.textContent = mode.title;
        description.textContent = mode.description;
    }

    function open() {
        const dialog = createDialog();
        updateLevelUi();
        updateModeUi();
        updateMaterialSelection();
        document.documentElement.classList.add("reading-garden-open");
        if (typeof dialog.showModal === "function") {
            if (!dialog.open) dialog.showModal();
        }
        else {
            dialog.setAttribute("open", "");
        }
        requestAnimationFrame(() => dialog.querySelector("[data-reading-close]")?.focus({ preventScroll:true }));
    }

    function close() {
        const dialog = document.getElementById("reading-garden-dialog");
        if (!dialog) return;
        document.documentElement.classList.remove("reading-garden-open");
        if (typeof dialog.close === "function" && dialog.open) dialog.close();
        else dialog.removeAttribute("open");
        document.querySelector("[data-open-reading-garden]")?.focus({ preventScroll:true });
    }

    function bindEvents() {
        document.addEventListener("click", event => {
            const openButton = event.target.closest("[data-open-reading-garden]");
            if (openButton) { open(); return; }

            const closeButton = event.target.closest("[data-reading-close]");
            if (closeButton) { close(); return; }

            const levelButton = event.target.closest("[data-reading-level]");
            if (levelButton) {
                prefs.level = levelButton.dataset.readingLevel || "all";
                savePrefs();
                updateLevelUi();
                return;
            }

            const modeButton = event.target.closest("[data-reading-mode]");
            if (modeButton) {
                prefs.mode = modeButton.dataset.readingMode || "furigana";
                savePrefs();
                updateModeUi();
                return;
            }

            const materialButton = event.target.closest("[data-reading-material]");
            if (materialButton) {
                prefs.material = materialButton.dataset.readingMaterial || "articles";
                savePrefs();
                updateMaterialSelection();
            }
        });

        document.addEventListener("cancel", event => {
            if (event.target?.id !== "reading-garden-dialog") return;
            event.preventDefault();
            close();
        });

        document.addEventListener("click", event => {
            const dialog = event.target;
            if (dialog?.id === "reading-garden-dialog") close();
        });
    }

    function init() {
        ensureStyles();
        injectPracticeCard();
        createDialog();
        updateLevelUi();
        updateModeUi();
        updateMaterialSelection();
    }

    bindEvents();
    init();

    window.SakuraReadingGarden = Object.freeze({
        open,
        close,
        materials:MATERIALS,
        totalTarget:TOTAL_TARGET,
        refresh:init
    });
}());
