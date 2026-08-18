import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGINS = new Set([
  "https://chachinn.github.io",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5500",
]);
const EXPECTED_PUBLISHABLE_KEY = "sb_publishable_X10kPG4ED--0Y5oyDVR1kA_H-NF_7LV";
const REPORT_TO = "Chabelanio@gmail.com";
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const rate = new Map<string, number[]>();

function cors(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://chachinn.github.io";
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-headers": "content-type, apikey",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "Origin",
  };
}
function json(body: unknown, status = 200, origin: string | null = null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
function clean(value: unknown, max: number) {
  return String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
}
function html(value: unknown) {
  return clean(value, 10000).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch] || ch));
}
function ipOf(req: Request) {
  return (req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
}
function rateAllowed(ip: string) {
  const now = Date.now();
  const recent = (rate.get(ip) || []).filter((ts) => now - ts < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) { rate.set(ip, recent); return false; }
  recent.push(now); rate.set(ip, recent); return true;
}
function validEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function decodedBytes(base64: string) {
  const clean64 = base64.replace(/\s/g, "");
  const padding = clean64.endsWith("==") ? 2 : clean64.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean64.length * 3) / 4) - padding);
}
function resendUserMessage(status: number, result: any) {
  const providerMessage = clean(result?.message, 600);
  if (status === 403 && /testing emails|own email address|verify a domain/i.test(providerMessage)) {
    return "Resend can only send test emails to the email address on your Resend account. Make sure your Resend account email is Chabelanio@gmail.com, or verify a sending domain.";
  }
  if (status === 401) return "The bug-report email key was rejected. Please reconnect the Resend API key in Supabase.";
  if (status === 403) return "Resend rejected this send. Check that the Resend account can send to Chabelanio@gmail.com or verify a sending domain.";
  if (status === 422 && providerMessage) return `Resend rejected the email details: ${providerMessage}`;
  return "The report reached the email service, but the email could not be sent. Please try again later.";
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
  if (req.headers.get("apikey") !== EXPECTED_PUBLISHABLE_KEY) return json({ error: "Invalid Sakura client key." }, 401, origin);
  if (!rateAllowed(ipOf(req))) return json({ error: "Too many reports were sent recently. Please try again later." }, 429, origin);

  let body: any;
  try { body = await req.json(); }
  catch { return json({ error: "Invalid report payload." }, 400, origin); }

  if (clean(body?.website, 200)) return json({ ok: true }, 200, origin);

  const type = clean(body?.type, 40) || "bug";
  const title = clean(body?.title, 120);
  const details = clean(body?.details, 4000);
  const expected = clean(body?.expected, 2000);
  const contact = clean(body?.contact, 160);
  const context = body?.context || {};
  if (!title || !details) return json({ error: "A title and description are required." }, 400, origin);
  if (!validEmail(contact)) return json({ error: "The contact email is invalid." }, 400, origin);

  let attachment: { filename: string; content: string; content_type: string } | null = null;
  if (body?.attachment) {
    const filename = clean(body.attachment.filename, 180) || "sakura-bug-screenshot";
    const mimeType = clean(body.attachment.mimeType, 80).toLowerCase();
    const content = String(body.attachment.content || "").replace(/\s/g, "");
    const declaredSize = Number(body.attachment.size || 0);
    const actualSize = decodedBytes(content);
    if (!ALLOWED_MIME.has(mimeType)) return json({ error: "Unsupported screenshot format." }, 400, origin);
    if (!content || actualSize > MAX_ATTACHMENT_BYTES || declaredSize > MAX_ATTACHMENT_BYTES) return json({ error: "Screenshot must be 3 MB or smaller." }, 400, origin);
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(content)) return json({ error: "Screenshot data is invalid." }, 400, origin);
    attachment = { filename, content, content_type: mimeType };
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return json({ error: "Bug-report email is not connected yet." }, 503, origin);
  const from = Deno.env.get("BUG_REPORT_FROM_EMAIL") || "Sakura Bug Reports <onboarding@resend.dev>";

  const route = clean(context.route, 120) || "unknown";
  const appVersion = clean(context.appVersion, 80) || "v1";
  const pageUrl = clean(context.url, 600);
  const language = clean(context.language, 40);
  const userAgent = clean(context.userAgent, 500);
  const sentAt = clean(context.sentAt, 80);
  const subject = `[Sakura ${type.toUpperCase()}] ${title}`.slice(0, 200);

  const text = [
    "Sakura bug report", "", `Type: ${type}`, `Title: ${title}`, `Contact: ${contact || "Not provided"}`,
    `Route: ${route}`, `Version: ${appVersion}`, `Sent: ${sentAt || "Unknown"}`, `URL: ${pageUrl || "Unknown"}`,
    `Language: ${language || "Unknown"}`, `Device: ${userAgent || "Unknown"}`, "", "WHAT HAPPENED", details,
    "", "EXPECTED", expected || "Not provided", "", `Screenshot: ${attachment ? attachment.filename : "None"}`,
  ].join("\n");

  const emailPayload: Record<string, unknown> = {
    from,
    to: [REPORT_TO],
    subject,
    text,
    html: `<div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.55;color:#252129"><h2 style="color:#d74778">🌸 Sakura Bug Report</h2><p><b>Type:</b> ${html(type)}<br><b>Title:</b> ${html(title)}<br><b>Contact:</b> ${html(contact || "Not provided")}</p><p><b>Route:</b> ${html(route)}<br><b>Version:</b> ${html(appVersion)}<br><b>Sent:</b> ${html(sentAt || "Unknown")}<br><b>URL:</b> ${html(pageUrl || "Unknown")}</p><h3>What happened</h3><p style="white-space:pre-wrap">${html(details)}</p><h3>What should have happened</h3><p style="white-space:pre-wrap">${html(expected || "Not provided")}</p><hr><p style="font-size:12px;color:#777"><b>Language:</b> ${html(language || "Unknown")}<br><b>Device:</b> ${html(userAgent || "Unknown")}<br><b>Screenshot:</b> ${html(attachment ? attachment.filename : "None")}</p></div>`,
  };
  if (attachment) emailPayload.attachments = [attachment];
  if (contact) emailPayload.reply_to = contact;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "authorization": `Bearer ${resendKey}`, "content-type": "application/json" },
    body: JSON.stringify(emailPayload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Sakura bug-report email provider error", { status: response.status, name: clean(result?.name, 120), message: clean(result?.message, 600) });
    return json({ error: resendUserMessage(response.status, result), code: `resend_${response.status}` }, 502, origin);
  }
  return json({ ok: true, id: result?.id || null }, 200, origin);
});
