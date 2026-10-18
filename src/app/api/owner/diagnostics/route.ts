import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const expected = process.env.ORACLE_OWNER_TOKEN;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return !!expected && supplied.length > 0 && supplied === expected;
}

function keys(raw: string, base: string) {
  const groq = /groq\.com/i.test(base) ? raw.match(/\bgsk_[A-Za-z0-9_-]+\b/g) || [] : [];
  const parsed = groq.length ? groq : raw.split(/[\r\n,;\s]+/).map(x => x.trim().replace(/^Bearer\s+/i, "").replace(/^[\"']+|[\"']+$/g, "")).filter(Boolean);
  return [...new Set(parsed)];
}

function pool(prefix: "ORACLE" | "ORACLE_NAMING") {
  const raw = prefix === "ORACLE"
    ? [process.env.ORACLE_API_KEYS || "", process.env.ORACLE_API_KEY || ""].join("\n")
    : [process.env.ORACLE_NAMING_API_KEYS || "", process.env.ORACLE_NAMING_API_KEY || process.env.ORACLE_API_KEYS || process.env.ORACLE_API_KEY || ""].join("\n");
  const base = (prefix === "ORACLE"
    ? process.env.ORACLE_API_BASE_URL
    : process.env.ORACLE_NAMING_API_BASE_URL || process.env.ORACLE_API_BASE_URL) || "https://api.groq.com/openai/v1";
  return { base: base.replace(/\/$/, ""), keys: keys(raw, base), model: prefix === "ORACLE_NAMING" ? process.env.ORACLE_NAMING_MODEL || process.env.ORACLE_MODEL || "openai/gpt-oss-20b" : process.env.ORACLE_MODEL || "openai/gpt-oss-120b" };
}

async function probe(base: string, key: string, model: string) {
  const start = Date.now();
  try {
    const response = await fetch(base + "/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: "Reply with exactly: ORACLE_OK" }], temperature: 0, max_tokens: 8 }),
      signal: AbortSignal.timeout(15000),
    });
    const body = await response.json().catch(() => ({}));
    return { ok: response.ok && typeof body?.choices?.[0]?.message?.content === "string", status: response.status, ms: Date.now() - start, error: response.ok ? undefined : (typeof body?.error?.message === "string" ? body.error.message.slice(0, 220) : "Provider rejected the test.") };
  } catch (e) {
    return { ok: false, status: 0, ms: Date.now() - start, error: e instanceof Error ? e.name : "Network error" };
  }
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Owner authorization required. Configure ORACLE_OWNER_TOKEN on the server." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const command = typeof body.command === "string" ? body.command.toLowerCase().trim() : "health";
  const chat = pool("ORACLE");
  const naming = pool("ORACLE_NAMING");
  if (command === "health" || command === "status") {
    return NextResponse.json({
      ok: true,
      chat: { configured: chat.keys.length, model: chat.model, baseUrl: chat.base, keyLabels: chat.keys.map((_, i) => "Chat key " + (i + 1)) },
      naming: { configured: naming.keys.length, model: naming.model, baseUrl: naming.base, keyLabels: naming.keys.map((_, i) => "Title key " + (i + 1)) },
      webSearch: !!process.env.TAVILY_API_KEY || !!process.env.TAVILY_API_KEYS,
      sharedMemory: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      selfRepair: "proposal-and-test-only",
    });
  }
  if (command === "titlemeaning" || command === "title" || command === "test-title") {
    if (!naming.keys.length) return NextResponse.json({ ok: false, command, error: "No title API keys configured.", results: [] }, { status: 200 });
    const results = [];
    for (let i = 0; i < naming.keys.length; i++) results.push({ label: "Title key " + (i + 1), ...(await probe(naming.base, naming.keys[i], naming.model)) });
    return NextResponse.json({ ok: results.some(x => x.ok), command, model: naming.model, results });
  }
  if (command === "test" || command === "test-keys" || command === "random") {
    if (!chat.keys.length) return NextResponse.json({ ok: false, command, error: "No chat API keys configured.", results: [] }, { status: 200 });
    const results = [];
    for (let i = 0; i < chat.keys.length; i++) results.push({ label: "Chat key " + (i + 1), ...(await probe(chat.base, chat.keys[i], chat.model) ) });
    return NextResponse.json({ ok: results.some(x => x.ok), command, model: chat.model, results });
  }
  if (command === "memory") {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return NextResponse.json({ ok: false, error: "Shared memory needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, { status: 200 });
    const res = await fetch(url + "/rest/v1/oracle_memories?select=id,content,created_at&order=created_at.desc&limit=30", { headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey }, signal: AbortSignal.timeout(10000) });
    const data = await res.json().catch(() => []);
    return NextResponse.json({ ok: res.ok, status: res.status, memories: res.ok ? data : [], error: res.ok ? undefined : "Could not read shared memory. Create the oracle_memories table using the supplied SQL." });
  }
  if (command === "save-memory") {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const content = typeof body.content === "string" ? body.content.trim().slice(0, 3000) : "";
    if (!url || !serviceKey) return NextResponse.json({ ok: false, error: "Shared memory needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." }, { status: 200 });
    if (!content) return NextResponse.json({ ok: false, error: "Enter a memory to save." }, { status: 400 });
    const res = await fetch(url + "/rest/v1/oracle_memories", { method: "POST", headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey, "Content-Type": "application/json", Prefer: "return=representation" }, body: JSON.stringify({ content, source: "owner-console" }), signal: AbortSignal.timeout(10000) });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json({ ok: res.ok, memory: res.ok ? (Array.isArray(data) ? data[0] : data) : undefined, error: res.ok ? undefined : "Memory save failed. Check the table schema and server logs." }, { status: res.ok ? 200 : 502 });
  }
  return NextResponse.json({ ok: false, error: "Unknown command. Try health, test, titlemeaning, memory, or save-memory." }, { status: 400 });
}
