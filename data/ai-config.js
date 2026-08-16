/* Public Sakura AI configuration. Provider secrets never belong in this file. */
window.SAKURA_AI_CONFIG = Object.freeze({
  version: 3,
  enabled: true,
  endpoint: "https://hrycfsekrvflrbwahgyh.supabase.co/functions/v1/sakura-ai-translator",
  gatewayKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyeWNmc2VrcnZmbHJid2FoZ3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MjQwODcsImV4cCI6MjEwMjQwMDA4N30.imKfvkuV99f3kUt0_rWWKEKaFLrJ6SI4zX3fKLGB5kw",
  provider: "gemini",
  model: "gemini-3.6-flash",
  privacyNote: "AI requests require internet. On Gemini's free API tier, submitted content may be used by Google to improve its products. Avoid sensitive personal information."
});