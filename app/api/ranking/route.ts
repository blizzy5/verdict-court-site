import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.THEHAT_API_URL || "https://thehat-production.up.railway.app";
const API_KEY = process.env.THEHAT_API_KEY || "";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const sort = searchParams.get("sort") || "score";
  const order = searchParams.get("order") || "desc";
  const limit = searchParams.get("limit") || "20";

  try {
    const res = await fetch(
      `${API_BASE}/api/v2/solana/dev/ranking?sort=${sort}&order=${order}&limit=${limit}`,
      {
        headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ developers: [], total: 0 });
  }
}
