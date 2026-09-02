import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AgeGate } from "@/components/age-gate";

export const metadata: Metadata = {
  title: "Mara Vera",
  description: "Meet Mara Vera — a synthetic virtual character with her own voice, taste and living first-party experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AgeGate />
        <header className="siteHeader">
          <Link href="/" className="wordmark">MARA VERA</Link>
          <nav aria-label="Primary navigation">
            <Link href="/experience">Enter Mara</Link>
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
