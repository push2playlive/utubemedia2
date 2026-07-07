import { Video, Creator, StoreProduct, AdCampaign, UserWallet, Comment, Playlist } from './types';

// Pre-defined Creators
export const creators: Creator[] = [
  {
    id: 'creator_wisdom',
    name: 'A Word of Wisdom',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    subscribers: 42300,
    isSubscribed: true,
    hasStore: true,
    storeName: 'Wisdom Prophetics & Merch',
    joinedDate: '2024-01-12'
  },
  {
    id: 'creator_dirty_lense',
    name: 'My Dirty Lense',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    subscribers: 89000,
    isSubscribed: false,
    hasStore: true,
    storeName: 'Dirty Lense Urban Presets',
    joinedDate: '2023-05-18'
  },
  {
    id: 'creator_be_amazed',
    name: 'BE AMAZED',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    subscribers: 12400000,
    isSubscribed: false,
    hasStore: false,
    joinedDate: '2019-11-04'
  },
  {
    id: 'creator_covenant',
    name: 'Chosen One Covenant',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    subscribers: 15400,
    isSubscribed: true,
    hasStore: false,
    joinedDate: '2025-02-28'
  },
  {
    id: 'creator_braxtheog9',
    name: 'Push2Play Chat',
    avatar: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=150', // high quality camera studio red-orange backdrop
    subscribers: 6,
    isSubscribed: false,
    hasStore: true,
    storeName: 'Push2Play Official Gear',
    joinedDate: '2025-06-01'
  },
  {
    id: 'creator_rescue_team',
    name: 'Rescue Operations Daily',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    subscribers: 125000,
    isSubscribed: false,
    hasStore: false,
    joinedDate: '2024-09-15'
  },
  {
    id: 'creator_harpy_keeper',
    name: 'Avian Interactions',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    subscribers: 34000,
    isSubscribed: false,
    hasStore: true,
    storeName: 'Harpy Eagle Conserv Store',
    joinedDate: '2024-10-30'
  },
  {
    id: 'creator_elon_podcast',
    name: 'Tech Future Podcast',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    subscribers: 940000,
    isSubscribed: true,
    hasStore: true,
    storeName: 'Tech Future Premium Store',
    joinedDate: '2022-03-14'
  },
  {
    id: 'creator_think_media',
    name: 'Think Media',
    avatar: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=150',
    subscribers: 3490000,
    isSubscribed: false,
    hasStore: false,
    joinedDate: '2015-04-12'
  }
];

// Pre-defined Store Products for creators who "lease" a store
export const initialProducts: StoreProduct[] = [
  {
    id: 'prod_wisdom_bible',
    creatorId: 'creator_wisdom',
    creatorName: 'A Word of Wisdom',
    name: 'Leather-bound Wisdom Study Journal',
    price: 150, // PPL
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    description: 'A beautifully hand-stitched premium leather journal, perfect for recording spiritual insights, daily meditations, and prophetic words. Includes custom gold leaf edges and ribbon marker.',
    stock: 45,
    sales: 120,
    category: 'merch'
  },
  {
    id: 'prod_wisdom_tee',
    creatorId: 'creator_wisdom',
    creatorName: 'A Word of Wisdom',
    name: '"Chosen One" Premium Oversized Hoodie',
    price: 250, // PPL
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300',
    description: 'Heavyweight 100% organic cotton graphic hoodie in desert sand color. Features high-quality minimalist puff print design reflecting divine choosing.',
    stock: 120,
    sales: 310,
    category: 'merch'
  },
  {
    id: 'prod_lense_preset_pack',
    creatorId: 'creator_dirty_lense',
    creatorName: 'My Dirty Lense',
    name: 'Urban Gritty Lightroom Presets v4',
    price: 90, // PPL
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300',
    description: '12 high-contrast street presets tuned for urban environments, neon night walks, and cinematic moody portrait sessions. Works on mobile & desktop Lightroom.',
    stock: 9999, // digital item
    sales: 450,
    category: 'digital'
  },
  {
    id: 'prod_lense_print',
    creatorId: 'creator_dirty_lense',
    creatorName: 'My Dirty Lense',
    name: 'Wellington Central Rain Reflection Print (A2)',
    price: 320, // PPL
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=300',
    description: 'Limited edition physical A2 gloss photograph print of rain reflections on the streets of Wellington. Individually numbered and signed.',
    stock: 15,
    sales: 35,
    category: 'merch'
  },
  {
    id: 'prod_brax_beanie',
    creatorId: 'creator_braxtheog9',
    creatorName: 'Braxtheog9',
    name: 'Signature Cosmic Ribbed Beanie',
    price: 80, // PPL
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=300',
    description: 'A super soft, double-walled knit beanie in space black. Embroidered with Brax\'s trademark play-button constellation.',
    stock: 60,
    sales: 85,
    category: 'merch'
  },
  {
    id: 'prod_harpy_nft',
    creatorId: 'creator_harpy_keeper',
    creatorName: 'Avian Interactions',
    name: 'Harpy Eagle Sky King digital token (NFT)',
    price: 800, // PPL
    image: 'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=300',
    description: 'A exclusive, certified proof-of-support digital artwork of the majestic Harpy Eagle. 100% of proceeds go towards sanctuary maintenance.',
    stock: 10,
    sales: 4,
    category: 'nft'
  },
  {
    id: 'prod_elon_premium',
    creatorId: 'creator_elon_podcast',
    creatorName: 'Tech Future Podcast',
    name: 'Lifetime Premium Pass (Private Discord Access)',
    price: 1500, // PPL
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300',
    description: 'Gain ultimate backstage access! Join private AMAs, obtain beta project releases, ask direct questions to guests, and collaborate on open-source future tech initiatives.',
    stock: 100,
    sales: 42,
    category: 'digital'
  }
];

// Pre-defined Videos (Matching user screenshots and specific themes)
export const initialVideos: Video[] = [
  // --- LONG VIDEOS ---
  {
    id: 'video_utube_1',
    title: 'The Most Affordable iPhone Ever Made Will Shock You!',
    description: 'Apple iPhone 16e The Budget Beast Unveiled Review #iphone #iphone16e #smartphones #iphone16ereview. A deep dive review of specs, performance, and real-world value.',
    url: 'iphone_review',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    duration: '9:54',
    views: 94,
    uploadDate: '26 Feb 2025',
    likes: 4,
    dislikes: 0,
    category: 'Pages',
    creator: creators[4], // Utube Chat
    isShort: false,
    commentsCount: 0,
    adEnabled: true,
    subscriptionGated: false
  },
  {
    id: 'video_utube_2',
    title: 'Inside the White House Secrets & Security',
    description: 'Add description. Today we go behind the scenes to uncover the secret rooms, security details, and historical facts of the world\'s most famous executive mansion.',
    url: 'white_house_secrets',
    thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    duration: '11:24',
    views: 9,
    uploadDate: '22 Feb 2025',
    likes: 1,
    dislikes: 0,
    category: 'Space savers',
    creator: creators[4], // Utube Chat
    isShort: false,
    commentsCount: 0,
    adEnabled: true,
    subscriptionGated: false
  },
  {
    id: 'video_utube_3',
    title: 'Dubai Paradise or Problem The Real Story Behind The Glitter?',
    description: 'Add description. Looking past the luxury and skylines, we analyze the structural and societal realities of Dubai.',
    url: 'dubai_real_story',
    thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    duration: '10:13',
    views: 22,
    uploadDate: '22 Feb 2025',
    likes: 2,
    dislikes: 0,
    category: 'Pages',
    creator: creators[4], // Utube Chat
    isShort: false,
    commentsCount: 0,
    adEnabled: true,
    subscriptionGated: false
  },
  {
    id: 'video_wisdom_1',
    title: 'Chosen Ones: Don\'t Blame God if You Ignore this Prophetic Date 🔥',
    description: 'A message for the chosen generation. This prophetic breakdown details the spiritual alignment occurring between July 2nd, 3rd, and 4th, 2026. Join us as we inspect what scriptures say about standing firm and tuning your spirit to hear the still, small voice of guidance during turbulent times. Do not neglect your spiritual disciplines, study daily, and keep your lamps burning.',
    url: 'cloud_wisdom', // code identifier for canvas animator
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    duration: '28:05',
    views: 4125,
    uploadDate: '2 days ago',
    likes: 1120,
    dislikes: 12,
    category: 'Testimonies',
    creator: creators[0], // A Word of Wisdom
    isShort: false,
    commentsCount: 3,
    adEnabled: true,
    subscriptionGated: false,
    products: [initialProducts[0], initialProducts[1]]
  },
  {
    id: 'video_lense_1',
    title: 'Tales From The Streets | Walking Wellington Central',
    description: 'Armed with a vintage camera setup, we explore the vibrant, rain-soaked avenues of Wellington Central. Capturing candid street interactions, reflecting puddle neon signs, and talking to local street artisans about their craft and journey. This is a sensory exploration of urban flow, negative space, and architectural textures.',
    url: 'neon_streets',
    thumbnail: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
    duration: '26:57',
    views: 3820,
    uploadDate: '5 days ago',
    likes: 742,
    dislikes: 5,
    category: 'Photography',
    creator: creators[1], // My Dirty Lense
    isShort: false,
    commentsCount: 2,
    adEnabled: true,
    subscriptionGated: false,
    products: [initialProducts[2], initialProducts[3]]
  },
  {
    id: 'video_amazed_1',
    title: 'The Most Powerful Machine Guns Ever Made',
    description: 'From rapid-fire rotary Gatling systems to cutting-edge electronic defense arrays that fire 6,000 rounds per minute! In this deep dive, we break down the history, precision engineering, mechanical operation, and destructive capability of the worlds most formidable automated firing platforms.',
    url: 'military_tech',
    thumbnail: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800',
    duration: '28:43',
    views: 282400,
    uploadDate: '9 months ago',
    likes: 31400,
    dislikes: 340,
    category: 'Engineering',
    creator: creators[2], // BE AMAZED
    isShort: false,
    commentsCount: 5,
    adEnabled: true,
    subscriptionGated: false
  },
  {
    id: 'video_covenant_1',
    title: 'God\'s Chosen Ones: Please Don\'t Scroll - God Knows You Need This Word 🔥',
    description: 'Have you felt isolated, weary, or set apart? This video is an intensive prayer and encouragement stream reminding you of your calling, covenant path, and the spiritual protection that encompasses your steps. Grab a journal, open your heart, and let this peaceful meditation fortify your soul. God knows exactly what you are facing right now.',
    url: 'divine_message',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    duration: '1:28:46',
    views: 80,
    uploadDate: '6 days ago',
    likes: 18,
    dislikes: 0,
    category: 'Testimonies',
    creator: creators[3], // Chosen One Covenant
    isShort: false,
    commentsCount: 1,
    adEnabled: false,
    subscriptionGated: true // Gated premium stream!
  },
  {
    id: 'video_think_media_1',
    title: 'How to Live Stream on YouTube (Complete Beginner\'s Guide)',
    description: 'Here\'s how to live stream on YouTube! Learn the complete step-by-step process to enable live streaming on YouTube. ✅ Get a 14-Day FREE Trial of Sean\'s favorite streaming/recording software HERE 👉 http://StreamWithThink.com \n\nWant to break through on YouTube? Join our FREE 3-Day YouTube Growth Sprint for the ultimate plan to start getting views and grow your channel fast! ➡️ http://YTSprint.com/\n\n0:00 Introduction\n1:45 Setting Up Your Equipment\n4:10 Choosing Streaming Software\n8:15 Configuring Live Stream Settings\n14:20 Engaging with Your Audience\n22:10 Monetizing Your Stream & Q&A',
    url: 'think_media_live',
    thumbnail: 'https://images.unsplash.com/photo-1618519764620-7403abdbfee9?w=800',
    duration: '28:05',
    views: 330000,
    uploadDate: '1 year ago',
    likes: 5600,
    dislikes: 120,
    category: 'Engineering',
    creator: creators[8], // Think Media
    isShort: false,
    commentsCount: 15,
    adEnabled: false,
    subscriptionGated: true // Members only monetized video!
  },

  // --- SHORTS VIDEOS (Vertical Format, isShort: true) ---
  {
    id: 'short_got_god',
    title: 'GOT GOD ☁️ Heavenly Vibe Check',
    description: 'Heavenly visual, God is amazing. Stand firm, your light is rising!',
    url: 'heavenly_particle',
    thumbnail: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400',
    duration: '0:30',
    views: 18400,
    uploadDate: 'July 3, 2026',
    likes: 112,
    dislikes: 1,
    category: 'Shorts',
    creator: creators[4], // Braxtheog9 (Matches the @Braxtheog9 user first screenshot)
    isShort: true,
    commentsCount: 2,
    adEnabled: false,
    subscriptionGated: false,
    products: [initialProducts[4]]
  },
  {
    id: 'short_rescue',
    title: 'Extreme Building Rescue Operation 🚒 Crane Alignment!',
    description: 'Massive engineering precision to safely support a structurally compromised high-rise in the city center. Incredible work by the response unit!',
    url: 'rescue_crane',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    duration: '0:45',
    views: 112000,
    uploadDate: '1 week ago',
    likes: 8900,
    dislikes: 42,
    category: 'Shorts',
    creator: creators[5], // Rescue Operations Daily
    isShort: true,
    commentsCount: 1,
    adEnabled: true,
    subscriptionGated: false
  },
  {
    id: 'short_chopper',
    title: 'Naughty Cinematic custom chopper first cold start! 🏍️',
    description: 'Raw mechanics and custom pipe engineering. The roar on this absolute beast is deafening! What do you think of the custom matte black paint job?',
    url: 'chopper_vibe',
    thumbnail: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
    duration: '0:50',
    views: 45000,
    uploadDate: '3 days ago',
    likes: 3100,
    dislikes: 18,
    category: 'Shorts',
    creator: creators[1], // My Dirty Lense
    isShort: true,
    commentsCount: 1,
    adEnabled: false,
    subscriptionGated: false
  },
  {
    id: 'short_harpy',
    title: 'Meeting a Giant Harpy Eagle face to face! 🦅',
    description: 'The sheer scale of these claws is mindblowing! The Harpy Eagle is the apex avian predator of the rainforest canopy. Absolute beauty.',
    url: 'giant_eagle',
    thumbnail: 'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?w=400',
    duration: '0:40',
    views: 780000,
    uploadDate: '2 weeks ago',
    likes: 62000,
    dislikes: 110,
    category: 'Shorts',
    creator: creators[6], // Avian Interactions
    isShort: true,
    commentsCount: 1,
    adEnabled: true,
    subscriptionGated: false,
    products: [initialProducts[5]]
  },
  {
    id: 'short_elon',
    title: 'Elon Musk on the ultimate simulation boundary 🤯',
    description: 'Do we live in an ancestor simulation built by a Type II civilization? A mind-boggling overview of computational evolution and quantum limits.',
    url: 'elon_sim',
    thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400',
    duration: '0:58',
    views: 1250000,
    uploadDate: 'Yesterday',
    likes: 142000,
    dislikes: 2100,
    category: 'Shorts',
    creator: creators[7], // Tech Future Podcast
    isShort: true,
    commentsCount: 3,
    adEnabled: true,
    subscriptionGated: false,
    products: [initialProducts[6]]
  }
];

// Initial preloaded comments with replies matching screenshots and spiritual/general discussions
export const initialComments: Comment[] = [
  {
    id: 'c_utube_1',
    videoId: 'video_wisdom_1',
    userName: 'Push2PlayChat',
    userAvatar: 'pp_logo',
    text: 'the old bike',
    likes: 0,
    dislikes: 0,
    timestamp: '0 seconds ago',
    replies: []
  },
  {
    id: 'c_1',
    videoId: 'video_wisdom_1',
    userName: 'Faith_Walker_26',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    text: 'This word is incredibly timely. I have felt such a strong spiritual pulling this entire week to go deeper. God is absolutely doing a new thing between July 2nd and 4th!',
    likes: 145,
    dislikes: 2,
    timestamp: '1 day ago',
    isHeartedByCreator: true,
    replies: [
      {
        id: 'r_1',
        commentId: 'c_1',
        userName: 'A Word of Wisdom',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        text: 'Amen, keep pressing in! The peace of God is your anchor.',
        likes: 38,
        timestamp: '18 hours ago'
      },
      {
        id: 'r_2',
        commentId: 'c_1',
        userName: 'GraceSeeks',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
        text: 'Agreed! Feeling that same whisper in my daily study times. Incredible confirmation.',
        likes: 12,
        timestamp: '12 hours ago'
      }
    ]
  },
  {
    id: 'c_2',
    videoId: 'video_wisdom_1',
    userName: 'John_Prophetic_Insight',
    userAvatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=100',
    text: 'Do you recommend any specific verses to study regarding this July gateway of dates?',
    likes: 24,
    dislikes: 1,
    timestamp: '2 days ago',
    isHeartedByCreator: false,
    replies: [
      {
        id: 'r_3',
        commentId: 'c_2',
        userName: 'A Word of Wisdom',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
        text: 'Look into Isaiah 43:18-19, and Joshua 3:5. Prepare your heart for tomorrow.',
        likes: 15,
        timestamp: '1 day ago'
      }
    ]
  },
  {
    id: 'c_3',
    videoId: 'video_lense_1',
    userName: 'CinematicTraveler',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100',
    text: 'Wellington street textures are beautiful, especially in the winter rain. What lens and filter setup were you shooting on for those glowing reflections?',
    likes: 85,
    dislikes: 0,
    timestamp: '4 days ago',
    isHeartedByCreator: true,
    replies: [
      {
        id: 'r_4',
        commentId: 'c_3',
        userName: 'My Dirty Lense',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        text: 'Thanks! I was running a standard vintage Super-Takumar 50mm f/1.4 with a subtle black mist filter to soften the neon halos.',
        likes: 45,
        timestamp: '3 days ago'
      }
    ]
  },
  {
    id: 'c_4',
    videoId: 'video_amazed_1',
    userName: 'TechEngineer_Pro',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
    text: 'The sheer rate of cooling required for a Gatling system at 6,000 RPM is incredible. Material science is the true hero here.',
    likes: 1024,
    dislikes: 14,
    timestamp: '8 months ago',
    replies: []
  },
  {
    id: 'c_5',
    videoId: 'short_got_god',
    userName: 'BraxFan99',
    userAvatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=100',
    text: 'This edit is so majestic! The transition with the moving clouds is stunning.',
    likes: 42,
    dislikes: 0,
    timestamp: '1 day ago',
    replies: []
  },
  {
    id: 'c_6',
    videoId: 'short_elon',
    userName: 'SimHypothesis',
    userAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100',
    text: 'If we are simulated, does that mean our local token (PPL) is basically simulated fuel? Double levels of inception!',
    likes: 215,
    dislikes: 3,
    timestamp: '16 hours ago',
    replies: []
  }
];

// Initial preloaded ad campaigns
export const initialAdCampaigns: AdCampaign[] = [
  {
    id: 'ad_web3_academy',
    advertiserName: 'Web3 Builder Academy',
    title: 'Learn Solidity & React for Web3 in 6 Weeks',
    type: 'banner',
    mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    targetUrl: 'https://example.com/web3-academy',
    budgetTotal: 2000,
    budgetSpent: 450,
    status: 'active',
    views: 12400,
    clicks: 1420,
    costPerClick: 0.5
  },
  {
    id: 'ad_crypto_ledger',
    advertiserName: 'Titanium Cold Wallets',
    title: 'Your Crypto, Secure Offline. Zero Compromise.',
    type: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=600',
    targetUrl: 'https://example.com/titanium-wallet',
    budgetTotal: 5000,
    budgetSpent: 1200,
    status: 'active',
    views: 25000,
    clicks: 2100,
    costPerClick: 1.2
  },
  {
    id: 'ad_cloud_hosting',
    advertiserName: 'Apex Cloud Run',
    title: 'Deploy Full-Stack containers in seconds',
    type: 'banner',
    mediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600',
    targetUrl: 'https://example.com/apex-cloud',
    budgetTotal: 1000,
    budgetSpent: 980,
    status: 'active',
    views: 9400,
    clicks: 820,
    costPerClick: 0.8
  }
];

// Mock User Crypto Wallet Setup
export const initialWallet: UserWallet = {
  address: '0x9a8B...884F',
  balanceETH: 1.45,
  balancePPL: 2500, // 2500 platform tokens ($250 value)
  transactions: [
    {
      id: 'tx_init_dep',
      type: 'deposit',
      amount: 1.5,
      currency: 'ETH',
      description: 'Initial Wallet Import Connection',
      timestamp: '2026-06-28 14:32',
      sender: 'External Address (0x12a3...)',
      recipient: '0x9a8B...884F'
    },
    {
      id: 'tx_sub_wisdom',
      type: 'subscription',
      amount: 50,
      currency: 'PPL',
      description: 'Monthly Channel Subscription - A Word of Wisdom',
      timestamp: '2026-07-01 09:15',
      sender: '0x9a8B...884F',
      recipient: 'creator_wisdom'
    },
    {
      id: 'tx_tip_brax',
      type: 'tip',
      amount: 25,
      currency: 'PPL',
      description: 'Short tip for GOT GOD edit',
      timestamp: '2026-07-03 11:24',
      sender: '0x9a8B...884F',
      recipient: 'creator_braxtheog9'
    }
  ]
};

// Default system & user playlists
export const initialPlaylists: Playlist[] = [
  {
    id: 'pl_history',
    name: 'Watch History',
    videoIds: ['video_wisdom_1'],
    createdBy: 'user_me',
    isSystem: true
  },
  {
    id: 'pl_watch_later',
    name: 'Watch Later',
    videoIds: [],
    createdBy: 'user_me',
    isSystem: true
  },
  {
    id: 'pl_liked',
    name: 'Liked Videos',
    videoIds: ['video_wisdom_1', 'short_got_god'],
    createdBy: 'user_me',
    isSystem: true
  },
  {
    id: 'pl_gospel',
    name: 'My Daily Spiritual Uplift',
    videoIds: ['video_wisdom_1', 'video_covenant_1'],
    createdBy: 'user_me',
    isSystem: false
  }
];
