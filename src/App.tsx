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
import AuthView from './components/AuthView';
import MusicView from './components/MusicView';
import CreatorStudio from './components/CreatorStudio';

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
import { Video, Comment, AdCampaign, UserWallet, Playlist, StoreProduct, StoreLease, Creator, VideoReport } from './types';
import { Compass, Flame, Clock, Heart, Play, Plus, Trash2, List, Grid, Sparkles, Filter, Store, AlertCircle, ShoppingBag, Share2, Check, Copy, QrCode, History, Flag } from 'lucide-react';

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

  const [reports, setReports] = useState<VideoReport[]>(() => {
    const saved = localStorage.getItem('ppl_reports');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rep_1',
        videoId: 'vid_1',
        videoTitle: 'A Moment of Silence | Atmospheric Study Logs',
        reporterName: 'Faith_Walker_26',
        reason: 'Spam / Misleading',
        details: 'The title mentions Study Logs but it is just a looped black screen.',
        timestamp: '2026-07-03 18:22',
        status: 'pending'
      }
    ];
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
  const [currentUser, setCurrentUser] = useState<{ 
    name: string; 
    email: string; 
    avatar: string; 
    bio?: string; 
    isCreator: boolean;
    tiktokApiKey?: string;
    youtubeApiKey?: string;
    instagramApiKey?: string;
    facebookApiKey?: string;
  } | null>(() => {
    const saved = localStorage.getItem('ppl_user');
    if (saved === 'null') return null;
    return saved ? JSON.parse(saved) : {
      name: 'PushPlayUser',
      email: 'push2playlive@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      bio: 'Atmospheric video connoisseur and certified audio engineer.',
      isCreator: true // Connected to admin channel by default to showcase admin panel!
    };
  });

  // Current creator details (maps to currentUser details if they act as creator)
  const creatorDetails: Creator = {
    id: 'creator_braxtheog9', // matches Braxtheog9 mock profile
    name: currentUser?.name || 'PushPlayUser',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
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
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [homePlaybackMode, setHomePlaybackMode] = useState<'long' | 'short'>('long');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTheatreMode, setIsTheatreMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showQrModalForVideo, setShowQrModalForVideo] = useState<Video | null>(null);
  const [showReportModal, setShowReportModal] = useState<Video | null>(null);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  // Close mobile navigation menu on ESC press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

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
    localStorage.setItem('ppl_reports', JSON.stringify(reports));
  }, [reports]);

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

  const handleCloseReportModal = () => {
    setShowReportModal(null);
    setReportReason('Inappropriate Content');
    setReportDetails('');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReportModal) return;

    const newReport: VideoReport = {
      id: `rep_${Math.random().toString(36).substring(2, 9)}`,
      videoId: showReportModal.id,
      videoTitle: showReportModal.title,
      reporterName: currentUser?.name || 'AnonymousUser',
      reason: reportReason,
      details: reportDetails.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('ppl_reports', JSON.stringify(updatedReports));

    setToastMessage('Report Submitted! Thank you for keeping the platform safe.');
    setTimeout(() => setToastMessage(null), 3500);
    handleCloseReportModal();
  };

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

  const handleEditComment = (commentId: string, newText: string) => {
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, text: newText } : c));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => {
      const targetComment = prev.find(c => c.id === commentId);
      if (!targetComment) return prev;
      
      // Update comments count on the video
      setVideos(vids => vids.map(v => {
        if (v.id === targetComment.videoId) {
          return { ...v, commentsCount: Math.max(0, v.commentsCount - 1) };
        }
        return v;
      }));

      return prev.filter(c => c.id !== commentId);
    });
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

  const handleCreatePlaylist = (name: string, videoId?: string) => {
    const pl: Playlist = {
      id: `pl_${Math.random().toString(36).substring(2, 9)}`,
      name,
      videoIds: videoId ? [videoId] : [],
      createdBy: 'user_me'
    };
    setPlaylists(prev => [...prev, pl]);
    alert(`Created playlist "${name}" successfully.`);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== playlistId || pl.isSystem));
    alert('Playlist deleted successfully.');
  };

  const handleUpdateVideoDescription = (videoId: string, newDescription: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const updated = { ...v, description: newDescription };
        if (selectedVideo && selectedVideo.id === videoId) {
          setSelectedVideo(updated);
        }
        return updated;
      }
      return v;
    }));
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
  const handleUpdateProfile = (
    name: string,
    email: string,
    avatar: string,
    isCreator: boolean,
    bio?: string,
    tiktokApiKey?: string,
    youtubeApiKey?: string,
    instagramApiKey?: string,
    facebookApiKey?: string
  ) => {
    setCurrentUser({
      name,
      email,
      avatar,
      isCreator,
      bio,
      tiktokApiKey,
      youtubeApiKey,
      instagramApiKey,
      facebookApiKey
    });
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.setItem('ppl_user', 'null');
    setCurrentView('home');
  };

  // Navigation controller with page routing animations
  const handleNavigate = (view: string, params?: any) => {
    setCurrentView(view);
    setSearchQuery('');
    if (view === 'video-detail' && params?.video) {
      setSelectedVideo(params.video);
      setIsTheatreMode(false);
      
      // Save to watch history system playlist
      setPlaylists(prev => prev.map(pl => {
        if (pl.id === 'pl_history') {
          const withoutVideo = pl.videoIds.filter(id => id !== params.video.id);
          return { ...pl, videoIds: [params.video.id, ...withoutVideo] };
        }
        return pl;
      }));
    } else {
      setIsTheatreMode(false);
      if (view === 'shorts') {
        const shortsList = videos.filter(v => v.isShort);
        const idx = params?.index !== undefined ? params.index : 0;
        setActiveShortIdx(idx);
        
        // Save current short video to watch history
        if (shortsList[idx]) {
          const shortVid = shortsList[idx];
          setPlaylists(prev => prev.map(pl => {
            if (pl.id === 'pl_history') {
              const withoutVideo = pl.videoIds.filter(id => id !== shortVid.id);
              return { ...pl, videoIds: [shortVid.id, ...withoutVideo] };
            }
            return pl;
          }));
        }
      }
    }
    // scroll main panel to top
    const panel = document.getElementById('main-feed-scroll');
    if (panel) panel.scrollTop = 0;
  };

  // Filter main feed videos
  const activeLongPlayVideos = videos.filter(v => !v.isShort);
  const activeShortsVideos = videos.filter(v => v.isShort);

  const searchedVideos = (homePlaybackMode === 'long' ? activeLongPlayVideos : activeShortsVideos).filter(v => {
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
    'All', 'Pages', 'Space savers', 'Podcasts', 'Music', 'Mixes', 'Live', 'Testimonies', 'Enduro', 'Kickboxing', 
    'Wealth', 'Angels', 'Harps', 'Righteousness', 'Good', 'Intercessions', 'Mercy', 
    'Psychology', 'Consciousness', 'Recently uploaded', 'Watched', 'New to you'
  ];

  // Ad Placement Fetcher
  const activeAdCampaign = campaigns.find(c => c.status === 'active') || null;

  if (!currentUser) {
    return (
      <AuthView 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('ppl_user', JSON.stringify(user));
        }} 
      />
    );
  }

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
        onToggleMobileMenu={handleToggleSidebar}
      />

      {/* Mobile Drawer (Overlay and Menu Panel) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200" id="mobile-nav-drawer">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
            id="mobile-nav-backdrop"
          />
          {/* Drawer Panel */}
          <div className="relative flex flex-col w-72 max-w-xs h-full bg-[#0a0a0c] border-r border-zinc-900 p-4 space-y-4 overflow-y-auto animate-in slide-in-from-left duration-250 shadow-2xl" id="mobile-nav-panel">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-black fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" strokeWidth={2} />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gold-400 font-mono tracking-wider uppercase">PushPlay Menu</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800 cursor-pointer transition-all"
                title="Close menu"
                id="close-mobile-nav-btn"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <Navigation 
              currentView={currentView} 
              onNavigate={handleNavigate} 
              subscribedCreators={subscribedCreators} 
              onClose={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Structural Layout (Sidebar + Center Content Shelf) */}
      <div className="flex flex-1 overflow-hidden">
        <Navigation 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          subscribedCreators={subscribedCreators} 
          isCollapsed={sidebarCollapsed}
        />

        {/* Central Scrolling Feed */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-57px)]" id="main-feed-scroll">
          
          {/* HOME GRID STREAM */}
          {currentView === 'home' && (
            <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-200" id="home-stream-view">
              
              {/* Playback Mode Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
                <div>
                  <h1 className="text-sm font-bold text-zinc-100 font-mono tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                    <span>PushPlay Live Feed</span>
                  </h1>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Toggle between Extended Cinema streams and vertical Short Clips.</p>
                </div>
                <div className="flex bg-[#050507] p-1 rounded-xl border border-zinc-900 self-start sm:self-center">
                  <button
                    onClick={() => {
                      setHomePlaybackMode('long');
                      setActiveCategory('All');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${homePlaybackMode === 'long' ? 'bg-gold-500 text-black shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Cinema (Long Play)
                  </button>
                  <button
                    onClick={() => {
                      setHomePlaybackMode('short');
                      setActiveCategory('All');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${homePlaybackMode === 'short' ? 'bg-gold-500 text-black shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Clips (Short Play)
                  </button>
                </div>
              </div>

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
                    <span>{homePlaybackMode === 'long' ? 'Extended Cinema Streams' : 'Vertical Short Streams'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
                  </h2>
                  
                  {searchedVideos.length === 0 ? (
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
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${homePlaybackMode === 'short' ? 'md:grid-cols-4 xl:grid-cols-5' : 'md:grid-cols-3 xl:grid-cols-4'} gap-4`} id="home-videos-grid">
                      {searchedVideos.map((video) => (
                        <div
                          key={video.id}
                          onClick={() => {
                            if (video.isShort) {
                              const idx = videos.filter(v => v.isShort).findIndex(v => v.id === video.id);
                              handleNavigate('shorts', { index: idx !== -1 ? idx : 0 });
                            } else {
                              handleNavigate('video-detail', { video });
                            }
                          }}
                          className="bg-[#0c0c0f] border border-zinc-900/80 hover:border-gold-500/30 rounded-2xl overflow-hidden group/card cursor-pointer flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-gold-500/5 hover:-translate-y-0.5"
                        >
                          {/* Card Thumbnail */}
                          <div className={`${video.isShort ? 'aspect-[9/16]' : 'aspect-video'} bg-[#050507] overflow-hidden relative`}>
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
            <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-200 text-left" id="video-detail-workspace">
              {/* Workspace Navigation & Share Action Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-900/40" id="video-detail-header-actions">
                <button
                  onClick={() => handleNavigate('home')}
                  className="w-fit flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  ← Back to Channels
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowQrModalForVideo(selectedVideo)}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-white active:scale-95 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-gold-500/5"
                    id="show-video-qr-button"
                    title="Generate QR Code for mobile viewing"
                  >
                    <QrCode className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 text-gold-400 group-hover:text-gold-300" />
                    <span>Mobile QR</span>
                  </button>

                  <button
                    onClick={() => setShowReportModal(selectedVideo)}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/25 hover:bg-red-900/30 border border-red-900/30 hover:border-red-500/40 text-red-400 hover:text-red-300 active:scale-95 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-red-500/5"
                    id="report-video-button"
                    title="Flag this stream for review"
                  >
                    <Flag className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 text-red-400 group-hover:text-red-300" />
                    <span>Report</span>
                  </button>

                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/watch?v=${selectedVideo.id}`;
                      navigator.clipboard.writeText(link).then(() => {
                        setToastMessage('Link Copied! Stream link copied to your clipboard.');
                        setTimeout(() => setToastMessage(null), 3000);
                      });
                    }}
                    className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-gold-500/40 text-zinc-300 hover:text-white active:scale-95 text-xs font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-gold-500/5"
                    id="copy-video-link-button"
                    title="Copy link to clipboard"
                  >
                    <Copy className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 text-gold-400 group-hover:text-gold-300" />
                    <span>Copy Link</span>
                  </button>

                  <button
                    onClick={() => {
                      const link = `${window.location.origin}/watch?v=${selectedVideo.id}`;
                      navigator.clipboard.writeText(link).then(() => {
                        setToastMessage('Link Copied! Stream link copied to your clipboard.');
                        setTimeout(() => setToastMessage(null), 3000);
                      });
                    }}
                    className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 active:scale-95 text-black text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-xl shadow-gold-500/15 hover-pulse-gold"
                    id="share-video-button"
                    title="Copy link to clipboard"
                  >
                    <Share2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span>Share Live Stream</span>
                  </button>
                </div>
              </div>

              {/* Theatre Mode full width Player */}
              {isTheatreMode && (
                <div className="w-full">
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
                    isTheatreMode={isTheatreMode}
                    onToggleTheatreMode={() => setIsTheatreMode(!isTheatreMode)}
                    onUpdateVideoDescription={handleUpdateVideoDescription}
                  />
                </div>
              )}

              <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 ${isTheatreMode ? 'opacity-30 hover:opacity-100' : ''}`}>
                {/* Left Column: Player & Comments */}
                <div className="lg:col-span-2 space-y-6">
                  {!isTheatreMode && (
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
                      isTheatreMode={isTheatreMode}
                      onToggleTheatreMode={() => setIsTheatreMode(!isTheatreMode)}
                      onUpdateVideoDescription={handleUpdateVideoDescription}
                    />
                  )}
                  
                  {/* Comments Thread */}
                  <CommentsSection
                    comments={comments.filter(c => c.videoId === selectedVideo.id)}
                    onAddComment={handleAddComment}
                    onAddReply={handleAddReply}
                    onLikeComment={handleLikeComment}
                    onDislikeComment={handleDislikeComment}
                    onHeartComment={handleHeartComment}
                    onLikeReply={handleLikeReply}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
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
            </div>
          )}

          {/* VERTICAL SHORTS MULTI-STREAM PLAYER */}
          {currentView === 'shorts' && (
            <div className="p-4" id="shorts-playback-view">
              <ShortsPlayer
                shorts={activeShortsVideos}
                activeIdx={activeShortShorts()}
                onIndexChange={(idx) => {
                  setActiveShortIdx(idx);
                  if (activeShortsVideos[idx]) {
                    const shortVid = activeShortsVideos[idx];
                    setPlaylists(prev => prev.map(pl => {
                      if (pl.id === 'pl_history') {
                        const withoutVideo = pl.videoIds.filter(id => id !== shortVid.id);
                        return { ...pl, videoIds: [shortVid.id, ...withoutVideo] };
                      }
                      return pl;
                    }));
                  }
                }}
                comments={comments}
                onAddComment={handleAddShortComment}
                onLike={handleLikeVideo}
                onDislike={handleDislikeVideo}
                onSubscribe={handleSubscribe}
                onShare={(id) => {
                  navigator.clipboard.writeText(`${window.location.origin}/shorts?v=${id}`);
                  alert('Short stream copied to clipboard!');
                }}
                onAddReply={handleAddReply}
                onLikeComment={handleLikeComment}
                onDislikeComment={handleDislikeComment}
                onHeartComment={handleHeartComment}
                onLikeReply={handleLikeReply}
                currentUser={currentUser}
              />
            </div>
          )}

          {/* PLAYLISTS VIEW */}
          {currentView === 'playlists' && (
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="user-playlists-view">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
                <div>
                  <h1 className="text-sm font-bold text-zinc-100 font-mono tracking-widest uppercase flex items-center gap-2">
                    <List className="w-4 h-4 text-gold-500" /> 
                    <span>Playlist Studio</span>
                  </h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Create custom channels, manage Watch Later collections, and compile audio-visual logs.</p>
                </div>

                {/* Create Playlist Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const input = form.elements.namedItem('playlistName') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleCreatePlaylist(input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="flex items-center gap-2 bg-[#0c0c0f] border border-zinc-900 rounded-xl px-2.5 py-1.5 w-full md:max-w-xs"
                >
                  <input
                    type="text"
                    name="playlistName"
                    placeholder="New playlist name..."
                    required
                    className="bg-transparent text-xs text-zinc-250 outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="p-1 px-2.5 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                  >
                    Create
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Playlist Deck */}
                <div className="md:col-span-1 space-y-3">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Select Playlist</h3>
                  <div className="space-y-2">
                    {playlists.map((playlist) => {
                      const isActive = selectedPlaylistId === playlist.id;
                      return (
                        <div
                          key={playlist.id}
                          onClick={() => setSelectedPlaylistId(playlist.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-2.5 relative group ${
                            isActive
                              ? 'bg-gold-500/10 border-gold-500/30 shadow shadow-gold-500/5'
                              : 'bg-zinc-950 border-zinc-900/80 hover:border-zinc-800'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                              playlist.isSystem
                                ? 'bg-red-950/20 text-red-400 border-red-900/10'
                                : 'bg-gold-950/20 text-gold-400 border-gold-900/10'
                            }`}>
                              {playlist.isSystem ? 'System' : 'Custom'}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">{playlist.videoIds.length} items</span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-zinc-200 group-hover:text-gold-400 transition-colors">{playlist.name}</h4>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60 text-[10px]">
                            <span className="text-zinc-500 font-mono">ID: {playlist.id.replace('pl_', '')}</span>
                            {!playlist.isSystem && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                                    handleDeletePlaylist(playlist.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-400 font-bold font-mono text-[9px] uppercase tracking-wider cursor-pointer px-1 py-0.5 hover:bg-red-500/5 rounded"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Playlist Video Editor Shelf */}
                <div className="md:col-span-2 bg-[#0c0c0f]/80 border border-zinc-900/80 p-5 rounded-3xl min-h-[300px] flex flex-col justify-between">
                  {selectedPlaylistId ? (
                    (() => {
                      const playlist = playlists.find(p => p.id === selectedPlaylistId);
                      if (!playlist) return <p className="text-xs text-zinc-500 font-mono">No active playlist selected.</p>;
                      
                      const savedVideos = playlist.videoIds
                        .map(id => videos.find(v => v.id === id))
                        .filter((v): v is Video => !!v);

                      return (
                        <div className="space-y-4 w-full text-left">
                          <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
                            <div>
                              <h3 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-widest">{playlist.name} Streams</h3>
                              <p className="text-[10px] text-zinc-500 font-sans mt-0.5">Manage chronological entries inside this container.</p>
                            </div>
                            {savedVideos.length > 0 && (
                              <button
                                onClick={() => {
                                  handleNavigate(savedVideos[0].isShort ? 'shorts' : 'video-detail', { video: savedVideos[0] });
                                }}
                                className="px-3 py-1 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 cursor-pointer shadow shadow-gold-500/10"
                              >
                                <Play className="w-3 h-3 fill-current" /> Stream All
                              </button>
                            )}
                          </div>

                          {savedVideos.length === 0 ? (
                            <div className="text-center py-12">
                              <AlertCircle className="w-7 h-7 text-zinc-600 mx-auto mb-1.5" />
                              <p className="text-xs text-zinc-400 font-mono">No stream entries found inside this playlist.</p>
                              <p className="text-[10px] text-zinc-600 mt-1">Add streams directly from any Cinema player screen.</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                              {savedVideos.map((vid, idx) => (
                                <div
                                  key={`${vid.id}-${idx}`}
                                  className="flex items-center justify-between p-2 bg-zinc-950/60 rounded-xl border border-zinc-900/80 group/vid"
                                >
                                  <div
                                    onClick={() => handleNavigate(vid.isShort ? 'shorts' : 'video-detail', { video: vid })}
                                    className="flex items-center gap-3 cursor-pointer overflow-hidden flex-1"
                                  >
                                    <span className="text-[10px] text-zinc-500 font-mono w-4 text-center">{idx + 1}</span>
                                    <div className="w-14 aspect-video bg-zinc-900 rounded overflow-hidden flex-shrink-0 relative">
                                      <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="text-xs font-semibold text-zinc-250 truncate group-hover/vid:text-gold-400 transition-colors">{vid.title}</h4>
                                      <p className="text-[9px] text-zinc-500 font-mono truncate">{vid.creator.name} • {vid.duration}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleNavigate(vid.isShort ? 'shorts' : 'video-detail', { video: vid })}
                                      className="p-1.5 hover:bg-zinc-900 text-zinc-400 hover:text-gold-400 rounded-lg cursor-pointer transition-colors"
                                      title="Stream video"
                                    >
                                      <Play className="w-3.5 h-3.5 fill-current" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleAddToPlaylist(playlist.id, vid.id);
                                      }}
                                      className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                                      title="Remove from playlist"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-center py-12 my-auto">
                      <List className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-zinc-400">No playlist selected</p>
                      <p className="text-[10px] text-zinc-500 mt-1">Select any system or custom container from the left list to view and manage its contents.</p>
                    </div>
                  )}
                </div>
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
              campaigns={campaigns}
              onUpdateCampaign={(updated) => {
                setCampaigns(prev => prev.map(c => c.id === updated.id ? updated : c));
              }}
              comments={comments}
              onDeleteComment={handleDeleteComment}
              reports={reports}
              onUpdateReport={(updated) => {
                setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
              }}
            />
          )}

          {/* USER PROFILE & GENERAL SETTINGS PAGE */}
          {currentView === 'profile-settings' && (
            <ProfileSettings
              currentUser={currentUser}
              onUpdateProfile={handleUpdateProfile}
              subscribedCreators={subscribedCreators}
              onUnsubscribe={handleUnsubscribe}
              onLogout={handleLogout}
            />
          )}

          {/* WATCH HISTORY SYSTEM PLAYLIST VIEW */}
          {currentView === 'history' && (
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 text-left animate-in fade-in duration-200" id="watch-history-view">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-3">
                <div>
                  <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <History className="w-5.5 h-5.5 text-red-500" /> Watch History Stream Grid
                  </h1>
                  <p className="text-xs text-zinc-500">Every broadcast and short stream you have recently tuned into.</p>
                </div>
                {getPlaylistVideos('pl_history').length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to clear your entire watch history?')) {
                        setPlaylists(prev => prev.map(pl => {
                          if (pl.id === 'pl_history') {
                            return { ...pl, videoIds: [] };
                          }
                          return pl;
                        }));
                      }
                    }}
                    className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-lg text-xs font-bold uppercase cursor-pointer border border-zinc-850 transition-all"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {getPlaylistVideos('pl_history').length === 0 ? (
                <div className="text-center py-12 bg-zinc-900/10 rounded-2xl border border-zinc-900 p-6">
                  <AlertCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-zinc-400">Your Watch History index is empty</p>
                  <p className="text-xs text-zinc-500 mt-1">Start playing long broadcasts or short streams to fill your logs.</p>
                  <button onClick={() => setCurrentView('home')} className="mt-4 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-full font-bold cursor-pointer transition-colors">Discover Streams</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {getPlaylistVideos('pl_history').map(vid => (
                    <div
                      key={vid.id}
                      className="bg-zinc-950 border border-zinc-900 rounded-xl p-2 flex gap-3 cursor-pointer hover:border-zinc-800 transition-all relative group"
                    >
                      <div className="w-20 h-12 rounded overflow-hidden flex-shrink-0 relative" onClick={() => handleNavigate('video-detail', { video: vid })}>
                        <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 font-mono text-[8px] text-zinc-300 px-1 rounded">{vid.duration}</span>
                      </div>
                      <div className="min-w-0 flex-grow" onClick={() => handleNavigate('video-detail', { video: vid })}>
                        <h4 className="text-xs font-bold text-zinc-200 truncate group-hover:text-red-400 transition-colors">{vid.title}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{vid.creator.name}</p>
                        <span className="text-[9px] font-mono text-zinc-500 mt-1 block">{(vid.views).toLocaleString()} views</span>
                      </div>
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlaylists(prev => prev.map(pl => {
                            if (pl.id === 'pl_history') {
                              return { ...pl, videoIds: pl.videoIds.filter(id => id !== vid.id) };
                            }
                            return pl;
                          }));
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-zinc-900 border border-zinc-850 hover:bg-red-950/20 text-zinc-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                        title="Remove from history"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CREATOR STUDIO WORKSPACE (Screenshot matching) */}
          {currentView === 'creator-studio' && (
            <CreatorStudio
              videos={videos}
              onDeleteVideo={handleDeleteVideo}
              onUpdateVideo={(updated) => {
                setVideos(prev => prev.map(v => v.id === updated.id ? updated : v));
                if (selectedVideo?.id === updated.id) {
                  setSelectedVideo(updated);
                }
              }}
              currentUser={currentUser}
              onUpdateProfile={(updatedUser) => {
                setCurrentUser(updatedUser);
                localStorage.setItem('ppl_user', JSON.stringify(updatedUser));
              }}
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

          {/* MUSIC CHANNEL & HUB PLATFORM */}
          {currentView === 'music' && (
            <MusicView />
          )}
        </main>
      </div>

      {/* Floating Global QR Code Scanner Modal */}
      {showQrModalForVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          id="qr-modal-overlay"
        >
          <div className="bg-[#0b0b0f] border-2 border-gold-500/40 w-full max-w-sm rounded-3xl p-6 text-center space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowQrModalForVideo(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-950/60 text-zinc-400 hover:text-white border border-zinc-900 cursor-pointer transition-all"
              title="Close modal"
              id="close-qr-modal-btn"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-1.5">
              <span className="inline-block px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 text-[9px] font-mono font-black uppercase tracking-widest border border-gold-500/20">
                Mobile Sync Link
              </span>
              <h3 className="text-sm font-bold text-zinc-100 font-sans tracking-tight line-clamp-1">
                {showQrModalForVideo.title}
              </h3>
            </div>

            <div className="relative mx-auto w-48 h-48 bg-zinc-950 p-2.5 rounded-2xl border border-zinc-900 shadow-inner flex items-center justify-center group/qr">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=d4af37&bgcolor=09090b&data=${encodeURIComponent(`${window.location.origin}/watch?v=${showQrModalForVideo.id}`)}`} 
                alt="QR Code" 
                className="w-full h-full rounded-lg transition-transform duration-300 group-hover/qr:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed px-2">
                Scan this QR code with your phone's camera or a QR reader application to instantly launch this stream on your mobile device.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono font-bold text-gold-400 bg-gold-500/5 py-1 px-3.5 rounded-full border border-gold-500/15 w-fit mx-auto max-w-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate">watch?v={showQrModalForVideo.id}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/watch?v=${showQrModalForVideo.id}`).then(() => {
                    setToastMessage('Link Copied to Clipboard!');
                    setTimeout(() => setToastMessage(null), 3000);
                  });
                }}
                className="flex-1 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-gold-500/20 text-zinc-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
              >
                Copy URL
              </button>
              <button
                onClick={() => setShowQrModalForVideo(null)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Global Upload Dialog Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleUploadVideo}
        creatorDetails={creatorDetails}
        type={uploadType}
      />

      {/* REPORT VIDEO MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-[#000]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-left" id="report-modal">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-red-650/10 text-red-500 rounded-lg border border-red-500/20">
                  <Flag className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-zinc-150">Flag Content for Review</h3>
              </div>
              <button 
                onClick={handleCloseReportModal}
                className="p-1 text-zinc-550 hover:text-zinc-350 rounded transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#0c0c0f] border border-zinc-900 p-3 rounded-xl">
              <span className="text-[9px] font-mono text-zinc-500 uppercase block">FLAGGING STREAM</span>
              <p className="text-xs font-bold text-zinc-200 truncate">{showReportModal.title}</p>
              <p className="text-[10px] text-zinc-500">By: {showReportModal.creator.name}</p>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Select Violation Category</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl text-xs px-3 py-2.5 text-zinc-200 outline-none focus:border-red-500/30 cursor-pointer"
                >
                  <option value="Inappropriate Content">🔞 Inappropriate Content</option>
                  <option value="Hate Speech / Harassment">🗣️ Hate Speech / Harassment</option>
                  <option value="Violates Copyright">⚖️ Copyright Violation</option>
                  <option value="Spam / Misleading">⚠️ Spam or Misleading</option>
                  <option value="Violence / Dangerous">🚨 Violence or Dangerous Behavior</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 uppercase font-bold">Additional Details (Optional)</label>
                <textarea
                  placeholder="Please specify timestamps or other helpful details..."
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl text-xs px-3 py-2 text-zinc-200 outline-none h-24 resize-none focus:border-red-500/30"
                />
              </div>

              <p className="text-[10px] text-zinc-500 leading-normal">
                PushPlay moderators investigate flagged streams 24/7. Filing false or malicious reports may result in account restriction.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseReportModal}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-850 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/10"
                >
                  Submit Flag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0d11] border border-gold-500/30 text-gold-400 font-mono font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
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
