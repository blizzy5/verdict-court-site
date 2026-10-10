"use client";

const CATEGORIES: { name: string; color: string; icon: string; desc: string; tools: { name: string; desc: string }[] }[] = [
  {
    name: "Token Scanning", color: "#14F195", icon: "🔍", desc: "Every token you interact with is verified before you risk a single dollar.",
    tools: [
      { name: "Honeypot Detector", desc: "Detects tokens that block selling — checks buy/sell tax, transfer restrictions" },
      { name: "Rug Pull Analyzer", desc: "Identifies rug pull patterns — liquidity locks, ownership, mint authority" },
      { name: "Contract Scanner", desc: "Reads smart contract code for malicious functions and hidden backdoors" },
      { name: "Liquidity Monitor", desc: "Tracks LP additions and removals in real-time across DEXs" },
    ],
  },
  {
    name: "Developer Intelligence", color: "#8B5CF6", icon: "👤", desc: "Every deployer scored. Side wallets exposed. History tracked.",
    tools: [
      { name: "Dev Profiler", desc: "Builds a complete history of every wallet that deploys tokens on Solana" },
      { name: "Side Wallet Linker", desc: "Traces fund flows to identify connected wallets used by the same actor" },
      { name: "Rug Pattern Matcher", desc: "Cross-references deployer behavior with known rug pull patterns" },
      { name: "Verdict Engine", desc: "Scores developers TRUSTED / NEUTRAL / SUSPECT / SERIAL_RUGGER" },
    ],
  },
  {
    name: "Real-Time Monitoring", color: "#FFB020", icon: "📡", desc: "5 autonomous scanners watching the chain 24/7. No sleep.",
    tools: [
      { name: "New Token Scanner", desc: "Catches new token launches within seconds of deployment" },
      { name: "Deployer Tracker", desc: "Watches known ruggers for new deployments — instant alerts" },
      { name: "Whale Monitor", desc: "Tracks large holder movements and concentration changes" },
      { name: "KOL Shill Tracker", desc: "Monitors influencer promotions and cross-references with rug data" },
      { name: "Honeypot Transition", desc: "Re-scans safe tokens periodically to catch post-launch honeypot flips" },
    ],
  },
  {
    name: "Threat Intelligence", color: "#FF4444", icon: "🛡️", desc: "Protecting you from threats beyond the chain.",
    tools: [
      { name: "Pegasus IOC Database", desc: "54 known NSO Group command & control domains and IPs" },
      { name: "Scam Domain Blocklist", desc: "228+ phishing sites impersonating DEXs, wallets, and launchpads" },
      { name: "DNS Blocklist Generator", desc: "Pi-hole and AdGuard compatible lists — one click to protect your network" },
    ],
  },
  {
    name: "Wallet Security", color: "#4488FF", icon: "💼", desc: "Know your exposure before it's too late.",
    tools: [
      { name: "Wallet Tracer", desc: "Follow the money across Solana — tracks fund flows between wallets" },
      { name: "Risk Score Engine", desc: "Assigns a risk score to any wallet based on interaction history" },
      { name: "Approval Checker", desc: "Lists all token approvals and flags dangerous unlimited approvals" },
    ],
  },
  {
    name: "Community Intel", color: "#8B5CF6", icon: "👥", desc: "Crowdsourced intelligence, verified by the Court.",
    tools: [
      { name: "KOL Leaderboard", desc: "Trust scores for 30+ tracked influencers based on call accuracy" },
      { name: "Community Reports", desc: "Submit and browse community-verified rug reports" },
      { name: "Shill Detection", desc: "AI-powered detection of coordinated promotion campaigns" },
    ],
  },
];

export default function ToolsPage() {
  const totalTools = CATEGORIES.reduce((acc, cat) => acc + cat.tools.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="verdict-badge bg-[#d4a056]/20 text-[#d4a056] mb-4 inline-block">Shield Arsenal</span>
        <h1 className="text-4xl font-court mb-2">
          <span className="text-gold">{totalTools}</span>{" "}
          <span className="text-[#e8dcc8]">Tools protecting you.</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm max-w-lg">
          Everything Shield uses to keep your wallet safe. From token scanning to threat intelligence — all running autonomously.
        </p>
        <div className="gold-line mt-4" />
      </div>

      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="wood-card p-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="text-lg font-court text-gold">{cat.name}</h2>
              <span className="text-xs text-[#e8dcc8]/20 font-mono">{cat.tools.length} tools</span>
            </div>
            <p className="text-xs text-[#e8dcc8]/30 mb-2 ml-10">{cat.desc}</p>
            <div className="gold-line mb-4 ml-10" />
            <div className="grid md:grid-cols-2 gap-3">
              {cat.tools.map((tool) => (
                <div key={tool.name} className="flex items-start gap-3 p-3 rounded-lg bg-[#0c0806]/40 hover:bg-[#d4a056]/[0.06] transition-colors">
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: cat.color }} />
                  <div>
                    <p className="font-mono text-sm font-bold text-[#e8dcc8]/80">{tool.name}</p>
                    <p className="text-xs text-[#e8dcc8]/35 mt-0.5">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
