import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readingRoot = path.join(root, "data", "reading");
const registryPath = path.join(readingRoot, "source-registry.json");
const discoveryPath = path.join(root, "tools", "discover-reading-article-topic-sources.mjs");

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const pmda = {
  sourceFamilyId: "gov-pmda",
  name: "Pharmaceuticals and Medical Devices Agency",
  domain: "www.pmda.go.jp",
  publisher: "独立行政法人医薬品医療機器総合機構",
  sourceType: "open-government",
  termsUrl: "https://www.pmda.go.jp/0048.html",
  licenseName: "Public Data License 1.0",
  licenseUrl: "https://www.digital.go.jp/resources/open_data/public_data_license_v1.0",
  allowedUse: ["copy", "public-transmission", "translation", "adaptation", "commercial-use"],
  fullTextAllowed: true,
  adaptationAllowed: true,
  attributionRequired: true,
  modificationDisclosureRequired: true,
  thirdPartyAssetWarning: true,
  approvedPathPatterns: [
    "^/review-services/drug-reviews/about-reviews/q-drugs/",
    "^/safety/info-services/qdrugs-cosmetics/",
    "^/safety/reports/mah/0005\\.html$"
  ],
  excludedContent: [
    "logos",
    "symbols",
    "characters",
    "third-party photographs",
    "third-party videos",
    "manufacturer-authored application summaries and review-report content",
    "databases or services governed by separate terms",
    "content with a separate rights notice"
  ],
  notes: "PMDA site policy applies PDL 1.0 unless otherwise indicated. Reading Garden approval is restricted to PMDA-authored HTML guidance/index pages in the listed cosmetics/quasi-drug paths. PDF review reports, manufacturer-authored application materials, separately governed databases/services, and any item with contrary rights text are excluded.",
  verifiedDate: "2026-08-22"
};
if (!registry.sourceFamilies.some((family) => family.sourceFamilyId === pmda.sourceFamilyId)) {
  registry.sourceFamilies.push(pmda);
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
}

let source = fs.readFileSync(discoveryPath, "utf8");
const replacements = [
  [
    'const existingBodyReady = JSON.parse(fs.readFileSync(path.join(readingRoot, "body-ready", "articles.json"), "utf8"));',
    'const existingBodyReady = JSON.parse(fs.readFileSync(path.join(readingRoot, "body-ready", "articles.json"), "utf8"));\nconst reservedCrossShelfUrls = new Set();\nconst reservedCrossShelfBodies = new Set();\nfor (const name of fs.readdirSync(path.join(readingRoot, "body-ready")).filter((name) => name.endsWith(".json") && name !== "articles.json")) {\n  const pack = JSON.parse(fs.readFileSync(path.join(readingRoot, "body-ready", name), "utf8"));\n  for (const row of pack.records || []) {\n    if (row.sourceUrl) reservedCrossShelfUrls.add(row.sourceUrl);\n    if (row.sourceBodyFingerprint) reservedCrossShelfBodies.add(row.sourceBodyFingerprint);\n  }\n}'
  ],
  [
    '  "gov-mhlw": { beauty:5, health:10, work:7, society:5, food:2 },',
    '  "gov-mhlw": { beauty:5, health:10, work:7, society:5, food:2 },\n  "gov-pmda": { beauty:14, health:4 },'
  ],
  [
    '    families:["gov-mhlw","gov-caa"],',
    '    families:["gov-mhlw","gov-caa","gov-pmda"],'
  ],
  [
    '      "https://www.caa.go.jp/business/labeling/",',
    '      "https://www.pmda.go.jp/review-services/drug-reviews/about-reviews/q-drugs/0002.html",\n      "https://www.pmda.go.jp/review-services/drug-reviews/about-reviews/q-drugs/0003.html",\n      "https://www.pmda.go.jp/review-services/drug-reviews/about-reviews/q-drugs/0004.html",\n      "https://www.pmda.go.jp/review-services/drug-reviews/about-reviews/q-drugs/0005.html",\n      "https://www.pmda.go.jp/review-services/drug-reviews/about-reviews/q-drugs/0006.html",\n      "https://www.pmda.go.jp/safety/info-services/qdrugs-cosmetics/0001.html",\n      "https://www.pmda.go.jp/safety/info-services/qdrugs-cosmetics/0002.html",\n      "https://www.pmda.go.jp/safety/info-services/qdrugs-cosmetics/0003.html",\n      "https://www.pmda.go.jp/safety/info-services/qdrugs-cosmetics/0004.html",\n      "https://www.pmda.go.jp/safety/reports/mah/0005.html",\n      "https://www.caa.go.jp/business/labeling/",'
  ],
  [
    '  const fingerprint = sha256(normalizeBody(body));',
    '  const fingerprint = sha256(normalizeBody(body));\n  if (reservedCrossShelfUrls.has(page.url)) { rejected.push({url:page.url,topic:discoveredForTopic,reason:"cross-shelf-duplicate-url"}); return false; }\n  if (reservedCrossShelfBodies.has(fingerprint)) { rejected.push({url:page.url,topic:discoveredForTopic,reason:"cross-shelf-duplicate-body"}); return false; }'
  ]
];
for (const [before, after] of replacements) {
  if (source.includes(after)) continue;
  if (!source.includes(before)) throw new Error(`Discovery patch anchor missing: ${before.slice(0, 90)}`);
  source = source.replace(before, after);
}
fs.writeFileSync(discoveryPath, source);
console.log(JSON.stringify({pass:true,pmdaRegistered:true,crossShelfReservation:true}, null, 2));
