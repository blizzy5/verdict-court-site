export const API = "https://thehat-production.up.railway.app";
export const BOT_URL = "https://t.me/thehatpenbot";

export const NOT_A_COURT =
  "Verdict Court is a private blockchain-analysis service. It is not a court, a law-enforcement agency or a regulator. " +
  "Opening a case here is not a police report and starts no legal proceeding: report the theft to your local police " +
  "and to the exchange involved as well.";
export const SAFETY =
  "Recovery is never guaranteed. Only an exchange or an authority can freeze funds; we cannot. We never ask for your " +
  "seed phrase or private keys, and never ask you to send crypto to release, verify or unlock funds.";

export type ServiceStatus = "live" | "intake" | "soon";

export interface Service {
  slug: string;
  icon: string;
  name: string;
  tagline: string;
  points: string[];
  billing: string;
  status: ServiceStatus;
  href?: string;
  cta?: string;
}

export const STATUS_LABELS: Record<ServiceStatus, { label: string; color: string }> = {
  live: { label: "Live", color: "#14F195" },
  intake: { label: "Intake open", color: "#d4a056" },
  soon: { label: "Planned", color: "#4488FF" },
};

export const SERVICES: Service[] = [
  {
    slug: "recovery",
    icon: "⚖️",
    name: "Fund Recovery",
    tagline: "We trace stolen funds on-chain and document where they went.",
    points: ["Multi-chain trace of the stolen funds", "Report you can send to the exchange and the police", "Case status you can check online"],
    billing: "No upfront fee — 10% of funds returned to you",
    status: "intake",
    href: "/recovery/report",
    cta: "Report a theft",
  },
  {
    slug: "investigation",
    icon: "🔍",
    name: "Investigation Report",
    tagline: "A full on-chain investigation, delivered as a PDF.",
    points: ["Fund-flow across 16 blockchains", "Timeline, addresses, transactions", "Flagged addresses highlighted"],
    billing: "Investigator plan, or per report",
    status: "soon",
  },
  {
    slug: "due-diligence",
    icon: "🧪",
    name: "Token Due Diligence",
    tagline: "Automated risk indicators for a token. Not investment advice.",
    points: ["Honeypot and rug-risk checks", "Deployer history", "Holder concentration"],
    billing: "Analyst plan, or per report",
    status: "soon",
  },
  {
    slug: "audit",
    icon: "📜",
    name: "Smart Contract Audit",
    tagline: "Automated static analysis with a structured report. Not a manual audit or a certification.",
    points: ["Vulnerability detection", "Severity-ranked findings", "PDF report"],
    billing: "Investigator plan, or per report",
    status: "soon",
  },
  {
    slug: "monitoring",
    icon: "🛡️",
    name: "Shield Monitoring",
    tagline: "Five autonomous scanners watching for threats around the clock.",
    points: ["Real-time scanner alerts", "Honeypot detection", "Whale and deployer tracking"],
    billing: "From the Shield plan — $49 a month",
    status: "live",
    href: "/pricing",
    cta: "See plans",
  },
  {
    slug: "intel",
    icon: "🗂️",
    name: "Threat-Intel Lookup",
    tagline: "Check an address against our flagged-address records.",
    points: ["Flagged-address database", "Linked threat events", "Pay per lookup"],
    billing: "Analyst plan, or per lookup",
    status: "soon",
  },
  {
    slug: "retainer",
    icon: "🎩",
    name: "White-Hat Retainer",
    tagline: "Bug-report intake and triage for protocols.",
    points: ["Bug-bounty intake and triage", "Incident response", "Scope agreed in writing"],
    billing: "Protocol plan",
    status: "soon",
  },
  {
    slug: "compliance",
    icon: "🏛️",
    name: "Forensic AML Report",
    tagline: "Transaction evidence organised for compliance teams. No guarantee of admissibility.",
    points: ["Chain of custody", "Transaction-level evidence", "Structured PDF"],
    billing: "Protocol plan, or per report",
    status: "soon",
  },
];

export const CHAINS: { id: string; label: string }[] = [
  { id: "eth", label: "Ethereum" },
  { id: "sol", label: "Solana" },
  { id: "sui", label: "Sui" },
  { id: "bsc", label: "BNB Chain" },
  { id: "base", label: "Base" },
  { id: "arb", label: "Arbitrum" },
  { id: "polygon", label: "Polygon" },
  { id: "optimism", label: "Optimism" },
  { id: "avalanche", label: "Avalanche" },
  { id: "fantom", label: "Fantom" },
  { id: "gnosis", label: "Gnosis" },
  { id: "linea", label: "Linea" },
  { id: "scroll", label: "Scroll" },
  { id: "blast", label: "Blast" },
  { id: "zksync", label: "zkSync" },
  { id: "mantle", label: "Mantle" },
];
