/* Sakura Fresh Random Starts v1.2
   Refreshes randomizable learning content when users reopen a section.
   Avoids immediate repeated starters across PWA sessions while keeping
   intentional sequences (for example Conversation Lab dialogue turns) intact.
   Also adds a fail-safe top-of-menu Practice/Travel quick switch. */
(function initializeSakuraFreshRandom() {
  'use strict';
  if (window.SakuraFreshRandom) return;

  const STORE_KEY = 'sakuraFreshRandomStartsV1';
  const BUILTIN_QUIZZES = Object.freeze({
    kana: { next:'#next-kana', prompt:'#kana-character', stateKey:'quizKana' },
    kanji: { next:'#next-kanji-quiz', prompt:'#kanji-quiz-character', stateKey:'quizKanji' },
    vocabulary: { next:'#next-vocabulary-quiz', prompt:'#vocabulary-quiz-word', stateKey:'quizVocabulary' }
  });
  const PRACTICE_ROUTES = Object.freeze({
    'practice-what-would-you-say': {
      viewId: 'practice-what-would-you-say-view',
      promptSelector: '#wwys-prompt',
      stateKey: 'wwys',
      load: 'loadWhatWouldYouSayBank',
      validate: 'validateWhatWouldYouSayBank',
      start: 'startWhatWouldYouSaySession'
    },
    'practice-sentence-builder': {
      viewId: 'practice-sentence-builder-view',
      promptSelector: '#sentence-builder-english',
      stateKey: 'sentenceBuilder',
      load: 'loadSentenceBuilderBank',
      validate: 'validateSentenceBuilderBank',
      start: 'startSentenceBuilderSession'
    },
    'practice-one-line-many-personalities': {
      viewId: 'practice-one-line-many-personalities-view',
      promptSelector: '#personalities-core-meaning',
      stateKey: 'personalities',
      load: 'loadPersonalitiesBank',
      validate: 'validatePersonalitiesBank',
      start: 'startPersonalitiesSession'
    }
  });

  let routeRevision = 0;
  let lastRoute = normalizeRoute(location.hash.replace('#', '') || 'home');
  let modeObserver = null;

  function normalizeRoute(route) {
    return route === 'native' ? 'learn-native' : String(route || 'home');
  }

  function readState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeState(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch { /* Randomization must never block Sakura if storage is unavailable. */ }
  }

  function text(selector) {
    return String(document.querySelector(selector)?.textContent || '').trim();
  }

  function click(selector) {
    const button = document.querySelector(selector);
    if (!(button instanceof HTMLElement) || button.hidden || button.disabled) return false;
    button.click();
    return true;
  }

  function rerollButtonUntilFresh({ buttonSelector, promptSelector, stateKey, attempts = 5 }) {
    const state = readState();
    const previous = String(state[stateKey] || '');
    let current = '';

    for (let attempt = 0; attempt < attempts; attempt += 1) {
      if (!click(buttonSelector)) break;
      current = text(promptSelector);
      if (!previous || !current || current !== previous) break;
    }

    if (current) {
      state[stateKey] = current;
      writeState(state);
    }
  }

  function freshLearn(route, previousRoute) {
    if (route === 'learn') {
      if (previousRoute === 'kanji-detail' || previousRoute === 'word-detail') return;
      requestAnimationFrame(() => {
        rerollButtonUntilFresh({ buttonSelector:'#random-kanji', promptSelector:'#browse-kanji-character', stateKey:'learnKanji' });
        rerollButtonUntilFresh({ buttonSelector:'#random-word', promptSelector:'#browse-word-text', stateKey:'learnWord' });
      });
      return;
    }
    if (route === 'learn-native' || route === 'learn-slang') {
      requestAnimationFrame(() => {
        rerollButtonUntilFresh({
          buttonSelector:'#random-native',
          promptSelector:'#native-expression',
          stateKey:route === 'learn-slang' ? 'learnSlang' : 'learnNative'
        });
      });
    }
  }

  function activeBuiltInQuizType() {
    const panel = [...document.querySelectorAll('#quiz-view [data-quiz-panel]')]
      .find(node => !node.hidden);
    const type = panel?.dataset?.quizPanel || '';
    return Object.prototype.hasOwnProperty.call(BUILTIN_QUIZZES, type) ? type : '';
  }

  function freshActiveQuiz() {
    const type = activeBuiltInQuizType();
    if (!type) return;
    const config = BUILTIN_QUIZZES[type];
    rerollButtonUntilFresh({
      buttonSelector:config.next,
      promptSelector:config.prompt,
      stateKey:config.stateKey
    });
  }

  async function freshPractice(route, revision) {
    const config = PRACTICE_ROUTES[route];
    if (!config) return;
    const view = document.getElementById(config.viewId);
    if (!view || view.hidden) return;

    const load = window[config.load];
    const validate = window[config.validate];
    const start = window[config.start];
    if (typeof load !== 'function' || typeof validate !== 'function' || typeof start !== 'function') return;

    try {
      const bank = await load();
      if (revision !== routeRevision || view.hidden || !validate(bank)) return;

      const state = readState();
      const previousFirst = String(state[config.stateKey] || '');
      let currentFirst = '';

      for (let attempt = 0; attempt < 5; attempt += 1) {
        start(bank);
        currentFirst = text(config.promptSelector);
        if (!previousFirst || !currentFirst || currentFirst !== previousFirst) break;
      }

      if (currentFirst) {
        state[config.stateKey] = currentFirst;
        writeState(state);
      }
    } catch (error) {
      console.warn('Sakura Fresh Random could not refresh this Practice session; the existing session remains available.', error);
    }
  }

  function handleRouteOpen(route, previousRoute) {
    const revision = ++routeRevision;
    freshLearn(route, previousRoute);
    if (route === 'quiz') requestAnimationFrame(freshActiveQuiz);
    if (Object.prototype.hasOwnProperty.call(PRACTICE_ROUTES, route)) freshPractice(route, revision);
  }

  function wrapRouteNavigation() {
    const originalShowRoute = window.showRoute;
    if (typeof originalShowRoute !== 'function' || originalShowRoute.__sakuraFreshRandomWrapped) return false;

    function wrappedShowRoute(route, ...rest) {
      const normalized = normalizeRoute(route);
      const previous = lastRoute;
      const result = originalShowRoute.call(this, route, ...rest);
      lastRoute = normalized;
      setTimeout(() => handleRouteOpen(normalized, previous), 0);
      return result;
    }
    wrappedShowRoute.__sakuraFreshRandomWrapped = true;
    wrappedShowRoute.__sakuraOriginal = originalShowRoute;
    window.showRoute = wrappedShowRoute;
    return true;
  }

  function bindQuizTabRefresh() {
    document.addEventListener('click', event => {
      const tab = event.target?.closest?.('#quiz-view [data-quiz-tab]');
      if (!tab) return;
      setTimeout(freshActiveQuiz, 0);
    });
  }

  function injectModeSwitchStyle() {
    if (document.getElementById('sakura-mode-switch-style')) return;
    const style = document.createElement('style');
    style.id = 'sakura-mode-switch-style';
    style.textContent = `
      .sakura-hub-mode-switch{display:grid;gap:7px;margin:0 0 12px;padding:10px;border:1px solid color-mix(in srgb,var(--color-primary) 20%,var(--color-border));border-radius:15px;background:color-mix(in srgb,var(--color-primary-soft) 56%,var(--color-surface))}
      .sakura-hub-mode-switch-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.sakura-hub-mode-switch-head strong{font-size:9px;color:var(--color-primary-dark)}.sakura-hub-mode-switch-head small{font-size:7px;color:var(--color-text-muted)}
      .sakura-hub-mode-switch-buttons{display:grid;grid-template-columns:1fr 1fr;gap:7px}.sakura-hub-mode-button{min-width:0;min-height:42px;padding:8px 10px;border:1px solid var(--color-border);border-radius:12px;background:var(--color-surface);color:var(--color-text);font:inherit;font-size:9px;font-weight:850}.sakura-hub-mode-button.active{border-color:var(--color-primary);background:var(--color-primary-soft);color:var(--color-primary-dark);box-shadow:0 0 0 1px color-mix(in srgb,var(--color-primary) 16%,transparent)}
    `;
    document.head.appendChild(style);
  }

  function currentTravelMode() {
    return document.getElementById('dynamic-fourth-nav')?.dataset?.route === 'travel';
  }

  function syncModeSwitch() {
    const travel = currentTravelMode();
    document.querySelectorAll('[data-sakura-nav-mode]').forEach(button => {
      const active = button.dataset.sakuraNavMode === (travel ? 'travel' : 'practice');
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function chooseNavigationMode(mode) {
    const travel = mode === 'travel';
    const targetRoute = travel ? 'travel' : 'practice';
    const toggle = document.getElementById('travel-mode-toggle');
    if (typeof window.setTravelModeEnabled === 'function') {
      window.setTravelModeEnabled(travel);
    } else if (toggle) {
      toggle.checked = travel;
      toggle.dispatchEvent(new Event('change', { bubbles:true }));
    }
    syncModeSwitch();
    document.getElementById('close-hub')?.click();
    setTimeout(() => {
      const targetView = document.querySelector(`[data-view="${targetRoute}"]`);
      if (!targetView || targetView.hidden) window.showRoute?.(targetRoute);
    }, 0);
  }

  function ensureModeSwitch() {
    const heading = document.querySelector('#hub-view .hub-heading');
    if (!heading) return false;
    if (!document.getElementById('sakura-hub-mode-switch')) {
      injectModeSwitchStyle();
      const section = document.createElement('section');
      section.id = 'sakura-hub-mode-switch';
      section.className = 'sakura-hub-mode-switch';
      section.setAttribute('aria-label', 'Quick switch between Practice and Travel');
      section.innerHTML = `
        <div class="sakura-hub-mode-switch-head"><strong>Quick switch</strong><small>Practice ↔ Travel</small></div>
        <div class="sakura-hub-mode-switch-buttons" role="group" aria-label="Navigation mode">
          <button class="sakura-hub-mode-button" type="button" data-sakura-nav-mode="practice" aria-pressed="false">✿ Practice</button>
          <button class="sakura-hub-mode-button" type="button" data-sakura-nav-mode="travel" aria-pressed="false">✈ Travel</button>
        </div>`;
      heading.insertAdjacentElement('afterend', section);
      section.addEventListener('click', event => {
        const button = event.target.closest('[data-sakura-nav-mode]');
        if (!button) return;
        chooseNavigationMode(button.dataset.sakuraNavMode);
      });
    }
    syncModeSwitch();
    const nav = document.getElementById('dynamic-fourth-nav');
    if (nav && !modeObserver) {
      modeObserver = new MutationObserver(syncModeSwitch);
      modeObserver.observe(nav, { attributes:true, attributeFilter:['data-route'] });
    }
    const existingToggle = document.getElementById('travel-mode-toggle');
    if (existingToggle && !existingToggle.dataset.sakuraQuickSwitchSync) {
      existingToggle.dataset.sakuraQuickSwitchSync = 'true';
      existingToggle.addEventListener('change', () => setTimeout(syncModeSwitch, 0));
    }
    return true;
  }

  function init() {
    if (!wrapRouteNavigation()) {
      setTimeout(init, 120);
      return;
    }
    bindQuizTabRefresh();
    if (!ensureModeSwitch()) setTimeout(ensureModeSwitch, 120);
  }

  window.SakuraFreshRandom = Object.freeze({
    version: 1.2,
    init,
    refreshQuiz: freshActiveQuiz,
    refreshModeSwitch: syncModeSwitch
  });

  init();
}());
