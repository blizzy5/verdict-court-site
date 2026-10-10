"use client";

import { useEffect, useState } from "react";

interface Plan {
  price_usdc: number;
  price_sol: number;
  price_skr: number;
  paid_days: number;
  bonus_days: number;
  total_days: number;
}

interface PlansData {
  plans: Record<string, Plan>;
}

const PLAN_ORDER = ["daily", "weekly", "biweekly", "monthly"];
const PLAN_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-Weekly",
  monthly: "Monthly",
};
const PLAN_ICONS: Record<string, string> = {
  daily: "⚡",
  weekly: "🛡️",
  biweekly: "🔥",
  monthly: "👑",
};

export default function PricingPage() {
  const [data, setData] = useState<PlansData | null>(null);

  useEffect(() => {
    fetch("https://thehat-production.up.railway.app/api/v2/shield/plans")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="verdict-badge bg-[#8B5CF6]/20 text-[#8B5CF6] mb-4 inline-block">Shield Premium</span>
        <h1 className="text-4xl font-court mb-3">
          <span className="text-[#e8dcc8]">Protect your</span>{" "}
          <span className="text-gold glow-gold">wallet.</span>
        </h1>
        <p className="text-[#e8dcc8]/40 max-w-md mx-auto text-sm">
          5 autonomous scanners. Real-time alerts. Honeypot detection. Pay in USDC, SOL, or $SKR.
        </p>
        <div className="gold-line mt-6 max-w-xs mx-auto" />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {PLAN_ORDER.map((key) => {
          const plan = data?.plans?.[key];
          const isPopular = key === "monthly";
          return (
            <div
              key={key}
              className={`wood-card p-6 relative ${isPopular ? "ring-2 ring-[#d4a056]/40" : ""}`}
            >
              {isPopular && (
                <span className="stamp absolute -top-3 left-1/2 -translate-x-1/2 text-xs">
                  Best Value
                </span>
              )}
              <div className="text-center mb-6">
                <span className="text-3xl">{PLAN_ICONS[key]}</span>
                <h3 className="text-lg font-court text-gold mt-3">{PLAN_LABELS[key]}</h3>
              </div>

              {plan ? (
                <>
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold font-mono text-[#d4a056]">${plan.price_usdc}</p>
                    <p className="text-xs text-[#e8dcc8]/30 mt-1">USDC</p>
                  </div>

                  <div className="space-y-2 text-xs text-[#e8dcc8]/40 mb-6">
                    <div className="flex justify-between">
                      <span>SOL</span>
                      <span className="font-mono text-[#e8dcc8]/60">{plan.price_sol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>$SKR</span>
                      <span className="font-mono text-[#e8dcc8]/60">{plan.price_skr.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#d4a056]/10 pt-2 mt-2">
                      <span>Duration</span>
                      <span className="font-mono text-[#e8dcc8]/60">{plan.total_days}d</span>
                    </div>
                    {plan.bonus_days > 0 && (
                      <div className="flex justify-between">
                        <span>Bonus</span>
                        <span className="font-mono text-[#d4a056]">+{plan.bonus_days}d free</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <span className="text-[#e8dcc8]/20 font-mono text-xs">Loading...</span>
                </div>
              )}

              <ul className="space-y-2 text-xs text-[#e8dcc8]/40 mb-6">
                {["Real-time scanner alerts", "Honeypot detection", "Whale monitoring", "KOL shill tracking", "Dev court access"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-[#d4a056]">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-2.5 rounded-xl text-sm font-bold font-court transition-all ${
                isPopular
                  ? "bg-[#d4a056] text-[#0c0806] hover:bg-[#d4a056]/90"
                  : "border border-[#d4a056]/20 text-[#d4a056]/60 hover:border-[#d4a056]/40 hover:text-[#d4a056]"
              }`}>
                Get Shield
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-[#e8dcc8]/20 mt-8 font-mono">
        Payments verified on-chain via Solana. Subscription activates instantly.
      </p>
    </div>
  );
}
