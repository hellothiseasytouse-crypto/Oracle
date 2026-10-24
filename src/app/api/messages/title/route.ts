import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function titleFromText(input: string): string {
  const cleaned = input
    .replace(/\s+/g, " ")
    .replace(/^(hey|hello|hi|yo|sup)[,!.: -]*/i, "")
    .replace(/^(please|can you|could you|would you|help me)\s+/i, "")
    .replace(/[?!.,;:]+$/g, "")
    .trim();
  if (!cleaned) return "New conversation";
  const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  const words = firstSentence.split(/\s+/).slice(0, 8);
  const title = words.join(" ").replace(/[.!?]+$/g, "");
  return title.length > 1 ? title.charAt(0).toUpperCase() + title.slice(1) : "New conversation";
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigins = new Set([
    "https://hellothiseasytouse-crypto.github.io",
    "http://localhost:3000",
    "http://localhost:3001",
  ]);
  const headers = new Headers();
  if (origin && (allowedOrigins.has(origin) || origin === request.nextUrl.origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Cache-Control", "no-store");
  if (origin && !allowedOrigins.has(origin) && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "This website is not allowed to use the title API." }, { status: 403, headers });
  }
  try {
    const body = await request.json();
    const userText = typeof body.userText === "string" ? body.userText.slice(0, 5000) : "";
    return NextResponse.json({ title: titleFromText(userText) }, { headers });
  } catch {
    return NextResponse.json({ error: "A valid JSON request is required." }, { status: 400, headers });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = new Headers();
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  headers.set("Access-Control-Max-Age", "86400");
  return new NextResponse(null, { status: 204, headers });
}
