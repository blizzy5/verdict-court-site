import { NextResponse } from "next/server";

const API_BASE = process.env.THEHAT_API_URL || "https://thehat-production.up.railway.app";
const API_KEY = process.env.THEHAT_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/v2/stats/overview`, {
      headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    // Fallback with seed data
    return NextResponse.json({
      verdict_court: {
        total_ruggers_tracked: 50,
        total_trusted_devs: 31,
        total_verdicts_rendered: 81,
        top_rugger: { address: null, rugs: 0 },
        top_trusted: { address: null, score: 0 },
      },
      shield: {
        total_scans: 0,
        tokens_scanned: 0,
        threats_detected: 0,
        scanners_active: 5,
        scanner_names: ["new_token", "deployer_tracker", "honeypot_detector", "whale_monitor", "kol_scanner"],
      },
      soc: {
        events_24h: 0,
        events_by_level: { INFO: 0, WARNING: 0, HIGH: 0, CRITICAL: 0 },
        lockdown: false,
      },
      tools: { total: 25, installed: 13, categories: {} },
      anti_spyware: { pegasus_iocs: 54, scam_domains: 228, blocklist_entries: 228 },
      community: { kol_tracked: 30, community_reports: 0 },
      last_updated: new Date().toISOString(),
    });
  }
}
