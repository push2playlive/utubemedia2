import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Play, Trash2, Wallet, Plus, CheckCircle, Package, Lock } from 'lucide-react';
import { Video, StoreProduct, UserWallet, Creator } from '../types';

interface AdminDashboardProps {
  videos: Video[];
  products: StoreProduct[];
  wallet: UserWallet;
  creatorDetails: Creator;
  onDeleteVideo: (videoId: string) => void;
  onAddProduct: (product: Omit<StoreProduct, 'id' | 'creatorId' | 'creatorName' | 'sales'>) => void;
  onWithdrawEarnings: (amount: number) => void;
}

export default function AdminDashboard({
  videos,
  products,
  wallet,
  creatorDetails,
  onDeleteVideo,
  onAddProduct,
  onWithdrawEarnings
}: AdminDashboardProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'videos' | 'products'>('stats');

  // New product form
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodCategory, setProdCategory] = useState<'merch' | 'digital' | 'nft'>('merch');
  const [prodSuccess, setProdSuccess] = useState(false);

  // Filter content matching creatorDetails.id
  const creatorVideos = videos.filter(v => v.creator.id === creatorDetails.id);
  const creatorProducts = products.filter(p => p.creatorId === creatorDetails.id);

  // Aggregate channel statistics
  const totalViews = creatorVideos.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = creatorVideos.reduce((acc, curr) => acc + curr.likes, 0);
  const accruedEarnings = creatorDetails.hasStore 
    ? creatorProducts.reduce((acc, curr) => acc + (curr.sales * curr.price), 0) + 1250 // plus premium subscription revenues
    : 750;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(withdrawAmount);
    if (isNaN(amountVal) || amountVal <= 0 || amountVal > accruedEarnings) {
      alert('Invalid withdrawal request or insufficient accrued earnings!');
      return;
    }

    onWithdrawEarnings(amountVal);
    setWithdrawAmount('');
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please provide a valid product price!');
      return;
    }

    onAddProduct({
      name: prodName.trim(),
      price: priceNum,
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=300',
      description: prodDesc.trim() || 'Official channel collectible gear.',
      stock: isNaN(stockNum) ? 10 : stockNum,
      category: prodCategory
    });

    setProdName('');
    setProdPrice('');
    setProdImage('');
    setProdDesc('');
    setProdSuccess(true);
    setTimeout(() => {
      setProdSuccess(false);
      setActiveSubTab('products');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-left animate-in fade-in duration-200" id="creator-admin-studio">
      {/* Title Header */}
      <div className="border-b border-zinc-900/60 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-medium font-serif text-zinc-100 flex items-center gap-2 tracking-wide">
            <BarChart3 className="w-5.5 h-5.5 text-gold-500" />
            <span>CREATOR ADMIN STUDIO</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-sans">Control live videos, publish store items, review advanced earnings logs, and initiate withdrawals.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800/80">
          {(['stats', 'videos', 'products'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors uppercase font-mono ${activeSubTab === tab ? 'bg-gold-500 text-black shadow font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              {tab === 'stats' ? 'Analytics' : tab}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'stats' && (
        // --- STUDIO ANALYTICS AND EARNINGS GRAPH ---
        <div className="space-y-6">
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#0c0c0f] p-4 rounded-xl border border-zinc-900/80">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Aggregated Views</span>
              <p className="text-xl font-black font-mono text-zinc-100 mt-1">{totalViews.toLocaleString()}</p>
              <span className="text-[9px] text-gold-400 font-mono">▲ +12.4% this week</span>
            </div>
            <div className="bg-[#0c0c0f] p-4 rounded-xl border border-zinc-900/80">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Video Appreciations</span>
              <p className="text-xl font-black font-mono text-zinc-100 mt-1">{totalLikes.toLocaleString()}</p>
              <span className="text-[9px] text-gold-400 font-mono">▲ +8.2% this month</span>
            </div>
            <div className="bg-[#0c0c0f] p-4 rounded-xl border border-zinc-900/80">
              <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">Subscribers</span>
              <p className="text-xl font-black font-mono text-zinc-100 mt-1">{creatorDetails.subscribers.toLocaleString()}</p>
              <span className="text-[9px] text-gold-500 font-mono">● Verified Channel Partner</span>
            </div>
            <div className="bg-[#0c0c0f] p-4 rounded-xl border border-gold-500/10">
              <span className="text-[10px] text-gold-400 uppercase font-mono font-bold block">Total Accrued Revenue</span>
              <p className="text-xl font-black font-mono text-gold-400 mt-1">{accruedEarnings.toLocaleString()} PPL</p>
              <span className="text-[9px] text-zinc-500 font-mono">≈ ${(accruedEarnings * 0.1).toFixed(2)} USD value</span>
            </div>
          </div>

          {/* Custom SVG Analytics Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings over time line graph */}
            <div className="lg:col-span-2 bg-[#0c0c0f]/80 border border-zinc-900/80 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900/60">
                <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest">6-Month Platform Revenue Ledger</h3>
                <span className="text-[10px] text-gold-400 font-mono font-bold">ACCUMULATING STABLE SPLITS</span>
              </div>
              
              {/* High-fidelity custom SVG Area/Line graph */}
              <div className="relative w-full h-44">
                <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" stopOpacity="0.25"/>
                      <stop offset="100%" stopColor="#eab308" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="600" y2="50" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="150" x2="600" y2="150" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Gradient Area */}
                  <path
                    d="M 10 180 Q 120 150 220 120 T 420 80 T 590 30 L 590 200 L 10 200 Z"
                    fill="url(#chartGlow)"
                  />
                  {/* Line path */}
                  <path
                    d="M 10 180 Q 120 150 220 120 T 420 80 T 590 30"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Glowing data nodes */}
                  <circle cx="10" cy="180" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                  <circle cx="120" cy="154" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                  <circle cx="230" cy="116" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                  <circle cx="410" cy="84" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                  <circle cx="590" cy="30" r="5.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                </svg>
                {/* Custom tooltip hover tag */}
                <div className="absolute top-2 right-12 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 text-[10px] font-mono text-zinc-300">
                  June Payout: <span className="text-gold-400 font-bold font-mono">1,480 PPL</span>
                </div>
              </div>

              {/* Month markings */}
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono px-2 pt-1">
                <span>Jan 2026</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun 2026</span>
              </div>
            </div>

            {/* Accrued earnings extraction card */}
            <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-gold-500" /> Withdrawal Settlement
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">Extract your verified PPL content earnings directly to your Web3 crypto address. Settles instantly on the virtual ledger.</p>
              
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-555 font-mono block">AVAILABLE ACCRUED BALANCE</span>
                  <p className="text-lg font-black font-mono text-gold-400">{accruedEarnings.toLocaleString()} PPL</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Amount to Withdraw (PPL)</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="e.g. 500"
                    max={accruedEarnings}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none font-mono focus:border-gold-500/30"
                  />
                </div>

                {withdrawSuccess && (
                  <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[9px] font-medium flex items-center gap-1.5 animate-bounce">
                    <CheckCircle className="w-3.5 h-3.5" /> Withdrawal transaction successfully mined! Wallet balances synchronized.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) > accruedEarnings}
                  className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-gold-500/5"
                >
                  Initiate Ledger Settlement
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'videos' && (
        // --- UPLOADED CONTENT LIST AND DELETE ---
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider border-b border-zinc-850 pb-2">
            Uploaded Content Library ({creatorVideos.length} Videos)
          </h3>
          <div className="space-y-3">
            {creatorVideos.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8 font-mono">No video content registered on this account.</p>
            ) : (
              creatorVideos.map((vid) => (
                <div key={vid.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 rounded-xl gap-3 transition-colors">
                  <div className="flex gap-3.5 items-center overflow-hidden">
                    <img src={vid.thumbnail} alt="" className="w-20 h-11 object-cover rounded border border-zinc-800 flex-shrink-0" />
                    <div className="overflow-hidden">
                      <span className="inline-block px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono rounded">
                        {vid.isShort ? 'Short Play' : 'Long Play'}
                      </span>
                      <h4 className="text-xs font-semibold text-zinc-200 mt-1 truncate">{vid.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{(vid.views).toLocaleString()} views • {vid.uploadDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to permanently delete "${vid.title}" from your ledger?`)) {
                        onDeleteVideo(vid.id);
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-gold-400 hover:bg-gold-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'products' && (
        // --- ADD AND MANAGE PRODUCTS ON THEIR LEASED STORE ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Published products list */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 md:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
              <h3 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">
                Leased Store Catalog ({creatorProducts.length} Items)
              </h3>
              {!creatorDetails.hasStore && (
                <span className="text-[9px] text-amber-500 font-bold font-mono bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Lease Required to Sell
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {creatorProducts.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-8 font-mono">No merchandise published yet. Fill form to deploy.</p>
              ) : (
                creatorProducts.map((prod) => (
                  <div key={prod.id} className="flex justify-between items-center p-3 bg-zinc-950 border border-zinc-850 rounded-xl">
                    <div className="flex gap-3 items-center overflow-hidden">
                      <img src={prod.image} alt="" className="w-12 h-12 object-cover rounded border border-zinc-800 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-200">{prod.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{prod.category.toUpperCase()} • {prod.price} PPL • {prod.stock} left</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-gold-500/10 text-gold-400 font-mono text-[10px] font-bold">
                      {prod.sales} sales
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* New product publish form */}
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-gold-500" /> Deploy Store Merch
            </h3>
            {creatorDetails.hasStore ? (
              <form onSubmit={handleCreateProduct} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-550 uppercase tracking-wider mb-1 font-mono">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Signature Coffee Mug"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-555 uppercase tracking-wider mb-1 font-mono">Price (PPL)</label>
                    <input
                      type="number"
                      placeholder="80"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none focus:border-gold-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-555 uppercase tracking-wider mb-1 font-mono">Stock Count</label>
                    <input
                      type="number"
                      placeholder="50"
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none focus:border-gold-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-555 uppercase tracking-wider mb-1 font-mono">Product Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                    >
                      <option value="merch">Physical Merchandise</option>
                      <option value="digital">Digital Assets / Guides</option>
                      <option value="nft">NFT Proof Token</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-555 uppercase tracking-wider mb-1 font-mono">Product Image URL (Unsplash)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-555 uppercase tracking-wider mb-1 font-mono">Short Description</label>
                  <textarea
                    placeholder="Material, features, or access levels..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none resize-none h-16 focus:border-gold-500/30"
                  />
                </div>

                {prodSuccess && (
                  <div className="p-2 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded text-[9px] font-medium flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" /> Product deployed onto store shelf!
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-gold-500/5"
                >
                  Deploy Item to Store
                </button>
              </form>
            ) : (
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-900 text-center space-y-3.5">
                <p className="text-[11px] text-zinc-500 leading-normal">You must activate an active Store Lease before uploading merchandise items.</p>
                <span className="text-xs block font-bold text-gold-500">Store Lease is Currently Locked</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
