import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Notice — Verdict Court",
  description: "What Verdict Court collects, why, for how long, and your rights.",
};

// Data controller shown in section 1. With no email, the contact link falls back to the Telegram bot.
const CONTROLLER = { name: "The Operator Of Verdict Court", email: "" };
const BOT_URL = "https://t.me/thehatpenbot";
const UPDATED = "October 12, 2026";

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-court text-xl text-gold mb-3">
        {n}. {title}
      </h2>
      <div className="space-y-3 text-sm text-[#e8dcc8]/70 leading-relaxed">{children}</div>
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="font-court text-[#d4a056] uppercase tracking-wider py-2 pr-4 border-b border-[#d4a056]/20 align-bottom">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, i) => (
                <td key={i} className="py-3 pr-4 border-b border-[#d4a056]/10 align-top text-[#e8dcc8]/70">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  const contact = CONTROLLER.email ? (
    <a href={`mailto:${CONTROLLER.email}`} className="text-[#d4a056] hover:underline">{CONTROLLER.email}</a>
  ) : (
    <a href={BOT_URL} target="_blank" rel="noopener" className="text-[#d4a056] hover:underline">the TheHat bot on Telegram</a>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-court text-4xl mb-2">
          <span className="text-gold">Privacy</span>{" "}
          <span className="text-[#e8dcc8]">Notice</span>
        </h1>
        <p className="text-[#e8dcc8]/40 text-sm">Last updated: {UPDATED}</p>
        <div className="gold-line mt-4" />
      </div>

      <div className="wood-card p-5 mb-10 text-sm text-[#e8dcc8]/80 leading-relaxed">
        <p className="font-court text-[#d4a056] mb-2">In short</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>We collect only what you type into our forms, plus the technical data needed to serve the site.</li>
          <li>We use it to handle your case or your subscription. We do not sell it and we do not use it for advertising.</li>
          <li>We never ask for seed phrases, private keys or passwords. Do not send them to us.</li>
          <li>Blockchain transactions are public and permanent. We cannot erase what is on a blockchain.</li>
          <li>You can ask us for a copy of your data, or to correct or delete it, at any time.</li>
        </ul>
      </div>

      <Section n={1} title="Who is responsible for your data">
        <p>
          Verdict Court (court.launchalfred.com) and the TheHat services behind it are operated by{" "}
          {CONTROLLER.name || "the operator of Verdict Court"}, who is the data controller for the processing described
          here.
        </p>
        <p>For any privacy question or request, contact Verdict Court Support through {contact}.</p>
        <p>
          Verdict Court is a private blockchain-analysis service. It is not a court, a law-enforcement agency or a
          regulator.
        </p>
      </Section>

      <Section n={2} title="What we collect, why, and on what legal basis">
        <Table
          head={["When", "Data", "Purpose", "Legal basis (GDPR)"]}
          rows={[
            [
              "You report a theft",
              "Your wallet address, the blockchain, the approximate date, a transaction hash, the amount lost, your description of what happened, and a contact (email or Telegram handle) if you give one.",
              "Open your case, trace the funds, prepare your report, and reach you about the case.",
              "Steps taken at your request before and during a service (Art. 6(1)(b)).",
            ],
            [
              "You submit evidence about an address",
              "The address, your description, and any links you add.",
              "Review the report and investigate the address.",
              "Our legitimate interest in detecting fraud and protecting users (Art. 6(1)(f)).",
            ],
            [
              "You buy or check a Shield plan",
              "Your wallet address, the plan, the payment token, and the transaction signature of your payment.",
              "Verify the payment on-chain, activate the plan, and show you its status.",
              "Performance of the contract with you (Art. 6(1)(b)); accounting obligations (Art. 6(1)(c)).",
            ],
            [
              "You visit the site",
              "IP address, browser type, pages requested, date and time.",
              "Deliver the site, keep it secure, and stop abuse.",
              "Our legitimate interest in running a secure service (Art. 6(1)(f)).",
            ],
          ]}
        />
        <p>
          Only the fields marked as required in a form are needed to use it. A contact is optional: without one, the
          case number is the only way to follow your case.
        </p>
        <p>
          We do not make decisions about you by automated means that produce legal effects, and we do not build
          advertising profiles.
        </p>
      </Section>

      <Section n={3} title="Data about other people">
        <p>
          A theft report or an evidence submission often contains information about someone else, such as the address
          that received stolen funds. We use it to analyse on-chain activity.
        </p>
        <p>
          We do not publish the identity of the person behind an address on this site. Case pages opened from a theft
          report show a status, never a name.
        </p>
        <p>
          Please do not include more personal information about third parties than the case needs, and no identity
          documents.
        </p>
      </Section>

      <Section n={4} title="Blockchain data is public">
        <p>
          Wallet addresses and transactions are recorded on public blockchains that nobody controls. Anyone can read
          them, and they cannot be changed or deleted, by us or by anyone else.
        </p>
        <p>
          Your rights below apply to the records we hold (your case file, your contact, your description), not to the
          blockchain itself.
        </p>
      </Section>

      <Section n={5} title="Who receives your data">
        <p>We do not sell your data. It is shared only with:</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>
            <span className="text-[#e8dcc8]">Hosting and network providers</span> that run the site and the database
            on our behalf, and that process technical data to deliver and protect the service.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Blockchain data providers</span>, which receive the addresses and
            transaction hashes we look up. They do not receive your contact or your description.
          </li>
          <li>
            <span className="text-[#e8dcc8]">An exchange, the police or another authority</span>, only when you ask us
            to send your report to them, or when the law requires us to.
          </li>
        </ul>
        <p>
          Some of these providers are located outside the European Economic Area, including in the United States.
          Where that is the case, the transfer relies on the safeguards provided for by the GDPR, such as an adequacy
          decision or standard contractual clauses.
        </p>
      </Section>

      <Section n={6} title="How long we keep it">
        <Table
          head={["Data", "Kept for"]}
          rows={[
            ["Theft report and case file", "The life of the case, then 30 days after it is closed."],
            ["Contact you gave us", "Deleted when the case is closed. Deleted sooner if you ask."],
            ["Evidence submissions", "While the address concerned is under review. They are anonymous: we store no contact with them."],
            ["Payment records", "The period required by the accounting and tax law that applies to us."],
            ["Technical logs", "The standard retention period of our hosting provider. We keep no copy of them."],
          ]}
        />
        <p>After these periods the data is deleted or made anonymous.</p>
      </Section>

      <Section n={7} title="Your rights">
        <p>Under the GDPR you can, at any time and free of charge:</p>
        <ul className="space-y-1.5 list-disc pl-5">
          <li>ask for a copy of the data we hold about you;</li>
          <li>ask us to correct data that is wrong or incomplete;</li>
          <li>ask us to delete your data, or to restrict how we use it;</li>
          <li>object to processing based on our legitimate interest;</li>
          <li>receive the data you gave us in a portable format;</li>
          <li>withdraw a consent you gave, without affecting what was done before.</li>
        </ul>
        <p>
          Send your request to Verdict Court Support through {contact}. To protect your case, we will ask for your case number, or for a
          message signed with the wallet concerned, before acting on it. We answer within one month.
        </p>
        <p>
          You can also complain to the data protection authority of the country where you live or work.
        </p>
      </Section>

      <Section n={8} title="Security">
        <p>
          Data is sent to us over an encrypted connection and access to case files is restricted. Your case number
          works like a password: anyone who has it can see the status of your case, so keep it private.
        </p>
        <p>
          No system is perfectly secure. If a breach puts your rights at risk, we will tell you and the competent
          authority as the law requires.
        </p>
      </Section>

      <Section n={9} title="Cookies">
        <p>
          This site sets no advertising or tracking cookies. Our network provider may set a strictly necessary cookie
          to protect the site against abuse.
        </p>
      </Section>

      <Section n={10} title="Age">
        <p>These services are not intended for anyone under 18.</p>
      </Section>

      <Section n={11} title="Changes to this notice">
        <p>
          If we change how we use your data, we will update this page and its date. For a significant change we will
          tell you through the contact you gave us, where we have one.
        </p>
      </Section>

      <p className="text-center text-xs text-[#e8dcc8]/40">
        <Link href="/recovery" className="text-[#d4a056] hover:underline">Back to Recovery</Link>
      </p>
    </div>
  );
}
