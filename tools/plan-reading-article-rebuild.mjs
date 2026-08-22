import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readingRoot = path.join(root, "data", "reading");
const articleRoot = path.join(readingRoot, "articles");
const qaRoot = path.join(readingRoot, "qa");
const manifest = JSON.parse(fs.readFileSync(path.join(articleRoot, "manifest.json"), "utf8"));
const sourcePack = JSON.parse(fs.readFileSync(path.join(readingRoot, "body-ready", "articles.json"), "utf8"));
const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const TOPICS = ["beauty", "food", "travel", "digital", "consumer", "health", "environment", "culture", "work", "society"];

function countBy(rows, key) {
  const out = {};
  for (const row of rows) {
    const value = typeof key === "function" ? key(row) : row?.[key];
    const name = String(value ?? "unknown");
    out[name] = (out[name] || 0) + 1;
  }
  return out;
}

const slots = [];
for (const level of LEVELS) {
  for (const file of manifest.levelFiles?.[level] || []) {
    const rows = JSON.parse(fs.readFileSync(path.join(articleRoot, file), "utf8"));
    if (!Array.isArray(rows) || rows.length !== 10) throw new Error(`${file}: expected 10 Article slots`);
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      slots.push({
        articleId: row.id,
        pack: file,
        packIndex: index,
        jlpt: row.jlpt,
        topic: row.topic,
        legacyTitle: row.title,
        legacySourceUrl: row.sourceUrl || null,
      });
    }
  }
}
const sources = Array.isArray(sourcePack?.records) ? sourcePack.records : [];
const errors = [];
if (slots.length !== 300) errors.push(`expected 300 stable Article slots, got ${slots.length}`);
if (sources.length !== 300) errors.push(`expected 300 balanced sources, got ${sources.length}`);
if (new Set(slots.map((x) => x.articleId)).size !== slots.length) errors.push("Article slot IDs are not unique");
if (new Set(sources.map((x) => x.candidateId)).size !== sources.length) errors.push("source candidate IDs are not unique");
if (new Set(sources.map((x) => x.sourceUrl)).size !== sources.length) errors.push("source URLs are not unique");
if (new Set(sources.map((x) => x.sourceBodyFingerprint)).size !== sources.length) errors.push("source bodies are not unique");
for (const topic of TOPICS) {
  const slotCount = slots.filter((x) => x.topic === topic).length;
  const sourceCount = sources.filter((x) => x.articleTopic === topic).length;
  if (slotCount !== 30) errors.push(`${topic}: expected 30 stable slots, got ${slotCount}`);
  if (sourceCount !== 30) errors.push(`${topic}: expected 30 verified sources, got ${sourceCount}`);
}
for (const level of LEVELS) {
  const count = slots.filter((x) => x.jlpt === level).length;
  if (count !== 60) errors.push(`${level}: expected 60 stable slots, got ${count}`);
}
if (errors.length) throw new Error(errors.join("\n"));

const plan = [];
let preservedLegacySourcePairings = 0;
for (const topic of TOPICS) {
  const topicSlots = slots.filter((x) => x.topic === topic);
  const topicSources = sources.filter((x) => x.articleTopic === topic);
  const remainingSources = new Map(topicSources.map((source) => [source.candidateId, source]));
  const sourceByUrl = new Map(topicSources.map((source) => [source.sourceUrl, source]));
  const assignedSlots = new Set();

  // Preserve an old slot/source pairing when that exact verified source survived the final
  // topic-balanced inventory. This maximizes continuity while keeping every source unique.
  for (const slot of topicSlots) {
    const source = slot.legacySourceUrl ? sourceByUrl.get(slot.legacySourceUrl) : null;
    if (!source || !remainingSources.has(source.candidateId)) continue;
    plan.push({ slot, source, assignmentReason: "preserved-verified-legacy-source" });
    remainingSources.delete(source.candidateId);
    assignedSlots.add(slot.articleId);
    preservedLegacySourcePairings += 1;
  }

  // For the remaining slots, give lower study-support levels the shorter verified source
  // bodies first. This is only a generation heuristic: source pages themselves are not JLPT graded.
  const freeSlots = topicSlots.filter((slot) => !assignedSlots.has(slot.articleId)).sort((a, b) => {
    return LEVELS.indexOf(a.jlpt) - LEVELS.indexOf(b.jlpt)
      || a.pack.localeCompare(b.pack)
      || a.packIndex - b.packIndex
      || a.articleId.localeCompare(b.articleId);
  });
  const freeSources = [...remainingSources.values()].sort((a, b) => {
    return Number(a.sourceTextCharacterCount || 0) - Number(b.sourceTextCharacterCount || 0)
      || Number(b.topicScore || 0) - Number(a.topicScore || 0)
      || String(a.sourceUrl).localeCompare(String(b.sourceUrl));
  });
  if (freeSlots.length !== freeSources.length) throw new Error(`${topic}: free slot/source mismatch`);
  for (let index = 0; index < freeSlots.length; index += 1) {
    plan.push({ slot: freeSlots[index], source: freeSources[index], assignmentReason: "topic-balanced-size-to-study-level" });
  }
}

const mappings = plan.map(({ slot, source, assignmentReason }) => ({
  articleId: slot.articleId,
  pack: slot.pack,
  packIndex: slot.packIndex,
  jlpt: slot.jlpt,
  topic: slot.topic,
  legacyTitle: slot.legacyTitle,
  legacySourceUrl: slot.legacySourceUrl,
  assignmentReason,
  sourceCandidateId: source.candidateId,
  sourceFamilyId: source.sourceFamilyId,
  sourcePublisher: source.sourcePublisher,
  sourceTitle: source.sourceTitle,
  sourceUrl: source.sourceUrl,
  sourcePublishedDate: source.sourcePublishedDate ?? null,
  sourceRetrievedDate: source.sourceRetrievedDate ?? null,
  sourceTextCharacterCount: Number(source.sourceTextCharacterCount || 0),
  sourceBodyFingerprint: source.sourceBodyFingerprint,
  rightsStatus: source.rightsStatus,
})).sort((a, b) => LEVELS.indexOf(a.jlpt) - LEVELS.indexOf(b.jlpt)
  || a.pack.localeCompare(b.pack)
  || a.packIndex - b.packIndex);

const sourceIds = new Set(mappings.map((x) => x.sourceCandidateId));
const sourceUrls = new Set(mappings.map((x) => x.sourceUrl));
const sourceBodies = new Set(mappings.map((x) => x.sourceBodyFingerprint));
const mappedIds = new Set(mappings.map((x) => x.articleId));
const finalErrors = [];
if (mappings.length !== 300) finalErrors.push(`expected 300 mappings, got ${mappings.length}`);
if (mappedIds.size !== 300) finalErrors.push(`expected 300 mapped stable IDs, got ${mappedIds.size}`);
if (sourceIds.size !== 300) finalErrors.push(`expected 300 unique source IDs, got ${sourceIds.size}`);
if (sourceUrls.size !== 300) finalErrors.push(`expected 300 unique source URLs, got ${sourceUrls.size}`);
if (sourceBodies.size !== 300) finalErrors.push(`expected 300 unique source bodies, got ${sourceBodies.size}`);
for (const topic of TOPICS) if (mappings.filter((x) => x.topic === topic).length !== 30) finalErrors.push(`${topic}: final mapping is not 30`);
for (const level of LEVELS) if (mappings.filter((x) => x.jlpt === level).length !== 60) finalErrors.push(`${level}: final mapping is not 60`);

const report = {
  version: 2,
  generatedDate: new Date().toISOString().slice(0, 10),
  pass: finalErrors.length === 0,
  policy: "Final learner rewrite mapping uses the already-verified articleTopic classification from the balanced 300-source pack. Stable Article IDs/slots are preserved. Exact verified legacy source pairings are retained where possible; otherwise sources stay inside their approved topic and are assigned deterministically, with shorter source bodies preferentially mapped to lower Sakura study-support levels.",
  articleSlots: mappings.length,
  uniqueArticleIds: mappedIds.size,
  uniqueSourceCandidateIds: sourceIds.size,
  uniqueSourceUrls: sourceUrls.size,
  uniqueSourceBodies: sourceBodies.size,
  preservedLegacySourcePairings,
  byLevel: countBy(mappings, "jlpt"),
  byTopic: countBy(mappings, "topic"),
  byAssignmentReason: countBy(mappings, "assignmentReason"),
  errors: finalErrors,
  mappings,
};
fs.mkdirSync(qaRoot, { recursive: true });
fs.writeFileSync(path.join(qaRoot, "article-rebuild-plan.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  pass: report.pass,
  articleSlots: report.articleSlots,
  uniqueSourceUrls: report.uniqueSourceUrls,
  uniqueSourceBodies: report.uniqueSourceBodies,
  preservedLegacySourcePairings,
  byLevel: report.byLevel,
  byTopic: report.byTopic,
  errors: report.errors,
}, null, 2));
if (!report.pass) process.exitCode = 1;
