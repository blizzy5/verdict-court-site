"use client";

import { useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API, BOT_URL, CHAINS, NOT_A_COURT, SAFETY } from "../services";

const INPUT =
  "w-full bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors";
const LABEL = "font-court text-xs text-[#d4a056] uppercase tracking-wider block mb-2";

export default function ReportTheftPage() {
  const router = useRouter();
  // One key per form: a retry after a lost answer must not open a second case.
  const requestId = useRef<string | null>(null);
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("eth");
  const [date, setDate] = useState("");
  const [txHash, setTxHash] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState<"error" | "limit" | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address.trim() || !description.trim()) return;
    setSubmitting(true);
    setFailed(null);

    try {
      const res = await fetch(`${API}/api/v2/services/case`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          request_id: (requestId.current ??= crypto.randomUUID()),
          victim_address: address.trim(),
          chain,
          incident_date: date || undefined,
          tx_hash: txHash.trim() || undefined,
          amount_usd: amount ? Number(amount) : undefined,
          description: description.trim(),
          contact: contact.trim() || undefined,
          source: "web_form",
        }),
      });
      const data = res.ok ? await res.json() : null;
      if (data?.case_id) return router.replace(`/recovery/case?id=${encodeURIComponent(String(data.case_id))}&new=1`);
      setFailed(res.status === 429 ? "limit" : "error");
    } catch {
      setFailed("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-4xl block mb-4">⚖️</span>
        <h1 className="font-court text-4xl mb-2">
          <span className="text-gold">Report</span>{" "}
          <span className="text-[#e8dcc8]">a theft</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">Free. Opens a case file. A trace is run after review.</p>
        <div className="gold-line mt-4 max-w-xs mx-auto" />
      </div>

      <form onSubmit={onSubmit} className="wood-card p-6 sm:p-8">
        <div className="mb-6">
          <label htmlFor="address" className={LABEL}>Your wallet address *</label>
          <input
            id="address"
            maxLength={100}
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="The wallet the funds were taken from"
            required
            className={`${INPUT} font-mono`}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="chain" className={LABEL}>Blockchain *</label>
            <select id="chain" value={chain} onChange={(e) => setChain(e.target.value)} className={INPUT}>
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className={LABEL}>Approximate date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`${INPUT} [color-scheme:dark]`}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="tx" className={LABEL}>Transaction hash</label>
            <input
              id="tx"
            maxLength={130}
              type="text"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="If you have it"
              className={`${INPUT} font-mono`}
            />
          </div>
          <div>
            <label htmlFor="amount" className={LABEL}>Amount lost (USD)</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Estimate"
              className={`${INPUT} font-mono`}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className={LABEL}>What happened? *</label>
          <textarea
            id="description"
            maxLength={5000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A link you clicked, an approval you signed, an app you connected to..."
            required
            rows={4}
            className={`${INPUT} resize-none`}
          />
        </div>

        <div className="mb-8">
          <label htmlFor="contact" className={LABEL}>Contact (optional)</label>
          <input
            id="contact"
            maxLength={200}
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or Telegram handle"
            className={INPUT}
          />
          <p className="text-xs text-[#e8dcc8]/40 mt-2">Used only to reach you about this case.</p>
        </div>

        <p className="text-xs text-[#e8dcc8]/60 leading-relaxed mb-4">
          Opening a case is free. If funds are returned to you, our fee is 10% of the amount returned, agreed in
          writing before any recovery work starts. {SAFETY}
        </p>

        <label className="flex items-start gap-3 text-xs text-[#e8dcc8]/70 leading-relaxed mb-6 cursor-pointer">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#d4a056]" />
          <span>
            I have read the{" "}
            <Link href="/privacy" target="_blank" className="text-[#d4a056] hover:underline">privacy notice</Link>{" "}
            and I am reporting a theft from a wallet that is mine.
          </span>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm disabled:opacity-50"
        >
          {submitting ? "Opening case..." : "Open my case"}
        </button>

        {failed === "limit" && (
          <div role="alert" className="mt-4 p-4 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl text-center">
            <p className="text-[#FFB020] text-sm font-court mb-1">Too many reports from this connection.</p>
            <p className="text-xs text-[#e8dcc8]/40">No case was opened. Try again in an hour.</p>
          </div>
        )}
        {failed === "error" && (
          <div role="alert" className="mt-4 p-4 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-xl text-center">
            <p className="text-[#FF4444] text-sm font-court mb-1">Your case may not have been opened.</p>
            <p className="text-xs text-[#e8dcc8]/40">
              Try again in a moment: a retry never opens a second case. You can also use the{" "}
              <a href={BOT_URL} target="_blank" rel="noopener" className="text-[#d4a056] hover:underline">TheHat bot</a>.
            </p>
          </div>
        )}
      </form>

      <p className="text-center text-xs text-[#e8dcc8]/60 mt-6 leading-relaxed">{NOT_A_COURT}</p>
    </div>
  );
}
