/* Sakura Reading Garden Quality Layer v1 — non-destructive long-form overlays + quality-first targets. */
(function initializeSakuraReadingQuality() {
  if (window.SakuraReadingQuality) return;

  const DATA_URL = "./data/reading/quality/long-form-v1.json?v=1";
  const MAX_PER_MATERIAL = 50;
  let qualityData = null;
  let dataPromise = null;
  let observer = null;
  let frame = 0;

  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  async function loadData() {
    if (qualityData) return qualityData;
    if (dataPromise) return dataPromise;
    dataPromise = fetch(DATA_URL, { cache: "no-cache" })
      .then(async response => {
        if (!response.ok) throw new Error(`Reading quality data returned HTTP ${response.status}`);
        const data = await response.json();
        if (data?.version !== 1 || data?.policy?.maxCuratedPerMaterial !== MAX_PER_MATERIAL) {
          throw new Error("Reading quality data is invalid.");
        }
        qualityData = data;
        return data;
      })
      .finally(() => { dataPromise = null; });
    return dataPromise;
  }

  function applyMaterialTargets() {
    const materials = window.SakuraReadingGarden?.materials;
    if (!Array.isArray(materials)) return;
    materials.forEach(item => {
      item.count = MAX_PER_MATERIAL;
      if (item.id === "articles") item.status = "Quality shelf target: 50 · 300 sourced records preserved in archive";
      else if (item.id === "short-stories") item.status = "Quality shelf target: 50 · 100 public-domain records preserved in archive";
      else if (item.id === "manga") item.status = "Up to 50 only after redistribution rights are verified";
      else if (item.status !== "live") item.status = "Quality-first target: up to 50";
    });
  }

  function addPolicyBanner(container, message) {
    if (!container || container.querySelector(".reading-quality-policy-banner")) return;
    const banner = document.createElement("aside");
    banner.className = "reading-quality-policy-banner";
    banner.innerHTML = `<strong>🌸 Quality-first Reading Garden</strong><span>${escapeHtml(message)}</span>`;
    container.appendChild(banner);
  }

  function updateHome() {
    const home = document.getElementById("reading-garden-home");
    if (!home) return;
    const stats = home.querySelectorAll(".reading-garden-stat");
    if (stats[1]) {
      const strong = stats[1].querySelector("strong");
      const small = stats[1].querySelector("small");
      if (strong) strong.textContent = "50 max";
      if (small) small.textContent = "per material type";
    }
    const libraryHeading = home.querySelector(".reading-garden-material-grid")?.previousElementSibling?.querySelector(":scope > span");
    if (libraryHeading) libraryHeading.textContent = "quality over quantity";
    const hero = home.querySelector(".reading-garden-hero");
    addPolicyBanner(hero, "New content targets are capped at 50 curated pieces per material type. Sakura keeps the existing sourced/public-domain archive instead of deleting work, while longer readings are upgraded in batches.");
  }

  function updateBrowsers() {
    const articles = document.getElementById("reading-articles-browser");
    const articleHero = articles?.querySelector(".reading-browser-hero");
    addPolicyBanner(articleHero, "Articles now follow a 50-piece quality target for the curated shelf. The existing 300 verified-source records remain preserved while longer source-grounded readings are upgraded gradually.");

    const stories = document.getElementById("reading-stories-browser");
    const storyHero = stories?.querySelector(".reading-browser-hero");
    addPolicyBanner(storyHero, "Short Stories now follow a 50-piece quality target for the curated shelf. The existing 100 public-domain records remain preserved, and selected works receive deeper guided reading without replacing the original text.");
  }

  function addLongReadTags(data) {
    document.querySelectorAll("[data-reading-open-article]").forEach(card => {
      const id = card.dataset.readingOpenArticle;
      if (!data.articles?.[id] || card.querySelector("[data-reading-quality-tag]")) return;
      const tags = card.querySelector(".reading-article-tags");
      if (!tags) return;
      const tag = document.createElement("span");
      tag.className = "reading-article-tag reading-quality-tag";
      tag.dataset.readingQualityTag = "true";
      tag.textContent = "Long Read";
      tags.appendChild(tag);
    });
    document.querySelectorAll("[data-reading-open-story]").forEach(card => {
      const id = card.dataset.readingOpenStory;
      if (!data.stories?.[id] || card.querySelector("[data-reading-quality-tag]")) return;
      const tags = card.querySelector(".reading-article-tags");
      if (!tags) return;
      const tag = document.createElement("span");
      tag.className = "reading-article-tag reading-quality-tag";
      tag.dataset.readingQualityTag = "true";
      tag.textContent = "Guided Long Read";
      tags.appendChild(tag);
    });
  }

  function enhanceArticleReader(data) {
    const reader = document.getElementById("reading-article-reader");
    if (!reader || reader.querySelector("[data-reading-quality-article]")) return;
    const id = reader.querySelector("[data-reading-save-article]")?.dataset.readingSaveArticle;
    const overlay = data.articles?.[id];
    if (!overlay?.deepDive?.length) return;

    const tags = reader.querySelector(".reading-reader-tags");
    if (tags && !tags.querySelector("[data-reading-quality-tag]")) {
      const tag = document.createElement("span");
      tag.className = "reading-article-tag reading-quality-tag";
      tag.dataset.readingQualityTag = "true";
      tag.textContent = `Long Read · +${overlay.extraMinutes || 2} min`;
      tags.appendChild(tag);
    }

    const content = reader.querySelector(".reading-reader-content");
    if (!content) return;
    const showEnglish = /Hide Translation/i.test(reader.querySelector("[data-reading-toggle-translation]")?.textContent || "");
    const section = document.createElement("section");
    section.className = "reading-reader-section reading-quality-deep-dive";
    section.dataset.readingQualityArticle = id;
    section.innerHTML = `<div class="reading-quality-heading"><div><span>Long Read</span><h3>もっと深く読む</h3></div><small>Source checked ${escapeHtml(overlay.verifiedDate || "")}</small></div>
      <p class="reading-level-note">The paragraphs below add source-grounded context in Sakura's own wording. They are not copied verbatim from the source.</p>
      <div class="reading-reader-content reading-quality-extra">${overlay.deepDive.map(paragraph => `<p class="reading-reader-paragraph">${escapeHtml(paragraph.japanese)}</p>${showEnglish ? `<p class="reading-reader-translation">${escapeHtml(paragraph.english)}</p>` : ""}`).join("")}</div>`;
    content.insertAdjacentElement("afterend", section);
  }

  function enhanceStoryReader(data) {
    const reader = document.getElementById("reading-story-reader");
    if (!reader || reader.querySelector("[data-reading-quality-story]")) return;
    const id = reader.querySelector("[data-reading-save-story]")?.dataset.readingSaveStory;
    const overlay = data.stories?.[id];
    if (!overlay?.guideParagraphs?.length) return;

    const tags = reader.querySelector(".reading-reader-tags");
    if (tags && !tags.querySelector("[data-reading-quality-tag]")) {
      const tag = document.createElement("span");
      tag.className = "reading-article-tag reading-quality-tag";
      tag.dataset.readingQualityTag = "true";
      tag.textContent = "Guided Long Read";
      tags.appendChild(tag);
    }

    const original = reader.querySelector(".reading-reader-content");
    if (!original) return;
    const section = document.createElement("section");
    section.className = "reading-reader-section reading-quality-story-guide";
    section.dataset.readingQualityStory = id;
    section.innerHTML = `<div class="reading-quality-heading"><div><span>Guided reading</span><h3>${escapeHtml(overlay.guideTitle || "物語を深く読む")}</h3></div><small>Source checked ${escapeHtml(overlay.verifiedDate || "")}</small></div>
      <p class="reading-level-note">The original excerpt above remains untouched. This section is Sakura's source-grounded plot guide, clearly separated from the author's original wording.</p>
      <div class="reading-quality-story-paragraphs">${overlay.guideParagraphs.map(paragraph => `<article><p lang="ja">${escapeHtml(paragraph.japanese)}</p><details><summary>English guide</summary><p>${escapeHtml(paragraph.english)}</p></details></article>`).join("")}</div>`;
    original.insertAdjacentElement("afterend", section);
  }

  async function enhance() {
    try {
      applyMaterialTargets();
      const data = await loadData();
      updateHome();
      updateBrowsers();
      addLongReadTags(data);
      enhanceArticleReader(data);
      enhanceStoryReader(data);
    } catch (error) {
      console.warn("Sakura Reading quality layer could not finish enhancing this view.", error);
    }
  }

  function scheduleEnhance() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      enhance();
    });
  }

  function injectStyles() {
    if (document.getElementById("sakura-reading-quality-styles")) return;
    const style = document.createElement("style");
    style.id = "sakura-reading-quality-styles";
    style.textContent = `
      .reading-quality-policy-banner{display:grid;gap:4px;margin-top:12px;padding:10px 11px;border:1px solid color-mix(in srgb,var(--color-primary) 22%,var(--color-border));border-radius:12px;background:color-mix(in srgb,var(--color-primary-soft) 55%,var(--color-surface));font-size:9px;line-height:1.5}
      .reading-quality-policy-banner strong{color:var(--color-primary-dark);font-size:9px}.reading-quality-policy-banner span{color:var(--color-text-muted)}
      .reading-quality-tag{border-color:color-mix(in srgb,var(--color-primary) 32%,var(--color-border));background:var(--color-primary-soft);color:var(--color-primary-dark);font-weight:900}
      .reading-quality-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}.reading-quality-heading div{display:grid;gap:2px}.reading-quality-heading span{color:var(--color-primary-dark);font-size:8px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.reading-quality-heading h3{margin:0}.reading-quality-heading small{color:var(--color-text-muted);font-size:7px;text-align:right}
      .reading-quality-extra{display:grid;gap:12px;margin-top:10px}.reading-quality-story-paragraphs{display:grid;gap:10px;margin-top:10px}.reading-quality-story-paragraphs article{padding:11px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface)}.reading-quality-story-paragraphs p{margin:0;font-size:11px;line-height:1.8}.reading-quality-story-paragraphs details{margin-top:8px;padding-top:7px;border-top:1px solid var(--color-border)}.reading-quality-story-paragraphs summary{cursor:pointer;color:var(--color-primary-dark);font-size:8px;font-weight:850}.reading-quality-story-paragraphs details p{margin-top:7px;color:var(--color-text-muted);font-size:9px;line-height:1.6}
      @media(max-width:420px){.reading-quality-heading{display:grid}.reading-quality-heading small{text-align:left}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    applyMaterialTargets();
    scheduleEnhance();
    if (!observer) {
      observer = new MutationObserver(scheduleEnhance);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.SakuraReadingQuality = Object.freeze({ version: 1, init, loadData, maxCuratedPerMaterial: MAX_PER_MATERIAL });
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init, { once: true });
}());
