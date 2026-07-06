import React, { useState } from 'react';
import { BookOpen, Plus, CheckCircle, TrendingUp, Sparkles, DollarSign, Eye, MousePointerClick, ShieldCheck } from 'lucide-react';
import { AdCampaign, UserWallet } from '../types';

interface AdManagerProps {
  campaigns: AdCampaign[];
  wallet: UserWallet;
  onCreateCampaign: (campaign: Omit<AdCampaign, 'id' | 'views' | 'clicks' | 'budgetSpent'>) => void;
  creatorMonetization: boolean;
  onToggleMonetization: () => void;
}

export default function AdManager({
  campaigns,
  wallet,
  onCreateCampaign,
  creatorMonetization,
  onToggleMonetization
}: AdManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [adSuccess, setAdSuccess] = useState(false);

  // Form State
  const [advertiserName, setAdvertiserName] = useState('');
  const [adTitle, setAdTitle] = useState('');
  const [adType, setAdType] = useState<'video' | 'banner'>('banner');
  const [mediaUrl, setMediaUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [budgetTotal, setBudgetTotal] = useState('');
  const [costPerClick, setCostPerClick] = useState('0.5');

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(budgetTotal);
    const cpcNum = parseFloat(costPerClick);

    if (isNaN(budgetNum) || budgetNum <= 0 || budgetNum > wallet.balancePPL) {
      alert('Invalid budget or insufficient PPL wallet liquidity!');
      return;
    }

    onCreateCampaign({
      advertiserName: advertiserName.trim(),
      title: adTitle.trim(),
      type: adType,
      mediaUrl: mediaUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
      targetUrl: targetUrl.trim() || 'https://utubemedia.live/sponsored',
      budgetTotal: budgetNum,
      status: 'active',
      costPerClick: cpcNum
    });

    // Reset Form
    setAdvertiserName('');
    setAdTitle('');
    setMediaUrl('');
    setTargetUrl('');
    setBudgetTotal('');
    setAdSuccess(true);
    setTimeout(() => {
      setAdSuccess(false);
      setShowCreateForm(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-left animate-in fade-in duration-200" id="ad-campaign-manager">
      {/* Page Title */}
      <div className="border-b border-zinc-900 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-medium font-serif text-zinc-100 flex items-center gap-2 tracking-wide">
            <BookOpen className="w-5.5 h-5.5 text-gold-500" />
            <span>ADVERTISERS CENTER & CREATOR MONETIZATION</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">Bid for placements, configure targeted ad campaigns, and toggle creator monetization splits.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-gold-500/5"
        >
          <Plus className="w-4 h-4" /> {showCreateForm ? 'View Active Ads' : 'Launch New Campaign'}
        </button>
      </div>

      {showCreateForm ? (
        // --- LAUNCH AD FORM ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <form onSubmit={handleCreateAd} className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 md:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2">
              Setup Target Placement Campaign
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Company / Advertiser Name</label>
                <input
                  type="text"
                  placeholder="e.g. Titan Ledger Cold Wallet"
                  value={advertiserName}
                  onChange={(e) => setAdvertiserName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Ad Title Placement</label>
                <input
                  type="text"
                  placeholder="e.g. Secure your spiritual tokens offline"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Display Type</label>
                <select
                  value={adType}
                  onChange={(e) => setAdType(e.target.value as 'video' | 'banner')}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                >
                  <option value="banner">Overlay Banner (Appears under video)</option>
                  <option value="video">Dedicated Short Preroll Video</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Creative Media Image URL (Unsplash)</label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Target Destination URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://ledger.titan/secure-now"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Bid Cost-Per-Click (PPL)</label>
                <select
                  value={costPerClick}
                  onChange={(e) => setCostPerClick(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none focus:border-gold-500/30"
                >
                  <option value="0.5">0.5 PPL / click</option>
                  <option value="1.0">1.0 PPL / click</option>
                  <option value="2.0">2.0 PPL / click (Priority)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Campaign Budget (PPL)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(e.target.value)}
                  min="100"
                  max={wallet.balancePPL}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none focus:border-gold-500/30"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Wallet Liquidity</label>
                <div className="w-full bg-zinc-950/60 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-500 font-mono">
                  {wallet.balancePPL.toLocaleString()} PPL Available
                </div>
              </div>
            </div>

            {adSuccess && (
              <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" /> Ad successfully deployed onto active platform streams! Budget bound.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-xs font-bold transition-all cursor-pointer text-center shadow-md shadow-gold-500/5"
            >
              Sign Contract & Spin Up Campaign
            </button>
          </form>

          {/* Ad tips column */}
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-500" /> Platform Ad Guidelines
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We leverage an embedded banner-overlay and vertical shorts pop-up engine. Your budget will only be debited when active viewers click through to your target link.
            </p>
            <ul className="text-xs text-zinc-550 space-y-2 list-disc pl-4 font-sans">
              <li>High-resolution banner overlay templates.</li>
              <li>A CPC system matching local crypto tokens.</li>
              <li>Toggle placement priority using custom bid costs.</li>
            </ul>
          </div>
        </div>
      ) : (
        // --- VIEW ACTIVE ADS & CREATOR MONETIZATION SLOTS ---
        <div className="space-y-6">
          {/* Creator Monetization Toggle section */}
          <div className="bg-gradient-to-r from-zinc-950 via-[#0c0c0f] to-zinc-950 border border-zinc-900/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-gold-500/10 text-gold-400 font-mono font-bold px-2 py-0.5 rounded border border-gold-500/20 uppercase tracking-wider">Creator Revenue Split</span>
              <h3 className="text-xs font-semibold text-zinc-200 mt-1.5 font-serif tracking-wide">CHANNEL MONETIZATION PROGRAM</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-sans">Enable placements on your uploaded video streams. Earn 60% of CPC bids whenever viewers click on embedded ad banners.</p>
            </div>
            <div className="flex items-center gap-2.5 bg-zinc-950 p-2 border border-zinc-900 rounded-xl">
              <span className="text-xs font-mono font-semibold text-zinc-400">{creatorMonetization ? 'ENABLED split' : 'DISABLED split'}</span>
              <button
                onClick={onToggleMonetization}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${creatorMonetization ? 'bg-gold-500' : 'bg-zinc-800'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${creatorMonetization ? 'left-6' : 'left-1'}`}></span>
              </button>
            </div>
          </div>

          {/* Active ads table and summary */}
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900/60 pb-2">
              <TrendingUp className="w-4 h-4 text-gold-500" /> Active Placement Campaigns
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]" id="ads-table">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-550 uppercase">
                    <th className="pb-2.5">Ad Creative details</th>
                    <th className="pb-2.5">Platform Placements</th>
                    <th className="pb-2.5">Total Budget</th>
                    <th className="pb-2.5">Spent Budget</th>
                    <th className="pb-2.5">CPC Bid</th>
                    <th className="pb-2.5">Performance (Imp / Clicks)</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/40 text-xs">
                  {campaigns.map((ad) => (
                    <tr key={ad.id} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={ad.mediaUrl} alt="" className="w-14 h-9 object-cover rounded border border-zinc-900 flex-shrink-0 bg-zinc-950" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-zinc-500 block font-mono uppercase">{ad.advertiserName}</span>
                            <span className="text-xs font-semibold text-zinc-200 block truncate">{ad.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-zinc-400 uppercase">{ad.type} Placements</td>
                      <td className="py-3 font-mono text-zinc-300">{ad.budgetTotal.toLocaleString()} PPL</td>
                      <td className="py-3 font-mono text-zinc-400">{ad.budgetSpent.toLocaleString()} PPL</td>
                      <td className="py-3 font-mono text-gold-400 font-semibold">{ad.costPerClick} PPL</td>
                      <td className="py-3 font-mono text-[11px] text-zinc-400">
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-zinc-600" /> {ad.views.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5 text-gold-400" /> {ad.clicks.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider font-mono uppercase ${ad.status === 'active' ? 'bg-gold-500/10 text-gold-400' : 'bg-zinc-800 text-zinc-500'}`}>
                          {ad.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
