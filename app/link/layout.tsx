import type { Metadata } from "next";

// The link code in the URL is a one-time key: keep it out of indexes and referrers.
export const metadata: Metadata = {
  title: "Link your wallet — Verdict Court",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function LinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
