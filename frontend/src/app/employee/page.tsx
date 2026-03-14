"use client";

import { useState, useEffect } from "react";
import { api, EXPLORER } from "@/lib/api";

interface Loan {
  id: string;
  borrower: string;
  principal: number;
  remaining: string;
  status: string;
  loanInfo?: { PrincipalOutstanding?: string } | null;
}

interface LedgerEntry {
  txHash?: string;
  hash?: string;
  type?: string;
  amount?: string;
  timestamp?: string;
}

const CREDENTIAL_META: Record<string, { color: string; description: string }> = {
  employee: {
    color: "bg-accent/20 text-accent border border-accent/30",
    description: "Verified employee. Required to draw loans.",
  },
  creditworthy: {
    color: "bg-success/20 text-success border border-success/30",
    description: "Proven repayer. Issued on full loan repayment.",
  },
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="text-xs px-2 py-0.5 rounded bg-card-border hover:bg-accent/20 text-foreground/60 hover:text-accent transition-colors ml-2"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function TxLink({ hash }: { hash: string }) {
  return (
    <a
      href={EXPLORER(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-accent hover:underline text-xs"
    >
      {hash.slice(0, 16)}...
    </a>
  );
}

function Spinner({ text }: { text: string }) {
  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6 text-accent">
      <div className="flex items-center gap-2">
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>{text}</span>
        <span className="text-xs text-accent/60 ml-auto">~5–20s</span>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  // Connection
  const [vaultId, setVaultId] = useState("");
  const [employeeSeed, setEmployeeSeed] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [connected, setConnected] = useState(false);

  // Balances
  const [rlusdBalance, setRlusdBalance] = useState(0);
  const [xrpBalance, setXrpBalance] = useState(0);
  const [shares, setShares] = useState(0);
  const [credentials, setCredentials] = useState<string[]>([]);
  const [vaultBalance, setVaultBalance] = useState("0");
  const [loans, setLoans] = useState<Loan[]>([]);

  // Actions
  const [depositAmount, setDepositAmount] = useState("200");
  const [loanAmount, setLoanAmount] = useState("100");
  const [repayAmounts, setRepayAmounts] = useState<Record<string, string>>({});
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [creditworthyCelebration, setCreditworthyCelebration] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"savings" | "loans" | "history">("savings");

  // History
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  // localStorage persistence
  useEffect(() => {
    try {
      const savedVaultId = localStorage.getItem("hyve_vault_id");
      const savedSeed = localStorage.getItem("hyve_employee_seed");
      if (savedVaultId) setVaultId(savedVaultId);
      if (savedSeed) setEmployeeSeed(savedSeed);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (vaultId) localStorage.setItem("hyve_vault_id", vaultId);
      if (employeeSeed) localStorage.setItem("hyve_employee_seed", employeeSeed);
    } catch {}
  }, [vaultId, employeeSeed]);

  function clearSavedCredentials() {
    try {
      localStorage.removeItem("hyve_vault_id");
      localStorage.removeItem("hyve_employee_seed");
    } catch {}
    setVaultId("");
    setEmployeeSeed("");
  }

  async function fetchLedger() {
    if (!vaultId) return;
    setLedgerLoading(true);
    try {
      const data = await api.getVaultLedger(vaultId);
      const entries = Array.isArray(data) ? data : (data.transactions ?? data.ledger ?? []);
      setLedger(entries);
    } catch {}
    finally { setLedgerLoading(false); }
  }

  async function handleConnect() {
    if (!vaultId || !employeeSeed) return;
    setLoading("Loading vault data from XRPL...");
    setError("");
    try {
      const vault = await api.getVault(vaultId);
      const emp = vault.employees.find((e: { seed: string }) => e.seed === employeeSeed);
      if (!emp) throw new Error("Employee not found in this vault — check your seed and vault ID");

      const balances = await api.getBalance(emp.address);

      setEmployeeAddress(emp.address);
      setEmployeeName(emp.name || "");
      setCompanyName(vault.companyName || "");
      setRlusdBalance(balances.rlusd);
      setXrpBalance(balances.xrp);
      setShares(emp.shares || 0);
      setCredentials(balances.credentials);
      setVaultBalance(vault.vaultBalance);
      setLoans(vault.loans.filter((l: Loan) => l.borrower === emp.address));
      setConnected(true);
      setLoading("");

      // Pre-fetch ledger silently
      api.getVaultLedger(vaultId).then((data) => {
        const entries = Array.isArray(data) ? data : (data.transactions ?? data.ledger ?? []);
        setLedger(entries);
      }).catch(() => {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connection failed");
      setLoading("");
    }
  }

  function handleDisconnect() {
    setConnected(false);
    setEmployeeAddress("");
    setEmployeeName("");
    setCompanyName("");
    setRlusdBalance(0);
    setXrpBalance(0);
    setShares(0);
    setCredentials([]);
    setVaultBalance("0");
    setLoans([]);
    setLedger([]);
    setActiveTab("savings");
    setLastTxHash(null);
    setCreditworthyCelebration(false);
    setError("");
  }

  async function refresh() {
    try {
      const vault = await api.getVault(vaultId);
      const emp = vault.employees.find((e: { seed: string }) => e.seed === employeeSeed);
      const balances = await api.getBalance(employeeAddress);
      if (emp) setShares(emp.shares || 0);
      setRlusdBalance(balances.rlusd);
      setXrpBalance(balances.xrp);
      setCredentials(balances.credentials);
      setVaultBalance(vault.vaultBalance);
      setLoans(vault.loans.filter((l: Loan) => l.borrower === employeeAddress));
    } catch {}
  }

  async function handleDeposit() {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    setLoading(`Depositing ${amt} RLUSD to vault...`);
    setError("");
    setLastTxHash(null);
    try {
      const result = await api.deposit(vaultId, employeeSeed, amt);
      if (result.txHash) setLastTxHash(result.txHash);
      await refresh();
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Deposit failed");
      setLoading("");
    }
  }

  async function handleDrawLoan() {
    const amt = parseFloat(loanAmount);
    if (!amt || amt <= 0) return;
    setLoading(`Drawing ${amt} RLUSD loan...`);
    setError("");
    setLastTxHash(null);
    try {
      const result = await api.drawLoan(vaultId, employeeAddress, employeeSeed, amt);
      if (result.txHash) setLastTxHash(result.txHash);
      setLoans((prev) => [...prev, result.loan]);
      await refresh();
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Loan draw failed");
      setLoading("");
    }
  }

  async function handleRepay(loanId: string, fullAmount: string) {
    const amt = parseFloat(repayAmounts[loanId] || fullAmount);
    setLoading(`Repaying ${amt} RLUSD...`);
    setError("");
    setLastTxHash(null);
    setCreditworthyCelebration(false);
    try {
      const result = await api.repayLoan(vaultId, loanId, employeeSeed, amt);
      if (result.txHash) setLastTxHash(result.txHash);
      if (result.credentials?.includes("creditworthy") && !credentials.includes("creditworthy")) {
        setCreditworthyCelebration(true);
      }
      setCredentials(result.credentials || credentials);
      await refresh();
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Repayment failed");
      setLoading("");
    }
  }

  async function handlePayInFull(loanId: string, remaining: string) {
    setRepayAmounts((prev) => ({ ...prev, [loanId]: remaining }));
    await handleRepay(loanId, remaining);
  }

  const activeLoanCount = loans.filter((l) => l.status === "active").length;

  return (
    <div>
      {loading && <Spinner text={loading} />}

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-6 text-danger text-sm">
          {error}
        </div>
      )}

      {creditworthyCelebration && (
        <div className="bg-success/10 border border-success/40 rounded-xl p-5 mb-6 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-success font-semibold text-lg">Loan fully repaid!</div>
          <div className="text-success/70 text-sm mt-1">
            You&apos;ve earned the <strong>creditworthy</strong> on-chain credential.
          </div>
        </div>
      )}

      {lastTxHash && !loading && (
        <div className="bg-card-bg border border-card-border rounded-lg p-3 mb-4 text-xs flex items-center gap-2">
          <span className="text-foreground/50">Tx:</span>
          <TxLink hash={lastTxHash} />
          <span className="text-foreground/30">→ devnet.xrpl.org</span>
        </div>
      )}

      {/* Connect Screen */}
      {!connected && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
          <h1 className="text-6xl font-bold mb-4">
            <span className="text-accent">Employee</span>
          </h1>
          <p className="text-xl text-foreground/70 mb-2 max-w-xl">
            Your company savings vault, on-chain.
          </p>
          <p className="text-foreground/50 mb-10 max-w-md">
            Deposit savings, earn shares, and access emergency loans — all powered by XRPL and RLUSD.
          </p>

          <div className="w-full max-w-md border border-card-border bg-card-bg rounded-xl p-8 text-left space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Vault ID</label>
              <input
                type="text"
                value={vaultId}
                onChange={(e) => setVaultId(e.target.value)}
                placeholder="64-character hex string"
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
              />
              <p className="text-foreground/40 text-xs mt-1.5">
                Provided by your employer — identifies your company&apos;s vault on XRPL.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Wallet Seed</label>
              <input
                type="text"
                value={employeeSeed}
                onChange={(e) => setEmployeeSeed(e.target.value)}
                placeholder="sXXX..."
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-accent transition-colors"
              />
              <p className="text-foreground/40 text-xs mt-1.5">
                Your personal XRPL seed. Keep this private — it signs your transactions.
              </p>
            </div>
            <button
              onClick={handleConnect}
              disabled={!!loading || !vaultId || !employeeSeed}
              className="w-full bg-accent hover:bg-accent-light text-black font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 text-base"
            >
              Sign In
            </button>
            <button
              onClick={clearSavedCredentials}
              className="block text-xs text-foreground/30 hover:text-foreground/60 transition-colors mx-auto w-full text-center"
            >
              Clear saved credentials
            </button>
          </div>

          <div className="mt-12 flex gap-3 text-xs text-foreground/40">
            <span className="bg-card-bg border border-card-border rounded-full px-3 py-1">XRPL Devnet</span>
            <span className="bg-card-bg border border-card-border rounded-full px-3 py-1">RLUSD</span>
            <span className="bg-card-bg border border-card-border rounded-full px-3 py-1">Credentials</span>
          </div>
        </div>
      )}

      {/* Dashboard */}
      {connected && (
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold">{employeeName || "Employee"}</h1>
                <span className="text-xs bg-success/20 text-success border border-success/30 rounded-full px-2 py-0.5">
                  Connected
                </span>
              </div>
              <div className="text-sm text-foreground/50">{companyName}</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-foreground/30 font-mono">
                  {employeeAddress.slice(0, 8)}...{employeeAddress.slice(-6)}
                </span>
                <CopyButton text={employeeAddress} />
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={refresh}
                disabled={!!loading}
                className="text-sm text-accent hover:text-accent-light transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
              <button
                onClick={handleDisconnect}
                className="text-sm text-foreground/30 hover:text-foreground/60 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Your RLUSD</div>
              <div className="text-xl font-semibold text-accent">{rlusdBalance.toFixed(2)}</div>
              <div className="text-foreground/30 text-xs mt-1">RLUSD</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Your XRP</div>
              <div className="text-xl font-semibold">{xrpBalance.toFixed(2)}</div>
              <div className="text-foreground/30 text-xs mt-1">for tx fees</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Vault Pool</div>
              <div className="text-xl font-semibold text-accent">{parseFloat(vaultBalance).toFixed(2)}</div>
              <div className="text-foreground/30 text-xs mt-1">RLUSD</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Your Shares</div>
              <div className="text-xl font-semibold">{shares}</div>
              <div className="text-foreground/30 text-xs mt-1">1 share = 1 RLUSD deposited</div>
            </div>
          </div>

          {/* Credentials */}
          <div className="border border-card-border bg-card-bg rounded-xl p-4 mb-6">
            <div className="text-foreground/50 text-sm mb-2">On-Chain Credentials</div>
            <div className="flex gap-2 flex-wrap">
              {credentials.length === 0 && (
                <span className="text-foreground/40 text-sm">None yet</span>
              )}
              {credentials.map((c) => {
                const meta = CREDENTIAL_META[c];
                return (
                  <span
                    key={c}
                    title={meta?.description}
                    className={`text-sm px-3 py-1 rounded-full font-medium cursor-default ${meta?.color ?? "bg-card-border text-foreground/60"}`}
                  >
                    {c}
                  </span>
                );
              })}
            </div>
            {credentials.length > 0 && (
              <div className="mt-2 space-y-1">
                {credentials.map((c) => {
                  const meta = CREDENTIAL_META[c];
                  return meta ? (
                    <p key={c} className="text-xs text-foreground/30">
                      <span className="text-foreground/50 font-medium">{c}:</span> {meta.description}
                    </p>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Tab Bar */}
          <div className="flex border-b border-card-border mb-6">
            {(["savings", "loans", "history"] as const).map((tab) => {
              const label =
                tab === "loans" && activeLoanCount > 0
                  ? `Loans (${activeLoanCount})`
                  : tab.charAt(0).toUpperCase() + tab.slice(1);
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === "history" && ledger.length === 0) fetchLedger();
                  }}
                  className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-accent text-accent"
                      : "border-transparent text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Savings Tab */}
          {activeTab === "savings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card-bg border border-card-border rounded-lg p-4">
                  <div className="text-foreground/50 text-xs mb-1">Your Shares</div>
                  <div className="text-2xl font-semibold">{shares}</div>
                  <div className="text-foreground/30 text-xs mt-1">Each share = 1 RLUSD deposited</div>
                </div>
                <div className="bg-card-bg border border-card-border rounded-lg p-4">
                  <div className="text-foreground/50 text-xs mb-1">Available to Deposit</div>
                  <div className="text-2xl font-semibold text-accent">{rlusdBalance.toFixed(2)}</div>
                  <div className="text-foreground/30 text-xs mt-1">RLUSD in your wallet</div>
                </div>
              </div>

              <div className="border border-card-border bg-card-bg rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-1">Deposit to Vault</h2>
                <p className="text-foreground/40 text-xs mb-1">
                  Pooled deposits back loans for other members. Earn vault shares proportional to your contribution.
                </p>
                <p className="text-foreground/30 text-xs mb-4">Takes ~5–10s on-chain.</p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Amount (RLUSD)"
                    max={rlusdBalance}
                    className="bg-background border border-card-border rounded-lg px-4 py-2 w-40 text-sm"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={!!loading || parseFloat(depositAmount) > rlusdBalance}
                    className="bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Deposit
                  </button>
                </div>
                {parseFloat(depositAmount) > rlusdBalance && (
                  <p className="text-danger text-xs mt-2">Insufficient RLUSD balance</p>
                )}
              </div>
            </div>
          )}

          {/* Loans Tab */}
          {activeTab === "loans" && (
            <div className="space-y-6">
              {/* Active Loans */}
              {loans.length === 0 && (
                <p className="text-foreground/40 text-sm">No active loans. Use the form below to request one.</p>
              )}
              {loans.length > 0 && (
                <div className="border border-card-border bg-card-bg rounded-xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Loans</h2>
                  <div className="space-y-4">
                    {loans.map((loan) => {
                      const outstanding = loan.loanInfo?.PrincipalOutstanding ?? loan.remaining;
                      const outstandingNum = parseFloat(outstanding);
                      return (
                        <div key={loan.id} className="bg-background/50 border border-card-border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-sm">
                                Principal: <span className="text-accent">{loan.principal} RLUSD</span>
                              </div>
                              <div className="text-sm mt-1">
                                Outstanding:{" "}
                                <span className={outstandingNum > 0 ? "text-danger" : "text-success"}>
                                  {outstandingNum.toFixed(2)} RLUSD
                                </span>
                              </div>
                              <div className="text-xs text-foreground/30 font-mono mt-1 break-all">
                                ID: {loan.id.slice(0, 20)}...
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                loan.status === "repaid"
                                  ? "bg-success/20 text-success"
                                  : loan.status === "defaulted"
                                  ? "bg-danger/20 text-danger"
                                  : "bg-accent/20 text-accent"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </div>

                          {loan.status === "active" && outstandingNum > 0 && (
                            <div className="flex gap-2 flex-wrap">
                              <input
                                type="number"
                                value={repayAmounts[loan.id] || ""}
                                onChange={(e) =>
                                  setRepayAmounts((prev) => ({ ...prev, [loan.id]: e.target.value }))
                                }
                                placeholder={`Amount (max ${outstandingNum.toFixed(2)})`}
                                className="bg-background border border-card-border rounded-lg px-3 py-1.5 w-48 text-sm"
                              />
                              <button
                                onClick={() => handleRepay(loan.id, outstanding)}
                                disabled={!!loading}
                                className="bg-success hover:bg-success/80 text-black font-semibold px-5 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                              >
                                Repay
                              </button>
                              <button
                                onClick={() => handlePayInFull(loan.id, outstanding)}
                                disabled={!!loading}
                                className="border border-success text-success hover:bg-success/10 font-semibold px-5 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
                              >
                                Pay in Full
                              </button>
                            </div>
                          )}

                          {loan.status === "repaid" && (
                            <div className="text-success text-sm mt-1">
                              Fully repaid — &quot;creditworthy&quot; credential issued on-chain!
                            </div>
                          )}

                          {loan.status === "defaulted" && (
                            <div className="text-danger text-sm mt-1">
                              This loan was defaulted by the employer.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Draw New Loan */}
              <div className="border border-card-border bg-card-bg rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3">Request Emergency Loan</h2>

                {/* Loan Terms */}
                <div className="bg-background/50 border border-card-border rounded-lg p-4 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div>
                    <div className="text-accent font-semibold text-sm">5% APR</div>
                    <div className="text-foreground/40 text-xs">Annual rate</div>
                  </div>
                  <div>
                    <div className="text-accent font-semibold text-sm">6 payments</div>
                    <div className="text-foreground/40 text-xs">Monthly installments</div>
                  </div>
                  <div>
                    <div className="text-accent font-semibold text-sm">30-day</div>
                    <div className="text-foreground/40 text-xs">Payment intervals</div>
                  </div>
                  <div>
                    <div className="text-accent font-semibold text-sm">7-day grace</div>
                    <div className="text-foreground/40 text-xs">Before default risk</div>
                  </div>
                </div>

                <p className="text-foreground/30 text-xs mb-4">
                  3% early payoff rate if you pay in full before term. Requires the &quot;employee&quot; credential.
                </p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="Amount (RLUSD)"
                    className="bg-background border border-card-border rounded-lg px-4 py-2 w-40 text-sm"
                  />
                  <button
                    onClick={handleDrawLoan}
                    disabled={!!loading || !credentials.includes("employee")}
                    className="bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Draw Loan
                  </button>
                </div>
                {!credentials.includes("employee") && (
                  <p className="text-danger text-xs mt-2">Missing &quot;employee&quot; credential</p>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="border border-card-border bg-card-bg rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Transaction History</h2>
                <button
                  onClick={fetchLedger}
                  disabled={ledgerLoading}
                  className="text-sm text-accent hover:text-accent-light transition-colors disabled:opacity-50"
                >
                  {ledgerLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {ledgerLoading && <Spinner text="Fetching vault ledger..." />}

              {!ledgerLoading && ledger.length === 0 && (
                <p className="text-foreground/40 text-sm">No transactions found for this vault.</p>
              )}

              {ledger.length > 0 && (
                <div className="space-y-2">
                  {ledger.map((entry, i) => {
                    const hash = entry.txHash ?? entry.hash ?? "";
                    return (
                      <div
                        key={hash || i}
                        className="bg-background/50 border border-card-border rounded-lg p-3 flex items-start justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium capitalize">
                            {entry.type ?? "Transaction"}
                          </div>
                          {entry.amount && (
                            <div className="text-xs text-foreground/50 mt-0.5">{entry.amount} RLUSD</div>
                          )}
                          {entry.timestamp && (
                            <div className="text-xs text-foreground/30 mt-0.5">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                        {hash && (
                          <div className="shrink-0">
                            <TxLink hash={hash} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
