import type { Metadata } from "next";

// A case number in the URL is the only key to a case: keep it out of indexes and referrers.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function CaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
