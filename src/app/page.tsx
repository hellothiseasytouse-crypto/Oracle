"use client";

import { useEffect } from "react";


export default function Home() {
  useEffect(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randomTabName = () => {
      const length = 3 + Math.floor(Math.random() * 9);
      let value = "";
      for (let i = 0; i < length; i++) {
        value += chars[Math.floor(Math.random() * chars.length)];
      }
      return value;
    };

    const changeTabName = () => {
      document.title = randomTabName();
    };

    changeTabName();
    const interval = window.setInterval(changeTabName, 650);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main style={{ position: "fixed", inset: 0, background: "#0c0b12", overflow: "hidden" }}>
      <iframe
        title="Veylune AI Workspace"
        src="/veylune.html?v=oracle-farewell-bsod-20261025"
        style={{ width: "100%", height: "100%", border: 0, display: "block", background: "#0c0b12" }}
        allow="microphone; clipboard-read; clipboard-write"
      />
    </main>
  );
}
