import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, Share2, Plus, Check, X, MessageSquare, Flame, Music, ExternalLink, Calendar, Award, ChevronRight, ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  duration: string;
  seconds: number;
  audioUrl?: string;
}

interface Playlist {
  id: string;
  title: string;
  description: string;
  artist: string;
  songCount: number;
  songs: Track[];
  image: string;
  badge?: string;
  verticalBadge?: string;
}

interface FeaturedVideo {
  id: string;
  title: string;
  creator: string;
  views: string;
  timeAgo: string;
  bannerImg: string;
  videoImg: string;
  embedId?: string;
}

export default function MusicView() {
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'posts'>('home');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [postsLikes, setPostsLikes] = useState<Record<string, number>>({ 'post1': 1420, 'post2': 945 });
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({ 'option1': 642, 'option2': 1120, 'option3': 415 });
  const [hasVoted, setHasVoted] = useState(false);

  // Comments, Likes, Dislikes and Ad Counts state for music tracks
  const [trackComments, setTrackComments] = useState<Record<string, { id: string; userName: string; userAvatar: string; text: string; timestamp: string }[]>>(() => {
    const saved = localStorage.getItem('ppl_track_comments');
    if (saved) return JSON.parse(saved);
    return {
      'the-hit-list_Messy': [
        { id: 'tc1', userName: 'MelodySeeker', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', text: 'Olivia Dean is absolutely unmatched. Such raw emotion!', timestamp: '2 hours ago' },
        { id: 'tc2', userName: 'BassLover', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', text: 'That horn section is tasty', timestamp: '5 hours ago' }
      ],
      'country-hotlist_The Painter': [
        { id: 'tc3', userName: 'CountryFan99', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', text: 'Cody Johnson is keeping real country alive!', timestamp: '1 day ago' }
      ]
    };
  });

  const [trackStats, setTrackStats] = useState<Record<string, { likes: number; dislikes: number; liked?: boolean; disliked?: boolean }>>(() => {
    const saved = localStorage.getItem('ppl_track_stats');
    if (saved) return JSON.parse(saved);
    return {
      'the-hit-list_Messy': { likes: 12540, dislikes: 142 },
      'the-hit-list_Be My Own Boyfriend': { likes: 8412, dislikes: 95 },
      'the-hit-list_Dive': { likes: 6245, dislikes: 55 },
      'the-hit-list_The Hardest Part': { likes: 9812, dislikes: 110 },
      'country-hotlist_The Painter': { likes: 4520, dislikes: 62 },
      'country-hotlist_Dirt Cheap': { likes: 3820, dislikes: 40 },
      'country-hotlist_Leather': { likes: 2190, dislikes: 15 },
      'country-hotlist_Work Boots': { likes: 1845, dislikes: 20 },
      'australia-hitlist_Adore': { likes: 5214, dislikes: 85 },
      'pop-certified_vampire': { likes: 85400, dislikes: 1120 },
      'pop-certified_bad idea right?': { likes: 62140, dislikes: 890 }
    };
  });

  const [trackAdCounts, setTrackAdCounts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('ppl_track_ad_counts');
    if (saved) return JSON.parse(saved);
    return {
      'the-hit-list_Messy': 420,
      'the-hit-list_Be My Own Boyfriend': 310,
      'country-hotlist_The Painter': 125,
      'australia-hitlist_Adore': 285,
      'pop-certified_vampire': 1420
    };
  });

  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newTrackCommentText, setNewTrackCommentText] = useState('');
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Load user details to check for admin status
  useEffect(() => {
    const savedUser = localStorage.getItem('ppl_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed.isAdmin) {
        setUserIsAdmin(true);
      }
    }
  }, []);

  // Save state when changes occur
  useEffect(() => {
    localStorage.setItem('ppl_track_comments', JSON.stringify(trackComments));
  }, [trackComments]);

  useEffect(() => {
    localStorage.setItem('ppl_track_stats', JSON.stringify(trackStats));
  }, [trackStats]);

  useEffect(() => {
    localStorage.setItem('ppl_track_ad_counts', JSON.stringify(trackAdCounts));
  }, [trackAdCounts]);

  const currentTrack = currentPlaylist ? currentPlaylist.songs[currentTrackIndex] : null;

  // Increment Ad Count on track load
  useEffect(() => {
    if (currentTrack) {
      const trackKey = `${currentPlaylist?.id}_${currentTrack.title}`;
      setTrackAdCounts(prev => {
        const currentCount = prev[trackKey] || 0;
        return {
          ...prev,
          [trackKey]: currentCount + 1
        };
      });
    }
  }, [currentTrack, currentTrackIndex]);

  const handleAddTrackComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrackCommentText.trim() || !currentTrack) return;
    const trackKey = `${currentPlaylist?.id}_${currentTrack.title}`;
    
    // Get user info
    const savedUser = localStorage.getItem('ppl_user');
    const user = savedUser ? JSON.parse(savedUser) : { name: 'UtubeMediaUser', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };

    const newComment = {
      id: `tc_${Date.now()}`,
      userName: user.name,
      userAvatar: user.avatar,
      text: newTrackCommentText.trim(),
      timestamp: 'Just now'
    };

    setTrackComments(prev => ({
      ...prev,
      [trackKey]: [newComment, ...(prev[trackKey] || [])]
    }));

    setNewTrackCommentText('');
  };

  const handleDeleteTrackComment = (commentId: string) => {
    if (!currentTrack) return;
    const trackKey = `${currentPlaylist?.id}_${currentTrack.title}`;
    setTrackComments(prev => ({
      ...prev,
      [trackKey]: (prev[trackKey] || []).filter(c => c.id !== commentId)
    }));
  };

  const handleLikeTrack = () => {
    if (!currentTrack) return;
    const trackKey = `${currentPlaylist?.id}_${currentTrack.title}`;
    setTrackStats(prev => {
      const stats = prev[trackKey] || { likes: 100, dislikes: 5 };
      const liked = !stats.liked;
      return {
        ...prev,
        [trackKey]: {
          ...stats,
          liked,
          disliked: false,
          likes: stats.likes + (liked ? 1 : -1)
        }
      };
    });
  };

  const handleDislikeTrack = () => {
    if (!currentTrack) return;
    const trackKey = `${currentPlaylist?.id}_${currentTrack.title}`;
    setTrackStats(prev => {
      const stats = prev[trackKey] || { likes: 100, dislikes: 5 };
      const disliked = !stats.disliked;
      return {
        ...prev,
        [trackKey]: {
          ...stats,
          disliked,
          liked: false,
          dislikes: stats.dislikes + (disliked ? 1 : -1)
        }
      };
    });
  };

  // Playback timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Featured videos list (The thumbnails allow changing the active banner!)
  const featuredVideos: FeaturedVideo[] = [
    {
      id: 'glorilla-mane',
      title: 'GloRilla & Pooh Shiesty - MANE (Official Visual)',
      creator: 'theofficialGloRilla and Pooh Shiesty',
      views: '3.2M views',
      timeAgo: '8 days ago',
      bannerImg: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
      videoImg: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80'
    },
    {
      id: 'glorilla-yeahglo',
      title: 'GloRilla - Yeah Glo! (Official Music Video)',
      creator: 'theofficialGloRilla',
      views: '45M views',
      timeAgo: '4 months ago',
      bannerImg: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=1200&q=80',
      videoImg: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80'
    },
    {
      id: 'poohshiesty-back',
      title: 'Pooh Shiesty - Back In Blood (feat. Lil Durk)',
      creator: 'Pooh Shiesty',
      views: '320M views',
      timeAgo: '2 years ago',
      bannerImg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80',
      videoImg: 'https://images.unsplash.com/photo-1487180144351-b8472da7a4c3?w=400&q=80'
    },
    {
      id: 'glorilla-tgif',
      title: 'GloRilla - TGIF (Official Audio-Visual)',
      creator: 'theofficialGloRilla',
      views: '15M views',
      timeAgo: '2 weeks ago',
      bannerImg: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?w=1200&q=80',
      videoImg: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80'
    }
  ];

  const [activeFeaturedIdx, setActiveFeaturedIdx] = useState(0);
  const activeFeatured = featuredVideos[activeFeaturedIdx];

  // Playlists grid data
  const playlists: Playlist[] = [
    {
      id: 'the-hit-list',
      title: 'The Hit List',
      description: "Today's biggest hits and hottest tracks from across the US pop landscape.",
      artist: 'Olivia Dean',
      songCount: 54,
      badge: 'UNITED STATES',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      songs: [
        { title: 'Messy', artist: 'Olivia Dean', duration: '3:12', seconds: 192 },
        { title: 'Be My Own Boyfriend', artist: 'Olivia Dean', duration: '3:45', seconds: 225 },
        { title: 'Dive', artist: 'Olivia Dean', duration: '4:02', seconds: 242 },
        { title: 'The Hardest Part', artist: 'Olivia Dean', duration: '3:31', seconds: 211 }
      ]
    },
    {
      id: 'country-hotlist',
      title: 'Country Hotlist',
      description: 'Your one-stop shop for today\'s biggest country hits.',
      artist: 'Cody Johnson',
      songCount: 50,
      image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=600&q=80',
      songs: [
        { title: 'The Painter', artist: 'Cody Johnson', duration: '3:52', seconds: 232 },
        { title: 'Dirt Cheap', artist: 'Cody Johnson', duration: '3:28', seconds: 208 },
        { title: 'Leather', artist: 'Cody Johnson', duration: '3:15', seconds: 195 },
        { title: 'Work Boots', artist: 'Cody Johnson', duration: '2:50', seconds: 170 }
      ]
    },
    {
      id: 'australia-hitlist',
      title: 'Australia Hitlist',
      description: 'The biggest current bangers from Australia.',
      artist: 'Amy Shark',
      songCount: 57,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      songs: [
        { title: 'Adore', artist: 'Amy Shark', duration: '3:05', seconds: 185 },
        { title: 'I Said Hi', artist: 'Amy Shark', duration: '2:48', seconds: 168 },
        { title: 'Only Wanna Be With You', artist: 'Amy Shark', duration: '3:10', seconds: 190 },
        { title: 'Sway My Way', artist: 'Amy Shark & R3HAB', duration: '2:52', seconds: 172 }
      ]
    },
    {
      id: 'pop-certified',
      title: 'Pop Certified',
      description: 'The biggest and best pop songs in the USA right now.',
      artist: 'Olivia Rodrigo',
      songCount: 50,
      verticalBadge: 'POP CERTIFIED',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      songs: [
        { title: 'vampire', artist: 'Olivia Rodrigo', duration: '3:39', seconds: 219 },
        { title: 'bad idea right?', artist: 'Olivia Rodrigo', duration: '3:04', seconds: 184 },
        { title: 'get him back!', artist: 'Olivia Rodrigo', duration: '3:30', seconds: 210 },
        { title: 'deja vu', artist: 'Olivia Rodrigo', duration: '3:35', seconds: 215 }
      ]
    },
    {
      id: 'hiphop-hits',
      title: 'On Everything: Today\'s Hip-Hop Hits',
      description: 'The hottest hip-hop tracks out now... and that\'s on everything.',
      artist: 'Yung Miami',
      songCount: 153,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      songs: [
        { title: 'CFWM', artist: 'Yung Miami ft. GloRilla', duration: '3:21', seconds: 201 },
        { title: 'Mane', artist: 'GloRilla & Pooh Shiesty', duration: '2:55', seconds: 175 },
        { title: 'Yeah Glo!', artist: 'GloRilla', duration: '2:44', seconds: 164 },
        { title: 'Back In Blood', artist: 'Pooh Shiesty ft. Lil Durk', duration: '3:40', seconds: 220 }
      ]
    }
  ];

  // Web Audio Synth refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize AudioContext lazily
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Handle active music audio timer simulation & sound synthesis
  useEffect(() => {
    if (isPlaying && currentPlaylist) {
      const activeTrack = currentPlaylist.songs[currentTrackIndex];
      timerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= activeTrack.seconds) {
            // Move to next track or loop
            if (currentTrackIndex < currentPlaylist.songs.length - 1) {
              setCurrentTrackIndex((idx) => idx + 1);
              return 0;
            } else {
              setCurrentTrackIndex(0);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);

      // Start/Resume Web Audio Synthesis
      try {
        getAudioContext();
      } catch (err) {
        console.error("AudioContext initialization failed:", err);
      }

      let step = 0;
      
      // Select scales based on playlist ID
      let scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // Default C major pentatonic
      let type: OscillatorType = 'triangle';

      if (currentPlaylist.id === 'the-hit-list') {
        scale = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25]; // C Maj7 pentatonic
        type = 'triangle';
      } else if (currentPlaylist.id === 'country-hotlist') {
        scale = [196.00, 246.94, 293.66, 392.00, 440.00, 493.88]; // G major
        type = 'sine';
      } else if (currentPlaylist.id === 'australia-hitlist') {
        scale = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // A minor
        type = 'sine';
      } else if (currentPlaylist.id === 'pop-certified') {
        scale = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25]; // F major / C major
        type = 'triangle';
      } else if (currentPlaylist.id === 'hiphop-hits') {
        scale = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00]; // Low Deep minor pentatonic (bass-y)
        type = 'sawtooth';
      }

      // Synth interval loop
      synthIntervalRef.current = setInterval(() => {
        const ctx = audioCtxRef.current;
        if (!ctx || ctx.state === 'suspended') return;

        // Skip playing if muted or volume is 0
        const currentVolume = isMuted ? 0 : volume;
        if (currentVolume === 0) return;

        // Pick note from the scale sequentially or semi-randomly
        const noteFreq = scale[step % scale.length];
        step++;

        // Create oscillator and gain node for envelope
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        // Calculate dynamic volume scaling (max 0.12 for safety/pleasant listening)
        const volMultiplier = currentVolume / 100;
        const baseVolume = 0.06 * volMultiplier;

        // Linear envelope: Attack -> Decay -> Release
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(baseVolume, ctx.currentTime + 0.03);
        
        if (currentPlaylist.id === 'hiphop-hits') {
          // Hip-hop: Deep sub bass and an optional secondary high pluck note
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);

          // Add a short high hats click / tick occasionally
          if (step % 2 === 0) {
            const pluckOsc = ctx.createOscillator();
            const pluckGain = ctx.createGain();
            pluckOsc.type = 'sine';
            pluckOsc.frequency.setValueAtTime(noteFreq * 4, ctx.currentTime);
            pluckGain.gain.setValueAtTime(0, ctx.currentTime);
            pluckGain.gain.linearRampToValueAtTime(baseVolume * 0.3, ctx.currentTime + 0.01);
            pluckGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
            pluckOsc.connect(pluckGain);
            pluckGain.connect(ctx.destination);
            pluckOsc.start();
            pluckOsc.stop(ctx.currentTime + 0.15);
          }
        } else {
          // Acoustic, country, electronic: Standard pleasant pluck
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);

          // Add a minor harmony note occasionally (3rd or 5th) on main beats
          if (step % 4 === 0) {
            const harmOsc = ctx.createOscillator();
            const harmGain = ctx.createGain();
            harmOsc.type = 'sine';
            // Play perfect 5th (multiply freq by 1.5)
            harmOsc.frequency.setValueAtTime(noteFreq * 1.5, ctx.currentTime);
            harmGain.gain.setValueAtTime(0, ctx.currentTime);
            harmGain.gain.linearRampToValueAtTime(baseVolume * 0.4, ctx.currentTime + 0.04);
            harmGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            harmOsc.connect(harmGain);
            harmGain.connect(ctx.destination);
            harmOsc.start();
            harmOsc.stop(ctx.currentTime + 0.5);
          }
        }

      }, 400); // 400ms steps
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, [isPlaying, currentPlaylist, currentTrackIndex, volume, isMuted]);

  // Launch a playlist to play
  const startPlayingPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentTrackIndex(0);
    setPlaybackProgress(0);
    setIsPlaying(true);
  };

  // Skip tracks
  const handleNextTrack = () => {
    if (!currentPlaylist) return;
    if (currentTrackIndex < currentPlaylist.songs.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0);
    }
    setPlaybackProgress(0);
  };

  const handlePrevTrack = () => {
    if (!currentPlaylist) return;
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(currentPlaylist.songs.length - 1);
    }
    setPlaybackProgress(0);
  };

  // Convert seconds to mm:ss format
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Social feed posts actions
  const handleLikePost = (postId: string) => {
    if (likedPosts[postId]) {
      setPostsLikes(prev => ({ ...prev, [postId]: prev[postId] - 1 }));
      setLikedPosts(prev => ({ ...prev, [postId]: false }));
    } else {
      setPostsLikes(prev => ({ ...prev, [postId]: prev[postId] + 1 }));
      setLikedPosts(prev => ({ ...prev, [postId]: true }));
    }
  };

  const handleVotePoll = (option: string) => {
    if (hasVoted) return;
    setPollVotes(prev => ({ ...prev, [option]: prev[option] + 1 }));
    setHasVoted(true);
  };

  const totalPollVotes = pollVotes.option1 + pollVotes.option2 + pollVotes.option3;

  return (
    <div className="flex flex-col text-zinc-100 font-sans pb-16 bg-[#030303] min-h-screen" id="music-hub-container">
      
      {/* 1. TOP VIDEO BANNER */}
      <div 
        className="relative w-full h-[300px] md:h-[380px] bg-cover bg-center overflow-hidden transition-all duration-500 border-b border-zinc-900 shadow-2xl"
        style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.9) 100%), url(${activeFeatured.bannerImg})` }}
        id="music-video-banner"
      >
        {/* Banner Grid Content */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-between py-6">
          
          {/* Breadcrumb / Category Metadata */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold tracking-widest uppercase">FEATURED RELEASE</span>
            <span className="text-[10px] text-zinc-400 font-semibold font-mono">UTUBE MEDIA MUSIC</span>
          </div>

          {/* Center Info Panel & Preview List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mt-4">
            
            {/* Left Hand: Featured track text */}
            <div className="space-y-3 max-w-xl text-left">
              <span className="text-xs text-zinc-400 font-mono tracking-wide block">
                {activeFeatured.creator} &bull; {activeFeatured.views} &bull; {activeFeatured.timeAgo}
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight filter drop-shadow">
                {activeFeatured.title}
              </h1>

              {/* Mini action triggers */}
              <div className="flex items-center gap-3 pt-1">
                <button 
                  onClick={() => {
                    // Try to trigger playing a song related to this featured track
                    const glorillaPlaylist = playlists.find(p => p.id === 'hiphop-hits');
                    if (glorillaPlaylist) {
                      startPlayingPlaylist(glorillaPlaylist);
                    }
                  }}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-full flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-red-600/20"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Stream Video Single
                </button>
                <span className="text-zinc-600 text-xs">|</span>
                <span className="text-[10px] text-zinc-400 font-mono">Dolby Digital Stereo Logged</span>
              </div>
            </div>

            {/* Right Hand: 4 Tiny Visual Previews representing the carousel inside banner */}
            <div className="space-y-2 text-left">
              <span className="text-[10px] font-bold text-zinc-400 tracking-wider font-mono uppercase block">Recommended Releases</span>
              <div className="grid grid-cols-4 gap-2">
                {featuredVideos.map((video, idx) => (
                  <button
                    key={video.id}
                    onClick={() => setActiveFeaturedIdx(idx)}
                    className={`group relative aspect-video rounded overflow-hidden border-2 cursor-pointer transition-all ${
                      activeFeaturedIdx === idx 
                        ? 'border-red-500 scale-103 shadow-lg shadow-red-500/25' 
                        : 'border-zinc-800 hover:border-zinc-500'
                    }`}
                    title={video.title}
                  >
                    <img src={video.videoImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/85 text-[6px] font-bold px-1 rounded font-mono text-zinc-300">
                      LIVE
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. CHANNELS HEADER PANEL */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 shadow-xl" id="music-channel-panel">
          <div className="flex items-center gap-4 text-left">
            {/* Pink Music Circle Icon */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-pink-600 via-red-500 to-rose-400 flex items-center justify-center shadow-xl shadow-pink-600/10">
              <Music className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Music</h2>
                <span className="w-4.5 h-4.5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]" title="Official Verification">✓</span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">127M subscribers &bull; Certified Hub</p>
            </div>
          </div>

          {/* Subscriber Toggle Action Button */}
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 ${
              isSubscribed 
                ? 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 border border-zinc-800' 
                : 'bg-white hover:bg-zinc-100 text-black shadow-lg shadow-white/5'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* 3. SUB NAVIGATION SUB-TABS */}
        <div className="flex items-center gap-4 border-b border-zinc-900 mt-6" id="music-subnav-tabs">
          <button
            onClick={() => setActiveTab('home')}
            className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'home' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
              activeTab === 'posts' 
                ? 'border-red-500 text-white' 
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Posts
          </button>
        </div>

        {/* 4. ACTIVE VIEW SCREEN CORES */}
        {activeTab === 'home' ? (
          <div className="space-y-6 mt-8">
            {/* TODAY'S BIGGEST HITS SECTION */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white tracking-wider uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  Today's Biggest Hits
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">Stream catalog</span>
              </div>

              {/* Dynamic bento-like play grid matching image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5" id="todays-hits-grid">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id} 
                    className="bg-zinc-950/60 border border-zinc-900 rounded-3xl p-3 flex flex-col justify-between hover:border-zinc-800 transition-all group/card hover:shadow-lg hover:shadow-red-500/5 duration-300 relative overflow-hidden"
                  >
                    
                    {/* Top Section - Graphic Cover frame */}
                    <div className="aspect-square w-full rounded-2xl overflow-hidden relative bg-zinc-900 border border-zinc-850">
                      <img 
                        src={playlist.image} 
                        alt={playlist.title} 
                        className="w-full h-full object-cover group-hover/card:scale-104 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Dark overlay with interactive play trigger */}
                      <div className="absolute inset-0 bg-black/10 group-hover/card:bg-black/30 transition-all flex items-center justify-center">
                        <button
                          onClick={() => startPlayingPlaylist(playlist)}
                          className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover/card:opacity-100 transform scale-90 group-hover/card:scale-100 shadow-xl shadow-red-600/30 transition-all cursor-pointer hover:bg-red-500"
                          title={`Play ${playlist.title}`}
                        >
                          <Play className="w-5 h-5 fill-current translate-x-[1px]" />
                        </button>
                      </div>

                      {/* Top Right custom Badge */}
                      {playlist.badge && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-zinc-300 text-[8px] font-bold tracking-widest rounded-full border border-zinc-800 uppercase font-mono">
                          {playlist.badge}
                        </span>
                      )}

                      {/* Top Left default Play icon */}
                      <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-zinc-300 border border-zinc-800 backdrop-blur-sm">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-[0.5px]" />
                      </div>

                      {/* Vertical Stamp Badge (Specifically for "Pop Certified" matching image!) */}
                      {playlist.verticalBadge && (
                        <div className="absolute right-0 top-0 bottom-0 w-6 bg-red-600 flex items-center justify-center text-white font-mono text-[7px] font-black uppercase tracking-widest transform rotate-180" style={{ writingMode: 'vertical-lr' }}>
                          {playlist.verticalBadge}
                        </div>
                      )}

                      {/* Bottom Right Track Count */}
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-zinc-400 text-[9px] font-bold rounded-md border border-zinc-800 flex items-center gap-1 font-mono">
                        <span>♪</span> {playlist.songCount} songs
                      </span>
                    </div>

                    {/* Bottom Metadata Panel */}
                    <div className="pt-3 text-left space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 group-hover/card:text-red-400 transition-colors">
                          {playlist.title}
                        </h4>
                        <span className="text-[9px] font-mono text-zinc-600 font-semibold truncate flex-shrink-0">
                          {playlist.artist}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {playlist.description}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* ARTIST DEEP SELECTION SPOTLIGHT SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 mt-8" id="music-spotlight-bento">
              <div className="md:col-span-1 space-y-3 text-left">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-extrabold tracking-widest uppercase border border-amber-500/20">SPOTLIGHT</span>
                <h3 className="text-lg font-black text-white">Artist of the Week</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Discover Olivia Dean's mesmerizing vocal layers. Fresh off her latest US arena tour, she sits down inside Utube Media's Cinema studio to breakdown her songwriting craft.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => {
                      const list = playlists.find(p => p.id === 'the-hit-list');
                      if (list) startPlayingPlaylist(list);
                    }}
                    className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-200 font-semibold rounded-full border border-zinc-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Explore Olivia Dean <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="md:col-span-2 relative h-[180px] rounded-2xl overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&q=80" 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-[10px] text-zinc-400 font-mono">Live Broadcast Recording</span>
                  <h4 className="text-sm font-bold text-white">Olivia Dean - Live Acoustic Session (Utube Media Premium)</h4>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SOCIAL CHANNELS POSTS TAB */
          <div className="max-w-3xl mx-auto space-y-6 mt-8 text-left" id="music-posts-feed">
            
            {/* Social Post 1 */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-red-500 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Music Channel Admin</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">2 days ago &bull; PINNED POST</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Who's ready for the new track drop this Friday? We've teamed up with GloRilla & Pooh Shiesty for a certified anthem. Catch the exclusive visual stream only on Utube Media first!
                </p>
                
                {/* Visual image attachment */}
                <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-900 bg-zinc-900">
                  <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800" alt="" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Actions panel */}
              <div className="flex items-center gap-4 pt-2 border-t border-zinc-900 text-zinc-400 text-xs font-mono">
                <button 
                  onClick={() => handleLikePost('post1')}
                  className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${likedPosts['post1'] ? 'text-red-500 hover:text-red-400' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts['post1'] ? 'fill-current' : ''}`} /> 
                  <span>{postsLikes['post1']} likes</span>
                </button>
                <span className="text-zinc-800">|</span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> 
                  <span>142 comments</span>
                </span>
                <span className="text-zinc-800">|</span>
                <button 
                  onClick={() => alert('Post link copied to clipboard')}
                  className="flex items-center gap-1.5 cursor-pointer hover:text-white"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Social Post 2 - Interactive Vote Poll */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-red-500 flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Music Channel Admin</h4>
                  <p className="text-[9px] text-zinc-500 font-mono">5 days ago</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-zinc-200">What genre are you streaming the most this weekend?</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Poll closes in 2 days &bull; {totalPollVotes} votes total</p>
                </div>

                {/* Poll Options */}
                <div className="space-y-2.5">
                  {[
                    { key: 'option1', label: 'Pop & Electronic Hits', votes: pollVotes.option1 },
                    { key: 'option2', label: 'Hip-Hop & R&B Classics', votes: pollVotes.option2 },
                    { key: 'option3', label: 'Acoustic & Country Melodies', votes: pollVotes.option3 }
                  ].map((option) => {
                    const percent = totalPollVotes > 0 ? Math.round((option.votes / totalPollVotes) * 100) : 0;
                    return (
                      <div key={option.key} className="relative">
                        <button
                          onClick={() => handleVotePoll(option.key)}
                          disabled={hasVoted}
                          className="w-full relative text-left text-xs p-3.5 rounded-xl border border-zinc-900/80 bg-zinc-950 hover:bg-zinc-900 overflow-hidden cursor-pointer disabled:cursor-default transition-all flex justify-between items-center z-10"
                        >
                          <span className="font-semibold text-zinc-200 relative z-20">{option.label}</span>
                          <span className="font-mono text-zinc-400 relative z-20">
                            {hasVoted ? `${percent}%` : 'Vote'}
                          </span>
                        </button>
                        {/* Vote percentage bar overlay */}
                        {hasVoted && (
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-red-600/10 rounded-xl transition-all duration-500 z-0 border-l-2 border-red-500"
                            style={{ width: `${percent}%` }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Post footer */}
              <div className="flex items-center gap-4 pt-2 border-t border-zinc-900 text-zinc-400 text-xs font-mono">
                <button 
                  onClick={() => handleLikePost('post2')}
                  className={`flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors ${likedPosts['post2'] ? 'text-red-500 hover:text-red-400' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts['post2'] ? 'fill-current' : ''}`} /> 
                  <span>{postsLikes['post2']} likes</span>
                </button>
                <span className="text-zinc-800">|</span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> 
                  <span>82 comments</span>
                </span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 5. GORGEOUS FLOATING AUDIO MUSIC PLAYER */}
      {currentPlaylist && (
        <>
          <div 
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 border-t border-zinc-900 backdrop-blur-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-bottom duration-300"
            id="global-music-player-bar"
          >
            {/* Left Column: Track artwork & Details & Social Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 text-left md:w-1/3">
              <div className="flex items-center gap-3.5">
                <img src={currentPlaylist.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-zinc-800 flex-shrink-0" />
                <div className="overflow-hidden space-y-0.5">
                  <h4 className="text-xs font-black text-white truncate">{currentTrack?.title}</h4>
                  <p className="text-[10px] text-zinc-400 truncate">{currentTrack?.artist}</p>
                  <span className="text-[8px] bg-red-600/10 text-red-500 font-bold px-1.5 py-0.5 rounded border border-red-500/15 uppercase font-mono tracking-wider inline-block">
                    {currentPlaylist.title}
                  </span>
                </div>
                
                {/* Visualizer active equalizer animation overlay when playing */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-6 ml-1 flex-shrink-0">
                    <div className="w-0.5 bg-red-600 animate-pulse h-3"></div>
                    <div className="w-0.5 bg-red-500 animate-pulse h-5" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-0.5 bg-red-600 animate-pulse h-2" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-0.5 bg-pink-500 animate-pulse h-4" style={{ animationDelay: '450ms' }}></div>
                  </div>
                )}
              </div>

              {/* Likes, Dislikes and Comments Drawer Toggle */}
              {currentTrack && (
                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-zinc-900 pt-1 sm:pt-0 sm:pl-3.5">
                  <button
                    onClick={handleLikeTrack}
                    className={`flex items-center gap-1 text-[10px] cursor-pointer transition-colors py-1 px-1.5 rounded-lg hover:bg-zinc-900 ${trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.liked ? 'text-red-500 font-bold bg-red-500/5' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Like Track"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-mono">{((trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.likes || 1200) + (trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.liked ? 1 : 0)).toLocaleString()}</span>
                  </button>

                  <button
                    onClick={handleDislikeTrack}
                    className={`flex items-center gap-1 text-[10px] cursor-pointer transition-colors py-1 px-1.5 rounded-lg hover:bg-zinc-900 ${trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.disliked ? 'text-zinc-300 font-bold bg-zinc-900' : 'text-zinc-500 hover:text-zinc-400'}`}
                    title="Dislike Track"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span className="font-mono">{((trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.dislikes || 25) + (trackStats[`${currentPlaylist?.id}_${currentTrack?.title}`]?.disliked ? 1 : 0)).toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
                    className={`flex items-center gap-1 text-[10px] cursor-pointer transition-colors py-1 px-1.5 rounded-lg hover:bg-zinc-900 ${showCommentsDrawer ? 'text-white font-bold bg-zinc-850' : 'text-zinc-500 hover:text-zinc-300'}`}
                    title="Toggle Comments Drawer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="font-mono">{(trackComments[`${currentPlaylist?.id}_${currentTrack?.title}`] || []).length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Center Column: Interactive Playback slider & Play toggles */}
            <div className="flex-1 max-w-xl flex flex-col items-center gap-2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrevTrack}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Previous Song"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
                  </svg>
                </button>
                
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-zinc-100 text-black flex items-center justify-center shadow cursor-pointer transition-all hover:scale-103"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5 fill-current text-black" /> : <Play className="w-4.5 h-4.5 fill-current text-black translate-x-[0.5px]" />}
                </button>

                <button 
                  onClick={handleNextTrack}
                  className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Next Song"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="m6 18 8.5-6L6 6zm9-12h2v12h-2z"/>
                  </svg>
                </button>
              </div>

              {/* Slider track progress bar with manual slider indicator */}
              <div className="w-full flex items-center gap-3">
                <span className="text-[9px] font-mono text-zinc-500 w-8 text-right">
                  {formatTime(playbackProgress)}
                </span>
                <div className="flex-1 relative group h-4 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max={currentTrack?.seconds || 100}
                    value={playbackProgress}
                    onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                    className="absolute inset-0 w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-red-600 group-hover:h-1.5 transition-all"
                    style={{
                      background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((playbackProgress / (currentTrack?.seconds || 1)) * 100).toFixed(1)}%, #27272a ${((playbackProgress / (currentTrack?.seconds || 1)) * 100).toFixed(1)}%, #27272a 100%)`
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono text-zinc-500 w-8 text-left">
                  {currentTrack?.duration}
                </span>
              </div>
            </div>

            {/* Right Column: Audio Output controls & volume & Ad Plays count */}
            <div className="hidden md:flex items-center justify-end gap-3 md:w-1/3">
              {currentTrack && (
                <div className="flex items-center gap-1.5 bg-red-600/15 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-[9px] font-mono uppercase font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  <span>Ad plays: {trackAdCounts[`${currentPlaylist?.id}_${currentTrack?.title}`] || 0}</span>
                </div>
              )}

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input 
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-20 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-200"
                style={{
                  background: `linear-gradient(to right, #e4e4e7 0%, #e4e4e7 ${isMuted ? 0 : volume}%, #27272a ${isMuted ? 0 : volume}%, #27272a 100%)`
                }}
              />
              <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">{isMuted ? 0 : volume}%</span>

              {/* Close Global Player Button */}
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentPlaylist(null);
                }}
                className="p-1.5 ml-2 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-lg cursor-pointer transition-colors"
                title="Close Player"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Sliding Comments Panel for currently playing music */}
          {showCommentsDrawer && currentTrack && (
            <div className="fixed right-4 bottom-24 z-50 w-80 max-w-sm h-[400px] bg-[#0c0c0f]/95 border border-zinc-900 rounded-3xl p-4 shadow-2xl flex flex-col backdrop-blur-md animate-in slide-in-from-right duration-200" id="music-comments-drawer">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                <div className="text-left">
                  <h4 className="text-xs font-black text-white">Track Comments</h4>
                  <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{currentTrack.title}</p>
                </div>
                <button 
                  onClick={() => setShowCommentsDrawer(false)}
                  className="p-1 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Comments scroll feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left scrollbar-none">
                {(trackComments[`${currentPlaylist?.id}_${currentTrack.title}`] || []).length === 0 ? (
                  <p className="text-[11px] text-zinc-500 italic text-center py-8">No comments on this track. Be the first!</p>
                ) : (
                  (trackComments[`${currentPlaylist?.id}_${currentTrack.title}`] || []).map((comment) => (
                    <div key={comment.id} className="bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-2.5 space-y-1 relative group">
                      <div className="flex items-center gap-2">
                        <img src={comment.userAvatar} alt="" className="w-5 h-5 rounded-full object-cover border border-zinc-800" />
                        <span className="text-[10px] font-bold text-zinc-300">@{comment.userName.replace(/\s+/g, '')}</span>
                        <span className="text-[8px] text-zinc-600 font-mono ml-auto">{comment.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-normal pl-7">{comment.text}</p>
                      
                      {/* Delete button for Admin / Moderator or if comment belongs to user */}
                      <button
                        onClick={() => handleDeleteTrackComment(comment.id)}
                        className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded cursor-pointer"
                        title="Delete Comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Post comment input */}
              <form onSubmit={handleAddTrackComment} className="mt-3 pt-2.5 border-t border-zinc-900 flex gap-1.5">
                <input
                  type="text"
                  placeholder="Add to the stream..."
                  value={newTrackCommentText}
                  onChange={(e) => setNewTrackCommentText(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-900 text-[11px] px-3 py-1.5 rounded-xl text-zinc-300 outline-none focus:border-red-600/30 font-sans"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </>
      )}

    </div>
  );
}
