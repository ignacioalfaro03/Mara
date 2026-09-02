import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AgeGate } from "@/components/age-gate";

export const metadata: Metadata = {
  title: "Mara Vera",
  description: "Meet Mara Vera — a synthetic virtual character with a premium private side.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AgeGate />
        <header className="siteHeader">
          <Link href="/" className="wordmark">MARA VERA</Link>
          <nav aria-label="Primary navigation">
            <Link href="/meet-mara">Meet Mara</Link>
            <Link href="/premium">Private</Link>
          </nav>
        </header>
        {children}
        <footer className="siteFooter">
          <span>Mara Vera is an AI-generated virtual character.</span>
          <div>
            <Link href="/legal">Privacy · Terms · AI disclosure</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
