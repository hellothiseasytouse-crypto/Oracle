import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedOrigins = new Set([
  "https://hellothiseasytouse-crypto.github.io",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsHeaders(origin: string | null, requestOrigin: string) {
  const headers = new Headers();
  if (origin && (allowedOrigins.has(origin) || origin === requestOrigin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request.headers.get("origin"), request.nextUrl.origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin, request.nextUrl.origin);
  if (origin && !allowedOrigins.has(origin) && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "This website is not allowed to use the ORACLE API." }, { status: 403, headers });
  }

  if (process.env.ORACLE_REQUIRE_AUTH === "true") {
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\\/$/, "");
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const token = request.headers.get("authorization")?.replace(/^Bearer\\s+/i, "");
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
    }
    if (!token) return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
    try {
      const authResponse = await fetch(supabaseUrl + "/auth/v1/user", {
        headers: { apikey: supabaseAnonKey, Authorization: "Bearer " + token },
        signal: AbortSignal.timeout(8000),
      });
      if (!authResponse.ok) return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
    } catch {
      return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
    }
  }

  // Naming keys are deliberately separate from conversation keys.
  // A missing/exhausted naming pool must never affect a completed chat reply.
  const keys = [...new Set([
    ...(process.env.ORACLE_NAMING_API_KEYS || "").split(/[,\n]/),
    process.env.ORACLE_NAMING_API_KEY || "",
  ].map(key => key.trim()).filter(Boolean))];
  if (!keys.length) return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });

  try {
    const body = await request.json();
    const userText = typeof body.userText === "string" ? body.userText.slice(0, 5000).trim() : "";
    const assistantText = typeof body.assistantText === "string" ? body.assistantText.slice(0, 2500).trim() : "";
    if (!userText) return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });

    const baseUrl = (process.env.ORACLE_NAMING_API_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/$/, "");
    const model = process.env.ORACLE_NAMING_MODEL || process.env.ORACLE_MODEL || "openai/gpt-oss-20b";
    let lastError = "";
    for (const key of keys) {
      const response = await fetch(baseUrl + "/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 40,
          messages: [
            { role: "system", content: "Create a short, specific title for this conversation. Output only the title, 2–6 words, no quotes, no punctuation at the end. Never answer the user request; only name the conversation." },
            { role: "user", content: "User message:\n" + userText + (assistantText ? "\n\nAssistant reply (context only):\n" + assistantText : "") },
          ],
        }),
        signal: AbortSignal.timeout(12000),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        const raw = data?.choices?.[0]?.message?.content;
        if (typeof raw === "string" && raw.trim()) {
          const title = raw.trim().replace(/^["'“”]+|["'“”]+$/g, "").replace(/[.!?]+$/, "").slice(0, 72);
          return NextResponse.json({ title }, { headers });
        }
        return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
      }
      lastError = typeof data?.error?.message === "string" ? data.error.message : "Naming provider unavailable.";
      const keyUnavailable = [401, 402, 403, 429].includes(response.status) ||
        /rate.?limit|quota|tokens per day|billing|insufficient.*credit|api key|authentication|permission denied/i.test(lastError);
      if (!keyUnavailable) break;
    }
    // Deliberately don't expose naming-provider failures to the chat UI.
    return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
  } catch {
    return NextResponse.json({ title: null, skipped: true }, { status: 200, headers });
  }
}
