import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORACLE Backend",
  description: "Secure ORACLE AI backend and deployment status.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
