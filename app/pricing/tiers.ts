// One price list for the Court site, the Shield app and the TheHat bot.
// `key` is the plan id the API must expose for a tier to be purchasable.

export interface Tier {
  key: string;
  name: string;
  icon: string;
  price: number; // USD per month
  pitch: string;
  includes: string[];
  // Announced but not built yet: shown as planned, never sold as available.
  planned?: string[];
  // True while the tier adds nothing that exists yet: it cannot be bought.
  closed?: boolean;
}

export const TIERS: Tier[] = [
  {
    key: "free",
    name: "Free",
    icon: "⚖️",
    price: 0,
    pitch: "Check before you sign.",
    includes: ["Developer, token, KOL and wallet scans", "Report a theft and follow your case", "Anti-phishing blocklist"],
  },
  {
    key: "shield",
    name: "Shield",
    icon: "🛡️",
    price: 49,
    pitch: "Your wallet, watched around the clock.",
    includes: ["Everything in Free", "Alerts within seconds on Solana, minutes on EVM chains", "Honeypot detection", "Whale and deployer tracking"],
  },
  {
    key: "analyst",
    name: "Analyst",
    icon: "🧪",
    price: 99,
    pitch: "Research a token before you touch it.",
    includes: ["Everything in Shield", "Token due diligence reports"],
    planned: ["Threat-intel address lookups"],
  },
  {
    key: "investigator",
    name: "Investigator",
    icon: "🔍",
    price: 149,
    pitch: "Follow the money yourself.",
    includes: ["Everything in Analyst", "Investigation reports (PDF)"],
    planned: ["Automated smart contract audits"],
  },
  {
    key: "protocol",
    name: "Protocol",
    icon: "🏛️",
    price: 199,
    pitch: "For teams with users to protect.",
    includes: ["Everything in Investigator"],
    planned: ["Forensic AML reports", "Bug-report intake and triage"],
    closed: true,
  },
];
