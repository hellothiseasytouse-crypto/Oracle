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

type IncomingMessage = { role: "user" | "assistant"; content: string };
type IncomingAttachment = { name: string; type?: string; size?: number; data?: string };

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const headers = corsHeaders(origin, request.nextUrl.origin);

  if (origin && !allowedOrigins.has(origin) && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "This website is not allowed to use the ORACLE API." }, { status: 403, headers });
  }

  const apiKey = process.env.ORACLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The AI backend is deployed, but ORACLE_API_KEY has not been configured in the server environment." },
      { status: 503, headers },
    );
  }

  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages as IncomingMessage[] : [];
    const attachments = Array.isArray(body.attachments) ? body.attachments as IncomingAttachment[] : [];

    if (!messages.length || messages.length > 80) {
      return NextResponse.json({ error: "Send a conversation containing between 1 and 80 messages." }, { status: 400, headers });
    }

    const providerMessages: Array<Record<string, unknown>> = [{
      role: "system",
      content: [
        "You are ORACLE, a helpful, capable AI assistant.",
        "Write clearly in Markdown, like a polished conversational assistant.",
        "Use headings when useful, blank lines between paragraphs, lists for steps, and fenced code blocks for code.",
        "Do not put the entire answer in one paragraph. Ask a concise follow-up question when an important detail is missing.",
        "Be honest about uncertainty and about tools or permissions you do not actually have.",
        "Never claim you can access the user's camera, microphone, files, GitHub, or other accounts unless the app has explicitly provided that capability and the user has granted permission.",
        "Never ask users to paste API secrets into chat. Explain that secrets belong in server environment variables.",
      ].join("\n"),
    }];

    for (const item of messages) {
      if (!item || (item.role !== "user" && item.role !== "assistant") || typeof item.content !== "string") continue;
      const content = item.content.slice(0, 30000);
      providerMessages.push({ role: item.role, content });
    }

    if (attachments.length) {
      const userIndex = providerMessages.length - 1;
      const last = providerMessages[userIndex];
      if (last?.role === "user") {
        const parts: Array<Record<string, unknown>> = [{ type: "text", text: String(last.content ?? "") }];
        for (const file of attachments.slice(0, 8)) {
          if (!file || typeof file.name !== "string") continue;
          if (!file.data || typeof file.data !== "string") {
            parts.push({ type: "text", text: "Attached file: " + file.name + " (file contents were not available to the backend)." });
            continue;
          }
          if (file.data.length > 16 * 1024 * 1024) {
            parts.push({ type: "text", text: "Attached file " + file.name + " was skipped because it is too large." });
            continue;
          }
          if (file.type?.startsWith("image/") && /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(file.data)) {
            parts.push({ type: "image_url", image_url: { url: file.data, detail: "auto" } });
          } else if (/^data:(text\/plain|text\/markdown|text\/csv|application\/json);base64,/i.test(file.data)) {
            try {
              const encoded = file.data.split(",", 2)[1] ?? "";
              const decoded = Buffer.from(encoded, "base64").toString("utf8").slice(0, 20000);
              parts.push({ type: "text", text: "Contents of attached file " + file.name + ":\n" + decoded });
            } catch {
              parts.push({ type: "text", text: "Could not decode attached file " + file.name + "." });
            }
          } else {
            parts.push({ type: "text", text: "Attached file: " + file.name + " (" + (file.type || "unknown file type") + "). This file type is not currently parsed by ORACLE." });
          }
        }
        providerMessages[userIndex] = { role: "user", content: parts };
      }
    }

    const baseUrl = (process.env.ORACLE_API_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
    const model = process.env.ORACLE_MODEL || "gpt-4o-mini";
    const upstream = await fetch(baseUrl + "/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: providerMessages,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60000),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = typeof data?.error?.message === "string" ? data.error.message : "The AI provider rejected the request.";
      return NextResponse.json({ error: message }, { status: upstream.status === 429 ? 429 : 502, headers });
    }

    const reply = data?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json({ error: "The AI provider returned an empty response." }, { status: 502, headers });
    }

    return NextResponse.json({ reply }, { headers });
  } catch (error) {
    const message = error instanceof Error && error.name === "TimeoutError"
      ? "The AI request timed out. Please try again."
      : "ORACLE could not process this request. Please try again.";
    return NextResponse.json({ error: message }, { status: 500, headers });
  }
}
