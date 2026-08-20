/* Sakura Practice Grid Compatibility v2
   The former full-width Real-Life Drills card was merged into What Would You Say?.
   Keep this lightweight compatibility shim until the next loader cleanup.
*/
(function initializeSakuraPracticeGridCompatibility(){
  'use strict';
  if(window.SakuraPracticeGridPolish?.version>=2)return;

  function cleanup(){
    document.getElementById('source-practice-launch')?.remove();
    document.querySelector('#practice-view .practice-coming-grid')?.classList.remove('practice-grid-balanced');
  }

  window.SakuraPracticeGridPolish=Object.freeze({version:2,cleanup});
  if(document.body)cleanup();else document.addEventListener('DOMContentLoaded',cleanup,{once:true});
}());
