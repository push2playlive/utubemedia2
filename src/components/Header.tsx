import React, { useState } from 'react';
import { Search, Bell, Plus, Wallet, User, Menu, Settings, LogOut, CheckCircle, Store, Shield, Sparkles } from 'lucide-react';
import { UserWallet } from '../types';

interface HeaderProps {
  wallet: UserWallet;
  onNavigate: (view: string, params?: any) => void;
  onOpenUpload: (type: 'long' | 'short') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenProfile: () => void;
  currentUser: { name: string; email: string; avatar: string; isCreator: boolean };
  onToggleMobileMenu?: () => void;
}

export default function Header({
  wallet,
  onNavigate,
  onOpenUpload,
  searchQuery,
  setSearchQuery,
  onOpenProfile,
  currentUser,
  onToggleMobileMenu
}: HeaderProps) {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-[#0a0a0c] px-4 py-2.5 border-b border-zinc-900/80" id="app-header">
      {/* Brand Logo & Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg bg-[#0f0f12] border border-zinc-800 text-zinc-400 hover:text-gold-400 cursor-pointer transition-colors"
            title="Toggle Sidebar Menu"
            id="mobile-hamburger-btn"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        )}
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white font-semibold tracking-tight hover:opacity-90 transition-opacity cursor-pointer group"
          id="logo-button"
        >
          {/* Tactile push-button style logo with 2 outer concentric circles */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-zinc-800/80 bg-[#07070a] shadow-inner">
            {/* Outer circle 1 */}
            <div className="absolute inset-1 rounded-full border border-gold-500/15 bg-zinc-950 flex items-center justify-center">
              {/* Outer circle 2 */}
              <div className="absolute inset-1 rounded-full border border-gold-500/25 bg-zinc-900/60 flex items-center justify-center">
                {/* Core play button */}
                <div className="relative flex items-center justify-center w-5.5 h-5.5 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow shadow-gold-500/20 group-hover:scale-110 active:scale-95 transition-transform duration-150">
                  <svg 
                    className="w-2.5 h-2.5 text-black fill-current translate-x-[0.5px]" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-bold leading-none tracking-wide text-zinc-50 font-serif">
              Push2Play <span className="text-gold-400 text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 bg-gold-500/10 rounded ml-1 border border-gold-500/20">Studio</span>
            </span>
            <span className="text-[9px] text-gold-500/70 font-mono tracking-wider leading-none mt-1">CURATED ART & CINEMA</span>
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative" id="search-form">
        <div className="flex w-full items-center bg-[#0f0f12] border border-zinc-800/80 rounded-full overflow-hidden focus-within:border-gold-500/50 focus-within:ring-1 focus-within:ring-gold-500/30 transition-all">
          <input
            type="text"
            placeholder="Search celestial streams, urban views, or weapon analyses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none"
            id="search-input"
          />
          <button 
            type="submit" 
            className="px-5 py-2 bg-[#0f0f12] border-l border-zinc-800/80 text-zinc-400 hover:text-gold-400 hover:bg-zinc-900 transition-colors"
            id="search-submit-btn"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Action Hub */}
      <div className="flex items-center gap-3">
        {/* Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCreateMenuOpen(!createMenuOpen)}
            onBlur={() => setTimeout(() => setCreateMenuOpen(false), 200)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0f0f12] border border-zinc-800 hover:bg-zinc-900 hover:border-gold-500/30 text-xs font-medium text-zinc-200 transition-all cursor-pointer"
            id="create-dropdown-trigger"
          >
            <Plus className="w-4 h-4 text-gold-500" />
            <span className="hidden sm:inline text-xs font-medium text-zinc-300">Create</span>
          </button>
          {createMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0f0f12] border border-zinc-800/85 rounded-xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50" id="create-menu">
              <button
                onClick={() => {
                  onOpenUpload('long');
                  setCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-gold-500/10 flex items-center justify-center text-gold-500">▶</span>
                Upload Long Play Video
              </button>
              <button
                onClick={() => {
                  onOpenUpload('short');
                  setCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="w-6 h-6 rounded bg-amber-500/10 flex items-center justify-center text-amber-500">⚡</span>
                Upload Short Play Video
              </button>
              <div className="h-px bg-zinc-800/60 my-1"></div>
              <button
                onClick={() => {
                  onNavigate('lease-store');
                  setCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-gold-500" />
                Lease an Online Store
              </button>
              <button
                onClick={() => {
                  onNavigate('advertising');
                  setCreateMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <span className="w-4 h-4 text-amber-500 font-bold text-center leading-none">A</span>
                Create Ad Campaign
              </button>
            </div>
          )}
        </div>

        {/* Crypto Wallet Bar */}
        <div className="relative">
          <button
            onClick={() => setWalletMenuOpen(!walletMenuOpen)}
            onBlur={() => setTimeout(() => setWalletMenuOpen(false), 200)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f0f12] border border-gold-500/20 hover:border-gold-500/40 text-xs font-mono font-medium text-gold-400 transition-all cursor-pointer"
            id="wallet-trigger"
          >
            <Wallet className="w-4 h-4 text-gold-400" />
            <span className="hidden sm:inline">{wallet.balancePPL.toLocaleString()} PPL</span>
            <span className="sm:hidden">{Math.round(wallet.balancePPL / 100) / 10}k</span>
          </button>
          {walletMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0f0f12] border border-zinc-800 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50" id="wallet-menu">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                <span className="text-xs font-semibold text-zinc-400 font-serif">Push2Play Crypto Wallet</span>
                <span className="text-[10px] font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-gold-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span> Connected
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-[#050507] p-2.5 rounded-lg border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono">WALLET ADDRESS</span>
                  <span className="text-xs font-mono text-zinc-300 select-all">{wallet.address}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#050507] p-2.5 rounded-lg border border-zinc-900">
                    <span className="text-[10px] text-zinc-500">PPL PLATFORM</span>
                    <p className="text-sm font-semibold text-gold-400 font-mono mt-0.5">{wallet.balancePPL.toLocaleString()} PPL</p>
                    <span className="text-[9px] text-zinc-500 font-mono">≈ ${(wallet.balancePPL * 0.1).toFixed(2)} USD</span>
                  </div>
                  <div className="bg-[#050507] p-2.5 rounded-lg border border-zinc-900">
                    <span className="text-[10px] text-zinc-500">ETH LIQUIDITY</span>
                    <p className="text-sm font-semibold text-zinc-100 font-mono mt-0.5">{wallet.balanceETH} ETH</p>
                    <span className="text-[9px] text-zinc-500 font-mono">≈ ${(wallet.balanceETH * 3400).toLocaleString('en-US', {maximumFractionDigits:0})} USD</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate('wallet');
                  setWalletMenuOpen(false);
                }}
                className="w-full mt-3 py-2 bg-gradient-to-r from-gold-600 to-amber-600 text-black font-semibold rounded-lg text-xs text-center hover:opacity-90 transition-opacity cursor-pointer"
              >
                Launch Multi-Currency Wallet
              </button>
            </div>
          )}
        </div>

        {/* User Account / Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            onBlur={() => setTimeout(() => setProfileMenuOpen(false), 200)}
            className="relative flex items-center justify-center w-8 h-8 rounded-full border border-zinc-800 hover:border-gold-500/40 transition-all overflow-hidden cursor-pointer bg-zinc-900"
            id="profile-trigger"
          >
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-gold-500 border border-zinc-950 rounded-full"></span>
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-[#0f0f12] border border-zinc-800 rounded-xl shadow-2xl p-1.5 animate-in fade-in slide-in-from-top-2 duration-150 z-50" id="profile-menu">
              <div className="p-2.5 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{currentUser.name}</h4>
                    <p className="text-[10px] text-zinc-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
                {currentUser.isCreator && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 text-[9px] font-semibold mt-2 border border-gold-500/20">
                    <CheckCircle className="w-2.5 h-2.5 text-gold-500" /> VERIFIED CREATOR
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  onNavigate('admin');
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer mt-1"
              >
                <Shield className="w-4 h-4 text-gold-500" />
                Admin Creator Studio
              </button>
              <button
                onClick={() => {
                  onNavigate('store');
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Store className="w-4 h-4 text-gold-400" />
                Online Creator Stores
              </button>
              <button
                onClick={() => {
                  onNavigate('premium');
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Platform Premium Plan
              </button>
              <button
                onClick={() => {
                  onOpenProfile();
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                Profile & Channel Settings
              </button>
              <div className="h-px bg-zinc-800 my-1"></div>
              <button
                onClick={() => {
                  alert('Signing out of demo account');
                  setProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg text-left transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
