/* Sakura JLPT Quiz Lab v1 */
(function(){
if(window.SakuraQuizLab)return;
const STORE="sakuraQuizLabPrefsV1",DEFAULT={translationLevel:"N5",translationDirection:"mixed",translationCount:10,particleLevel:"N5",particleCount:10};
let prefs=read(STORE,DEFAULT),ts=null,ps=null,ready=false;
function read(k,f){try{return JSON.parse(localStorage.getItem(k)||"null")||{...f}}catch{return{...f}}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(prefs))}catch{}}
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
const levels=s=>["N5","N4","N3","N2","N1"].map(x=>`<option${x===s?" selected":""}>${x}</option>`).join("");
const counts=s=>[10,20,30,50].map(x=>`<option value="${x}"${+s===x?" selected":""}>${x} questions</option>`).join("");
function stylesheet(){if(document.querySelector("[data-sakura-quiz-lab-style]"))return;const l=document.createElement("link");l.rel="stylesheet";l.href="./features/sakura-quiz-lab.css?v=1";l.dataset.sakuraQuizLabStyle="true";document.head.appendChild(l)}
function engine(){
 if(window.SakuraQuizEngine)return Promise.resolve(window.SakuraQuizEngine);
 const old=document.querySelector("script[data-sakura-quiz-engine]");
 if(old)return new Promise((ok,no)=>{old.addEventListener("load",()=>ok(window.SakuraQuizEngine),{once:true});old.addEventListener("error",no,{once:true})});
 return new Promise((ok,no)=>{const s=document.createElement("script");s.src="./features/sakura-quiz-engine.js?v=1";s.dataset.sakuraQuizEngine="true";s.async=true;s.onload=()=>window.SakuraQuizEngine?ok(window.SakuraQuizEngine):no(new Error("Quiz engine unavailable"));s.onerror=no;document.body.appendChild(s)});
}
function inject(){
 const q=document.getElementById("quiz-view"),bar=q?.querySelector(".tab-bar");if(!q||!bar)return false;if(document.getElementById("sakura-translation-quiz-panel"))return true;
 bar.classList.add("sakura-quiz-lab-tabbar");
 [["translation","Translate"],["particles","Particles"]].forEach(([k,label])=>{const b=document.createElement("button");b.type="button";b.className="tab-button";b.dataset.sakuraQuizLabTab=k;b.textContent=label;bar.appendChild(b)});
 const t=document.createElement("article");t.id="sakura-translation-quiz-panel";t.className="quiz-card sakura-quiz-lab-panel";t.dataset.quizPanel="translation";t.hidden=true;t.innerHTML=`
 <div class="quiz-card-heading"><span class="quiz-icon rose-feature">訳</span><div><h2>Translation Quiz</h2><p>Type natural Japanese or English. Stored natural alternatives can count.</p></div></div>
 <div class="sakura-quiz-lab-config"><label>JLPT study level<select id="translation-quiz-level">${levels(prefs.translationLevel)}</select></label><label>Direction<select id="translation-quiz-direction"><option value="mixed"${prefs.translationDirection==="mixed"?" selected":""}>Mixed JP ⇄ EN</option><option value="jp-en"${prefs.translationDirection==="jp-en"?" selected":""}>Japanese → English</option><option value="en-jp"${prefs.translationDirection==="en-jp"?" selected":""}>English → Japanese</option></select></label><label>Session<select id="translation-quiz-count">${counts(prefs.translationCount)}</select></label></div>
 <div id="translation-quiz-setup" class="sakura-quiz-lab-setup"><p><strong>1,200 prompts per level.</strong> Banks use curated level-specific sentence frames and compatible vocabulary combinations. Japanese answers use stored alternatives instead of AI guessing.</p><button id="start-translation-quiz" class="primary-button full-width-button" type="button">Start Translation Quiz</button><p id="translation-quiz-status" class="sakura-quiz-lab-status" role="status"></p></div><div id="translation-quiz-session" hidden></div>`;
 const p=document.createElement("article");p.id="sakura-particle-quiz-panel";p.className="quiz-card sakura-quiz-lab-panel";p.dataset.quizPanel="particles";p.hidden=true;p.innerHTML=`
 <div class="quiz-card-heading"><span class="quiz-icon lavender-feature">は</span><div><h2>Particle Fill-in Quiz</h2><p>Type the particle or compound marker that naturally completes the sentence.</p></div></div>
 <div class="sakura-quiz-lab-config particle-config"><label>JLPT study level<select id="particle-quiz-level">${levels(prefs.particleLevel)}</select></label><label>Session<select id="particle-quiz-count">${counts(prefs.particleCount)}</select></label></div>
 <div id="particle-quiz-setup" class="sakura-quiz-lab-setup"><p>Core particles begin at N5; higher levels add compound markers and linking expressions. Each level has 320 generated fill-in prompts.</p><button id="start-particle-quiz" class="primary-button full-width-button" type="button">Start Particle Quiz</button><p id="particle-quiz-status" class="sakura-quiz-lab-status" role="status"></p></div><div id="particle-quiz-session" hidden></div>`;
 q.append(t,p);return true;
}
function tab(k){document.querySelectorAll("#quiz-view [data-quiz-tab]").forEach(b=>b.classList.remove("active"));document.querySelectorAll("#quiz-view [data-sakura-quiz-lab-tab]").forEach(b=>b.classList.toggle("active",b.dataset.sakuraQuizLabTab===k));document.querySelectorAll("#quiz-view [data-quiz-panel]").forEach(p=>p.hidden=p.dataset.quizPanel!==k)}
function builtIn(){document.querySelectorAll("#quiz-view [data-sakura-quiz-lab-tab]").forEach(b=>b.classList.remove("active"))}
async function startTranslation(){
 const E=await engine(),level=document.getElementById("translation-quiz-level").value,direction=document.getElementById("translation-quiz-direction").value,count=+document.getElementById("translation-quiz-count").value;
 prefs={...prefs,translationLevel:level,translationDirection:direction,translationCount:count};save();const status=document.getElementById("translation-quiz-status"),btn=document.getElementById("start-translation-quiz");btn.disabled=true;status.textContent=`Preparing ${level} sentences…`;
 try{const pool=await E.translationPool(level),items=E.balanced(pool,count).map((x,i)=>({...x,direction:direction==="mixed"?(i%2?"en-jp":"jp-en"):direction}));status.textContent=`${pool.length.toLocaleString()} ${level} prompts ready.`;ts={level,items,index:0,correct:0,answered:false};renderT()}
 catch(e){console.error(e);status.textContent="This level could not load. Check your connection and try again."}
 finally{btn.disabled=false}
}
function renderT(){
 const setup=document.getElementById("translation-quiz-setup"),box=document.getElementById("translation-quiz-session");if(!ts){setup.hidden=false;box.hidden=true;return}setup.hidden=true;box.hidden=false;
 if(ts.index>=ts.items.length){box.innerHTML=`<div class="sakura-quiz-complete"><span>🌸</span><h2>Translation practice complete</h2><p><strong>${ts.correct} / ${ts.items.length}</strong> accepted</p><div class="sakura-quiz-lab-complete-actions"><button class="primary-button" data-t-restart>Practice Again</button><button class="secondary-button" data-t-finish>Change Settings</button></div></div>`;return}
 const x=ts.items[ts.index],jp=x.direction==="en-jp",prompt=jp?x.en:x.jp;box.innerHTML=`<div class="quiz-status-bar sakura-quiz-lab-progress"><span>${x.level}</span><span>${jp?"EN → JP":"JP → EN"}</span><strong>${ts.index+1} / ${ts.items.length}</strong></div><section class="sakura-translation-prompt"><span>${jp?"Translate naturally into Japanese":"Translate naturally into English"}</span><p lang="${jp?"en":"ja"}">${esc(prompt)}</p></section><textarea id="translation-quiz-answer" class="answer-input sakura-quiz-answer-area" rows="3" autocomplete="off" spellcheck="false" placeholder="${jp?"Type Japanese":"Type English"}"></textarea><div class="quiz-actions"><button class="primary-button" data-t-check>Check Answer</button><button class="secondary-button" data-t-reveal>Reveal</button></div><section id="translation-quiz-feedback" class="practice-feedback sakura-quiz-feedback" aria-live="polite" hidden></section>`;requestAnimationFrame(()=>document.getElementById("translation-quiz-answer")?.focus())
}
async function answerT(reveal=false){
 if(!ts||ts.answered)return;const E=await engine(),x=ts.items[ts.index],input=document.getElementById("translation-quiz-answer"),r=reveal?{accepted:false,kind:"reveal"}:E.gradeTranslation(input.value,x,x.direction);if(r.kind==="empty")return;ts.answered=true;if(r.accepted)ts.correct++;input.disabled=true;const f=document.getElementById("translation-quiz-feedback"),alts=x.direction==="en-jp"?x.jpAlternatives:x.enAlternatives,title=r.accepted?(r.kind==="exact"?"Correct 🌸":r.kind==="alternative"?"Natural alternative accepted 🌸":"Close enough 🌸"):(reveal?"Model answer":"Not quite");f.hidden=false;f.innerHTML=`<h2>${title}</h2><div class="practice-answer-reading"><strong lang="ja">${esc(x.jp)}</strong><span>${esc(x.en)}</span></div>${alts?.length?`<details class="sakura-accepted-answers"><summary>Other accepted answers</summary><ul>${alts.slice(0,4).map(a=>`<li>${esc(a)}</li>`).join("")}</ul></details>`:""}${r.kind==="close"?"<p>Your English was within a tiny typo distance of a stored accepted answer. Japanese grammar is not semantically fuzzy-matched.</p>":""}<button class="primary-button full-width-button" data-t-next>Next</button>`
}
async function startParticle(){
 const E=await engine(),level=document.getElementById("particle-quiz-level").value,count=+document.getElementById("particle-quiz-count").value;prefs={...prefs,particleLevel:level,particleCount:count};save();const status=document.getElementById("particle-quiz-status"),btn=document.getElementById("start-particle-quiz");btn.disabled=true;status.textContent=`Preparing ${level} particle practice…`;
 try{const pool=await E.particlePool(level);status.textContent=`${pool.length.toLocaleString()} ${level} prompts ready.`;ps={level,items:E.balanced(pool,count),index:0,correct:0,answered:false};renderP()}
 catch(e){console.error(e);status.textContent="This level could not load. Check your connection and try again."}
 finally{btn.disabled=false}
}
function renderP(){
 const setup=document.getElementById("particle-quiz-setup"),box=document.getElementById("particle-quiz-session");if(!ps){setup.hidden=false;box.hidden=true;return}setup.hidden=true;box.hidden=false;
 if(ps.index>=ps.items.length){box.innerHTML=`<div class="sakura-quiz-complete"><span>🌸</span><h2>Particle practice complete</h2><p><strong>${ps.correct} / ${ps.items.length}</strong> correct</p><div class="sakura-quiz-lab-complete-actions"><button class="primary-button" data-p-restart>Practice Again</button><button class="secondary-button" data-p-finish>Change Settings</button></div></div>`;return}
 const x=ps.items[ps.index];box.innerHTML=`<div class="quiz-status-bar sakura-quiz-lab-progress"><span>${x.level}</span><span>Fill the blank</span><strong>${ps.index+1} / ${ps.items.length}</strong></div><section class="sakura-particle-prompt"><span>Which particle fits naturally?</span><p lang="ja">${esc(x.sentence)}</p></section><input id="particle-quiz-answer" class="answer-input sakura-particle-answer" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type the particle"><div class="quiz-actions"><button class="primary-button" data-p-check>Check Answer</button><button class="secondary-button" data-p-hint>Hint</button><button class="secondary-button" data-p-reveal>Reveal</button></div><div id="particle-quiz-hint" class="sakura-particle-hint" hidden></div><section id="particle-quiz-feedback" class="practice-feedback sakura-quiz-feedback" aria-live="polite" hidden></section>`;requestAnimationFrame(()=>document.getElementById("particle-quiz-answer")?.focus())
}
async function answerP(reveal=false){
 if(!ps||ps.answered)return;const E=await engine(),x=ps.items[ps.index],input=document.getElementById("particle-quiz-answer");if(!reveal&&!E.normJp(input.value))return;const ok=!reveal&&E.gradeParticle(input.value,x);ps.answered=true;if(ok)ps.correct++;input.disabled=true;const f=document.getElementById("particle-quiz-feedback");f.hidden=false;f.innerHTML=`<h2>${ok?"Correct 🌸":reveal?"Answer revealed":"Not quite"}</h2><div class="practice-answer-reading"><strong lang="ja">${esc(x.sentence.replace("＿",x.answers[0]))}</strong><span>Answer: ${esc(x.answers.join(" / "))}</span></div><p>${esc(x.explanation)}</p><button class="primary-button full-width-button" data-p-next>Next</button>`
}
async function hint(){if(!ps||ps.answered)return;const E=await engine(),x=ps.items[ps.index],h=document.getElementById("particle-quiz-hint");h.hidden=false;h.textContent=E.shuffle(x.choices?.length?x.choices:x.answers).join(" · ")}
function change(e){const t=e.target;if(t.id==="translation-quiz-level")prefs.translationLevel=t.value;else if(t.id==="translation-quiz-direction")prefs.translationDirection=t.value;else if(t.id==="translation-quiz-count")prefs.translationCount=+t.value;else if(t.id==="particle-quiz-level")prefs.particleLevel=t.value;else if(t.id==="particle-quiz-count")prefs.particleCount=+t.value;else return;save()}
function click(e){
 const t=e.target.closest("[data-sakura-quiz-lab-tab]");if(t){e.preventDefault();tab(t.dataset.sakuraQuizLabTab);return}
 if(e.target.closest("#quiz-view [data-quiz-tab]")){builtIn();return}
 if(e.target.closest("#start-translation-quiz"))startTranslation();else if(e.target.closest("[data-t-check]"))answerT();else if(e.target.closest("[data-t-reveal]"))answerT(true);else if(e.target.closest("[data-t-next]")){ts.index++;ts.answered=false;renderT()}else if(e.target.closest("[data-t-restart]"))startTranslation();else if(e.target.closest("[data-t-finish]")){ts=null;renderT()}
 else if(e.target.closest("#start-particle-quiz"))startParticle();else if(e.target.closest("[data-p-check]"))answerP();else if(e.target.closest("[data-p-hint]"))hint();else if(e.target.closest("[data-p-reveal]"))answerP(true);else if(e.target.closest("[data-p-next]")){ps.index++;ps.answered=false;renderP()}else if(e.target.closest("[data-p-restart]"))startParticle();else if(e.target.closest("[data-p-finish]")){ps=null;renderP()}
}
function key(e){if(e.key!=="Enter"||e.shiftKey)return;if(e.target.id==="translation-quiz-answer"&&ts&&!ts.answered){e.preventDefault();answerT()}else if(e.target.id==="particle-quiz-answer"&&ps&&!ps.answered){e.preventDefault();answerP()}}
function init(){if(ready)return true;stylesheet();if(!inject())return false;ready=true;document.addEventListener("click",click,true);document.addEventListener("change",change);document.addEventListener("keydown",key);return true}
window.SakuraQuizLab=Object.freeze({version:1,init});
if(!init()){let n=0;const id=setInterval(()=>{if(init()||++n>=20)clearInterval(id)},250)}
}());
