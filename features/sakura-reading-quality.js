/* Sakura Reading Garden Quality Compatibility v2
   Final Reading Garden completion no longer caps learner-facing shelves at 50.
   Keep this lightweight compatibility module so existing script references remain valid
   while the full 2,000-reading runtime owns counts, shelf readiness and rendering. */
(function(){
'use strict';
if(window.SakuraReadingQuality)return;
let ready=false;
function init(){
 if(ready)return;
 ready=true;
 const rg=window.SakuraReadingGarden;
 if(!rg){setTimeout(()=>{ready=false;init();},120);return;}
 document.querySelector('[data-open-reading-garden] p')?.replaceChildren(document.createTextNode('Source-checked Reading Garden · full library completion in progress.'));
}
window.SakuraReadingQuality=Object.freeze({version:2,legacyCapRetired:true,init});
init();
}());
