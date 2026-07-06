import React, { useState } from 'react';
import { 
  BarChart3, Video, Play, Trash2, ShieldAlert, Sliders, DollarSign, 
  TrendingUp, Users, Eye, HelpCircle, Upload, CheckCircle2, AlertCircle, 
  Search, Lock, Globe, Layers, AlertTriangle, FileText, Info, ArrowUpRight,
  Sparkles, RefreshCw, Smartphone, Laptop, Tv, BadgeAlert, ShieldCheck, Plus
} from 'lucide-react';
import { Video as VideoType, Creator, StoreLease, StoreProduct } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, 
  ResponsiveContainer, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

interface CreatorStudioProps {
  videos: VideoType[];
  onDeleteVideo: (videoId: string) => void;
  onUpdateVideo?: (updated: VideoType) => void;
  currentUser: any;
  onUpdateProfile: (updated: any) => void;
}

export default function CreatorStudio({
  videos,
  onDeleteVideo,
  onUpdateVideo,
  currentUser,
  onUpdateProfile
}: CreatorStudioProps) {
  // Navigation tabs of Creator Studio (matching the requested screenshots & topics)
  type TabType = 'analytics' | 'analytics-daily' | 'content' | 'customisation' | 'earn' | 'copyright';
  const [activeTab, setActiveTab] = useState<TabType>('analytics');

  // Channel customisation state
  const [channelName, setChannelName] = useState(currentUser?.name || 'Utube Chat');
  const [channelHandle, setChannelHandle] = useState(currentUser?.handle || '@utubechat');
  const [channelBio, setChannelBio] = useState(currentUser?.bio || 'Official stream channel for video content, dynamic logs, and custom audio.');
  const [channelAvatar, setChannelAvatar] = useState(currentUser?.avatar || 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=150');
  const [channelBanner, setChannelBanner] = useState('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Copyright claims states
  const [copyrightRequests, setCopyrightRequests] = useState([
    { id: 'req_1', title: 'Deepfake Voice Cloning Detected', platform: 'TikTok', status: 'Takedown Scheduled', date: '2026-07-02', matchPercentage: '98%' },
    { id: 'req_2', title: 'Unauthorized Re-upload: iPhone specs review', platform: 'Instagram Reels', status: 'Resolved', date: '2026-06-28', matchPercentage: '100%' },
    { id: 'req_3', title: 'Utube Chat Channel Clone', platform: 'YouTube', status: 'Under Review', date: '2026-07-01', matchPercentage: '92%' }
  ]);
  const [showNewRemovalModal, setShowNewRemovalModal] = useState(false);
  const [newRemovalTitle, setNewRemovalTitle] = useState('');
  const [newRemovalPlatform, setNewRemovalPlatform] = useState('YouTube');
  const [newRemovalUrl, setNewRemovalUrl] = useState('');

  // Search filter for content
  const [contentSearch, setContentSearch] = useState('');

  // Sub-tabs for content view
  const [contentSubTab, setContentSubTab] = useState<'videos' | 'shorts' | 'live'>('videos');

  // Sub-tabs for Copyright
  const [copyrightSubTab, setCopyrightSubTab] = useState<'copyright' | 'likeness'>('copyright');

  // Likeness list
  const [likenessDetections, setLikenessDetections] = useState([
    { id: 'like_1', type: 'AI Voice Model Clone', source: 'ElevenLabs spoofed audio', threatLevel: 'High', status: 'Detected', actionUrl: 'https://example.com' },
    { id: 'like_2', type: 'Face Swap Avatar', source: 'TikTok video short-form', threatLevel: 'Medium', status: 'Pending Takedown', actionUrl: 'https://example.com' },
    { id: 'like_3', type: 'Trademark Impersonation', source: 'Facebook Business Page', threatLevel: 'High', status: 'Takedown Sent', actionUrl: 'https://example.com' }
  ]);

  // Analytics graph dates & data
  const analyticsData = [
    { date: 'Jun 06', Views: 5, 'Watch time (hours)': 0.2, Subscribers: 1 },
    { date: 'Jun 10', Views: 12, 'Watch time (hours)': 0.5, Subscribers: 2 },
    { date: 'Jun 14', Views: 28, 'Watch time (hours)': 1.1, Subscribers: 3 },
    { date: 'Jun 18', Views: 42, 'Watch time (hours)': 1.8, Subscribers: 4 },
    { date: 'Jun 22', Views: 61, 'Watch time (hours)': 2.5, Subscribers: 5 },
    { date: 'Jun 26', Views: 85, 'Watch time (hours)': 3.4, Subscribers: 5 },
    { date: 'Jun 30', Views: 98, 'Watch time (hours)': 4.2, Subscribers: 6 },
    { date: 'Jul 03', Views: 125, 'Watch time (hours)': 5.1, Subscribers: 6 }
  ];

  // Daily views and revenue for the last 7 days
  const dailyViewsData = [
    { day: 'Jun 30', Views: 120, 'Revenue (PPL)': 12.0 },
    { day: 'Jul 01', Views: 185, 'Revenue (PPL)': 18.5 },
    { day: 'Jul 02', Views: 240, 'Revenue (PPL)': 24.0 },
    { day: 'Jul 03', Views: 310, 'Revenue (PPL)': 31.0 },
    { day: 'Jul 04', Views: 280, 'Revenue (PPL)': 28.0 },
    { day: 'Jul 05', Views: 395, 'Revenue (PPL)': 39.5 },
    { day: 'Jul 06', Views: 450, 'Revenue (PPL)': 45.0 }
  ];

  // User videos
  const userVideos = videos.filter(v => 
    v.creator.name.toLowerCase() === 'utube chat' || 
    v.creator.id === 'creator_braxtheog9' || 
    v.id.startsWith('video_utube')
  );

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name: channelName,
      handle: channelHandle,
      bio: channelBio,
      avatar: channelAvatar
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddRemovalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemovalTitle || !newRemovalUrl) return;

    const newReq = {
      id: `req_${Date.now()}`,
      title: newRemovalTitle,
      platform: newRemovalPlatform,
      status: 'Under Review',
      date: new Date().toISOString().split('T')[0],
      matchPercentage: '100%'
    };

    setCopyrightRequests([newReq, ...copyrightRequests]);
    setNewRemovalTitle('');
    setNewRemovalUrl('');
    setShowNewRemovalModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-left animate-in fade-in duration-200" id="youtube-creator-studio">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20 shadow-md">
            <BarChart3 className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-150 flex items-center gap-2">
              <span>Creator Studio</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 font-mono font-bold px-2 py-0.5 rounded-full border border-red-500/10 uppercase tracking-widest">Utube Chat Center</span>
            </h1>
            <p className="text-xs text-zinc-500 mt-1">Manage broadcasts, review analytics, coordinate copyright removals, and set up gating rules.</p>
          </div>
        </div>

        {/* Live Status indicators */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            ACTIVE CONSOLE
          </span>
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
            LAST SYNC: JUST NOW
          </span>
        </div>
      </div>

      {/* Navigation Sub-header (YouTube-styled Sidebar tabs as Header Chips for space efficiency) */}
      <div className="flex flex-wrap items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-zinc-900/60" id="studio-sub-tabs">
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'analytics' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Channel Analytics</span>
        </button>

        <button 
          onClick={() => setActiveTab('analytics-daily')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'analytics-daily' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
          id="tab-analytics-daily"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>

        <button 
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'content' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Channel Content</span>
        </button>

        <button 
          onClick={() => setActiveTab('customisation')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'customisation' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Customisation</span>
        </button>

        <button 
          onClick={() => setActiveTab('earn')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'earn' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Earn / Monetisation</span>
        </button>

        <button 
          onClick={() => setActiveTab('copyright')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'copyright' 
              ? 'bg-zinc-900 text-gold-400 border border-zinc-800 font-bold' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Content Detection & Copyright</span>
        </button>
      </div>

      {/* --- TAB CONTENT 1: ANALYTICS --- */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-200" id="studio-analytics">
          {/* Main Chart Column */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2.5">
              <button className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-800 flex items-center gap-1.5 cursor-pointer">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>How did viewers find my content?</span>
              </button>
              <button className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-800 flex items-center gap-1.5 cursor-pointer">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>How many new viewers did I reach?</span>
              </button>
              <button className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-lg text-xs font-medium border border-zinc-800 flex items-center gap-1.5 cursor-pointer">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Summarise my latest video performance</span>
              </button>
            </div>

            {/* Recharts Chart Area */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Channel growth</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Showing Views, Watch time, and Subscribers (June 6 – July 3, 2026)</p>
                </div>
                <div className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
                  Last 28 Days
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWatchTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <ChartTooltip 
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
                      itemStyle={{ fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="Views" stroke="#eab308" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    <Area type="monotone" dataKey="Watch time (hours)" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorWatchTime)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1 shadow-md">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Views</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-zinc-200">125</span>
                  <span className="text-[10px] text-emerald-400 font-mono">↑ 412%</span>
                </div>
                <p className="text-[9px] text-zinc-600">Views in the active billing cycle</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1 shadow-md">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Watch Time</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-zinc-200">5.1 hrs</span>
                  <span className="text-[10px] text-emerald-400 font-mono">↑ 180%</span>
                </div>
                <p className="text-[9px] text-zinc-600">Accumulated public watch logs</p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1 shadow-md">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Subscribers</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-zinc-200">6</span>
                  <span className="text-[10px] text-emerald-400 font-mono">↑ 20%</span>
                </div>
                <p className="text-[9px] text-zinc-600">Verified digital followers</p>
              </div>
            </div>
          </div>

          {/* Right sidebar Column: Realtime counter widget */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>
              
              <div className="border-b border-zinc-900 pb-3">
                <h4 className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                  <span>Realtime metrics</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5">Live streaming state updates</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Subscribers</span>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">6</h2>
                <button className="text-[10px] text-red-500 hover:text-red-400 font-bold flex items-center gap-1 cursor-pointer transition-colors">
                  See live count <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-px bg-zinc-900"></div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Views last 48 hours</span>
                  <span className="font-mono text-zinc-200">0</span>
                </div>
                <div className="h-10 flex items-end gap-1 px-1 bg-[#050507] rounded-lg border border-zinc-900/40 p-1.5">
                  {[...Array(12)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-zinc-800 rounded-sm w-full transition-all" 
                      style={{ height: `${Math.max(5, Math.sin(i)*10 + 10)}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-900"></div>

              {/* Latest Upload Card */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Latest upload performance</span>
                {userVideos.length > 0 ? (
                  <div className="space-y-2">
                    <img src={userVideos[0].thumbnail} alt="" className="aspect-video w-full rounded-lg object-cover border border-zinc-900" />
                    <h5 className="text-[11px] font-bold text-zinc-200 line-clamp-2 leading-snug">{userVideos[0].title}</h5>
                    <div className="flex justify-between text-[10px] text-zinc-400 font-mono pt-1">
                      <span>Views: {userVideos[0].views}</span>
                      <span>Likes: {userVideos[0].likes}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-500">No broadcasts recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 1B: DAILY ANALYTICS --- */}
      {activeTab === 'analytics-daily' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="studio-daily-analytics">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="daily-metrics-summary-grid">
            <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1.5 shadow-md" id="metric-total-views-7d">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Total Views (7D)</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-150">1,990</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">↑ 34.2%</span>
              </div>
              <p className="text-[10px] text-zinc-600">Aggregate views across all streams</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1.5 shadow-md" id="metric-avg-views-7d">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Daily Average</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-150">284</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">↑ 12.8%</span>
              </div>
              <p className="text-[10px] text-zinc-600">Average views per calendar day</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1.5 shadow-md" id="metric-peak-views-7d">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Peak Day Views</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-150">450</span>
                <span className="text-[10px] text-zinc-400 font-mono font-medium">On Jul 06</span>
              </div>
              <p className="text-[10px] text-zinc-600">Highest daily activity log</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-4.5 rounded-2xl space-y-1.5 shadow-md" id="metric-subscribers-gained-7d">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Estimated Revenue</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gold-400 font-mono">199.0 PPL</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold">↑ 34%</span>
              </div>
              <p className="text-[10px] text-zinc-600">Earnings from monetised ad plays</p>
            </div>
          </div>

          {/* Bar & Line Chart Panel */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 space-y-4 shadow-xl" id="daily-views-chart-panel">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3" id="daily-views-chart-header">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Daily Video Views & Revenue</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Showing daily video views and correlation with monetised revenue (PPL) for the last 7 days</p>
              </div>
              <div className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800" id="daily-views-time-badge">
                Last 7 Days
              </div>
            </div>

            <div className="h-80" id="daily-views-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dailyViewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={10} tickLine={false} />
                  <ChartTooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                    cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar 
                    yAxisId="left"
                    dataKey="Views" 
                    fill="#eab308" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="Revenue (PPL)" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#10b981', r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Video Performance Breakdown */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl space-y-4" id="daily-views-performance-details">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Recent Stream Performance Breakdown</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Summary of streams contributing to this week's active audience traffic</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs" id="performance-breakdown-table">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                    <th className="pb-2.5">Title</th>
                    <th className="pb-2.5">Estimated Views (7D)</th>
                    <th className="pb-2.5">Share of Total Traffic</th>
                    <th className="pb-2.5">Average Watch Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {userVideos.slice(0, 3).map((vid, idx) => {
                    const shares = [0.45, 0.35, 0.20];
                    const sharePercent = shares[idx] || 0.15;
                    const viewsContrib = Math.round(1990 * sharePercent);
                    return (
                      <tr key={vid.id} className="hover:bg-zinc-900/10 transition-colors">
                        <td className="py-3 font-semibold text-zinc-300">{vid.title}</td>
                        <td className="py-3 font-mono text-zinc-200">{viewsContrib.toLocaleString()}</td>
                        <td className="py-3 font-mono text-zinc-400">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                              <div className="bg-gold-500 h-full rounded-full" style={{ width: `${sharePercent * 100}%` }}></div>
                            </div>
                            <span>{(sharePercent * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-zinc-400">4m 12s</td>
                      </tr>
                    );
                  })}
                  {userVideos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-zinc-500 font-mono">
                        No active streams recorded this week.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 2: CHANNEL CONTENT --- */}
      {activeTab === 'content' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="studio-content-manager">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            {/* Sub navigation tags */}
            <div className="flex items-center gap-1.5 bg-[#050507] p-1 rounded-xl border border-zinc-900/60 w-fit">
              <button 
                onClick={() => setContentSubTab('videos')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  contentSubTab === 'videos' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Videos
              </button>
              <button 
                onClick={() => setContentSubTab('shorts')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  contentSubTab === 'shorts' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Shorts
              </button>
              <button 
                onClick={() => setContentSubTab('live')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  contentSubTab === 'live' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Live
              </button>
            </div>

            {/* Content filter query */}
            <div className="flex items-center gap-2 bg-[#0c0c0f] border border-zinc-900 px-3 py-1.5 rounded-xl text-zinc-400 w-full sm:max-w-xs">
              <Search className="w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Filter videos..." 
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="bg-transparent text-xs text-zinc-250 outline-none w-full"
              />
            </div>
          </div>

          {/* Videos Grid/Table */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                    <th className="p-4">Video</th>
                    <th className="p-4">Notices</th>
                    <th className="p-4">Visibility & Gating</th>
                    <th className="p-4">Ads Monetization</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Views</th>
                    <th className="p-4 text-center font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {userVideos
                    .filter(v => v.title.toLowerCase().includes(contentSearch.toLowerCase()))
                    .map((vid) => (
                      <tr key={vid.id} className="hover:bg-zinc-900/10 transition-colors group">
                        <td className="p-4 max-w-sm">
                          <div className="flex gap-3">
                            <div className="aspect-video w-24 rounded overflow-hidden bg-zinc-900 flex-shrink-0 relative border border-zinc-900 shadow-md">
                              <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 font-mono text-[9px] text-zinc-300">{vid.duration}</span>
                            </div>
                            <div className="min-w-0 flex flex-col justify-center">
                              <h4 className="font-bold text-zinc-200 truncate leading-snug group-hover:text-red-400 transition-colors" title={vid.title}>
                                {vid.title}
                              </h4>
                              <p className="text-[10px] text-zinc-500 truncate mt-0.5" title={vid.description}>
                                {vid.description || 'Add description'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                              Comments disabled
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-850">
                              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
                              Notifications disabled
                            </span>
                          </div>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (onUpdateVideo) {
                                onUpdateVideo({
                                  ...vid,
                                  subscriptionGated: !vid.subscriptionGated
                                });
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1.5 rounded-lg border cursor-pointer transition-all ${
                              vid.subscriptionGated
                                ? 'bg-gold-500/10 text-gold-400 border-gold-500/25'
                                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white'
                            }`}
                            title={vid.subscriptionGated ? "Click to set Public" : "Click to set Members Only"}
                          >
                            {vid.subscriptionGated ? (
                              <>
                                <Lock className="w-3 h-3 text-gold-500" />
                                <span className="text-gold-500 font-bold uppercase tracking-wider text-[9px] font-mono">Members Only</span>
                              </>
                            ) : (
                              <>
                                <Globe className="w-3 h-3 text-emerald-500" />
                                <span>Public</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              if (onUpdateVideo) {
                                onUpdateVideo({
                                  ...vid,
                                  adEnabled: !vid.adEnabled
                                });
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all ${
                              vid.adEnabled
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 font-bold'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-350'
                            }`}
                            title={vid.adEnabled ? "Click to disable Ads" : "Click to enable Ads"}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{vid.adEnabled ? "Ads: Enabled" : "Ads: Disabled"}</span>
                          </button>
                        </td>

                        <td className="p-4 whitespace-nowrap text-zinc-400 font-mono text-[11px]">
                          {vid.uploadDate}
                        </td>

                        <td className="p-4 whitespace-nowrap text-zinc-200 font-mono">
                          {(vid.views || 0).toLocaleString()}
                        </td>

                        <td className="p-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle lock quick shortcut */}
                            {onUpdateVideo && (
                              <button
                                onClick={() => {
                                  onUpdateVideo({
                                    ...vid,
                                    subscriptionGated: !vid.subscriptionGated
                                  });
                                }}
                                className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                                  vid.subscriptionGated
                                    ? 'bg-gold-500/10 text-gold-400 border-gold-500/20'
                                    : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-white'
                                }`}
                                title={vid.subscriptionGated ? 'Make Public' : 'Gated members only'}
                              >
                                <Lock className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => {
                                  if (confirm('Are you sure you want to permanently delete this broadcast log?')) {
                                    onDeleteVideo(vid.id);
                                  }
                              }}
                              className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-950 rounded-lg cursor-pointer transition-all"
                              title="Delete broadcast"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {userVideos.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-500 font-mono">
                        No videos registered in Utube Chat catalogue. Add/Upload new clips using the launch header console.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT 3: CUSTOMISATION --- */}
      {activeTab === 'customisation' && (
        <form onSubmit={handleSaveProfileSettings} className="space-y-6 animate-in fade-in duration-200" id="studio-customisation">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-8 shadow-xl">
            
            {/* Customisation title */}
            <div>
              <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">Channel customisation</h3>
              <p className="text-xs text-zinc-500 mt-1">Design your public identity card across the atmospheric streaming portal.</p>
            </div>

            {/* Visual assets setup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Profile Picture (Screenshot 2 details) */}
              <div className="space-y-3 bg-[#07070a] p-4.5 rounded-xl border border-zinc-900">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Picture</span>
                <p className="text-[10px] text-zinc-500">Your profile picture will appear where your channel is presented on Utube.</p>
                
                <div className="flex items-center gap-4 py-2">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-zinc-800 overflow-hidden relative group">
                    <img src={channelAvatar} alt="avatar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <input 
                      type="text" 
                      value={channelAvatar} 
                      onChange={(e) => setChannelAvatar(e.target.value)}
                      className="bg-[#09090c] border border-zinc-900 rounded-lg px-2 py-1 text-[11px] text-zinc-300 font-mono outline-none w-44"
                      placeholder="Avatar image URL"
                    />
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setChannelAvatar('https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=150')}
                        className="text-[10px] text-zinc-400 hover:text-white font-semibold cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner image setup (Screenshot 2 details) */}
              <div className="md:col-span-2 space-y-3 bg-[#07070a] p-4.5 rounded-xl border border-zinc-900">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Banner image</span>
                <p className="text-[10px] text-zinc-500">This image will appear across the top of your channel and responsive devices.</p>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-2">
                  <div className="w-full sm:w-44 h-16 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden relative group">
                    <img src={channelBanner} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <input 
                      type="text" 
                      value={channelBanner} 
                      onChange={(e) => setChannelBanner(e.target.value)}
                      className="bg-[#09090c] border border-zinc-900 rounded-lg px-2.5 py-1 text-[11px] text-zinc-300 font-mono outline-none w-full"
                      placeholder="Banner image URL"
                    />
                    
                    {/* Device previews */}
                    <div className="flex gap-3 text-[9px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1"><Tv className="w-3.5 h-3.5 text-zinc-600" /> On TV</span>
                      <span className="flex items-center gap-1"><Laptop className="w-3.5 h-3.5 text-zinc-600" /> On Desktop</span>
                      <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5 text-zinc-600" /> On Mobile</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* General Profile fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Channel Name</label>
                <input 
                  type="text" 
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-gold-500/45 transition-colors"
                  placeholder="Enter channel name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Channel Handle</label>
                <input 
                  type="text" 
                  value={channelHandle}
                  onChange={(e) => setChannelHandle(e.target.value)}
                  className="w-full bg-[#07070a] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-gold-500/45 transition-colors"
                  placeholder="Enter unique handle"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Channel Description / Bio</label>
                <textarea 
                  value={channelBio}
                  onChange={(e) => setChannelBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#07070a] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 outline-none focus:border-gold-500/45 transition-colors resize-none"
                  placeholder="Tell viewers about your content..."
                />
              </div>
            </div>

            {/* Save profile */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
              {saveSuccess && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" /> Changes successfully deployed to public node!
                </span>
              )}
              <button 
                type="submit"
                className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-black text-xs font-bold uppercase rounded-xl cursor-pointer transition-colors"
              >
                Publish customization
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- TAB CONTENT 4: EARN / MONETISATION (Screenshot 1) --- */}
      {activeTab === 'earn' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="studio-earn">
          
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl shadow-xl space-y-6">
            
            {/* Title */}
            <div>
              <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider font-mono">Earn on YouTube</h2>
              <p className="text-xs text-zinc-500 mt-1">Start your earning journey. Connecting with your fans, gating premium streams, and creating shopping experiences.</p>
            </div>

            {/* Benefits cards layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-[#07070a] border border-zinc-900 rounded-xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="p-2 bg-gold-500/10 text-gold-500 rounded-lg w-fit border border-gold-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-250 font-mono tracking-wide">MEMBERSHIPS</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Grow your community and earn monthly. Excite your audience with access to exclusive perks as a monthly paying member. Viewers will be able to join from your channel and video pages.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono bg-zinc-900/60 p-2 rounded-lg border border-zinc-850">
                  Revenue Split: <span className="text-emerald-400 font-bold">70% to Creator</span>
                </div>
              </div>

              <div className="bg-[#07070a] border border-zinc-900 rounded-xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg w-fit border border-red-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-250 font-mono tracking-wide">SUPERS</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Strengthen connections with fans using one-time interactive features. Receive instant platform tokens directly through tipping grids, custom super stickers, and cryptographic chat Highlights.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono bg-zinc-900/60 p-2 rounded-lg border border-zinc-850">
                  Payout threshold: <span className="text-emerald-400 font-bold">Immediate Swaps</span>
                </div>
              </div>

              <div className="bg-[#07070a] border border-zinc-900 rounded-xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg w-fit border border-blue-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-zinc-250 font-mono tracking-wide">SHOPPING</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Create engaging shopping experiences. Share your own products (like t-shirts, digital preset packs, and NFTs) directly on your streaming broadcast pages so fans can easily buy from your store.
                </p>
                <div className="text-[10px] text-zinc-500 font-mono bg-zinc-900/60 p-2 rounded-lg border border-zinc-850">
                  Store Sync: <span className="text-emerald-400 font-bold">Fully Connected</span>
                </div>
              </div>

            </div>

            {/* Eligibility section (Screenshot 1 matching data precisely) */}
            <div className="border-t border-zinc-900 pt-6 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Monetization eligibility</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">As of June 29, 2026. Keep producing high-quality streams to unlock perks!</p>
                </div>
                <span className="text-[10px] bg-red-600/10 text-red-400 font-bold font-mono px-2.5 py-1 rounded border border-red-500/10">
                  LOCKED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Subscribers goal */}
                <div className="bg-[#050507] p-4.5 rounded-xl border border-zinc-900 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Subscribers</span>
                    <span className="text-zinc-200 font-bold">6 / 500</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${(6/500)*100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-500">6 of 500 required subscribers connected.</p>
                </div>

                {/* Video uploads goal */}
                <div className="bg-[#050507] p-4.5 rounded-xl border border-zinc-900 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Video Uploads (90 days)</span>
                    <span className="text-zinc-200 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      3 / 3
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-500">Completed! 3 of 3 minimum public uploads catalogued.</p>
                </div>

                {/* Public watch hours goal */}
                <div className="bg-[#050507] p-4.5 rounded-xl border border-zinc-900 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Public Watch Hours (Last 365 Days)</span>
                    <span className="text-zinc-200 font-bold">5 / 3,000</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${(5/3000)*100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-500">5 of 3,000 hours tracked.</p>
                </div>

                {/* Shorts views goal */}
                <div className="bg-[#050507] p-4.5 rounded-xl border border-zinc-900 space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Public Shorts Views (Last 90 Days)</span>
                    <span className="text-zinc-200 font-bold">0 / 3,000,000</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                    <div className="h-full bg-zinc-800 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-[10px] text-zinc-500">0 of 3,000,000 short views tracked.</p>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB CONTENT 5: COPYRIGHT / CONTENT DETECTION --- */}
      {activeTab === 'copyright' && (
        <div className="space-y-6 animate-in fade-in duration-200" id="studio-copyright">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
            <div className="flex items-center gap-1.5 bg-[#050507] p-1 rounded-xl border border-zinc-900/60 w-fit">
              <button 
                onClick={() => setCopyrightSubTab('copyright')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  copyrightSubTab === 'copyright' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Copyright Removal Ledger
              </button>
              <button 
                onClick={() => setCopyrightSubTab('likeness')}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                  copyrightSubTab === 'likeness' ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Likeness & Voice Protection (Beta)
              </button>
            </div>

            {copyrightSubTab === 'copyright' && (
              <button 
                onClick={() => setShowNewRemovalModal(true)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> New removal request
              </button>
            )}
          </div>

          {/* Copyright removal requests panel */}
          {copyrightSubTab === 'copyright' && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-zinc-900 bg-zinc-900/10">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Active Complaints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-900 bg-zinc-900/20 text-zinc-400 text-[10px] uppercase font-mono tracking-wider font-bold">
                      <th className="p-4">Takedown Subject</th>
                      <th className="p-4">Platform Target</th>
                      <th className="p-4">Submission Date</th>
                      <th className="p-4">Similarity Match</th>
                      <th className="p-4">Complaint Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {copyrightRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-zinc-900/10 transition-colors">
                        <td className="p-4 font-semibold text-zinc-250">{req.title}</td>
                        <td className="p-4 text-zinc-400 font-mono text-[11px]">{req.platform}</td>
                        <td className="p-4 text-zinc-400 font-mono text-[11px]">{req.date}</td>
                        <td className="p-4 font-mono text-zinc-200">{req.matchPercentage}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                            req.status === 'Resolved' 
                              ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/10'
                              : req.status === 'Takedown Scheduled'
                                ? 'bg-amber-950/20 text-amber-400 border-amber-900/10 animate-pulse'
                                : 'bg-blue-950/20 text-blue-400 border-blue-900/10'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Likeness protection panel */}
          {copyrightSubTab === 'likeness' && (
            <div className="space-y-6">
              <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl shadow-xl space-y-4">
                <div className="flex items-center gap-2.5 text-amber-500">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                  <h4 className="text-xs font-bold uppercase tracking-widest font-mono">Voice & Video Cloning Alerts</h4>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Our advanced neural watermark scanner tracks platforms across TikTok, Facebook, and Instagram for deepfakes, custom AI synthesis, or cloning of your vocal identity. Action matches immediately.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-zinc-900 bg-zinc-900/10">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Detected Instances</h3>
                </div>
                <div className="divide-y divide-zinc-900">
                  {likenessDetections.map((item) => (
                    <div key={item.id} className="p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/10 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-200">{item.type}</span>
                          <span className="text-[9px] font-mono bg-red-950/20 text-red-400 border border-red-900/10 px-1.5 py-0.5 rounded font-bold">
                            {item.threatLevel} THREAT
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500">Origin: <span className="text-zinc-400 font-mono">{item.source}</span></p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                          {item.status}
                        </span>
                        <button 
                          onClick={() => {
                            alert('Takedown complaint successfully submitted via API proxy to network registry!');
                            setLikenessDetections(likenessDetections.map(d => d.id === item.id ? { ...d, status: 'Takedown Sent' } : d));
                          }}
                          className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 hover:text-black border border-red-500/20 text-red-400 text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all"
                        >
                          Request Takedown
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- NEW REMOVAL REQUEST MODAL --- */}
      {showNewRemovalModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-left animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <h3 className="text-sm font-bold text-zinc-150 flex items-center gap-2 font-mono uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Submit Copyright Complaint
              </h3>
              <button 
                onClick={() => setShowNewRemovalModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-lg font-mono cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddRemovalRequest} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Infringed Video Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. Budget Beast iPhone Review reupload"
                  value={newRemovalTitle}
                  onChange={(e) => setNewRemovalTitle(e.target.value)}
                  className="w-full bg-[#0c0c0f] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-red-500/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Target Platform</label>
                <select 
                  value={newRemovalPlatform}
                  onChange={(e) => setNewRemovalPlatform(e.target.value)}
                  className="w-full bg-[#0c0c0f] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-red-500/40"
                >
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram Reels">Instagram Reels</option>
                  <option value="Facebook Watch">Facebook Watch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Infringing Content URL</label>
                <input 
                  type="url" 
                  placeholder="https://tiktok.com/..."
                  value={newRemovalUrl}
                  onChange={(e) => setNewRemovalUrl(e.target.value)}
                  className="w-full bg-[#0c0c0f] border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none focus:border-red-500/40"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-900">
                <button 
                  type="button"
                  onClick={() => setShowNewRemovalModal(false)}
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl text-xs uppercase font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs uppercase font-bold cursor-pointer"
                >
                  Send Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
