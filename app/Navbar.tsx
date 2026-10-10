"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "⚖️ Court" },
  { href: "/cases", label: "📁 Cases" },
  { href: "/ranking", label: "📋 Ranking" },
  { href: "/investigators", label: "🏛️ Detectives" },
  { href: "/scan", label: "🔍 Scan" },
  { href: "/pricing", label: "🛡️ Shield" },
  { href: "/submit", label: "📋 Report" },
];

export function Navbar() {
  const path = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-[#0c0806]/95 backdrop-blur-sm border-b border-[#b88648]/15">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">⚖️</span>
          <span className="font-court text-lg font-bold tracking-tight">
            <span className="text-gold">VERDICT</span>{" "}
            <span className="text-[#e8dcc8]/60">COURT</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  active
                    ? "text-[#d4a056] bg-[#d4a056]/10 font-bold"
                    : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/70 hover:bg-[#d4a056]/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-0.5">
          {LINKS.slice(0, 4).map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-2 py-1 text-xs rounded transition-all ${
                  active ? "text-[#d4a056]" : "text-[#e8dcc8]/30"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
