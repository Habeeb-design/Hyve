export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">

      {/* Header */}
      <div className="mb-16">
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-4">
          about hyve
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          The on-chain credit union
          <br />
          <span className="text-accent">for the other 99%.</span>
        </h1>
        <p className="text-white/60 text-lg leading-relaxed">
          Hyve is an employer-sponsored financial wellness platform built on the
          XRP Ledger. It gives small and mid-sized businesses a way to offer
          real financial benefits to their workers — emergency loans, savings
          accounts, and portable credit history — without banking infrastructure,
          federal charters, or capital from the employer.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent mb-16" />

      {/* The problem */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-4">The problem</h2>
        <p className="text-white/60 leading-relaxed mb-4">
          Most hourly workers at small businesses live paycheck to paycheck. When
          an emergency hits — a medical bill, a broken car, a rent gap — their
          options are limited to payday loans at 300%+ APR, high-interest credit
          cards, or simply going without.
        </p>
        <p className="text-white/60 leading-relaxed">
          Meanwhile, small businesses can't afford the benefits that large
          corporations offer — 401k matching, salary advance programs, emergency
          funds. The infrastructure to run a real credit union requires a federal
          charter, legal overhead, and significant capital. That's out of reach
          for a 50-person restaurant, a construction company, or a retail shop.
        </p>
      </div>

      {/* How it works */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-6">How hyve works</h2>
        <div className="space-y-6">
          {[
            {
              n: "01",
              title: "Employer creates a vault",
              body: "Using XRPL's Single Asset Vault (XLS-65), an employer spins up a company vault in minutes. They issue on-chain employee credentials (XLS-70) to their team — no bank, no charter, no capital required.",
            },
            {
              n: "02",
              title: "Employees pool savings",
              body: "Workers deposit a portion of their paycheck in RLUSD into the shared vault. They receive vault shares representing their stake. Idle capital earns yield while it sits.",
            },
            {
              n: "03",
              title: "Emergency loans at fair rates",
              body: "Credentialed employees can draw from the pool via XRPL's Lending Protocol (XLS-66) at 5–8% APR — not 300%. No credit score, no SSN, no bank account needed. Just a wallet and an employer credential.",
            },
            {
              n: "04",
              title: "Repayment builds credit",
              body: "Repayments are deducted automatically. When a loan is fully repaid, an on-chain 'creditworthy' credential is issued to that wallet — portable, permanent reputation that follows the worker, not their bank.",
            },
          ].map((item) => (
            <div key={item.n} className="flex gap-6">
              <span className="text-accent font-mono text-sm pt-1 shrink-0 w-6">
                {item.n}
              </span>
              <div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent mb-14" />

      {/* Built on XRPL */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-4">Built on XRPL</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Every action on Hyve is a real on-chain transaction on the XRP Ledger
          Devnet. We combine multiple XRPL primitives into a single coherent
          product:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { tag: "XLS-65", label: "Single Asset Vault", desc: "Pools employee deposits and manages vault shares" },
            { tag: "XLS-66", label: "Lending Protocol", desc: "Fixed-term uncollateralized loans with interest schedules" },
            { tag: "XLS-70", label: "Credentials", desc: "On-chain proof of employment and creditworthiness" },
            { tag: "RLUSD", label: "Stablecoin", desc: "All flows denominated in RLUSD for stability" },
          ].map((p) => (
            <div key={p.tag} className="bg-card-bg border border-card-border rounded-xl p-4">
              <span className="text-accent text-xs font-mono font-semibold">{p.tag}</span>
              <p className="text-sm font-medium mt-1 mb-1">{p.label}</p>
              <p className="text-white/50 text-xs">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why it matters */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Why it matters</h2>
        <p className="text-white/60 leading-relaxed mb-4">
          Credit unions require federal charters. Hyve needs none. The employer
          is the trust anchor — they already know who their employees are. That
          relationship becomes the social collateral that makes uncollateralized
          lending work. Workers have skin in the game: their job, their
          reputation, their vault shares.
        </p>
        <p className="text-white/60 leading-relaxed">
          The system self-reinforces. Workers who repay earn better credentials.
          Better credentials unlock higher credit limits. A financially stable
          workforce is more productive and less likely to leave. The employer
          benefits without spending a dollar on the pool itself.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/employer"
          className="bg-accent text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-accent-light transition-colors text-center"
        >
          Create a vault
        </a>
        <a
          href="/employee"
          className="border border-card-border px-6 py-3 rounded-xl text-sm hover:border-accent/50 transition-colors text-center"
        >
          Employee portal
        </a>
      </div>

    </div>
  );
}
