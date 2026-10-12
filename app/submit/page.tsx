"use client";

import { useState, FormEvent } from "react";
import { ADDRESS_PATTERN } from "../verdict";

const API = "https://thehat-production.up.railway.app";

export default function SubmitPage() {
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | "limit" | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address.trim() || !description.trim()) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch(`${API}/api/v2/solana/dev/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: address.trim(),
          reason: description.trim(),
          evidence: evidence.trim() || undefined,
          reported_by: "web_form",
        }),
      });
      setResult(res.ok ? "success" : res.status === 429 ? "limit" : "error");
      if (res.ok) { setAddress(""); setDescription(""); setEvidence(""); }
    } catch {
      setResult("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-4xl block mb-4">📋</span>
        <h1 className="font-court text-4xl mb-2">
          <span className="text-gold">Submit</span>{" "}
          <span className="text-[#e8dcc8]">Evidence</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">Every report is reviewed and verified on-chain before anything is published.</p>
        <div className="gold-line mt-4 max-w-xs mx-auto" />
      </div>

      <form onSubmit={onSubmit} className="wood-card p-8">
        {/* Address */}
        <div className="mb-6">
          <label className="font-court text-xs text-[#d4a056] uppercase tracking-wider block mb-2">
            Suspect Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address, Solana or 0x..."
            required
            pattern={ADDRESS_PATTERN}
            title="A Solana address or an EVM address starting with 0x"
            className="w-full bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm font-mono text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="font-court text-xs text-[#d4a056] uppercase tracking-wider block mb-2">
            What happened? *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the suspected rug pull, scam, or malicious activity..."
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            className="w-full bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors resize-none"
          />
        </div>

        {/* Evidence */}
        <div className="mb-8">
          <label className="font-court text-xs text-[#d4a056] uppercase tracking-wider block mb-2">
            Evidence Links (optional)
          </label>
          <textarea
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Links to tweets, block explorer, screenshots..."
            rows={3}
            className="w-full bg-[#1a120a] border border-[#d4a056]/20 rounded-xl px-4 py-3 text-sm text-[#e8dcc8] placeholder:text-[#e8dcc8]/20 focus:outline-none focus:border-[#d4a056]/60 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit to the Court"}
        </button>

        {result === "success" && (
          <div className="mt-4 p-4 bg-[#14F195]/10 border border-[#14F195]/20 rounded-xl text-center">
            <p className="text-[#14F195] text-sm font-court">Received. It will be verified on-chain before any publication.</p>
            <p className="text-xs text-[#e8dcc8]/40 mt-1">A report alone changes no score and no verdict.</p>
          </div>
        )}
        {result === "limit" && (
          <div className="mt-4 p-4 bg-[#FFB020]/10 border border-[#FFB020]/30 rounded-xl text-center">
            <p className="text-[#FFB020] text-sm font-court">Too many reports from this connection. Try again in an hour.</p>
          </div>
        )}
        {result === "error" && (
          <div className="mt-4 p-4 bg-[#FF4444]/10 border border-[#FF4444]/20 rounded-xl text-center">
            <p className="text-[#FF4444] text-sm font-court">Submission failed. Try again later.</p>
          </div>
        )}
      </form>

      <p className="text-center text-[10px] text-[#e8dcc8]/40 mt-6 font-mono">
        All reports are anonymous. False reports will be flagged.{" "}
        <a href="/privacy" className="hover:text-[#d4a056] underline">Privacy notice</a>
      </p>
    </div>
  );
}
