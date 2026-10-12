"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { Checkout, Plan } from "./Checkout";
import { TIERS } from "./tiers";

const API = "https://thehat-production.up.railway.app";

interface PlansData {
  plans: Record<string, Plan>;
  tokens?: Record<string, string>;
  pay_to?: string;
}

interface Access {
  has_access: boolean;
  plan: string | null;
  expires_at: string | null;
  days_remaining: number;
}

const TIER_NAMES: Record<string, string> = Object.fromEntries(TIERS.map((t) => [t.key, t.name]));

const PER_REPORT = [
  { icon: "🔍", name: "Investigation report", from: "Investigator" },
  { icon: "🧪", name: "Token due diligence", from: "Analyst" },
  { icon: "📜", name: "Smart contract audit", from: "Investigator" },
  { icon: "🏛️", name: "Forensic AML report", from: "Protocol" },
];

function StatusCheck() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<Access | null>(null);
  const [failed, setFailed] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!wallet.trim()) return;
    setLoading(true);
    setAccess(null);
    setFailed(false);
    try {
      const res = await fetch(`${API}/api/v2/shield/status`, {
        headers: { "X-Wallet-Address": wallet.trim() },
        signal: AbortSignal.timeout(20000),
      });
      const data = res.ok ? await res.json() : null;
      if (typeof data?.has_access === "boolean") setAccess(data);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl mx-auto mt-16">
      <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] text-center mb-6">Already have a plan?</p>
      <form onSubmit={onSubmit} className="wood-card p-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Your Solana address"
          aria-label="Wallet address"
          className="flex-1 min-w-0 bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm font-mono text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 border border-[#d4a056]/20 text-[#d4a056]/70 font-bold font-court rounded-xl hover:border-[#d4a056]/40 hover:text-[#d4a056] transition-all text-sm disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check my plan"}
        </button>
      </form>
      {access && (
        <p role="status" className="text-center text-sm mt-4 text-[#e8dcc8]/60">
          {access.has_access ? (
            <>
              <span className="text-[#14F195] font-bold">Active</span> — {TIER_NAMES[access.plan ?? ""] ?? access.plan} plan,{" "}
              {access.days_remaining} day{access.days_remaining === 1 ? "" : "s"} remaining.
            </>
          ) : (
            "No active plan on this wallet."
          )}
        </p>
      )}
      {failed && (
        <p role="alert" className="text-center text-sm mt-4 text-[#FF4444]">
          The status could not be checked. Try again in a moment.
        </p>
      )}
    </section>
  );
}

export default function PricingPage() {
  const [data, setData] = useState<PlansData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API}/api/v2/shield/plans`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  function choose(key: string) {
    setSelected(key);
    requestAnimationFrame(() => checkoutRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const tier = TIERS.find((t) => t.key === selected);
  const apiPlan = selected ? data?.plans?.[selected] : undefined;
  // A tier can be bought only when the API sells that exact plan at that exact price.
  const purchasable = !!tier && !!apiPlan && apiPlan.price_usdc === tier.price;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="verdict-badge bg-[#8B5CF6]/20 text-[#8B5CF6] mb-4 inline-block">Pricing</span>
        <h1 className="text-4xl font-court mb-3">
          <span className="text-[#e8dcc8]">One plan.</span>{" "}
          <span className="text-gold glow-gold">Everywhere.</span>
        </h1>
        <p className="text-[#e8dcc8]/40 max-w-lg mx-auto text-sm">
          One price list for Verdict Court and the Shield app. Recovery of stolen funds is separate: nothing to pay
          unless funds come back.
        </p>
        <div className="gold-line mt-6 max-w-xs mx-auto" />
      </div>

      {/* 1 — plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {TIERS.map((t) => {
          const isSelected = t.key === selected;
          return (
            <div key={t.key} className={`wood-card p-5 flex flex-col ${isSelected ? "ring-2 ring-[#d4a056]" : ""}`}>
              <div className="text-center mb-4">
                <span className="text-3xl">{t.icon}</span>
                <h3 className="text-lg font-court text-gold mt-3">{t.name}</h3>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold font-mono text-[#d4a056]">${t.price}</p>
                <p className="text-xs text-[#e8dcc8]/30 mt-1">{t.price === 0 ? "forever" : "per month"}</p>
              </div>
              <p className="text-xs text-[#e8dcc8]/60 text-center mb-4">{t.pitch}</p>
              <ul className="space-y-2 text-xs text-[#e8dcc8]/40 mb-6">
                {t.includes.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#d4a056]">✓</span> {f}
                  </li>
                ))}
              </ul>
              {t.price === 0 ? (
                <Link
                  href="/scan"
                  className="mt-auto block text-center w-full py-2.5 rounded-xl text-sm font-bold font-court transition-all border border-[#d4a056]/20 text-[#d4a056]/60 hover:border-[#d4a056]/40 hover:text-[#d4a056]"
                >
                  Start scanning
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => choose(t.key)}
                  className="mt-auto w-full py-2.5 rounded-xl text-sm font-bold font-court transition-all border border-[#d4a056]/20 text-[#d4a056]/60 hover:border-[#d4a056]/40 hover:text-[#d4a056]"
                >
                  Choose {t.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div ref={checkoutRef} className="max-w-2xl mx-auto mt-10 scroll-mt-20">
        {tier && purchasable && apiPlan && (
          <Checkout
            key={tier.key}
            planKey={tier.key}
            planLabel={tier.name}
            plan={apiPlan}
            payTo={data?.pay_to ?? ""}
            mints={data?.tokens ?? {}}
          />
        )}
        {tier && !purchasable && (
          <div role="status" className="wood-card p-6 sm:p-8 text-center">
            <p className="font-court text-lg text-[#e8dcc8] mb-2">{tier.name} is not open for purchase yet.</p>
            <p className="text-sm text-[#e8dcc8]/50">
              Do not send funds to any address claiming to be ours.
            </p>
          </div>
        )}
      </div>

      {/* 2 — per report */}
      <section className="mt-16">
        <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] text-center mb-2">Or per report</p>
        <p className="text-center text-xs text-[#e8dcc8]/40 mb-6">No plan needed. Each report is quoted before any work starts.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PER_REPORT.map((r) => (
            <div key={r.name} className="wood-card p-5 text-center">
              <span className="text-2xl block mb-2">{r.icon}</span>
              <h3 className="font-court text-base text-[#e8dcc8] mb-1">{r.name}</h3>
              <p className="text-[10px] font-mono text-[#d4a056]/60 uppercase tracking-wider">Included from {r.from}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3 — recovery */}
      <section className="mt-16 max-w-3xl mx-auto">
        <div className="wood-card p-6 sm:p-8 text-center">
          <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] mb-4">Fund recovery</p>
          <p className="text-4xl font-bold font-mono text-[#d4a056] mb-2">10%</p>
          <p className="text-sm text-[#e8dcc8]/60 max-w-md mx-auto mb-6">
            Of the funds actually returned to you. Nothing if none are. Opening a case is free, with or without a plan.
            Recovery is never guaranteed.
          </p>
          <Link
            href="/recovery/report"
            className="inline-block px-6 py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm"
          >
            Report a theft
          </Link>
        </div>
      </section>

      <StatusCheck />

      <p className="text-center text-xs text-[#e8dcc8]/20 mt-8 font-mono">
        Payments are verified on-chain on Solana before a plan is activated.
      </p>
    </div>
  );
}
