/* Sakura Source-Checked Practice Integration v2
   Folds the Japan Foundation-grounded Real-Life Drills into What Would You Say?
   instead of exposing a duplicate Practice activity.
*/
(function initializeSakuraSourcePracticeIntegration(){
  'use strict';
  if(window.SakuraSourcePractice?.version>=2)return;

  const SOURCE_DATA_URL='./data/practice-source-checked.js?v=1';
  const WWYS_DATA_URL='./data/practice-what-would-you-say.js?v=3';
  let integrationPromise=null;

  function loadScript(url,marker,ready){
    if(ready())return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const existing=document.querySelector(`script[data-${marker}]`);
      if(existing){
        const check=()=>ready()?resolve():reject(new Error(`${url} loaded without expected data.`));
        if(ready())return resolve();
        existing.addEventListener('load',check,{once:true});
        existing.addEventListener('error',()=>reject(new Error(`Could not load ${url}`)),{once:true});
        return;
      }
      const script=document.createElement('script');
      script.src=url;
      script.dataset[marker.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]='true';
      script.async=true;
      script.onload=()=>ready()?resolve():reject(new Error(`${url} loaded without expected data.`));
      script.onerror=()=>reject(new Error(`Could not load ${url}`));
      document.head.appendChild(script);
    });
  }

  function mapCategory(category){
    if(['Food','Transportation','Shopping','Directions'].includes(category))return 'Travel';
    if(['Communication','Introductions','Social','Health','Gifts'].includes(category))return 'Everyday';
    return 'Real-world';
  }

  function mapDifficulty(level){
    return String(level||'').includes('A1')?'Beginner':'Intermediate';
  }

  function convertSourceItem(item){
    return {
      id:item.id,
      category:mapCategory(item.category),
      difficulty:mapDifficulty(item.level),
      scenario:item.scenario,
      prompt:item.prompt,
      choices:Array.from(item.choices||[],choice=>({
        japanese:choice.japanese,
        kana:choice.kana,
        romaji:choice.romaji,
        english:choice.english
      })),
      correctChoice:item.correctChoice,
      explanation:item.explanation,
      sourceChecked:true,
      sourceLevel:item.level,
      sourceCategory:item.category,
      sourceLesson:item.lesson,
      sourceTitle:item.sourceTitle,
      sourceUrl:item.sourceUrl
    };
  }

  function mergeBanks(){
    const base=Array.isArray(window.WHAT_WOULD_YOU_SAY_DATA)?window.WHAT_WOULD_YOU_SAY_DATA:[];
    const source=window.SAKURA_SOURCE_CHECKED_PRACTICE?.items||[];
    if(!base.length||!source.length)throw new Error('Practice banks are not ready.');

    const ids=new Set(base.map(item=>item?.id).filter(Boolean));
    const imported=[];
    source.forEach(item=>{
      if(!item?.id||ids.has(item.id))return;
      const converted=convertSourceItem(item);
      imported.push(converted);
      ids.add(converted.id);
    });

    const alreadyIntegrated=base.some(item=>item?.sourceChecked===true);
    if(!alreadyIntegrated&&imported.length){
      window.WHAT_WOULD_YOU_SAY_DATA=[...base,...imported];
    }

    window.dispatchEvent(new CustomEvent('sakura:wwys-source-integrated',{
      detail:{imported:alreadyIntegrated?base.filter(item=>item?.sourceChecked).length:imported.length,total:window.WHAT_WOULD_YOU_SAY_DATA.length}
    }));
    return window.WHAT_WOULD_YOU_SAY_DATA;
  }

  function escapeHtml(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function injectStyle(){
    if(document.getElementById('sakura-wwys-source-style'))return;
    const style=document.createElement('style');
    style.id='sakura-wwys-source-style';
    style.textContent=`
      .wwys-source-proof{display:grid;gap:4px;margin:10px 0 12px;padding:10px 11px;border:1px solid color-mix(in srgb,var(--color-primary) 20%,var(--color-border));border-radius:13px;background:color-mix(in srgb,var(--color-primary-soft) 54%,var(--color-surface))}
      .wwys-source-proof[hidden]{display:none}.wwys-source-proof strong{width:max-content;max-width:100%;padding:3px 7px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:7px;font-weight:950;letter-spacing:.06em}.wwys-source-proof span{color:var(--color-text-muted);font-size:8px;line-height:1.45}.wwys-source-proof a{width:max-content;max-width:100%;color:var(--color-primary-dark);font-size:8px;font-weight:900;text-decoration:underline;text-underline-offset:2px}
    `;
    document.head.appendChild(style);
  }

  function ensureSourceProof(){
    const feedback=document.getElementById('wwys-feedback');
    const next=document.getElementById('wwys-next');
    if(!feedback||!next)return null;
    let proof=document.getElementById('wwys-source-proof');
    if(!proof){
      proof=document.createElement('div');
      proof.id='wwys-source-proof';
      proof.className='wwys-source-proof';
      proof.hidden=true;
      next.insertAdjacentElement('beforebegin',proof);
    }
    return proof;
  }

  function currentSourceQuestion(){
    const scenario=document.getElementById('wwys-scenario')?.textContent?.trim();
    const prompt=document.getElementById('wwys-prompt')?.textContent?.trim();
    if(!scenario||!prompt)return null;
    return (window.WHAT_WOULD_YOU_SAY_DATA||[]).find(item=>item?.sourceChecked&&item.scenario===scenario&&item.prompt===prompt)||null;
  }

  function renderSourceProof(){
    const feedback=document.getElementById('wwys-feedback');
    const proof=ensureSourceProof();
    if(!feedback||!proof)return;
    if(feedback.hidden){proof.hidden=true;return;}
    const item=currentSourceQuestion();
    if(!item){proof.hidden=true;proof.innerHTML='';return;}
    proof.hidden=false;
    proof.innerHTML=`<strong>✓ SOURCE-CHECKED</strong><span>${escapeHtml(item.sourceLevel)} · ${escapeHtml(item.sourceLesson)} · ${escapeHtml(item.sourceTitle)}</span><span>Sakura-authored exercise grounded in this official Japan Foundation Irodori lesson objective.</span><a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">View official Irodori source ↗</a>`;
  }

  function watchFeedback(){
    injectStyle();
    const feedback=document.getElementById('wwys-feedback');
    if(!feedback)return false;
    ensureSourceProof();
    const observer=new MutationObserver(renderSourceProof);
    observer.observe(feedback,{attributes:true,attributeFilter:['hidden']});
    document.getElementById('wwys-choices')?.addEventListener('click',()=>setTimeout(renderSourceProof,0));
    document.getElementById('wwys-next')?.addEventListener('click',()=>setTimeout(renderSourceProof,0));
    return true;
  }

  async function integrate(){
    if(integrationPromise)return integrationPromise;
    integrationPromise=(async()=>{
      await Promise.all([
        loadScript(WWYS_DATA_URL,'sakura-wwys-base',()=>Array.isArray(window.WHAT_WOULD_YOU_SAY_DATA)),
        loadScript(SOURCE_DATA_URL,'sakura-source-practice-data',()=>Boolean(window.SAKURA_SOURCE_CHECKED_PRACTICE?.items?.length))
      ]);
      return mergeBanks();
    })().catch(error=>{
      integrationPromise=null;
      console.warn('Sakura could not merge source-checked drills into What Would You Say?. Existing questions remain available.',error);
      return Array.isArray(window.WHAT_WOULD_YOU_SAY_DATA)?window.WHAT_WOULD_YOU_SAY_DATA:[];
    });
    return integrationPromise;
  }

  function removeLegacyCard(){
    document.getElementById('source-practice-launch')?.remove();
    document.querySelector('#practice-view .practice-coming-grid')?.classList.remove('practice-grid-balanced');
  }

  function init(){
    removeLegacyCard();
    integrate();
    if(!watchFeedback()){
      const observer=new MutationObserver(()=>{if(watchFeedback())observer.disconnect();});
      observer.observe(document.body,{childList:true,subtree:true});
      setTimeout(()=>observer.disconnect(),5000);
    }
  }

  window.SakuraSourcePractice=Object.freeze({version:2,init,integrate,mergeBanks,renderSourceProof});
  if(document.body)init();else document.addEventListener('DOMContentLoaded',init,{once:true});
}());
