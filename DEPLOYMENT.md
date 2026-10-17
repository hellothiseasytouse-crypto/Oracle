# ORACLE deployment guide

## 1. Deploy the API backend

1. Open [Vercel](https://vercel.com/) and import `hellothiseasytouse-crypto/Oracle` from GitHub.
2. Keep the project root at the repository root. Vercel should detect the Next.js framework.
3. In the Vercel project, open **Settings → Environment Variables**.
4. Add these variables:

   - `ORACLE_API_KEY` — your AI provider API key. This stays on the server.
   - `ORACLE_MODEL` — defaults to `gpt-4o-mini`.
   - `ORACLE_API_BASE_URL` — defaults to `https://api.openai.com/v1`. Change this only if you use a compatible provider with the same Chat Completions API format.

5. Redeploy after adding or changing environment variables.
6. Your backend chat endpoint will be `https://YOUR-VERCEL-PROJECT.vercel.app/api/messages`.

Do not put the real key in this repository, in the GitHub Pages files, or in the browser. The repository's `.env.example` contains placeholders only.

## 2. Connect GitHub Pages to the backend

1. Open [the ORACLE website](https://hellothiseasytouse-crypto.github.io/Oracle/).
2. Click the small information/connection icon at the top right.
3. Paste the backend URL from step 1, including `/api/messages`.
4. Save it. The URL is saved in this browser only; the API key is not requested by the frontend.
5. Send a message. If setup is correct, the response will be formatted as Markdown.

If the backend reports that `ORACLE_API_KEY` is missing, add it in the Vercel environment settings and redeploy. If you see a provider authentication or quota error, check the key, model access, and provider billing/limits.

## 3. Frontend capabilities and permissions

- **Voice dictation:** click **Voice** and allow microphone access when your browser asks. Speech recognition depends on browser support and may use the browser's speech service.
- **Read aloud:** click **Read aloud** to have future AI replies spoken using your browser's speech synthesis.
- **Camera:** click **Camera** and grant camera permission. Capture a photo, attach it, write a question, and send it.
- **Images and text files:** image attachments are previewed locally and sent to the AI endpoint only when you submit the message and have configured a backend. Basic text, Markdown, CSV, and JSON files can be included. PDFs are not parsed by this initial API implementation.
- **Live voice calling:** this version supports voice dictation and spoken responses, not a continuous, low-latency, real-time voice call.

## 4. Important limits

GitHub Pages cannot execute the Next.js API route. The frontend and API backend are two separate deployments. The backend currently implements chat and image input; other reserved ORACLE feature endpoints are placeholders and return a clear not-implemented response.

The server route is designed for OpenAI's Chat Completions API and compatible providers. The selected model must support image inputs if you want image analysis. Provider costs, rate limits, model availability, and file-size limits still apply.
