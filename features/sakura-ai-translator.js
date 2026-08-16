/* Sakura AI Translator — native-first Japanese tutor layer v1.0.2
   Provider-neutral client. Gemini/OpenAI secrets never live in this file.
   If AI is unavailable, Sakura's existing translator remains usable. */
(function initSakuraAiTranslator(){
  'use strict';
  if (window.SakuraAITranslator) return;

  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const MAX_INPUT = 500;
  const TIMEOUT_MS = 45000;
  let bypassOnce = false;
  let currentResult = null;

  const config = Object.freeze({
    enabled: Boolean(window.SAKURA_AI_CONFIG?.enabled && window.SAKURA_AI_CONFIG?.endpoint),
    endpoint: String(window.SAKURA_AI_CONFIG?.endpoint || ''),
    gatewayKey: String(window.SAKURA_AI_CONFIG?.gatewayKey || ''),
    provider: String(window.SAKURA_AI_CONFIG?.provider || 'gemini'),
    model: String(window.SAKURA_AI_CONFIG?.model || 'gemini-3.6-flash'),
    privacyNote: String(window.SAKURA_AI_CONFIG?.privacyNote || '')
  });

  function onlineModeActive(){
    return Boolean(document.querySelector('[data-translation-mode="online"][aria-selected="true"], [data-translation-mode="online"].active'));
  }

  function selectedChip(containerId){
    const container = $(containerId);
    if (!container) return '';
    const selected = container.querySelector('[aria-pressed="true"], .active, .selected');
    return String(selected?.dataset?.value || selected?.textContent || '').trim();
  }

  function currentJlpt(){
    try {
      const values = JSON.parse(localStorage.getItem('chaGlobalJlptLevels') || '["N5"]');
      return Array.isArray(values) && values.length
        ? values.filter(value => /^N[1-5]$/.test(value)).join(', ')
        : 'N5';
    } catch { return 'N5'; }
  }

  function setMessage(text, state=''){
    const message = $('translation-message');
    if (!message) return;
    message.textContent = text;
    if (state) message.dataset.aiState = state;
    else delete message.dataset.aiState;
  }

  function injectStyles(){
    if ($('sakura-ai-translator-style')) return;
    const style = document.createElement('style');
    style.id = 'sakura-ai-translator-style';
    style.textContent = `
      .sakura-ai-badge{display:inline-flex;align-items:center;gap:5px;width:max-content;max-width:100%;padding:4px 8px;border-radius:999px;background:var(--color-primary-soft);color:var(--color-primary-dark);font-size:8px;font-weight:900}.sakura-ai-badge::before{content:"✦"}
      .sakura-ai-result{display:grid;gap:12px;margin-top:12px;padding-bottom:20px}.sakura-ai-card{display:grid;gap:8px;padding:13px;border:1px solid color-mix(in srgb,var(--color-primary) 17%,var(--color-border));border-radius:16px;background:color-mix(in srgb,var(--color-surface) 96%,var(--color-primary-soft));box-shadow:0 8px 24px color-mix(in srgb,var(--color-text) 5%,transparent)}
      .sakura-ai-card h3{margin:0;color:var(--color-text);font-size:13px}.sakura-ai-card p{margin:0;color:var(--color-text-muted);font-size:9px;line-height:1.6}.sakura-ai-native{font-size:20px!important;font-weight:900!important;line-height:1.45!important;color:var(--color-text)!important}
      .sakura-ai-reading{display:grid;gap:2px}.sakura-ai-reading strong{font-size:12px}.sakura-ai-reading em{font-size:10px;color:var(--color-text-muted)}.sakura-ai-actions{display:flex;gap:7px;flex-wrap:wrap}.sakura-ai-actions button{min-height:38px;padding:8px 11px;border:1px solid var(--color-border);border-radius:11px;background:var(--color-surface);color:var(--color-text);font-size:9px;font-weight:850;touch-action:manipulation}
      .sakura-ai-grid{display:grid;gap:7px}.sakura-ai-variant{display:grid;gap:3px;padding:10px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-background)}.sakura-ai-variant strong{font-size:12px}.sakura-ai-variant small{color:var(--color-text-muted);font-size:8px;line-height:1.45}
      .sakura-ai-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}.sakura-ai-table{width:100%;border-collapse:collapse;min-width:520px;font-size:8px}.sakura-ai-table th,.sakura-ai-table td{padding:8px 7px;border-bottom:1px solid var(--color-border);text-align:left;vertical-align:top}.sakura-ai-table th{color:var(--color-text)}.sakura-ai-table td{color:var(--color-text-muted);line-height:1.45}.sakura-ai-table td:first-child{color:var(--color-text);font-weight:800}
      .sakura-ai-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}.sakura-ai-list li{padding:9px 10px;border-radius:11px;background:var(--color-background);font-size:9px;line-height:1.55;color:var(--color-text-muted)}.sakura-ai-list li strong{color:var(--color-text)}
      .sakura-ai-quiz{display:grid;gap:7px}.sakura-ai-quiz details{padding:9px 10px;border:1px solid var(--color-border);border-radius:11px;background:var(--color-background)}.sakura-ai-quiz summary{cursor:pointer;font-size:9px;font-weight:850;color:var(--color-primary-dark)}.sakura-ai-quiz details p{margin-top:6px}.sakura-ai-error{border-color:color-mix(in srgb,#c95d5d 28%,var(--color-border))}.sakura-ai-setup-note{display:grid;gap:4px;margin-top:8px;padding:9px 10px;border:1px dashed var(--color-border);border-radius:12px;color:var(--color-text-muted);font-size:8px;line-height:1.5}
      .sakura-ai-loading{display:grid;gap:7px;align-items:center;justify-items:start}.sakura-ai-loading span:last-child{display:inline-flex;gap:4px}.sakura-ai-loading i{width:6px;height:6px;border-radius:50%;background:var(--color-primary);animation:sakura-ai-dot 1s infinite ease-in-out}.sakura-ai-loading i:nth-child(2){animation-delay:.15s}.sakura-ai-loading i:nth-child(3){animation-delay:.3s}@keyframes sakura-ai-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}
      @media(prefers-reduced-motion:reduce){.sakura-ai-loading i{animation:none}}@media(max-width:420px){.sakura-ai-actions button{flex:1 1 calc(50% - 7px)}}
    `;
    document.head.appendChild(style);
  }

  function ensureHost(){
    let host = $('sakura-ai-result');
    if (host) return host;
    host = document.createElement('section');
    host.id = 'sakura-ai-result';
    host.className = 'sakura-ai-result';
    host.hidden = true;
    host.setAttribute('aria-live','polite');
    const result = $('translation-result');
    if (result?.parentNode) result.parentNode.insertBefore(host, result.nextSibling);
    else $('translation-form')?.insertAdjacentElement('afterend', host);
    return host;
  }

  function decorateMode(){
    const online = document.querySelector('[data-translation-mode="online"]');
    if (!online) return;
    online.dataset.aiEnabled = String(config.enabled);
    if (!config.enabled) return;
    const title = online.querySelector('strong');
    const note = online.querySelector('small');
    if (title) title.textContent = 'AI Native Translator';
    if (note) note.textContent = 'Native-first · detailed tutor response';
  }

  function renderLoading(){
    const host = ensureHost();
    $('translation-result')?.setAttribute('hidden','');
    host.hidden = false;
    host.innerHTML = '<article class="sakura-ai-card sakura-ai-loading"><span class="sakura-ai-badge">Sakura AI</span><h3>Finding the most natural Japanese…</h3><p>Checking situation, register, wording, grammar, and spoken usage. Free AI may take a few seconds.</p><span aria-hidden="true"><i></i><i></i><i></i></span></article>';
  }

  function table(headers, rows){
    if (!rows?.length) return '';
    return `<div class="sakura-ai-table-wrap"><table class="sakura-ai-table"><thead><tr>${headers.map(header=>`<th>${esc(header)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderResult(data){
    currentResult = data;
    const host = ensureHost();
    $('translation-result')?.setAttribute('hidden','');
    host.hidden = false;

    const recommended = data.recommended || {};
    const variants = Array.isArray(data.variants) ? data.variants : [];
    const words = Array.isArray(data.words) ? data.words : [];
    const kanji = Array.isArray(data.kanji) ? data.kanji : [];
    const grammar = Array.isArray(data.grammar) ? data.grammar : [];
    const nativeNotes = Array.isArray(data.native_notes) ? data.native_notes : [];
    const similar = Array.isArray(data.similar_expressions) ? data.similar_expressions : [];
    const chunks = Array.isArray(data.spoken?.chunks) ? data.spoken.chunks : [];
    const quiz = data.quiz || {};

    host.innerHTML = `
      <article class="sakura-ai-card"><span class="sakura-ai-badge">${esc(data.provider_label || 'Sakura AI · Native-first')}</span><h3>Situation</h3><p>${esc(data.situation || '')}</p></article>
      <article class="sakura-ai-card">
        <h3>⭐ Recommended Native Version</h3><p class="sakura-ai-native" lang="ja">${esc(recommended.japanese || '')}</p>
        <div class="sakura-ai-reading"><strong lang="ja">${esc(recommended.kana || '')}</strong><em>${esc(recommended.romaji || '')}</em></div>
        <p>${esc(recommended.english || '')}</p>${recommended.register ? `<span class="sakura-ai-badge">${esc(recommended.register)}</span>` : ''}<p>${esc(data.why_natural || '')}</p>
        <div class="sakura-ai-actions"><button type="button" data-sakura-ai-speak>🔊 Hear</button><button type="button" data-sakura-ai-copy>Copy</button></div>
      </article>
      ${variants.length ? `<article class="sakura-ai-card"><h3>Context Variants</h3><div class="sakura-ai-grid">${variants.map(item=>`<div class="sakura-ai-variant"><small>${esc(item.when || '')}</small><strong lang="ja">${esc(item.japanese || '')}</strong><span>${esc(item.kana || '')}</span><small><em>${esc(item.romaji || '')}</em></small><small>${esc(item.english || '')}</small></div>`).join('')}</div></article>` : ''}
      ${words.length ? `<article class="sakura-ai-card"><h3>Word Breakdown</h3>${table(['Japanese','Kana','Romaji','Meaning','Notes'], words.map(item=>[item.japanese||'',item.kana||'',item.romaji||'',item.meaning||'',item.notes||'']))}</article>` : ''}
      ${kanji.length ? `<article class="sakura-ai-card"><h3>Kanji Breakdown</h3>${table(['Kanji','Reading Here','Romaji','Meaning','Word','Notes'], kanji.map(item=>[item.kanji||'',item.reading_here||'',item.romaji||'',item.meaning||'',item.word||'',item.notes||'']))}</article>` : ''}
      ${grammar.length ? `<article class="sakura-ai-card"><h3>Grammar</h3><ul class="sakura-ai-list">${grammar.map(item=>`<li><strong>${esc(item.pattern || '')}</strong><br>${esc(item.explanation || '')}${item.example ? `<br><span lang="ja">${esc(item.example)}</span>` : ''}</li>`).join('')}</ul></article>` : ''}
      ${nativeNotes.length ? `<article class="sakura-ai-card"><h3>Native Notes</h3><ul class="sakura-ai-list">${nativeNotes.map(note=>`<li>${esc(note)}</li>`).join('')}</ul></article>` : ''}
      ${(chunks.length || data.spoken?.tip) ? `<article class="sakura-ai-card"><h3>Spoken Japanese</h3>${chunks.length ? `<p class="sakura-ai-native" lang="ja">${chunks.map(esc).join(' ｜ ')}</p>` : ''}${data.spoken?.romaji_chunks?.length ? `<p><em>${data.spoken.romaji_chunks.map(esc).join(' / ')}</em></p>` : ''}${data.spoken?.tip ? `<p>${esc(data.spoken.tip)}</p>` : ''}</article>` : ''}
      ${similar.length ? `<article class="sakura-ai-card"><h3>Similar Expressions</h3><div class="sakura-ai-grid">${similar.map(item=>`<div class="sakura-ai-variant"><strong lang="ja">${esc(item.japanese || '')}</strong><span>${esc(item.kana || '')}</span><small><em>${esc(item.romaji || '')}</em></small><small>${esc(item.english || '')}</small><small>${esc(item.when || '')}</small></div>`).join('')}</div></article>` : ''}
      ${quiz.question ? `<article class="sakura-ai-card sakura-ai-quiz"><h3>Mini Quiz</h3><p>${esc(quiz.question)}</p>${quiz.hint ? `<p>Hint: ${esc(quiz.hint)}</p>` : ''}<details><summary>Show answer</summary><p lang="ja">${esc(quiz.answer || '')}</p></details></article>` : ''}
      ${config.privacyNote ? `<div class="sakura-ai-setup-note">${esc(config.privacyNote)}</div>` : ''}
    `;

    try {
      if (typeof window.addTranslationHistory === 'function' && recommended.japanese) {
        window.addTranslationHistory(
          {english:String($('translation-english')?.value || '').trim(), context:selectedChip('translation-contexts') || 'Auto', tone:selectedChip('translation-tones') || 'Natural', mode:'ai'},
          {id:`ai-${Date.now().toString(36)}`, japanese:recommended.japanese, kana:recommended.kana||'', romaji:recommended.romaji||'', naturalMeaning:recommended.english||'', literalMeaning:data.why_natural||'', tone:recommended.register||'Native', usageNote:nativeNotes[0]||'', alternative:similar[0]?.japanese||'', context:selectedChip('translation-contexts')||'Auto', source:'online-ai', offline:false}
        );
      }
    } catch (error) { console.warn('Sakura AI translation history could not be saved.', error); }

    setMessage(`Sakura AI · ${data.model || config.model} · native-first analysis`, 'ready');
  }

  function renderError(error){
    const host = ensureHost();
    host.hidden = false;
    host.innerHTML = `<article class="sakura-ai-card sakura-ai-error"><span class="sakura-ai-badge">Sakura AI</span><h3>AI translation is unavailable right now.</h3><p>${esc(error?.message || 'Please try again.')}</p><div class="sakura-ai-actions"><button type="button" data-sakura-ai-retry>Try again</button><button type="button" data-sakura-ai-basic>Use basic online translator</button></div></article>`;
    setMessage('AI request failed. Sakura itself is still working normally.', 'error');
  }

  async function requestAi(payload){
    const controller = new AbortController();
    const timeout = window.setTimeout(()=>controller.abort(), TIMEOUT_MS);
    const headers = {'Content-Type':'application/json','Accept':'application/json'};
    if (config.gatewayKey) {
      headers.apikey = config.gatewayKey;
      headers.Authorization = `Bearer ${config.gatewayKey}`;
    }
    try {
      const response = await fetch(config.endpoint, {
        method:'POST', headers, body:JSON.stringify(payload), signal:controller.signal, cache:'no-store', credentials:'omit'
      });
      const body = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(body?.error || `AI request failed (HTTP ${response.status}).`);
      if (!body?.recommended?.japanese) throw new Error('AI returned an incomplete translation.');
      return body;
    } finally { window.clearTimeout(timeout); }
  }

  function buildPayload(){
    return {
      text:String($('translation-english')?.value || '').trim().slice(0, MAX_INPUT),
      direction:'english-to-japanese',
      context:selectedChip('translation-contexts') || 'Auto',
      tone:selectedChip('translation-tones') || 'Polite and natural',
      medium:'Auto', jlpt_level:currentJlpt(), response_style:'native-tutor'
    };
  }

  async function run(){
    if (!config.enabled) return false;
    const payload = buildPayload();
    if (!payload.text) { setMessage('Enter an English sentence first.', 'error'); return true; }
    renderLoading();
    setMessage('Sakura AI is checking native wording…', 'loading');
    try { renderResult(await requestAi(payload)); }
    catch (error) {
      if (error?.name === 'AbortError') renderError(new Error('The AI request timed out. Please try again.'));
      else renderError(error);
    }
    return true;
  }

  function speak(text){
    if (!text) return;
    try {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP'; utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    } catch {}
  }

  function bind(){
    const form = $('translation-form');
    if (!form || form.dataset.sakuraAiBound === '1') return;
    form.dataset.sakuraAiBound = '1';

    form.addEventListener('submit', event => {
      if (!config.enabled || !onlineModeActive()) return;
      if (bypassOnce) { bypassOnce = false; return; }
      event.preventDefault(); event.stopImmediatePropagation(); run();
    }, true);

    document.addEventListener('click', async event => {
      if (event.target.closest('[data-sakura-ai-speak]')) { speak(currentResult?.recommended?.japanese || ''); return; }
      if (event.target.closest('[data-sakura-ai-copy]')) {
        const result = currentResult?.recommended || {};
        const text = [result.japanese,result.kana,result.romaji,result.english].filter(Boolean).join('\n');
        try { await navigator.clipboard.writeText(text); setMessage('Copied Sakura AI translation.', 'ready'); }
        catch { setMessage('Copy was blocked by the browser.', 'error'); }
        return;
      }
      if (event.target.closest('[data-sakura-ai-retry]')) { run(); return; }
      if (event.target.closest('[data-sakura-ai-basic]')) {
        bypassOnce = true; ensureHost().hidden = true; form.requestSubmit();
      }
    });

    document.querySelectorAll('[data-translation-mode]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.translationMode !== 'online') ensureHost().hidden = true;
    }));
  }

  function init(){
    injectStyles(); ensureHost(); decorateMode(); bind();
    window.SakuraAITranslator = Object.freeze({version:'1.0.2', enabled:config.enabled, config, run:config.enabled ? run : ()=>Promise.resolve(false)});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
}());