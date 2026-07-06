import React, { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, RefreshCw, Send, CheckCircle, Shield, Sparkles } from 'lucide-react';
import { UserWallet, Creator } from '../types';

interface WalletViewProps {
  wallet: UserWallet;
  creators: Creator[];
  onTipCreator: (creatorId: string, amount: number, description: string) => void;
  onSwapETHtoPPL: (ethAmount: number) => void;
}

export default function WalletView({ wallet, creators, onTipCreator, onSwapETHtoPPL }: WalletViewProps) {
  const [selectedCreatorId, setSelectedCreatorId] = useState('');
  const [tipAmount, setTipAmount] = useState('');
  const [tipNote, setTipNote] = useState('');
  const [swapEth, setSwapEth] = useState('');
  const [tipSuccess, setTipSuccess] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  // Constants
  const PPL_RATE = 34000; // 1 ETH = 34,000 PPL platform tokens

  const handleTipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorId || !tipAmount) return;
    const amount = parseFloat(tipAmount);
    if (isNaN(amount) || amount <= 0 || amount > wallet.balancePPL) {
      alert('Invalid amount or insufficient PPL balance!');
      return;
    }
    const creator = creators.find(c => c.id === selectedCreatorId);
    if (!creator) return;

    onTipCreator(selectedCreatorId, amount, tipNote.trim() || `Tipped for brilliant celestial stream`);
    setTipAmount('');
    setTipNote('');
    setTipSuccess(true);
    setTimeout(() => setTipSuccess(false), 3000);
  };

  const handleSwapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!swapEth) return;
    const ethVal = parseFloat(swapEth);
    if (isNaN(ethVal) || ethVal <= 0 || ethVal > wallet.balanceETH) {
      alert('Invalid or insufficient ETH balance!');
      return;
    }

    onSwapETHtoPPL(ethVal);
    setSwapEth('');
    setSwapSuccess(true);
    setTimeout(() => setSwapSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-left animate-in fade-in duration-200" id="wallet-dashboard">
      {/* Page Title */}
      <div className="border-b border-zinc-900/60 pb-3">
        <h1 className="text-lg font-medium font-serif text-zinc-100 flex items-center gap-2 tracking-wide">
          <Wallet className="w-5 h-5 text-gold-500" />
          <span>PLATFORM CRYPTO LEDGER WALLET</span>
        </h1>
        <p className="text-xs text-zinc-500 font-sans">Manage liquidity, execute tip payouts, swap tokens, and monitor blockchain records.</p>
      </div>

      {/* Top balance block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Connection status */}
        <div className="bg-[#0c0c0f] border border-zinc-900/80 rounded-2xl p-4.5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] bg-gold-500/10 text-gold-400 font-mono font-bold px-2 py-0.5 rounded border border-gold-500/20">WEB3 ACTIVE</span>
            <h4 className="text-xs font-semibold text-zinc-300 mt-2">Active Ledger Address</h4>
            <p className="text-[11px] font-mono text-zinc-400 break-all select-all">{wallet.address}</p>
          </div>
          <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-gold-500" /> Secured by Utube Media Smart Contract
          </div>
        </div>

        {/* PPL Platform Token */}
        <div className="bg-[#0c0c0f] border border-zinc-900/80 rounded-2xl p-4.5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 opacity-10 group-hover:opacity-15 transition-opacity">
            <Sparkles className="w-16 h-16 text-gold-500" />
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold tracking-wider">PPL native utility</span>
            <p className="text-2xl font-black text-gold-400 font-mono tracking-tight mt-1">
              {wallet.balancePPL.toLocaleString()} <span className="text-xs font-medium text-zinc-400">PPL</span>
            </p>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            ≈ ${(wallet.balancePPL * 0.1).toFixed(2)} USD • Gas-free platform currency
          </p>
        </div>

        {/* ETH Liquid Crypto */}
        <div className="bg-[#0c0c0f] border border-zinc-900/80 rounded-2xl p-4.5 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold tracking-wider">ETH external liquidity</span>
            <p className="text-2xl font-black text-amber-500 font-mono tracking-tight mt-1">
              {wallet.balanceETH} <span className="text-xs font-medium text-zinc-400">ETH</span>
            </p>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono">
            ≈ ${(wallet.balanceETH * 3400).toLocaleString('en-US', {maximumFractionDigits:2})} USD • Ethereum mainnet balance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creator Tipping Interface */}
        <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900/60 pb-2">
            <Send className="w-4 h-4 text-gold-500" />
            Tip Verified Creator
          </h3>
          <form onSubmit={handleTipSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Select Channel Creator</label>
              <select
                value={selectedCreatorId}
                onChange={(e) => setSelectedCreatorId(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
              >
                <option value="">-- Choose a creator channel --</option>
                {creators.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.subscribers.toLocaleString()} subs)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Tip Amount (PPL)</label>
                <input
                  type="number"
                  placeholder="e.g. 50"
                  value={tipAmount}
                  onChange={(e) => setTipAmount(e.target.value)}
                  min="1"
                  max={wallet.balancePPL}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none focus:border-gold-500/30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Available PPL</label>
                <div className="w-full bg-zinc-950/60 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-400 font-mono">
                  {wallet.balancePPL.toLocaleString()} PPL
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Encouraging Note (Optional)</label>
              <input
                type="text"
                placeholder="Thanks for the heavenly visual! Keep shining!"
                value={tipNote}
                onChange={(e) => setTipNote(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
              />
            </div>

            {tipSuccess && (
              <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="w-3.5 h-3.5" /> Tip successfully signed on platform smart contract! Balance updated.
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedCreatorId || !tipAmount}
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-gold-500/5"
            >
              Sign & Broadcast Tip Payout
            </button>
          </form>
        </div>

        {/* Swap Token Exchange */}
        <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900/60 pb-2">
            <RefreshCw className="w-4 h-4 text-amber-500" />
            Simulated Liquid Swap (ETH ⇄ PPL)
          </h3>
          <form onSubmit={handleSwapSubmit} className="space-y-4">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-550 font-mono">
                <span>YOU PAY</span>
                <span>MAX: {wallet.balanceETH} ETH</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max={wallet.balanceETH}
                  placeholder="0.0"
                  value={swapEth}
                  onChange={(e) => setSwapEth(e.target.value)}
                  className="bg-transparent text-lg font-mono font-bold text-white outline-none w-full"
                />
                <span className="text-sm font-bold font-mono text-zinc-300 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800/80">ETH</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                ↓
              </div>
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-550 font-mono">
                <span>YOU RECEIVE (ESTIMATED)</span>
                <span>RATE: 1 ETH = 34k PPL</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-mono font-bold text-gold-400 w-full">
                  {swapEth ? (parseFloat(swapEth) * PPL_RATE).toLocaleString('en-US', {maximumFractionDigits:0}) : '0'}
                </div>
                <span className="text-sm font-bold font-mono text-gold-400 bg-gold-500/10 px-3 py-1 rounded-lg border border-gold-500/25">PPL</span>
              </div>
            </div>

            {swapSuccess && (
              <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
                <CheckCircle className="w-3.5 h-3.5" /> Swap transaction executed on virtual chain! Added PPL.
              </div>
            )}

            <button
              type="submit"
              disabled={!swapEth}
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-gold-500/5"
            >
              Sign Swap Exchange
            </button>
          </form>
        </div>
      </div>

      {/* Transaction History Ledger Table */}
      <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-4 md:p-5">
        <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest mb-4 border-b border-zinc-900/60 pb-2 flex items-center gap-2">
          <span>Virtual Blockchain Ledger Receipts</span>
          <span className="text-[9px] bg-zinc-900 text-zinc-500 font-mono px-1.5 py-0.5 rounded font-normal">Block #20260703</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]" id="ledger-table">
            <thead>
              <tr className="border-b border-zinc-900/60 text-[10px] font-mono text-zinc-500 uppercase">
                <th className="pb-2.5 font-bold">Tx ID / Type</th>
                <th className="pb-2.5 font-bold">Description</th>
                <th className="pb-2.5 font-bold">Party Details</th>
                <th className="pb-2.5 font-bold">Timestamp</th>
                <th className="pb-2.5 font-bold text-right">Value Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/40 text-xs">
              {wallet.transactions.map((tx) => {
                const isDebit = tx.sender === '0x9a8B...884F';
                return (
                  <tr key={tx.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        {isDebit ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" />
                        )}
                        <div>
                          <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">{tx.type.replace('_', ' ')}</span>
                          <span className="text-[9px] text-zinc-600 block">{tx.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-zinc-300 font-sans">{tx.description}</td>
                    <td className="py-3 font-mono text-[10px] text-zinc-400">
                      <div>
                        <span className="block text-zinc-600">From: {tx.sender}</span>
                        <span className="block text-zinc-600">To: {tx.recipient}</span>
                      </div>
                    </td>
                    <td className="py-3 text-zinc-500 font-mono text-[10px]">{tx.timestamp}</td>
                    <td className={`py-3 text-right font-mono font-bold ${isDebit ? 'text-zinc-500 font-normal' : 'text-gold-400'}`}>
                      {isDebit ? '-' : '+'}{tx.amount.toLocaleString()} {tx.currency}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
