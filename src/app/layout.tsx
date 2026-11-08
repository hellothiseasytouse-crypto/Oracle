import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ORACLE — AI Workspace",
    template: "%s · ORACLE",
  },
  applicationName: "ORACLE",
  description: "Your personal AI workspace for conversations, research, ideas, and memory.",
  icons: {
    icon: "/logo/favicon.svg",
    shortcut: "/logo/favicon.svg",
    apple: "/logo/favicon.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://oracle-sepia-one.vercel.app"),
  openGraph: {
    title: "ORACLE — AI Workspace",
    description: "Your personal AI workspace for conversations, research, ideas, and memory.",
    siteName: "ORACLE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ORACLE — AI Workspace",
    description: "Your personal AI workspace for conversations, research, ideas, and memory.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
