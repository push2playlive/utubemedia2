export interface Creator {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  isSubscribed: boolean;
  hasStore: boolean;
  storeName?: string;
  joinedDate: string;
}

export interface StoreProduct {
  id: string;
  creatorId: string;
  creatorName: string;
  name: string;
  price: number; // in PPL
  image: string;
  description: string;
  stock: number;
  sales: number;
  category: 'merch' | 'digital' | 'nft';
}

export interface StoreLease {
  id: string;
  creatorId: string;
  creatorName: string;
  storeName: string;
  plan: 'Bronze' | 'Silver' | 'Gold';
  priceMonthly: number; // in PPL
  leasedDate: string;
  status: 'active' | 'pending' | 'expired';
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string; // fallback preview URL (or standard video tag source)
  thumbnail: string;
  duration: string; // "12:34" style or "0:30"
  views: number;
  uploadDate: string;
  likes: number;
  dislikes: number;
  category: string;
  creator: Creator;
  isShort: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  isWatchLater?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  adEnabled: boolean;
  subscriptionGated: boolean; // Needs Creator Subscription to watch
  products?: StoreProduct[]; // Products linked to this video/creator
}

export interface CommentReply {
  id: string;
  commentId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  timestamp: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  videoId: string;
  userName: string;
  userAvatar: string;
  text: string;
  likes: number;
  dislikes: number;
  timestamp: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isHeartedByCreator?: boolean;
  replies: CommentReply[];
}

export interface AdCampaign {
  id: string;
  advertiserName: string;
  title: string;
  type: 'video' | 'banner';
  mediaUrl: string; // image or video placeholder
  targetUrl: string;
  budgetTotal: number; // in PPL
  budgetSpent: number; // in PPL
  status: 'active' | 'paused' | 'completed';
  views: number;
  clicks: number;
  costPerClick: number; // in PPL
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'tip' | 'subscription' | 'ad_payment' | 'store_purchase' | 'store_lease' | 'ad_payout' | 'video_earnings';
  amount: number;
  currency: 'ETH' | 'PPL';
  description: string;
  timestamp: string;
  sender: string;
  recipient: string;
}

export interface UserWallet {
  address: string;
  balanceETH: number;
  balancePPL: number; // 1 PPL = $0.10 roughly, native platform token
  transactions: WalletTransaction[];
}

export interface Playlist {
  id: string;
  name: string;
  videoIds: string[];
  createdBy: string;
  isSystem?: boolean; // Watch Later, Liked Videos etc.
}

export interface ChannelAnalytics {
  viewsTotal: number;
  watchTimeHours: number;
  subscribersCount: number;
  revenueTotalPPL: number;
  earningsByMonth: { month: string; amount: number }[];
  viewsByVideo: { videoTitle: string; views: number }[];
}

export interface StatusHistoryEntry {
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  timestamp: string;
  message: string;
}

export interface VideoReport {
  id: string;
  videoId: string;
  videoTitle: string;
  reporterName: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  evidence?: string; // Base64 snapshot image
  internalNotes?: string; // Internal/diagnostic Notes & Timestamps
  urgent?: boolean; // High Urgency marker
  statusHistory?: StatusHistoryEntry[];
}
