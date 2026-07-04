import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, Eye, Play, Trash2, Wallet, Plus, 
  CheckCircle, Package, Lock, Shield, Mail, Send, MessageSquare, 
  AlertTriangle, XCircle, Globe, ShieldAlert, Sparkles
} from 'lucide-react';
import { Video, StoreProduct, UserWallet, Creator, AdCampaign, Comment, VideoReport } from '../types';

interface AdminDashboardProps {
  videos: Video[];
  products: StoreProduct[];
  wallet: UserWallet;
  creatorDetails: Creator;
  onDeleteVideo: (videoId: string) => void;
  onAddProduct: (product: Omit<StoreProduct, 'id' | 'creatorId' | 'creatorName' | 'sales'>) => void;
  onWithdrawEarnings: (amount: number) => void;
  
  // Added for Moderator/Administrator panel
  campaigns?: AdCampaign[];
  onUpdateCampaign?: (updated: AdCampaign) => void;
  comments?: Comment[];
  onDeleteComment?: (commentId: string) => void;
  reports?: VideoReport[];
  onUpdateReport?: (updated: VideoReport) => void;
}

export default function AdminDashboard({
  videos,
  products,
  wallet,
  creatorDetails,
  onDeleteVideo,
  onAddProduct,
  onWithdrawEarnings,
  campaigns = [],
  onUpdateCampaign,
  comments = [],
  onDeleteComment,
  reports = [],
  onUpdateReport
}: AdminDashboardProps) {
  // Console Mode Selector Switcher
  const [consoleMode, setConsoleMode] = useState<'creator' | 'moderator'>('moderator'); // default to moderator to highlight the new features!
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'videos' | 'products'>('stats');
  
  // Moderator Sub-Tabs
  type ModTabType = 'ads' | 'videos-mod' | 'comments-mod' | 'reports-mod' | 'messaging';
  const [activeModTab, setActiveModTab] = useState<ModTabType>('reports-mod');

  // Withdrawal States
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // New product form states
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodCategory, setProdCategory] = useState<'merch' | 'digital' | 'nft'>('merch');
  const [prodSuccess, setProdSuccess] = useState(false);

  // Moderator Search Filters
  const [modSearch, setModSearch] = useState('');

  // Member Messaging States
  const mockMembers = [
    { id: 'm_1', name: 'Faith_Walker_26', email: 'faith_walker@gmail.com', subscriptionDate: '2026-06-01', tier: 'Premium Gold' },
    { id: 'm_2', name: 'John_Prophetic_Insight', email: 'john_prophetic@gmail.com', subscriptionDate: '2026-06-15', tier: 'Standard Silver' },
    { id: 'm_3', name: 'CinematicTraveler', email: 'traveler99@gmail.com', subscriptionDate: '2026-07-02', tier: 'Premium Gold' },
    { id: 'm_4', name: 'TechEngineer_Pro', email: 'techeng_pro@gmail.com', subscriptionDate: '2026-05-10', tier: 'Standard Silver' },
    { id: 'm_5', name: 'BraxFan99', email: 'braxfan@gmail.com', subscriptionDate: '2026-07-03', tier: 'Premium Gold' }
  ];

  const [selectedMemberId, setSelectedMemberId] = useState('all');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Sent Messages state with local persistence
  const [sentMessages, setSentMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('ppl_admin_messages');
    return saved ? JSON.parse(saved) : [
      { id: 'msg_1', recipient: 'All Members', subject: 'July Premium Content Update', body: 'Greetings! Our premium study logs and cinematic files are now available. Be sure to sync your mobile wallet.', date: '2026-07-03 14:15', status: 'Delivered' },
      { id: 'msg_2', recipient: 'Faith_Walker_26', subject: 'Study Circle Invitation', body: 'We would love to invite you to join our direct livestream Q&A tomorrow regarding Joshua 3:5.', date: '2026-07-04 09:00', status: 'Delivered' }
    ];
  });

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgSubject.trim() || !msgBody.trim()) return;

    const recipientLabel = selectedMemberId === 'all' 
      ? 'All Members' 
      : mockMembers.find(m => m.id === selectedMemberId)?.name || 'Member';

    const newMsg = {
      id: `msg_${Date.now()}`,
      recipient: recipientLabel,
      subject: msgSubject.trim(),
      body: msgBody.trim(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Delivered'
    };

    const updatedMsgs = [newMsg, ...sentMessages];
    setSentMessages(updatedMsgs);
    localStorage.setItem('ppl_admin_messages', JSON.stringify(updatedMsgs));

    setMsgSubject('');
    setMsgBody('');
    setMsgSuccess(true);
    setTimeout(() => setMsgSuccess(false), 3000);
  };

  const handleApproveAd = (ad: AdCampaign) => {
    if (onUpdateCampaign) {
      onUpdateCampaign({
        ...ad,
        status: 'active' // Ensure it is set to active when approved
      });
      alert(`Ad Campaign "${ad.title}" approved successfully!`);
    }
  };

  const handleRejectAd = (ad: AdCampaign) => {
    if (onUpdateCampaign) {
      onUpdateCampaign({
        ...ad,
        status: 'paused' // Pause the campaign if rejected/disapproved
      });
      alert(`Ad Campaign "${ad.title}" has been suspended/paused.`);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-left animate-in fade-in duration-200" id="creator-admin-studio">
      
      {/* High-Contrast Header Console Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600/10 text-red-500 rounded-lg border border-red-500/20 shadow-md">
              <Shield className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-bold text-zinc-150 flex items-center gap-2">
              <span>PushPlay Administrative Workspace</span>
              <span className="text-[9px] bg-red-500/20 text-red-400 font-mono px-2 py-0.5 rounded-full border border-red-500/10 uppercase tracking-widest">
                Admin Center
              </span>
            </h1>
          </div>
          <p className="text-xs text-zinc-500">Toggle between personal Creator tools and administrative Moderator utilities for platform maintenance.</p>
        </div>

        {/* Core Console Toggle Buttons */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900 shadow-inner w-fit">
          <button
            onClick={() => setConsoleMode('moderator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              consoleMode === 'moderator'
                ? 'bg-red-500 text-black shadow font-black'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Moderator Panel</span>
          </button>
          <button
            onClick={() => setConsoleMode('creator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
              consoleMode === 'creator'
                ? 'bg-gold-500 text-black shadow font-black'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Creator Console</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* --- CONSOLE MODE: MODERATOR & ADMIN --- */}
      {/* ========================================== */}
      {consoleMode === 'moderator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Moderator Console Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-zinc-900/60" id="moderator-tabs">
            <button 
              onClick={() => setActiveModTab('ads')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeModTab === 'ads' 
                  ? 'bg-zinc-900 text-red-400 border border-zinc-850 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Ad Approval Hub</span>
            </button>

            <button 
              onClick={() => setActiveModTab('videos-mod')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeModTab === 'videos-mod' 
                  ? 'bg-zinc-900 text-red-400 border border-zinc-850 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Broadcast Moderation</span>
            </button>

            <button 
              onClick={() => setActiveModTab('comments-mod')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeModTab === 'comments-mod' 
                  ? 'bg-zinc-900 text-red-400 border border-zinc-850 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comment Moderation</span>
            </button>

            <button 
              onClick={() => setActiveModTab('reports-mod')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeModTab === 'reports-mod' 
                  ? 'bg-zinc-900 text-red-400 border border-zinc-850 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Reported Content</span>
            </button>

            <button 
              onClick={() => setActiveModTab('messaging')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeModTab === 'messaging' 
                  ? 'bg-zinc-900 text-red-400 border border-zinc-850 font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Member Dispatcher</span>
            </button>
          </div>

          {/* --- MOD TAB: AD APPROVAL HUB --- */}
          {activeModTab === 'ads' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0f] border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">Ad Campaign Ledger & Approvals</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Approve, monitor, or suspend ad placement campaigns deployed by platform sponsors.</p>
                </div>
                <div className="text-xs text-zinc-400 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900">
                  Total Deployed Campaigns: <span className="text-red-400 font-bold">{campaigns.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((ad) => {
                  const isActive = ad.status === 'active';
                  return (
                    <div key={ad.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-[8px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                              {ad.type}
                            </span>
                            <h4 className="text-xs font-bold text-zinc-100 mt-1.5">{ad.title}</h4>
                            <p className="text-[10px] text-zinc-500">Advertiser: <span className="font-semibold text-zinc-400">{ad.advertiserName}</span></p>
                          </div>
                          
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border uppercase tracking-wider ${
                            isActive 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {isActive ? 'Approved' : 'Paused / Pending'}
                          </span>
                        </div>

                        {ad.mediaUrl && (
                          <div className="aspect-video w-full rounded overflow-hidden bg-zinc-900 border border-zinc-900">
                            <img src={ad.mediaUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 bg-[#050507] p-2.5 rounded-xl border border-zinc-900/60 text-[10px] font-mono">
                          <div>
                            <span className="text-zinc-550 block text-[8px] uppercase font-bold">Views</span>
                            <span className="text-zinc-300 font-bold">{(ad.views || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-550 block text-[8px] uppercase font-bold">Clicks</span>
                            <span className="text-zinc-300 font-bold">{(ad.clicks || 0).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-555 block text-[8px] uppercase font-bold">Budget Spent</span>
                            <span className="text-gold-400 font-bold">{ad.budgetSpent} / {ad.budgetTotal} PPL</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-zinc-900 text-xs">
                        {isActive ? (
                          <button
                            onClick={() => handleRejectAd(ad)}
                            className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-amber-500 hover:text-amber-400 border border-zinc-850 rounded-lg font-bold cursor-pointer transition-colors text-[11px] flex items-center justify-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Suspend Placement</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveAd(ad)}
                            className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold cursor-pointer transition-colors text-[11px] flex items-center justify-center gap-1 shadow shadow-red-600/15"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve Campaign</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- MOD TAB: BROADCAST MODERATION --- */}
          {activeModTab === 'videos-mod' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0f] border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">Broadcast Content Moderation</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Inspect and instantly take down any active streams or vertical clips violating guidelines.</p>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Filter streams by title/creator..." 
                  value={modSearch}
                  onChange={(e) => setModSearch(e.target.value)}
                  className="bg-zinc-950 text-xs border border-zinc-900 rounded-xl px-3 py-1.5 text-zinc-200 outline-none w-full md:max-w-xs focus:border-red-500/20"
                />
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                        <th className="p-4">Stream Content</th>
                        <th className="p-4">Broadcaster / Channel</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Upload Date</th>
                        <th className="p-4">Views</th>
                        <th className="p-4 text-center">Safety Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {videos
                        .filter(v => 
                          v.title.toLowerCase().includes(modSearch.toLowerCase()) || 
                          v.creator.name.toLowerCase().includes(modSearch.toLowerCase())
                        )
                        .map((vid) => (
                          <tr key={vid.id} className="hover:bg-zinc-900/10 transition-colors">
                            <td className="p-4 max-w-xs">
                              <div className="flex gap-3 items-center">
                                <img src={vid.thumbnail} alt="" className="w-16 aspect-video object-cover rounded border border-zinc-900" />
                                <div className="min-w-0">
                                  <h4 className="font-bold text-zinc-200 truncate leading-snug">{vid.title}</h4>
                                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">{vid.category}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 whitespace-nowrap text-zinc-300 font-semibold">
                              {vid.creator.name}
                            </td>
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border uppercase tracking-wider ${
                                vid.isShort 
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/15' 
                                  : 'bg-blue-500/10 text-blue-400 border-blue-500/15'
                              }`}>
                                {vid.isShort ? 'Short Clip' : 'Cinema Stream'}
                              </span>
                            </td>
                            <td className="p-4 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                              {vid.uploadDate}
                            </td>
                            <td className="p-4 whitespace-nowrap font-mono text-zinc-300">
                              {(vid.views).toLocaleString()}
                            </td>
                            <td className="p-4 whitespace-nowrap text-center">
                              <button
                                onClick={() => {
                                  if (confirm(`CRITICAL: Are you absolutely sure you want to permanently delete and restrict "${vid.title}" across the network? This is irreversible.`)) {
                                    onDeleteVideo(vid.id);
                                  }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-black border border-red-950 hover:border-red-500 rounded-lg cursor-pointer transition-all text-[11px] font-bold"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Platform Takedown</span>
                              </button>
                            </td>
                          </tr>
                        ))}

                      {videos.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-zinc-500 font-mono">
                            No matching stream files in database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- MOD TAB: COMMENT MODERATION --- */}
          {activeModTab === 'comments-mod' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0f] border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">Comment Thread Moderation</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Review and purge user messages or spam posts across the social channels.</p>
                </div>
                
                <input 
                  type="text" 
                  placeholder="Filter comments by user/text..." 
                  value={modSearch}
                  onChange={(e) => setModSearch(e.target.value)}
                  className="bg-zinc-950 text-xs border border-zinc-900 rounded-xl px-3 py-1.5 text-zinc-200 outline-none w-full md:max-w-xs focus:border-red-500/20"
                />
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                        <th className="p-4">Sender Profile</th>
                        <th className="p-4">Comment Text</th>
                        <th className="p-4">Video Link</th>
                        <th className="p-4">Posted Date</th>
                        <th className="p-4">Appreciations</th>
                        <th className="p-4 text-center">Safety Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {comments
                        .filter(c => 
                          c.userName.toLowerCase().includes(modSearch.toLowerCase()) || 
                          c.text.toLowerCase().includes(modSearch.toLowerCase())
                        )
                        .map((com) => {
                          const targetVid = videos.find(v => v.id === com.videoId);
                          return (
                            <tr key={com.id} className="hover:bg-zinc-900/10 transition-colors">
                              <td className="p-4 whitespace-nowrap">
                                <div className="flex gap-2 items-center">
                                  <img 
                                    src={com.userAvatar.startsWith('http') ? com.userAvatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                                    alt="" 
                                    className="w-7 h-7 rounded-full object-cover border border-zinc-800" 
                                  />
                                  <span className="font-bold text-zinc-200">{com.userName}</span>
                                </div>
                              </td>
                              <td className="p-4 max-w-sm">
                                <p className="text-zinc-350 line-clamp-2 leading-relaxed whitespace-pre-wrap">{com.text}</p>
                              </td>
                              <td className="p-4 whitespace-nowrap text-zinc-450 font-medium">
                                <span className="text-[10px] text-zinc-400 underline line-clamp-1 max-w-[150px]" title={targetVid?.title || 'Unknown video'}>
                                  {targetVid?.title || com.videoId}
                                </span>
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                                {com.timestamp}
                              </td>
                              <td className="p-4 whitespace-nowrap font-mono text-zinc-300">
                                {com.likes} likes
                              </td>
                              <td className="p-4 whitespace-nowrap text-center">
                                <button
                                  onClick={() => {
                                    if (confirm('Are you sure you want to permanently delete this comment from the database?')) {
                                      if (onDeleteComment) onDeleteComment(com.id);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-black border border-red-950 hover:border-red-500 rounded-lg cursor-pointer transition-all text-[11px] font-bold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Moderate/Purge</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                      {comments.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-zinc-500 font-mono">
                            No active comment listings found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- MOD TAB: REPORT REVIEW HUB --- */}
          {activeModTab === 'reports-mod' && (
            <div className="space-y-4">
              <div className="bg-[#0c0c0f] border border-zinc-900 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-xs font-bold font-mono text-zinc-300 uppercase tracking-wider">Flagged Content Reports Ledger</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Review, investigate, and act on user flags or complaints about video broadcast streams.</p>
                </div>
                <div className="text-xs text-zinc-400 font-mono bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900">
                  Pending Review: <span className="text-red-400 font-bold">{reports.filter(r => r.status === 'pending').length}</span>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                        <th className="p-4">Report Details</th>
                        <th className="p-4">Flagged Video</th>
                        <th className="p-4">Reason for Flag</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Submitted Date</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {reports.map((rep) => {
                        const targetVid = videos.find(v => v.id === rep.videoId);
                        return (
                          <tr key={rep.id} className="hover:bg-zinc-900/10 transition-colors">
                            <td className="p-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-zinc-200">By: {rep.reporterName}</span>
                                <span className={`w-fit px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                                  rep.status === 'pending'
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/15'
                                    : rep.status === 'resolved'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {rep.status}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 max-w-xs">
                              {targetVid ? (
                                <div className="flex gap-2.5 items-center">
                                  <img src={targetVid.thumbnail} alt="" className="w-14 aspect-video object-cover rounded border border-zinc-900" />
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-zinc-300 truncate leading-snug">{targetVid.title}</h5>
                                    <span className="text-[9px] text-zinc-500 block">Creator: {targetVid.creator.name}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-zinc-500 font-mono italic">Video Deleted / Unavailable ({rep.videoId})</span>
                              )}
                            </td>
                            <td className="p-4 whitespace-nowrap font-semibold text-zinc-200">
                              {rep.reason}
                            </td>
                            <td className="p-4 max-w-xs">
                              <p className="text-zinc-400 line-clamp-2 leading-relaxed">{rep.details || 'No additional comments provided.'}</p>
                            </td>
                            <td className="p-4 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                              {rep.timestamp}
                            </td>
                            <td className="p-4 whitespace-nowrap text-center">
                              {rep.status === 'pending' ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  {targetVid && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`CRITICAL: Are you absolutely sure you want to permanently delete and restrict "${targetVid.title}" across the network? This will resolve the report.`)) {
                                          onDeleteVideo(targetVid.id);
                                          if (onUpdateReport) {
                                            onUpdateReport({
                                              ...rep,
                                              status: 'resolved'
                                            });
                                          }
                                        }
                                      }}
                                      className="px-2 py-1 bg-red-950/20 hover:bg-red-650 text-red-400 hover:text-white border border-red-950 hover:border-red-500 rounded-lg cursor-pointer transition-all text-[11px] font-semibold"
                                    >
                                      Takedown Content
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      if (onUpdateReport) {
                                        onUpdateReport({
                                          ...rep,
                                          status: 'dismissed'
                                        });
                                      }
                                    }}
                                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg cursor-pointer transition-all text-[11px] font-semibold"
                                  >
                                    Dismiss Report
                                  </button>
                                </div>
                              ) : (
                                <span className="text-zinc-550 font-mono">Completed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {reports.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-zinc-500 font-mono">
                            No flagged reports in database ledger.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- MOD TAB: MEMBER DISPATCHER --- */}
          {activeModTab === 'messaging' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Composing form */}
              <div className="lg:col-span-1 bg-[#0c0c0f]/85 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-red-500" /> Dispatch Member Message
                </h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Compose a direct secure bulletin or broadcast alert and publish it to the selected verified members.</p>
                
                <form onSubmit={handleSendMessage} className="space-y-3.5">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Target Recipients</label>
                    <select
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-250 outline-none focus:border-red-500/25"
                    >
                      <option value="all">📢 All Active Platform Members</option>
                      {mockMembers.map(m => (
                        <option key={m.id} value={m.id}>👤 {m.name} ({m.tier})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Subject Title</label>
                    <input
                      type="text"
                      placeholder="e.g. VIP Study livestreams notification"
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-red-500/25"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Message Alert Body</label>
                    <textarea
                      placeholder="Type your official announcement or private support reply here..."
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      required
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none resize-none h-32 focus:border-red-500/25"
                    />
                  </div>

                  {msgSuccess && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-[9px] font-medium flex items-center gap-1 animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" /> Message successfully sent!
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md shadow-red-600/10 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch message</span>
                  </button>
                </form>
              </div>

              {/* Sent Messages Ledger */}
              <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h3 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">Outgoing Bulletin Dispatch Log</h3>
                  <p className="text-[10px] text-zinc-500">Chronological history of transmitted administrative alerts.</p>
                </div>

                <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {sentMessages.map((msg: any) => (
                    <div key={msg.id} className="p-4 bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 rounded-xl space-y-2 text-left">
                      <div className="flex justify-between items-center text-[10px] font-mono border-b border-zinc-900/60 pb-1.5">
                        <span className="text-red-400 font-bold bg-red-500/5 px-2 py-0.5 rounded border border-red-500/15">
                          TO: {msg.recipient}
                        </span>
                        <span className="text-zinc-500">{msg.date}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{msg.subject}</h4>
                        <p className="text-[11px] text-zinc-400 mt-1 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                      </div>
                      <div className="flex justify-end text-[9px] text-emerald-400 font-mono font-bold pt-1">
                        ● {msg.status}
                      </div>
                    </div>
                  ))}

                  {sentMessages.length === 0 && (
                    <p className="text-xs text-zinc-500 font-mono text-center py-12">No transmitted bulletins found in ledger.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================== */}
      {/* --- CONSOLE MODE: CREATOR STUDIO --- */}
      {/* ========================================== */}
      {consoleMode === 'creator' && (
        <div className="space-y-6">
          
          {/* Sub Navigation Tabs for Creator */}
          <div className="flex bg-[#09090b] p-1 rounded-xl border border-zinc-900/60 w-fit" id="creator-subtabs">
            {(['stats', 'videos', 'products'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors uppercase font-mono ${
                  activeSubTab === tab 
                    ? 'bg-zinc-900 text-gold-400 border border-zinc-850 font-bold shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab === 'stats' ? 'Analytics' : tab}
              </button>
            ))}
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
                      <line x1="0" y1="50" x2="600" y2="50" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="0" y1="100" x2="600" y2="100" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />
                      <line x1="0" y1="150" x2="600" y2="150" stroke="#1c1917" strokeWidth="1" strokeDasharray="4,4" />

                      <path
                        d="M 10 180 Q 120 150 220 120 T 420 80 T 590 30 L 590 200 L 10 200 Z"
                        fill="url(#chartGlow)"
                      />
                      <path
                        d="M 10 180 Q 120 150 220 120 T 420 80 T 590 30"
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="180" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                      <circle cx="120" cy="154" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                      <circle cx="230" cy="116" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                      <circle cx="410" cy="84" r="4.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                      <circle cx="590" cy="30" r="5.5" fill="#eab308" stroke="#09090b" strokeWidth="2" />
                    </svg>
                    <div className="absolute top-2 right-12 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      June Payout: <span className="text-gold-400 font-bold font-mono">1,480 PPL</span>
                    </div>
                  </div>

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
                      <span className="text-[9px] text-zinc-550 font-mono block">AVAILABLE ACCRUED BALANCE</span>
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
      )}

    </div>
  );
}
