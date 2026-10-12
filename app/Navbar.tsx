"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "⚖️ Court" },
  { href: "/cases", label: "📁 Cases" },
  { href: "/ranking", label: "📋 Ranking" },
  { href: "/investigators", label: "🏛️ Detectives" },
  { href: "/scan", label: "🔍 Scan" },
  { href: "/recovery", label: "🎩 Recovery" },
  { href: "/pricing", label: "🛡️ Pricing" },
  { href: "/submit", label: "📋 Report" },
];

export function Navbar() {
  const path = usePathname();
  // Remember where the menu was opened: any navigation (link, back button) closes it.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 bg-[#0c0806]/95 backdrop-blur-sm border-b border-[#b88648]/15">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpenAt(null)}>
          <span className="text-2xl">⚖️</span>
          <span className="font-court text-lg font-bold tracking-tight">
            <span className="text-gold">VERDICT</span>{" "}
            <span className="text-[#e8dcc8]/60">COURT</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden lg:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                isActive(l.href)
                  ? "text-[#d4a056] bg-[#d4a056]/10 font-bold"
                  : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/70 hover:bg-[#d4a056]/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile */}
        <button
          type="button"
          onClick={() => setOpenAt(open ? null : path)}
          aria-expanded={open}
          aria-label="Menu"
          className="lg:hidden px-3 py-1.5 text-sm rounded-md text-[#d4a056] border border-[#d4a056]/20"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[#b88648]/15 px-4 py-2 grid grid-cols-2 gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpenAt(null)}
              className={`px-3 py-2.5 text-sm rounded-md transition-all ${
                isActive(l.href) ? "text-[#d4a056] bg-[#d4a056]/10 font-bold" : "text-[#e8dcc8]/50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
