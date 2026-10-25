"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randomText = (min: number, max: number) => {
      const length = min + Math.floor(Math.random() * (max - min + 1));
      let value = "";
      for (let i = 0; i < length; i++) value += chars[Math.floor(Math.random() * chars.length)];
      return value;
    };

    const changeBrowserIdentity = () => {
      document.title = randomText(3, 11);

      const colors = ["#ffffff", "#00ff9c", "#ffcc00", "#ff4fd8", "#7dd3fc", "#ff6b6b", "#c4b5fd"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = Math.floor(Math.random() * 3);
      const mark = shape === 0
        ? `<circle cx="16" cy="16" r="7" fill="${color}"/>`
        : shape === 1
          ? `<rect x="8" y="8" width="16" height="16" rx="3" fill="${color}" transform="rotate(${Math.floor(Math.random() * 360)} 16 16)"/>`
          : `<path d="M16 5 L27 26 H5 Z" fill="${color}"/>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#071b36"/>${mark}</svg>`;
      const iconUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;

      let iconLinks = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
      if (iconLinks.length === 0) {
        const link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
        iconLinks = [link];
      }
      iconLinks.forEach((link) => {
        link.href = iconUrl;
        link.type = "image/svg+xml";
      });
    };

    changeBrowserIdentity();
    const interval = window.setInterval(changeBrowserIdentity, 650);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main
      aria-label="Windows crash screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        width: "100vw",
        height: "100dvh",
        overflow: "auto",
        boxSizing: "border-box",
        background: "#0078d7",
        color: "#fff",
        fontFamily: '"Segoe UI", Arial, sans-serif',
        padding: "clamp(30px, 8vh, 90px) clamp(24px, 13vw, 190px)",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <section style={{ width: "100%", maxWidth: 900, paddingTop: "2vh" }}>
        <div style={{ fontSize: "clamp(64px, 10vw, 112px)", lineHeight: 1, fontWeight: 300, marginBottom: 28 }}>:(</div>
        <div style={{ fontSize: "clamp(21px, 3vw, 32px)", lineHeight: 1.35, fontWeight: 300, maxWidth: 820 }}>
          Your PC ran into a problem and needs to restart.
        </div>
        <div style={{ fontSize: "clamp(16px, 2vw, 22px)", marginTop: 18, fontWeight: 300 }}>
          We’re just collecting some error info, and then we’ll restart for you.
        </div>
        <div style={{ fontSize: "clamp(16px, 2vw, 22px)", marginTop: 8, fontWeight: 300 }}>0% complete</div>
        <div style={{ marginTop: 42, fontSize: 14, lineHeight: 1.7, opacity: 0.96 }}>
          <div>Stop code: ORACLE_NOT_RESPONDING</div>
          <div>What failed: ORACLE.exe</div>
        </div>
        <div style={{ marginTop: 34, fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
          This is a simulated crash screen. No data was collected.
        </div>
      </section>
    </main>
  );
}
