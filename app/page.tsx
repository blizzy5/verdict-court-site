"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  verdict_court: { total_ruggers_tracked: number; total_trusted_devs: number; total_verdicts_rendered: number };
  shield: { total_scans: number; tokens_scanned: number; threats_detected: number; scanners_active: number };
  tools: { total: number; installed: number };
  anti_spyware: { pegasus_iocs: number; scam_domains: number };
  community: { kol_tracked: number };
}

const FALLBACK: Stats = {
  verdict_court: { total_ruggers_tracked: 50, total_trusted_devs: 31, total_verdicts_rendered: 81 },
  shield: { total_scans: 0, tokens_scanned: 0, threats_detected: 0, scanners_active: 5 },
  tools: { total: 22, installed: 13 },
  anti_spyware: { pegasus_iocs: 54, scam_domains: 228 },
  community: { kol_tracked: 30 },
};

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function EyeAgentSection() {
  const [courtStats, setCourtStats] = useState({ total_cases: 0, open_cases: 0, guilty: 0, investigators: 8 });
  const [lastCase, setLastCase] = useState<{ case_id: string; title: string; verdict?: string } | null>(null);

  useEffect(() => {
    const API = "https://thehat-production.up.railway.app";
    fetch(`${API}/api/v2/court/stats`).then(r => r.json()).then(setCourtStats).catch(() => {});
    fetch(`${API}/api/v2/court/cases`).then(r => r.json()).then(d => {
      if (d.cases?.length > 0) setLastCase(d.cases[0]);
    }).catch(() => {});
  }, []);

  return (
    <section className="mb-20">
      <div className="text-center mb-8">
        <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em]">Eye-Agent</p>
        <div className="gold-line max-w-[100px] mx-auto mt-2" />
      </div>
      <div className="wood-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔍</span>
          <span className="font-court text-lg text-gold">Eye-Agent Intelligence</span>
          <span className="w-2 h-2 rounded-full bg-[#14F195] pulse-live" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-[#0c0806]/40 rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-mono text-[#4488FF]">{courtStats.open_cases}</p>
            <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider">Open Cases</p>
          </div>
          <div className="bg-[#0c0806]/40 rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-mono text-[#FF4444]">{courtStats.guilty}</p>
            <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider">Guilty</p>
          </div>
          <div className="bg-[#0c0806]/40 rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-mono text-[#d4a056]">{courtStats.total_cases}</p>
            <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider">Total Cases</p>
          </div>
          <div className="bg-[#0c0806]/40 rounded-lg p-3 text-center">
            <p className="text-xl font-bold font-mono text-[#8B5CF6]">{courtStats.investigators}</p>
            <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider">Detectives</p>
          </div>
        </div>
        {lastCase && (
          <Link href={`/cases/${lastCase.case_id}`} className="block bg-[#FF4444]/5 border border-[#FF4444]/10 rounded-lg p-3 hover:border-[#FF4444]/25 transition-all">
            <p className="text-[10px] font-mono text-[#d4a056]/50 uppercase tracking-wider mb-1">Last Verdict</p>
            <p className="text-sm text-[#e8dcc8]">
              <span className="text-[#FF4444] font-bold">{lastCase.verdict ?? "OPEN"}</span> — {lastCase.title}
            </p>
            <p className="text-[10px] font-mono text-[#e8dcc8]/20 mt-1">{lastCase.case_id}</p>
          </Link>
        )}
        <div className="flex gap-3 mt-4">
          <Link href="/cases" className="text-xs font-mono text-[#d4a056] hover:underline">View all cases →</Link>
          <Link href="/investigators" className="text-xs font-mono text-[#8B5CF6] hover:underline">Hall of Fame →</Link>
          <Link href="/submit" className="text-xs font-mono text-[#FF4444] hover:underline">Submit evidence →</Link>
        </div>
      </div>
    </section>
  );
}

function CourtStat({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <div className="wood-card p-5 text-center">
      <span className="text-2xl block mb-2">{icon}</span>
      <p className="text-3xl font-bold font-mono" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[#e8dcc8]/30 mt-2 uppercase tracking-[0.2em] font-mono">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>(FALLBACK);
  const [live, setLive] = useState(false);

  useEffect(() => {
    fetch("https://thehat-production.up.railway.app/api/v2/stats/overview")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLive(true); })
      .catch(() => {});
  }, []);

  const vc = stats.verdict_court;
  const sh = stats.shield;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">

      {/* ── Hero — Courtroom entrance ──────────────────── */}
      <section className="text-center mb-24">
        {/* Gavel */}
        <div className="text-6xl md:text-8xl mb-6 gavel-anim inline-block">⚖️</div>

        {/* Badge */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {live && <span className="w-2 h-2 rounded-full bg-[#14F195] pulse-live" />}
          <span className="stamp text-[#d4a056] text-xs">On-Chain Tribunal</span>
        </div>

        <h1 className="font-court text-5xl md:text-7xl font-black tracking-tight mb-4">
          <span className="text-[#e8dcc8]">The Court</span><br />
          <span className="text-gold glow-gold">never lies.</span>
        </h1>

        <p className="text-base md:text-lg text-[#e8dcc8]/35 max-w-xl mx-auto mb-10 leading-relaxed">
          Every rugger will be found. Every verdict is final.
          <br />On-chain evidence. No appeals.
        </p>

        {/* Gold separator */}
        <div className="gold-line max-w-sm mx-auto mb-10" />

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/scan"
            className="px-7 py-3 bg-[#14F195] text-[#0c0806] font-bold rounded-lg hover:bg-[#14F195]/90 transition-all text-sm tracking-wide"
          >
            🔍 Scan a Developer
          </Link>
          <Link
            href="/ranking"
            className="px-7 py-3 border-2 border-[#d4a056]/40 text-[#d4a056] font-bold rounded-lg hover:bg-[#d4a056]/10 transition-all text-sm tracking-wide"
          >
            📋 View the Docket
          </Link>
        </div>
      </section>

      {/* ── Court Records — Stats ──────────────────────── */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em]">Court Records</p>
          <div className="gold-line max-w-[100px] mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CourtStat value={fmt(vc.total_ruggers_tracked)} label="Convicted" icon="🚨" color="#FF4444" />
          <CourtStat value={fmt(vc.total_trusted_devs)} label="Acquitted" icon="✅" color="#14F195" />
          <CourtStat value={fmt(vc.total_verdicts_rendered)} label="Verdicts" icon="⚖️" color="#d4a056" />
          <CourtStat value={fmt(sh.scanners_active)} label="Agents on Duty" icon="🕵️" color="#8B5CF6" />
        </div>
      </section>

      {/* ── Eye-Agent — Case Files ──────────────────── */}
      <EyeAgentSection />

      {/* ── Court Divisions ──────────────────────────── */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em]">Divisions of the Court</p>
          <div className="gold-line max-w-[100px] mx-auto mt-2" />
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🏛️", title: "Developer Court",
              desc: "Every Solana deployer stands trial. Rugs tracked. Side wallets exposed. Trusted builders verified.",
              stamp: "JUSTICE", color: "#14F195", href: "/ranking",
            },
            {
              icon: "🛡️", title: "Shield Division",
              desc: "5 autonomous agents patrol the chain 24/7. Honeypots, whales, and KOL shills — nothing escapes.",
              stamp: "PROTECTION", color: "#8B5CF6", href: "/pricing",
            },
            {
              icon: "🧰", title: "Arsenal Room",
              desc: `${stats.tools.total} weapons in the Court's arsenal. Token scanning, wallet tracing, threat intelligence.`,
              stamp: "CLASSIFIED", color: "#d4a056", href: "/tools",
            },
          ].map((d) => (
            <Link key={d.title} href={d.href} className="wood-card p-6 group cursor-pointer relative overflow-hidden">
              <span className="text-4xl">{d.icon}</span>
              <h3 className="font-court text-xl font-bold mt-4 mb-2" style={{ color: d.color }}>{d.title}</h3>
              <p className="text-sm text-[#e8dcc8]/35 leading-relaxed mb-4">{d.desc}</p>

              {/* Stamp watermark */}
              <span
                className="absolute top-4 right-4 font-court text-[40px] font-black uppercase opacity-[0.04] leading-none pointer-events-none"
                style={{ transform: "rotate(-12deg)" }}
              >
                {d.stamp}
              </span>

              <span className="text-xs font-mono block group-hover:translate-x-1 transition-transform" style={{ color: d.color }}>
                Enter &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Evidence Room — More stats ─────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em]">Evidence Room</p>
          <div className="gold-line max-w-[100px] mx-auto mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CourtStat value={String(stats.tools.total)} label="Weapons" icon="⚔️" color="#d4a056" />
          <CourtStat value={fmt(stats.anti_spyware.pegasus_iocs)} label="Pegasus IOCs" icon="🦅" color="#FF4444" />
          <CourtStat value={fmt(stats.anti_spyware.scam_domains)} label="Scam Domains" icon="🕸️" color="#FF4444" />
          <CourtStat value={fmt(stats.community.kol_tracked)} label="KOLs Watched" icon="👁️" color="#8B5CF6" />
          <CourtStat value={fmt(sh.threats_detected)} label="Threats Found" icon="🎯" color="#FFB020" />
        </div>
      </section>

      {/* ── CTA — Shield ──────────────────────────────── */}
      <section className="text-center wood-card p-10 relative overflow-hidden">
        <span className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center font-court text-[120px] font-black" style={{ transform: "rotate(-8deg)" }}>
          PROTECTED
        </span>
        <span className="text-4xl block mb-4">🛡️</span>
        <h2 className="font-court text-2xl font-bold mb-3 text-[#e8dcc8]">Shield Premium</h2>
        <p className="text-[#e8dcc8]/30 text-sm mb-6 max-w-md mx-auto">
          The Court&apos;s personal protection for your wallet. Real-time alerts, honeypot detection, KOL tracking.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-7 py-3 bg-[#8B5CF6] text-white font-bold rounded-lg hover:bg-[#8B5CF6]/80 transition-all text-sm tracking-wide"
        >
          View Shield Plans
        </Link>
      </section>
    </div>
  );
}
