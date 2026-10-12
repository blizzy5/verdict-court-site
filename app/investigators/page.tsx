"use client";

import { useEffect, useState } from "react";

const API = "https://thehat-production.up.railway.app";

interface Investigator {
  handle: string;
  platform: string;
  name: string;
  specialty: string;
  cases_contributed: number;
  cases_in_progress?: number;
  cases_waiting?: number;
  cases_published?: number;
  progress_label?: string;
}

// Sources listed only for the case files they brought carry an internal label: show a public one.
function specialty(text: string): string {
  return text.startsWith("Source de dossiers") ? "Case-file source" : text;
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
        <p className="text-[#e8dcc8]/40 text-sm">The detectives who keep crypto honest, ranked by the case files they brought.</p>
        <div className="gold-line mt-4 max-w-xs mx-auto" />
      </div>

      <div className="space-y-4">
        {investigators.map((inv, i) => {
          const isVerdictCourt = inv.handle === "@verdict_Court";

          return (
            <div key={inv.handle} className={`wood-card p-6 ${isVerdictCourt ? "ring-1 ring-[#d4a056]/30" : ""}`}>
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="w-10 text-center shrink-0">
                  <span className="font-mono text-lg text-[#e8dcc8]/20">#{i + 1}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-court text-lg text-[#e8dcc8]">{inv.name}</h3>
                    {isVerdictCourt && (
                      <span className="verdict-badge bg-[#d4a056]/15 text-[#d4a056] text-[9px]">THIS COURT</span>
                    )}
                  </div>
                  {inv.handle.startsWith("@") && (
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
                  )}
                  <p className="text-xs text-[#e8dcc8]/30 mt-1">{specialty(inv.specialty)}</p>
                </div>

                {/* Progress, counted in case files */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold font-mono text-[#d4a056]">{inv.progress_label ?? "—"}</p>
                  <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider font-court">Cases closed</p>
                </div>
              </div>

              {inv.cases_contributed > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 border-t border-[#d4a056]/10 text-xs font-mono text-[#e8dcc8]/25">
                  <span>{inv.cases_in_progress ?? 0} in progress</span>
                  <span>{inv.cases_waiting ?? 0} waiting</span>
                  {(inv.cases_published ?? 0) > 0 && <span>{inv.cases_published} published</span>}
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
