import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import VideoPlayer from './components/VideoPlayer';
import CommentsSection from './components/CommentsSection';
import ShortsPlayer from './components/ShortsPlayer';
import WalletView from './components/WalletView';
import StoreView from './components/StoreView';
import AdManager from './components/AdManager';
import AdminDashboard from './components/AdminDashboard';
import UploadModal from './components/UploadModal';
import ProfileSettings from './components/ProfileSettings';

// Mock Data
import { 
  initialVideos, 
  initialComments, 
  initialAdCampaigns, 
  initialWallet, 
  initialPlaylists, 
  initialProducts,
  creators 
} from './data';
import { Video, Comment, AdCampaign, UserWallet, Playlist, StoreProduct, StoreLease, Creator } from './types';
import { Compass, Flame, Clock, Heart, Play, Plus, Trash2, List, Grid, Sparkles, Filter, Store, AlertCircle, ShoppingBag } from 'lucide-react';

export default function App() {
  // --- Persistent State Hub via LocalStorage ---
  const [videos, setVideos] = useState<Video[]>(() => {
    const saved = localStorage.getItem('ppl_videos');
    return saved ? JSON.parse(saved) : initialVideos;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('ppl_comments');
    return saved ? JSON.parse(saved) : initialComments;
  });

  const [wallet, setWallet] = useState<UserWallet>(() => {
    const saved = localStorage.getItem('ppl_wallet');
    return saved ? JSON.parse(saved) : initialWallet;
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('ppl_playlists');
    return saved ? JSON.parse(saved) : initialPlaylists;
  });

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem('ppl_campaigns');
    return saved ? JSON.parse(saved) : initialAdCampaigns;
  });

  const [products, setProducts] = useState<StoreProduct[]>(() => {
    const saved = localStorage.getItem('ppl_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [leases, setLeases] = useState<StoreLease[]>(() => {
    const saved = localStorage.getItem('ppl_leases');
    if (saved) return JSON.parse(saved);
    // Initial mock leases matching pre-defined stores
    return [
      {
        id: 'lease_wisdom',
        creatorId: 'creator_wisdom',
        creatorName: 'A Word of Wisdom',
        storeName: 'Wisdom Prophetics & Merch',
        plan: 'Silver',
        priceMonthly: 250,
        leasedDate: '2026-06-15',
        status: 'active'
      },
      {
        id: 'lease_dirty_lense',
        creatorId: 'creator_dirty_lense',
        creatorName: 'My Dirty Lense',
        storeName: 'Dirty Lense Urban Presets',
        plan: 'Bronze',
        priceMonthly: 100,
        leasedDate: '2026-07-01',
        status: 'active'
      }
    ];
  });

  // User details state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ppl_user');
    return saved ? JSON.parse(saved) : {
      name: 'PushPlayUser',
      email: 'push2playlive@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      isCreator: true // Connected to admin channel by default to showcase admin panel!
    };
  });

  // Current creator details (maps to currentUser details if they act as creator)
  const creatorDetails: Creator = {
    id: 'creator_braxtheog9', // matches Braxtheog9 mock profile
    name: currentUser.name,
    avatar: currentUser.avatar,
    subscribers: 5820,
    isSubscribed: false,
    hasStore: leases.some(l => l.creatorId === 'creator_braxtheog9' && l.status === 'active'),
    storeName: leases.find(l => l.creatorId === 'creator_braxtheog9')?.storeName,
    joinedDate: '2026-01-01'
  };

  // UI state
  const [currentView, setCurrentView] = useState('home');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'long' | 'short'>('long');
  const [creatorMonetization, setCreatorMonetization] = useState(true);
  const [activeShortIdx, setActiveShortIdx] = useState(0);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('ppl_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('ppl_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('ppl_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('ppl_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('ppl_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('ppl_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ppl_leases', JSON.stringify(leases));
  }, [leases]);

  useEffect(() => {
    localStorage.setItem('ppl_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Handle list of subscribed channels
  const subscribedCreators = creators.filter(c => c.isSubscribed);

  // --- ACTIONS STATE HANDLERS ---

  // Handle Tipping
  const handleTipCreator = (creatorId: string, amount: number, description: string) => {
    setWallet(prev => {
      const updatedBalance = prev.balancePPL - amount;
      const newTx = {
        id: `tx_${Math.random().toString(36).substring(2, 9)}`,
        type: 'tip' as const,
        amount,
        currency: 'PPL' as const,
        description,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: '0x9a8B...884F',
        recipient: creatorId
      };
      return {
        ...prev,
        balancePPL: updatedBalance,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  // Handle ETH -> PPL swap
  const handleSwapETH = (ethAmount: number) => {
    const PPL_RATE = 34000;
    const pplReceived = ethAmount * PPL_RATE;
    setWallet(prev => {
      const updatedETH = parseFloat((prev.balanceETH - ethAmount).toFixed(4));
      const updatedPPL = prev.balancePPL + pplReceived;
      const newTx = {
        id: `tx_swap_${Math.random().toString(36).substring(2, 9)}`,
        type: 'deposit' as const,
        amount: pplReceived,
        currency: 'PPL' as const,
        description: `Virtual swap connection: ${ethAmount} ETH ⇄ ${pplReceived.toLocaleString()} PPL`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: 'Uniswap Liquidity',
        recipient: '0x9a8B...884F'
      };
      return {
        ...prev,
        balanceETH: updatedETH,
        balancePPL: updatedPPL,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  // Purchase Creator merchandise product
  const handleBuyProduct = (product: StoreProduct) => {
    if (wallet.balancePPL < product.price) {
      alert('Insufficient PPL platform balance to perform this purchase! Swap some ETH in your Wallet tab first.');
      return;
    }

    setWallet(prev => {
      const updatedPPL = prev.balancePPL - product.price;
      const newTx = {
        id: `tx_buy_${Math.random().toString(36).substring(2, 9)}`,
        type: 'store_purchase' as const,
        amount: product.price,
        currency: 'PPL' as const,
        description: `Purchased: ${product.name} from ${product.creatorName}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: '0x9a8B...884F',
        recipient: product.creatorId
      };
      return {
        ...prev,
        balancePPL: updatedPPL,
        transactions: [newTx, ...prev.transactions]
      };
    });

    // Update product stock & sales counts
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, stock: Math.max(0, p.stock - 1), sales: p.sales + 1 };
      }
      return p;
    }));

    alert(`Successfully purchased ${product.name}! Support transaction published to platform smart contract.`);
  };

  // Sign online store lease
  const handleLeaseStore = (storeName: string, plan: 'Bronze' | 'Silver' | 'Gold', cost: number) => {
    const newLease: StoreLease = {
      id: `lease_${Math.random().toString(36).substring(2, 9)}`,
      creatorId: 'creator_braxtheog9',
      creatorName: currentUser.name,
      storeName,
      plan,
      priceMonthly: cost,
      leasedDate: new Date().toISOString().substring(0, 10),
      status: 'active'
    };

    setLeases(prev => [newLease, ...prev]);

    // Debit cost
    setWallet(prev => {
      const updatedPPL = prev.balancePPL - cost;
      const newTx = {
        id: `tx_lease_${Math.random().toString(36).substring(2, 9)}`,
        type: 'store_lease' as const,
        amount: cost,
        currency: 'PPL' as const,
        description: `Signed ${plan} Store Lease Plan: "${storeName}"`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: '0x9a8B...884F',
        recipient: 'PushPlay Store Lease Registry'
      };
      return {
        ...prev,
        balancePPL: updatedPPL,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  // Create customized advertiser ad placement
  const handleCreateAdCampaign = (newCamp: Omit<AdCampaign, 'id' | 'views' | 'clicks' | 'budgetSpent'>) => {
    const campaignId = `ad_${Math.random().toString(36).substring(2, 9)}`;
    const ad: AdCampaign = {
      ...newCamp,
      id: campaignId,
      views: 0,
      clicks: 0,
      budgetSpent: 0
    };

    setCampaigns(prev => [ad, ...prev]);

    // Debit ad campaign budget
    setWallet(prev => {
      const updatedPPL = prev.balancePPL - newCamp.budgetTotal;
      const newTx = {
        id: `tx_ad_${Math.random().toString(36).substring(2, 9)}`,
        type: 'ad_payment' as const,
        amount: newCamp.budgetTotal,
        currency: 'PPL' as const,
        description: `Funded Ad Campaign: "${newCamp.title}"`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: '0x9a8B...884F',
        recipient: 'PushPlay Ad Protocol'
      };
      return {
        ...prev,
        balancePPL: updatedPPL,
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  // Click on active ad (monetizes video creator & charges ad budget)
  const handleAdClicked = (adId: string) => {
    const ad = campaigns.find(a => a.id === adId);
    if (!ad || ad.status === 'completed') return;

    // Open advertiser link
    window.open(ad.targetUrl, '_blank');

    setCampaigns(prev => prev.map(a => {
      if (a.id === adId) {
        const spent = a.budgetSpent + a.costPerClick;
        return {
          ...a,
          clicks: a.clicks + 1,
          budgetSpent: spent,
          status: spent >= a.budgetTotal ? 'completed' as const : a.status
        };
      }
      return a;
    }));

    // Split PPL earnings to video creator!
    if (selectedVideo && creatorMonetization) {
      const creatorSplit = ad.costPerClick * 0.6; // 60% creator split
      setWallet(prev => {
        const newTx = {
          id: `tx_payout_${Math.random().toString(36).substring(2, 9)}`,
          type: 'ad_payout' as const,
          amount: creatorSplit,
          currency: 'PPL' as const,
          description: `Monetization share for ad click on: "${selectedVideo.title}"`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          sender: 'PushPlay Ad Protocol',
          recipient: selectedVideo.creator.id
        };
        return {
          ...prev,
          balancePPL: prev.balancePPL + creatorSplit, // credit split to viewer-creator wallet
          transactions: [newTx, ...prev.transactions]
        };
      });
    }
  };

  const handleAdClosed = () => {
    // increment impressions/views for the campaign
    const firstActiveAd = campaigns.find(a => a.status === 'active');
    if (firstActiveAd) {
      setCampaigns(prev => prev.map(a => {
        if (a.id === firstActiveAd.id) {
          return { ...a, views: a.views + 1 };
        }
        return a;
      }));
    }
  };

  // Creator publish product on store
  const handlePublishStoreProduct = (newProduct: Omit<StoreProduct, 'id' | 'creatorId' | 'creatorName' | 'sales'>) => {
    const prod: StoreProduct = {
      ...newProduct,
      id: `prod_${Math.random().toString(36).substring(2, 9)}`,
      creatorId: 'creator_braxtheog9',
      creatorName: currentUser.name,
      sales: 0
    };
    setProducts(prev => [prod, ...prev]);
  };

  // Creator withdraw earnings
  const handleWithdrawEarnings = (amount: number) => {
    setWallet(prev => {
      const newTx = {
        id: `tx_withdraw_${Math.random().toString(36).substring(2, 9)}`,
        type: 'withdrawal' as const,
        amount,
        currency: 'PPL' as const,
        description: 'Withdrew studio earnings to personal external cold ledger',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        sender: 'PushPlay Local Ledger',
        recipient: 'External Address (0x12a3...)'
      };
      return {
        ...prev,
        balancePPL: prev.balancePPL + amount, // credit balance back or log external transfer
        transactions: [newTx, ...prev.transactions]
      };
    });
  };

  // Add Comment Replies or Comments
  const handleAddComment = (text: string) => {
    if (!selectedVideo) return;
    const newComment: Comment = {
      id: `c_${Math.random().toString(36).substring(2, 9)}`,
      videoId: selectedVideo.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      likes: 0,
      dislikes: 0,
      timestamp: 'Just now',
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
    setVideos(prev => prev.map(v => {
      if (v.id === selectedVideo.id) {
        return { ...v, commentsCount: v.commentsCount + 1 };
      }
      return v;
    }));
  };

  const handleAddShortComment = (videoId: string, text: string) => {
    const newComment: Comment = {
      id: `c_${Math.random().toString(36).substring(2, 9)}`,
      videoId,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text,
      likes: 0,
      dislikes: 0,
      timestamp: 'Just now',
      replies: []
    };
    setComments(prev => [newComment, ...prev]);
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return { ...v, commentsCount: v.commentsCount + 1 };
      }
      return v;
    }));
  };

  const handleAddReply = (commentId: string, text: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const newReply = {
          id: `r_${Math.random().toString(36).substring(2, 9)}`,
          commentId,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          text,
          likes: 0,
          timestamp: 'Just now'
        };
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    }));
  };

  // Comments likes, dislikes, hearts
  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, isLiked: !c.isLiked, isDisliked: false };
      }
      return c;
    }));
  };

  const handleDislikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, isDisliked: !c.isDisliked, isLiked: false };
      }
      return c;
    }));
  };

  const handleHeartComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return { ...c, isHeartedByCreator: !c.isHeartedByCreator };
      }
      return c;
    }));
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: c.replies.map(r => r.id === replyId ? { ...r, isLiked: !r.isLiked } : r)
        };
      }
      return c;
    }));
  };

  // Video Likes & Dislikes & Subscriptions
  const handleLikeVideo = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const isLiked = !v.isLiked;
        return {
          ...v,
          isLiked,
          isDisliked: false,
          likes: v.likes + (isLiked ? 1 : -1)
        };
      }
      return v;
    }));
  };

  const handleDislikeVideo = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const isDisliked = !v.isDisliked;
        return {
          ...v,
          isDisliked,
          isLiked: false,
          dislikes: v.dislikes + (isDisliked ? 1 : -1)
        };
      }
      return v;
    }));
  };

  const handleSubscribe = (creatorId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.creator.id === creatorId) {
        const isSub = !v.creator.isSubscribed;
        return {
          ...v,
          creator: {
            ...v.creator,
            isSubscribed: isSub,
            subscribers: v.creator.subscribers + (isSub ? 1 : -1)
          }
        };
      }
      return v;
    }));
  };

  const handleUnsubscribe = (creatorId: string) => {
    handleSubscribe(creatorId);
  };

  // Playlist handlers
  const handleAddToPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        const isIncluded = pl.videoIds.includes(videoId);
        const updated = isIncluded
          ? pl.videoIds.filter(id => id !== videoId)
          : [...pl.videoIds, videoId];
        return { ...pl, videoIds: updated };
      }
      return pl;
    }));
  };

  const handleCreatePlaylist = (name: string, videoId: string) => {
    const pl: Playlist = {
      id: `pl_${Math.random().toString(36).substring(2, 9)}`,
      name,
      videoIds: [videoId],
      createdBy: 'user_me'
    };
    setPlaylists(prev => [...prev, pl]);
    alert(`Created playlist "${name}" and saved video.`);
  };

  // Add uploaded video to lists
  const handleUploadVideo = (newVideo: Omit<Video, 'id' | 'views' | 'uploadDate' | 'likes' | 'dislikes' | 'commentsCount'>) => {
    const vidId = `video_${Math.random().toString(36).substring(2, 9)}`;
    const fullVideo: Video = {
      ...newVideo,
      id: vidId,
      views: Math.floor(Math.random() * 50) + 1,
      uploadDate: 'Just now',
      likes: 0,
      dislikes: 0,
      commentsCount: 0
    };

    setVideos(prev => [fullVideo, ...prev]);
  };

  // Delete Video
  const handleDeleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    if (selectedVideo?.id === videoId) {
      setSelectedVideo(null);
      setCurrentView('home');
    }
  };

  // Update Profile Identity
  const handleUpdateProfile = (name: string, email: string, avatar: string, isCreator: boolean) => {
    setCurrentUser({ name, email, avatar, isCreator });
  };

  // Navigation controller with page routing animations
  const handleNavigate = (view: string, params?: any) => {
    setCurrentView(view);
    setSearchQuery('');
    if (view === 'video-detail' && params?.video) {
      setSelectedVideo(params.video);
    } else if (view === 'shorts') {
      const shortsList = videos.filter(v => v.isShort);
      if (params?.index !== undefined) {
        setActiveShortIdx(params.index);
      } else {
        setActiveShortIdx(0);
      }
    }
    // scroll main panel to top
    const panel = document.getElementById('main-feed-scroll');
    if (panel) panel.scrollTop = 0;
  };

  // Filter main feed videos
  const activeLongPlayVideos = videos.filter(v => !v.isShort);
  const activeShortsVideos = videos.filter(v => v.isShort);

  const searchedLongVideos = activeLongPlayVideos.filter(v => {
    const matchSearch = searchQuery 
      ? v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchCategory = activeCategory === 'All' 
      ? true 
      : v.category.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  // Category tags (Matching screenshot exactly)
  const categoryChips = [
    'All', 'Podcasts', 'Music', 'Mixes', 'Live', 'Testimonies', 'Enduro', 'Kickboxing', 
    'Wealth', 'Angels', 'Harps', 'Righteousness', 'Good', 'Intercessions', 'Mercy', 
    'Psychology', 'Consciousness', 'Recently uploaded', 'Watched', 'New to you'
  ];

  // Ad Placement Fetcher
  const activeAdCampaign = campaigns.find(c => c.status === 'active') || null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans select-none antialiased overflow-hidden" id="pushplay-root">
      {/* Universal Header */}
      <Header
        wallet={wallet}
        onNavigate={handleNavigate}
        onOpenUpload={(type) => {
          setUploadType(type);
          setUploadModalOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenProfile={() => handleNavigate('profile-settings')}
        currentUser={currentUser}
      />

      {/* Main Structural Layout (Sidebar + Center Content Shelf) */}
      <div className="flex flex-1 overflow-hidden">
        <Navigation 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          subscribedCreators={subscribedCreators} 
        />

        {/* Central Scrolling Feed */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-57px)]" id="main-feed-scroll">
          
          {/* HOME GRID STREAM */}
          {currentView === 'home' && (
            <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-200" id="home-stream-view">
              
              {/* Category tag chips bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-900/60" id="category-chips-bar">
                {categoryChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setActiveCategory(chip)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap tracking-wide cursor-pointer transition-all duration-250 ${
                      activeCategory === chip 
                        ? 'bg-gold-500 text-black font-bold shadow-md shadow-gold-500/10' 
                        : 'bg-[#0f0f12] text-zinc-400 border border-zinc-900 hover:text-zinc-200 hover:bg-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Dynamic Grid of Stream Cards */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-semibold text-zinc-400 font-mono tracking-widest uppercase mb-4 flex items-center gap-1.5">
                    <span>Celestial & Atmospheric Streams</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
                  </h2>
                  
                  {searchedLongVideos.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/10 rounded-2xl border border-zinc-900 p-6">
                      <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-zinc-400">No active streams match your query</p>
                      <button 
                        onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} 
                        className="mt-2.5 px-4 py-1.5 bg-[#0f0f12] border border-gold-500/20 hover:border-gold-500/40 text-gold-400 text-xs rounded-full font-bold cursor-pointer transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" id="home-videos-grid">
                      {searchedLongVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => handleNavigate('video-detail', { video })}
                          className="bg-[#0c0c0f] border border-zinc-900/80 hover:border-gold-500/30 rounded-2xl overflow-hidden group/card cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-gold-500/5 hover:-translate-y-0.5"
                        >
                          {/* Card Thumbnail */}
                          <div className="aspect-video bg-[#050507] overflow-hidden relative">
                            <img 
                              src={video.thumbnail} 
                              alt="" 
                              className="w-full h-full object-cover group-hover/card:scale-103 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Duration Indicator */}
                            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[9px] font-bold text-gold-400 border border-gold-500/15">
                              {video.duration}
                            </span>
                            {/* Play overlay glow */}
                            <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/40 flex items-center justify-center transition-colors">
                              <span className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all scale-90 group-hover/card:scale-100 shadow-lg shadow-gold-500/25">
                                <Play className="w-4 h-4 text-black fill-current translate-x-[1px]" />
                              </span>
                            </div>
                            {/* Premium Gated Indicator */}
                            {video.subscriptionGated && (
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-gold-500/10 text-gold-400 text-[8px] font-bold tracking-widest rounded-sm uppercase border border-gold-500/25">
                                Gated Pass
                              </span>
                            )}
                          </div>

                          {/* Card details */}
                          <div className="p-3 text-left space-y-2 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h3 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-snug group-hover/card:text-gold-400 transition-colors duration-200">
                                {video.title}
                              </h3>
                              <p className="text-[10px] text-zinc-400 font-semibold line-clamp-1">
                                {video.creator.name}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-900/60">
                              <span>{(video.views).toLocaleString()} views</span>
                              <span>{video.uploadDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* --- SHORTS SHELF (Just like in the screenshot: carousel with heading Shorts) --- */}
                <div className="bg-[#08080a] border border-zinc-900/80 p-4.5 rounded-3xl" id="shorts-shelf-carousel">
                  <div className="flex items-center gap-2 mb-4 border-b border-zinc-900/60 pb-2">
                    <Flame className="w-4 h-4 text-gold-500 animate-pulse" />
                    <h2 className="text-xs font-semibold text-zinc-400 font-mono tracking-widest uppercase">Shorts Vertical Streams</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {activeShortsVideos.map((short, idx) => (
                      <div
                        key={short.id}
                        onClick={() => handleNavigate('shorts', { index: idx })}
                        className="aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer group/short border border-zinc-900/80 hover:border-gold-500/30 shadow-md transition-all duration-300 hover:-translate-y-0.5"
                      >
                        <img 
                          src={short.thumbnail} 
                          alt="" 
                          className="w-full h-full object-cover group-hover/short:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/90 via-[#050507]/20 to-transparent flex flex-col justify-end p-3 text-left">
                          <h4 className="text-[10px] font-bold text-zinc-100 line-clamp-2 leading-snug group-hover/short:text-gold-400 transition-colors duration-200">{short.title}</h4>
                          <span className="text-[8px] font-mono text-gold-400/80 mt-1">{(short.views).toLocaleString()} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLAY VIDEO STREAM PAGE */}
          {currentView === 'video-detail' && selectedVideo && (
            <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200" id="video-detail-workspace">
              {/* Left Column: Player & Comments */}
              <div className="lg:col-span-2 space-y-6">
                <VideoPlayer
                  video={selectedVideo}
                  playlists={playlists}
                  onAddToPlaylist={handleAddToPlaylist}
                  onCreatePlaylist={handleCreatePlaylist}
                  activeAd={activeAdCampaign}
                  onAdClicked={handleAdClicked}
                  onAdClosed={handleAdClosed}
                  onBuyProduct={handleBuyProduct}
                  wallet={wallet}
                  onLike={handleLikeVideo}
                  onDislike={handleDislikeVideo}
                  onSubscribe={handleSubscribe}
                />
                
                {/* Comments Thread */}
                <CommentsSection
                  comments={comments.filter(c => c.videoId === selectedVideo.id)}
                  onAddComment={handleAddComment}
                  onAddReply={handleAddReply}
                  onLikeComment={handleLikeComment}
                  onDislikeComment={handleDislikeComment}
                  onHeartComment={handleHeartComment}
                  onLikeReply={handleLikeReply}
                  currentUser={currentUser}
                  creatorId={selectedVideo.creator.id}
                />
              </div>

              {/* Right Column: Up Next recommendation stream list */}
              <div className="space-y-4 text-left">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900/60 pb-2">Up Next</h3>
                <div className="space-y-3">
                  {activeLongPlayVideos
                    .filter(v => v.id !== selectedVideo.id)
                    .map((video) => (
                      <div
                        key={video.id}
                        onClick={() => handleNavigate('video-detail', { video })}
                        className="flex gap-3 bg-[#0f0f12]/30 border border-zinc-900/40 hover:border-gold-500/15 hover:bg-[#0f0f12]/85 rounded-xl p-2 cursor-pointer transition-all duration-200 group"
                      >
                        <img src={video.thumbnail} alt="" className="w-24 h-14 object-cover rounded-lg border border-zinc-900/60 flex-shrink-0" />
                        <div className="overflow-hidden space-y-1">
                          <h4 className="text-[11px] font-bold text-zinc-200 line-clamp-2 leading-tight group-hover:text-gold-400 transition-colors">{video.title}</h4>
                          <p className="text-[10px] text-zinc-400 truncate">{video.creator.name}</p>
                          <span className="text-[9px] font-mono text-zinc-500 block">{(video.views).toLocaleString()} views</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* VERTICAL SHORTS MULTI-STREAM PLAYER */}
          {currentView === 'shorts' && (
            <div className="p-4" id="shorts-playback-view">
              <ShortsPlayer
                shorts={activeShortsVideos}
                activeIdx={activeShortShorts()}
                onIndexChange={setActiveShortIdx}
                comments={comments}
                onAddComment={handleAddShortComment}
                onLike={handleLikeVideo}
                onDislike={handleDislikeVideo}
                onSubscribe={handleSubscribe}
                onShare={(id) => {
                  navigator.clipboard.writeText(`${window.location.origin}/shorts?v=${id}`);
                  alert('Short stream copied to clipboard!');
                }}
              />
            </div>
          )}

          {/* PLAYLISTS VIEW */}
          {currentView === 'playlists' && (
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="user-playlists-view">
              <div className="border-b border-zinc-900 pb-3">
                <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <List className="w-5.5 h-5.5 text-red-500" /> My Custom Playlists
                </h1>
                <p className="text-xs text-zinc-500">Access saved video packages and stream them sequentially.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-4.5 space-y-3 relative group">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-red-600/10 text-red-500 font-mono font-bold px-2 py-0.5 rounded border border-red-500/10 uppercase">
                        {playlist.isSystem ? 'System Playlist' : 'User Playlist'}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-400">{playlist.videoIds.length} Videos</span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-200">{playlist.name}</h3>

                    {/* Quick play preview */}
                    {playlist.videoIds.length > 0 ? (
                      <button
                        onClick={() => {
                          const firstVid = videos.find(v => v.id === playlist.videoIds[0]);
                          if (firstVid) handleNavigate('video-detail', { video: firstVid });
                        }}
                        className="w-full mt-3 py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-red-500" /> Play Sequence
                      </button>
                    ) : (
                      <p className="text-[10px] text-zinc-500 font-mono mt-3">This playlist contains no saved video elements.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WATCH LATER SYSTEM PLAYLIST VIEW */}
          {currentView === 'watch-later' && (
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="watch-later-view">
              <div className="border-b border-zinc-900 pb-3">
                <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Clock className="w-5.5 h-5.5 text-red-500" /> Watch Later Stream Grid
                </h1>
                <p className="text-xs text-zinc-500">Gated temporary bookmarks of high-priority streams.</p>
              </div>

              {getPlaylistVideos('pl_watch_later').length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/10 rounded-2xl border border-zinc-900 p-6">
                  <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-400">Your Watch Later stream index is empty</p>
                  <button onClick={() => setCurrentView('home')} className="mt-2.5 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-full font-bold cursor-pointer transition-colors">Discover Streams</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getPlaylistVideos('pl_watch_later').map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => handleNavigate('video-detail', { video: vid })}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl p-2 flex gap-3 cursor-pointer hover:border-zinc-800 transition-colors"
                    >
                      <img src={vid.thumbnail} alt="" className="w-20 h-12 object-cover rounded flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-200 truncate">{vid.title}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{vid.creator.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LIKED VIDEOS SYSTEM PLAYLIST */}
          {currentView === 'liked' && (
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="liked-videos-view">
              <div className="border-b border-zinc-900 pb-3">
                <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Heart className="w-5.5 h-5.5 text-red-500" /> Liked Videos Ledger
                </h1>
                <p className="text-xs text-zinc-500">Every stream you have appreciated on PushPlay.</p>
              </div>

              {getPlaylistVideos('pl_liked').length === 0 ? (
                <p className="text-xs text-zinc-500 font-mono py-8 text-center">No liked streams logged on your active account address.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getPlaylistVideos('pl_liked').map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => handleNavigate('video-detail', { video: vid })}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl p-2 flex gap-3 cursor-pointer hover:border-zinc-800 transition-colors"
                    >
                      <img src={vid.thumbnail} alt="" className="w-20 h-12 object-cover rounded flex-shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-zinc-200 truncate">{vid.title}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{vid.creator.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CRYPTOGRAPHIC WALLET CONTROLS */}
          {currentView === 'wallet' && (
            <WalletView
              wallet={wallet}
              creators={creators}
              onTipCreator={handleTipCreator}
              onSwapETHtoPPL={handleSwapETH}
            />
          )}

          {/* CREATOR COMMERCE MERCHANDISE PLACE */}
          {currentView === 'store' && (
            <StoreView
              products={products}
              leases={leases}
              wallet={wallet}
              onBuyProduct={handleBuyProduct}
              onLeaseStore={handleLeaseStore}
              creatorMode={currentUser.isCreator}
              viewMode="browse"
            />
          )}

          {/* AD MANAGER PLATFORM */}
          {currentView === 'advertising' && (
            <AdManager
              campaigns={campaigns}
              wallet={wallet}
              onCreateCampaign={handleCreateAdCampaign}
              creatorMonetization={creatorMonetization}
              onToggleMonetization={() => setCreatorMonetization(!creatorMonetization)}
            />
          )}

          {/* LEASE A STORE QUICK LINK STATE */}
          {currentView === 'lease-store' && (
            <StoreView
              products={products}
              leases={leases}
              wallet={wallet}
              onBuyProduct={handleBuyProduct}
              onLeaseStore={handleLeaseStore}
              creatorMode={currentUser.isCreator}
              viewMode="lease"
            />
          )}

          {/* ADMIN DASHBOARD CONSOLE */}
          {currentView === 'admin' && (
            <AdminDashboard
              videos={videos}
              products={products}
              wallet={wallet}
              creatorDetails={creatorDetails}
              onDeleteVideo={handleDeleteVideo}
              onAddProduct={handlePublishStoreProduct}
              onWithdrawEarnings={handleWithdrawEarnings}
            />
          )}

          {/* USER PROFILE & GENERAL SETTINGS PAGE */}
          {currentView === 'profile-settings' && (
            <ProfileSettings
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              subscribedCreators={subscribedCreators}
              onUnsubscribe={handleUnsubscribe}
            />
          )}

          {/* CREATOR CHANNEL DETAIL SHORTCUT VIEW */}
          {currentView === 'creator-profile' && (
            <div className="p-4 md:p-6 text-left max-w-5xl mx-auto space-y-6" id="creator-channel-details">
              <div className="h-32 md:h-48 rounded-3xl bg-gradient-to-r from-red-600/20 via-zinc-900 to-zinc-950 relative overflow-hidden flex items-end p-6 border border-zinc-900 shadow-xl">
                <div className="flex gap-4 items-center relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-900 border-4 border-zinc-950 overflow-hidden shadow-2xl">
                    <img src={creators[0].avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-2xl font-black text-white tracking-tight">{creators[0].name}</h1>
                    <p className="text-[10px] md:text-xs text-zinc-400 font-mono mt-0.5">{(creators[0].subscribers).toLocaleString()} verified followers • Joined {creators[0].joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Grid of only this creator's video catalog */}
              <div>
                <h3 className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2">Celestial Broadcasts</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {videos
                    .filter(v => v.creator.id === creators[0].id)
                    .map(vid => (
                      <div
                        key={vid.id}
                        onClick={() => handleNavigate('video-detail', { video: vid })}
                        className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group transition-all"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img src={vid.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-103 transition-transform" />
                          <span className="absolute bottom-1.5 right-1.5 px-1 py-0.5 rounded bg-black/80 font-mono text-[9px] text-zinc-300">{vid.duration}</span>
                        </div>
                        <div className="p-3">
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 leading-snug group-hover:text-red-400 transition-colors">{vid.title}</h4>
                          <span className="text-[9px] font-mono text-zinc-500 mt-1 block">{vid.views.toLocaleString()} views • {vid.uploadDate}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Global Upload Dialog Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadVideo}
        creatorDetails={creatorDetails}
        type={uploadType}
      />
    </div>
  );

  // Helper functions
  function getPlaylistVideos(playlistId: string): Video[] {
    const pl = playlists.find(p => p.id === playlistId);
    if (!pl) return [];
    return videos.filter(v => pl.videoIds.includes(v.id));
  }

  function activeShortShorts(): number {
    return activeShortIdx >= 0 && activeShortIdx < activeShortsVideos.length ? activeShortIdx : 0;
  }
}
