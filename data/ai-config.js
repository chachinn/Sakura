/* Public Sakura service configuration. Provider secrets never belong in this file. */
(function configureSakuraServices() {
  const publishableKey = "sb_publishable_X10kPG4ED--0Y5oyDVR1kA_H-NF_7LV";

  window.SAKURA_AI_CONFIG = Object.freeze({
    version: 3,
    enabled: true,
    endpoint: "https://hrycfsekrvflrbwahgyh.supabase.co/functions/v1/sakura-ai-translator",
    gatewayKey: publishableKey,
    provider: "gemini",
    model: "gemini-3.6-flash",
    privacyNote: "AI requests require internet. On Gemini's free API tier, submitted content may be used by Google to improve its products. Avoid sensitive personal information."
  });

  window.SAKURA_AUTH_CONFIG = Object.freeze({
    version: 3,
    enabled: true,
    projectUrl: "https://hrycfsekrvflrbwahgyh.supabase.co",
    publishableKey,
    redirectUrl: "https://chachinn.github.io/sakura/",
    paywallEnabled: false,
    trialDays: 3
  });

  function loadExternalScript(url, marker, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      let settled = false;
      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        callback(value);
      };
      const timeoutId = setTimeout(() => {
        script.remove();
        finish(reject, new Error(`Timed out loading ${url}`));
      }, timeoutMs);
      script.src = url;
      script.dataset[marker] = "true";
      script.async = true;
      script.onload = () => finish(resolve, script);
      script.onerror = () => {
        script.remove();
        finish(reject, new Error(`Could not load ${url}`));
      };
      document.head.appendChild(script);
    });
  }

  async function ensureSupabaseSdk() {
    if (window.supabase?.createClient) return window.supabase;
    const sources = [
      "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
      "https://unpkg.com/@supabase/supabase-js@2"
    ];
    let lastError = null;
    for (let index = 0; index < sources.length; index += 1) {
      try {
        await loadExternalScript(sources[index], "sakuraSupabaseSdkBootstrap");
        if (window.supabase?.createClient) return window.supabase;
        throw new Error("Supabase SDK loaded without createClient.");
      }
      catch (error) {
        lastError = error;
        console.warn(`Sakura Account SDK source ${index + 1} failed; ${index + 1 < sources.length ? "trying backup source." : "no backup source remains."}`, error);
      }
    }
    throw lastError || new Error("Supabase SDK could not load.");
  }

  function bootQuizLabStyle() {
    const existing = document.querySelector("link[data-sakura-quiz-lab-style]");
    if (existing) {
      if (!existing.href.includes("v=2")) existing.href = "./features/sakura-quiz-lab.css?v=2";
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./features/sakura-quiz-lab.css?v=2";
    link.dataset.sakuraQuizLabStyle = "true";
    document.head.appendChild(link);
  }

  function bootQuizLab() {
    bootQuizLabStyle();
    if (window.SakuraQuizLab || document.querySelector("script[data-sakura-quiz-lab]")) return;
    const script = document.createElement("script");
    script.src = "./features/sakura-quiz-lab.js?v=1";
    script.dataset.sakuraQuizLab = "true";
    script.async = true;
    script.onerror = () => console.warn("Sakura JLPT Quiz Lab could not load. Existing quizzes will remain available.");
    document.body.appendChild(script);
  }

  function bootReadingQuality() {
    if (window.SakuraReadingQuality || document.querySelector("script[data-sakura-reading-quality]")) return;
    const script = document.createElement("script");
    script.src = "./features/sakura-reading-quality.js?v=1";
    script.dataset.sakuraReadingQuality = "true";
    script.async = true;
    script.onerror = () => console.warn("Sakura Reading quality layer could not load. Core Reading Garden will remain available.");
    document.body.appendChild(script);
  }

  function bootGoogleOAuthLauncher() {
    if (window.SakuraGoogleOAuthLauncher || document.querySelector("script[data-sakura-google-oauth]")) return;
    const script = document.createElement("script");
    script.src = "./features/sakura-google-oauth.js?v=1";
    script.dataset.sakuraGoogleOauth = "true";
    script.async = true;
    script.onerror = () => console.warn("Sakura Google sign-in launcher could not load. Existing account methods will remain available.");
    document.body.appendChild(script);
  }

  function bootSakuraAccount() {
    if (!window.SakuraAuth && !document.querySelector("script[data-sakura-auth]")) {
      const script = document.createElement("script");
      script.src = "./features/sakura-auth.js?v=2";
      script.dataset.sakuraAuth = "true";
      script.async = true;
      script.onerror = () => console.warn("Sakura Account could not load. Core Sakura will continue normally.");
      document.body.appendChild(script);
    }
    bootGoogleOAuthLauncher();
  }

  async function prepareSakuraAccount() {
    try {
      await ensureSupabaseSdk();
      bootSakuraAccount();
    }
    catch (error) {
      console.warn("Sakura Account connection library could not load. Core Sakura will continue normally.", error);
      window.dispatchEvent(new CustomEvent("sakura:auth-sdk-error", { detail:{ retryable:true } }));
    }
  }

  function bootSakuraServices() {
    bootReadingQuality();
    bootQuizLab();
    prepareSakuraAccount();
  }

  if (document.body) bootSakuraServices();
  else document.addEventListener("DOMContentLoaded", bootSakuraServices, { once:true });
}());
