import React from 'react';
import { Sparkles, Check, Ban, Zap, MonitorPlay, Film, Wallet, AlertCircle } from 'lucide-react';
import { UserWallet } from '../types';

interface PremiumSubscriptionViewProps {
  wallet: UserWallet;
  isPremium: boolean;
  onToggleSubscription: () => void;
  isAdmin: boolean;
}

export default function PremiumSubscriptionView({
  wallet,
  isPremium,
  onToggleSubscription,
  isAdmin
}: PremiumSubscriptionViewProps) {
  const premiumBenefits = [
    {
      icon: Ban,
      title: '100% Ad-Free Streaming',
      desc: 'Completely blocks pre-rolls, mid-rolls, and sponsor overlay banners across all stream contents.',
      color: 'text-red-400'
    },
    {
      icon: MonitorPlay,
      title: 'Full Ultra High Definition',
      desc: 'Access pristine 1080p stream modes, high bitrate playback, and responsive frame rates.',
      color: 'text-emerald-400'
    },
    {
      icon: Film,
      title: 'Cinema Long Play Wide',
      desc: 'Unlocks exclusive theatrical wide letterboxing crop rendering and ambient color grade filtering.',
      color: 'text-amber-400'
    },
    {
      icon: Zap,
      title: 'Double Mining Multipliers',
      desc: 'Mine up to 2x more PPL platform utility tokens during live stream viewing activities.',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="premium-view-panel">
      {/* Header Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121216] via-[#09090b] to-[#1a150c] p-6 md:p-8 border border-gold-500/15 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-3 relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 text-[10px] font-black tracking-widest uppercase border border-gold-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> PLATFORM EXPERIENCE
          </span>
          <h1 className="text-xl md:text-3xl font-bold font-serif text-white tracking-tight leading-tight">
            Utube Media <span className="text-gold-400">Premium Pass</span>
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Elevate your cinematic views. Eliminate ads, support artists directly via smart-contract distributions, and enjoy pristine High-Definition sound syntheses.
          </p>
        </div>

        <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[200px] w-full md:w-auto relative z-10">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Pricing</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono text-gold-400">99</span>
            <span className="text-xs font-semibold text-zinc-300">PPL</span>
            <span className="text-xs text-zinc-500 font-mono ml-1">/ month</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono mt-0.5">≈ ${(99 * 0.1).toFixed(2)} USD</span>
        </div>
      </div>

      {/* Subscription Status Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wallet balance info */}
        <div className="bg-[#0f0f12]/60 border border-zinc-900 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Available Balance</span>
            <p className="text-lg font-bold font-mono text-zinc-100">{wallet.balancePPL.toLocaleString()} PPL</p>
            <p className="text-[10px] text-zinc-500 font-mono">Address: {wallet.address.substring(0, 8)}...{wallet.address.substring(34)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gold-500/5 border border-gold-500/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-gold-500/70" />
          </div>
        </div>

        {/* Subscription state controls */}
        <div className="bg-[#0f0f12]/60 border border-zinc-900 rounded-2xl p-5 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Subscription Status</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPremium ? 'bg-gold-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                <p className="text-sm font-bold text-zinc-100">{isPremium ? 'Active Premium' : 'Free Account'}</p>
              </div>
            </div>
            
            <button
              onClick={onToggleSubscription}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPremium
                  ? 'bg-zinc-900 border border-zinc-800 text-red-400 hover:bg-zinc-850 hover:border-red-500/20'
                  : 'bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black shadow-md shadow-gold-500/10'
              }`}
            >
              {isPremium ? 'Cancel Premium' : 'Subscribe for 99 PPL'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin status banner */}
      {isAdmin && (
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3.5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-[11px] text-zinc-300">
            <span className="font-bold text-amber-400">Admin Mode Active:</span> Because you are a verified creator / admin of this sandbox, ads are automatically disabled for you by default, regardless of subscription status!
          </p>
        </div>
      )}

      {/* Benefits Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase text-zinc-400 tracking-widest font-mono">Premium Pass Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {premiumBenefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="bg-[#0a0a0d] border border-zinc-900 hover:border-zinc-800 transition-colors p-4.5 rounded-2xl flex gap-4">
                <div className={`w-9 h-9 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-900 flex-shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${b.color}`} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-zinc-100">{b.title}</h3>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
