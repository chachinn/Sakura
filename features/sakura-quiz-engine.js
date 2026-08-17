/* Sakura JLPT Quiz Engine v2.2 */
(function(){
if(window.SakuraQuizEngine)return;
const L=["N5","N4","N3","N2","N1"],cache=new Map(),pending=new Map();
const level=v=>L.includes(v)?v:"N5";
const PARTICLE_ROMAJI=Object.freeze({"で":"de","に":"ni","へ":"e","を":"o","と":"to","は":"wa","が":"ga","から":"kara","ので":"node","ながら":"nagara","しか":"shika","より":"yori","について":"ni tsuite","に対して":"ni taishite","によって":"ni yotte","として":"to shite","たびに":"tabi ni","うちに":"uchi ni","に関して":"ni kanshite","に応じて":"ni oujite","に伴って":"ni tomonatte","に基づいて":"ni motozuite","に限らず":"ni kagirazu","上で":"ue de","末に":"sue ni","と相まって":"to aimatte","に鑑みて":"ni kangamite","にかかわらず":"ni kakawarazu","をよそに":"o yoso ni","どころか":"dokoro ka","や否や":"ya inaya","をめぐって":"o megutte"});
const PARTICLE_ROMAJI_ALIASES=Object.freeze({"は":["wa","ha"],"へ":["e","he"],"を":["o","wo"]});
const q=(j,e,c,r)=>({j,e,c,r});
const N5_PEOPLE=Object.freeze([
 q("友だち","my friend","My friend","tomodachi"),q("家族","my family","My family","kazoku"),q("姉","my older sister","My older sister","ane"),
 q("兄","my older brother","My older brother","ani"),q("母","my mother","My mother","haha"),q("父","my father","My father","chichi")
]);
const ACTIVITY_PLACES=Object.freeze([
 q("カフェ","a café","A café","kafe"),q("図書館","the library","The library","toshokan"),q("学校","school","School","gakkou"),
 q("家","home","Home","ie"),q("公園","the park","The park","kouen"),q("駅","the station","The station","eki")
]);
const N5_ACTIVITIES=Object.freeze([
 q("日本語を勉強します","study Japanese","Study Japanese","nihongo o benkyou shimasu"),q("本を読みます","read a book","Read a book","hon o yomimasu"),
 q("音楽を聞きます","listen to music","Listen to music","ongaku o kikimasu"),q("写真を見ます","look at photos","Look at photos","shashin o mimasu"),
 q("ノートを書きます","write in a notebook","Write in a notebook","nooto o kakimasu"),q("メールを書きます","write an email","Write an email","meeru o kakimasu")
]);
const MEAL_PLACES=Object.freeze([
 q("レストラン","a restaurant","A restaurant","resutoran"),q("食堂","a dining hall","A dining hall","shokudou"),q("フードコート","a food court","A food court","fuudo kooto"),
 q("ホテルのレストラン","the hotel restaurant","The hotel restaurant","hoteru no resutoran"),q("駅のレストラン","a restaurant at the station","A restaurant at the station","eki no resutoran"),
 q("デパートのレストラン","a department-store restaurant","A department-store restaurant","depaato no resutoran")
]);
const MEAL_FOODS=Object.freeze([
 q("ラーメン","ramen","Ramen","raamen"),q("カレー","curry","Curry","karee"),q("寿司","sushi","Sushi","sushi"),
 q("うどん","udon","Udon","udon"),q("そば","soba","Soba","soba"),q("定食","a set meal","A set meal","teishoku")
]);
const N5_DESTINATIONS=Object.freeze([
 q("カフェ","a café","A café","kafe"),q("図書館","the library","The library","toshokan"),q("学校","school","School","gakkou"),
 q("公園","the park","The park","kouen"),q("駅","the station","The station","eki"),q("レストラン","a restaurant","A restaurant","resutoran")
]);
const DISCUSSION_PLACES=Object.freeze([
 q("カフェ","a café","A café","kafe"),q("職場","work","Work","shokuba"),q("学校","school","School","gakkou"),
 q("会議室","the meeting room","The meeting room","kaigishitsu"),q("オンライン会議","an online meeting","An online meeting","onrain kaigi"),q("休憩室","the break room","The break room","kyuukeishitsu")
]);
const WORK_TOPICS=Object.freeze([
 q("新しいサービス","the new service","The new service","atarashii saabisu"),q("次のイベント","the next event","The next event","tsugi no ibento"),
 q("今後の目標","future goals","Future goals","kongo no mokuhyou"),q("仕事の進め方","how to proceed with work","How to proceed with work","shigoto no susumekata"),
 q("運用方法","the operating method","The operating method","unyou houhou"),q("計画の見直し","the plan review","The plan review","keikaku no minaoshi")
]);
const tpl=(s,c)=>String(s||"").replace(/\{([a-z])\.([jecr])\}/g,(_,a,f)=>String(c?.[a]?.[f]||""));
const template=(list,id)=>list.find(row=>row?.[0]===id);
function retarget(list,id,slot,pool){const row=template(list,id);if(row?.[3])row[3][slot]=pool;}
function replaceTonight(values){return(Array.isArray(values)?values:[]).map(value=>value?.j==="今夜"?{...value,j:"今晩",r:"konban"}:value);}
function polishBank(bank){
 const b=bank;b.x={...b.x};
 if(b.l==="N5"){
  b.x.time=replaceTonight(b.x.time);b.x.person=[...N5_PEOPLE];b.x.activity=[...N5_ACTIVITIES];b.x.activityPlace=[...ACTIVITY_PLACES];b.x.mealPlace=[...MEAL_PLACES];b.x.mealFood=[...MEAL_FOODS];b.x.destinationPlace=[...N5_DESTINATIONS];
  retarget(b.t,"eat","c","mealPlace");retarget(b.t,"eat","d","mealFood");retarget(b.t,"go","c","destinationPlace");
  retarget(b.p,"de","b","activityPlace");retarget(b.p,"de-big-matrix","c","mealPlace");retarget(b.p,"de-big-matrix","d","mealFood");
  const daily=template(b.t,"daily-matrix");if(daily){daily[1]="{a.j}、{c.j}で{d.j}。";daily[2]="{a.c}, I will {d.e} at {c.e}.";daily[3]={a:"time",c:"activityPlace",d:"activity"};daily[5]=["I will {d.e} at {c.e} {a.e}."];daily[6]="{a.r}, {c.r} de {d.r}.";}
  const buy=template(b.t,"buy");if(buy){buy[1]="{a.j}、{c.j}を買います。";buy[2]="{a.c}, I will buy {c.e}.";buy[3]={a:"time",c:"item"};buy[5]=["I will buy {c.e} {a.e}."];buy[6]="{a.r}, {c.r} o kaimasu.";}
 }
 if(b.l==="N4"){
  b.x.time=replaceTonight(b.x.time);b.x.mealPlace=[...MEAL_PLACES];b.x.mealFood=[...MEAL_FOODS];
  retarget(b.t,"after-matrix","c","mealPlace");retarget(b.t,"after-matrix","d","mealFood");retarget(b.p,"de-matrix","c","mealPlace");retarget(b.p,"de-matrix","d","mealFood");
 }
 if(b.l==="N3"){
  b.x.discussionPlace=[...DISCUSSION_PLACES];
  retarget(b.t,"discussion-matrix","b","discussionPlace");retarget(b.p,"nitsuite","a","discussionPlace");retarget(b.p,"about-matrix","a","discussionPlace");retarget(b.p,"about-big-matrix","b","discussionPlace");
 }
 if(b.l==="N2"){
  b.x.workTopic=[...WORK_TOPICS];
  retarget(b.t,"formal-matrix","d","workTopic");retarget(b.p,"nikanshite","c","workTopic");retarget(b.p,"regarding-matrix","b","workTopic");retarget(b.p,"regarding-big-matrix","d","workTopic");
 }
 if(b.l==="N1"){
  b.x.workTopic=[...WORK_TOPICS];
  retarget(b.t,"deliberation-matrix","d","workTopic");retarget(b.p,"sueni","c","workTopic");
 }
 return b;
}
function* combos(b,t){
 const entries=Object.entries(t[3]||{});
 if(!entries.length){yield{};return}
 function* walk(i,c){
  if(i===entries.length){yield{...c};return}
  const [slot,name]=entries[i],values=b.x[name]||[];
  for(const value of values){c[slot]=value;yield*walk(i+1,c)}
  delete c[slot];
 }
 yield*walk(0,{});
}
function iter(b,t,kind){
 const g=combos(b,t);let n=0;
 return{next(){const r=g.next();if(r.done)return r;n++;const c=r.value;
  if(kind==="t")return{done:false,value:{id:`${b.l}:translation:${t[0]}:${n}`,level:b.l,jp:tpl(t[1],c),en:tpl(t[2],c),jpAlternatives:(t[4]||[]).map(x=>tpl(x,c)),enAlternatives:(t[5]||[]).map(x=>tpl(x,c)),romaji:tpl(t[6],c)}};
  return{done:false,value:{id:`${b.l}:particle:${t[0]}:${n}`,level:b.l,sentence:tpl(t[1],c),answers:(t[2]||[]).map(x=>tpl(x,c)),choices:(t[5]||[]).map(x=>tpl(x,c)),explanation:tpl(t[4],c),romaji:tpl(t[6],c)}};
 }};
}
const UNNATURAL_PATTERNS=[/(図書館|学校|公園|職場|駅)で(ラーメン|カレー|寿司|うどん|そば|定食|ケーキ)を食/,/カフェで(ラーメン|カレー|寿司|うどん|そば|定食)を食/];
const naturalCandidate=item=>!UNNATURAL_PATTERNS.some(pattern=>pattern.test(item.jp||item.sentence||""));
function materialize(b,kind,target){
 const source=kind==="t"?b.t:b.p,its=source.map(t=>iter(b,t,kind)),out=[],seen=new Set();
 let guard=0;
 while(its.length&&out.length<target&&guard<target*Math.max(30,source.length)){guard++;
  for(let i=its.length-1;i>=0&&out.length<target;i--){
   const r=its[i].next();if(r.done){its.splice(i,1);continue}
   const x=r.value;if(!naturalCandidate(x))continue;const key=kind==="t"?`${x.jp}\0${x.en}`:`${x.sentence}\0${x.answers.join("|")}`;
   if(seen.has(key))continue;seen.add(key);out.push(x);
  }
 }
 return out;
}
async function load(v){
 const l=level(v);if(cache.has(l))return cache.get(l);if(pending.has(l))return pending.get(l);
 const p=fetch(`./data/quizzes/${l.toLowerCase()}.json?v=2`,{cache:"no-cache"})
  .then(r=>{if(!r.ok)throw new Error(`Quiz content HTTP ${r.status}`);return r.json()})
  .then(b=>{if(!b||b.l!==l||!b.x||!Array.isArray(b.t)||!Array.isArray(b.p))throw new Error(`Invalid ${l} quiz bank`);const polished=polishBank(b);cache.set(l,polished);return polished})
  .finally(()=>pending.delete(l));
 pending.set(l,p);return p;
}
const normEn=v=>String(v||"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/&/g," and ").replace(/[^a-z0-9'\s-]/g," ").replace(/\s+/g," ").trim();
const normJp=v=>String(v||"").normalize("NFKC").replace(/[。、，．！？!?「」『』（）()\[\]【】・…‥〜~"'“”‘’\s]/g,"").trim();
const normRomaji=v=>String(v||"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/[āáàâä]/g,"a").replace(/[īíìîï]/g,"i").replace(/[ūúùûü]/g,"u").replace(/[ēéèêë]/g,"e").replace(/[ōóòôö]/g,"o").replace(/[^a-z0-9'\s-]/g," ").replace(/[-_]+/g," ").replace(/\s+/g," ").trim();
function distance(a,b){
 if(a===b)return 0;if(!a)return b.length;if(!b)return a.length;
 const p=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){let d=p[0];p[0]=i;for(let j=1;j<=b.length;j++){const old=p[j];p[j]=Math.min(p[j]+1,p[j-1]+1,d+(a[i-1]===b[j-1]?0:1));d=old}}
 return p[b.length];
}
function gradeTranslation(value,item,direction){
 const jp=direction==="en-jp",norm=jp?normJp:normEn,canonical=jp?item.jp:item.en,alts=jp?item.jpAlternatives:item.enAlternatives,v=norm(value);
 if(!v)return{accepted:false,kind:"empty"};
 if(v===norm(canonical))return{accepted:true,kind:"exact"};
 if((alts||[]).some(x=>v===norm(x)))return{accepted:true,kind:"alternative"};
 if(jp){const romaji=normRomaji(value),modelRomaji=normRomaji(item.romaji);if(romaji&&modelRomaji&&romaji===modelRomaji)return{accepted:true,kind:"alternative",inputMode:"romaji"};}
 if(!jp){const close=[canonical,...(alts||[])].map(norm).find(x=>x.length>=5&&Math.abs(v.length-x.length)<=(x.length>=18?2:1)&&distance(v,x)<=(x.length>=18?2:1));if(close)return{accepted:true,kind:"close"};}
 return{accepted:false,kind:"wrong"};
}
function particleRomajiForms(answer){const canonical=PARTICLE_ROMAJI[answer],aliases=PARTICLE_ROMAJI_ALIASES[answer]||[];return[...new Set([canonical,...aliases].filter(Boolean).map(normRomaji).filter(Boolean))];}
const gradeParticle=(value,item)=>{const jp=normJp(value);if(jp&&item.answers.some(x=>normJp(x)===jp))return true;const romaji=normRomaji(value);return!!romaji&&item.answers.some(answer=>particleRomajiForms(answer).includes(romaji));};
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
function balanced(items,count){
 const g=new Map();items.forEach(x=>{const k=String(x.id).split(":")[2];if(!g.has(k))g.set(k,[]);g.get(k).push(x)});
 const buckets=shuffle([...g.values()].map(shuffle)),out=[];let cursor=0;
 while(buckets.length&&out.length<count){const i=cursor%buckets.length,b=buckets[i],x=b.pop();if(x)out.push(x);if(!b.length){buckets.splice(i,1);if(!buckets.length)break;cursor%=buckets.length}else cursor++}
 return out;
}
window.SakuraQuizEngine=Object.freeze({
 version:2.2,qualityVersion:1,levels:L,load,
 translationPool:async v=>{const b=await load(v),x=materialize(b,"t",Math.max(1200,+b.translationTarget||1200));if(x.length<1000)throw new Error(`${b.l} needs at least 1000 translation prompts`);return x},
 particlePool:async v=>{const b=await load(v),x=materialize(b,"p",Math.max(1200,+b.particleTarget||1200));if(x.length<1000)throw new Error(`${b.l} needs at least 1000 particle prompts`);return x},
 gradeTranslation,gradeParticle,balanced,shuffle,normEn,normJp,normRomaji
});
}());
