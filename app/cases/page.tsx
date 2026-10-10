"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://thehat-production.up.railway.app";

interface CourtCase {
  case_id: string;
  title: string;
  verdict?: string;
  severity?: string;
  total_stolen_usd?: number;
  victim_count?: number;
  deployer_address?: string;
  deployer_score?: number;
  side_wallets_count?: number;
  summary?: string;
  sources?: string[];
  created_at?: string;
  status?: string;
}

const VERDICT_COLORS: Record<string, string> = {
  GUILTY: "#FF4444",
  ACQUITTED: "#14F195",
  INSUFFICIENT_EVIDENCE: "#FFB020",
  OPEN: "#4488FF",
  PENDING: "#d4a056",
};

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function truncAddr(a: string): string {
  if (!a || a.length < 10) return a || "—";
  return `${a.slice(0, 4)}...${a.slice(-3)}`;
}

export default function CasesPage() {
  const [cases, setCases] = useState<CourtCase[]>([]);
  const [stats, setStats] = useState({ total_cases: 0, guilty: 0, acquitted: 0, total_stolen_usd: 0 });

  useEffect(() => {
    fetch(`${API}/api/v2/court/cases`).then(r => r.json()).then(d => setCases(d.cases ?? [])).catch(() => {});
    fetch(`${API}/api/v2/court/stats`).then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <span className="verdict-badge bg-[#FF4444]/20 text-[#FF4444] mb-4 inline-block">Case Files</span>
        <h1 className="text-4xl font-court mb-2">
          <span className="text-gold">Court</span>{" "}
          <span className="text-[#e8dcc8]">Docket</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">Every case investigated. Every verdict permanent.</p>
        <div className="gold-line mt-4" />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Cases", value: String(stats.total_cases), color: "#d4a056", icon: "📁" },
          { label: "Guilty", value: String(stats.guilty), color: "#FF4444", icon: "🔴" },
          { label: "Acquitted", value: String(stats.acquitted), color: "#14F195", icon: "✅" },
          { label: "Stolen", value: stats.total_stolen_usd > 0 ? fmt$(stats.total_stolen_usd) : "$0", color: "#FF4444", icon: "💰" },
        ].map(s => (
          <div key={s.label} className="wood-card p-4 text-center">
            <span className="text-lg">{s.icon}</span>
            <p className="text-2xl font-bold font-mono mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-widest font-court mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Case list */}
      {cases.length === 0 ? (
        <div className="wood-card p-12 text-center">
          <span className="text-4xl block mb-4">📂</span>
          <p className="text-[#e8dcc8]/30 font-court text-lg mb-2">The docket is empty.</p>
          <p className="text-[#e8dcc8]/20 text-sm">
            Cases will appear here as the Eye-Agent investigates. The Court is watching.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map(c => {
            const vc = VERDICT_COLORS[c.verdict ?? "OPEN"] || "#4488FF";
            return (
              <Link key={c.case_id} href={`/cases/${c.case_id}`} className="block">
                <div className="wood-card p-6 hover:border-[#d4a056]/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="verdict-badge text-xs" style={{ background: `${vc}20`, color: vc }}>
                          {c.verdict ?? "OPEN"}
                        </span>
                        {c.severity && (
                          <span className="text-xs font-mono text-[#e8dcc8]/30">{c.severity}</span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-[#d4a056]/60">{c.case_id}</p>
                    </div>
                    <span className="text-xs font-mono text-[#e8dcc8]/20">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <h3 className="font-court text-lg text-[#e8dcc8] mb-2">{c.title}</h3>

                  <div className="flex flex-wrap gap-4 text-xs font-mono text-[#e8dcc8]/35">
                    {(c.total_stolen_usd ?? 0) > 0 && (
                      <span className="text-[#FF4444]">{fmt$(c.total_stolen_usd!)} stolen</span>
                    )}
                    {(c.victim_count ?? 0) > 0 && <span>{c.victim_count} victims</span>}
                    {c.deployer_address && (
                      <span>Deployer: {truncAddr(c.deployer_address)} (Score {c.deployer_score ?? "?"})</span>
                    )}
                    {(c.side_wallets_count ?? 0) > 0 && <span>{c.side_wallets_count} side wallets</span>}
                  </div>

                  {c.sources && c.sources.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {c.sources.map(s => (
                        <span key={s} className="text-[10px] bg-[#d4a056]/10 text-[#d4a056] px-2 py-0.5 rounded font-mono">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
