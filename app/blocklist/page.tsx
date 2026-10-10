"use client";

import { useEffect, useState } from "react";

export default function BlocklistPage() {
  const [stats, setStats] = useState({ pegasus_iocs: 54, scam_domains: 228, blocklist_entries: 228 });

  useEffect(() => {
    fetch("https://thehat-production.up.railway.app/api/v2/stats/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.anti_spyware) setStats(d.anti_spyware);
      })
      .catch(() => {});
  }, []);

  // Downloads go through /api/blocklist proxy

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="verdict-badge bg-[#FF4444]/20 text-[#FF4444] mb-4 inline-block">Anti-Spyware</span>
        <h1 className="text-4xl font-court mb-2">
          <span className="text-[#FF4444]">Blocklist</span>{" "}
          <span className="text-[#e8dcc8]">Downloads</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">
          Protect your network from Pegasus spyware domains and crypto scam sites.
          Compatible with Pi-hole, AdGuard, and any DNS blocklist.
        </p>
        <div className="gold-line mt-4" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="wood-card p-6 text-center">
          <p className="text-3xl font-bold font-mono text-[#FF4444]">{stats.pegasus_iocs}</p>
          <p className="text-xs text-[#d4a056]/50 mt-2 uppercase tracking-wider font-court">Pegasus IOCs</p>
        </div>
        <div className="wood-card p-6 text-center">
          <p className="text-3xl font-bold font-mono text-[#FFB020]">{stats.scam_domains}</p>
          <p className="text-xs text-[#d4a056]/50 mt-2 uppercase tracking-wider font-court">Scam Domains</p>
        </div>
        <div className="wood-card p-6 text-center">
          <p className="text-3xl font-bold font-mono text-[#8B5CF6]">{stats.blocklist_entries}</p>
          <p className="text-xs text-[#d4a056]/50 mt-2 uppercase tracking-wider font-court">Total Entries</p>
        </div>
      </div>

      <div className="gold-line mb-10" />

      {/* Download cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pi-hole */}
        <div className="wood-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🕳️</span>
            <div>
              <h3 className="text-lg font-court text-[#FF4444]">Pi-hole Format</h3>
              <p className="text-xs text-[#e8dcc8]/30">One domain per line</p>
            </div>
          </div>
          <p className="text-sm text-[#e8dcc8]/40 mb-6">
            Drop this list into your Pi-hole blocklist. Blocks Pegasus C2 servers,
            crypto phishing domains, and known scam sites.
          </p>
          <div className="space-y-2">
            <a
              href="https://thehat-production.up.railway.app/blocklist?format=pihole"
              target="_blank"
              rel="noopener"
              className="block w-full py-2.5 text-center bg-[#FF4444]/15 text-[#FF4444] font-bold font-court rounded-xl hover:bg-[#FF4444]/25 transition-all text-sm"
            >
              Download Pi-hole Blocklist
            </a>
          </div>
        </div>

        {/* AdGuard */}
        <div className="wood-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🛡️</span>
            <div>
              <h3 className="text-lg font-court text-[#14F195]">AdGuard Format</h3>
              <p className="text-xs text-[#e8dcc8]/30">||domain^ syntax</p>
            </div>
          </div>
          <p className="text-sm text-[#e8dcc8]/40 mb-6">
            AdGuard-compatible format. Works with AdGuard Home, AdGuard DNS,
            and any filter list that supports the ||domain^ syntax.
          </p>
          <div className="space-y-2">
            <a
              href="https://thehat-production.up.railway.app/blocklist?format=adguard"
              target="_blank"
              rel="noopener"
              className="block w-full py-2.5 text-center bg-[#14F195]/15 text-[#14F195] font-bold font-court rounded-xl hover:bg-[#14F195]/25 transition-all text-sm"
            >
              Download AdGuard Blocklist
            </a>
          </div>
        </div>
      </div>

      <div className="gold-line mt-8 mb-8" />

      {/* Info */}
      <div className="wood-card p-6">
        <h3 className="text-sm font-court text-gold mb-3">What&apos;s included?</h3>
        <ul className="space-y-2 text-sm text-[#e8dcc8]/40">
          <li className="flex items-start gap-2">
            <span className="text-[#FF4444] mt-0.5">●</span>
            <span><strong className="text-[#e8dcc8]/60">Pegasus IOCs</strong> — NSO Group command & control domains and IPs used by the Pegasus spyware</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFB020] mt-0.5">●</span>
            <span><strong className="text-[#e8dcc8]/60">Crypto scam domains</strong> — Phishing sites impersonating DEXs, wallets, and token launches</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#8B5CF6] mt-0.5">●</span>
            <span><strong className="text-[#e8dcc8]/60">Rug pull sites</strong> — Domains associated with known rug pull operations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
