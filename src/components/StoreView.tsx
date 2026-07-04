import React, { useState } from 'react';
import { Store, ShoppingCart, ShieldAlert, CheckCircle, Tag, AlertCircle, Sparkles, Building, ArrowRight } from 'lucide-react';
import { StoreProduct, StoreLease, UserWallet } from '../types';

interface StoreViewProps {
  products: StoreProduct[];
  leases: StoreLease[];
  wallet: UserWallet;
  onBuyProduct: (product: StoreProduct) => void;
  onLeaseStore: (storeName: string, plan: 'Bronze' | 'Silver' | 'Gold', cost: number) => void;
  creatorMode: boolean;
  viewMode?: 'browse' | 'lease';
}

export default function StoreView({
  products,
  leases,
  wallet,
  onBuyProduct,
  onLeaseStore,
  creatorMode,
  viewMode = 'browse'
}: StoreViewProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'lease'>(viewMode);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'merch' | 'digital' | 'nft'>('all');
  
  // Lease Form State
  const [storeName, setStoreName] = useState('');
  const [leasePlan, setLeasePlan] = useState<'Bronze' | 'Silver' | 'Gold'>('Bronze');
  const [leaseSuccess, setLeaseSuccess] = useState(false);

  const getPlanCost = (plan: 'Bronze' | 'Silver' | 'Gold') => {
    switch (plan) {
      case 'Bronze': return 100;
      case 'Silver': return 250;
      case 'Gold': return 500;
    }
  };

  const handleLeaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    const cost = getPlanCost(leasePlan);
    if (wallet.balancePPL < cost) {
      alert('Insufficient PPL balance in crypto wallet to subscribe to this store lease plan!');
      return;
    }

    onLeaseStore(storeName.trim(), leasePlan, cost);
    setStoreName('');
    setLeaseSuccess(true);
    setTimeout(() => {
      setLeaseSuccess(false);
      setActiveTab('browse');
    }, 2500);
  };

  const filteredProducts = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-left animate-in fade-in duration-200" id="store-ecosystem">
      {/* Header Tabs */}
      <div className="border-b border-zinc-900/60 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-medium font-serif text-zinc-100 flex items-center gap-2 tracking-wide">
            <Store className="w-5.5 h-5.5 text-gold-500" />
            <span>CREATOR STOREFRONT & LEASING ECOSYSTEM</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">Where content meets decentralized commerce. Rent stores, publish products, support favorite artists.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800/80">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'browse' ? 'bg-gold-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('lease')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeTab === 'lease' ? 'bg-gold-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
          >
            Lease a Storefront
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        // --- BROWSE PRODUCTS GRID ---
        <div className="space-y-5">
          {/* Filters shelf */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${categoryFilter === 'all' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-[#0c0c0f] border-zinc-900 text-zinc-400 hover:text-white'}`}
            >
              All Merch & Digital Tools
            </button>
            <button
              onClick={() => setCategoryFilter('merch')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${categoryFilter === 'merch' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-[#0c0c0f] border-zinc-900 text-zinc-400 hover:text-white'}`}
            >
              👕 Physical Apparel & Merch
            </button>
            <button
              onClick={() => setCategoryFilter('digital')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${categoryFilter === 'digital' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-[#0c0c0f] border-zinc-900 text-zinc-400 hover:text-white'}`}
            >
              💿 Digital LUTs & Guides
            </button>
            <button
              onClick={() => setCategoryFilter('nft')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${categoryFilter === 'nft' ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-[#0c0c0f] border-zinc-900 text-zinc-400 hover:text-white'}`}
            >
              🎨 Exclusive NFTs & Collectibles
            </button>
          </div>

          {/* Catalog grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" id="products-catalog">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden flex flex-col group transition-all">
                {/* Product image */}
                <div className="aspect-square bg-zinc-950 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-zinc-900/90 backdrop-blur border border-zinc-800 text-[10px] text-zinc-400 font-mono rounded uppercase">
                    {product.category}
                  </span>
                </div>

                {/* Info block */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-gold-500 font-mono tracking-widest uppercase">{product.creatorName}</span>
                    <h3 className="text-xs font-semibold text-zinc-200 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60">
                    <div>
                      <span className="text-[9px] text-zinc-550 font-mono block">PRICE</span>
                      <span className="text-sm font-bold font-mono text-gold-400">{product.price.toLocaleString()} PPL</span>
                    </div>
                    <button
                      onClick={() => onBuyProduct(product)}
                      className="px-3.5 py-1.5 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-[10px] font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ShoppingCart className="w-3 h-3" /> Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // --- LEASE A STOREFRONT ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Left instructions block */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0c0c0f] border border-zinc-900/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-500" />
                <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-widest font-mono">Unlock Creators Merchandise shelf</h2>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Lease an active storefront integrated directly within your channel stream page! 
                Display hoodies, photography presets, physical models, or certified digital token collectibles. 
                Keep 100% of your earnings, processed entirely on the platform crypto ledger with instant cashouts.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono block">BRONZE LEASE</span>
                  <p className="text-lg font-black font-mono text-zinc-200">100 PPL</p>
                  <span className="text-[9px] text-zinc-400 block">• Showcase up to 3 products</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-gold-500/10 space-y-1 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-gold-500 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-bl">POPULAR</div>
                  <span className="text-[10px] text-gold-400 uppercase font-bold font-mono block">SILVER LEASE</span>
                  <p className="text-lg font-black font-mono text-zinc-200">250 PPL</p>
                  <span className="text-[9px] text-zinc-400 block">• Showcase up to 10 products</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold font-mono block">GOLD LEASE</span>
                  <p className="text-lg font-black font-mono text-zinc-200">500 PPL</p>
                  <span className="text-[9px] text-zinc-400 block">• Unlimited merch products</span>
                </div>
              </div>
            </div>

            {/* Active leases dashboard section */}
            <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1 border-b border-zinc-900/60 pb-2">
                <Building className="w-4 h-4 text-gold-500" /> Current Storefront Leases
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-zinc-900/60 text-[10px] font-mono text-zinc-500 uppercase">
                      <th className="pb-2">Channel Name</th>
                      <th className="pb-2">Leased Store</th>
                      <th className="pb-2">Tier Plan</th>
                      <th className="pb-2">Monthly Rent</th>
                      <th className="pb-2">Date Activated</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40 text-xs">
                    {leases.map((lease) => (
                      <tr key={lease.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 font-semibold text-zinc-300">{lease.creatorName}</td>
                        <td className="py-3 text-zinc-400 font-mono">{lease.storeName}</td>
                        <td className="py-3"><span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] font-mono text-zinc-300">{lease.plan}</span></td>
                        <td className="py-3 font-mono font-bold text-gold-400">{lease.priceMonthly} PPL</td>
                        <td className="py-3 text-zinc-500 font-mono text-[10px]">{lease.leasedDate}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-[9px] font-bold tracking-wider font-mono uppercase">
                            {lease.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Lease Form */}
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1 border-b border-zinc-900/60 pb-2">
              <ShieldAlert className="w-4 h-4 text-gold-500" /> Setup Lease Agreement
            </h3>
            <form onSubmit={handleLeaseSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">My Creator Channel</label>
                <div className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-500 font-mono">
                  Braxtheog9 (Connected Verify account)
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Store Name</label>
                <input
                  type="text"
                  placeholder="e.g. Brax Tech & Apparel"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Select Plan Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Bronze', 'Silver', 'Gold'] as const).map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setLeasePlan(plan)}
                      className={`py-2 rounded-lg text-xs font-semibold cursor-pointer border font-mono transition-all ${leasePlan === plan ? 'bg-gold-500/10 border-gold-500 text-gold-400' : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-white'}`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 space-y-1">
                <span className="text-[9px] text-zinc-550 font-mono">DUE NOW MONTHLY COST</span>
                <p className="text-base font-black font-mono text-gold-400">{getPlanCost(leasePlan)} PPL</p>
                <span className="text-[9px] text-zinc-550 font-mono">Available Balance: {wallet.balancePPL.toLocaleString()} PPL</span>
              </div>

              {leaseSuccess && (
                <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
                  <CheckCircle className="w-3.5 h-3.5" /> Lease agreement signed! Your channel storefront is now live.
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-gold-500/5"
              >
                Sign & Bind Store Lease <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
