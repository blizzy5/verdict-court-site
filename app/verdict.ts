// Shared rules for showing an address and a verdict on public pages.

export const CHAINS = ["Solana", "Ethereum", "Base", "BSC", "Arbitrum", "Robinhood Chain", "Arc", "HyperEVM"];

// A Solana address (base58, 32 to 44 characters) or an EVM address (0x + 40 hex).
export const ADDRESS_PATTERN = "(0x[0-9a-fA-F]{40}|[1-9A-HJ-NP-Za-km-z]{32,44})";

export function isAddress(s: string): boolean {
  return new RegExp(`^${ADDRESS_PATTERN}$`).test(s);
}

export function chainFamily(address: string): "EVM" | "Solana" {
  return address.startsWith("0x") ? "EVM" : "Solana";
}

// What the Court is willing to print. An address with no token launch has no verdict,
// and "serial rugger" takes at least two detected rugs.
export function shownVerdict(verdict: string, totalTokens = 0, ruggedTokens = 0): string {
  if (verdict === "NO_RECORD" || totalTokens === 0) return "NO RECORD";
  if (verdict === "SERIAL_RUGGER" && ruggedTokens < 2) return "UNDER REVIEW";
  return verdict;
}
