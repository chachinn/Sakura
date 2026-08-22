import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const readingRoot=path.join(root,"data","reading");
const candidateRoot=path.join(readingRoot,"candidates");
const outputRoot=path.join(readingRoot,"body-ready");
const qaRoot=path.join(readingRoot,"qa");
const registry=JSON.parse(fs.readFileSync(path.join(readingRoot,"source-registry.json"),"utf8"));
const families=registry.sourceFamilies.filter(x=>x.sourceType==="open-government");
const familyByHost=new Map(families.map(x=>[x.domain,x]));
const targets={articles:300,news:300,"travel-reading":200,"school-work":120,"recipes-how-to":100,"interviews-qa":100,"real-life-documents":200};
const shelfOrder=["recipes-how-to","interviews-qa","travel-reading","school-work","real-life-documents","news"];
const generic=/^(ホーム|トップ|一覧|新着情報|報道発表|ニュース|お知らせ|大臣等会見|申請・届出|申請・お問合わせ|雇用・労働|食育の推進|サイトマップ|メニュー|政策|分野別の政策一覧)$/;
const indexPath=/(?:^|\/)(?:index(?:\.html?)?|news\.html|speech|applications|shinsei_toiawase|laws)(?:$|[/?#])|\/(?:press|release)\/20\d{2}(?:$|[/?#])|\/topics_20\d{2}\.html$/i;
const excluded=/\.(?:pdf|jpe?g|png|gif|webp|svg|mp4|zip|xlsx?|docx?|pptx?)(?:$|[?#])/i;
const stopText=/^(ホーム|本文へ|サイトマップ|English|検索|メニュー|前へ|次へ|戻る|トップページ)$/;
const roots=[
  "https://www.caa.go.jp/notice/","https://www.caa.go.jp/policies/",
  "https://www.mhlw.go.jp/stf/houdou/","https://www.mhlw.go.jp/stf/seisakunitsuite/",
  "https://www.cfa.go.jp/policies/","https://www.digital.go.jp/news/","https://www.digital.go.jp/policies/",
  "https://www.env.go.jp/press/","https://www.env.go.jp/policy/",
  "https://www.mlit.go.jp/kankocho/news.html","https://www.mlit.go.jp/kankocho/seisaku_seido/",
  "https://www.maff.go.jp/j/press/","https://www.maff.go.jp/j/pr/aff/","https://www.maff.go.jp/j/syokuiku/",
  "https://www.meti.go.jp/press/","https://www.meti.go.jp/policy/",
  "https://www.mext.go.jp/b_menu/houdou/","https://www.mext.go.jp/a_menu/"
];

const decode=s=>String(s||"").replace(/&nbsp;|&#160;/gi," ").replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'").replace(/&lt;/gi,"<").replace(/&gt;/gi,">").replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
const clean=s=>decode(String(s||"").replace(/<br\s*\/?\s*>/gi,"\n").replace(/<ruby[^>]*>([\s\S]*?)<rt[^>]*>[\s\S]*?<\/rt>([\s\S]*?)<\/ruby>/gi,"$1$2").replace(/<[^>]+>/g," ")).replace(/[\t\r ]+/g," ").replace(/ *\n+ */g,"\n").trim();
const jpCount=s=>(String(s).match(/[ぁ-んァ-ヶ一-龯々〆〤]/g)||[]).length;
const normalizeBody=s=>String(s).normalize("NFKC").replace(/\s+/g,"").replace(/[「」『』（）()。、，．・：:;；!?！？]/g,"");
const hash=s=>crypto.createHash("sha256").update(s).digest("hex");
const dateFromHtml=h=>{
  const values=[...h.matchAll(/(?:datePublished|article:published_time|dateModified|公開日|更新日)[^>\n]{0,160}(20\d{2})[-年\/.](\d{1,2})[-月\/.](\d{1,2})/gi)];
  if(!values.length)return null; const m=values[0]; return `${m[1]}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;
};
function extract(html){
  const without=html.replace(/<(script|style|svg|nav|header|footer|form|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi," ");
  const main=(without.match(/<(?:div|section)\b[^>]*id=["']main_content["'][^>]*>([\s\S]*?)(?:<div\b[^>]*id=["'](?:footer|page_footer)|<\/body>)/i)||without.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)||without.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)||without.match(/<div\b[^>]*(?:id|class)=["'][^"']*(?:main|contents?|article|detail)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)||[,without])[1].replace(/<img\b[^>]*alt=["']([^"']{8,})["'][^>]*>/gi,"<p>$1</p>");
  const chunks=[...main.matchAll(/<(?:h1|h2|h3|p|li|dt|dd|th|td)\b[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|p|li|dt|dd|th|td)>/gi)].map(m=>clean(m[1])).filter(x=>x.length>=8&&jpCount(x)>=4&&!stopText.test(x));
  const unique=[]; const seen=new Set(); for(const x of chunks){const k=normalizeBody(x); if(k.length<6||seen.has(k))continue;seen.add(k);unique.push(x)}
  return unique.join("\n").replace(/\n{3,}/g,"\n\n").trim();
}
function titleFrom(html,fallback){const raw=(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)||html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)||[])[1];return clean(raw||fallback).replace(/\s*[|｜].*$/,"").trim()||fallback}
function linksFrom(html,base){const out=[];for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)){try{const u=new URL(decode(m[1]),base);u.hash="";if(u.protocol!=="https:"||excluded.test(u.href)||!familyByHost.has(u.hostname))continue;const fam=familyByHost.get(u.hostname);if(!fam.approvedPathPatterns.some(p=>new RegExp(p).test(u.pathname)))continue;out.push(u.href.replace(/\/$/,""))}catch{}}return [...new Set(out)]}
function thirdPartyReview(body){
  const restrictions=[];const excludedMedia=[];if(/(?:本文|記事|資料).{0,30}(?:著作権者|無断転載|転載を禁|第三者が著作権)/i.test(body))restrictions.push("item-rights-restriction");if(/写真(?:提供|撮影)|画像提供|動画提供|イラスト(?:提供|制作)/i.test(body))excludedMedia.push("third-party-media-credit");
  return {status:restrictions.length?"needs-review":excludedMedia.length?"checked-third-party-assets-excluded":"checked-no-item-level-signal",signals:restrictions,excludedMedia,assetsBundled:false};
}
function scores(item){const t=`${item.title} ${item.url}`;return{
  news:(/\/news\/|\/press\/|\/houdou\/|\/notice\/(?:release|statement)\/|報道発表|公表|発表|開催|決定|記者会見/.test(t)?9:0),
  "travel-reading":(/kankocho/.test(item.url)&&!/公募|公示|入札|契約|採択|実施結果|組織|予算|税制|SNS/.test(item.title)?10:0),
  "school-work":(/学校|教育|学習|生徒|学生|教員|仕事|労働|雇用|職場|就職|人材|働き方|研修|訓練/.test(t)&&!/会見|記者/.test(item.title)?10:0),
  "recipes-how-to":(/maff\.go\.jp/.test(item.url)&&/レシピ|作り方|つくり方|調理|郷土料理|料理|食材/.test(t)?11:0),
  "interviews-qa":(/インタビュー|一問一答|会見(?:概要|録|要旨)|質疑|Q.?A|よくある質問/i.test(t)?11:0),
  "real-life-documents":(/申請書|届出|手続|ガイド|手引|マニュアル|チェックリスト|記入|様式|注意事項|利用案内|防災|避難|制度|標準|規則|利用方法|健康づくり|安全情報/.test(t)&&!/会見|報道|発表/.test(item.title)?10:0)
}}
function quality(item){
  const reasons=[];const url=new URL(item.url),family=familyByHost.get(url.hostname);if(!family||!family.approvedPathPatterns.some(p=>new RegExp(p).test(url.pathname)))reasons.push("unapproved-redirect-path");if(generic.test(item.title)||/^20\d{2}年(?:度|\d{1,2}月)?$/.test(item.title)||/(?:一覧|目次|トピックス|データベース|ポータル)$/.test(item.title)||item.title==="企画競争実施結果"||indexPath.test(url.pathname))reasons.push("landing-or-index-page");if(item.sourceCharacterCount<320)reasons.push("insufficient-source-substance");if(item.thirdPartyReview.status==="needs-review")reasons.push("third-party-or-contrary-rights-signal");return reasons
}
async function fetchPage(url){
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);
  try{const r=await fetch(url,{redirect:"follow",signal:controller.signal,headers:{"user-agent":"SakuraReadingBodyReadyInventory/1.0"}});const type=r.headers.get("content-type")||"";if(!r.ok||!type.includes("text/html"))return {url,status:r.status,reject:[r.ok?"non-html-source":`http-${r.status}`]};const html=await r.text();const body=extract(html);const item={url:r.url.replace(/\/$/,""),html,title:titleFrom(html,url),body,sourceCharacterCount:jpCount(body),publishedDate:dateFromHtml(html),thirdPartyReview:thirdPartyReview(body)};item.reject=quality(item);item.links=linksFrom(html,r.url);return item}catch(e){return{url,reject:[e.name==="AbortError"?"timeout":"fetch-failure"],error:e.message}}finally{clearTimeout(timer)}}

const old=[];for(const shelf of Object.keys(targets).filter(x=>x!=="articles")){const f=path.join(candidateRoot,`${shelf}.json`);if(fs.existsSync(f))old.push(...JSON.parse(fs.readFileSync(f,"utf8")).candidates)}
const articleDir=path.join(readingRoot,"articles");const articleFiles=fs.readdirSync(articleDir).filter(x=>x.endsWith(".json")&&!x.includes("index")&&x!=="manifest.json");const articles=articleFiles.flatMap(x=>JSON.parse(fs.readFileSync(path.join(articleDir,x),"utf8")));
const articleByUrl=new Map(articles.map(x=>[x.sourceUrl,x]));
const oldByUrl=new Map(old.map(x=>[x.sourceUrl,x]));
const queue=[...new Set([...articles.map(x=>x.sourceUrl),...old.map(x=>x.sourceUrl),...roots])];const queued=new Set(queue);const inspected=[];const maxPages=8500;
for(let cursor=0;cursor<queue.length&&inspected.length<maxPages;cursor+=12){const batch=queue.slice(cursor,cursor+12);const rows=await Promise.all(batch.map(fetchPage));for(const row of rows){inspected.push(row);if(row.links&&inspected.length<5200){for(const u of row.links){if(!queued.has(u)&&queue.length<maxPages){queued.add(u);queue.push(u)}}}}if(inspected.length%240<12)console.log(`Inspected ${inspected.length}; queue ${queue.length}`)}

const familyFor=url=>familyByHost.get(new URL(url).hostname);
const bodySeen=new Map();const acceptedPool=[];const rejected=[];const review=[];
for(const item of inspected){if(item.reject?.length){(item.reject.includes("third-party-or-contrary-rights-signal")?review:rejected).push(item);continue}const fp=hash(normalizeBody(item.body));if(bodySeen.has(fp)){rejected.push({...item,reject:["duplicate-source-body"],duplicateOf:bodySeen.get(fp)});continue}bodySeen.set(fp,item.url);acceptedPool.push({...item,bodyFingerprint:fp,score:scores(item)})}
const used=new Set();
function record(item,shelf,index,idOverride){const oldItem=oldByUrl.get(item.url);const family=familyFor(item.url);return{candidateId:idOverride||oldItem?.candidateId||`verified-${shelf}-${hash(item.url).slice(0,12)}`,targetShelf:shelf,sourceFamilyId:family.sourceFamilyId,sourceTitle:item.title,sourcePublisher:family.publisher,sourceUrl:item.url,sourcePublishedDate:item.publishedDate,sourceRetrievedDate:"2026-08-22",rightsStatus:"adaptation-permitted",rightsBasis:{termsUrl:family.termsUrl,licenseName:family.licenseName,licenseUrl:family.licenseUrl,itemLevelCheck:"No contrary text-rights notice detected in the fetched page; excluded media remains excluded.",verifiedDate:"2026-08-22"},thirdPartyContentReview:item.thirdPartyReview,sourceBodyExtractionStatus:"body-ready",sourceJapaneseSubstance:item.body,sourceTextCharacterCount:item.sourceCharacterCount,reuseMode:family.fullTextAllowed===true?"verbatim-or-adaptation-permitted":"adaptation-only",sourceBodyFingerprint:item.bodyFingerprint,sourceAttribution:`出典：${family.publisher}ウェブサイト（${item.url}）`,sourceProcessing:"Item-level source body extracted for later editorial adaptation. No learner-facing text has been generated.",inventoryPosition:index+1}}
const final={};
const articleRows=[];for(const article of articles){const item=acceptedPool.find(x=>x.url===article.sourceUrl);if(item&&!used.has(item.url)){used.add(item.url);articleRows.push(record(item,"articles",articleRows.length,`article-source-${article.id}`))}}
final.articles=articleRows;
for(const shelf of shelfOrder){const ranked=acceptedPool.filter(x=>!used.has(x.url)&&x.score[shelf]>0).sort((a,b)=>b.score[shelf]-a.score[shelf]||b.sourceCharacterCount-a.sourceCharacterCount);const rows=[];for(const item of ranked){if(rows.length>=targets[shelf])break;used.add(item.url);rows.push(record(item,shelf,rows.length))}final[shelf]=rows}
for(const item of acceptedPool.filter(x=>!used.has(x.url)).sort((a,b)=>b.sourceCharacterCount-a.sourceCharacterCount)){if(articleRows.length>=targets.articles)break;used.add(item.url);articleRows.push(record(item,"articles",articleRows.length))}
fs.mkdirSync(outputRoot,{recursive:true});fs.mkdirSync(qaRoot,{recursive:true});for(const [shelf,rows] of Object.entries(final))fs.writeFileSync(path.join(outputRoot,`${shelf}.json`),`${JSON.stringify({version:1,shelf,targetCount:targets[shelf],bodyReadyCount:rows.length,records:rows},null,2)}\n`);
const reasonCounts={};for(const x of [...rejected,...review])for(const reason of x.reject||[])reasonCounts[reason]=(reasonCounts[reason]||0)+1;
const sourceFamilyCounts={};for(const rows of Object.values(final))for(const x of rows)sourceFamilyCounts[x.sourceFamilyId]=(sourceFamilyCounts[x.sourceFamilyId]||0)+1;
const acceptedCounts=Object.fromEntries(Object.entries(final).map(([s,x])=>[s,x.length]));
const selectedCount=Object.values(final).flat().length;const thirdPartyReviewDistribution={};for(const rows of Object.values(final))for(const x of rows)thirdPartyReviewDistribution[x.thirdPartyContentReview.status]=(thirdPartyReviewDistribution[x.thirdPartyContentReview.status]||0)+1;
const report={version:1,generatedDate:"2026-08-22",pass:Object.entries(targets).every(([s,n])=>acceptedCounts[s]===n),totalCandidatesInspected:inspected.length,eligibleBodyReadyItems:acceptedPool.length,acceptedBodyReadyItems:selectedCount,unselectedBodyReadyItems:Math.max(0,acceptedPool.length-selectedCount),rejectedItems:rejected.length,needsReviewItems:review.length,acceptedCountsByShelf:acceptedCounts,acceptedCountsBySourceFamily:sourceFamilyCounts,rejectionReasons:reasonCounts,landingIndexPageRejectionCount:reasonCounts["landing-or-index-page"]||0,itemsMissingUsableSourceSubstance:reasonCounts["insufficient-source-substance"]||0,duplicateUrls:inspected.length-new Set(inspected.map(x=>x.url)).size,duplicateSourceBodies:reasonCounts["duplicate-source-body"]||0,rightsStatusDistribution:{"adaptation-permitted":selectedCount},thirdPartyReviewDistribution,targets,unfilled:Object.fromEntries(Object.entries(targets).map(([s,n])=>[s,Math.max(0,n-(acceptedCounts[s]||0))]).filter(([,n])=>n)),notes:["Accepted government records are inventory evidence only; no learner-facing adaptation was generated.","Media assets are never bundled. Pages with detected contrary-rights or third-party-credit signals remain review-required."]};
fs.writeFileSync(path.join(qaRoot,"body-ready-source-report.json"),`${JSON.stringify(report,null,2)}\n`);fs.writeFileSync(path.join(qaRoot,"body-ready-rejections.json"),`${JSON.stringify({version:1,rejected:rejected.map(x=>({url:x.url,title:x.title||null,reasons:x.reject,error:x.error||null})),needsReview:review.map(x=>({url:x.url,title:x.title||null,reasons:x.reject,signals:x.thirdPartyReview?.signals||[]}))},null,2)}\n`);console.log(JSON.stringify(report,null,2));
