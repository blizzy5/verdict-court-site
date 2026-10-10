import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "./Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-court", subsets: ["latin"], weight: ["400", "700", "900"] });

export const metadata: Metadata = {
  title: "Verdict Court — The Court Never Lies",
  description: "On-chain security tribunal for Solana. Track serial ruggers, verify developers, protect your wallet.",
  openGraph: {
    title: "Verdict Court",
    description: "The Court never lies. On-chain security tribunal for Solana.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verdict Court",
    description: "The Court never lies.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen flex flex-col court-bg">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#b88648]/10 py-8 text-center">
          <div className="gold-line max-w-xs mx-auto mb-4" />
          <p className="text-xs text-[#e8dcc8]/20 font-mono">
            VERDICT COURT &copy; 2026 &mdash; Powered by TheHat Engine
          </p>
          <p className="text-xs text-[#e8dcc8]/15 mt-1">
            <a href="https://x.com/verdict_Court" target="_blank" rel="noopener" className="hover:text-[#d4a056] transition-colors">@verdict_Court</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
