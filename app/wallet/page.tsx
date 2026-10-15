"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  API,
  HOLDING,
  Names,
  Trading,
  chainLabel,
  explorerUrl,
  isProven,
  safePost,
  shownWhy,
  usd,
  xHandle,
} from "../families/shared";

interface Launches {
  launches?: number;
  graduated?: number;
  graduation_rate?: number;
  dead?: number;
  dead_rate?: number;
  alive_over_100k?: number;
  best_peak_mcap_usd?: number;
  median_peak_mcap_usd?: number;
  first_launch_at?: string;
  last_launch_at?: string;
  source?: string;
  platforms?: string[];
  symbols?: string[];
}

interface FamilyEntry {
  family: string;
  status: string;
  score: number;
  chain: string;
  evm_chains?: string[] | null;
  why: string;
  trading?: Trading;
  launches?: Launches | null;
  named_by?: { source: string; post: string | null }[];
  cluster_id?: string;
  size?: number;
}

interface Profile {
  address: string;
  computed_at?: number;
  names: Names;
  families: FamilyEntry[];
}

const FAMILY: Record<string, { title: string; color: string }> = {
  trader: { title: "📈 Trader", color: "#4488FF" },
  bon_dev: { title: "✅ Good Dev", color: "#14F195" },
  rugger: { title: "🚩 Proven Rugger", color: "#FF4444" },
  cluster: { title: "🕸️ Proven Cluster", color: "#8B5CF6" },
};

const pct = (r?: number) => (r === undefined || r === null ? "—" : `${Math.round(r * 100)}%`);
const day = (iso?: string) => {
  const t = iso ? new Date(iso) : null;
  return t && !isNaN(t.getTime()) ? t.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
};
const unixDay = (s?: number) => (s ? day(new Date(s * 1000).toISOString()) : "—");

function Stat({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-lg bg-[#d4a056]/[0.05] border border-[#d4a056]/10 p-3">
      <p className="text-[10px] font-mono uppercase tracking-wider text-[#e8dcc8]/40">{label}</p>
      <p className="font-mono font-bold text-sm mt-1" style={{ color: color ?? "#e8dcc8" }}>{value}</p>
    </div>
  );
}

function TradingBlock({ t }: { t: Trading }) {
  const realized = t.realized_pnl_usd ?? t.realized_usd;
  const hold = t.holding_style ? HOLDING[t.holding_style] : undefined;
  return (
    <>
      {hold && (
        <p className="mb-3">
          <span className="verdict-badge" style={{ color: hold.color, background: `${hold.color}26` }}>{hold.label}</span>
          <span className="ml-2 text-xs text-[#e8dcc8]/50">{hold.text}</span>
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {realized !== undefined && <Stat label="Realized" value={usd(realized)} color={realized >= 0 ? "#14F195" : "#FF4444"} />}
        <Stat label="Winning" value={pct(t.win_rate)} />
        <Stat label="Trades" value={t.trades.toLocaleString("en-US")} />
        {t.bought_usd !== undefined && <Stat label="Invested" value={usd(t.bought_usd)} />}
        {t.roi_on_sold !== undefined && (
          <Stat
            label="ROI on sold"
            value={t.roi_on_sold === null ? "No sale" : `${t.roi_on_sold > 0 ? "+" : t.roi_on_sold < 0 ? "−" : ""}${Math.abs(Math.round(t.roi_on_sold * 100))}%`}
            color={t.roi_on_sold === null ? undefined : t.roi_on_sold >= 0 ? "#14F195" : "#FF4444"}
          />
        )}
        <Stat label="Last trade" value={unixDay(t.last_trade)} />
      </div>
      <p className="text-[11px] text-[#e8dcc8]/40 mt-3">
        Over the last {t.window_days} days
        {t.window_covered === false && <span className="text-[#FFB020]"> · partial period (very active wallet)</span>}.
      </p>
    </>
  );
}

function LaunchBlock({ l }: { l: Launches }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {l.launches !== undefined && <Stat label="Tokens launched" value={l.launches} />}
        {l.graduated !== undefined && (
          <Stat label="Graduated" value={`${l.graduated}${l.graduation_rate !== undefined ? ` (${pct(l.graduation_rate)})` : ""}`} color="#14F195" />
        )}
        {l.dead !== undefined && <Stat label="Dead" value={`${l.dead}${l.dead_rate !== undefined ? ` (${pct(l.dead_rate)})` : ""}`} color="#FF4444" />}
        {l.best_peak_mcap_usd !== undefined && <Stat label="Best peak" value={usd(l.best_peak_mcap_usd)} />}
        {l.first_launch_at && <Stat label="First launch" value={day(l.first_launch_at)} />}
        {l.last_launch_at && <Stat label="Last launch" value={day(l.last_launch_at)} />}
      </div>
      {(l.source || l.platforms?.length) && (
        <p className="text-[11px] text-[#e8dcc8]/40 mt-3">Source: {l.platforms?.length ? l.platforms.join(", ") : l.source}</p>
      )}
    </>
  );
}

function NamesBlock({ n }: { n: Names }) {
  const x = xHandle(n.x_declared);
  const items = [
    n.sui_name && { k: "Sui name", v: n.sui_name },
    n.ens && { k: "ENS", v: n.ens },
    n.pump_username && { k: "pump.fun", v: n.pump_username },
  ].filter(Boolean) as { k: string; v: string }[];
  if (!items.length && !x) return null;
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span key={i.k} className="text-xs px-2 py-1 rounded bg-[#d4a056]/10 text-[#e8dcc8]/80">
            <span className="text-[#e8dcc8]/40">{i.k}:</span> {i.v}
          </span>
        ))}
        {x && (
          <a href={`https://x.com/${x}`} target="_blank" rel="noopener noreferrer nofollow" className="text-xs px-2 py-1 rounded bg-[#d4a056]/10 text-[#d4a056] hover:underline">
            X: @{x}
          </a>
        )}
      </div>
      <p className="text-[10px] text-[#FFB020]/70 mt-1">Declared by the wallet itself, not verified.</p>
    </div>
  );
}

function WalletProfile() {
  const address = (useSearchParams().get("address") ?? "").trim();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [state, setState] = useState<"loading" | "notfound" | "failed" | "ok">("loading");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    fetch(`${API}/api/v2/court/profile/${encodeURIComponent(address)}`)
      .then(async (r) => {
        if (r.status === 404) return setState("notfound");
        if (!r.ok) return setState("failed");
        const d: Profile = await r.json();
        // Ruggers and clusters are public only once proven, whatever the API sends.
        d.families = (d.families ?? []).filter((f) => (f.family === "rugger" || f.family === "cluster" ? isProven(f.status) : true));
        if (!d.families.length) return setState("notfound");
        setProfile(d);
        setState("ok");
      })
      .catch(() => setState("failed"));
  }, [address]);

  const shown = address ? state : "notfound";
  const first = profile?.families[0];

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked: the address stays selectable */
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/families" className="text-xs font-mono text-[#d4a056]/60 hover:text-[#d4a056]">← On-chain families</Link>

      {shown === "loading" && <p className="mt-10 text-center text-[#e8dcc8]/30 font-mono text-xs">Loading...</p>}
      {shown === "notfound" && (
        <p className="mt-10 text-center text-sm text-[#e8dcc8]/60">This wallet is not in any public family.</p>
      )}
      {shown === "failed" && (
        <p role="alert" className="mt-10 text-center text-sm text-[#FF4444]">The profile could not be loaded. Try again in a moment.</p>
      )}

      {shown === "ok" && profile && first && (
        <>
          <section className="wood-card p-6 mt-6">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#d4a056]/50">{chainLabel(first.chain, first.evm_chains, 8)}</p>
            <p className="font-mono text-sm text-[#e8dcc8] break-all mt-1">{profile.address}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={copy} className="text-xs px-3 py-1.5 rounded-lg border border-[#d4a056]/20 text-[#d4a056]/70 hover:text-[#d4a056]">
                {copied ? "Copied" : "Copy address"}
              </button>
              <a
                href={explorerUrl(first.chain, profile.address, first.evm_chains)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1.5 rounded-lg border border-[#d4a056]/20 text-[#d4a056]/70 hover:text-[#d4a056]"
              >
                View on explorer ↗
              </a>
            </div>
            <NamesBlock n={profile.names ?? {}} />
          </section>

          {profile.families.map((f) => {
            const meta = FAMILY[f.family] ?? { title: f.family, color: "#d4a056" };
            const proven = isProven(f.status);
            const posts = (f.named_by ?? []).filter((n) => xHandle(n.source));
            return (
              <section key={f.family} className="wood-card p-6 mt-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="font-court text-xl" style={{ color: meta.color }}>{meta.title}</h2>
                  <span
                    className="verdict-badge"
                    style={{ background: proven ? "#14F19526" : "#FFB02026", color: proven ? "#14F195" : "#FFB020" }}
                  >
                    {proven ? "PROVEN" : "TO VERIFY"}
                  </span>
                </div>
                <p className="text-xs text-[#e8dcc8]/60 mb-4">{shownWhy(f.family, f)} · score {f.score}</p>

                {f.trading && <TradingBlock t={f.trading} />}
                {f.launches && <LaunchBlock l={f.launches} />}
                {f.family === "cluster" && f.size !== undefined && <Stat label="Wallets in the cluster" value={f.size} />}

                {f.family === "rugger" && proven && posts.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#e8dcc8]/40 mb-2">Reported by</p>
                    <ul className="space-y-1">
                      {posts.map((n, i) => {
                        const h = xHandle(n.source)!;
                        const post = safePost(n.post);
                        return (
                          <li key={i} className="text-xs">
                            <a href={`https://x.com/${h}`} target="_blank" rel="noopener noreferrer nofollow" className="text-[#d4a056] hover:underline">@{h}</a>
                            {post && (
                              <a href={post} target="_blank" rel="noopener noreferrer nofollow" className="ml-2 text-[#e8dcc8]/50 hover:underline">post ↗</a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </section>
            );
          })}

          <p className="text-[11px] text-[#e8dcc8]/30 mt-6 text-center">
            {profile.computed_at && `Computed ${new Date(profile.computed_at * 1000).toUTCString()}. `}
            TO VERIFY = computed by the Court, not yet confirmed. Not investment advice.
          </p>
        </>
      )}
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={null}>
      <WalletProfile />
    </Suspense>
  );
}
