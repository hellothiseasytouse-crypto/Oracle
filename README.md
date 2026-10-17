# ORACLE

ORACLE is a dark, mobile-friendly AI workspace frontend published on GitHub Pages, with a separate Next.js API host for secure AI requests.

## Live frontend

https://hellothiseasytouse-crypto.github.io/Oracle/

## Current frontend features

- Chat-style layout with Markdown formatting for headings, paragraphs, lists, and code
- Image and file attachment previews, including camera captures
- Browser voice dictation (browser support and microphone permission required)
- Optional read-aloud for AI replies
- Conversation reset and text export
- Configurable backend URL in the connection/info control

## Enable real AI replies

GitHub Pages is static hosting, so it cannot run the server-side AI route or protect provider API keys. Deploy this repository as a Next.js app on a server host such as Vercel, set the API key as a server environment variable, then connect the frontend to that deployment. See [DEPLOYMENT.md](DEPLOYMENT.md).

**Never put an AI provider key in `index.html`, client-side JavaScript, GitHub commits, or a message to the assistant.**