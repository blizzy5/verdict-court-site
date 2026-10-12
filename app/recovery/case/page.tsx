"use client";

import { Suspense, useEffect, useState, useTransition, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { API, NOT_A_COURT } from "../services";

// Only these fields are ever kept or rendered, and status goes through fixed labels:
// a case file never shows free text, so it can never show who is behind an address.
interface CaseFile {
  case_id: string;
  status: string;
  chain?: string;
  amount_usd?: number;
  created_at?: string;
  updated_at?: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Received", color: "#4488FF" },
  REVIEW: { label: "Under review", color: "#4488FF" },
  TRACING: { label: "Tracing", color: "#d4a056" },
  REPORT_READY: { label: "Report ready", color: "#14F195" },
  CLOSED: { label: "Closed", color: "#e8dcc8" },
};
const IN_PROGRESS = { label: "In progress", color: "#4488FF" };

function pick(d: Record<string, unknown>): CaseFile {
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    case_id: String(d.case_id),
    status: (str(d.status) ?? "").toUpperCase(),
    chain: str(d.chain),
    amount_usd: typeof d.amount_usd === "number" ? d.amount_usd : undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

interface Result {
  key: string;
  state: "found" | "missing" | "error";
  file?: CaseFile;
}

function fmtDate(d?: string): string {
  if (!d) return "—";
  const t = new Date(d);
  return isNaN(t.getTime()) ? "—" : t.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function CaseStatusPage() {
  return (
    <Suspense fallback={null}>
      <CaseStatus />
    </Suspense>
  );
}

function CaseStatus() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id")?.trim() ?? "";
  const justOpened = params.get("new") === "1";
  const [navigating, startNavigation] = useTransition();
  const [input, setInput] = useState(id);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = `${id}#${attempt}`;

  // The case shown is the one in the URL; a result only counts for the lookup that asked for it.
  useEffect(() => {
    if (!id) return;
    let stale = false;
    fetch(`${API}/api/v2/services/case/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(20000) })
      .then(async (res): Promise<Omit<Result, "key">> => {
        if (res.status === 404) return { state: "missing" };
        const data = res.ok ? await res.json() : null;
        return data?.case_id ? { state: "found", file: pick(data) } : { state: "error" };
      })
      .catch((): Omit<Result, "key"> => ({ state: "error" }))
      .then((r) => { if (!stale) setResult({ key, ...r }); });
    return () => { stale = true; };
  }, [id, key]);

  const current = !navigating && result?.key === key ? result : null;
  const loading = navigating || (id !== "" && !current);
  const file = current?.file;
  const st = (file && STATUS[file.status]) || IN_PROGRESS;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = input.trim();
    if (!next) return;
    if (next === id) setAttempt((a) => a + 1);
    else startNavigation(() => router.replace(`/recovery/case?id=${encodeURIComponent(next)}`));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-4xl block mb-4">📁</span>
        <h1 className="font-court text-4xl mb-2">
          <span className="text-gold">Case</span>{" "}
          <span className="text-[#e8dcc8]">status</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">Enter the case number you received when you reported the theft.</p>
        <div className="gold-line mt-4 max-w-xs mx-auto" />
      </div>

      {justOpened && id && (
        <div role="status" className="wood-card p-6 text-center mb-6">
          <span className="stamp text-[#14F195] text-sm">Case opened</span>
          <p className="font-mono text-lg text-[#d4a056] break-all mt-5 mb-3">{id}</p>
          <p className="text-xs text-[#e8dcc8]/60 leading-relaxed">
            Write this number down: it is the only way to check your case, and anyone who has it can see this page.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} className="wood-card p-6 flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Case number"
          aria-label="Case number"
          className="flex-1 min-w-0 bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm font-mono text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm disabled:opacity-50"
        >
          {loading ? "Searching..." : "Check"}
        </button>
      </form>

      {current?.state === "missing" && (
        <div role="alert" className="wood-card p-8 text-center">
          <p className="text-[#e8dcc8]/60 font-court text-lg mb-2">No case with this number.</p>
          <p className="text-xs text-[#e8dcc8]/30">
            Check the number, or <Link href="/recovery/report" className="text-[#d4a056] hover:underline">report a theft</Link>.
          </p>
        </div>
      )}

      {current?.state === "error" && (
        <div role="alert" className="p-4 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-xl text-center">
          <p className="text-[#FF4444] text-sm font-court">The case file could not be loaded. Try again in a moment.</p>
        </div>
      )}

      {file && (
        <div className="wood-card p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="min-w-0">
              <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-widest font-court mb-1">Case number</p>
              <p className="font-mono text-sm text-[#d4a056] break-all">{file.case_id}</p>
            </div>
            <span className="verdict-badge shrink-0" style={{ background: `${st.color}20`, color: st.color }}>{st.label}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Chain", value: file.chain ?? "—" },
              { label: "Reported loss", value: file.amount_usd ? `$${file.amount_usd.toLocaleString()}` : "—" },
              { label: "Opened", value: fmtDate(file.created_at) },
              { label: "Last update", value: fmtDate(file.updated_at) },
            ].map((f) => (
              <div key={f.label} className="bg-[#0c0806]/40 rounded-lg p-3 text-center">
                <p className="font-mono text-sm text-[#e8dcc8]/80 break-words">{f.value}</p>
                <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider mt-1">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-[#e8dcc8]/60 mt-8 leading-relaxed">{NOT_A_COURT}</p>
    </div>
  );
}
