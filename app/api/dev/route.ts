import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.THEHAT_API_URL || "https://thehat-production.up.railway.app";
const API_KEY = process.env.THEHAT_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const address = searchParams.get("address") || "";
  const q = searchParams.get("q") || "";

  try {
    let url: string;
    if (address) {
      url = `${API_BASE}/api/v2/solana/dev/profile?address=${encodeURIComponent(address)}`;
    } else if (q) {
      url = `${API_BASE}/api/v2/solana/dev/search?q=${encodeURIComponent(q)}`;
    } else {
      return NextResponse.json({ error: "address or q required" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "API unavailable" }, { status: 502 });
  }
}
