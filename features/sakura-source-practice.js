/* Sakura Source-Checked Practice v1 */
(function initializeSakuraSourcePractice() {
  "use strict";
  if (window.SakuraSourcePractice) return;

  const DATA_URL = "./data/practice-source-checked.js?v=1";
  const LAST_START_KEY = "sakuraSourcePracticeLastStartV1";
  let dataPromise = null;
  let dialog = null;
  let session = null;
  let romajiVisible = false;

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[character]));
  }

  function shuffle(values) {
    const copy = [...values];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function injectStyle() {
    if (document.getElementById("sakura-source-practice-style")) return;
    const style = document.createElement("style");
    style.id = "sakura-source-practice-style";
    style.textContent = `
      .source-practice-launch{position:relative;overflow:hidden}
      .source-practice-launch::after{content:"SOURCE-CHECKED";position:absolute;right:11px;top:9px;padding:3px 7px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:6px;font-weight:950;letter-spacing:.08em}
      .source-practice-launch span:nth-child(2){padding-right:72px}
      .source-practice-dialog{border:0;padding:0;background:transparent;width:min(94vw,620px);max-width:none}
      .source-practice-dialog::backdrop{background:rgba(35,29,33,.34);backdrop-filter:blur(3px)}
      .source-practice-shell{max-height:min(88vh,820px);overflow:auto;background:var(--color-surface);border:1px solid var(--color-border);border-radius:23px;padding:18px;box-shadow:0 22px 72px rgba(35,29,33,.2)}
      .source-practice-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:13px}
      .source-practice-head h2{margin:2px 0 4px;font-size:24px;line-height:1.12}.source-practice-head p{margin:0;color:var(--color-text-muted);font-size:11px;line-height:1.5}
      .source-practice-close{flex:0 0 auto;width:40px;height:40px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:22px}
      .source-practice-proof{display:grid;gap:5px;margin:0 0 14px;padding:11px;border:1px solid color-mix(in srgb,var(--color-primary) 20%,var(--color-border));border-radius:14px;background:color-mix(in srgb,var(--color-primary-soft) 58%,var(--color-surface))}
      .source-practice-proof strong{color:var(--color-primary-dark);font-size:10px}.source-practice-proof span{color:var(--color-text-muted);font-size:9px;line-height:1.5}
      .source-practice-filters{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end;margin-bottom:12px}
      .source-practice-filters label{display:grid;gap:5px;color:var(--color-text-muted);font-size:8px;font-weight:850}.source-practice-filters select{min-width:0;width:100%;padding:10px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:10px;font-weight:800}
      .source-practice-start{min-height:42px;padding:10px 13px;border:0;border-radius:12px;background:var(--color-primary);color:white;font:inherit;font-size:10px;font-weight:900}
      .source-practice-count{margin:-3px 0 12px;color:var(--color-text-muted);font-size:8px}
      .source-practice-stage{display:grid;gap:11px}
      .source-practice-progress{display:flex;align-items:center;justify-content:space-between;gap:8px}.source-practice-tags{display:flex;flex-wrap:wrap;gap:5px}.source-practice-tag{padding:4px 7px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:7px;font-weight:900}.source-practice-progress strong{font-size:10px;color:var(--color-primary-dark)}
      .source-practice-scenario,.source-practice-prompt{display:grid;gap:5px;padding:12px;border:1px solid var(--color-border);border-radius:15px;background:var(--color-background)}
      .source-practice-scenario span,.source-practice-prompt span{font-size:7px;font-weight:950;letter-spacing:.09em;text-transform:uppercase;color:var(--color-text-muted)}.source-practice-scenario p,.source-practice-prompt p{margin:0;font-size:12px;line-height:1.5;font-weight:750}
      .source-practice-choice-list{display:grid;gap:8px}.source-practice-choice{width:100%;display:grid;gap:3px;padding:12px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);color:var(--color-text);text-align:left;font:inherit}.source-practice-choice strong{font-size:15px;line-height:1.4}.source-practice-choice small{font-size:9px;color:var(--color-text-muted)}.source-practice-choice:hover,.source-practice-choice:focus-visible{border-color:var(--color-primary)}.source-practice-choice.correct{border-color:#58a77f;background:color-mix(in srgb,#58a77f 9%,var(--color-surface))}.source-practice-choice.wrong{border-color:#c65a76;background:color-mix(in srgb,#c65a76 8%,var(--color-surface))}.source-practice-choice:disabled{opacity:1}
      .source-practice-toolbar{display:flex;justify-content:flex-end}.source-practice-romaji{padding:7px 9px;border:1px solid var(--color-border);border-radius:10px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:8px;font-weight:850}
      .source-practice-feedback{display:grid;gap:7px;padding:12px;border-radius:15px;background:color-mix(in srgb,var(--color-primary-soft) 56%,var(--color-surface));border:1px solid color-mix(in srgb,var(--color-primary) 17%,var(--color-border))}.source-practice-feedback h3{margin:0;font-size:12px}.source-practice-answer{display:grid;gap:2px}.source-practice-answer strong{font-size:15px}.source-practice-answer span,.source-practice-answer small{font-size:9px;color:var(--color-text-muted)}.source-practice-feedback p{margin:0;font-size:9px;line-height:1.55;color:var(--color-text-muted)}
      .source-practice-source{display:grid;gap:4px;padding-top:8px;border-top:1px solid color-mix(in srgb,var(--color-border) 75%,transparent)}.source-practice-source strong{font-size:8px;color:var(--color-primary-dark)}.source-practice-source span{font-size:8px;line-height:1.45;color:var(--color-text-muted)}.source-practice-source a{width:max-content;max-width:100%;font-size:8px;font-weight:900;color:var(--color-primary-dark);text-decoration:underline;text-underline-offset:2px}
      .source-practice-next{min-height:44px;border:0;border-radius:13px;background:var(--color-primary);color:white;font:inherit;font-size:11px;font-weight:900}
      .source-practice-finish{display:grid;gap:11px;padding:16px;border:1px solid var(--color-border);border-radius:17px;text-align:center;background:var(--color-background)}.source-practice-finish .score{font-size:33px;font-weight:950;color:var(--color-primary-dark)}.source-practice-finish h3{margin:0;font-size:18px}.source-practice-finish p{margin:0;color:var(--color-text-muted);font-size:10px;line-height:1.5}.source-practice-finish-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.source-practice-finish-actions button{min-height:44px;border-radius:13px;font:inherit;font-size:10px;font-weight:900}.source-practice-again{border:0;background:var(--color-primary);color:#fff}.source-practice-done{border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text)}
      @media(max-width:520px){.source-practice-dialog{width:calc(100vw - 18px)}.source-practice-shell{padding:15px;border-radius:20px}.source-practice-filters{grid-template-columns:1fr 1fr}.source-practice-start{grid-column:1/-1}.source-practice-launch span:nth-child(2){padding-right:64px}}
    `;
    document.head.appendChild(style);
  }

  function loadData() {
    if (window.SAKURA_SOURCE_CHECKED_PRACTICE?.items?.length) return Promise.resolve(window.SAKURA_SOURCE_CHECKED_PRACTICE);
    if (dataPromise) return dataPromise;
    dataPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = DATA_URL;
      script.dataset.sakuraSourcePracticeData = "true";
      script.onload = () => window.SAKURA_SOURCE_CHECKED_PRACTICE?.items?.length
        ? resolve(window.SAKURA_SOURCE_CHECKED_PRACTICE)
        : reject(new Error("Source-checked practice data did not initialize."));
      script.onerror = () => reject(new Error("Source-checked practice data could not load."));
      document.head.appendChild(script);
    });
    return dataPromise;
  }

  function buildDialog() {
    if (dialog) return dialog;
    injectStyle();
    dialog = document.createElement("dialog");
    dialog.className = "source-practice-dialog";
    dialog.id = "source-practice-dialog";
    dialog.innerHTML = `
      <section class="source-practice-shell">
        <header class="source-practice-head">
          <div><span class="section-kicker">✓ Source-checked practice</span><h2>Real-Life Practice Pack</h2><p>Practice useful Japanese with drills grounded in official Japan Foundation lesson objectives.</p></div>
          <button class="source-practice-close" type="button" aria-label="Close">×</button>
        </header>
        <div class="source-practice-proof"><strong>What “source-checked” means</strong><span>Sakura writes the exercise itself, then anchors the communication goal to an official Irodori lesson. It does not copy the textbook dialogue.</span></div>
        <div class="source-practice-filters">
          <label>Level<select data-source-level><option value="all">All levels</option><option value="Starter A1">Starter A1</option><option value="Elementary 1 A2">Elementary 1 A2</option></select></label>
          <label>Category<select data-source-category><option value="all">All categories</option></select></label>
          <button class="source-practice-start" type="button">Start 10-question session</button>
        </div>
        <p class="source-practice-count" data-source-count>Loading source-checked drills…</p>
        <div class="source-practice-stage" data-source-stage></div>
      </section>`;
    document.body.appendChild(dialog);
    dialog.querySelector(".source-practice-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.querySelector("[data-source-level]").addEventListener("change", updateCount);
    dialog.querySelector("[data-source-category]").addEventListener("change", updateCount);
    dialog.querySelector(".source-practice-start").addEventListener("click", startSession);
    return dialog;
  }

  function filteredItems() {
    const data = window.SAKURA_SOURCE_CHECKED_PRACTICE;
    if (!data?.items) return [];
    const level = dialog.querySelector("[data-source-level]").value;
    const category = dialog.querySelector("[data-source-category]").value;
    return data.items.filter(item => (level === "all" || item.level === level) && (category === "all" || item.category === category));
  }

  function updateCount() {
    if (!dialog || !window.SAKURA_SOURCE_CHECKED_PRACTICE) return;
    const items = filteredItems();
    const count = dialog.querySelector("[data-source-count]");
    count.textContent = `${items.length} source-checked drills available · each answer shows its official lesson source.`;
    const start = dialog.querySelector(".source-practice-start");
    start.disabled = items.length === 0;
    start.textContent = `Start ${Math.min(10, items.length)}-question session`;
  }

  function populateCategories() {
    const select = dialog.querySelector("[data-source-category]");
    const categories = [...new Set(window.SAKURA_SOURCE_CHECKED_PRACTICE.items.map(item => item.category))].sort();
    select.innerHTML = '<option value="all">All categories</option>' + categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  }

  function chooseSessionItems(items) {
    let shuffled = shuffle(items);
    let lastStart = "";
    try { lastStart = localStorage.getItem(LAST_START_KEY) || ""; } catch (_) {}
    if (shuffled.length > 1 && shuffled[0]?.id === lastStart) {
      const swapIndex = shuffled.findIndex((item, index) => index > 0 && item.id !== lastStart);
      if (swapIndex > 0) [shuffled[0], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[0]];
    }
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));
    try { if (selected[0]?.id) localStorage.setItem(LAST_START_KEY, selected[0].id); } catch (_) {}
    return selected;
  }

  function startSession() {
    const pool = filteredItems();
    if (!pool.length) return;
    session = { items: chooseSessionItems(pool), index: 0, score: 0, answered: false };
    renderQuestion();
  }

  function renderQuestion() {
    const stage = dialog.querySelector("[data-source-stage]");
    if (!session || session.index >= session.items.length) return renderFinish();
    const item = session.items[session.index];
    session.answered = false;
    stage.innerHTML = `
      <div class="source-practice-progress"><div class="source-practice-tags"><span class="source-practice-tag">${escapeHtml(item.level)}</span><span class="source-practice-tag">${escapeHtml(item.category)}</span></div><strong>${session.index + 1} / ${session.items.length}</strong></div>
      <section class="source-practice-scenario"><span>Scenario</span><p>${escapeHtml(item.scenario)}</p></section>
      <section class="source-practice-prompt"><span>What would you say?</span><p>${escapeHtml(item.prompt)}</p></section>
      <div class="source-practice-toolbar"><button class="source-practice-romaji" type="button" aria-pressed="${romajiVisible}">${romajiVisible ? "Hide Romaji" : "Show Romaji"}</button></div>
      <div class="source-practice-choice-list">${item.choices.map((choice, index) => `<button class="source-practice-choice" type="button" data-source-choice="${index}"><strong>${escapeHtml(choice.japanese)}</strong><small ${romajiVisible ? "" : "hidden"}>${escapeHtml(choice.romaji)}</small></button>`).join("")}</div>
      <div data-source-feedback></div>`;
    stage.querySelector(".source-practice-romaji").addEventListener("click", () => {
      romajiVisible = !romajiVisible;
      stage.querySelectorAll(".source-practice-choice small").forEach(node => { node.hidden = !romajiVisible; });
      const button = stage.querySelector(".source-practice-romaji");
      button.textContent = romajiVisible ? "Hide Romaji" : "Show Romaji";
      button.setAttribute("aria-pressed", String(romajiVisible));
    });
    stage.querySelectorAll("[data-source-choice]").forEach(button => button.addEventListener("click", () => answerQuestion(Number(button.dataset.sourceChoice))));
  }

  function answerQuestion(choiceIndex) {
    if (!session || session.answered) return;
    session.answered = true;
    const item = session.items[session.index];
    const correct = choiceIndex === item.correctChoice;
    if (correct) session.score += 1;
    const stage = dialog.querySelector("[data-source-stage]");
    stage.querySelectorAll("[data-source-choice]").forEach((button, index) => {
      button.disabled = true;
      if (index === item.correctChoice) button.classList.add("correct");
      else if (index === choiceIndex) button.classList.add("wrong");
    });
    const answer = item.choices[item.correctChoice];
    const feedback = stage.querySelector("[data-source-feedback]");
    feedback.innerHTML = `
      <section class="source-practice-feedback">
        <h3>${correct ? "✓ Correct" : "Not quite — here’s the natural answer"}</h3>
        <div class="source-practice-answer"><strong>${escapeHtml(answer.japanese)}</strong><span>${escapeHtml(answer.kana)}</span><small>${escapeHtml(answer.romaji)} · ${escapeHtml(answer.english)}</small></div>
        <p>${escapeHtml(item.explanation)}</p>
        <div class="source-practice-source"><strong>Official grounding</strong><span>${escapeHtml(item.lesson)} — ${escapeHtml(item.sourceTitle)}</span><a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open official Irodori source ↗</a><span>Sakura-authored drill; source identifies the official communication objective, not copied dialogue.</span></div>
      </section>
      <button class="source-practice-next" type="button">${session.index + 1 >= session.items.length ? "See Result" : "Next Question"}</button>`;
    feedback.querySelector(".source-practice-next").addEventListener("click", () => { session.index += 1; renderQuestion(); });
  }

  function renderFinish() {
    const stage = dialog.querySelector("[data-source-stage]");
    const percent = Math.round((session.score / session.items.length) * 100);
    stage.innerHTML = `
      <section class="source-practice-finish">
        <span class="section-kicker">Session complete</span><div class="score">${session.score}/${session.items.length}</div><h3>${percent >= 80 ? "Strong real-life practice 🌸" : percent >= 60 ? "Good progress — keep going" : "One more round will help"}</h3>
        <p>${percent}% correct. Every drill in this pack is anchored to an official Japan Foundation Irodori lesson objective.</p>
        <div class="source-practice-finish-actions"><button class="source-practice-done" type="button">Done</button><button class="source-practice-again" type="button">Practice Again</button></div>
      </section>`;
    stage.querySelector(".source-practice-done").addEventListener("click", () => dialog.close());
    stage.querySelector(".source-practice-again").addEventListener("click", startSession);
  }

  async function open() {
    const currentDialog = buildDialog();
    const stage = currentDialog.querySelector("[data-source-stage]");
    stage.innerHTML = '<div class="practice-loading" role="status">Loading source-checked practice…</div>';
    if (!currentDialog.open) currentDialog.showModal();
    try {
      await loadData();
      populateCategories();
      updateCount();
      stage.innerHTML = '<div class="source-practice-proof"><strong>Ready when you are 🌱</strong><span>Choose a level or category, then start a randomized 10-question session.</span></div>';
    } catch (error) {
      console.warn("Source-checked Practice could not load.", error);
      stage.innerHTML = '<div class="source-practice-proof"><strong>Could not load this pack.</strong><span>Reconnect to the internet and try again. Existing Practice activities are unaffected.</span></div>';
    }
  }

  function ensurePracticeCard() {
    const grid = document.querySelector("#practice-view .practice-coming-grid");
    if (!grid) return false;
    if (document.getElementById("source-practice-launch")) return true;
    const button = document.createElement("button");
    button.id = "source-practice-launch";
    button.type = "button";
    button.className = "practice-coming-card practice-active-card source-practice-launch";
    button.innerHTML = '<span aria-hidden="true">✅</span><span><h2>Source-Checked Real Life</h2><p>30 Japan Foundation-grounded drills with the official source shown after every answer.</p></span><b aria-hidden="true">→</b>';
    grid.insertAdjacentElement("afterbegin", button);
    button.addEventListener("click", open);
    return true;
  }

  function init() {
    injectStyle();
    buildDialog();
    if (!ensurePracticeCard()) setTimeout(init, 180);
  }

  window.SakuraSourcePractice = Object.freeze({ version: 1, init, open });
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
}());
