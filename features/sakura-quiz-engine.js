/* Sakura JLPT Quiz Engine v2 */
(function(){
if(window.SakuraQuizEngine)return;
const L=["N5","N4","N3","N2","N1"],cache=new Map(),pending=new Map();
const level=v=>L.includes(v)?v:"N5";
const tpl=(s,c)=>String(s||"").replace(/\{([a-z])\.([jecr])\}/g,(_,a,f)=>String(c?.[a]?.[f]||""));
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
function materialize(b,kind,target){
 const source=kind==="t"?b.t:b.p,its=source.map(t=>iter(b,t,kind)),out=[],seen=new Set();
 let guard=0;
 while(its.length&&out.length<target&&guard<target*Math.max(20,source.length)){guard++;
  for(let i=its.length-1;i>=0&&out.length<target;i--){
   const r=its[i].next();if(r.done){its.splice(i,1);continue}
   const x=r.value,key=kind==="t"?`${x.jp}\0${x.en}`:`${x.sentence}\0${x.answers.join("|")}`;
   if(seen.has(key))continue;seen.add(key);out.push(x);
  }
 }
 return out;
}
async function load(v){
 const l=level(v);if(cache.has(l))return cache.get(l);if(pending.has(l))return pending.get(l);
 const p=fetch(`./data/quizzes/${l.toLowerCase()}.json?v=2`,{cache:"no-cache"})
  .then(r=>{if(!r.ok)throw new Error(`Quiz content HTTP ${r.status}`);return r.json()})
  .then(b=>{if(!b||b.l!==l||!b.x||!Array.isArray(b.t)||!Array.isArray(b.p))throw new Error(`Invalid ${l} quiz bank`);cache.set(l,b);return b})
  .finally(()=>pending.delete(l));
 pending.set(l,p);return p;
}
const normEn=v=>String(v||"").normalize("NFKC").toLowerCase().replace(/[’‘]/g,"'").replace(/&/g," and ").replace(/[^a-z0-9'\s-]/g," ").replace(/\s+/g," ").trim();
const normJp=v=>String(v||"").normalize("NFKC").replace(/[。、，．！？!?「」『』（）()\[\]【】・…‥〜~"'“”‘’\s]/g,"").trim();
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
 if(!jp){
  const close=[canonical,...(alts||[])].map(norm).find(x=>x.length>=5&&Math.abs(v.length-x.length)<=(x.length>=18?2:1)&&distance(v,x)<=(x.length>=18?2:1));
  if(close)return{accepted:true,kind:"close"};
 }
 return{accepted:false,kind:"wrong"};
}
const gradeParticle=(value,item)=>{const v=normJp(value);return !!v&&item.answers.some(x=>normJp(x)===v)};
const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
function balanced(items,count){
 const g=new Map();items.forEach(x=>{const k=String(x.id).split(":")[2];if(!g.has(k))g.set(k,[]);g.get(k).push(x)});
 const buckets=shuffle([...g.values()].map(shuffle)),out=[];let cursor=0;
 while(buckets.length&&out.length<count){const i=cursor%buckets.length,b=buckets[i],x=b.pop();if(x)out.push(x);if(!b.length){buckets.splice(i,1);if(!buckets.length)break;cursor%=buckets.length}else cursor++}
 return out;
}
window.SakuraQuizEngine=Object.freeze({
 version:2,levels:L,load,
 translationPool:async v=>{const b=await load(v),x=materialize(b,"t",Math.max(1200,+b.translationTarget||1200));if(x.length<1000)throw new Error(`${b.l} needs at least 1000 translation prompts`);return x},
 particlePool:async v=>{const b=await load(v),x=materialize(b,"p",Math.max(1200,+b.particleTarget||1200));if(x.length<1000)throw new Error(`${b.l} needs at least 1000 particle prompts`);return x},
 gradeTranslation,gradeParticle,balanced,shuffle,normEn,normJp
});
}());
