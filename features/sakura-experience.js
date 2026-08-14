/* Sakura Experience Layer — compact production enhancement v1.2
   Native-first online slang suggestions, Travel quick tools, compact Practice UI.
   Loaded after app.js and intentionally isolated so failure never blocks core Sakura. */
(function initSakuraExperience(){
  'use strict';
  if (window.SakuraExperience) return;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[“”‘’]/g,"'").replace(/\s+/g,' ').trim();
  const $ = (id) => document.getElementById(id);

  const NATIVE_RULES = [
    {re:/\b(?:that(?:'s| is)?|this(?: is)?|it(?:'s| is)?)\b[^.!?]{0,28}\bsick\b/, block:/\bsick of\b|\bfeel(?:ing)? sick\b|\bi(?:'m| am) sick\b/, jp:'やばい！', kana:'やばい！', romaji:'yabai!', literal:'やばい originally means dangerous/bad, but in casual speech it can also mean amazing, intense, or unbelievable.', usage:'Very casual native slang. Natural with friends and peers; avoid it in formal or high-stakes situations.', alt:'えぐい！ / 最高！'},
    {re:/\b(?:that(?:'s| is)?|this(?: is)?|it(?:'s| is)?)\b[^.!?]{0,28}\b(?:fire|lit)\b/, jp:'やばい！', kana:'やばい！', romaji:'yabai!', literal:'Casual やばい can react to something strikingly good or intense.', usage:'Native casual reaction used in speech and messages.', alt:'最高！ / えぐい！'},
    {re:/\b(?:that's|that is|this is|it's|it is)\b[^.!?]{0,30}\b(?:insane|crazy|wild)\b/, jp:'やばい！', kana:'やばい！', romaji:'yabai!', literal:'Context changes やばい from “bad/dangerous” to “wild/amazing/intense.”', usage:'Very casual emphatic reaction.', alt:'えぐい！ / すごい！'},
    {re:/^(?:seriously|really|for real|no way)[?!。.]*$/, jp:'まじ？', kana:'まじ？', romaji:'maji?', literal:'まじ means seriously / for real in casual speech.', usage:'Very common casual reaction. まじで？ adds a little more emphasis.', alt:'まじで？'},
    {re:/^(?:exactly|so true|that's so true|that is so true|same)[.!。.]*$/, jp:'それな。', kana:'それな。', romaji:'sore na.', literal:'A casual agreement roughly meaning “that, exactly.”', usage:'Natural casual agreement in conversation and messages.', alt:'ほんとそれ。 / わかる。'},
    {re:/\b(?:lol|lmao|that's hilarious|that is hilarious|so funny|i'm dead|im dead)\b/, jp:'草。', kana:'くさ。', romaji:'kusa.', literal:'Literally grass; internet slang that developed from rows of w looking like grass.', usage:'Best online or in casual messages; it can sound dry or teasing.', alt:'笑 / おもしろすぎる。'},
    {re:/\b(?:i'm obsessed|im obsessed|so obsessed|i'm hooked|im hooked)\b/, jp:'沼ってる。', kana:'ぬまってる。', romaji:'numatteru.', literal:'沼 is a swamp; 沼る means falling deeply into a hobby, fandom, or interest.', usage:'Casual fandom/interest language: “I’m deep in it / obsessed.”', alt:'ハマってる。 / やばい。'},
    {re:/^(?:so annoying|that's annoying|that is annoying|annoying)[.!。.]*$/, jp:'うざい。', kana:'うざい。', romaji:'uzai.', literal:'Very casual “annoying / irritating.”', usage:'Blunt and potentially rude. Use only where that directness fits.', alt:'めんどくさい。'},
    {re:/\b(?:so chill|really chill|chill vibe|this place is chill)\b/, jp:'チルい。', kana:'ちるい。', romaji:'chirui.', literal:'English “chill” adapted as a Japanese い-adjective.', usage:'Casual younger-speaker usage for relaxed music, places, or moods.', alt:'落ち着く。 / まったりしてる。'}
  ];

  function nativeMatch(text){
    const value = norm(text);
    if (!value) return null;
    return NATIVE_RULES.find(rule => rule.re.test(value) && !(rule.block && rule.block.test(value))) || null;
  }

  function onlineModeActive(){
    const selected = document.querySelector('[data-translation-mode="online"][aria-selected="true"], [data-translation-mode="online"].active');
    return Boolean(selected);
  }

  function renderNativeTranslation(english, rule){
    const result = {
      id:`online-native-${Date.now().toString(36)}`,
      japanese:rule.jp,
      kana:rule.kana,
      romaji:rule.romaji,
      naturalMeaning:english,
      literalMeaning:rule.literal,
      tone:'Native Sakura suggestion · casual',
      usageNote:rule.usage,
      alternative:rule.alt,
      context:'Everyday',
      source:'online-native',
      offline:false
    };
    if (typeof window.renderTranslationResult === 'function') window.renderTranslationResult(result);
    else return false;
    const resultLabel = $('translation-result-label');
    if (resultLabel) resultLabel.textContent = 'Native Sakura · casual/slang';
    try {
      if (typeof window.addTranslationHistory === 'function') window.addTranslationHistory({english,context:'Everyday',tone:'Native casual',mode:'online'}, result);
    } catch (error) { console.warn('Sakura native translation history was not saved.', error); }
    const message = $('translation-message');
    if (message) message.textContent = 'Native Sakura suggestion — slang and conversational intent matched before machine translation.';
    if (typeof window.renderTranslationSuggestions === 'function') {
      try { window.renderTranslationSuggestions([]); } catch {}
    }
    return true;
  }

  function bindTranslation(){
    const form = $('translation-form');
    if (!form || form.dataset.sakuraNativeBound === '1') return;
    form.dataset.sakuraNativeBound = '1';
    form.addEventListener('submit', event => {
      if (!onlineModeActive()) return;
      const english = String($('translation-english')?.value || '').trim();
      const rule = nativeMatch(english);
      if (!rule) return; // existing online translator handles everything else
      event.preventDefault();
      event.stopImmediatePropagation();
      renderNativeTranslation(english, rule);
    }, true);
  }

  const TOOLKITS = {
    restaurants:{icon:'食',title:'Dining quick tools',tools:[
      ['Order','これをお願いします。','これを おねがいします。','kore o onegai shimasu.','This, please.'],
      ['Allergy','食物アレルギーがあります。','しょくもつ アレルギーが あります。','shokumotsu arerugii ga arimasu.','I have a food allergy.'],
      ['Bill & pay','お会計をお願いします。カードは使えますか？','おかいけいを おねがいします。カードは つかえますか？','okaikei o onegai shimasu. kaado wa tsukaemasu ka?','The bill, please. Can I use a card?']
    ]},
    shopping:{icon:'買',title:'Shopping quick tools',tools:[
      ['Size & fit','もう少し小さいサイズはありますか？','もう すこし ちいさい サイズは ありますか？','mou sukoshi chiisai saizu wa arimasu ka?','Do you have a slightly smaller size?'],
      ['Stock & color','ほかの色はありますか？','ほかの いろは ありますか？','hoka no iro wa arimasu ka?','Do you have another color?'],
      ['Pay & tax-free','免税できますか？','めんぜい できますか？','menzei dekimasu ka?','Can I get this tax-free?']
    ]},
    hotels:{icon:'宿',title:'Hotel quick tools',tools:[
      ['Check-in','予約しています。','よやくしています。','yoyaku shite imasu.','I have a reservation.'],
      ['Room request','タオルをもう一枚いただけますか？','タオルを もう いちまい いただけますか？','taoru o mou ichimai itadakemasu ka?','Could I have one more towel?'],
      ['Luggage','荷物を預かっていただけますか？','にもつを あずかって いただけますか？','nimotsu o azukatte itadakemasu ka?','Could you store my luggage?']
    ]},
    taxi:{icon:'車',title:'Taxi quick tools',tools:[
      ['Destination','ここまでお願いします。','ここまで おねがいします。','koko made onegai shimasu.','Please take me here.'],
      ['Directions','次の角を右にお願いします。','つぎの かどを みぎに おねがいします。','tsugi no kado o migi ni onegai shimasu.','Please turn right at the next corner.'],
      ['Receipt','領収書をお願いします。','りょうしゅうしょを おねがいします。','ryoushuusho o onegai shimasu.','A receipt, please.']
    ]},
    emergencies:{icon:'助',title:'Emergency & health quick tools',tools:[
      ['Emergency','救急車を呼んでください。','きゅうきゅうしゃを よんで ください。','kyuukyuusha o yonde kudasai.','Please call an ambulance.'],
      ['Symptoms','ここが痛いです。','ここが いたいです。','koko ga itai desu.','It hurts here.'],
      ['Pharmacy','薬局はどこですか？','やっきょくは どこですか？','yakkyoku wa doko desu ka?','Where is a pharmacy?']
    ]},
    others:{icon:'🌸',title:'Everyday travel quick tools',tools:[
      ['Convenience store','温めてください。','あたためて ください。','atatamete kudasai.','Please heat this up.'],
      ['Restroom / lost','トイレはどこですか？','トイレは どこですか？','toire wa doko desu ka?','Where is the restroom?'],
      ['Photo / Wi-Fi','写真を撮ってもらえますか？','しゃしんを とって もらえますか？','shashin o totte moraemasu ka?','Could you take a photo for me?']
    ]}
  };

  function currentTravelKey(){
    const text = String($('travel-category-heading')?.textContent || '').toLowerCase();
    if (text.includes('restaurant') || text.includes('food')) return 'restaurants';
    if (text.includes('shopping')) return 'shopping';
    if (text.includes('hotel')) return 'hotels';
    if (text.includes('taxi')) return 'taxi';
    if (text.includes('emerg') || text.includes('health')) return 'emergencies';
    if (text.includes('other')) return 'others';
    return '';
  }

  function ensureTravelDialog(){
    let dialog = $('sakura-quick-tool-dialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'sakura-quick-tool-dialog';
    dialog.className = 'sakura-quick-dialog';
    dialog.innerHTML = '<div class="sakura-quick-sheet"><header><div><small>Travel Mode</small><h2 id="sakura-quick-title">Quick phrase</h2></div><button type="button" data-sakura-quick-close aria-label="Close">×</button></header><div id="sakura-quick-body"></div></div>';
    document.body.appendChild(dialog);
    return dialog;
  }

  function openTravelTool(key,index){
    const toolkit = TOOLKITS[key];
    const phrase = toolkit?.tools?.[index];
    if (!phrase) return;
    const dialog = ensureTravelDialog();
    $('sakura-quick-title').textContent = phrase[0];
    $('sakura-quick-body').innerHTML = `<article class="sakura-phrase-display"><strong>${esc(phrase[1])}</strong><span>${esc(phrase[2])}</span><b>${esc(phrase[3])}</b><p>${esc(phrase[4])}</p></article><div class="sakura-quick-actions"><button type="button" data-sakura-quick-speak>🔊 Hear</button><button type="button" data-sakura-quick-copy>Copy</button></div>`;
    dialog.dataset.phrase = phrase[1];
    dialog.dataset.copy = [phrase[1],phrase[2],phrase[3]].join('\n');
    if (!dialog.open) dialog.showModal();
  }

  function renderTravelTools(){
    const view = $('travel-category-view');
    if (!view || view.hidden) return;
    const key = currentTravelKey();
    let host = $('sakura-travel-quick-tools');
    if (!key) { if (host) host.remove(); return; }
    const toolkit = TOOLKITS[key];
    if (!host) {
      host = document.createElement('section');
      host.id = 'sakura-travel-quick-tools';
      host.className = 'sakura-travel-quick-tools';
      const filters = $('travel-category-filters');
      if (filters?.parentNode) filters.parentNode.insertBefore(host, filters);
      else view.appendChild(host);
    }
    if (host.dataset.key === key) return;
    host.dataset.key = key;
    host.innerHTML = `<div class="sakura-toolkit-heading"><span>${esc(toolkit.icon)}</span><div><strong>${esc(toolkit.title)}</strong><small>Tap for a ready-to-show phrase.</small></div></div><div class="sakura-tool-grid">${toolkit.tools.map((tool,index)=>`<button type="button" data-sakura-tool-key="${esc(key)}" data-sakura-tool-index="${index}"><span>${index===0?'✦':index===1?'♡':'→'}</span><strong>${esc(tool[0])}</strong></button>`).join('')}</div>`;
  }

  function speak(text){
    if (!text) return;
    if (window.SakuraStudySuite?.speak) { window.SakuraStudySuite.speak(text).catch?.(()=>{}); return; }
    try { window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='ja-JP'; u.rate=.9; window.speechSynthesis.speak(u); } catch {}
  }

  function bindClicks(){
    document.addEventListener('click', async event => {
      const tool = event.target.closest('[data-sakura-tool-key]');
      if (tool) { openTravelTool(tool.dataset.sakuraToolKey, Number(tool.dataset.sakuraToolIndex)); return; }
      if (event.target.closest('[data-sakura-quick-close]')) { $('sakura-quick-tool-dialog')?.close(); return; }
      if (event.target.closest('[data-sakura-quick-speak]')) { speak($('sakura-quick-tool-dialog')?.dataset.phrase); return; }
      const copyButton = event.target.closest('[data-sakura-quick-copy]');
      if (copyButton) {
        const value = $('sakura-quick-tool-dialog')?.dataset.copy || '';
        let copied = false;
        try { await navigator.clipboard.writeText(value); copied = true; } catch {}
        if (copied) {
          const original = copyButton.textContent;
          copyButton.textContent = 'Copied ✓';
          copyButton.disabled = true;
          window.setTimeout(() => { copyButton.textContent = original || 'Copy'; copyButton.disabled = false; }, 900);
        }
        return;
      }
      if (event.target.closest('[data-route^="travel-"]')) requestAnimationFrame(renderTravelTools);
    });
  }

  function injectStyles(){
    if ($('sakura-experience-styles')) return;
    const style = document.createElement('style');
    style.id='sakura-experience-styles';
    style.textContent=`
      #practice-view.sakura-practice-compact .page-heading{margin-bottom:10px}
      #practice-view.sakura-practice-compact .page-heading h1{margin:.18rem 0;font-size:2rem}
      #practice-view.sakura-practice-compact .page-heading p{margin:.2rem 0 .5rem}
      #practice-view.sakura-practice-compact .practice-coming-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}
      #practice-view.sakura-practice-compact .practice-coming-card{touch-action:manipulation;min-height:78px!important;padding:10px!important;gap:8px!important;border-radius:18px!important;grid-template-columns:36px minmax(0,1fr) 18px!important}
      #practice-view.sakura-practice-compact .practice-coming-card>span:first-child{width:36px!important;height:36px!important;min-width:36px!important;font-size:20px!important;border-radius:12px!important}
      #practice-view.sakura-practice-compact .practice-coming-card h2{margin:0!important;font-size:12.5px!important;line-height:1.16!important}
      #practice-view.sakura-practice-compact .practice-coming-card p{display:none!important}
      #practice-view.sakura-practice-compact .practice-coming-card b{font-size:18px!important}
      .sakura-travel-quick-tools{margin:8px 0 12px;padding:11px;border:1px solid var(--color-border);border-radius:18px;background:color-mix(in srgb,var(--color-primary-soft) 52%,var(--color-surface))}
      .sakura-toolkit-heading{display:flex;align-items:center;gap:9px;margin-bottom:8px}.sakura-toolkit-heading>span{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;background:var(--color-surface);color:var(--color-primary-dark);font-weight:900}.sakura-toolkit-heading div{min-width:0}.sakura-toolkit-heading strong,.sakura-toolkit-heading small{display:block}.sakura-toolkit-heading strong{font-size:12px}.sakura-toolkit-heading small{margin-top:2px;color:var(--color-text-muted);font-size:8px}
      .sakura-tool-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.sakura-tool-grid button{touch-action:manipulation;min-width:0;min-height:58px;padding:7px 5px;border:1px solid var(--color-border);border-radius:13px;background:var(--color-surface);color:var(--color-text);font:inherit}.sakura-tool-grid button span,.sakura-tool-grid button strong{display:block}.sakura-tool-grid button span{color:var(--color-primary);font-size:15px}.sakura-tool-grid button strong{margin-top:3px;font-size:9px;line-height:1.15}
      .sakura-quick-dialog{width:min(520px,calc(100% - 18px));max-width:none;margin:auto auto 0;padding:0;border:0;border-radius:24px 24px 0 0;background:var(--color-background);color:var(--color-text);box-shadow:0 -18px 50px rgba(35,28,33,.2)}.sakura-quick-dialog::backdrop{background:rgba(35,28,33,.32);backdrop-filter:blur(2px)}.sakura-quick-sheet{padding:16px 16px calc(18px + env(safe-area-inset-bottom))}.sakura-quick-sheet header{display:flex;align-items:center;justify-content:space-between;gap:12px}.sakura-quick-sheet header small{display:block;color:var(--color-primary-dark);font-size:8px;font-weight:900;text-transform:uppercase}.sakura-quick-sheet h2{margin:3px 0 0;font-size:19px}.sakura-quick-sheet header button{width:36px;height:36px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text);font-size:22px}.sakura-phrase-display{margin-top:14px;padding:16px;border:1px solid var(--color-border);border-radius:18px;background:var(--color-surface)}.sakura-phrase-display>*{display:block}.sakura-phrase-display strong{font-size:24px;line-height:1.4}.sakura-phrase-display span{margin-top:7px;color:var(--color-primary-dark);font-size:14px}.sakura-phrase-display b{margin-top:5px;font-size:12px}.sakura-phrase-display p{margin:9px 0 0;color:var(--color-text-muted);font-size:11px}.sakura-quick-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.sakura-quick-actions button{touch-action:manipulation;min-height:44px;border:1px solid var(--color-border);border-radius:14px;background:var(--color-surface);color:var(--color-text);font-weight:800}
      @media(max-width:380px){#practice-view.sakura-practice-compact .practice-coming-card{min-height:72px!important;padding:8px!important}#practice-view.sakura-practice-compact .practice-coming-card h2{font-size:11.5px!important}.sakura-tool-grid button strong{font-size:8px}}
    `;
    document.head.appendChild(style);
  }

  function compactPractice(){ $('practice-view')?.classList.add('sakura-practice-compact'); }

  function observeTravel(){
    const heading=$('travel-category-heading'), view=$('travel-category-view');
    if (!heading || !view) return;
    const observer=new MutationObserver(()=>requestAnimationFrame(renderTravelTools));
    observer.observe(heading,{subtree:true,childList:true,characterData:true});
    observer.observe(view,{attributes:true,attributeFilter:['hidden']});
  }

  function init(){
    injectStyles();
    compactPractice();
    bindTranslation();
    bindClicks();
    observeTravel();
    renderTravelTools();
  }

  window.SakuraExperience=Object.freeze({version:'1.2.0',nativeMatch,renderTravelTools,init});
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
}());
