"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API, HOLDING, Member, chainLabel, isProven, shownWhy, truncAddr } from "./shared";

type Tab = "bon_dev" | "trader" | "rugger" | "cluster";

const TABS: { key: Tab; label: string; color: string; blurb: string }[] = [
  { key: "bon_dev", label: "✅ Good Devs", color: "#14F195", blurb: "Developers whose launches held up on-chain." },
  { key: "trader", label: "📈 Traders", color: "#4488FF", blurb: "Wallets with a strong record of realized trades." },
  { key: "rugger", label: "🚩 Proven Ruggers", color: "#FF4444", blurb: "Only addresses whose rugs are proven on-chain are listed." },
  { key: "cluster", label: "🕸️ Proven Clusters", color: "#8B5CF6", blurb: "Groups of wallets proven to act together. Members are not listed yet." },
];

export default function FamiliesPage() {
  const [tab, setTab] = useState<Tab>("bon_dev");
  const [data, setData] = useState<Partial<Record<Tab, Member[]>>>({});
  const [computedAt, setComputedAt] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (data[tab]) return;
    fetch(`${API}/api/v2/court/families?family=${tab}&limit=100`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const rows: Member[] = d.families?.[tab] ?? [];
        // A rugger is only ever shown once proven, whatever the API sends.
        setData((prev) => ({ ...prev, [tab]: tab === "rugger" || tab === "cluster" ? rows.filter((m) => isProven(m.status)) : rows }));
        if (d.computed_at) setComputedAt(d.computed_at);
      })
      .catch(() => setFailed(true));
  }, [tab, data]);

  const list = data[tab];
  const current = TABS.find((t) => t.key === tab)!;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-court mb-2">
        <span className="text-gold">On-chain</span> Families
      </h1>
      <p className="text-[#e8dcc8]/40 text-sm mb-3">
        Computed from on-chain history and refreshed every 6 hours.
        {computedAt && ` Last run: ${new Date(computedAt * 1000).toUTCString()}.`}
      </p>
      <div className="gold-line mb-8" />

      <div className="flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-mono font-bold transition-all ${
              tab === t.key ? "" : "text-[#e8dcc8]/40 hover:text-[#e8dcc8]/60"
            }`}
            style={tab === t.key ? { background: `${t.color}26`, color: t.color } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-[#e8dcc8]/50 text-xs mb-1">{current.blurb}</p>
      <p className="text-[#e8dcc8]/30 text-xs mb-6">
        <span className="text-[#FFB020]">TO VERIFY</span> = computed by the Court, not yet confirmed.{" "}
        <span className="text-[#14F195]">PROVEN</span> = confirmed on-chain. Not investment advice.
      </p>

      <div className="wood-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#d4a056]/20 text-[#d4a056] text-xs uppercase tracking-widest font-court">
              <th className="hidden sm:table-cell text-left py-3 px-4">#</th>
              <th className="text-left py-3 px-4">Address</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="hidden sm:table-cell text-left py-3 px-4">Why</th>
            </tr>
          </thead>
          <tbody>
            {!list || list.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[#e8dcc8]/30 font-mono text-xs">
                  {failed ? "Data unavailable right now." : !list ? "Loading..." : tab === "rugger" ? "No rug proven on-chain yet." : tab === "cluster" ? "No cluster proven on-chain yet." : "No entry yet."}
                </td>
              </tr>
            ) : (
              list.map((m, i) => {
                const proven = isProven(m.status);
                const declared = m.names?.sui_name ?? m.names?.ens ?? m.names?.pump_username;
                const hold = m.trading?.holding_style ? HOLDING[m.trading.holding_style] : undefined;
                const why = shownWhy(tab, m);
                return (
                  <tr key={`${m.chain}:${m.address}`} className="border-b border-[#d4a056]/10 hover:bg-[#d4a056]/[0.04]">
                    <td className="hidden sm:table-cell py-3 px-4 text-[#e8dcc8]/20 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Link href={`/wallet?address=${encodeURIComponent(m.address)}`} className="font-mono text-xs hover:text-[#d4a056] underline decoration-[#d4a056]/30">
                        {truncAddr(m.address)}
                      </Link>
                      <span className="ml-2 text-[9px] font-mono text-[#d4a056]/50 uppercase">{chainLabel(m.chain, m.evm_chains)}</span>
                      {declared && (
                        <div className="text-[11px] text-[#e8dcc8]/60 mt-0.5" title="Declared by the wallet, not verified">
                          {declared} <span className="text-[9px] text-[#e8dcc8]/30">· self-declared</span>
                        </div>
                      )}
                      {hold && (
                        <span className="inline-block mt-1 text-[9px] font-mono uppercase px-1.5 py-0.5 rounded" style={{ color: hold.color, background: `${hold.color}1f` }}>
                          {hold.label}
                        </span>
                      )}
                      <div className="sm:hidden mt-1 text-[#e8dcc8]/60 text-xs whitespace-normal">{why}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="verdict-badge"
                        style={{
                          background: proven ? "#14F19526" : "#FFB02026",
                          color: proven ? "#14F195" : "#FFB020",
                        }}
                      >
                        {proven ? "PROVEN" : "TO VERIFY"}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-4 text-[#e8dcc8]/60 text-xs">{why}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
