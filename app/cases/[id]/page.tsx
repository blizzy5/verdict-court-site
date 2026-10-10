"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = "https://thehat-production.up.railway.app";

interface Evidence { type: string; source: string; confidence: number; description: string; }
interface Token { mint: string; symbol?: string; status: string; }
interface Wallet { address: string; role: string; label?: string; }
interface TimelineEvent { date: string; event: string; source?: string; }

interface CaseDetail {
  case_id: string;
  title: string;
  verdict?: string;
  severity?: string;
  total_stolen_usd?: number;
  victim_count?: number;
  deployer_address?: string;
  deployer_score?: number;
  summary?: string;
  evidence?: Evidence[];
  tokens?: Token[];
  wallets?: Wallet[];
  timeline?: TimelineEvent[];
  sources?: string[];
  created_at?: string;
  published_at?: string;
}

const VERDICT_COLORS: Record<string, string> = {
  GUILTY: "#FF4444", ACQUITTED: "#14F195", INSUFFICIENT_EVIDENCE: "#FFB020", OPEN: "#4488FF",
};

function truncAddr(a: string): string {
  if (!a || a.length < 10) return a || "—";
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

export default function CaseDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [c, setC] = useState<CaseDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/v2/court/cases/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setC)
      .catch(() => setError(true));
  }, [id]);

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <span className="text-4xl block mb-4">📂</span>
      <p className="text-[#e8dcc8]/30 font-court text-lg">Case not found.</p>
      <Link href="/cases" className="text-[#d4a056] text-sm font-mono mt-4 inline-block">← Back to docket</Link>
    </div>
  );

  if (!c) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-[#e8dcc8]/20 font-mono text-sm">Loading case file...</p>
    </div>
  );

  const vc = VERDICT_COLORS[c.verdict ?? "OPEN"] || "#4488FF";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/cases" className="text-[#d4a056] text-xs font-mono mb-6 inline-block hover:underline">← Back to docket</Link>

      {/* Header */}
      <div className="wood-card p-8 mb-6 relative">
        <span className="stamp absolute top-4 right-4" style={{ color: vc }}>{c.verdict ?? "OPEN"}</span>
        <p className="font-mono text-xs text-[#d4a056]/60 mb-2">{c.case_id}</p>
        <h1 className="font-court text-3xl text-[#e8dcc8] mb-3">{c.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm font-mono">
          {c.severity && <span className="text-[#FFB020]">{c.severity}</span>}
          {(c.total_stolen_usd ?? 0) > 0 && <span className="text-[#FF4444]">${c.total_stolen_usd!.toLocaleString()} stolen</span>}
          {(c.victim_count ?? 0) > 0 && <span className="text-[#e8dcc8]/40">{c.victim_count} victims</span>}
        </div>
      </div>

      {/* Summary */}
      {c.summary && (
        <div className="wood-card p-6 mb-6">
          <p className="font-court text-xs text-[#d4a056] uppercase tracking-wider mb-3">Summary</p>
          <div className="gold-line mb-4" />
          <p className="text-sm text-[#e8dcc8]/60 leading-relaxed">{c.summary}</p>
        </div>
      )}

      {/* Timeline */}
      {c.timeline && c.timeline.length > 0 && (
        <div className="wood-card p-6 mb-6">
          <p className="font-court text-xs text-[#d4a056] uppercase tracking-wider mb-3">Timeline</p>
          <div className="gold-line mb-4" />
          <div className="space-y-3">
            {c.timeline.map((t, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-[#d4a056] mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-mono text-[#d4a056]/60">{t.date}</p>
                  <p className="text-sm text-[#e8dcc8]/50">{t.event}</p>
                  {t.source && <p className="text-[10px] font-mono text-[#e8dcc8]/20">{t.source}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Evidence */}
      {c.evidence && c.evidence.length > 0 && (
        <div className="wood-card p-6 mb-6">
          <p className="font-court text-xs text-[#d4a056] uppercase tracking-wider mb-3">Evidence ({c.evidence.length})</p>
          <div className="gold-line mb-4" />
          <div className="space-y-3">
            {c.evidence.map((e, i) => (
              <div key={i} className="bg-[#0c0806]/40 rounded-lg p-3 border border-[#d4a056]/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-[#d4a056]">{e.type}</span>
                  <span className="text-[10px] font-mono text-[#e8dcc8]/20">{Math.round(e.confidence * 100)}% confidence</span>
                </div>
                <p className="text-sm text-[#e8dcc8]/50">{e.description}</p>
                <p className="text-[10px] font-mono text-[#e8dcc8]/20 mt-1">Source: {e.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tokens */}
        {c.tokens && c.tokens.length > 0 && (
          <div className="wood-card p-6">
            <p className="font-court text-xs text-[#d4a056] uppercase tracking-wider mb-3">Tokens Involved</p>
            <div className="gold-line mb-4" />
            {c.tokens.map((t, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#d4a056]/5 last:border-0">
                <span className="font-mono text-xs text-[#e8dcc8]/50">{t.symbol || truncAddr(t.mint)}</span>
                <span className="text-xs font-mono" style={{
                  color: t.status === "RUGGED" ? "#FF4444" : t.status === "HONEYPOT" ? "#FFB020" : "#14F195"
                }}>{t.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wallets */}
        {c.wallets && c.wallets.length > 0 && (
          <div className="wood-card p-6">
            <p className="font-court text-xs text-[#d4a056] uppercase tracking-wider mb-3">Wallets</p>
            <div className="gold-line mb-4" />
            {c.wallets.map((w, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-[#d4a056]/5 last:border-0">
                <span className="font-mono text-xs text-[#e8dcc8]/50">{truncAddr(w.address)}</span>
                <span className="text-[10px] font-mono text-[#d4a056]/60">{w.role} {w.label ? `(${w.label})` : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources */}
      {c.sources && c.sources.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {c.sources.map(s => (
            <span key={s} className="bg-[#d4a056]/10 text-[#d4a056] px-3 py-1 rounded-lg text-xs font-mono">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
