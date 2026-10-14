"use client";

import { useEffect, useState } from "react";

interface Member {
  address: string;
  chain: string;
  status: string;
  score: number;
  why: string;
  evm_chains?: string[];
}

type Tab = "bon_dev" | "trader" | "rugger";

const API = "https://thehat-production.up.railway.app";

const TABS: { key: Tab; label: string; color: string; blurb: string }[] = [
  { key: "bon_dev", label: "✅ Good Devs", color: "#14F195", blurb: "Developers whose launches held up on-chain." },
  { key: "trader", label: "📈 Traders", color: "#4488FF", blurb: "Wallets with a strong record of realized trades." },
  { key: "rugger", label: "🚩 Proven Ruggers", color: "#FF4444", blurb: "Only addresses whose rugs are proven on-chain are listed." },
];

function truncAddr(a: string): string {
  return a.length < 12 ? a : `${a.slice(0, 6)}...${a.slice(-4)}`;
}

const EVM_EXPLORERS: Record<string, string> = {
  eth: "https://etherscan.io/address/",
  base: "https://basescan.org/address/",
  bsc: "https://bscscan.com/address/",
  arb: "https://arbiscan.io/address/",
  hyperevm: "https://hyperevmscan.io/address/",
};

const CHAIN_NAMES: Record<string, string> = {
  eth: "Ethereum", base: "Base", bsc: "BSC", arb: "Arbitrum",
  hyperevm: "HyperEVM", robinhood: "Robinhood Chain", arc: "Arc",
};

function explorerUrl(m: Member): string {
  if (m.chain === "solana") return `https://solscan.io/account/${m.address}`;
  if (m.chain === "sui") return `https://suivision.xyz/account/${m.address}`;
  // One known EVM chain gets its own explorer; several or none, Blockscan searches them all.
  const chains = m.evm_chains ?? [];
  if (chains.length === 1 && EVM_EXPLORERS[chains[0]]) return EVM_EXPLORERS[chains[0]] + m.address;
  return `https://blockscan.com/address/${m.address}`;
}

function chainLabel(m: Member): string {
  const chains = m.evm_chains ?? [];
  if (m.chain !== "evm" || chains.length === 0) return m.chain;
  const names = chains.map((c) => CHAIN_NAMES[c] ?? c);
  return names.length > 3 ? `${names.slice(0, 3).join(" · ")} +${names.length - 3}` : names.join(" · ");
}

// The API explains each entry in French; the site is in English.
function shownWhy(family: Tab, why: string): string {
  if (family === "trader") {
    const m = why.match(/(\d+)\s+trades[\s,]+(\d+)\s*%\s+gagnants[\s,]+([\d\s  ]+?)\s*\$\s+réalisés sur\s+(\d+)\s*j/);
    if (m) {
      const usd = Number(m[3].replace(/\D/g, "")).toLocaleString("en-US");
      return `${m[1]} trades · ${m[2]}% winning · $${usd} realized over ${m[4]} days`;
    }
    return "Trading record computed on-chain";
  }
  if (family === "rugger") return "Rug deployment proven on-chain";
  return "Computed from the record of their token launches";
}

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
        setData((prev) => ({ ...prev, [tab]: tab === "rugger" ? rows.filter((m) => m.status === "prouvé") : rows }));
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
        <span className="text-[#FFB020]">LEAD</span> = computed by the Court, not yet confirmed.{" "}
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
                  {failed ? "Data unavailable right now." : !list ? "Loading..." : tab === "rugger" ? "No rug proven on-chain yet." : "No entry yet."}
                </td>
              </tr>
            ) : (
              list.map((m, i) => {
                const proven = m.status === "prouvé";
                return (
                  <tr key={`${m.chain}:${m.address}`} className="border-b border-[#d4a056]/10 hover:bg-[#d4a056]/[0.04]">
                    <td className="hidden sm:table-cell py-3 px-4 text-[#e8dcc8]/20 font-mono">{i + 1}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <a
                        href={explorerUrl(m)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs hover:text-[#d4a056]"
                      >
                        {truncAddr(m.address)}
                      </a>
                      <span className="ml-2 text-[9px] font-mono text-[#d4a056]/50 uppercase">{chainLabel(m)}</span>
                      <div className="sm:hidden mt-1 text-[#e8dcc8]/60 text-xs whitespace-normal">{shownWhy(tab, m.why)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="verdict-badge"
                        style={{
                          background: proven ? "#14F19526" : "#FFB02026",
                          color: proven ? "#14F195" : "#FFB020",
                        }}
                      >
                        {proven ? "PROVEN" : "LEAD"}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell py-3 px-4 text-[#e8dcc8]/60 text-xs">{shownWhy(tab, m.why)}</td>
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
