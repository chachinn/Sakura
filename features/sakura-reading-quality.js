/* Sakura Reading Garden Quality Shelf v1
   Quality-first curation layer: max 50 visible readings per material type.
   Keeps the larger source archive intact and preserves Saved/Continue access. */
(function(){
'use strict';
if(window.SakuraReadingQuality)return;
const TARGET=50,LEVELS=['N5','N4','N3','N2','N1'];
const TOPICS=['beauty','food','travel','digital','consumer','health','environment','culture','work','society'];
const STORY_CATEGORIES=['classics','modern-literature','mystery-suspense','children-stories','human-bonds','strange-horror'];
const STORY_QUOTAS=Object.freeze({classics:9,'modern-literature':9,'mystery-suspense':8,'children-stories':8,'human-bonds':8,'strange-horror':8});
const PREFS_KEY='sakuraReadingGardenPrefsV3',LIBRARY_KEY='sakuraReadingGardenLibraryV2';
let allArticles=[],articleShelf=[],allStories=[],storyShelf=[],currentArticleView=[],currentStoryView=[],renderTimer=0,observer=null,ready=false;
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
function prefs(){return read(PREFS_KEY,{level:'all',mode:'furigana',articleTopic:'all',storyCategory:'all'})}
function library(){return read(LIBRARY_KEY,{saved:[],completed:[],lastReadingId:'',lastArticleId:'',lastStoryId:'',lastReadingType:''})}
function savedSet(){return new Set(Array.isArray(library().saved)?library().saved:[])}
function completedSet(){return new Set(Array.isArray(library().completed)?library().completed:[])}
function rankArticle(a,b){return (+b.estimatedMinutes||0)-(+a.estimatedMinutes||0)||String(b.sourcePublishedDate||'').localeCompare(String(a.sourcePublishedDate||''))||String(b.summary||'').length-String(a.summary||'').length||String(a.id).localeCompare(String(b.id))}
function buildArticles(records){
 const groups=new Map();
 records.forEach(x=>{const k=`${x.jlpt}:${x.topic}`;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(x)});
 const out=[];
 LEVELS.forEach(level=>TOPICS.forEach(topic=>{const group=groups.get(`${level}:${topic}`)||[];if(group.length)out.push([...group].sort(rankArticle)[0])}));
 if(out.length<TARGET){const used=new Set(out.map(x=>x.id));[...records].sort(rankArticle).forEach(x=>{if(out.length<TARGET&&!used.has(x.id)){used.add(x.id);out.push(x)}})}
 return out.slice(0,TARGET);
}
function rankStory(a,b){return String(b.originalExcerpt||'').length-String(a.originalExcerpt||'').length||(+b.estimatedMinutes||0)-(+a.estimatedMinutes||0)||String(a.title||'').localeCompare(String(b.title||''),'ja')}
function buildStories(records){
 const out=[],used=new Set();
 STORY_CATEGORIES.forEach(category=>{const quota=STORY_QUOTAS[category]||8;records.filter(x=>x.category===category).sort(rankStory).slice(0,quota).forEach(x=>{if(!used.has(x.id)){used.add(x.id);out.push(x)}})});
 if(out.length<TARGET)[...records].sort(rankStory).forEach(x=>{if(out.length<TARGET&&!used.has(x.id)){used.add(x.id);out.push(x)}});
 return out.slice(0,TARGET);
}
function patchMaterials(){
 const rg=window.SakuraReadingGarden;if(!rg?.materials)return;
 rg.materials.forEach(item=>{
  item.count=TARGET;
  if(item.id==='articles')item.status='50 curated · source archive retained';
  else if(item.id==='short-stories')item.status='50 curated · source archive retained';
  else if(item.id==='manga')item.status='Licensing first · 50 max';
  else item.status='50 quality target';
 });
}
function patchHome(){
 const dialog=document.getElementById('reading-garden-dialog');if(!dialog)return;
 const stats=dialog.querySelectorAll('.reading-garden-stat strong');
 if(stats[1])stats[1].textContent=(window.SakuraReadingGarden?.materials?.length*TARGET||900).toLocaleString();
 if(stats[2])stats[2].textContent='100';
 const statLabels=dialog.querySelectorAll('.reading-garden-stat small');
 if(statLabels[1])statLabels[1].textContent='quality-first max library';
 if(statLabels[2])statLabels[2].textContent='curated Articles + Stories';
 const target=dialog.querySelector('.reading-garden-section-heading span');
 const libraryHeading=[...dialog.querySelectorAll('.reading-garden-section-heading')].find(x=>x.textContent.includes('Browse by material'));
 if(libraryHeading?.lastElementChild)libraryHeading.lastElementChild.textContent=`${(window.SakuraReadingGarden?.materials?.length*TARGET||900).toLocaleString()} quality target`;
 dialog.querySelectorAll('[data-reading-material]').forEach(button=>{
  const id=button.dataset.readingMaterial,item=window.SakuraReadingGarden?.materials?.find(x=>x.id===id);
  const count=button.querySelector('.reading-material-main small');if(count&&item)count.textContent=`${TARGET} ${item.unit}`;
  const status=button.querySelector('.reading-material-status');if(status&&item)status.textContent=item.status;
 });
 const practice=document.querySelector('[data-open-reading-garden] p');if(practice)practice.textContent='50 curated Articles + 50 curated real Japanese Short Stories ready.';
 const selection=document.getElementById('reading-garden-selection');
 if(selection){
  const selected=dialog.querySelector('[data-reading-material].active')?.dataset.readingMaterial;
  const item=window.SakuraReadingGarden?.materials?.find(x=>x.id===selected);
  const strong=selection.querySelector('strong');if(strong&&item)strong.textContent=`${item.title} · ${TARGET} ${item.unit}`;
  const small=selection.querySelector('small');
  if(small&&selected==='articles')small.textContent='Quality Shelf: 50 visible sourced Articles, balanced across all 5 JLPT study levels and 10 topics. The larger verified source archive is retained, not deleted.';
  if(small&&selected==='short-stories')small.textContent='Quality Shelf: 50 visible public-domain Japanese stories, balanced across six shelves and biased toward the longer available excerpts. The larger Aozora source archive is retained.';
  if(small&&item&&!['articles','short-stories','manga'].includes(selected))small.textContent='Quality-first target: up to 50 substantial readings for this material type rather than hundreds of short filler items.';
 }
}
function dateText(x){return x.sourcePublishedDate?`${x.sourceDateLabel||'Published'} ${x.sourcePublishedDate}`:(x.sourceDateLabel||'Source date available')}
function articleMatches(x,p,q,topic,savedOnly,saved){if(p.level!=='all'&&x.jlpt!==p.level)return false;if(topic!=='all'&&x.topic!==topic)return false;if(savedOnly&&!saved.has(x.id))return false;if(!q)return true;const h=`${x.title} ${x.titleKana} ${x.titleEnglish} ${x.summary} ${x.sourcePublisher}`.toLowerCase();return h.includes(q.toLowerCase())}
function storyMatches(x,p,q,category,savedOnly,saved){if(p.level!=='all'&&x.studyDifficulty!==p.level)return false;if(category!=='all'&&x.category!==category)return false;if(savedOnly&&!saved.has(x.id))return false;if(!q)return true;const h=`${x.title} ${x.titleKana} ${x.author} ${x.authorKana} ${(x.tags||[]).join(' ')}`.toLowerCase();return h.includes(q.toLowerCase())}
function articleCard(x,saved,completed,p){const title=p.mode==='furigana'?x.titleFurigana:esc(p.mode==='kana'?x.titleKana:x.title);return `<div class="reading-article-card sakura-quality-reading" data-reading-open-article="${esc(x.id)}" role="button" tabindex="0" aria-label="Open ${esc(x.titleEnglish)}"><div><div class="reading-article-tags"><span class="reading-article-tag sakura-quality-badge">Quality Shelf</span><span class="reading-article-tag">Study ${esc(x.jlpt)}</span><span class="reading-article-tag">${x.topicIcon} ${esc(x.topicLabel)}</span><span class="reading-article-tag">${esc(String(x.sourceYear))} source</span><span class="reading-article-tag">${esc(x.estimatedMinutes)} min</span>${completed.has(x.id)?'<span class="reading-article-tag">✓ Read</span>':''}</div><h3>${title}</h3><span class="reading-en-title">${esc(x.titleEnglish)}</span><p>${esc(x.summary)}</p><small class="reading-source-inline">Source: ${esc(x.sourcePublisher)} · ${esc(dateText(x))}</small></div><button class="reading-article-save${saved.has(x.id)?' saved':''}" type="button" data-reading-save-article="${esc(x.id)}" aria-label="${saved.has(x.id)?'Remove from Saved':'Save Article'}">${saved.has(x.id)?'♥':'♡'}</button></div>`}
function storyCard(x,saved,completed){const year=x.sourceYear?String(x.sourceYear):'Year not listed';return `<div class="reading-article-card sakura-quality-reading" data-reading-open-story="${esc(x.id)}" role="button" tabindex="0" aria-label="Open ${esc(x.title)}"><div><div class="reading-article-tags"><span class="reading-article-tag sakura-quality-badge">Quality Shelf</span><span class="reading-article-tag">Approx ${esc(x.studyDifficulty)}</span><span class="reading-article-tag">${esc(x.categoryIcon||'📚')} ${esc(x.categoryLabel||x.category)}</span><span class="reading-article-tag">${esc(year)}</span><span class="reading-article-tag">Original text</span>${completed.has(x.id)?'<span class="reading-article-tag">✓ Read</span>':''}</div><h3>${esc(x.title)}</h3><span class="reading-en-title">${esc(x.titleKana)} · ${esc(x.author)}</span><p>${esc(x.originalExcerpt)}</p><small class="reading-source-inline">Source: 青空文庫 · ${esc(year)} · copyright-expired work</small></div><button class="reading-article-save${saved.has(x.id)?' saved':''}" type="button" data-reading-save-story="${esc(x.id)}" aria-label="${saved.has(x.id)?'Remove from Saved':'Save Story'}">${saved.has(x.id)?'♥':'♡'}</button></div>`}
function renderArticles(){
 const browser=document.getElementById('reading-articles-browser'),list=document.getElementById('reading-article-list'),count=document.getElementById('reading-article-count');if(!browser||browser.hidden||!list||!count||!articleShelf.length)return;
 const p=prefs(),q=document.getElementById('reading-article-search')?.value.trim()||'',topic=document.getElementById('reading-article-topic')?.value||p.articleTopic||'all',savedOnly=browser.dataset.savedOnly==='true',saved=savedSet(),completed=completedSet(),base=savedOnly?allArticles:articleShelf;
 currentArticleView=base.filter(x=>articleMatches(x,p,q,topic,savedOnly,saved));
 const sig=`a:${currentArticleView.map(x=>x.id).join('|')}:${[...saved].join('|')}:${[...completed].join('|')}:${p.mode}`;
 if(list.dataset.qualitySignature!==sig){list.dataset.qualitySignature=sig;list.innerHTML=currentArticleView.length?currentArticleView.map(x=>articleCard(x,saved,completed,p)).join(''):'<div class="reading-browser-empty">🌸 No quality-shelf Articles match these filters.</div>'}
 count.textContent=`${currentArticleView.length.toLocaleString()} curated article${currentArticleView.length===1?'':'s'}`;
 const more=document.getElementById('reading-load-more');if(more)more.hidden=true;
 const hero=browser.querySelector('.reading-browser-hero p');if(hero)hero.textContent='50 quality-first sourced Articles are curated from Sakura’s verified source archive: one strongest available reading for every JLPT level × topic combination. The archive remains intact.';
 const offline=document.getElementById('reading-offline-status');if(offline&&!offline.textContent.includes('archive'))offline.textContent='The visible shelf is capped at 50; offline preparation may retain supporting source-archive packs so Saved and Continue readings are never stranded.';
}
function renderStories(){
 const browser=document.getElementById('reading-stories-browser'),list=document.getElementById('reading-story-list'),count=document.getElementById('reading-story-count');if(!browser||browser.hidden||!list||!count||!storyShelf.length)return;
 const p=prefs(),q=document.getElementById('reading-story-search')?.value.trim()||'',category=document.getElementById('reading-story-category')?.value||p.storyCategory||'all',savedOnly=browser.dataset.savedOnly==='true',saved=savedSet(),completed=completedSet(),base=savedOnly?allStories:storyShelf;
 currentStoryView=base.filter(x=>storyMatches(x,p,q,category,savedOnly,saved));
 const sig=`s:${currentStoryView.map(x=>x.id).join('|')}:${[...saved].join('|')}:${[...completed].join('|')}`;
 if(list.dataset.qualitySignature!==sig){list.dataset.qualitySignature=sig;list.innerHTML=currentStoryView.length?currentStoryView.map(x=>storyCard(x,saved,completed)).join(''):'<div class="reading-browser-empty">🌸 No quality-shelf Short Stories match these filters.</div>'}
 count.textContent=`${currentStoryView.length.toLocaleString()} curated stor${currentStoryView.length===1?'y':'ies'}`;
 const more=document.getElementById('reading-story-load-more');if(more)more.hidden=true;
 const hero=browser.querySelector('.reading-browser-hero p');if(hero)hero.textContent='50 quality-first public-domain Japanese works are curated from the larger Aozora shelf, balanced across six categories and favoring the longer available original excerpts. Full originals still open on Aozora Bunko.';
}
function reconcile(){patchHome();renderArticles();renderStories()}
function schedule(){clearTimeout(renderTimer);renderTimer=setTimeout(reconcile,0)}
function syntheticOpen(id,type){const dialog=document.getElementById('reading-garden-dialog');if(!dialog||!id)return;const b=document.createElement('button');b.type='button';b.hidden=true;if(type==='story')b.dataset.readingOpenStory=id;else b.dataset.readingOpenArticle=id;dialog.appendChild(b);b.click();setTimeout(()=>b.remove(),0)}
function randomFrom(type){const p=prefs(),pool=(type==='story'?storyShelf:articleShelf).filter(x=>p.level==='all'||(type==='story'?x.studyDifficulty:x.jlpt)===p.level);return pool[Math.floor(Math.random()*pool.length)]}
function moveCurated(type,direction){const lib=library(),id=lib.lastReadingId||lib.lastArticleId||lib.lastStoryId,pool=type==='story'?currentStoryView:currentArticleView;if(!pool.length)return;const i=pool.findIndex(x=>x.id===id);if(i<0)return;const next=Math.max(0,Math.min(pool.length-1,i+direction));if(next!==i)syntheticOpen(pool[next].id,type)}
function bind(){
 document.addEventListener('click',e=>{
  if(e.target.closest('[data-reading-load-more],[data-reading-load-more-stories]')){e.preventDefault();e.stopImmediatePropagation();schedule();return}
  if(e.target.closest('[data-reading-surprise-article]')&&articleShelf.length){e.preventDefault();e.stopImmediatePropagation();const x=randomFrom('article');if(x)syntheticOpen(x.id,'article');return}
  if(e.target.closest('[data-reading-surprise-story]')&&storyShelf.length){e.preventDefault();e.stopImmediatePropagation();const x=randomFrom('story');if(x)syntheticOpen(x.id,'story');return}
  if(e.target.closest('[data-reading-prev-article]')){e.preventDefault();e.stopImmediatePropagation();moveCurated('article',-1);return}
  if(e.target.closest('[data-reading-next-article]')){e.preventDefault();e.stopImmediatePropagation();moveCurated('article',1);return}
  if(e.target.closest('[data-reading-prev-story]')){e.preventDefault();e.stopImmediatePropagation();moveCurated('story',-1);return}
  if(e.target.closest('[data-reading-next-story]')){e.preventDefault();e.stopImmediatePropagation();moveCurated('story',1);return}
  schedule();
 },true);
 document.addEventListener('input',e=>{if(['reading-article-search','reading-story-search'].includes(e.target?.id))schedule()},true);
 document.addEventListener('change',e=>{if(['reading-article-topic','reading-story-category'].includes(e.target?.id))schedule()},true);
 const dialog=document.getElementById('reading-garden-dialog');if(dialog){observer=new MutationObserver(schedule);observer.observe(dialog,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class']})}
}
function style(){if(document.getElementById('sakura-reading-quality-style'))return;const s=document.createElement('style');s.id='sakura-reading-quality-style';s.textContent='.sakura-quality-badge{border-color:color-mix(in srgb,var(--color-primary) 38%,var(--color-border))!important;background:color-mix(in srgb,var(--color-primary-soft) 82%,var(--color-surface))!important;color:var(--color-primary-dark)!important;font-weight:900!important}.sakura-quality-reading{content-visibility:auto;contain-intrinsic-size:150px}';document.head.appendChild(s)}
async function init(){
 if(ready)return;const rg=window.SakuraReadingGarden;if(!rg?.loadArticleIndexes||!rg?.loadStories){setTimeout(init,120);return}
 ready=true;style();patchMaterials();bind();patchHome();
 try{const [articles,stories]=await Promise.all([rg.loadArticleIndexes('all'),rg.loadStories()]);allArticles=articles;allStories=stories;articleShelf=buildArticles(articles);storyShelf=buildStories(stories);if(articleShelf.length!==TARGET)console.warn(`Reading Quality Shelf expected ${TARGET} Articles, got ${articleShelf.length}.`);if(storyShelf.length!==TARGET)console.warn(`Reading Quality Shelf expected ${TARGET} Stories, got ${storyShelf.length}.`);reconcile()}catch(error){console.warn('Reading Quality Shelf could not finish curation; Reading Garden core remains available.',error)}
}
window.SakuraReadingQuality=Object.freeze({version:1,target:TARGET,init,get articleCount(){return articleShelf.length},get storyCount(){return storyShelf.length}});
init();
}());
