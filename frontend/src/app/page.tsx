"use client";

export default function Home() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,158,11,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="inline-flex items-center gap-2 bg-card-bg border border-card-border rounded-full px-4 py-1.5 text-xs text-foreground/60 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          Live on XRPL Devnet · Built for Ripple Track
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
          The credit union
          <br />
          <span className="text-accent">your team deserves.</span>
        </h1>

        <p className="text-xl text-foreground/60 max-w-2xl mb-4">
          Hyve lets any small business give employees real financial benefits —
          pooled savings, fair-rate emergency loans, and on-chain credit history.
          No bank. No charter. No capital from the employer.
        </p>
        <p className="text-sm text-foreground/40 mb-12">
          Powered by XRPL Single Asset Vault · Lending Protocol · XLS-70 Credentials · RLUSD
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/employer"
            className="bg-accent text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-accent-light transition-colors"
          >
            Set up a vault
          </a>
          <a
            href="/employee"
            className="border border-card-border bg-card-bg px-8 py-3.5 rounded-xl hover:border-accent/60 transition-colors"
          >
            Employee login
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-4 border-t border-card-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4 text-center">
            The problem
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            When emergencies hit,
            <br />workers have nowhere to turn.
          </h2>
          <p className="text-foreground/50 text-center max-w-xl mx-auto mb-16">
            Most SMB employees live paycheck to paycheck. When they need $500,
            their options are brutal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Payday loan", rate: "300%+ APR", color: "text-danger" },
              { label: "Credit card", rate: "25% APR", color: "text-danger" },
              { label: "Hyve vault loan", rate: "5–8% APR", color: "text-success" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card-bg border border-card-border rounded-xl p-6 text-center"
              >
                <p className="text-foreground/50 text-sm mb-3">{item.label}</p>
                <p className={`text-4xl font-bold ${item.color}`}>{item.rate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 border-t border-card-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4 text-center">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            One flow. All primitives.
          </h2>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-card-border" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {[
                {
                  step: "01",
                  title: "Employer creates vault",
                  body: "Spins up a Single Asset Vault (XLS-65) on XRPL Devnet in minutes. Issues employee credentials (XLS-70) to their team.",
                },
                {
                  step: "02",
                  title: "Employees deposit",
                  body: "Workers deposit a slice of their paycheck in RLUSD. They receive vault shares and idle capital earns yield.",
                },
                {
                  step: "03",
                  title: "Emergency loan",
                  body: "Employee draws a loan from the pool (Lending Protocol, XLS-66) — credentialed, uncollateralized, fast.",
                },
                {
                  step: "04",
                  title: "Repayment",
                  body: "Employee repays via payroll deduction. Vault stays healthy. Other workers' capital is protected.",
                },
                {
                  step: "05",
                  title: "Credit earned",
                  body: "Full repayment triggers a 'creditworthy' credential on-chain. Portable, permanent, no bank needed.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-card-bg border border-accent/30 flex items-center justify-center text-accent font-mono text-sm font-bold mb-5 z-10">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-foreground/50 text-sm">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dual value props */}
      <section className="py-24 px-4 border-t border-card-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Built for both sides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Employee */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-8">
              <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-6">
                For employees
              </p>
              <p className="text-2xl font-bold mb-8 leading-snug">
                "Emergency cash at fair rates. Savings that grow. No bank needed."
              </p>
              <ul className="space-y-4 text-sm text-foreground/70">
                {[
                  "Borrow from a pool you contributed to at 5–8% — not 300%",
                  "Auto-save a slice of every paycheck and earn yield",
                  "No credit score, no SSN required — just your wallet",
                  "Build portable on-chain credit history with every repayment",
                  "Works for unbanked and underbanked workers",
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="text-success mt-0.5 shrink-0">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="/employee"
                  className="inline-block border border-card-border hover:border-accent/60 px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Employee portal →
                </a>
              </div>
            </div>

            {/* Employer */}
            <div className="bg-card-bg border border-card-border rounded-2xl p-8">
              <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-6">
                For employers
              </p>
              <p className="text-2xl font-bold mb-8 leading-snug">
                "A real financial benefit for your team that costs you nothing to fund."
              </p>
              <ul className="space-y-4 text-sm text-foreground/70">
                {[
                  "Spin up a vault in minutes — no bank, no charter needed",
                  "Workers fund the pool themselves — zero capital from you",
                  "Financial wellness benefits reduce turnover significantly",
                  "Payroll deduction handles repayments — no HR overhead",
                  "You're the credential issuer, not the lender. No liability.",
                ].map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="text-success mt-0.5 shrink-0">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="/employer"
                  className="inline-block bg-accent text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-accent-light transition-colors"
                >
                  Create a vault →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* XRPL primitives */}
      <section className="py-24 px-4 border-t border-card-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-accent text-sm font-medium uppercase tracking-widest mb-4 text-center">
            Under the hood
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Every XRPL primitive has a job.
          </h2>
          <p className="text-foreground/50 text-center max-w-xl mx-auto mb-16">
            Hyve isn't a single-feature demo. Every primitive does real work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                tag: "XLS-65",
                name: "Single Asset Vault",
                desc: "Pools employee RLUSD deposits. Workers receive vault shares representing their stake.",
              },
              {
                tag: "XLS-66",
                name: "Lending Protocol",
                desc: "Fixed-term, uncollateralized loans drawn from the vault. 5% APR, 6 payments, 30-day intervals.",
              },
              {
                tag: "XLS-70",
                name: "Credentials",
                desc: "Employer issues 'employee' credential on onboarding. Full repayment mints 'creditworthy' on-chain.",
              },
              {
                tag: "RLUSD",
                name: "Stablecoin",
                desc: "All deposits, loans, and repayments are in RLUSD — stable, fast, and programmable.",
              },
              {
                tag: "Devnet",
                name: "Real transactions",
                desc: "Every action is a real on-chain XRPL transaction with a hash you can verify in the explorer.",
              },
              {
                tag: "LoanBroker",
                name: "Trust anchor",
                desc: "The employer-controlled LoanBroker gates who can draw. Credentials are the access control layer.",
              },
            ].map((item) => (
              <div
                key={item.tag}
                className="bg-card-bg border border-card-border rounded-xl p-6 hover:border-accent/40 transition-colors"
              >
                <span className="text-accent text-xs font-mono font-semibold bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5 mb-3 inline-block">
                  {item.tag}
                </span>
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-foreground/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-card-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to run the demo?
          </h2>
          <p className="text-foreground/50 mb-12">
            Employer creates a vault → onboards employees → employees deposit
            and borrow → full repayment earns a credential. End to end, all
            primitives, one flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/employer"
              className="bg-accent text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-accent-light transition-colors"
            >
              Start as employer
            </a>
            <a
              href="/employee"
              className="border border-card-border bg-card-bg px-8 py-3.5 rounded-xl hover:border-accent/60 transition-colors"
            >
              Start as employee
            </a>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-foreground/40">
            {["XRPL Devnet", "RLUSD", "XLS-65 SAV", "XLS-66 Lending", "XLS-70 Credentials"].map(
              (tag) => (
                <span
                  key={tag}
                  className="bg-card-bg border border-card-border rounded-full px-3 py-1"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border py-8 px-4 text-center text-foreground/30 text-sm">
        Hyve · Built for Ripple Track · XRPL Devnet ·{" "}
        <a
          href="https://github.com/Habeeb-design/Hyve"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent transition-colors"
        >
          GitHub
        </a>
      </footer>

    </div>
  );
}
