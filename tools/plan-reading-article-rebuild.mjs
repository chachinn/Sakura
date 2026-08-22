import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readingRoot = path.join(root, "data", "reading");
const articleRoot = path.join(readingRoot, "articles");
const qaRoot = path.join(readingRoot, "qa");
const manifest = JSON.parse(fs.readFileSync(path.join(articleRoot, "manifest.json"), "utf8"));
const bodyReady = JSON.parse(fs.readFileSync(path.join(readingRoot, "body-ready", "articles.json"), "utf8"));
const sources = Array.isArray(bodyReady?.records) ? bodyReady.records : [];
const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const TOPICS = ["beauty", "food", "travel", "digital", "consumer", "health", "environment", "culture", "work", "society"];
const TOPIC_CAPACITY = 30;

const TOPIC_RULES = {
  beauty: [
    ["化粧",10],["美容",10],["香粧",10],["スキンケア",10],["コスメ",10],["毛髪",7],["ヘア",7],["シャンプー",7],["医薬部外品",5],["成分",3],["表示",2]
  ],
  food: [
    ["食育",10],["食品",8],["食事",8],["食料",8],["栄養",8],["食中毒",8],["飲食",7],["農業",6],["農林",6],["米",4],["野菜",4],["給食",6],["食品ロス",9],["賞味期限",8],["消費期限",8]
  ],
  travel: [
    ["観光",10],["旅行",10],["宿泊",9],["訪日",9],["旅行者",9],["旅客",8],["空港",8],["鉄道",8],["交通",7],["国立公園",8],["観光地",9],["ホテル",7],["旅",4]
  ],
  digital: [
    ["デジタル",10],["生成AI",10],["人工知能",10],["AI",8],["オンライン",8],["電子",6],["情報システム",9],["サイバー",9],["データ",7],["DX",8],["マイナンバー",9],["アプリ",6],["システム",5],["ICT",8]
  ],
  consumer: [
    ["消費者",10],["消費生活",10],["消費",7],["契約",8],["取引",8],["詐欺",9],["通販",8],["通信販売",9],["製品事故",9],["リコール",9],["回収",6],["価格",5],["広告",6],["表示",4],["購入",5]
  ],
  health: [
    ["健康",10],["医療",10],["疾病",9],["感染",9],["熱中症",9],["健診",9],["検診",9],["病院",8],["診療",8],["薬",5],["医薬品",8],["予防",7],["ワクチン",9],["介護",7],["生活習慣病",9],["患者",7],["保健",7],["衛生",6]
  ],
  environment: [
    ["環境",10],["気候",9],["脱炭素",9],["生物多様",9],["廃棄",8],["リサイクル",9],["循環",7],["自然",6],["水質",8],["大気",7],["温室効果",9],["エネルギー",6],["資源",6],["国立公園",6]
  ],
  culture: [
    ["文化",10],["芸術",10],["著作権",10],["博物館",9],["美術館",9],["文化財",10],["日本遺産",9],["漫画",9],["マンガ",9],["音楽",7],["映画",7],["伝統",7],["文学",8],["展覧会",8],["国語",6]
  ],
  work: [
    ["労働",10],["雇用",10],["職場",9],["求人",9],["仕事",8],["賃金",9],["働",7],["事業者",6],["企業",6],["産業",6],["人材",7],["生産性",8],["就業",8],["就職",8],["勤務",8],["職業",8],["安全衛生",7]
  ],
  society: [
    ["子ども",10],["こども",10],["子育て",10],["家庭",8],["福祉",9],["社会",7],["自治体",6],["人口",7],["少子",9],["若者",8],["児童",9],["保育",9],["支援",5],["障害",8],["生活支援",8],["ひとり親",9],["母子",8],["高齢",7]
  ],
};
const FAMILY_PRIORS = {
  "gov-caa": { consumer: 8, food: 3, beauty: 2 },
  "gov-digital": { digital: 10, society: 2 },
  "gov-maff": { food: 8, environment: 3, work: 2 },
  "gov-cfa": { society: 10 },
  "gov-bunka": { culture: 12 },
  "gov-env": { environment: 10, travel: 3 },
  "gov-mhlw": { health: 5, work: 3, society: 2, beauty: 1, food: 1 },
};

function normalize(value) {
  return String(value || "").normalize("NFKC").toLowerCase();
}
function termCount(text, term) {
  if (!term) return 0;
  let count = 0;
  let start = 0;
  while (true) {
    const found = text.indexOf(term.toLowerCase(), start);
    if (found < 0) return count;
    count += 1;
    start = found + Math.max(1, term.length);
  }
}
function sourceScore(source, topic) {
  const title = normalize(source.sourceTitle);
  const body = normalize(source.sourceJapaneseSubstance).slice(0, 9000);
  const rules = TOPIC_RULES[topic] || [];
  let score = Number(FAMILY_PRIORS[source.sourceFamilyId]?.[topic] || 0);
  const matches = [];
  for (const [rawTerm, weight] of rules) {
    const term = normalize(rawTerm);
    const inTitle = termCount(title, term);
    const inBody = Math.min(4, termCount(body, term));
    if (!inTitle && !inBody) continue;
    const contribution = inTitle * weight * 4 + inBody * weight;
    score += contribution;
    matches.push({ term: rawTerm, titleHits: inTitle, bodyHits: inBody, contribution });
  }
  return { score, matches: matches.sort((a,b)=>b.contribution-a.contribution).slice(0,6) };
}
function sourceSort(a, b) {
  return Number(a.inventoryPosition || 0) - Number(b.inventoryPosition || 0) || String(a.candidateId).localeCompare(String(b.candidateId));
}
function countBy(rows, getter) {
  const out = {};
  for (const row of rows) {
    const key = String(getter(row) || "unknown");
    out[key] = (out[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort((a,b)=>a[0].localeCompare(b[0])));
}

const slots = [];
for (const level of LEVELS) {
  for (const file of manifest.levelFiles?.[level] || []) {
    const rows = JSON.parse(fs.readFileSync(path.join(articleRoot, file), "utf8"));
    for (const row of rows) slots.push({
      articleId: row.id,
      pack: file,
      jlpt: row.jlpt,
      topic: row.topic,
      legacySourceUrl: row.sourceUrl,
      legacyTitle: row.title,
    });
  }
}
if (slots.length !== 300) throw new Error(`Expected 300 Article slots, got ${slots.length}`);
if (sources.length !== 300) throw new Error(`Expected 300 body-ready Article sources, got ${sources.length}`);
for (const topic of TOPICS) {
  const count = slots.filter((slot) => slot.topic === topic).length;
  if (count !== TOPIC_CAPACITY) throw new Error(`Expected ${TOPIC_CAPACITY} ${topic} slots, got ${count}`);
}
for (const level of LEVELS) {
  const count = slots.filter((slot) => slot.jlpt === level).length;
  if (count !== 60) throw new Error(`Expected 60 ${level} slots, got ${count}`);
}
const actualSlotMatrix = Object.fromEntries(TOPICS.map((topic) => [topic, countBy(slots.filter((slot)=>slot.topic===topic), (slot)=>slot.jlpt)]));

const matrix = new Map();
for (const source of sources) {
  matrix.set(source.candidateId, Object.fromEntries(TOPICS.map((topic) => [topic, sourceScore(source, topic)])));
}

// Capacity-constrained greedy assignment. Sources with the strongest topic-specific evidence
// are reserved first; every source is assigned exactly once and every topic receives 30.
const capacity = Object.fromEntries(TOPICS.map((topic) => [topic, TOPIC_CAPACITY]));
const unassigned = new Set(sources.map((source) => source.candidateId));
const assignmentByTopic = Object.fromEntries(TOPICS.map((topic) => [topic, []]));
const pairCandidates = [];
for (const source of sources) {
  const scores = matrix.get(source.candidateId);
  const ranked = TOPICS.map((topic) => ({ topic, score: scores[topic].score })).sort((a,b)=>b.score-a.score || a.topic.localeCompare(b.topic));
  const best = ranked[0]?.score || 0;
  const second = ranked[1]?.score || 0;
  for (const topic of TOPICS) {
    pairCandidates.push({
      source,
      topic,
      score: scores[topic].score,
      evidence: scores[topic].matches,
      specificity: best - second,
      bestTopic: ranked[0]?.topic || null,
      bestScore: best,
    });
  }
}
pairCandidates.sort((a,b) => b.score-a.score || b.specificity-a.specificity || sourceSort(a.source,b.source) || a.topic.localeCompare(b.topic));
for (const pair of pairCandidates) {
  if (!unassigned.has(pair.source.candidateId) || capacity[pair.topic] <= 0) continue;
  assignmentByTopic[pair.topic].push(pair);
  capacity[pair.topic] -= 1;
  unassigned.delete(pair.source.candidateId);
}
if (unassigned.size) throw new Error(`Could not capacity-assign ${unassigned.size} Article sources`);
if (Object.values(capacity).some((value) => value !== 0)) throw new Error(`Topic capacity remained: ${JSON.stringify(capacity)}`);

// Preserve the repo's actual stable learner ID/level/topic slot matrix. Source complexity is
// distributed deterministically within a topic, but the original source is never called JLPT-graded.
const plan = [];
for (const topic of TOPICS) {
  const topicSources = [...assignmentByTopic[topic]].sort((a,b) => {
    const aChars = Number(a.source.sourceTextCharacterCount || 0);
    const bChars = Number(b.source.sourceTextCharacterCount || 0);
    return aChars - bChars || b.score-a.score || sourceSort(a.source,b.source);
  });
  const topicSlots = slots.filter((slot) => slot.topic === topic).sort((a,b) => {
    const levelDiff = LEVELS.indexOf(a.jlpt) - LEVELS.indexOf(b.jlpt);
    return levelDiff || a.articleId.localeCompare(b.articleId);
  });
  for (let i = 0; i < topicSlots.length; i += 1) {
    const slot = topicSlots[i];
    const pair = topicSources[i];
    plan.push({
      articleId: slot.articleId,
      pack: slot.pack,
      jlpt: slot.jlpt,
      topic,
      legacyTitle: slot.legacyTitle,
      legacySourceUrl: slot.legacySourceUrl,
      sourceCandidateId: pair.source.candidateId,
      sourceFamilyId: pair.source.sourceFamilyId,
      sourcePublisher: pair.source.sourcePublisher,
      sourceTitle: pair.source.sourceTitle,
      sourceUrl: pair.source.sourceUrl,
      sourcePublishedDate: pair.source.sourcePublishedDate || null,
      sourceTextCharacterCount: Number(pair.source.sourceTextCharacterCount || 0),
      sourceBodyFingerprint: pair.source.sourceBodyFingerprint,
      rightsStatus: pair.source.rightsStatus,
      topicScore: pair.score,
      sourceBestTopic: pair.bestTopic,
      sourceBestTopicScore: pair.bestScore,
      assignmentMatchesBestTopic: pair.bestTopic === topic,
      evidence: pair.evidence,
    });
  }
}

const sourceIds = new Set(plan.map((row) => row.sourceCandidateId));
const sourceUrls = new Set(plan.map((row) => row.sourceUrl));
const lowConfidence = plan.filter((row) => row.topicScore <= 5 || row.evidence.length === 0);
const contraryBestTopic = plan.filter((row) => !row.assignmentMatchesBestTopic && row.sourceBestTopicScore - row.topicScore >= 10);
const byTopic = Object.fromEntries(TOPICS.map((topic) => {
  const rows = plan.filter((row) => row.topic === topic);
  const scores = rows.map((row) => row.topicScore).sort((a,b)=>a-b);
  const middle = Math.floor(scores.length / 2);
  return [topic, {
    count: rows.length,
    actualLevelSlots: actualSlotMatrix[topic],
    scoreMinimum: Math.min(...scores),
    scoreMedian: scores.length % 2 ? scores[middle] : (scores[middle-1] + scores[middle]) / 2,
    scoreAverage: Math.round(scores.reduce((a,b)=>a+b,0)/scores.length*10)/10,
    weakAssignments: rows.filter((row) => row.topicScore <= 5 || row.evidence.length === 0).length,
    contraryBestTopicAssignments: rows.filter((row) => !row.assignmentMatchesBestTopic && row.sourceBestTopicScore - row.topicScore >= 10).length,
    bySourceFamily: Object.fromEntries(Object.entries(rows.reduce((acc,row)=>{acc[row.sourceFamilyId]=(acc[row.sourceFamilyId]||0)+1;return acc;},{})).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))),
  }];
}));

const structurallyValid = plan.length === 300 && sourceIds.size === 300 && sourceUrls.size === 300 && TOPICS.every((topic) => plan.filter((row)=>row.topic===topic).length===30) && LEVELS.every((level)=>plan.filter((row)=>row.jlpt===level).length===60);
const semanticFitPass = lowConfidence.length === 0 && contraryBestTopic.length === 0;
const report = {
  version: 2,
  generatedDate: new Date().toISOString().slice(0,10),
  pass: structurallyValid,
  semanticFitPass,
  policy: "This is a planning artifact only. It must never force an unrelated source into a topic merely to preserve the historical 30-per-topic layout. Weak/contrary assignments are surfaced for source-inventory correction before learner text is generated.",
  strategy: "300 unique authoritative source bodies -> 300 stable learner Article slots; one source per Article; no source stitching",
  counts: {
    plannedArticles: plan.length,
    uniqueSourceCandidates: sourceIds.size,
    uniqueSourceUrls: sourceUrls.size,
    byLevel: Object.fromEntries(LEVELS.map((level)=>[level,plan.filter((row)=>row.jlpt===level).length])),
    byTopic: Object.fromEntries(TOPICS.map((topic)=>[topic,plan.filter((row)=>row.topic===topic).length])),
  },
  actualSlotMatrix,
  semanticFit: {
    pass: semanticFitPass,
    lowConfidenceCount: lowConfidence.length,
    contraryBestTopicCount: contraryBestTopic.length,
    note: semanticFitPass ? "All balanced assignments have direct topic evidence." : "Balanced historical topic quotas would force weak or contrary assignments. Expand/reclassify the source inventory before generating learner text.",
  },
  byTopic,
  lowConfidence: lowConfidence.map(({articleId,jlpt,topic,sourceCandidateId,sourceFamilyId,sourceTitle,sourceUrl,topicScore,sourceBestTopic,sourceBestTopicScore,evidence})=>({articleId,jlpt,topic,sourceCandidateId,sourceFamilyId,sourceTitle,sourceUrl,topicScore,sourceBestTopic,sourceBestTopicScore,evidence})),
  contraryBestTopic: contraryBestTopic.map(({articleId,jlpt,topic,sourceCandidateId,sourceFamilyId,sourceTitle,sourceUrl,topicScore,sourceBestTopic,sourceBestTopicScore,evidence})=>({articleId,jlpt,topic,sourceCandidateId,sourceFamilyId,sourceTitle,sourceUrl,topicScore,sourceBestTopic,sourceBestTopicScore,evidence})),
  plan,
};
const out = path.join(qaRoot, "article-rebuild-plan.json");
fs.mkdirSync(qaRoot,{recursive:true});
fs.writeFileSync(out, `${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify({ pass:report.pass, semanticFitPass:report.semanticFitPass, counts:report.counts, actualSlotMatrix:report.actualSlotMatrix, semanticFit:report.semanticFit, byTopic:report.byTopic, lowConfidence:report.lowConfidence.slice(0,20), contraryBestTopic:report.contraryBestTopic.slice(0,20) }, null, 2));
if (!report.pass) process.exitCode = 1;
