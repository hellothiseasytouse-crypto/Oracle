export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#0c0b12", overflow: "hidden" }}>
      <iframe
        title="Veylune AI Workspace"
        src="/veylune.html"
        style={{ width: "100%", height: "100%", border: 0, display: "block", background: "#0c0b12" }}
        allow="microphone; clipboard-read; clipboard-write"
      />
    </main>
  );
}
