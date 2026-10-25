"use client";

import { useEffect, useState } from "react";

const crashStates = [
  { bg: "#0078d7", face: ":(", headline: "Your PC ran into a problem and needs to restart.", detail: "We're just collecting some error info, and then we'll restart for you.", code: "ORACLE_NOT_RESPONDING", failed: "ORACLE.exe" },
  { bg: "#0067b9", face: ":(", headline: "A problem has been detected and ORACLE has been shut down.", detail: "The system encountered an unexpected exception.", code: "CRITICAL_PROCESS_DIED", failed: "ORACLE_CORE.sys" },
  { bg: "#0756a5", face: ":(", headline: "Your device ran into a problem.", detail: "Attempting to recover system state…", code: "SYSTEM_THREAD_EXCEPTION_NOT_HANDLED", failed: "veylune.exe" },
  { bg: "#004e9a", face: ":(", headline: "Something went wrong. Your PC needs to restart.", detail: "Collecting diagnostic information…", code: "MEMORY_MANAGEMENT", failed: "ORACLE_MEMORY.dll" },
  { bg: "#0078d7", face: ":(", headline: "Your PC ran into a problem and needs to restart.", detail: "The system is trying to recover from a fatal error.", code: "KERNEL_MODE_HEAP_CORRUPTION", failed: "ORACLE.exe" },
];

export default function Home() {
  const [crashIndex, setCrashIndex] = useState(0);
  const [progress, setProgress] = useState(0);

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
      const colors = ["#ffffff", "#00ff9c", "#ffcc00", "#ff4fd8", "#7dd3fc", "#ff6b6b", "#c4b5fd", "#ff9f43", "#a3e635"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = Math.floor(Math.random() * 5);
      const mark = shape === 0
        ? `<circle cx="16" cy="16" r="${5 + Math.floor(Math.random() * 8)}" fill="${color}"/>`
        : shape === 1
          ? `<rect x="6" y="6" width="20" height="20" rx="${Math.floor(Math.random() * 8)}" fill="${color}" transform="rotate(${Math.floor(Math.random() * 360)} 16 16)"/>`
          : shape === 2
            ? `<path d="M16 3 L29 28 H3 Z" fill="${color}"/>`
            : shape === 3
              ? `<path d="M5 16 L12 7 L19 16 L12 25 Z M16 16 L23 7 L30 16 L23 25 Z" fill="${color}"/>`
              : `<path d="M16 3 L19 12 L29 12 L21 18 L24 28 L16 22 L8 28 L11 18 L3 12 L13 12 Z" fill="${color}"/>`;
      const bgColors = ["#071b36", "#191919", "#240b36", "#042f2e", "#3f1010"];
      const bg = bgColors[Math.floor(Math.random() * bgColors.length)];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="${Math.floor(Math.random() * 10)}" fill="${bg}"/>${mark}</svg>`;
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
    const identityInterval = window.setInterval(changeBrowserIdentity, 120);
    const screenInterval = window.setInterval(() => {
      setCrashIndex((current) => (current + 1) % crashStates.length);
      setProgress((current) => (current >= 99 ? 0 : current + 1 + Math.floor(Math.random() * 7)));
    }, 1300);

    return () => {
      window.clearInterval(identityInterval);
      window.clearInterval(screenInterval);
    };
  }, []);

  const crash = crashStates[crashIndex];

  return (
    <main
      aria-label="Simulated Windows crash screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        width: "100vw",
        height: "100dvh",
        overflow: "auto",
        boxSizing: "border-box",
        background: crash.bg,
        color: "#fff",
        fontFamily: '"Segoe UI", Arial, sans-serif',
        padding: "clamp(30px, 8vh, 90px) clamp(24px, 13vw, 190px)",
        display: "flex",
        alignItems: "flex-start",
        transition: "background-color 180ms linear",
      }}
    >
      <section style={{ width: "100%", maxWidth: 900, paddingTop: "2vh" }}>
        <div style={{ fontSize: "clamp(64px, 10vw, 112px)", lineHeight: 1, fontWeight: 300, marginBottom: 28 }}>{crash.face}</div>
        <div style={{ fontSize: "clamp(21px, 3vw, 32px)", lineHeight: 1.35, fontWeight: 300, maxWidth: 820 }}>{crash.headline}</div>
        <div style={{ fontSize: "clamp(16px, 2vw, 22px)", marginTop: 18, fontWeight: 300 }}>{crash.detail}</div>
        <div style={{ fontSize: "clamp(16px, 2vw, 22px)", marginTop: 8, fontWeight: 300 }}>{progress}% complete</div>
        <div style={{ marginTop: 42, fontSize: 14, lineHeight: 1.7, opacity: 0.96 }}>
          <div>Stop code: {crash.code}</div>
          <div>What failed: {crash.failed}</div>
        </div>
        <div style={{ marginTop: 34, fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>This is a simulated crash screen. No data was collected.</div>
      </section>
    </main>
  );
}
