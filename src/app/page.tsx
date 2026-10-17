export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="backend-shell">
      <div className="backend-mark">◒</div>
      <p className="eyebrow">ORACLE · SERVER</p>
      <h1>Your intelligence workspace has a backend.</h1>
      <p className="intro">This deployment provides the secure API layer for the ORACLE GitHub Pages interface. The AI provider key stays on this server and is never sent to visitors' browsers.</p>
      <section className="status-card">
        <div className="status-line"><span className={process.env.ORACLE_API_KEY ? "dot ready" : "dot"} /> <strong>{process.env.ORACLE_API_KEY ? "AI key configured" : "AI key not configured"}</strong></div>
        <p>{process.env.ORACLE_API_KEY ? "The server has an API key configured. Send a POST request to /api/messages to chat." : "Add ORACLE_API_KEY in this deployment's Environment Variables, then redeploy to enable AI responses."}</p>
      </section>
      <section className="steps">
        <h2>Finish setup</h2>
        <ol>
          <li>Open your hosting provider's project settings and add <code>ORACLE_API_KEY</code>.</li>
          <li>Optionally set <code>ORACLE_MODEL</code> and <code>ORACLE_API_BASE_URL</code>.</li>
          <li>Redeploy this project, then copy its public URL.</li>
          <li>In the ORACLE GitHub Pages <code>index.html</code>, set <code>window.ORACLE_API_URL</code> to this deployment URL plus <code>/api/messages</code>.</li>
        </ol>
      </section>
      <a className="launch" href="https://hellothiseasytouse-crypto.github.io/Oracle/">Open ORACLE workspace ↗</a>
      <p className="fine">This is the API host, not the chat interface. Keep API keys out of GitHub files and browser code.</p>
    </main>
  );
}
