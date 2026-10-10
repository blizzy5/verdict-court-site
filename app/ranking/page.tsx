"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Dev {
  address: string;
  alias?: string;
  score: number;
  verdict: string;
  rugged_tokens?: number;
  successful_tokens?: number;
  total_tokens?: number;
}

const VERDICT_COLORS: Record<string, string> = {
  TRUSTED: "#14F195",
  NEUTRAL: "#4488FF",
  SUSPECT: "#FFB020",
  SERIAL_RUGGER: "#FF4444",
};

function truncAddr(a: string): string {
  if (!a || a.length < 12) return a || "—";
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

export default function RankingPage() {
  const [trusted, setTrusted] = useState<Dev[]>([]);
  const [ruggers, setRuggers] = useState<Dev[]>([]);
  const [tab, setTab] = useState<"trusted" | "ruggers">("trusted");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const API = "https://thehat-production.up.railway.app";
    Promise.all([
      fetch(`${API}/api/v2/solana/dev/ranking?sort=score&order=desc&limit=25`)
        .then((r) => r.json()).then((d) => setTrusted(d.developers || [])).catch(() => {}),
      fetch(`${API}/api/v2/solana/dev/ranking?sort=score&order=asc&limit=25`)
        .then((r) => r.json()).then((d) => setRuggers(d.developers || [])).catch(() => {}),
    ]).finally(() => setLoaded(true));
  }, []);

  const list = tab === "trusted" ? trusted : ruggers;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-court mb-2">
        <span className="text-gold">Developer</span> Rankings
      </h1>
      <p className="text-[#e8dcc8]/40 text-sm mb-3">Scored by on-chain history. No appeals.</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {["Ethereum", "BSC", "Arbitrum", "Polygon", "Avalanche", "Base", "Optimism", "Robinhood", "Solana", "SUI"].map(c => (
          <span key={c} className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#d4a056]/8 text-[#d4a056]/50 border border-[#d4a056]/10">
            {c}
          </span>
        ))}
      </div>
      <div className="gold-line mb-8" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("trusted")}
          className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
            tab === "trusted" ? "bg-[#14F195]/15 text-[#14F195]" : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60"
          }`}
        >
          ✅ Trusted Devs
        </button>
        <button
          onClick={() => setTab("ruggers")}
          className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
            tab === "ruggers" ? "bg-[#FF4444]/15 text-[#FF4444]" : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60"
          }`}
        >
          🚩 Serial Ruggers
        </button>
      </div>

      {/* Table */}
      <div className="wood-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#d4a056]/20 text-[#d4a056] text-xs uppercase tracking-widest font-court">
              <th className="text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">Developer</th>
              <th className="text-left py-3 px-4">Verdict</th>
              <th className="text-right py-3 px-4">Score</th>
              <th className="text-right py-3 px-4">{tab === "trusted" ? "Tokens" : "Rugs"}</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  {!loaded ? (
                    <span className="text-[#e8dcc8]/20 font-mono text-xs">Loading...</span>
                  ) : (
                    <div>
                      <span className="text-2xl block mb-3">🔍</span>
                      <p className="text-[#d4a056]/60 font-court text-sm mb-1">
                        The Eye-Agent scanners patrol 24/7.
                      </p>
                      <p className="text-[#e8dcc8]/20 font-mono text-xs">
                        First verdicts will appear here automatically.
                      </p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              list.map((dev, i) => (
                <tr key={dev.address} className="border-b border-[#d4a056]/10 hover:bg-[#d4a056]/[0.04] transition-colors">
                  <td className="py-3 px-4 text-[#e8dcc8]/20 font-mono">{i + 1}</td>
                  <td className="py-3 px-4">
                    <Link href={`/scan?address=${dev.address}`} className="hover:text-[#d4a056] transition-colors">
                      <span className="font-mono text-xs">{truncAddr(dev.address)}</span>
                      {dev.alias && (
                        <span className="ml-2 text-[#e8dcc8]/50 text-xs">({dev.alias})</span>
                      )}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="verdict-badge"
                      style={{
                        background: `${VERDICT_COLORS[dev.verdict] || "#4488FF"}15`,
                        color: VERDICT_COLORS[dev.verdict] || "#4488FF",
                      }}
                    >
                      {dev.verdict}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold" style={{ color: VERDICT_COLORS[dev.verdict] || "#4488FF" }}>
                    {dev.score}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#e8dcc8]/50">
                    {tab === "trusted" ? dev.total_tokens ?? dev.successful_tokens ?? "—" : dev.rugged_tokens ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
