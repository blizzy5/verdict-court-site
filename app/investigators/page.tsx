"use client";

import { useEffect, useState } from "react";

const API = "https://thehat-production.up.railway.app";

interface Investigator {
  handle: string;
  platform: string;
  name: string;
  specialty: string;
  cases_contributed: number;
  accuracy: number;
  reputation_score: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

function scoreColor(s: number): string {
  if (s >= 90) return "#14F195";
  if (s >= 70) return "#d4a056";
  return "#FFB020";
}

export default function InvestigatorsPage() {
  const [investigators, setInvestigators] = useState<Investigator[]>([]);

  useEffect(() => {
    fetch(`${API}/api/v2/court/investigators`)
      .then(r => r.json())
      .then(d => setInvestigators(d.investigators ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="text-5xl block mb-4">🏛️</span>
        <h1 className="font-court text-4xl mb-2">
          <span className="text-gold">Hall of</span>{" "}
          <span className="text-[#e8dcc8]">Fame</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">The detectives who keep crypto honest.</p>
        <div className="gold-line mt-4 max-w-xs mx-auto" />
      </div>

      <div className="space-y-4">
        {investigators.map((inv, i) => {
          const sc = scoreColor(inv.reputation_score);
          const medal = i < 3 ? MEDALS[i] : `#${i + 1}`;
          const isVerdictCourt = inv.handle === "@verdict_Court";

          return (
            <div key={inv.handle} className={`wood-card p-6 ${isVerdictCourt ? "ring-1 ring-[#d4a056]/30" : ""}`}>
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="text-2xl w-10 text-center shrink-0">
                  {typeof medal === "string" && medal.startsWith("#")
                    ? <span className="font-mono text-lg text-[#e8dcc8]/20">{medal}</span>
                    : medal}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-court text-lg text-[#e8dcc8]">{inv.name}</h3>
                    {isVerdictCourt && (
                      <span className="verdict-badge bg-[#d4a056]/15 text-[#d4a056] text-[9px]">THIS COURT</span>
                    )}
                  </div>
                  <a
                    href={inv.platform === "youtube"
                      ? `https://youtube.com/${inv.handle.replace("@", "")}`
                      : `https://x.com/${inv.handle.replace("@", "")}`}
                    target="_blank"
                    rel="noopener"
                    className="text-[#8B5CF6] text-sm font-mono hover:underline"
                  >
                    {inv.handle}
                  </a>
                  <p className="text-xs text-[#e8dcc8]/30 mt-1">{inv.specialty}</p>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold font-mono" style={{ color: sc }}>{inv.reputation_score}</p>
                  <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider font-court">Score</p>
                </div>
              </div>

              {inv.cases_contributed > 0 && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-[#d4a056]/10 text-xs font-mono text-[#e8dcc8]/25">
                  <span>{inv.cases_contributed} cases</span>
                  {inv.accuracy > 0 && <span>{Math.round(inv.accuracy * 100)}% accuracy</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {investigators.length === 0 && (
        <div className="wood-card p-12 text-center">
          <p className="text-[#e8dcc8]/20 font-mono text-sm">Loading investigators...</p>
        </div>
      )}
    </div>
  );
}
