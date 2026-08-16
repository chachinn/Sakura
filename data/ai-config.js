/* Public Sakura AI configuration. Provider secrets never belong in this file. */
window.SAKURA_AI_CONFIG = Object.freeze({
  version: 3,
  enabled: true,
  endpoint: "https://hrycfsekrvflrbwahgyh.supabase.co/functions/v1/sakura-ai-translator",
  gatewayKey: "sb_publishable_X10kPG4ED--0Y5oyDVR1kA_H-NF_7LV",
  provider: "gemini",
  model: "gemini-3.6-flash",
  privacyNote: "AI requests require internet. On Gemini's free API tier, submitted content may be used by Google to improve its products. Avoid sensitive personal information."
});