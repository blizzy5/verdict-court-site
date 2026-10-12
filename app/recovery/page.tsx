import Link from "next/link";
import { NOT_A_COURT, SAFETY, SERVICES, STATUS_LABELS } from "./services";

const STEPS = [
  { n: "I", title: "Report", text: "Tell us what was taken: wallet, chain, approximate date. Free." },
  { n: "II", title: "Trace", text: "After review, the stolen funds are followed on-chain, hop by hop. 16 blockchains are covered." },
  { n: "III", title: "File", text: "Where funds reach an exchange, we prepare a report you can send to it and to the police." },
  { n: "IV", title: "Follow up", text: "Your case keeps a status you can check at any time with your case number." },
];

const RAILS = [
  { icon: "⭐", name: "Telegram Stars", text: "Inside Telegram, through the TheHat bot." },
  { icon: "💵", name: "USDC", text: "Per request, verified on-chain." },
  { icon: "🛡️", name: "Shield wallet", text: "From the Shield app on Solana Seeker." },
];

export default function RecoveryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      {/* Hero */}
      <section className="text-center mb-16">
        <span className="verdict-badge bg-[#8B5CF6]/20 text-[#8B5CF6] mb-4 inline-block">TheHat — Recovery &amp; Forensics</span>
        <h1 className="text-4xl md:text-5xl font-court mb-4">
          <span className="text-[#e8dcc8]">Your funds were stolen.</span>{" "}
          <span className="text-gold glow-gold">Open a case.</span>
        </h1>
        <p className="text-[#e8dcc8]/40 max-w-xl mx-auto text-sm">
          TheHat traces stolen crypto and prepares a report you can send to the exchange and the police.
          Whether they act is their decision. Reporting a theft is free; our fee is 10% of the funds actually
          returned to you, and nothing if none are.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/recovery/report"
            className="px-6 py-3 bg-[#d4a056] text-[#0c0806] font-bold font-court rounded-xl hover:bg-[#d4a056]/90 transition-all text-sm"
          >
            Report a theft
          </Link>
          <Link
            href="/recovery/case"
            className="px-6 py-3 border border-[#d4a056]/20 text-[#d4a056]/70 font-bold font-court rounded-xl hover:border-[#d4a056]/40 hover:text-[#d4a056] transition-all text-sm"
          >
            Check a case
          </Link>
        </div>
        <p className="text-sm text-[#e8dcc8]/60 max-w-2xl mx-auto mt-8 leading-relaxed">{SAFETY}</p>
        <div className="gold-line mt-10 max-w-xs mx-auto" />
      </section>

      {/* How it works */}
      <section className="mb-16">
        <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] text-center mb-8">Procedure</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <div key={s.n} className="wood-card p-5">
              <p className="font-court text-2xl text-gold mb-2">{s.n}</p>
              <h3 className="font-court text-lg text-[#e8dcc8] mb-2">{s.title}</h3>
              <p className="text-xs text-[#e8dcc8]/40 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="mb-16">
        <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] text-center mb-8">Services</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICES.map((s) => {
            const st = STATUS_LABELS[s.status];
            const cls =
              "block w-full text-center py-2.5 rounded-xl text-sm font-bold font-court transition-all border border-[#d4a056]/20 text-[#d4a056]/70 hover:border-[#d4a056]/40 hover:text-[#d4a056]";
            return (
              <div key={s.slug} className="wood-card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{s.icon}</span>
                  <span className="verdict-badge" style={{ background: `${st.color}20`, color: st.color }}>
                    {st.label}
                  </span>
                </div>
                <h3 className="font-court text-lg text-gold mb-1">{s.name}</h3>
                <p className="text-xs text-[#e8dcc8]/50 mb-4 leading-relaxed">{s.tagline}</p>
                <ul className="space-y-2 text-xs text-[#e8dcc8]/40 mb-5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <span className="text-[#d4a056]">✓</span> {p}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] font-mono text-[#d4a056]/60 uppercase tracking-wider mt-auto mb-3">{s.billing}</p>
                {s.href && <Link href={s.href} className={cls}>{s.cta}</Link>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment rails */}
      <section className="mb-12">
        <p className="font-court text-sm text-[#d4a056]/60 uppercase tracking-[0.3em] text-center mb-8">Planned payment methods</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {RAILS.map((r) => (
            <div key={r.name} className="wood-card p-5 text-center">
              <span className="text-3xl block mb-3">{r.icon}</span>
              <h3 className="font-court text-lg text-[#e8dcc8] mb-1">{r.name}</h3>
              <p className="text-xs text-[#e8dcc8]/40">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-[#e8dcc8]/50 max-w-2xl mx-auto leading-relaxed mb-3">
        For paid reports and Shield only — never for opening a recovery case.
      </p>
      <p className="text-center text-xs text-[#e8dcc8]/60 max-w-2xl mx-auto leading-relaxed">
        {NOT_A_COURT}{" "}
        <Link href="/privacy" className="text-[#d4a056] hover:underline">Privacy notice</Link>
      </p>
    </div>
  );
}
