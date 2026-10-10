"use client";

import { useState, useEffect, FormEvent } from "react";

interface DevProfile {
  address: string;
  alias?: string;
  score: number;
  verdict: string;
  rugged_tokens?: number;
  successful_tokens?: number;
  total_tokens?: number;
  side_wallets?: string[];
  first_seen?: string;
  last_activity?: string;
  risk_factors?: string[];
}

interface KOL {
  name: string;
  platform: string;
  handle: string;
  wallet: string;
  shill_count: number;
  rug_count: number;
  legit_count: number;
  trust_score: number;
}

type ScanMode = "dev" | "token" | "kol" | "wallet";

const VERDICT_COLORS: Record<string, string> = {
  TRUSTED: "#14F195", SAFE: "#14F195",
  NEUTRAL: "#4488FF",
  SUSPECT: "#FFB020", CAUTION: "#FFB020",
  SERIAL_RUGGER: "#FF4444", DANGER: "#FF4444", SCAM: "#FF4444",
};

const MODE_INFO: Record<ScanMode, { icon: string; label: string; placeholder: string; color: string }> = {
  dev:    { icon: "👤", label: "Developer",  placeholder: "Solana deployer address or alias...",   color: "#14F195" },
  token:  { icon: "🪙", label: "Token",      placeholder: "Token mint address...",                 color: "#FFB020" },
  kol:    { icon: "📢", label: "KOL / CT",   placeholder: "@username (Twitter/X or Telegram)...",  color: "#8B5CF6" },
  wallet: { icon: "💼", label: "Wallet",     placeholder: "Any Solana wallet address...",          color: "#4488FF" },
};

function truncAddr(a: string): string {
  if (!a || a.length < 12) return a || "—";
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

function trustColor(score: number): string {
  if (score >= 70) return "#14F195";
  if (score >= 40) return "#FFB020";
  return "#FF4444";
}

function trustLabel(score: number): string {
  if (score >= 70) return "RELIABLE";
  if (score >= 40) return "MID";
  return "SHILL";
}

export default function ScanPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ScanMode>("dev");
  const [dev, setDev] = useState<DevProfile | null>(null);
  const [kol, setKol] = useState<KOL | null>(null);
  const [kolList, setKolList] = useState<KOL[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addr = params.get("address");
    if (addr) { setQuery(addr); doLookup(addr, "dev"); }
    // Preload KOL leaderboard for search
    fetch("https://thehat-production.up.railway.app/api/v2/solana/kol/leaderboard").then(r => r.json()).then(d => setKolList(d.leaderboard || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doLookup(q: string, m: ScanMode) {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setDev(null);
    setKol(null);

    const clean = q.trim().replace(/^@/, "");

    try {
      if (m === "kol") {
        // Search KOL by handle/name in preloaded list
        const match = kolList.find(k =>
          k.handle?.toLowerCase() === clean.toLowerCase() ||
          k.name?.toLowerCase() === clean.toLowerCase() ||
          k.handle?.toLowerCase().includes(clean.toLowerCase()) ||
          k.name?.toLowerCase().includes(clean.toLowerCase())
        );
        if (match) {
          setKol(match);
        } else {
          setError(`KOL "@${clean}" not found in our database of ${kolList.length} tracked influencers.`);
        }
        setLoading(false);
        return;
      }

      if (m === "token") {
        setError("Token scanning via web coming soon. Use the Shield mobile app for real-time token scans.");
        setLoading(false);
        return;
      }

      // Dev or Wallet — both use dev profile lookup (direct public API)
      const API = "https://thehat-production.up.railway.app";
      const isAddr = clean.length >= 32;
      const url = isAddr
        ? `${API}/api/v2/solana/dev/profile?address=${encodeURIComponent(clean)}`
        : `${API}/api/v2/solana/dev/search?q=${encodeURIComponent(clean)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.error) {
        setError(data.error === "API unavailable" ? "API temporarily unavailable. Try again." : "Not found in our database.");
      } else if (data.developers) {
        if (data.developers.length > 0) setDev(data.developers[0]);
        else setError("No results found.");
      } else if (data.address) {
        setDev(data);
      } else {
        setError("Not found in our database.");
      }
    } catch {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    doLookup(query, mode);
  }

  const vc = dev?.verdict || "";
  const color = VERDICT_COLORS[vc] || "#4488FF";
  const mi = MODE_INFO[mode];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-court mb-2">
        <span className="text-gold">Scan</span>{" "}
        <span className="text-[#e8dcc8]">anything.</span>
      </h1>
      <p className="text-[#e8dcc8]/40 text-sm mb-2">
        Developer, token, KOL, or wallet. The Court will render its verdict.
      </p>
      <div className="gold-line mb-6" />

      {/* Mode toggle — 4 modes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.keys(MODE_INFO) as ScanMode[]).map((m) => {
          const info = MODE_INFO[m];
          const active = mode === m;
          return (
            <button
              key={m}
              onClick={() => { setMode(m); setDev(null); setKol(null); setError(""); }}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
                active
                  ? `bg-[${info.color}]/15 text-[${info.color}]`
                  : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60"
              }`}
              style={active ? { background: `${info.color}15`, color: info.color } : {}}
            >
              {info.icon} {info.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <form onSubmit={onSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={mi.placeholder}
          className="flex-1 bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm font-mono text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm disabled:opacity-50"
        >
          {loading ? "..." : "Scan"}
        </button>
      </form>

      {error && (
        <div className="wood-card p-6 text-center mb-8">
          <p className="text-[#e8dcc8]/40 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* ── KOL Result ──────────────────────────── */}
      {kol && (
        <div className="wood-card p-8 relative">
          <span className="stamp absolute top-4 right-4" style={{ color: trustColor(kol.trust_score) }}>
            {trustLabel(kol.trust_score)}
          </span>

          <div className="mb-6">
            <p className="font-court text-xs text-[#d4a056] mb-1 uppercase tracking-wider">KOL Profile</p>
            <p className="text-xl font-bold text-[#e8dcc8]">{kol.name}</p>
            {kol.handle && (
              <a
                href={`https://x.com/${kol.handle}`}
                target="_blank"
                rel="noopener"
                className="text-[#8B5CF6] text-sm font-mono hover:underline"
              >
                @{kol.handle}
              </a>
            )}
            <span className="ml-3 text-xs text-[#e8dcc8]/30 font-mono">{kol.platform}</span>
          </div>

          <div className="gold-line mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono" style={{ color: trustColor(kol.trust_score) }}>{kol.trust_score}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Trust Score</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#14F195]">{kol.legit_count}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Legit Calls</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#FF4444]">{kol.rug_count}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Rug Calls</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#FFB020]">{kol.shill_count}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Total Shills</p>
            </div>
          </div>

          {kol.wallet && (
            <>
              <p className="text-xs text-[#d4a056] uppercase tracking-wider mb-2 font-court">Known Wallet</p>
              <p className="font-mono text-xs text-[#e8dcc8]/50 break-all mb-4">{kol.wallet}</p>
            </>
          )}

          <div className="gold-line mb-4" />
          <p className="text-xs text-[#e8dcc8]/20 font-mono">
            Accuracy: {kol.legit_count + kol.rug_count > 0
              ? `${Math.round((kol.legit_count / (kol.legit_count + kol.rug_count)) * 100)}%`
              : "N/A"
            } — {kol.legit_count + kol.rug_count} tracked calls
          </p>
        </div>
      )}

      {/* ── Dev / Wallet Result ─────────────────── */}
      {dev && (
        <div className="wood-card p-8 relative">
          <span className="stamp absolute top-4 right-4" style={{ color }}>{vc || "JUDGED"}</span>

          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="font-court text-xs text-[#d4a056] mb-1 uppercase tracking-wider">
                {mode === "wallet" ? "Wallet Profile" : "Developer Profile"}
              </p>
              <p className="font-mono text-sm text-[#e8dcc8]/70 break-all">{dev.address}</p>
              {dev.alias && <p className="text-[#e8dcc8]/50 text-sm mt-1">Alias: {dev.alias}</p>}
            </div>
            <span
              className="verdict-badge text-sm shrink-0"
              style={{ background: `${color}20`, color, fontSize: "13px", padding: "6px 16px" }}
            >
              {vc}
            </span>
          </div>

          <div className="gold-line mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono" style={{ color }}>{dev.score}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Score</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#14F195]">{dev.successful_tokens ?? "—"}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Clean</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#FF4444]">{dev.rugged_tokens ?? 0}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Rugs</p>
            </div>
            <div className="bg-[#0c0806]/60 border border-[#d4a056]/10 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold font-mono text-[#e8dcc8]/60">{dev.total_tokens ?? "—"}</p>
              <p className="text-xs text-[#d4a056]/50 mt-1 uppercase tracking-wider font-court">Total</p>
            </div>
          </div>

          {dev.side_wallets && dev.side_wallets.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-[#d4a056] uppercase tracking-wider mb-2 font-court">Known Side Wallets</p>
              <div className="flex flex-wrap gap-2">
                {dev.side_wallets.map((w) => (
                  <span key={w} className="bg-[#FF4444]/10 text-[#FF4444] px-3 py-1 rounded-lg font-mono text-xs">
                    {truncAddr(w)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {dev.risk_factors && dev.risk_factors.length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-[#d4a056] uppercase tracking-wider mb-2 font-court">Risk Factors</p>
              <div className="flex flex-wrap gap-2">
                {dev.risk_factors.map((r) => (
                  <span key={r} className="bg-[#FFB020]/10 text-[#FFB020] px-3 py-1 rounded-lg text-xs">{r}</span>
                ))}
              </div>
            </div>
          )}

          <div className="gold-line mb-4" />
          <div className="flex gap-6 text-xs text-[#e8dcc8]/20 font-mono">
            {dev.first_seen && <span>First seen: {dev.first_seen}</span>}
            {dev.last_activity && <span>Last active: {dev.last_activity}</span>}
          </div>
        </div>
      )}

      {/* ── Empty state ────────────────────────── */}
      {!dev && !kol && !error && !loading && (
        <div className="wood-card p-8 text-center">
          <p className="text-[#e8dcc8]/20 text-sm mb-4 font-court">The Court awaits your query.</p>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
            <div className="bg-[#0c0806]/40 rounded-lg p-3 text-left">
              <p className="text-[#14F195] font-bold mb-1">👤 Developer</p>
              <p className="text-[#e8dcc8]/25">Solana deployer address → rug history, side wallets, verdict</p>
            </div>
            <div className="bg-[#0c0806]/40 rounded-lg p-3 text-left">
              <p className="text-[#FFB020] font-bold mb-1">🪙 Token</p>
              <p className="text-[#e8dcc8]/25">Mint address → honeypot check, rug risk, contract scan</p>
            </div>
            <div className="bg-[#0c0806]/40 rounded-lg p-3 text-left">
              <p className="text-[#8B5CF6] font-bold mb-1">📢 KOL / CT</p>
              <p className="text-[#e8dcc8]/25">@username → trust score, shill history, rug call rate</p>
            </div>
            <div className="bg-[#0c0806]/40 rounded-lg p-3 text-left">
              <p className="text-[#4488FF] font-bold mb-1">💼 Wallet</p>
              <p className="text-[#e8dcc8]/25">Any wallet → linked deployers, risk exposure, verdict</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
