"use client";

import { useState, FormEvent } from "react";

const API = "https://thehat-production.up.railway.app";

export interface Plan {
  price_usdc: number;
  price_sol: number;
  price_skr: number;
  paid_days: number;
  bonus_days: number;
  total_days: number;
}

const TOKENS = ["USDC", "SOL", "SKR"] as const;
type Token = (typeof TOKENS)[number];

const INPUT =
  "w-full bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm font-mono text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors";
const LABEL = "font-court text-xs text-[#d4a056] uppercase tracking-wider block mb-2";

function price(plan: Plan, token: Token): number {
  return token === "USDC" ? plan.price_usdc : token === "SOL" ? plan.price_sol : plan.price_skr;
}

function fmtDate(d: string): string {
  const t = new Date(d);
  return isNaN(t.getTime()) ? d : t.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

interface Activated {
  expires_at: string;
  total_days: number;
}

export function Checkout({
  planKey,
  planLabel,
  plan,
  payTo,
  mints,
}: {
  planKey: string;
  planLabel: string;
  plan: Plan;
  payTo: string;
  mints: Record<string, string>;
}) {
  const [token, setToken] = useState<Token>("USDC");
  const [wallet, setWallet] = useState("");
  const [signature, setSignature] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Activated | null>(null);

  const amount = price(plan, token);
  const mint = mints[token];
  // Solana Pay transfer request: opens the wallet app with recipient and amount filled in.
  const payLink =
    `solana:${payTo}?amount=${amount}` +
    (mint && mint !== "native" ? `&spl-token=${mint}` : "") +
    `&label=${encodeURIComponent("Verdict Court")}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(payTo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address stays selectable */
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!wallet.trim() || !signature.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/v2/shield/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          wallet_address: wallet.trim(),
          plan: planKey,
          tx_signature: signature.trim(),
          payment_token: token,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) setDone({ expires_at: data.expires_at, total_days: data.total_days });
      else if (res.status === 400 && typeof data?.error === "string") setError(data.error);
      else setError("Activation is not available right now. Your payment is safe on-chain: try again later with the same signature.");
    } catch {
      setError("Activation is not available right now. Your payment is safe on-chain: try again later with the same signature.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!payTo) {
    return (
      <div className="wood-card p-6 sm:p-8 text-center">
        <p className="font-court text-lg text-[#e8dcc8] mb-2">Payments are not open yet.</p>
        <p className="text-sm text-[#e8dcc8]/50">
          Plans cannot be bought today. Do not send funds to any address claiming to be ours.
        </p>
      </div>
    );
  }

  if (done) {
    return (
      <div role="status" className="wood-card p-6 sm:p-8 text-center">
        <span className="stamp text-[#14F195] text-sm">Plan active</span>
        <p className="text-sm text-[#e8dcc8]/60 mt-5">
          {planLabel} plan, {done.total_days} days. Active until{" "}
          <span className="text-[#d4a056] font-mono">{fmtDate(done.expires_at)}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="wood-card p-6 sm:p-8">
      <h2 className="font-court text-2xl text-gold mb-6">{planLabel} plan</h2>

      {/* 1 — token */}
      <p className={LABEL}>1 · Choose how to pay</p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {TOKENS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setToken(t)}
            aria-pressed={token === t}
            className={`py-2.5 rounded-xl text-sm font-mono transition-all border ${
              token === t
                ? "border-[#d4a056] text-[#d4a056] bg-[#d4a056]/10 font-bold"
                : "border-[#d4a056]/20 text-[#e8dcc8]/40 hover:border-[#d4a056]/40"
            }`}
          >
            {t === "SKR" ? "$SKR" : t}
          </button>
        ))}
      </div>

      {/* 2 — transfer */}
      <p className={LABEL}>2 · Send exactly this amount, on Solana</p>
      <div role="note" className="mb-3 p-4 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl">
        <p className="text-sm text-[#FFB020] leading-relaxed">
          Pay from the wallet you want to protect. A payment sent from an exchange or from another wallet is
          refused.
        </p>
      </div>
      <div className="bg-[#0c0806]/40 rounded-xl p-4 mb-6">
        <p className="text-2xl font-bold font-mono text-[#d4a056] mb-3">
          {amount.toLocaleString("en-US", { maximumFractionDigits: 9 })} {token === "SKR" ? "$SKR" : token}
        </p>
        <p className="text-[10px] text-[#d4a056]/50 uppercase tracking-wider mb-1">To</p>
        <p className="font-mono text-xs text-[#e8dcc8]/80 break-all mb-4">{payTo}</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={copy}
            className="px-4 py-2 rounded-lg text-xs font-mono border border-[#d4a056]/20 text-[#d4a056]/70 hover:border-[#d4a056]/40 hover:text-[#d4a056] transition-all"
          >
            {copied ? "Copied" : "Copy address"}
          </button>
          <a
            href={payLink}
            className="px-4 py-2 rounded-lg text-xs font-mono text-center border border-[#d4a056]/20 text-[#d4a056]/70 hover:border-[#d4a056]/40 hover:text-[#d4a056] transition-all"
          >
            Open in wallet app
          </a>
        </div>
      </div>

      {/* 3 — proof */}
      <p className={LABEL}>3 · Activate</p>
      <div className="mb-4">
        <label htmlFor="shield-wallet" className="text-xs text-[#e8dcc8]/50 block mb-2">Wallet you paid from — the one to protect</label>
        <input
          id="shield-wallet"
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="Your Solana address"
          required
          className={INPUT}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="shield-tx" className="text-xs text-[#e8dcc8]/50 block mb-2">Transaction signature of your payment</label>
        <input
          id="shield-tx"
          type="text"
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          placeholder="Shown by your wallet after the transfer"
          required
          className={INPUT}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm disabled:opacity-50"
      >
        {submitting ? "Verifying on-chain..." : "Activate my plan"}
      </button>

      {error && (
        <div role="alert" className="mt-4 p-4 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-xl text-center">
          <p className="text-[#FF4444] text-sm">{error}</p>
        </div>
      )}

      <p className="text-xs text-[#e8dcc8]/40 mt-6 leading-relaxed">
        Access to the plan for {plan.total_days} days. No renewal is charged automatically. We never ask
        for your seed phrase or private keys.
      </p>
    </form>
  );
}
