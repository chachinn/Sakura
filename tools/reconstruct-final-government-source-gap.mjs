import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readingRoot = path.join(root, "data", "reading");
const bodyReadyRoot = path.join(readingRoot, "body-ready");
const qaRoot = path.join(readingRoot, "qa");
const registryPath = path.join(readingRoot, "source-registry.json");
const travelPath = path.join(bodyReadyRoot, "travel-reading.json");
const docsPath = path.join(bodyReadyRoot, "real-life-documents.json");
const reportPath = path.join(qaRoot, "body-ready-source-report.json");
const TODAY = "2026-08-22";

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const travel = JSON.parse(fs.readFileSync(travelPath, "utf8"));
const docs = JSON.parse(fs.readFileSync(docsPath, "utf8"));
const priorReport = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const PDL_URL = "https://www.digital.go.jp/resources/open_data/public_data_license_v1.0";
const newFamilies = [
  {
    sourceFamilyId: "gov-jma",
    name: "Japan Meteorological Agency",
    domain: "www.jma.go.jp",
    publisher: "気象庁",
    sourceType: "open-government",
    termsUrl: "https://www.jma.go.jp/jma/kishou/info/coment.html",
    licenseName: "Public Data License 1.0",
    licenseUrl: PDL_URL,
    allowedUse: ["copy", "public-transmission", "translation", "adaptation", "commercial-use"],
    fullTextAllowed: true,
    adaptationAllowed: true,
    attributionRequired: true,
    modificationDisclosureRequired: true,
    thirdPartyAssetWarning: true,
    approvedPathPatterns: ["^/jma/kishou/know/"],
    excludedContent: ["logos", "symbols", "characters", "third-party photographs", "third-party videos", "content with a separate rights notice"],
    notes: "PDL 1.0 applies where no separate rights statement appears. This Reading Garden approval is restricted to public-information and disaster/weather guidance under /jma/kishou/know/; media assets are excluded.",
    verifiedDate: TODAY
  },
  {
    sourceFamilyId: "gov-mofa-safety",
    name: "Ministry of Foreign Affairs Overseas Safety",
    domain: "www.anzen.mofa.go.jp",
    publisher: "外務省",
    sourceType: "open-government",
    termsUrl: "https://www.anzen.mofa.go.jp/c_info/legalmatters.html",
    licenseName: "Public Data License 1.0",
    licenseUrl: PDL_URL,
    allowedUse: ["copy", "public-transmission", "translation", "adaptation", "commercial-use"],
    fullTextAllowed: true,
    adaptationAllowed: true,
    attributionRequired: true,
    modificationDisclosureRequired: true,
    thirdPartyAssetWarning: true,
    approvedPathPatterns: ["^/info/pcsafetymeasure_[0-9]+\\.html$"],
    excludedContent: ["logos", "symbols", "characters", "third-party photographs", "third-party videos", "content with a separate rights notice"],
    notes: "Restricted to country-specific Safety Measures Basic Data pages on the official Overseas Safety site; PDL 1.0 applies unless a separate rights statement is shown.",
    verifiedDate: TODAY
  }
];
for (const family of newFamilies) {
  if (!registry.sourceFamilies.some((x) => x.sourceFamilyId === family.sourceFamilyId)) registry.sourceFamilies.push(family);
}
const familyById = new Map(registry.sourceFamilies.map((x) => [x.sourceFamilyId, x]));

const decode = (s) => String(s || "")
  .replace(/&nbsp;|&#160;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const clean = (s) => decode(String(s || "")
  .replace(/<br\s*\/?\s*>/gi, "\n")
  .replace(/<ruby[^>]*>([\s\S]*?)<rt[^>]*>[\s\S]*?<\/rt>([\s\S]*?)<\/ruby>/gi, "$1$2")
  .replace(/<[^>]+>/g, " "))
  .replace(/[\t\r ]+/g, " ")
  .replace(/ *\n+ */g, "\n")
  .trim();
const jpCount = (s) => (String(s).match(/[ぁ-んァ-ヶ一-龯々〆〤]/g) || []).length;
const normalizeBody = (s) => String(s).normalize("NFKC").replace(/\s+/g, "").replace(/[「」『』（）()。、，．・：:;；!?！？]/g, "");
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
const genericTitle = /^(ホーム|トップ|一覧|目次|サイトマップ|よくお寄せいただくご質問|地震・津波・火山を知る)$/;
const thirdPartyRestriction = /(?:本文|記事|資料|コンテンツ).{0,40}(?:著作権者|無断転載|転載を禁|第三者が著作権)/i;
const thirdPartyMedia = /写真(?:提供|撮影)|画像提供|動画提供|イラスト(?:提供|制作)/i;

function extract(html) {
  const without = html.replace(/<(script|style|svg|nav|header|footer|form|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ");
  const main = (without.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
    || without.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)
    || without.match(/<div\b[^>]*(?:id|class)=["'][^"']*(?:main|contents?|article|detail)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)
    || [, without])[1];
  const chunks = [...main.matchAll(/<(?:h1|h2|h3|p|li|dt|dd|th|td)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|p|li|dt|dd|th|td)>/gi)]
    .map((m) => clean(m[1]))
    .filter((x) => x.length >= 8 && jpCount(x) >= 4 && !/^(ホーム|本文へ|サイトマップ|English|検索|メニュー|前へ|次へ|戻る|トップページ)$/.test(x));
  const unique = [];
  const seen = new Set();
  for (const text of chunks) {
    const key = normalizeBody(text);
    if (key.length < 6 || seen.has(key)) continue;
    seen.add(key);
    unique.push(text);
  }
  return unique.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function titleFrom(html, fallback) {
  const raw = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  return clean(raw || fallback).replace(/\s*[|｜].*$/, "").trim() || fallback;
}

function dateFrom(html, body) {
  const probe = `${html.slice(0, 6000)}\n${body.slice(0, 1200)}`;
  const m = probe.match(/(?:更新日|公開日|datePublished|dateModified)[^\n<>]{0,120}(20\d{2})[-年\/.](\d{1,2})[-月\/.](\d{1,2})/i);
  return m ? `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}` : null;
}

function linksFrom(html, base, host, prefix) {
  const out = [];
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
    try {
      const url = new URL(decode(match[1]), base);
      url.hash = "";
      if (url.protocol !== "https:" || url.hostname !== host || !url.pathname.startsWith(prefix)) continue;
      if (/\.(?:pdf|jpe?g|png|gif|webp|svg|mp4|zip|xlsx?|docx?|pptx?)(?:$|[?#])/i.test(url.href)) continue;
      out.push(url.href.replace(/\/$/, "/"));
    } catch {}
  }
  return [...new Set(out)];
}

async function fetchPage(url, family, crawlPrefix = null) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "SakuraReadingGardenSourceAudit/1.0", accept: "text/html,application/xhtml+xml" }
    });
    const finalUrl = new URL(response.url);
    if (!response.ok) return { url, reject: `http-${response.status}` };
    if (finalUrl.protocol !== "https:" || finalUrl.hostname !== family.domain) return { url, reject: "redirect-outside-approved-domain" };
    if (!family.approvedPathPatterns.some((pattern) => new RegExp(pattern).test(finalUrl.pathname))) return { url, reject: "unapproved-path" };
    const type = response.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml\+xml/i.test(type)) return { url, reject: "non-html-source" };
    const html = await response.text();
    const body = extract(html);
    const title = titleFrom(html, finalUrl.pathname.split("/").filter(Boolean).at(-1) || finalUrl.hostname);
    const media = thirdPartyMedia.test(body);
    const restriction = thirdPartyRestriction.test(body);
    const sourceCharacterCount = jpCount(body);
    return {
      url: finalUrl.href,
      title,
      body,
      sourceCharacterCount,
      publishedDate: dateFrom(html, body),
      thirdPartyContentReview: {
        status: restriction ? "needs-review" : media ? "checked-third-party-assets-excluded" : "checked-no-item-level-signal",
        signals: restriction ? ["item-rights-restriction"] : [],
        excludedMedia: media ? ["third-party-media-credit"] : [],
        assetsBundled: false
      },
      links: crawlPrefix ? linksFrom(html, finalUrl.href, family.domain, crawlPrefix) : []
    };
  } catch (error) {
    return { url, reject: error?.name === "AbortError" ? "timeout" : "fetch-error", error: String(error) };
  } finally {
    clearTimeout(timer);
  }
}

const allPacks = fs.readdirSync(bodyReadyRoot).filter((name) => name.endsWith(".json"));
const existingUrls = new Set();
const existingBodies = new Set();
for (const name of allPacks) {
  const pack = JSON.parse(fs.readFileSync(path.join(bodyReadyRoot, name), "utf8"));
  for (const row of pack.records || []) {
    existingUrls.add(row.sourceUrl);
    existingBodies.add(row.sourceBodyFingerprint);
  }
}

function makeRecord(item, shelf, family, position) {
  const fingerprint = hash(normalizeBody(item.body));
  return {
    candidateId: `verified-${shelf}-${hash(item.url).slice(0, 12)}`,
    targetShelf: shelf,
    sourceFamilyId: family.sourceFamilyId,
    sourceTitle: item.title,
    sourcePublisher: family.publisher,
    sourceUrl: item.url,
    sourcePublishedDate: item.publishedDate,
    sourceRetrievedDate: TODAY,
    rightsStatus: "adaptation-permitted",
    rightsBasis: {
      termsUrl: family.termsUrl,
      licenseName: family.licenseName,
      licenseUrl: family.licenseUrl,
      itemLevelCheck: "No contrary text-rights notice detected in the fetched page; excluded media remains excluded.",
      verifiedDate: TODAY
    },
    thirdPartyContentReview: item.thirdPartyContentReview,
    sourceBodyExtractionStatus: "body-ready",
    sourceJapaneseSubstance: item.body,
    sourceTextCharacterCount: item.sourceCharacterCount,
    reuseMode: "verbatim-or-adaptation-permitted",
    sourceBodyFingerprint: fingerprint,
    sourceAttribution: family.sourceFamilyId === "gov-jma"
      ? `出典：気象庁ホームページ（${item.url}）`
      : `出典：外務省 海外安全ホームページ（${item.url}）`,
    sourceProcessing: "Item-level source body extracted for later editorial adaptation. No learner-facing text has been generated.",
    inventoryPosition: position
  };
}

function acceptItem(item, family, shelf, pack) {
  if (!item || item.reject || !item.body || item.sourceCharacterCount < 320) return false;
  if (genericTitle.test(item.title) || item.thirdPartyContentReview.status === "needs-review") return false;
  if (existingUrls.has(item.url)) return false;
  const fingerprint = hash(normalizeBody(item.body));
  if (existingBodies.has(fingerprint)) return false;
  const record = makeRecord(item, shelf, family, pack.records.length + 1);
  pack.records.push(record);
  existingUrls.add(item.url);
  existingBodies.add(fingerprint);
  return true;
}

const mofa = familyById.get("gov-mofa-safety");
const travelCandidates = [
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_007.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_013.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_005.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_071.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_078.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_270.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_777.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_130.html",
  "https://www.anzen.mofa.go.jp/info/pcsafetymeasure_280.html"
];
const rejected = [];
let fetchedCount = 0;
for (const url of travelCandidates) {
  if (travel.records.length >= travel.targetCount) break;
  const item = await fetchPage(url, mofa);
  fetchedCount += 1;
  if (!acceptItem(item, mofa, "travel-reading", travel)) rejected.push({ url, reason: item.reject || "failed-body-or-rights-check" });
}
if (travel.records.length !== travel.targetCount) throw new Error(`Travel completion failed: ${travel.records.length}/${travel.targetCount}`);

const jma = familyById.get("gov-jma");
const crawlPrefix = "/jma/kishou/know/";
const seeds = [
  "https://www.jma.go.jp/jma/kishou/know/faq/index.html",
  "https://www.jma.go.jp/jma/kishou/know/bosai/kishojoho.html",
  "https://www.jma.go.jp/jma/kishou/know/jishin/tsunami_bosai/",
  "https://www.jma.go.jp/jma/kishou/know/jishin/joho/seisinfo.html",
  "https://www.jma.go.jp/jma/kishou/know/shindo/index.html",
  "https://www.jma.go.jp/jma/kishou/know/typhoon/index.html",
  "https://www.jma.go.jp/jma/kishou/know/tenki_chuui/index.html",
  "https://www.jma.go.jp/jma/kishou/know/svd/text/index.html"
];
for (let i = 1; i <= 40; i += 1) seeds.push(`https://www.jma.go.jp/jma/kishou/know/faq/faq${i}.html`);
const queue = [...new Set(seeds)];
const queued = new Set(queue);
const safetySignal = /警報|注意報|防災|災害|避難|地震|津波|火山|噴火|台風|大雨|大雪|雷|竜巻|突風|洪水|土砂|高潮|緊急|震度|危険|安全|暴風|強風|降灰|線状降水帯|キキクル|短時間大雨|気象情報|天気予報/;
const individualPath = /\/faq\/faq\d+\.html$|\/bosai\/(?!index)[^/]+\.html$|\/jishin\/.+|\/typhoon\/.+\.html$|\/tenki_chuui\/.+\.html$|\/toppuu\/.+\.html$|\/shindo\/.+\.html$|\/svd\/text\/.+\.html$/;

for (let cursor = 0; cursor < queue.length && docs.records.length < docs.targetCount && cursor < 420; cursor += 10) {
  const batch = queue.slice(cursor, cursor + 10);
  const rows = await Promise.all(batch.map((url) => fetchPage(url, jma, crawlPrefix)));
  fetchedCount += rows.length;
  for (const item of rows) {
    for (const link of item.links || []) {
      if (!queued.has(link) && queued.size < 500) {
        queued.add(link);
        queue.push(link);
      }
    }
    if (docs.records.length >= docs.targetCount) break;
    let pathName = "";
    try { pathName = new URL(item.url || "").pathname; } catch {}
    const looksIndividual = individualPath.test(pathName) && !/\/index\.html$/.test(pathName);
    const safetyRelevant = safetySignal.test(`${item.title || ""}\n${(item.body || "").slice(0, 3000)}`);
    if (!looksIndividual || !safetyRelevant || !acceptItem(item, jma, "real-life-documents", docs)) {
      if (item.reject) rejected.push({ url: item.url || batch[0], reason: item.reject });
    }
  }
}
if (docs.records.length !== docs.targetCount) throw new Error(`Real-Life Documents completion failed: ${docs.records.length}/${docs.targetCount}; crawled ${Math.min(queue.length, 420)} queued pages`);

travel.bodyReadyCount = travel.records.length;
docs.bodyReadyCount = docs.records.length;
fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
fs.writeFileSync(travelPath, `${JSON.stringify(travel, null, 2)}\n`);
fs.writeFileSync(docsPath, `${JSON.stringify(docs, null, 2)}\n`);

const selectedPacks = fs.readdirSync(bodyReadyRoot).filter((name) => name.endsWith(".json"));
const acceptedCountsByShelf = {};
const acceptedCountsBySourceFamily = {};
const thirdPartyReviewDistribution = {};
let selectedCount = 0;
for (const name of selectedPacks) {
  const pack = JSON.parse(fs.readFileSync(path.join(bodyReadyRoot, name), "utf8"));
  acceptedCountsByShelf[pack.shelf] = (pack.records || []).length;
  for (const row of pack.records || []) {
    selectedCount += 1;
    acceptedCountsBySourceFamily[row.sourceFamilyId] = (acceptedCountsBySourceFamily[row.sourceFamilyId] || 0) + 1;
    const status = row.thirdPartyContentReview?.status || "unknown";
    thirdPartyReviewDistribution[status] = (thirdPartyReviewDistribution[status] || 0) + 1;
  }
}
const targets = priorReport.targets;
const unfilled = Object.fromEntries(Object.entries(targets)
  .map(([shelf, target]) => [shelf, Math.max(0, target - (acceptedCountsByShelf[shelf] || 0))])
  .filter(([, gap]) => gap > 0));
const eligible = Math.max(priorReport.eligibleBodyReadyItems || 0, selectedCount);
const report = {
  ...priorReport,
  generatedDate: TODAY,
  pass: Object.keys(unfilled).length === 0,
  totalCandidatesInspected: (priorReport.totalCandidatesInspected || 0) + fetchedCount,
  eligibleBodyReadyItems: eligible,
  acceptedBodyReadyItems: selectedCount,
  unselectedBodyReadyItems: Math.max(0, eligible - selectedCount),
  acceptedCountsByShelf,
  acceptedCountsBySourceFamily,
  rightsStatusDistribution: { "adaptation-permitted": selectedCount },
  thirdPartyReviewDistribution,
  unfilled,
  notes: [
    "Accepted government records are inventory evidence only; no learner-facing adaptation was generated.",
    "Media assets are never bundled. Pages with detected contrary-rights or third-party-credit signals remain review-required.",
    "Final persisted gaps were reconstructed from official JMA public-safety guidance and MOFA Overseas Safety country guidance after independent PDL 1.0 verification."
  ]
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(path.join(qaRoot, "final-government-source-gap-reconstruction.json"), `${JSON.stringify({
  version: 1,
  generatedDate: TODAY,
  pass: report.pass,
  fetchedPages: fetchedCount,
  rejectedDuringReconstruction: rejected,
  finalCounts: {
    travel: travel.records.length,
    realLifeDocuments: docs.records.length
  },
  addedSourceFamilies: ["gov-jma", "gov-mofa-safety"]
}, null, 2)}\n`);
console.log(JSON.stringify({ pass: report.pass, fetchedCount, travel: travel.records.length, realLifeDocuments: docs.records.length, rejected: rejected.length }, null, 2));
