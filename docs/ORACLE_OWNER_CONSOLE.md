# ORACLE owner console setup

The owner console is `owner-console.html` in the repository. It can check API key pools, run chat/title probes, send random questions, and manage shared notes. The page does not contain provider keys; the server requires an owner token.

## 1. Backend environment variables

In the backend deployment's server-side environment settings, add:

- `ORACLE_OWNER_TOKEN_2`: a long, random secret used only for owner-console access. The backend also accepts the legacy `ORACLE_OWNER_TOKEN` if `_2` is not set.
- `ORACLE_API_KEYS` or `ORACLE_API_KEY`: chat provider key(s), server-side only.
- `ORACLE_NAMING_API_KEYS` / `ORACLE_NAMING_API_KEY`: optional title-generation key pool.
- `TAVILY_API_KEYS` or `TAVILY_API_KEY`: optional web-search key(s).
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: optional shared persistent memory. Keep the service-role key private and never use it in browser code.

For the browser console, enter the backend base URL, not the full `/api/messages` path, e.g. `https://your-backend.example`. The backend must be deployed with the new owner diagnostics route.

## 2. Shared memory setup

Run `docs/ORACLE_SHARED_MEMORY.sql` in the Supabase SQL editor. Then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` on the backend and redeploy. Chat requests will include the newest saved notes as context; the owner console can read and save notes. This is retrieval-augmented context, not model-weight training.

## 3. Open and test

Open `https://hellothiseasytouse-crypto.github.io/Oracle/owner-console.html`, connect with the backend base URL and owner token, then run **Refresh status**, **Test chat keys**, or **titlemeaning**. The random-question test uses the configured chat endpoint. The console never returns the secret key strings.

## 4. Search and failover behavior

When a question appears to require current, niche, or explicitly requested research, the chat route uses Tavily if configured. Search keys are tried in order. Source URLs are supplied to the model; if the model provider fails, ORACLE can return a transparent source-only fallback rather than claiming the AI answered. Without a Tavily key, automatic live search is unavailable.

## 5. Self-repair boundary

The console provides a safe repair checklist. Actual self-modification is deliberately not unrestricted: make changes on a separate branch, run tests/builds, review the diff, and approve before deployment. Never give a model arbitrary production write access or expose secrets in prompts/logs.
