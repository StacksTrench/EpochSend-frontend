"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroIllustration from "@/components/HeroIllustration";
import { useWalletContext } from "@/contexts/WalletContext";
import { useCreateEscrow, useExecuteEscrow, useRefundEscrow } from "@/lib/hooks";
import { Calendar, Shield, ArrowRight, Zap, RefreshCw, Lock, CheckCircle2, User } from "lucide-react";
import { useToast } from "@/components/Toast";

interface EscrowItem {
  id: string;
  recipient: string;
  amount: string;
  token: string;
  conditionType: "Timestamp" | "Manual";
  conditionData: string;
  status: "Locked" | "Executed" | "Refunded";
}

import OnboardingModal from "@/components/OnboardingModal";

export default function Home() {
  const { address, connect } = useWalletContext();
  const { createEscrow, isPending: isCreating } = useCreateEscrow();
  const { execute, isPending: isExecuting } = useExecuteEscrow();
  const { refund, isPending: isRefunding } = useRefundEscrow();
  const { showToast } = useToast();

  // Active form states
  const [conditionType, setConditionType] = useState<"Timestamp" | "Manual">("Timestamp");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [unlockDate, setUnlockDate] = useState("");
  const [arbiter, setArbiter] = useState("");

  // Live active escrows list for interaction
  const [escrows, setEscrows] = useState<EscrowItem[]>([
    {
      id: "escrow_1",
      recipient: "GBJ5...9QWX",
      amount: "150.00",
      token: "USDC",
      conditionType: "Timestamp",
      conditionData: "2026-06-01 12:00 UTC",
      status: "Locked",
    },
    {
      id: "escrow_2",
      recipient: "GDH7...3KLA",
      amount: "25.00",
      token: "XLM",
      conditionType: "Manual",
      conditionData: "Arbiter: GC4...39PL",
      status: "Locked",
    },
  ]);

  const handleCreateEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      showToast("Please connect your Freighter wallet first", "error");
      return;
    }
    if (!recipient || !amount) {
      showToast("Please enter a valid recipient and amount", "error");
      return;
    }

    try {
      const dataValue = conditionType === "Timestamp" ? BigInt(new Date(unlockDate).getTime() / 1000) : BigInt(0);
      
      // Invoke the Freighter/Soroban transaction creation
      await createEscrow({
        recipient,
        amount,
        conditionType: conditionType === "Timestamp" ? 0 : 1,
        conditionData: dataValue,
        arbiter: conditionType === "Manual" ? arbiter : "",
      });

      // Add to dynamic client list so the page updates immediately
      const newEscrow: EscrowItem = {
        id: `escrow_${Date.now()}`,
        recipient: recipient.slice(0, 4) + "..." + recipient.slice(-4),
        amount,
        token,
        conditionType,
        conditionData: conditionType === "Timestamp" ? unlockDate : `Arbiter: ${arbiter.slice(0, 4)}...`,
        status: "Locked",
      };

      setEscrows([newEscrow, ...escrows]);
      showToast("Soroban Conditional Escrow created successfully!", "success");
      
      // Reset form
      setRecipient("");
      setAmount("");
      setUnlockDate("");
      setArbiter("");
    } catch (err) {
      showToast("Failed to initialize escrow transaction", "error");
    }
  };

  const handleExecute = async (id: string) => {
    try {
      await execute(id);
      setEscrows(escrows.map(e => e.id === id ? { ...e, status: "Executed" as const } : e));
      showToast("Escrow condition released and funds transferred!", "success");
    } catch (err) {
      showToast("Failed to execute release conditions", "error");
    }
  };

  const handleRefund = async (id: string) => {
    try {
      await refund(id);
      setEscrows(escrows.map(e => e.id === id ? { ...e, status: "Refunded" as const } : e));
      showToast("Escrow funds safely recalled!", "success");
    } catch (err) {
      showToast("Failed to trigger refund", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E05] text-white selection:bg-[#8FA828]/30 selection:text-white">
      <OnboardingModal />
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Presentation & Details */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8FA828]/10 border border-[#8FA828]/20 text-[#a3c22e] text-[10px] uppercase tracking-[0.15em] font-black">
              <Zap size={10} className="animate-pulse" /> Stellar & Soroban
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1] bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent">
              Intent-Based <br />
              <span className="bg-gradient-to-r from-green-400 to-[#8FA828] bg-clip-text text-transparent">
                Conditional Payments
              </span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Securely lock digital assets on-chain. EpochSend automatically triggers disbursements based on strict time rules or trusted manual arbiter releases—fully decentralized, with no middleman.
            </p>
          </div>

          <HeroIllustration />
        </div>

        {/* Right Side: Interactive Create Escrow Dashboard */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Create Escrow Card */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8FA828]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">Create Smart Escrow</h2>
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
                <button
                  type="button"
                  onClick={() => setConditionType("Timestamp")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    conditionType === "Timestamp"
                      ? "bg-[#8FA828] text-black shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Calendar size={12} /> Time Lock
                </button>
                <button
                  type="button"
                  onClick={() => setConditionType("Manual")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                    conditionType === "Manual"
                      ? "bg-[#8FA828] text-black shadow-lg"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Shield size={12} /> Arbiter
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEscrow} className="space-y-6">
              
              {/* Recipient */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                  Recipient Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="G... (Stellar Public Key)"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#8FA828]/50 transition-colors placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Amount & Token */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    required
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8FA828]/50 transition-colors placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Asset
                  </label>
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#8FA828]/50 transition-colors cursor-pointer text-white"
                  >
                    <option value="USDC" className="bg-[#0A0E05]">USDC</option>
                    <option value="XLM" className="bg-[#0A0E05]">XLM</option>
                  </select>
                </div>
              </div>

              {/* Conditional Inputs */}
              {conditionType === "Timestamp" ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Unlock Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8FA828]/50 transition-colors text-white"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
                    Arbiter Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Shield size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      value={arbiter}
                      onChange={(e) => setArbiter(e.target.value)}
                      placeholder="G... (Trusted Third Party Address)"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-[#8FA828]/50 transition-colors placeholder:text-gray-600"
                    />
                  </div>
                </div>
              )}

              {/* Submit / Trigger Button */}
              {address ? (
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-4 bg-[#8FA828] text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#a3c22e] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#8FA828]/10"
                >
                  {isCreating ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <>
                      Initialize Soroban Escrow <ArrowRight size={12} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connect}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  Connect Freighter Wallet
                </button>
              )}
            </form>
          </div>

          {/* Active Escrows Feed */}
          <div className="space-y-4">
            <h3 className="text-md font-bold tracking-tight text-gray-300">My Smart Escrows</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escrows.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-colors relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-500">
                      {item.conditionType} Release
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.status === "Locked"
                          ? "bg-[#8FA828]/10 text-[#a3c22e] border border-[#8FA828]/20"
                          : item.status === "Executed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xl font-black text-white">
                      {item.amount} <span className="text-[#8FA828]">{item.token}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <span className="font-bold">To:</span> {item.recipient}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">
                      {item.conditionData}
                    </div>
                  </div>

                  {item.status === "Locked" && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleExecute(item.id)}
                        disabled={isExecuting}
                        className="py-2 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-white/10 hover:border-white/10 transition-colors flex items-center justify-center gap-1 text-emerald-400"
                      >
                        <CheckCircle2 size={10} /> Release
                      </button>
                      <button
                        onClick={() => handleRefund(item.id)}
                        disabled={isRefunding}
                        className="py-2 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-white/10 hover:border-white/10 transition-colors flex items-center justify-center gap-1 text-red-400"
                      >
                        <Lock size={10} /> Refund
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
