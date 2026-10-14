// Two subscriptions: Community (Telegram bot + Shield app) and Detective (site + API).
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
  group: "community" | "detective";
  // True while the tier adds nothing that exists yet: it cannot be bought.
  closed?: boolean;
}

export const TIERS: Tier[] = [
  {
    key: "free",
    group: "community",
    name: "Free",
    icon: "⚖️",
    price: 0,
    pitch: "Check before you sign.",
    includes: [
      "Developer, token and wallet scans on this site",
      "Report a theft and follow your case",
      "Telegram bot: 1 group, 100 scans a month, basic checks",
      "Daily summary of good devs",
    ],
  },
  {
    key: "pro",
    group: "community",
    name: "Pro",
    icon: "🛡️",
    price: 29,
    pitch: "Protect your groups and your wallet.",
    includes: [
      "Everything in Free",
      "10 groups, 10,000 scans a month",
      "Automatic scan of every message, auto-kick and mute",
      "Advanced token security checks",
      "Good devs and traders, live",
      "Shield wallet monitoring at the same level when paid from that wallet",
    ],
  },
  {
    key: "premium",
    group: "community",
    name: "Premium",
    icon: "💎",
    price: 79,
    pitch: "For large communities.",
    includes: ["Everything in Pro", "50 groups, 100,000 scans a month", "Proven ruggers and proven wallet clusters"],
  },
  {
    key: "analyst",
    group: "detective",
    name: "Analyst",
    icon: "🧪",
    price: 99,
    pitch: "Research a token before you touch it.",
    includes: ["Shield monitoring and scans", "Token due diligence reports"],
    planned: ["Threat-intel address lookups"],
  },
  {
    key: "investigator",
    group: "detective",
    name: "Investigator",
    icon: "🔍",
    price: 149,
    pitch: "Follow the money yourself.",
    includes: ["Everything in Analyst", "Investigation reports (PDF)"],
    planned: ["Automated smart contract audits"],
  },
  {
    key: "protocol",
    group: "detective",
    name: "Protocol",
    icon: "🏛️",
    price: 199,
    pitch: "For teams with users to protect.",
    includes: ["Everything in Investigator"],
    planned: ["Forensic AML reports", "Bug-report intake and triage"],
    closed: true,
  },
];
