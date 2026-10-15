// Shared by /families and /wallet: how a wallet of the public families is shown.
// Every text the API sends (names, why, symbols) can be written by anyone: React escapes it,
// and only links checked here are ever rendered.

export const API = "https://thehat-production.up.railway.app";

export interface Names {
  sui_name?: string;
  ens?: string;
  pump_username?: string;
  x_declared?: string;
  self_declared?: boolean;
}

export interface Trading {
  trades: number;
  win_rate: number;
  realized_usd?: number;
  realized_pnl_usd?: number;
  window_days: number;
  holding_style?: string;
  tokens_sold?: number;
  bought_usd?: number;
  roi_on_sold?: number | null; // realized profit ÷ cost of tokens sold; null = nothing sold
  avg_hold_minutes?: number;
  window_covered?: boolean;
  last_trade?: number;
}

export interface Member {
  address: string;
  family?: string;
  chain: string;
  status: string;
  score: number;
  why: string;
  evm_chains?: string[] | null;
  names?: Names;
  trading?: Trading;
}

export const isProven = (status: string) => status === "prouvé";

export function truncAddr(a: string): string {
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

export function explorerUrl(chain: string, address: string, evmChains?: string[] | null): string {
  if (chain === "solana") return `https://solscan.io/account/${address}`;
  if (chain === "sui") return `https://suivision.xyz/account/${address}`;
  // One known EVM chain gets its own explorer; several or none, Blockscan searches them all.
  const chains = evmChains ?? [];
  if (chains.length === 1 && EVM_EXPLORERS[chains[0]]) return EVM_EXPLORERS[chains[0]] + address;
  return `https://blockscan.com/address/${address}`;
}

export function chainLabel(chain: string, evmChains?: string[] | null, max = 3): string {
  const chains = evmChains ?? [];
  if (chain !== "evm" || chains.length === 0) return chain;
  const names = chains.map((c) => CHAIN_NAMES[c] ?? c);
  return names.length > max ? `${names.slice(0, max).join(" · ")} +${names.length - max}` : names.join(" · ");
}

export const HOLDING: Record<string, { label: string; text: string; color: string }> = {
  paper_hands: { label: "Paper hands", text: "sells within an hour", color: "#FF8844" },
  short_term: { label: "Short term", text: "holds less than a day", color: "#FFB020" },
  swing: { label: "Swing", text: "holds 1 to 7 days", color: "#4488FF" },
  diamond_hands: { label: "Diamond hands", text: "holds 7 days or more", color: "#14F195" },
};

export const usd = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("en-US")}`;

// A handle is shown as a link only when it is a plain X username.
export function xHandle(s?: string): string | null {
  const h = (s ?? "").trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "");
  return /^[A-Za-z0-9_]{1,15}$/.test(h) ? h : null;
}

// A post is linked only if it is an https link to x.com or twitter.com.
export function safePost(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /^(www\.)?(x|twitter)\.com$/i.test(u.hostname) ? u.href : null;
  } catch {
    return null;
  }
}

// The API explains each entry in French; the site is in English.
export function shownWhy(family: string, m: Pick<Member, "why" | "trading">): string {
  if (family === "trader") {
    const t = m.trading;
    if (t) {
      const r = t.realized_usd ?? t.realized_pnl_usd;
      return `${t.trades} trades · ${Math.round(t.win_rate * 100)}% winning${r !== undefined ? ` · ${usd(r)} realized` : ""} over ${t.window_days} days`;
    }
    return "Trading record computed on-chain";
  }
  if (family === "bon_dev") {
    const g = m.why.match(/(\d+)\s+de ses\s+(\d+)\s+tokens\s+(\w+)\s+sont passés en bourse/);
    if (g) return `${g[1]} of their ${g[2]} ${g[3]} tokens graduated (to confirm: a creator can buy their own token up to graduation)`;
    return "Computed from the record of their token launches";
  }
  if (family === "rugger") return "Rugs proven on-chain";
  if (family === "cluster") return "Wallets proven to act together";
  return "";
}
