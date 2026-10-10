import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.THEHAT_API_URL || "https://thehat-production.up.railway.app";
const API_KEY = process.env.THEHAT_API_KEY || "";
const headers: Record<string, string> = API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {};

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/v2/solana/kol/leaderboard`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ leaderboard: [], total: 0 });
  }
}
