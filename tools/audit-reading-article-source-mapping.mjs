import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readingRoot = path.join(root, "data", "reading");
const articleRoot = path.join(readingRoot, "articles");
const bodyReadyPath = path.join(readingRoot, "body-ready", "articles.json");
const qaPath = path.join(readingRoot, "qa", "article-source-mapping-report.json");
const manifest = JSON.parse(fs.readFileSync(path.join(articleRoot, "manifest.json"), "utf8"));
const bodyReady = JSON.parse(fs.readFileSync(bodyReadyPath, "utf8"));
const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const errors = [];
const warnings = [];
const articles = [];
const sourceRows = Array.isArray(bodyReady?.records) ? bodyReady.records : [];

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || ""));
    url.hash = "";
    if (url.pathname !== "/" && url.pathname.endsWith("/")) url.pathname = url.pathname.replace(/\/+$/, "");
    const params = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
    url.search = "";
    for (const [key, val] of params) url.searchParams.append(key, val);
    return url.toString();
  } catch {
    return String(value || "").trim();
  }
}
function jpCount(value) {
  return (String(value || "").match(/[ぁ-んァ-ヶ一-龯々〆〤]/g) || []).length;
}
function bodyFingerprint(value) {
  return crypto.createHash("sha256")
    .update(String(value || "").normalize("NFKC").replace(/\s+/g, "").replace(/[「」『』（）()。、，．・：:;；!?！？]+/g, ""))
    .digest("hex");
}
function stats(values) {
  if (!values.length) return { minimum: 0, median: 0, average: 0, maximum: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  return {
    minimum: Math.min(...values),
    median: Math.round(median * 10) / 10,
    average: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 10) / 10,
    maximum: Math.max(...values),
  };
}

for (const level of LEVELS) {
  for (const name of manifest.levelFiles?.[level] || []) {
    const rows = JSON.parse(fs.readFileSync(path.join(articleRoot, name), "utf8"));
    for (const row of rows) articles.push({ ...row, _pack: name });
  }
}
if (articles.length !== 300) errors.push(`Expected 300 current Articles, got ${articles.length}`);
if (sourceRows.length < 300) errors.push(`Body-ready Article inventory is unexpectedly small: ${sourceRows.length}`);

const byExact = new Map();
const byNormalized = new Map();
for (const row of sourceRows) {
  const exact = String(row?.sourceUrl || "");
  if (!byExact.has(exact)) byExact.set(exact, []);
  byExact.get(exact).push(row);
  const normalized = normalizeUrl(exact);
  if (!byNormalized.has(normalized)) byNormalized.set(normalized, []);
  byNormalized.get(normalized).push(row);
}

const mappings = [];
const matchedSourceIds = new Set();
for (const article of articles) {
  const sourceUrl = String(article?.sourceUrl || "");
  let candidates = byExact.get(sourceUrl) || [];
  let matchMode = "exact";
  if (!candidates.length) {
    candidates = byNormalized.get(normalizeUrl(sourceUrl)) || [];
    matchMode = "normalized";
  }
  if (!candidates.length) {
    errors.push(`${article.id}: no body-ready source row for ${sourceUrl}`);
    mappings.push({ articleId: article.id, pack: article._pack, jlpt: article.jlpt, sourceUrl, status: "missing" });
    continue;
  }
  if (candidates.length > 1) {
    errors.push(`${article.id}: ${candidates.length} body-ready rows match ${sourceUrl}`);
    mappings.push({ articleId: article.id, pack: article._pack, jlpt: article.jlpt, sourceUrl, status: "ambiguous", matchCount: candidates.length });
    continue;
  }
  const source = candidates[0];
  const body = String(source?.sourceJapaneseSubstance || "").trim();
  const sourceChars = jpCount(body);
  const expectedFingerprint = String(source?.sourceBodyFingerprint || "");
  const calculatedFingerprint = bodyFingerprint(body);
  if (!body || sourceChars < 320) errors.push(`${article.id}: matched body-ready source is too thin (${sourceChars} Japanese chars)`);
  if (expectedFingerprint && expectedFingerprint !== calculatedFingerprint) errors.push(`${article.id}: body-ready source fingerprint mismatch`);
  if (source?.sourceBodyExtractionStatus !== "body-ready") errors.push(`${article.id}: matched source is not body-ready`);
  if (!source?.rightsStatus || !source?.sourceFamilyId) errors.push(`${article.id}: matched source rights metadata incomplete`);
  if (article.sourceFamilyId && source.sourceFamilyId && article.sourceFamilyId !== source.sourceFamilyId) {
    warnings.push(`${article.id}: current Article sourceFamilyId ${article.sourceFamilyId} differs from body-ready ${source.sourceFamilyId}`);
  }
  const sourceKey = source.candidateId || expectedFingerprint || calculatedFingerprint;
  if (matchedSourceIds.has(sourceKey)) warnings.push(`${article.id}: body-ready source is shared by more than one current Article`);
  matchedSourceIds.add(sourceKey);
  mappings.push({
    articleId: article.id,
    pack: article._pack,
    jlpt: article.jlpt,
    topic: article.topic,
    sourceUrl,
    sourceFamilyId: source.sourceFamilyId,
    sourceCandidateId: source.candidateId || null,
    sourcePublisher: source.sourcePublisher,
    sourceTitle: source.sourceTitle,
    sourceTextCharacterCount: sourceChars,
    sourceBodyFingerprint: expectedFingerprint || calculatedFingerprint,
    rightsStatus: source.rightsStatus,
    matchMode,
    status: "matched",
  });
}

const matched = mappings.filter((row) => row.status === "matched");
const byLevel = Object.fromEntries(LEVELS.map((level) => {
  const rows = matched.filter((row) => row.jlpt === level);
  return [level, {
    articles: rows.length,
    sourceJapaneseCharacters: stats(rows.map((row) => row.sourceTextCharacterCount)),
  }];
}));
const byFamily = {};
for (const row of matched) byFamily[row.sourceFamilyId] = (byFamily[row.sourceFamilyId] || 0) + 1;

const report = {
  version: 1,
  generatedDate: new Date().toISOString().slice(0, 10),
  pass: errors.length === 0 && matched.length === 300,
  policy: "Every final Article must map to one verified body-ready source body before learner adaptation. No source stitching is permitted.",
  articleCount: articles.length,
  bodyReadyInventoryCount: sourceRows.length,
  matchedArticles: matched.length,
  uniqueMatchedSourceRows: matchedSourceIds.size,
  matchModes: {
    exact: matched.filter((row) => row.matchMode === "exact").length,
    normalized: matched.filter((row) => row.matchMode === "normalized").length,
  },
  sourceBodyCharacters: stats(matched.map((row) => row.sourceTextCharacterCount)),
  byLevel,
  bySourceFamily: Object.fromEntries(Object.entries(byFamily).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  errors,
  warnings,
  mappings,
};
fs.mkdirSync(path.dirname(qaPath), { recursive: true });
fs.writeFileSync(qaPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  pass: report.pass,
  articleCount: report.articleCount,
  bodyReadyInventoryCount: report.bodyReadyInventoryCount,
  matchedArticles: report.matchedArticles,
  uniqueMatchedSourceRows: report.uniqueMatchedSourceRows,
  matchModes: report.matchModes,
  sourceBodyCharacters: report.sourceBodyCharacters,
  byLevel: report.byLevel,
  bySourceFamily: report.bySourceFamily,
  errors: report.errors,
  warnings: report.warnings,
}, null, 2));
if (!report.pass) process.exitCode = 1;
