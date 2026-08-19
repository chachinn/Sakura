/* Sakura Practice Grid Polish v1 */
(function initializeSakuraPracticeGridPolish(){
  'use strict';
  if(window.SakuraPracticeGridPolish)return;

  function injectStyle(){
    if(document.getElementById('sakura-practice-grid-polish-style'))return;
    const style=document.createElement('style');
    style.id='sakura-practice-grid-polish-style';
    style.textContent=`
      #practice-view .practice-coming-grid.practice-grid-balanced{align-items:stretch}
      #practice-view .practice-coming-grid.practice-grid-balanced>.practice-coming-card{min-width:0;height:100%}
      #practice-view .practice-coming-grid.practice-grid-balanced>.source-practice-launch{
        grid-column:1 / -1!important;
        min-height:104px!important;
        padding:16px 18px!important;
        overflow:hidden;
        border-color:color-mix(in srgb,var(--color-primary) 30%,var(--color-border));
        background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary-soft) 72%,var(--color-surface)),var(--color-surface));
      }
      #practice-view .source-practice-launch>span:nth-child(2){
        min-width:0!important;
        padding:12px 0 0!important;
      }
      #practice-view .source-practice-launch h2{
        padding-right:0!important;
        overflow-wrap:normal!important;
        word-break:normal!important;
        hyphens:none!important;
        font-size:17px;
        line-height:1.22;
      }
      #practice-view .source-practice-launch p{
        max-width:280px;
        margin-top:4px!important;
        font-size:10px;
        line-height:1.4;
      }
      #practice-view .source-practice-launch::after{
        top:11px!important;
        right:14px!important;
        left:auto!important;
        padding:4px 8px!important;
        font-size:7px!important;
        letter-spacing:.07em!important;
      }
      @media(max-width:360px){
        #practice-view .practice-coming-grid.practice-grid-balanced{grid-template-columns:1fr!important}
        #practice-view .practice-coming-grid.practice-grid-balanced>.source-practice-launch{grid-column:1!important}
      }
    `;
    document.head.appendChild(style);
  }

  function polish(){
    injectStyle();
    const grid=document.querySelector('#practice-view .practice-coming-grid');
    const card=document.getElementById('source-practice-launch');
    if(!grid||!card)return false;
    grid.classList.add('practice-grid-balanced');
    const title=card.querySelector('h2');
    const description=card.querySelector('p');
    if(title)title.textContent='Real-Life Drills';
    if(description)description.textContent='30 source-grounded everyday scenarios with the official lesson shown after each answer.';
    return true;
  }

  function init(){
    if(polish())return;
    const root=document.getElementById('practice-view')||document.body;
    const observer=new MutationObserver(()=>{if(polish())observer.disconnect();});
    observer.observe(root,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),5000);
  }

  window.SakuraPracticeGridPolish=Object.freeze({version:1,init,polish});
  if(document.body)init();else document.addEventListener('DOMContentLoaded',init,{once:true});
}());
