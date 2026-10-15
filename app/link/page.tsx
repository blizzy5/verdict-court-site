"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API = "https://thehat-production.up.railway.app";
const BOT = "https://t.me/thehatpenbot";

// Injected Solana wallets (Phantom, Solflare, Backpack...) share this shape.
interface SolanaProvider {
  connect: () => Promise<{ publicKey: { toString(): string } }>;
  signMessage: (msg: Uint8Array, display?: string) => Promise<{ signature: Uint8Array } | Uint8Array>;
}

function provider(): SolanaProvider | null {
  const w = window as unknown as {
    phantom?: { solana?: SolanaProvider };
    solflare?: SolanaProvider;
    backpack?: SolanaProvider;
    solana?: SolanaProvider;
  };
  return w.phantom?.solana ?? w.solflare ?? w.backpack ?? w.solana ?? null;
}

async function sign(p: SolanaProvider, message: string): Promise<string> {
  const out = await p.signMessage(new TextEncoder().encode(message), "utf8");
  const bytes = out instanceof Uint8Array ? out : out.signature;
  return btoa(String.fromCharCode(...bytes));
}

const BTN =
  "w-full py-3 rounded-xl text-sm font-bold font-court transition-all disabled:opacity-50";

type Code = { state: "loading" } | { state: "missing" } | { state: "invalid" } | { state: "ok"; account: string };

function LinkFlow() {
  const code = (useSearchParams().get("code") ?? "").trim();
  const [fetched, setInfo] = useState<Code>({ state: "loading" });
  const info: Code = code ? fetched : { state: "missing" };
  const [wallet, setWallet] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState(false);
  const [unlinked, setUnlinked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!code) return;
    fetch(`${API}/api/v2/shield/link?code=${encodeURIComponent(code)}`)
      .then(async (r) => {
        const d = r.ok ? await r.json() : null;
        setInfo(typeof d?.account === "string" ? { state: "ok", account: d.account } : { state: "invalid" });
      })
      .catch(() => setInfo({ state: "invalid" }));
  }, [code]);

  async function connect(): Promise<{ p: SolanaProvider; addr: string } | null> {
    const p = provider();
    if (!p) {
      setError("No Solana wallet found in this browser. Open this page in Phantom, Solflare or Backpack.");
      return null;
    }
    const { publicKey } = await p.connect();
    const addr = publicKey.toString();
    setWallet(addr);
    return { p, addr };
  }

  function failed(e: unknown, fallback: string) {
    const msg = e instanceof Error ? e.message : "";
    setError(/reject|cancel|denied/i.test(msg) ? "Signature cancelled." : fallback);
  }

  async function link() {
    if (info.state !== "ok") return;
    setBusy(true);
    setError(null);
    try {
      const c = await connect();
      if (!c) return;
      const message = `TheHat link (court.launchalfred.com) ${code} ${c.addr} to Telegram ${info.account}`;
      const signature = await sign(c.p, message);
      const res = await fetch(`${API}/api/v2/shield/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, wallet: c.addr, signature }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.ok) setLinked(true);
      else if (res.status === 429) setError("Too many attempts. Try again in a moment.");
      else setError(typeof d?.error === "string" ? d.error : "Linking is not available right now. Try again later.");
    } catch (e) {
      failed(e, "Linking is not available right now. Try again later.");
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    setBusy(true);
    setError(null);
    setUnlinked(null);
    try {
      const c = await connect();
      if (!c) return;
      const ts = Math.floor(Date.now() / 1000);
      const signature = await sign(c.p, `TheHat unlink (court.launchalfred.com) ${c.addr} ${ts}`);
      const res = await fetch(`${API}/api/v2/shield/unlink`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: c.addr, ts, signature }),
      });
      const d = await res.json().catch(() => null);
      if (res.ok && d?.ok) setUnlinked(!!d.was_linked);
      else if (res.status === 429) setError("Too many attempts. Try again in a moment.");
      else setError(typeof d?.error === "string" ? d.error : "Unlinking is not available right now. Try again later.");
    } catch (e) {
      failed(e, "Unlinking is not available right now. Try again later.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-court mb-2 text-center">
        <span className="text-gold">Link</span> your wallet
      </h1>
      <p className="text-[#e8dcc8]/40 text-sm text-center mb-8">
        Connect your Solana wallet to your Telegram account, so a plan counts both in Shield and in the bot.
      </p>

      <div className="wood-card p-6 sm:p-8">
        {info.state === "loading" && <p className="text-center text-[#e8dcc8]/30 font-mono text-xs">Checking your code...</p>}

        {info.state === "missing" && (
          <p className="text-center text-sm text-[#e8dcc8]/70">
            Type <span className="font-mono text-[#d4a056]">/lier</span> in{" "}
            <a href={BOT} target="_blank" rel="noopener noreferrer" className="text-[#d4a056] underline">@thehatpenbot</a>{" "}
            to get your personal link.
          </p>
        )}

        {info.state === "invalid" && (
          <p role="alert" className="text-center text-sm text-[#FF4444]">
            This code is unknown or has expired. Type <span className="font-mono">/lier</span> again in{" "}
            <a href={BOT} target="_blank" rel="noopener noreferrer" className="underline">@thehatpenbot</a>.
          </p>
        )}

        {info.state === "ok" && !linked && (
          <>
            <div className="rounded-xl border-2 border-[#FFB020]/60 bg-[#FFB020]/10 p-5 mb-6 text-center">
              <p className="text-[#e8dcc8] text-lg">
                This wallet will be linked to the Telegram account
              </p>
              <p className="font-mono text-2xl text-[#FFB020] font-bold my-2 break-all">{info.account}</p>
              <p className="text-[#FF4444] font-bold text-sm">If this is not you, do not sign.</p>
            </div>
            <button onClick={link} disabled={busy} className={`${BTN} bg-[#d4a056] text-[#0c0806] hover:bg-[#d4a056]/90`}>
              {busy ? "Waiting for your wallet..." : "Connect and sign"}
            </button>
            <p className="text-xs text-[#e8dcc8]/50 text-center mt-4">
              Signing gives no access to your funds and costs nothing. It is not a transaction.
            </p>
            <p className="text-xs text-[#e8dcc8]/40 text-center mt-2">
              The message contains <span className="font-mono">court.launchalfred.com</span>: never sign it on any other site.
            </p>
          </>
        )}

        {linked && (
          <div role="status" className="text-center">
            <span className="stamp text-[#14F195] text-sm">Linked</span>
            <p className="text-sm text-[#e8dcc8]/60 mt-5">
              Wallet <span className="font-mono">{wallet?.slice(0, 6)}...{wallet?.slice(-4)}</span> is now linked to your Telegram account.
            </p>
          </div>
        )}

        {error && <p role="alert" className="text-center text-sm text-[#FF4444] mt-4">{error}</p>}
      </div>

      <section className="wood-card p-6 mt-8">
        <h2 className="font-court text-lg text-gold mb-2">Unlink my wallet</h2>
        <p className="text-xs text-[#e8dcc8]/50 mb-4">
          Linked by mistake, or tricked into it? Remove the link from your wallet, without the bot.
        </p>
        <button
          onClick={unlink}
          disabled={busy}
          className={`${BTN} border border-[#FF4444]/40 text-[#FF4444]/80 hover:border-[#FF4444] hover:text-[#FF4444]`}
        >
          {busy ? "Waiting for your wallet..." : "Unlink my wallet"}
        </button>
        {unlinked !== null && (
          <p role="status" className="text-center text-sm text-[#e8dcc8]/60 mt-4">
            {unlinked ? "Your wallet is no longer linked to any Telegram account." : "This wallet was not linked to any account."}
          </p>
        )}
      </section>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={null}>
      <LinkFlow />
    </Suspense>
  );
}
