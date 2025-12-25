import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Basic heuristic spam checks
function looksSpammy(message: string) {
  const lower = message.toLowerCase();

  // Too many links is a big signal
  const linkCount = (lower.match(/https?:\/\//g) || []).length;
  if (linkCount >= 2) return true;

  // Common spam keywords (light touch)
  const spamKeywords = [
    "crypto",
    "bitcoin",
    "investment",
    "seo services",
    "backlinks",
    "guest post",
    "casino",
    "viagra",
    "onlyfans",
  ];
  if (spamKeywords.some((k) => lower.includes(k))) return true;

  // Extremely long messages can be abuse
  if (message.length > 2000) return true;

  return false;
}

// Basic origin check (prevents random sites from hitting your endpoint)
function isAllowedOrigin(req: Request) {
  const allowed = process.env.ALLOWED_ORIGINS;
  if (!allowed) return true; // allow all if not configured

  const origin = req.headers.get("origin");
  if (!origin) return false;

  const allowedList = allowed.split(",").map((s) => s.trim());
  return allowedList.includes(origin);
}

export async function POST(req: Request) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await req.json();

    const name = String(body?.name || "").trim();
    const phone = String(body?.phone || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    // Honeypot support (optional)
    const gotcha = String(body?._gotcha || "").trim();
    if (gotcha) {
      // Pretend success to waste bot time
      return NextResponse.json({ ok: true });
    }

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    if (looksSpammy(message)) {
      // Don’t tell them it’s spam; just fail politely
      return NextResponse.json(
        { error: "Unable to submit. Please call instead." },
        { status: 400 }
      );
    }

    const to = process.env.LEADS_TO_EMAIL;
    const from = process.env.LEADS_FROM_EMAIL;

    if (!to || !from) {
      return NextResponse.json(
        { error: "Server email config missing." },
        { status: 500 }
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ua = req.headers.get("user-agent") || "unknown";

    const subject = `New Quote Request — ${name}`;

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;">
        <h2>New Quote Request</h2>

        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>

        <hr />

        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>

        <hr />

        <p style="font-size: 12px; color: #666;">
          <strong>Meta:</strong><br/>
          IP: ${escapeHtml(ip)}<br/>
          User-Agent: ${escapeHtml(ua)}
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      replyTo: email,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
