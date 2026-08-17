/* Sakura Fresh Random Starts v1
   Refreshes randomizable learning content when users reopen a section.
   Keeps intentional sequences (for example Conversation Lab dialogue turns) intact. */
(function initializeSakuraFreshRandom() {
  'use strict';
  if (window.SakuraFreshRandom) return;

  const STORE_KEY = 'sakuraFreshRandomStartsV1';
  const BUILTIN_QUIZ_NEXT = Object.freeze({
    kana: '#next-kana',
    kanji: '#next-kanji-quiz',
    vocabulary: '#next-vocabulary-quiz'
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

  function click(selector) {
    const button = document.querySelector(selector);
    if (!(button instanceof HTMLElement) || button.hidden || button.disabled) return false;
    button.click();
    return true;
  }

  function freshLearn(route, previousRoute) {
    if (route === 'learn') {
      // Returning from a detail screen should preserve the item the learner opened.
      if (previousRoute === 'kanji-detail' || previousRoute === 'word-detail') return;
      requestAnimationFrame(() => {
        click('#random-kanji');
        click('#random-word');
      });
      return;
    }
    if (route === 'learn-native' || route === 'learn-slang') {
      requestAnimationFrame(() => click('#random-native'));
    }
  }

  function activeBuiltInQuizType() {
    const panel = [...document.querySelectorAll('#quiz-view [data-quiz-panel]')]
      .find(node => !node.hidden);
    const type = panel?.dataset?.quizPanel || '';
    return Object.hasOwn(BUILTIN_QUIZ_NEXT, type) ? type : '';
  }

  function freshActiveQuiz() {
    const type = activeBuiltInQuizType();
    if (!type) return;
    click(BUILTIN_QUIZ_NEXT[type]);
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

      // Re-roll a few times only when the freshly shuffled session happens to
      // begin on the exact same prompt as the learner saw last time.
      for (let attempt = 0; attempt < 5; attempt += 1) {
        start(bank);
        currentFirst = String(document.querySelector(config.promptSelector)?.textContent || '').trim();
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
    if (Object.hasOwn(PRACTICE_ROUTES, route)) freshPractice(route, revision);
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
      // Let Sakura switch the panel first, then refresh the newly opened built-in quiz.
      setTimeout(freshActiveQuiz, 0);
    });
  }

  function init() {
    if (!wrapRouteNavigation()) {
      setTimeout(init, 120);
      return;
    }
    bindQuizTabRefresh();
  }

  window.SakuraFreshRandom = Object.freeze({
    version: 1,
    init,
    refreshQuiz: freshActiveQuiz
  });

  init();
}());
