import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Share2, Download, ListPlus, Flame, Heart, Store, ExternalLink, X, ChevronRight, Check } from 'lucide-react';
import { Video, StoreProduct, Playlist, AdCampaign, UserWallet } from '../types';

interface VideoPlayerProps {
  video: Video;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, videoId: string) => void;
  onCreatePlaylist: (name: string, videoId: string) => void;
  activeAd: AdCampaign | null;
  onAdClicked: (adId: string) => void;
  onAdClosed: () => void;
  onBuyProduct: (product: StoreProduct) => void;
  wallet: UserWallet;
  onLike: (videoId: string) => void;
  onDislike: (videoId: string) => void;
  onSubscribe: (creatorId: string) => void;
}

export default function VideoPlayer({
  video,
  playlists,
  onAddToPlaylist,
  onCreatePlaylist,
  activeAd,
  onAdClicked,
  onAdClosed,
  onBuyProduct,
  wallet,
  onLike,
  onDislike,
  onSubscribe
}: VideoPlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheater, setIsTheater] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(0);

  // Parse duration ("28:05" -> 1685 seconds)
  useEffect(() => {
    if (video) {
      const parts = video.duration.split(':').map(Number);
      let sec = 0;
      if (parts.length === 3) {
        sec = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        sec = parts[0] * 60 + parts[1];
      }
      setDurationSec(sec);
      setCurrentTime(0);
      setIsPlaying(true);
      setShowAd(false);
    }
  }, [video]);

  // Handle simulated progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSec) {
            setIsPlaying(false);
            return durationSec;
          }
          const next = prev + playbackSpeed;
          // Randomly show an ad if ad is enabled for video
          if (video.adEnabled && activeAd && Math.random() < 0.05 && next > 10 && !showAd) {
            setShowAd(true);
            setAdTimer(10); // 10s skip timer
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, durationSec, playbackSpeed, video, activeAd, showAd]);

  // Countdown for ad close timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  // Dynamic canvas graphic animator! Looks completely alive
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;

    // Generate particle positions
    const particles: { x: number; y: number; size: number; speed: number; color: string; angle?: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 0.8 + 0.2,
        color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 80 + 100}, ${Math.random() * 50 + 50}, 0.6)`,
        angle: Math.random() * Math.PI * 2
      });
    }

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight || (container.clientWidth * 9) / 16;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Clear with dark atmospheric background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, w, h);

      // Draw specialized visuals depending on video identity
      if (video.url === 'cloud_wisdom' || video.url === 'divine_message') {
        // --- Spiritual cloud rendering ---
        const gradient = ctx.createLinearGradient(0, h, 0, 0);
        gradient.addColorStop(0, '#09090b');
        gradient.addColorStop(0.5, '#1e1b4b'); // deep purple
        gradient.addColorStop(1, '#311042'); // deep violet/gold glow
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Drawing glowing radial sun rays
        ctx.save();
        ctx.translate(w / 2, h / 3);
        const rayCount = 18;
        const maxRayLen = Math.max(w, h);
        for (let i = 0; i < rayCount; i++) {
          const angle = (i * Math.PI * 2) / rayCount + (isPlaying ? frame * 0.001 : 0);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(angle - 0.08) * maxRayLen, Math.sin(angle - 0.08) * maxRayLen);
          ctx.lineTo(Math.cos(angle + 0.08) * maxRayLen, Math.sin(angle + 0.08) * maxRayLen);
          ctx.closePath();
          const rayGlow = ctx.createRadialGradient(0, 0, 50, 0, 0, w / 1.5);
          rayGlow.addColorStop(0, 'rgba(234, 179, 8, 0.15)');
          rayGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = rayGlow;
          ctx.fill();
        }
        ctx.restore();

        // Animate floating celestial orbs
        particles.forEach((p) => {
          if (isPlaying) {
            p.y -= p.speed * 0.6;
            if (p.y < 0) p.y = h;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(253, 224, 71, 0.4)'; // gold stars
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#eab308';
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Overlay text in center
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("GOT GOD • ACTIVE STREAM", w / 2, h / 2);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#fef08a';
        ctx.fillText("Tuned Celestial Audio Visualizer", w / 2, h / 2 + 30);

      } else if (video.url === 'neon_streets') {
        // --- Neon Urban Street Bokeh rendering ---
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#09090b');
        gradient.addColorStop(1, '#020617');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // draw neon bokeh spots
        particles.forEach((p, idx) => {
          if (isPlaying) {
            p.x += Math.sin(frame * 0.005 + idx) * 0.2;
            p.y += p.speed * 0.3;
            if (p.y > h) p.y = 0;
          }
          // neon glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(236, 72, 153, 0.15)' : 'rgba(6, 182, 212, 0.15)'; // pink & cyan
          ctx.shadowBlur = 15;
          ctx.shadowColor = idx % 2 === 0 ? '#ec4899' : '#06b6d4';
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // draw reflection gridlines
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < w; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, h);
          ctx.lineTo(w / 2 + (i - w / 2) * 0.1, h / 2);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("WELLINGTON CENTRAL • CANDID", w / 2, h / 2);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#67e8f9';
        ctx.fillText("Live Neon Dispersion Lens Simulator", w / 2, h / 2 + 30);

      } else if (video.url === 'military_tech') {
        // --- Engineering blueprint/radar ---
        ctx.fillStyle = '#022c22'; // deep military green
        ctx.fillRect(0, 0, w, h);

        // draw radar sweeps
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = 1.5;
        // background circular target grid
        for (let r = 50; r < w; r += 80) {
          ctx.beginPath();
          ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // scanning sweep line
        const sweepAngle = (frame * 0.015) % (Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.lineTo(w / 2 + Math.cos(sweepAngle) * w, h / 2 + Math.sin(sweepAngle) * w);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("MACHINE GUN METRIC OVERVIEW", w / 2, h / 2);
        ctx.font = '13px monospace';
        ctx.fillStyle = '#10b981';
        ctx.fillText("Active Sweeping Target Grid Enabled", w / 2, h / 2 + 30);

      } else {
        // --- Generic clean ambient theme ---
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.2);
        gradient.addColorStop(0, '#111827');
        gradient.addColorStop(1, '#030712');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(video.title, w / 2, h / 2);
        ctx.font = '12px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText("Click Play to stream visual stream", w / 2, h / 2 + 30);
      }

      // If paused, overlay a big gold play icon or dark veil
      if (!isPlaying) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, w, h);

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(197, 160, 89, 0.95)'; // Gold play circle
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#c5a059';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(w / 2 - 10, h / 2 - 15);
        ctx.lineTo(w / 2 + 15, h / 2);
        ctx.lineTo(w / 2 - 10, h / 2 + 15);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [video, isPlaying]);

  // Format second integer into human timing "03:45"
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    setCurrentTime(Math.floor(percentage * durationSec));
  };

  // Simulated download feature
  const handleDownload = () => {
    const videoMetadata = {
      id: video.id,
      title: video.title,
      creator: video.creator.name,
      description: video.description,
      duration: video.duration,
      download_timestamp: new Date().toISOString(),
      disclaimer: "Offline license generated by PushPlay Live Blockchain. Protected content.",
      licenseKey: `PPL-LIC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(videoMetadata, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${video.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_offline.ppl`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/watch?v=${video.id}`;
    navigator.clipboard.writeText(link);
    alert('Share link copied to clipboard: ' + link);
    setShowShareModal(false);
  };

  return (
    <div className="space-y-4" id="video-player-container">
      {/* Video Canvas Sandbox with absolute layers */}
      <div className={`relative bg-black rounded-2xl overflow-hidden group/player select-none shadow-2xl border border-zinc-900 transition-all duration-300 ${isTheater ? 'aspect-[21/9] max-h-[500px]' : 'aspect-video'}`}>
        <canvas 
          ref={canvasRef} 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full h-full block cursor-pointer"
        />

        {/* Ad Campaign Pop-up Overlay */}
        {showAd && activeAd && (
          <div className="absolute bottom-16 left-4 right-4 md:left-8 md:right-8 bg-zinc-950/95 border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between shadow-2xl animate-bounce" id="ad-banner-overlay">
            <div className="flex items-center gap-3.5 overflow-hidden">
              <img 
                src={activeAd.mediaUrl} 
                alt="" 
                className="w-16 h-10 object-cover rounded border border-zinc-800 flex-shrink-0" 
              />
              <div className="overflow-hidden">
                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 text-[9px] font-bold tracking-widest uppercase border border-amber-500/10 mb-1">Sponsored Ad</span>
                <h4 className="text-xs font-semibold text-zinc-100 truncate">{activeAd.title}</h4>
                <p className="text-[10px] text-zinc-400 truncate">By {activeAd.advertiserName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdClicked(activeAd.id)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-[10px] font-bold tracking-wide flex items-center gap-1 transition-colors cursor-pointer"
              >
                Visit Now <ExternalLink className="w-3 h-3" />
              </button>
              <button
                disabled={adTimer > 0}
                onClick={() => {
                  setShowAd(false);
                  onAdClosed();
                }}
                className={`p-1.5 rounded-lg border border-zinc-850 text-zinc-400 transition-colors ${adTimer > 0 ? 'opacity-50 cursor-not-allowed bg-zinc-900 text-[9px]' : 'hover:bg-zinc-850 hover:text-white cursor-pointer'}`}
              >
                {adTimer > 0 ? `Skip in ${adTimer}s` : <X className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Controls Overlay Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-200 flex flex-col gap-2">
          {/* Progress Bar */}
          <div 
            onClick={handleProgressBarClick}
            className="w-full h-1 bg-zinc-800 rounded-full cursor-pointer relative hover:h-2 transition-all group/progress"
          >
            <div 
              style={{ width: `${(currentTime / durationSec) * 100}%` }}
              className="absolute left-0 top-0 h-full bg-gold-500 rounded-full flex items-center justify-end"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white scale-0 group-hover/progress:scale-100 transition-transform shadow-lg"></span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-gold-400 transition-colors p-1 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current text-gold-500" /> : <Play className="w-4 h-4 fill-current text-gold-500" />}
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:text-zinc-300 transition-colors p-1 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setIsMuted(false);
                }}
                className="w-16 accent-gold-500 cursor-pointer hidden sm:block"
              />

              <span className="text-[11px] font-mono text-zinc-300">
                {formatTime(currentTime)} / {formatTime(durationSec)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed dropdown */}
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded text-[10px] px-1.5 py-0.5 font-mono cursor-pointer outline-none"
              >
                <option value="0.5">0.5x Speed</option>
                <option value="1">Normal (1x)</option>
                <option value="1.5">1.5x Speed</option>
                <option value="2">2x Speed</option>
              </select>

              <button 
                onClick={() => setIsTheater(!isTheater)}
                className="text-white hover:text-zinc-300 transition-colors p-1 text-[10px] font-mono cursor-pointer hidden md:block"
              >
                [Theater Mode]
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Details Information */}
      <div className="space-y-3.5">
        <h1 className="text-lg md:text-xl font-bold font-sans text-zinc-50 leading-tight">
          {video.title}
        </h1>

        {/* Action Controls & Creator Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
          {/* Creator card */}
          <div className="flex items-center gap-3">
            <img 
              src={video.creator.avatar} 
              alt={video.creator.name} 
              className="w-10 h-10 rounded-full object-cover border border-zinc-800" 
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <h3 className="text-xs font-semibold text-zinc-100 flex items-center gap-1">
                {video.creator.name}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Online now"></span>
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">{(video.creator.subscribers).toLocaleString()} subscribers</p>
            </div>
            <button
              onClick={() => onSubscribe(video.creator.id)}
              className={`ml-3.5 px-4 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                video.creator.isSubscribed
                  ? 'bg-zinc-850 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  : 'bg-gold-500 hover:bg-gold-600 text-black font-semibold shadow-sm shadow-gold-500/10'
              }`}
            >
              {video.creator.isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>

          {/* Social and wallet actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Likes/Dislikes */}
            <div className="flex items-center bg-zinc-900/80 rounded-full overflow-hidden p-0.5 border border-zinc-800/80">
              <button
                onClick={() => onLike(video.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${video.isLiked ? 'bg-gold-500/10 text-gold-400 border border-gold-500/15' : 'text-zinc-300 hover:bg-zinc-800'}`}
              >
                👍 <span className="font-mono">{video.likes + (video.isLiked ? 1 : 0)}</span>
              </button>
              <div className="w-px h-4 bg-zinc-800"></div>
              <button
                onClick={() => onDislike(video.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${video.isDisliked ? 'bg-zinc-850 text-gold-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
              >
                👎
              </button>
            </div>

            {/* Save to Playlist Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors cursor-pointer border border-zinc-750"
              >
                <ListPlus className="w-3.5 h-3.5" /> Save
              </button>
              {showPlaylistMenu && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl p-3 shadow-2xl z-20 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-850 pb-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Save to Playlist</span>
                    <button onClick={() => setShowPlaylistMenu(false)} className="text-zinc-500 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {playlists.map((playlist) => {
                      const isIncluded = playlist.videoIds.includes(video.id);
                      return (
                        <button
                          key={playlist.id}
                          onClick={() => onAddToPlaylist(playlist.id, video.id)}
                          className="w-full flex items-center justify-between text-left text-xs px-2 py-1.5 rounded hover:bg-zinc-850 text-zinc-300 hover:text-white transition-colors"
                        >
                          <span>{playlist.name}</span>
                          {isIncluded ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <span className="w-3.5 h-3.5 border border-zinc-700 rounded-sm"></span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="h-px bg-zinc-850 my-1"></div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="New playlist name..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded text-xs px-2 py-1 text-zinc-300 outline-none w-full"
                    />
                    <button
                      onClick={() => {
                        if (newPlaylistName.trim()) {
                          onCreatePlaylist(newPlaylistName.trim(), video.id);
                          setNewPlaylistName('');
                        }
                      }}
                      className="bg-gold-500 hover:bg-gold-600 text-black rounded text-xs px-2.5 py-1 font-bold cursor-pointer transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors cursor-pointer border border-zinc-750"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors cursor-pointer border border-zinc-750"
              title="Download simulated content license package"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </div>

        {/* Video Statistics & Description Box */}
        <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-900 text-left space-y-2">
          <div className="flex gap-3 text-xs font-semibold text-zinc-300">
            <span>{(video.views).toLocaleString()} views</span>
            <span>{video.uploadDate}</span>
            {video.subscriptionGated && (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider">CREATOR SUBSCRIPTION PREVIEW</span>
            )}
          </div>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed whitespace-pre-wrap">
            {video.description}
          </p>
        </div>

        {/* Creator's Online Store Product Shelf - DIRECT COMMERCE INTEGRATION */}
        {video.creator.hasStore && video.products && video.products.length > 0 && (
          <div className="bg-zinc-900/40 rounded-2xl p-4 border border-emerald-950/20 text-left space-y-3" id="creator-store-shelf">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
                  Shop from {video.creator.name}
                </h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Leased Online Store Partner</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {video.products.map((product) => (
                <div key={product.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 flex gap-3 items-center hover:border-zinc-800 transition-colors">
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-zinc-900 border border-zinc-800 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-zinc-200 truncate">{product.name}</h4>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{product.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs font-mono font-bold text-emerald-400">{product.price} PPL</span>
                      <button
                        onClick={() => onBuyProduct(product)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal Dialog Overlay */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="share-modal">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-5 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-200 font-mono">Share Stream Link</h3>
              <button onClick={() => setShowShareModal(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-zinc-400">Share this amazing video stream directly with your friends via the PushPlay ecosystem URL.</p>
            <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden p-1">
              <span className="text-xs font-mono text-zinc-500 px-3 truncate select-all">{window.location.origin}/watch?v={video.id}</span>
              <button
                onClick={copyShareLink}
                className="ml-auto px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Copy Link
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium text-zinc-400 pt-2">
              <button onClick={() => {alert('Shared on Twitter!'); setShowShareModal(false);}} className="p-2 bg-zinc-850 hover:bg-zinc-800 rounded-lg cursor-pointer">𝕏 Twitter</button>
              <button onClick={() => {alert('Shared on Reddit!'); setShowShareModal(false);}} className="p-2 bg-zinc-850 hover:bg-zinc-800 rounded-lg cursor-pointer">👽 Reddit</button>
              <button onClick={() => {alert('Shared on WhatsApp!'); setShowShareModal(false);}} className="p-2 bg-zinc-850 hover:bg-zinc-800 rounded-lg cursor-pointer">💬 WhatsApp</button>
              <button onClick={() => {alert('Shared via Email!'); setShowShareModal(false);}} className="p-2 bg-zinc-850 hover:bg-zinc-800 rounded-lg cursor-pointer">✉ Email</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
