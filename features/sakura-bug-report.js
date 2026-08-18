/* Sakura Bug Report v1.1 */
(function initializeSakuraBugReport(){
  'use strict';
  if(window.SakuraBugReport)return;

  const CONFIG=Object.freeze({
    endpoint:'https://hrycfsekrvflrbwahgyh.supabase.co/functions/v1/sakura-bug-report',
    maxAttachmentBytes:3*1024*1024,
    acceptedTypes:new Set(['image/jpeg','image/png','image/webp','image/heic','image/heif'])
  });
  let dialog=null;

  const currentRoute=()=>String(location.hash||'#home').replace(/^#/,'')||'home';
  const appVersion=()=>{const src=document.querySelector('script[src*="app.js"]')?.src||'';const m=src.match(/[?&]v=([^&]+)/);return m?`app-v${m[1]}`:'v1';};
  const userAgentSummary=()=>navigator.userAgent.slice(0,500);

  function injectStyle(){
    if(document.getElementById('sakura-bug-report-style'))return;
    const style=document.createElement('style');
    style.id='sakura-bug-report-style';
    style.textContent=`
      .sakura-bug-launch{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 0 4px;padding:12px 13px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);color:var(--color-text);font:inherit;font-weight:850;text-align:left}
      .sakura-bug-launch span:first-child{display:flex;align-items:center;gap:9px}.sakura-bug-launch small{display:block;color:var(--color-text-muted);font-size:8px;font-weight:650;margin-top:2px}.sakura-bug-launch .arrow{color:var(--color-primary-dark);font-size:18px}
      .sakura-bug-dialog{border:0;padding:0;background:transparent;max-width:none;width:min(94vw,560px)}.sakura-bug-dialog::backdrop{background:rgba(34,27,32,.32);backdrop-filter:blur(3px)}
      .sakura-bug-card{max-height:min(84vh,760px);overflow:auto;background:var(--color-surface);border:1px solid var(--color-border);border-radius:22px;padding:18px;box-shadow:0 20px 70px rgba(40,28,35,.2)}
      .sakura-bug-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.sakura-bug-head h2{margin:2px 0 4px;font-size:24px}.sakura-bug-head p{margin:0;color:var(--color-text-muted);font-size:13px;line-height:1.45}.sakura-bug-close{width:40px;height:40px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);font:inherit;font-size:22px;color:var(--color-text)}
      .sakura-bug-form{display:grid;gap:12px}.sakura-bug-form label{display:grid;gap:6px;font-size:12px;font-weight:800;color:var(--color-text)}.sakura-bug-form input,.sakura-bug-form textarea,.sakura-bug-form select{width:100%;box-sizing:border-box;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:14px;padding:12px}.sakura-bug-form textarea{resize:vertical;min-height:90px;line-height:1.45}
      .sakura-bug-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.sakura-bug-optional{font-size:10px;color:var(--color-text-muted);font-weight:650}.sakura-bug-file{padding:12px;border:1px dashed color-mix(in srgb,var(--color-primary) 45%,var(--color-border));border-radius:14px;background:color-mix(in srgb,var(--color-primary-soft) 45%,var(--color-surface))}.sakura-bug-file small{font-size:10px;color:var(--color-text-muted);font-weight:600}.sakura-bug-file-name{margin-top:7px;font-size:11px;color:var(--color-primary-dark);font-weight:800;word-break:break-word}.sakura-bug-honeypot{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden!important}
      .sakura-bug-actions{display:grid;grid-template-columns:auto 1fr;gap:9px;position:sticky;bottom:-18px;padding:12px 0 2px;background:linear-gradient(transparent,var(--color-surface) 22%)}.sakura-bug-actions button{min-height:46px;border-radius:13px;font:inherit;font-weight:850;padding:10px 14px}.sakura-bug-cancel{border:1px solid var(--color-border);background:var(--color-surface);color:var(--color-text)}.sakura-bug-send{border:0;background:var(--color-primary);color:white}.sakura-bug-send:disabled{opacity:.55}
      .sakura-bug-status{min-height:18px;margin:0;font-size:11px;line-height:1.4}.sakura-bug-status.error{color:#b4234d}.sakura-bug-status.success{color:#18794e}
      @media(max-width:520px){.sakura-bug-dialog{width:calc(100vw - 20px)}.sakura-bug-card{padding:16px;border-radius:20px}.sakura-bug-row{grid-template-columns:1fr}.sakura-bug-actions{grid-template-columns:1fr 1.6fr}}
    `;
    document.head.appendChild(style);
  }

  function setStatus(message,kind=''){
    const node=dialog?.querySelector('.sakura-bug-status');
    if(!node)return;
    node.className=`sakura-bug-status${kind?` ${kind}`:''}`;
    node.textContent=message;
  }

  function fileToBase64(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>{const result=String(reader.result||'');resolve(result.includes(',')?result.split(',').pop():result);};
      reader.onerror=()=>reject(new Error('Could not read the attachment.'));
      reader.readAsDataURL(file);
    });
  }

  async function submitReport(event){
    event.preventDefault();
    const form=event.currentTarget,send=form.querySelector('.sakura-bug-send');
    if(send.disabled)return;
    const data=new FormData(form);
    const title=String(data.get('title')||'').trim(),details=String(data.get('details')||'').trim(),contact=String(data.get('contact')||'').trim(),expected=String(data.get('expected')||'').trim(),type=String(data.get('type')||'bug'),honeypot=String(data.get('website')||'').trim();
    const candidate=data.get('attachment');
    const attachment=candidate instanceof File&&candidate.size?candidate:null;
    if(!title||!details){setStatus('Please add a short title and describe what happened.','error');return;}
    if(contact&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)){setStatus('Please check the contact email, or leave it blank.','error');return;}
    if(attachment){
      if(attachment.size>CONFIG.maxAttachmentBytes){setStatus('That image is larger than 3 MB. Please choose a smaller screenshot.','error');return;}
      if(!CONFIG.acceptedTypes.has(attachment.type)){setStatus('Please attach a JPEG, PNG, WebP, HEIC or HEIF image.','error');return;}
    }
    send.disabled=true;setStatus('Sending your report…');
    try{
      const key=window.SAKURA_AUTH_CONFIG?.publishableKey||window.SAKURA_AI_CONFIG?.gatewayKey;
      if(!key)throw new Error('Sakura service configuration is not ready. Reopen the app and try again.');
      const payload={type,title,details,expected,contact,website:honeypot,context:{route:currentRoute(),appVersion:appVersion(),url:location.href,language:navigator.language,userAgent:userAgentSummary(),sentAt:new Date().toISOString()},attachment:attachment?{filename:attachment.name,mimeType:attachment.type,size:attachment.size,content:await fileToBase64(attachment)}:null};
      const response=await fetch(CONFIG.endpoint,{method:'POST',headers:{'content-type':'application/json','apikey':key},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result?.error||'Could not send the bug report.');
      form.reset();
      const fileName=dialog.querySelector('.sakura-bug-file-name');fileName.hidden=true;fileName.textContent='';
      setStatus('Sent — thank you! Your report went straight to Sakura support.','success');
      setTimeout(()=>{if(dialog?.open)dialog.close();},1400);
    }catch(error){console.warn('Sakura bug report failed.',error);setStatus(error?.message||'Could not send the report. Please try again.','error');}
    finally{send.disabled=false;}
  }

  function buildDialog(){
    if(dialog)return dialog;
    injectStyle();
    dialog=document.createElement('dialog');
    dialog.id='sakura-bug-report-dialog';dialog.className='sakura-bug-dialog';dialog.setAttribute('aria-labelledby','sakura-bug-title');
    dialog.innerHTML=`<section class="sakura-bug-card"><header class="sakura-bug-head"><div><span class="section-kicker">Help improve Sakura</span><h2 id="sakura-bug-title">Report a Bug</h2><p>Tell us what went wrong. A screenshot is optional but really helpful.</p></div><button class="sakura-bug-close" type="button" aria-label="Close bug report">×</button></header><form class="sakura-bug-form" id="sakura-bug-form" novalidate><div class="sakura-bug-row"><label>Type<select name="type"><option value="bug">Bug</option><option value="content">Wrong Japanese / content</option><option value="ui">UI / display issue</option><option value="performance">Slow / laggy</option><option value="other">Other</option></select></label><label>Contact email <span class="sakura-bug-optional">Optional</span><input name="contact" type="email" inputmode="email" autocomplete="email" maxlength="160" placeholder="So we can follow up"></label></div><label>Short title<input name="title" maxlength="120" required placeholder="Example: Particle answer is visible"></label><label>What happened?<textarea name="details" maxlength="4000" required placeholder="What did you tap, what appeared, and what was wrong?"></textarea></label><label>What should have happened? <span class="sakura-bug-optional">Optional</span><textarea name="expected" maxlength="2000" placeholder="What did you expect instead?"></textarea></label><label class="sakura-bug-file">Screenshot / photo <span class="sakura-bug-optional">Optional</span><input name="attachment" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif"><small>JPEG, PNG, WebP, HEIC or HEIF · up to 3 MB</small><span class="sakura-bug-file-name" hidden></span></label><label class="sakura-bug-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><p class="sakura-bug-status" role="status" aria-live="polite"></p><div class="sakura-bug-actions"><button class="sakura-bug-cancel" type="button">Cancel</button><button class="sakura-bug-send" type="submit">Send Bug Report</button></div></form></section>`;
    document.body.appendChild(dialog);
    dialog.querySelector('.sakura-bug-close').addEventListener('click',()=>dialog.close());
    dialog.querySelector('.sakura-bug-cancel').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
    const file=dialog.querySelector('input[name="attachment"]');
    file.addEventListener('change',()=>{const chosen=file.files?.[0]||null,label=dialog.querySelector('.sakura-bug-file-name');if(!chosen){label.hidden=true;label.textContent='';return;}label.hidden=false;label.textContent=`${chosen.name} · ${(chosen.size/1024/1024).toFixed(2)} MB`;});
    dialog.querySelector('#sakura-bug-form').addEventListener('submit',submitReport);
    return dialog;
  }

  function open(){const d=buildDialog();setStatus('');if(!d.open)d.showModal();requestAnimationFrame(()=>d.querySelector('input[name="title"]')?.focus());}

  function ensureMenuButton(){
    const hub=document.querySelector('#hub-view');
    if(!hub)return false;
    let button=document.getElementById('sakura-bug-report-launch');
    if(!button){
      button=document.createElement('button');button.id='sakura-bug-report-launch';button.className='sakura-bug-launch';button.type='button';
      button.innerHTML='<span><span aria-hidden="true">🐞</span><span>Report a Bug<small>Send details + optional screenshot</small></span></span><span class="arrow" aria-hidden="true">›</span>';
      button.addEventListener('click',()=>{document.getElementById('close-hub')?.click();setTimeout(open,50);});
    }
    // Support belongs after the main navigation/settings content, not above it.
    if(button.parentElement!==hub||button!==hub.lastElementChild)hub.appendChild(button);
    return true;
  }

  function init(){buildDialog();if(!ensureMenuButton())setTimeout(init,160);}
  window.SakuraBugReport=Object.freeze({version:1.1,open,init});
  if(document.body)init();else document.addEventListener('DOMContentLoaded',init,{once:true});
}());
