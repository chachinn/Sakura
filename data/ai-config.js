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
    version: 1,
    enabled: true,
    projectUrl: "https://hrycfsekrvflrbwahgyh.supabase.co",
    publishableKey,
    redirectUrl: "https://chachinn.github.io/sakura/",
    paywallEnabled: false,
    trialDays: 3
  });

  function bootSakuraAccount() {
    if (window.SakuraAuth || document.querySelector("script[data-sakura-auth]")) return;
    const script = document.createElement("script");
    script.src = "./features/sakura-auth.js?v=1";
    script.dataset.sakuraAuth = "true";
    script.async = true;
    script.onerror = () => console.warn("Sakura Account could not load. Core Sakura will continue normally.");
    document.body.appendChild(script);
  }

  if (document.body) bootSakuraAccount();
  else document.addEventListener("DOMContentLoaded", bootSakuraAccount, { once:true });
}());
