import React, { useEffect, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Volume2, VolumeX, ChevronUp, ChevronDown, Check, Send, Plus, Disc } from 'lucide-react';
import { Video, Comment, getColorGradeClass } from '../types';
import CommentsSection from './CommentsSection';

interface ShortsPlayerProps {
  shorts: Video[];
  activeIdx: number;
  onIndexChange: (idx: number) => void;
  comments: Comment[];
  onAddComment: (videoId: string, text: string) => void;
  onLike: (videoId: string) => void;
  onDislike: (videoId: string) => void;
  onSubscribe: (creatorId: string) => void;
  onShare: (videoId: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onDislikeComment: (commentId: string) => void;
  onHeartComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  currentUser: { name: string; avatar: string };
}

export default function ShortsPlayer({
  shorts,
  activeIdx,
  onIndexChange,
  comments,
  onAddComment,
  onLike,
  onDislike,
  onSubscribe,
  onShare,
  onAddReply,
  onLikeComment,
  onDislikeComment,
  onHeartComment,
  onLikeReply,
  currentUser
}: ShortsPlayerProps) {
  const video = shorts[activeIdx];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newComment, setNewComment] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isRealVideo = video.url.startsWith('blob:') || video.url.startsWith('data:video/') || video.url.includes('.mp4') || video.url.includes('.webm') || video.url.includes('.mov');

  useEffect(() => {
    setIsPlaying(true);
  }, [activeIdx]);

  // Sync real video playback state
  useEffect(() => {
    if (isRealVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isRealVideo, video.url]);

  // Sync real video settings
  useEffect(() => {
    if (isRealVideo && videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, isRealVideo]);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  // Handle keypresses, wheel and swipes
  const handlePrev = () => {
    if (activeIdx > 0) onIndexChange(activeIdx - 1);
  };

  const handleNext = () => {
    if (activeIdx < shorts.length - 1) onIndexChange(activeIdx + 1);
  };

  // Wheel scroll with passive: false to prevent browser bouncing / page scrolling
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      // If user is inside the comments drawer, don't intercept wheel events so they can scroll comments
      if (showCommentsDrawer) return;

      e.preventDefault();

      const now = Date.now();
      if (now - lastScrollTime.current < 750) return; // 750ms cooldown for smooth, steady scrolling

      if (e.deltaY > 10) {
        handleNext();
        lastScrollTime.current = now;
      } else if (e.deltaY < -10) {
        handlePrev();
        lastScrollTime.current = now;
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheelNative);
    };
  }, [activeIdx, showCommentsDrawer, shorts.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const diffY = touchStartY.current - touchEndY;
    const diffX = touchStartX.current - touchEndX;
    const duration = Date.now() - touchStartTime.current;

    // Swipe threshold of 45px
    if (Math.abs(diffY) > 45) {
      if (diffY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    } else if (Math.abs(diffY) < 15 && Math.abs(diffX) < 15 && duration < 350) {
      // It's a clean TAP/HIT on the screen!
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('#shorts-action-rail');
      if (!isInteractive) {
        e.preventDefault(); // Prevent synthesized mouse click
        handleNext();
      }
    }
    touchStartY.current = null;
    touchStartX.current = null;
  };

  const handleViewportClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('#shorts-action-rail')) {
      return;
    }
    // Mobile/tablet tapping scrolls to next, desktop toggles play/pause
    if (window.innerWidth < 1024) {
      handleNext();
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  // Animate canvas short looping visualizer
  useEffect(() => {
    if (isRealVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    // particle setup
    const particles: { x: number; y: number; speed: number; size: number; color: string; drift: number }[] = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 0.9 + 0.3,
        size: Math.random() * 3 + 1,
        color: video.url === 'heavenly_particle' ? 'rgba(255, 255, 255, 0.45)' : 'rgba(239, 68, 68, 0.3)',
        drift: Math.random() * 0.4 - 0.2
      });
    }

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = canvas.parentElement?.clientHeight || 640;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (video.url === 'heavenly_particle') {
        bgGrad.addColorStop(0, '#020617'); // dark sky slate
        bgGrad.addColorStop(0.5, '#1e293b');
        bgGrad.addColorStop(1, '#475569');
      } else if (video.url === 'rescue_crane') {
        bgGrad.addColorStop(0, '#090500'); // fiery warm dark
        bgGrad.addColorStop(0.5, '#180e03');
        bgGrad.addColorStop(1, '#2d1a08');
      } else if (video.url === 'giant_eagle') {
        bgGrad.addColorStop(0, '#022c22'); // deep jungle green
        bgGrad.addColorStop(1, '#050b14');
      } else {
        bgGrad.addColorStop(0, '#09090b'); // black zinc
        bgGrad.addColorStop(1, '#1c1917');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Render custom atmospheric visual patterns based on short title
      if (video.url === 'heavenly_particle') {
        // --- GOT GOD moving light clouds ---
        ctx.save();
        ctx.translate(w / 2, h / 2.2);
        const segments = 12;
        for (let i = 0; i < segments; i++) {
          const angle = (i * Math.PI * 2) / segments + (isPlaying ? frame * 0.001 : 0);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle - 0.1) * h, Math.sin(angle - 0.1) * h);
          ctx.lineTo(Math.cos(angle + 0.1) * h, Math.sin(angle + 0.1) * h);
          ctx.closePath();
          const lightGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, h / 1.5);
          lightGlow.addColorStop(0, 'rgba(254, 240, 138, 0.14)');
          lightGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
          ctx.fillStyle = lightGlow;
          ctx.fill();
        }
        ctx.restore();

        // draw GOD GOD glowing display text
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '900 42px sans-serif';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fef08a';
        ctx.fillText("GOT", w / 2, h / 2 - 25);
        ctx.fillText("GOD", w / 2, h / 2 + 25);
        ctx.shadowBlur = 0;

      } else if (video.url === 'rescue_crane') {
        // --- Red/Yellow industrial hazard pattern ---
        ctx.save();
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.lineWidth = 12;
        for (let y = -200; y < h + 200; y += 40) {
          ctx.beginPath();
          ctx.moveTo(-100, y);
          ctx.lineTo(w + 100, y + (isPlaying ? 150 + Math.sin(frame * 0.01) * 20 : 150));
          ctx.stroke();
        }
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 22px monospace';
        ctx.fillText("RESCUE ACTIVE", w / 2, h / 2 - 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.fillText("Stabilizing Crane Support", w / 2, h / 2 + 15);

      } else if (video.url === 'giant_eagle') {
        // --- Forest visualizer ---
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(frame * 0.002);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) {
          ctx.strokeRect(-60 - i * 15, -60 - i * 15, 120 + i * 30, 120 + i * 30);
        }
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#34d399';
        ctx.font = '900 24px sans-serif';
        ctx.fillText("APEX EAGLE", w / 2, h / 2 - 10);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '12px sans-serif';
        ctx.fillText("Interactive sanctuary logs", w / 2, h / 2 + 15);
      } else {
        // --- Default abstract dynamic loop ---
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText(video.title, w / 2, h / 2);
      }

      // Draw standard particles rising
      particles.forEach((p) => {
        if (isPlaying) {
          p.y -= p.speed;
          p.x += p.drift;
          if (p.y < 0) {
            p.y = h;
            p.x = Math.random() * w;
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Play/Pause indicator overlay when paused
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(w / 2 - 6, h / 2 - 10);
        ctx.lineTo(w / 2 + 10, h / 2);
        ctx.lineTo(w / 2 - 6, h / 2 + 10);
        ctx.closePath();
        ctx.fillStyle = '#000000';
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [video, isPlaying]);

  const currentShortComments = comments.filter(c => c.videoId === video.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(video.id, newComment.trim());
    setNewComment('');
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 bg-zinc-950 p-4 sm:p-6 rounded-3xl border border-zinc-900 shadow-2xl min-h-[calc(100vh-120px)] lg:h-[calc(100vh-90px)] relative" id="shorts-hub-container">
      
      {/* Scroll Chevrons Navigation (Matching the right vertical round buttons in the screenshot!) */}
      <div className="absolute right-4 md:right-8 flex flex-col gap-4 z-10">
        <button
          onClick={handlePrev}
          disabled={activeIdx === 0}
          className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-40 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg"
          title="Scroll up"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeIdx === shorts.length - 1}
          className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 disabled:opacity-40 rounded-full text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg"
          title="Scroll down"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Shorts Container: Renders 9:16 portrait viewport */}
      <div 
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative h-[min(74vh,800px)] max-h-full aspect-[9/16] w-auto max-w-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-850 flex-shrink-0 animate-in fade-in zoom-in-95 duration-200 select-none touch-pan-y"
      >
        {/* Mobile/Tablet Touch-to-Scroll Hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none lg:hidden animate-pulse">
          <div className="bg-black/60 backdrop-blur-md border border-zinc-800/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            <span className="text-[9px] font-mono font-bold text-zinc-350 uppercase tracking-wider">Tap screen to skip</span>
          </div>
        </div>
        {isRealVideo ? (
          <video
            ref={videoRef}
            src={video.url}
            onClick={handleViewportClick}
            loop
            className={`w-full h-full block cursor-pointer object-cover bg-black animate-in fade-in duration-300 ${getColorGradeClass(video.colorGrade)}`}
          />
        ) : (
          <canvas
            ref={canvasRef}
            onClick={handleViewportClick}
            className={`w-full h-full block cursor-pointer ${getColorGradeClass(video.colorGrade)}`}
          />
        )}

        {/* Floating Sidebar Quick Action Rail (Like, Dislike, Comments drawer, Share, Audio) */}
        <div className="absolute right-3.5 bottom-16 flex flex-col items-center gap-5 z-20 text-white" id="shorts-action-rail">
          {/* Creator Profile Shortcut */}
          <div className="relative group">
            <img
              src={video.creator.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-white/80"
              referrerPolicy="no-referrer"
            />
            {!video.creator.isSubscribed && (
              <button
                onClick={() => onSubscribe(video.creator.id)}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gold-500 hover:bg-gold-600 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold border border-[#0a0a0c] cursor-pointer text-black"
                title="Subscribe"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            )}
          </div>

          {/* Like */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onLike(video.id)}
              className={`p-3 rounded-full shadow-md cursor-pointer transition-all ${video.isLiked ? 'bg-gold-500 text-black scale-110' : 'bg-black/60 hover:bg-black/80 text-zinc-300'}`}
            >
              <ThumbsUp className="w-4.5 h-4.5 fill-current" />
            </button>
            <span className="text-[10px] font-mono font-bold mt-1 text-zinc-300">{video.likes + (video.isLiked ? 1 : 0)}</span>
          </div>

          {/* Dislike */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onDislike(video.id)}
              className={`p-3 rounded-full shadow-md cursor-pointer transition-all ${video.isDisliked ? 'bg-zinc-700 text-gold-400' : 'bg-black/60 hover:bg-black/80 text-zinc-300'}`}
            >
              <ThumbsDown className="w-4.5 h-4.5 fill-current" />
            </button>
            <span className="text-[10px] font-mono font-bold mt-1 text-zinc-300">Dislike</span>
          </div>

          {/* Comments Trigger */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowCommentsDrawer(true)}
              className="p-3 bg-black/60 hover:bg-black/80 text-zinc-300 rounded-full shadow-md cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4.5 h-4.5 fill-current" />
            </button>
            <span className="text-[10px] font-mono font-bold mt-1 text-zinc-300">{currentShortComments.length}</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => onShare(video.id)}
              className="p-3 bg-black/60 hover:bg-black/80 text-zinc-300 rounded-full shadow-md cursor-pointer transition-colors"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <span className="text-[10px] font-mono font-bold mt-1 text-zinc-300">Share</span>
          </div>

          {/* Mute */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 bg-black/60 hover:bg-black/80 text-zinc-300 rounded-full shadow-md cursor-pointer transition-colors"
          >
            {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Overlay Bottom Description & Music Marquee Panel */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-left space-y-2 z-10 pointer-events-auto">
          {/* Channel metadata */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">@{video.creator.name.replace(/\s+/g, '').toLowerCase()}</span>
            <button
              onClick={() => onSubscribe(video.creator.id)}
              className={`px-3 py-1 rounded-full text-[9px] font-semibold tracking-wide transition-colors ${
                video.creator.isSubscribed 
                  ? 'bg-zinc-800 text-zinc-400' 
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {video.creator.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          {/* Title description */}
          <p className="text-[11px] text-zinc-200 leading-normal line-clamp-2">
            {video.description}
          </p>

          {/* Music track sliding marquee! Extremely high-fidelity */}
          <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] bg-black/30 px-2.5 py-1 rounded-full w-fit overflow-hidden max-w-[180px]">
            <Disc className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
            <div className="whitespace-nowrap overflow-hidden relative w-32">
              <span className="inline-block animate-marquee font-mono">
                Original Audio - @{video.creator.name.replace(/\s+/g, '').toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Drawer or Right Column Comments list on desktop (Improves usability immensely!) */}
      {showCommentsDrawer && (
        <div className="w-full lg:w-[380px] bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col h-full max-h-[500px] lg:max-h-full animate-in slide-in-from-right duration-200 z-30 relative" id="shorts-comments-drawer">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest">
              Comments Studio
            </span>
            <button
              onClick={() => setShowCommentsDrawer(false)}
              className="p-1 text-zinc-500 hover:text-white rounded cursor-pointer transition-colors"
              title="Close comments"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Comments list with advanced interactive controls (like, dislike, heart, and reply) */}
          <div className="flex-1 overflow-y-auto pr-1">
            <CommentsSection
              comments={currentShortComments}
              onAddComment={(text) => onAddComment(video.id, text)}
              onAddReply={onAddReply}
              onLikeComment={onLikeComment}
              onDislikeComment={onDislikeComment}
              onHeartComment={onHeartComment}
              onLikeReply={onLikeReply}
              currentUser={currentUser}
              creatorId={video.creator.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
