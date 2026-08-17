/* Sakura Reading Garden Long-form Features v1.2
   Turns the 50 curated Article shelf entries into substantial, multi-section
   source-grounded feature readings by combining related verified readings
   from the same JLPT level + topic. No filler and no extra archive records. */
(function(){
'use strict';
if(window.SakuraReadingLongForm)return;

const LEVELS=['N5','N4','N3','N2','N1'];
const TOPICS=['beauty','food','travel','digital','consumer','health','environment','culture','work','society'];
const TARGET_CHARS=Object.freeze({N5:360,N4:420,N3:480,N2:540,N1:600});
const MAX_SOURCE_SECTIONS=5;
const MIN_SOURCE_SECTIONS=3;
const LIBRARY_KEY='sakuraReadingGardenLibraryV2';
let ready=false,qualityIds=new Set(),metaById=new Map(),composed=new Set(),inFlight=new Map(),bypassOnce=new Set(),observer=null,patchTimer=0;

function rankArticle(a,b){
 return (+b.estimatedMinutes||0)-(+a.estimatedMinutes||0)||
  String(b.sourcePublishedDate||'').localeCompare(String(a.sourcePublishedDate||''))||
  String(b.summary||'').length-String(a.summary||'').length||
  String(a.id||'').localeCompare(String(b.id||''));
}
function buildQualityIds(records){
 const groups=new Map();
 records.forEach(record=>{
  metaById.set(record.id,record);
  const key=`${record.jlpt}:${record.topic}`;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(record);
 });
 const ids=[];
 LEVELS.forEach(level=>TOPICS.forEach(topic=>{
  const group=groups.get(`${level}:${topic}`)||[];
  if(group.length)ids.push([...group].sort(rankArticle)[0].id);
 }));
 return new Set(ids.slice(0,50));
}
function bodyChars(record){
 return (record?.paragraphs||[]).reduce((sum,p)=>sum+String(p?.japanese||'').replace(/\s/g,'').length,0);
}
function uniqueBy(items,keyFn,limit=99){
 const seen=new Set(),out=[];
 for(const item of items){
  const key=keyFn(item);
  if(!key||seen.has(key))continue;
  seen.add(key);out.push(item);
  if(out.length>=limit)break;
 }
 return out;
}
function sourceHeading(record){
 return {
  japanese:`【${record.title}】`,
  kana:`【${record.titleKana}】`,
  furigana:`【${record.titleFurigana}】`,
  english:`${record.titleEnglish} · Source: ${record.sourcePublisher}`
 };
}
function selectSections(lead,group){
 const others=group.filter(x=>x.id!==lead.id).sort(rankArticle);
 const selected=[lead],target=TARGET_CHARS[lead.jlpt]||450;
 let chars=bodyChars(lead);
 for(const record of others){
  if(selected.length>=MAX_SOURCE_SECTIONS)break;
  if(selected.length>=MIN_SOURCE_SECTIONS&&chars>=target)break;
  selected.push(record);chars+=bodyChars(record);
 }
 return selected;
}
function composeRecord(lead,sections,meta){
 const paragraphs=[];
 sections.forEach(record=>{
  paragraphs.push(sourceHeading(record));
  (record.paragraphs||[]).forEach(p=>paragraphs.push({...p}));
 });
 const chars=sections.reduce((sum,x)=>sum+bodyChars(x),0);
 const minutes=Math.max(4,Math.ceil(chars/120));
 const vocab=uniqueBy(sections.flatMap(x=>x.vocabularyFocus||[]),x=>`${x.word}|${x.kana}`,12);
 const grammar=uniqueBy(sections.flatMap(x=>x.grammarFocus||[]),x=>String(x),8);
 const sources=sections.map(x=>`${x.sourcePublisher}: ${x.sourceUrl}`);

 lead.paragraphs=paragraphs;
 lead.characterCount=chars;
 lead.estimatedMinutes=minutes;
 lead.vocabularyFocus=vocab;
 lead.grammarFocus=grammar;
 lead.levelNote=`${lead.levelNote||''} Sakura expanded this Quality Shelf item into a multi-section feature using ${sections.length} verified same-topic source readings.`.trim();
 lead.sourceTitle=`${lead.sourceTitle} + ${sections.length-1} related verified source${sections.length===2?'':'s'}`;
 lead.sourcePublisher=`${lead.sourcePublisher}ほか`;
 lead.sourceProcessing=`Sakura long-form feature: this reading combines rewritten learner adaptations from ${sections.length} verified sources in the same ${lead.jlpt} study level and topic. Each section is labeled with its source publisher; no filler text was added to meet a word count.`;
 lead.sourceAttribution=`Lead source: ${lead.sourceUrl}. Additional feature sources: ${sources.slice(1).join(' | ')}`;
 lead.rightsNote=`${lead.rightsNote||''} This feature combines text-only learner adaptations from the listed sources; no logos, photographs, charts, videos, or separately credited third-party assets are bundled.`.trim();
 lead._sakuraLongForm=true;
 lead._sakuraLongFormSourceCount=sections.length;

 if(meta){
  meta.estimatedMinutes=minutes;
  meta.summary=`${String(meta.summary||'').replace(/\s+/g,' ').trim()} Long-form Quality Feature: ${sections.length} verified source sections.`.trim();
 }
 return lead;
}
async function compose(id){
 if(inFlight.has(id))return inFlight.get(id);
 const rg=window.SakuraReadingGarden,meta=metaById.get(id);
 if(!rg?.loadArticleLevel||!meta)return false;
 const task=(async()=>{
  const records=await rg.loadArticleLevel(meta.jlpt);
  const lead=records.find(x=>x.id===id);
  if(!lead)return false;
  if(lead._sakuraLongForm){composed.add(id);return true;}
  const group=records.filter(x=>x.topic===meta.topic&&x.jlpt===meta.jlpt);
  const sections=selectSections(lead,group);
  composeRecord(lead,sections,meta);
  composed.add(id);
  schedulePatch();
  return true;
 })().catch(error=>{
  console.warn('Sakura Reading Long-form could not compose this feature; the original sourced article remains available.',error);
  return false;
 }).finally(()=>inFlight.delete(id));
 inFlight.set(id,task);
 return task;
}
function syntheticOpen(id){
 const dialog=document.getElementById('reading-garden-dialog');
 if(!dialog||!id)return;
 const button=document.createElement('button');
 button.type='button';button.hidden=true;button.dataset.readingOpenArticle=id;
 dialog.appendChild(button);button.click();setTimeout(()=>button.remove(),0);
}
async function prepareAndOpen(id,trigger){
 if(!qualityIds.has(id)){bypassOnce.add(id);syntheticOpen(id);return;}
 if(trigger){
  trigger.setAttribute('aria-busy','true');
  trigger.classList.add('sakura-longform-loading');
 }
 try{await compose(id);}finally{
  if(trigger){trigger.removeAttribute('aria-busy');trigger.classList.remove('sakura-longform-loading');}
 }
 bypassOnce.add(id);
 syntheticOpen(id);
}
function articleTrigger(target){return target?.closest?.('[data-reading-open-article]')||null;}
function lastContinueArticleId(){
 try{
  const lib=JSON.parse(localStorage.getItem(LIBRARY_KEY)||'{}');
  if(lib?.lastReadingType==='story')return '';
  return String(lib?.lastReadingId||lib?.lastArticleId||'');
 }catch{return '';}
}
function interceptClick(event){
 const continueButton=event.target?.closest?.('[data-reading-continue]');
 if(continueButton){
  const id=lastContinueArticleId();
  if(id&&qualityIds.has(id)){
   event.preventDefault();event.stopImmediatePropagation();prepareAndOpen(id,continueButton);return;
  }
 }
 const trigger=articleTrigger(event.target);if(!trigger)return;
 const id=trigger.dataset.readingOpenArticle;
 if(bypassOnce.has(id)){bypassOnce.delete(id);return;}
 if(!qualityIds.has(id))return;
 event.preventDefault();event.stopImmediatePropagation();
 prepareAndOpen(id,trigger);
}
function interceptKey(event){
 if(event.key!=='Enter'&&event.key!==' ')return;
 const trigger=articleTrigger(event.target);if(!trigger)return;
 const id=trigger.dataset.readingOpenArticle;
 if(bypassOnce.has(id)){bypassOnce.delete(id);return;}
 if(!qualityIds.has(id))return;
 event.preventDefault();event.stopImmediatePropagation();
 prepareAndOpen(id,trigger);
}
function patchUi(){
 const browser=document.getElementById('reading-articles-browser');
 if(browser&&!browser.hidden){
  browser.querySelectorAll('[data-reading-open-article]').forEach(card=>{
   const id=card.dataset.readingOpenArticle;if(!qualityIds.has(id))return;
   const tags=card.querySelector('.reading-article-tags');
   if(tags){
    [...tags.querySelectorAll('.reading-article-tag')].forEach(tag=>{
     if(/^\d+\s*min$/i.test(tag.textContent.trim())&&!composed.has(id))tag.textContent='Feature length';
    });
   }
   let badge=card.querySelector('.sakura-longform-badge');
   if(!badge&&tags){badge=document.createElement('span');badge.className='reading-article-tag sakura-longform-badge';tags.appendChild(badge);}
   if(badge)badge.textContent=composed.has(id)?'Long-form ready':'Long-form feature';
  });
 }
 const reader=document.getElementById('reading-article-reader');
 if(reader&&!reader.hidden){
  const header=reader.querySelector('.reading-reader-tags');
  const longForm=header&&reader.querySelector('.reading-level-note')?.textContent.includes('multi-section feature');
  if(longForm&&!header.querySelector('.sakura-longform-badge')){
   const badge=document.createElement('span');badge.className='reading-article-tag sakura-longform-badge';badge.textContent='Multi-section feature';header.appendChild(badge);
  }
 }
}
function schedulePatch(){clearTimeout(patchTimer);patchTimer=setTimeout(patchUi,0);}
function bind(){
 document.addEventListener('click',interceptClick,true);
 document.addEventListener('keydown',interceptKey,true);
 const dialog=document.getElementById('reading-garden-dialog');
 if(dialog){observer=new MutationObserver(schedulePatch);observer.observe(dialog,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']});}
}
function injectStyle(){
 if(document.getElementById('sakura-reading-longform-style'))return;
 const style=document.createElement('style');style.id='sakura-reading-longform-style';
 style.textContent='.sakura-longform-badge{font-weight:900!important}.sakura-longform-loading{opacity:.72;pointer-events:none}.sakura-longform-loading::after{content:" Preparing long-form…";display:block;margin-top:8px;color:var(--color-primary-dark);font-size:8px;font-weight:850}';
 document.head.appendChild(style);
}
async function init(){
 if(ready)return;
 const rg=window.SakuraReadingGarden;
 if(!rg?.loadArticleIndexes){setTimeout(init,120);return;}
 ready=true;injectStyle();bind();
 try{
  const indexes=await rg.loadArticleIndexes('all');
  qualityIds=buildQualityIds(indexes);
  schedulePatch();
 }catch(error){console.warn('Sakura Reading Long-form could not initialize; the existing Quality Shelf remains available.',error);}
}
window.SakuraReadingLongForm=Object.freeze({version:1.2,init,compose,get qualityArticleCount(){return qualityIds.size},get composedCount(){return composed.size}});
init();
}());
