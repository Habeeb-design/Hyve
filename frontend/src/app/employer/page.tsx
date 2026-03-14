"use client";

import { useState } from "react";
import { api, EXPLORER } from "@/lib/api";

interface Employee {
  name: string;
  address: string;
  seed: string;
  rlusdBalance: number;
  shares: number;
  credentials: string[];
}

interface Loan {
  id: string;
  borrower: string;
  principal: number;
  remaining: string;
  status: string;
}

interface VaultData {
  id: string;
  companyName: string;
  vaultAddress: string;
  employerAddress: string;
  loanBrokerId: string;
  vaultBalance: string;
  totalDeposits: number;
  employees: Employee[];
  loans: Loan[];
}

interface TxHashes {
  vaultCreate?: string;
  loanBroker?: string;
  coverDeposit?: string;
  credentialCreate?: string;
  credentialAccept?: string;
}

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

function TxLink({ hash, label }: { hash: string; label: string }) {
  return (
    <a
      href={EXPLORER(hash)}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-accent hover:underline font-mono"
    >
      {label}: {hash.slice(0, 12)}...
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
        <span className="text-xs text-accent/60 ml-auto">~15–20s</span>
      </div>
    </div>
  );
}

export default function EmployerDashboard() {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [employer, setEmployer] = useState<{ address: string; seed: string } | null>(null);
  const [vault, setVault] = useState<VaultData | null>(null);
  const [vaultTxHashes, setVaultTxHashes] = useState<TxHashes | null>(null);
  const [companyName, setCompanyName] = useState("Acme Corp");
  const [employeeName, setEmployeeName] = useState("");
  const [lastOnboardTx, setLastOnboardTx] = useState<TxHashes | null>(null);
  const [clawbackTarget, setClawbackTarget] = useState<string>("");
  const [clawbackAmount, setClawbackAmount] = useState("");

  async function handleInit() {
    setLoading("Initializing RLUSD issuer on XRPL Devnet...");
    setError("");
    try {
      await api.init();
      const wallet = await api.createWallet();
      setEmployer({ address: wallet.address, seed: wallet.seed });
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Init failed");
      setLoading("");
    }
  }

  async function handleCreateVault() {
    if (!employer) return;
    setLoading("Creating vault on XRPL Devnet (3 on-chain transactions)...");
    setError("");
    try {
      const result = await api.createVault(employer.seed, companyName);
      setVaultTxHashes(result.txHashes);
      const vaultData = await api.getVault(result.vaultId);
      setVault(vaultData);
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Vault creation failed");
      setLoading("");
    }
  }

  async function handleOnboard() {
    if (!vault || !employeeName) return;
    setLoading(`Onboarding ${employeeName} (wallet + trust line + credential txs)...`);
    setError("");
    try {
      const result = await api.onboardEmployee(vault.id, employeeName);
      setLastOnboardTx(result.txHashes);
      const updated = await api.getVault(vault.id);
      setVault(updated);
      setEmployeeName("");
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Onboarding failed");
      setLoading("");
    }
  }

  async function handleClawback(address: string) {
    if (!vault) return;
    const amt = clawbackAmount ? parseFloat(clawbackAmount) : undefined;
    setLoading(`Clawing back${amt ? ` ${amt} RLUSD` : " all RLUSD"} from ${address.slice(0, 8)}...`);
    setError("");
    try {
      await api.clawback(vault.id, address, amt);
      const updated = await api.getVault(vault.id);
      setVault(updated);
      setClawbackTarget("");
      setClawbackAmount("");
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Clawback failed");
      setLoading("");
    }
  }

  async function handleDefaultLoan(loanId: string) {
    if (!vault) return;
    setLoading("Defaulting loan on-chain...");
    setError("");
    try {
      await api.defaultLoan(vault.id, loanId);
      const updated = await api.getVault(vault.id);
      setVault(updated);
      setLoading("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Default failed");
      setLoading("");
    }
  }

  async function refreshVault() {
    if (!vault) return;
    const updated = await api.getVault(vault.id);
    setVault(updated);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

      {loading && <Spinner text={loading} />}

      {error && (
        <div className="bg-danger/10 border border-danger/30 rounded-lg p-4 mb-6 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Initialize */}
      {!employer && (
        <div className="border border-card-border bg-card-bg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Step 1: Connect to XRPL Devnet</h2>
          <p className="text-foreground/60 mb-4 text-sm">
            Initialize the RLUSD issuer and create your employer wallet.
          </p>
          <button
            onClick={handleInit}
            disabled={!!loading}
            className="bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Initialize
          </button>
        </div>
      )}

      {/* Step 2: Create Vault */}
      {employer && !vault && (
        <div className="border border-card-border bg-card-bg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Step 2: Create Company Vault</h2>
          <div className="text-xs text-foreground/40 mb-4 font-mono break-all">
            Employer: {employer.address}
            <CopyButton text={employer.address} />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="bg-background border border-card-border rounded-lg px-4 py-2 flex-1 text-sm"
            />
            <button
              onClick={handleCreateVault}
              disabled={!!loading}
              className="bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              Create Vault
            </button>
          </div>
          <p className="text-foreground/40 text-xs mt-2">Takes ~15–20s (3 on-chain transactions)</p>
        </div>
      )}

      {/* Vault Dashboard */}
      {vault && (
        <div className="space-y-6">

          {/* Vault Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Company</div>
              <div className="text-xl font-semibold">{vault.companyName}</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Vault Balance (RLUSD)</div>
              <div className="text-xl font-semibold text-accent">{parseFloat(vault.vaultBalance).toFixed(2)}</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Employees</div>
              <div className="text-xl font-semibold">{vault.employees.length}</div>
            </div>
            <div className="border border-card-border bg-card-bg rounded-xl p-5">
              <div className="text-foreground/50 text-sm mb-1">Active Loans</div>
              <div className="text-xl font-semibold">
                {vault.loans.filter((l) => l.status === "active").length}
              </div>
            </div>
          </div>

          {/* Vault IDs */}
          <div className="border border-card-border bg-card-bg rounded-xl p-4 text-xs text-foreground/40 space-y-1">
            <div className="font-mono break-all">
              Vault ID: {vault.id} <CopyButton text={vault.id} />
            </div>
            {vault.loanBrokerId && (
              <div className="font-mono break-all">
                LoanBroker: {vault.loanBrokerId}
              </div>
            )}
            {vaultTxHashes && (
              <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-card-border">
                {vaultTxHashes.vaultCreate && <TxLink hash={vaultTxHashes.vaultCreate} label="VaultCreate" />}
                {vaultTxHashes.loanBroker && <TxLink hash={vaultTxHashes.loanBroker} label="LoanBroker" />}
                {vaultTxHashes.coverDeposit && <TxLink hash={vaultTxHashes.coverDeposit} label="CoverDeposit" />}
              </div>
            )}
          </div>

          {/* Onboard Employee */}
          <div className="border border-card-border bg-card-bg rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Onboard Employee</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Employee Name"
                className="bg-background border border-card-border rounded-lg px-4 py-2 flex-1 text-sm"
              />
              <button
                onClick={handleOnboard}
                disabled={!!loading || !employeeName}
                className="bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Onboard
              </button>
            </div>
            <p className="text-foreground/40 text-xs mt-2">
              Creates wallet · sets RLUSD trust line · funds 1000 RLUSD · issues on-chain credential (~15–20s)
            </p>
            {lastOnboardTx && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {lastOnboardTx.credentialCreate && <TxLink hash={lastOnboardTx.credentialCreate} label="CredentialCreate" />}
                {lastOnboardTx.credentialAccept && <TxLink hash={lastOnboardTx.credentialAccept} label="CredentialAccept" />}
              </div>
            )}
          </div>

          {/* Employee List */}
          {vault.employees.length > 0 && (
            <div className="border border-card-border bg-card-bg rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Employees</h2>
                <button onClick={refreshVault} className="text-accent hover:text-accent-light text-sm transition-colors">
                  Refresh
                </button>
              </div>
              <div className="space-y-3">
                {vault.employees.map((emp) => (
                  <div key={emp.address} className="bg-background/50 border border-card-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-foreground/40 font-mono mt-1 break-all">
                          {emp.address} <CopyButton text={emp.address} />
                        </div>
                        <div className="text-xs text-foreground/30 font-mono mt-1 break-all">
                          Seed: {emp.seed} <CopyButton text={emp.seed} />
                        </div>
                        <div className="text-xs text-danger/60 mt-1">Share seed securely — employee needs this to connect</div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-sm">
                          <span className="text-accent">{emp.rlusdBalance.toFixed(2)}</span>{" "}
                          <span className="text-foreground/50">RLUSD</span>
                        </div>
                        <div className="text-xs text-foreground/50 mt-1">Shares: {emp.shares}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {emp.credentials.map((cred) => (
                        <span
                          key={cred}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            cred === "creditworthy" ? "bg-success/20 text-success" : "bg-accent/20 text-accent"
                          }`}
                        >
                          {cred}
                        </span>
                      ))}
                    </div>

                    {/* Clawback */}
                    {clawbackTarget === emp.address ? (
                      <div className="flex gap-2 mt-3">
                        <input
                          type="number"
                          value={clawbackAmount}
                          onChange={(e) => setClawbackAmount(e.target.value)}
                          placeholder="Amount (leave blank for all)"
                          className="bg-background border border-card-border rounded-lg px-3 py-1.5 text-xs flex-1"
                        />
                        <button
                          onClick={() => handleClawback(emp.address)}
                          disabled={!!loading}
                          className="bg-danger hover:bg-danger/80 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setClawbackTarget("")}
                          className="text-xs text-foreground/50 hover:text-foreground px-3 py-1.5"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClawbackTarget(emp.address)}
                        className="mt-3 text-xs text-danger/60 hover:text-danger transition-colors"
                      >
                        Clawback RLUSD
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loans */}
          {vault.loans.length > 0 && (
            <div className="border border-card-border bg-card-bg rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Loans</h2>
              <div className="space-y-3">
                {vault.loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="bg-background/50 border border-card-border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div className="text-sm font-mono text-foreground/60 break-all">
                          {loan.borrower}
                        </div>
                        <div className="text-xs text-foreground/40 mt-1">
                          Principal: {loan.principal} RLUSD
                        </div>
                        <div className="text-xs text-foreground/40 font-mono mt-1 break-all">
                          ID: {loan.id.slice(0, 16)}...
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <div className="text-sm">
                          Remaining:{" "}
                          <span className={parseFloat(loan.remaining) > 0 ? "text-danger" : "text-success"}>
                            {loan.remaining} RLUSD
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
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
                    </div>
                    {loan.status === "active" && (
                      <button
                        onClick={() => handleDefaultLoan(loan.id)}
                        disabled={!!loading}
                        className="mt-3 text-xs text-danger/60 hover:text-danger transition-colors disabled:opacity-30"
                      >
                        Mark as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
