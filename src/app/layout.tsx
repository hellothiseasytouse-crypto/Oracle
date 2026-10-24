import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Veylune — AI Workspace",
    template: "%s · Veylune",
  },
  applicationName: "Veylune",
  description: "A personal AI workspace for conversations, research, ideas, and memory.",
  icons: {
    icon: "/logo/favicon.svg",
    shortcut: "/logo/favicon.svg",
    apple: "/logo/favicon.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oracle-sepia-one.vercel.app"),
  openGraph: {
    title: "Veylune — AI Workspace",
    description: "A personal AI workspace for conversations, research, ideas, and memory.",
    siteName: "Veylune",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Veylune — AI Workspace",
    description: "A personal AI workspace for conversations, research, ideas, and memory.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
