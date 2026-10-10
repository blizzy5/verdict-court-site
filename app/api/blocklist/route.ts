import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.THEHAT_API_URL || "https://thehat-production.up.railway.app";
const API_KEY = process.env.THEHAT_API_KEY || "";

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format") || "pihole";

  try {
    const res = await fetch(
      `${API_BASE}/api/v2/soc/spyware/blocklist?format=${format}`,
      {
        headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) throw new Error(`API ${res.status}`);
    const text = await res.text();

    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="verdict-court-blocklist-${format}.txt"`,
      },
    });
  } catch {
    // Fallback minimal blocklist
    const lines = [
      "# Verdict Court Blocklist — Anti-Pegasus + Scam Domains",
      "# Download the full list at verdictcourt.xyz/blocklist",
      "#",
      "# API temporarily unavailable — showing sample entries",
      "",
    ];

    if (format === "adguard") {
      lines.push("||pegasus-c2.example.com^", "||fake-phantom-wallet.com^", "||solana-airdrop-claim.xyz^");
    } else {
      lines.push("0.0.0.0 pegasus-c2.example.com", "0.0.0.0 fake-phantom-wallet.com", "0.0.0.0 solana-airdrop-claim.xyz");
    }

    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="verdict-court-blocklist-${format}.txt"`,
      },
    });
  }
}
