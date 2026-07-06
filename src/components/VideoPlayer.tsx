import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Share2, Download, ListPlus, Flame, Heart, Store, ExternalLink, X, ChevronRight, Check, Gauge, Tv, Plus, Clock, BookOpen } from 'lucide-react';
import { Video, StoreProduct, Playlist, AdCampaign, UserWallet, getColorGradeClass } from '../types';

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
  isTheatreMode?: boolean;
  onToggleTheatreMode?: () => void;
  onUpdateVideoDescription?: (videoId: string, newDescription: string) => void;
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
  onSubscribe,
  isTheatreMode = false,
  onToggleTheatreMode,
  onUpdateVideoDescription
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
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Chapters & Description tab state
  const [descriptionTab, setDescriptionTab] = useState<'info' | 'chapters'>('info');
  const [newChapterTime, setNewChapterTime] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [chapterError, setChapterError] = useState('');

  // Web Audio Synth refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isRealVideo = video.url.startsWith('blob:') || video.url.startsWith('data:video/') || video.url.includes('.mp4') || video.url.includes('.webm') || video.url.includes('.mov');

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
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, isRealVideo]);

  useEffect(() => {
    if (isRealVideo && videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, isRealVideo]);

  // Diagnostics for video media source integrity & MIME type inspection
  useEffect(() => {
    console.log(`[Media Diagnostics] Inspecting source for video ID: ${video.id}, Title: "${video.title}"`);
    console.log(`[Media Diagnostics] URL Source: "${video.url}"`);
    console.log(`[Media Diagnostics] Is detected as real video file: ${isRealVideo}`);

    if (isRealVideo) {
      if (video.url.startsWith('blob:')) {
        console.log(`[Media Diagnostics] Blob URL detected. Querying Blob source integrity...`);
        fetch(video.url)
          .then((response) => {
            console.log(`[Media Diagnostics] Blob request response status: ${response.status} (${response.statusText})`);
            return response.blob();
          })
          .then((blob) => {
            console.log(`[Media Diagnostics] Blob payload fetched successfully!`);
            console.log(`[Media Diagnostics] MIME Type: "${blob.type}"`);
            console.log(`[Media Diagnostics] Size: ${blob.size} bytes (${(blob.size / (1024 * 1024)).toFixed(2)} MB)`);
            if (blob.size === 0) {
              console.warn(`[Media Diagnostics] WARNING: Blob size is 0! The source file may be corrupted or empty.`);
            } else if (!blob.type.startsWith('video/')) {
              console.warn(`[Media Diagnostics] WARNING: MIME type "${blob.type}" is not a standard video container! This may cause playback or audio issues.`);
            } else {
              console.log(`[Media Diagnostics] Blob integrity verified. Player is ready for active stream playback.`);
            }
          })
          .catch((err) => {
            console.error(`[Media Diagnostics] ERROR: Failed to retrieve or resolve the blob URL source.`, err);
          });
      } else if (video.url.startsWith('data:')) {
        const match = video.url.match(/^data:([^;]+);base64,/);
        if (match) {
          console.log(`[Media Diagnostics] Data URL source detected.`);
          console.log(`[Media Diagnostics] Extracted MIME Type: "${match[1]}"`);
          if (!match[1].startsWith('video/')) {
            console.warn(`[Media Diagnostics] WARNING: Data URL MIME type "${match[1]}" is not a video file.`);
          }
        } else {
          console.log(`[Media Diagnostics] Plain Data URL detected without a standard base64/MIME header.`);
        }
      } else {
        console.log(`[Media Diagnostics] External HTTP/HTTPS resource URL. Cannot directly fetch blob client-side without potential CORS, but URL format suggests native playback.`);
      }
    } else {
      console.log(`[Media Diagnostics] No local or physical video URL detected. Falling back to real-time Web Audio API frequency synthesiser.`);
    }
  }, [video, isRealVideo]);

  // Track HTML5 Video Element readyState and networkState lifecycle
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !isRealVideo) return;

    const getNetworkStateString = (state: number) => {
      switch (state) {
        case 0: return "NETWORK_EMPTY (Uninitialised)";
        case 1: return "NETWORK_IDLE (Cached / Active, not using network)";
        case 2: return "NETWORK_LOADING (Downloading data)";
        case 3: return "NETWORK_NO_SOURCE (Source not found / Load failed)";
        default: return `UNKNOWN (${state})`;
      }
    };

    const getReadyStateString = (state: number) => {
      switch (state) {
        case 0: return "HAVE_NOTHING (No media metadata)";
        case 1: return "HAVE_METADATA (Metadata loaded)";
        case 2: return "HAVE_CURRENT_DATA (Current frame available, but stalling)";
        case 3: return "HAVE_FUTURE_DATA (Future frames available, can start)";
        case 4: return "HAVE_ENOUGH_DATA (Playable with high buffer)";
        default: return `UNKNOWN (${state})`;
      }
    };

    console.log(`[HTML5 Video Diagnostics] Attaching listeners. Initial readyState: ${getReadyStateString(el.readyState)}, networkState: ${getNetworkStateString(el.networkState)}`);

    const logState = (eventName: string) => {
      console.log(`[HTML5 Video Diagnostics] [Event: ${eventName}] readyState: ${getReadyStateString(el.readyState)} | networkState: ${getNetworkStateString(el.networkState)} | currentSec: ${el.currentTime.toFixed(2)}s`);
    };

    const handleLoadStart = () => logState("loadstart");
    const handleLoadedMetadataEvent = () => logState("loadedmetadata");
    const handleLoadedData = () => logState("loadeddata");
    const handleCanPlay = () => logState("canplay");
    const handleCanPlayThrough = () => logState("canplaythrough");
    const handleWaiting = () => logState("waiting");
    const handleStalled = () => logState("stalled");
    const handleSuspend = () => logState("suspend");
    
    const handleError = () => {
      const err = el.error;
      if (err) {
        let errType = "UNKNOWN";
        switch (err.code) {
          case 1: errType = "MEDIA_ERR_ABORTED (Fetch aborted)"; break;
          case 2: errType = "MEDIA_ERR_NETWORK (Network error occurred)"; break;
          case 3: errType = "MEDIA_ERR_DECODE (Decoding failure / Corrupt stream / Missing codec)"; break;
          case 4: errType = "MEDIA_ERR_SRC_NOT_SUPPORTED (Format / MIME type unsupported)"; break;
        }
        console.error(`[HTML5 Video Diagnostics] [Event: error] Playback stopped. Error code: ${err.code} (${errType}) | Message: "${err.message || 'No custom browser details'}"`);
      } else {
        console.error(`[HTML5 Video Diagnostics] [Event: error] Error event fired, but video.error payload is null.`);
      }
    };

    el.addEventListener("loadstart", handleLoadStart);
    el.addEventListener("loadedmetadata", handleLoadedMetadataEvent);
    el.addEventListener("loadeddata", handleLoadedData);
    el.addEventListener("canplay", handleCanPlay);
    el.addEventListener("canplaythrough", handleCanPlayThrough);
    el.addEventListener("waiting", handleWaiting);
    el.addEventListener("stalled", handleStalled);
    el.addEventListener("suspend", handleSuspend);
    el.addEventListener("error", handleError);

    return () => {
      el.removeEventListener("loadstart", handleLoadStart);
      el.removeEventListener("loadedmetadata", handleLoadedMetadataEvent);
      el.removeEventListener("loadeddata", handleLoadedData);
      el.removeEventListener("canplay", handleCanPlay);
      el.removeEventListener("canplaythrough", handleCanPlayThrough);
      el.removeEventListener("waiting", handleWaiting);
      el.removeEventListener("stalled", handleStalled);
      el.removeEventListener("suspend", handleSuspend);
      el.removeEventListener("error", handleError);
    };
  }, [video.url, isRealVideo]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      
      // Randomly show an ad if ad is enabled for video
      const next = videoRef.current.currentTime;
      if (video.adEnabled && activeAd && Math.random() < 0.05 && next > 10 && !showAd) {
        setShowAd(true);
        setAdTimer(10); // 10s skip timer
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDurationSec(videoRef.current.duration || 0);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

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
    if (isPlaying && !isRealVideo) {
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
  }, [isPlaying, durationSec, playbackSpeed, video, activeAd, showAd, isRealVideo]);

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

  // Beautiful video ambient sound synthesis
  useEffect(() => {
    if (isPlaying && video && !isRealVideo) {
      // Start/Resume Web Audio Synthesis
      try {
        getAudioContext();
      } catch (err) {
        console.error("AudioContext initialization failed:", err);
      }

      let step = 0;
      
      // Select scales based on video URL
      let scale = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00]; // Default C Major ambient chord notes
      let type: OscillatorType = 'sine';
      let speedMs = 1200;

      if (video.url === 'cloud_wisdom' || video.url === 'divine_message') {
        scale = [146.83, 220.00, 293.66, 329.63, 440.00, 587.33]; // Spiritual beautiful D minor/Sus pentatonic
        type = 'sine';
        speedMs = 1500;
      } else if (video.url === 'neon_streets') {
        scale = [110.00, 164.81, 220.00, 277.18, 329.63, 440.00]; // Warm cozy A major/Lydian mood
        type = 'triangle';
        speedMs = 1000;
      } else if (video.url === 'military_tech') {
        scale = [82.41, 123.47, 164.81, 220.00, 246.94, 329.63]; // Heavy E minor radar pulses
        type = 'sawtooth';
        speedMs = 800;
      } else if (video.url === 'think_media_live') {
        scale = [220.00, 261.63, 329.63, 392.00, 440.00, 523.25]; // Uplifting Tech A Minor chord notes
        type = 'sine';
        speedMs = 1100;
      }

      // Synth interval loop
      synthIntervalRef.current = setInterval(() => {
        const ctx = audioCtxRef.current;
        if (!ctx || ctx.state === 'suspended') return;

        // Skip playing if muted or volume is 0
        const currentVolume = isMuted ? 0 : volume;
        if (currentVolume === 0) return;

        // Pick note sequentially
        const noteFreq = scale[step % scale.length];
        step++;

        // Create oscillator and gain node
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Adjust speed based on playbackSpeed
        const adjustedSpeed = speedMs / (playbackSpeed || 1);

        osc.type = type;
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        // Calculate dynamic volume scaling (max 0.04 for very pleasant, low background drone)
        const volMultiplier = currentVolume;
        const baseVolume = 0.03 * volMultiplier;

        // Linear envelope: Soft Attack -> Gentle Release
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(baseVolume, ctx.currentTime + 0.1);
        
        if (video.url === 'military_tech') {
          // Military: shorter, sharp radar beep
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else if (video.url === 'neon_streets') {
          // Neon: warm cozy pad plucks
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.7);
        } else {
          // Celestial: very long warm, soft ocean-like drone
          gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.4);
        }

      }, speedMs);
    } else {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    }

    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, [isPlaying, video, volume, isMuted, playbackSpeed]);

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

      } else if (video.url === 'think_media_live') {
        // --- Tech studio live wave visualizer ---
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#040409');
        gradient.addColorStop(1, '#0e1322');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Draw camera frame corners
        ctx.strokeStyle = 'rgba(234, 179, 8, 0.45)'; // golden yellow border accents
        ctx.lineWidth = 2;
        const pad = 20;
        const len = 30;
        // top left
        ctx.beginPath(); ctx.moveTo(pad, pad + len); ctx.lineTo(pad, pad); ctx.lineTo(pad + len, pad); ctx.stroke();
        // top right
        ctx.beginPath(); ctx.moveTo(w - pad - len, pad); ctx.lineTo(w - pad, pad); ctx.lineTo(w - pad, pad + len); ctx.stroke();
        // bottom left
        ctx.beginPath(); ctx.moveTo(pad, h - pad - len); ctx.lineTo(pad, h - pad); ctx.lineTo(pad + len, h - pad); ctx.stroke();
        // bottom right
        ctx.beginPath(); ctx.moveTo(w - pad - len, h - pad); ctx.lineTo(w - pad, h - pad); ctx.lineTo(w - pad, h - pad - len); ctx.stroke();

        // Draw microphone/sound wave bars in bottom center
        ctx.fillStyle = 'rgba(234, 179, 8, 0.7)';
        const numBars = 16;
        const barWidth = 6;
        const barGap = 4;
        const startX = w / 2 - (numBars * (barWidth + barGap)) / 2;
        for (let i = 0; i < numBars; i++) {
          const waveHeight = isPlaying 
            ? Math.abs(Math.sin(frame * 0.05 + i * 0.4)) * 35 + 5 
            : 5;
          ctx.fillRect(startX + i * (barWidth + barGap), h - 55 - waveHeight, barWidth, waveHeight);
        }

        // Ambient bokeh bubbles matching Sean's studio backdrop
        particles.forEach((p, idx) => {
          if (isPlaying) {
            p.y -= p.speed * 0.4;
            if (p.y < 0) p.y = h;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? 'rgba(234, 179, 8, 0.12)' : 'rgba(249, 115, 22, 0.08)'; // Amber & Orange bokeh
          ctx.fill();
        });

        // Glowing studio light tube on the right side
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#eab308';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(w - 55, 45, 6, h - 90);
        ctx.shadowBlur = 0;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("HOW TO LIVE STREAM ON YOUTUBE", w / 2, h / 2 - 15);
        ctx.font = '12px monospace';
        ctx.fillStyle = '#fef08a';
        ctx.fillText("Think Media • Members Only Masterclass", w / 2, h / 2 + 15);

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

  interface Chapter {
    time: number;
    timestampStr: string;
    title: string;
  }

  const parseChapters = (desc: string): Chapter[] => {
    const list: Chapter[] = [];
    if (!desc) return list;
    const lines = desc.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Match 1: 01:23 - Title or [01:23] Title or 01:23 Title
      const match1 = trimmed.match(/^(?:\[|\()?(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\]|\))?(?:\s*[-:—–]\s*|\s+)(.*)$/);
      if (match1) {
        const p1 = parseInt(match1[1], 10);
        const p2 = parseInt(match1[2], 10);
        const p3 = match1[3] ? parseInt(match1[3], 10) : undefined;
        
        let seconds = 0;
        let tsStr = '';
        if (p3 !== undefined) {
          seconds = p1 * 3600 + p2 * 60 + p3;
          tsStr = `${p1.toString().padStart(2, '0')}:${p2.toString().padStart(2, '0')}:${p3.toString().padStart(2, '0')}`;
        } else {
          seconds = p1 * 60 + p2;
          tsStr = `${p1}:${p2.toString().padStart(2, '0')}`;
        }
        
        const title = match1[4]?.trim() || `Chapter at ${tsStr}`;
        list.push({ time: seconds, timestampStr: tsStr, title });
        continue;
      }

      // Match 2: Title 01:23 or Title [01:23]
      const match2 = trimmed.match(/^(.*?)(?:\s+[-:—–]\s*|\s+)(?:\[|\()?(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\]|\))?$/);
      if (match2) {
        const title = match2[1].trim();
        const p1 = parseInt(match2[2], 10);
        const p2 = parseInt(match2[3], 10);
        const p3 = match2[4] ? parseInt(match2[4], 10) : undefined;
        
        let seconds = 0;
        let tsStr = '';
        if (p3 !== undefined) {
          seconds = p1 * 3600 + p2 * 60 + p3;
          tsStr = `${p1.toString().padStart(2, '0')}:${p2.toString().padStart(2, '0')}:${p3.toString().padStart(2, '0')}`;
        } else {
          seconds = p1 * 60 + p2;
          tsStr = `${p1}:${p2.toString().padStart(2, '0')}`;
        }
        
        list.push({ time: seconds, timestampStr: tsStr, title: title || `Chapter at ${tsStr}` });
      }
    }
    return list.sort((a, b) => a.time - b.time);
  };

  const chapters = parseChapters(video.description);

  const getActiveChapterIndex = () => {
    if (chapters.length === 0) return -1;
    let activeIdx = -1;
    for (let i = 0; i < chapters.length; i++) {
      if (currentTime >= chapters[i].time) {
        activeIdx = i;
      } else {
        break;
      }
    }
    return activeIdx;
  };

  const activeChapterIdx = getActiveChapterIndex();

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    setChapterError('');

    if (!newChapterTitle.trim()) {
      setChapterError('Please enter a chapter title.');
      return;
    }

    const ts = newChapterTime.trim() || formatTime(currentTime);
    const tsParts = ts.split(':').map(Number);
    let seconds = 0;
    let isValid = false;

    if (tsParts.length === 3 && !tsParts.some(isNaN)) {
      seconds = tsParts[0] * 3600 + tsParts[1] * 60 + tsParts[2];
      isValid = true;
    } else if (tsParts.length === 2 && !tsParts.some(isNaN)) {
      seconds = tsParts[0] * 60 + tsParts[1];
      isValid = true;
    }

    if (!isValid) {
      setChapterError('Invalid timestamp format. Use MM:SS or HH:MM:SS.');
      return;
    }

    if (seconds > durationSec) {
      setChapterError(`Timestamp cannot exceed video duration of ${formatTime(durationSec)}.`);
      return;
    }

    const newlinePrefix = video.description.endsWith('\n') ? '' : '\n';
    const newChapterLine = `${newlinePrefix}${ts} ${newChapterTitle.trim()}`;
    const updatedDesc = video.description + newChapterLine;

    if (onUpdateVideoDescription) {
      onUpdateVideoDescription(video.id, updatedDesc);
    }

    // Clear form fields
    setNewChapterTitle('');
    setNewChapterTime('');
    setChapterError('');
    alert('Chapter added successfully!');
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = Math.floor(percentage * durationSec);
    setCurrentTime(newTime);
    if (isRealVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
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
      disclaimer: "Offline license generated by Utube Media Live Blockchain. Protected content.",
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

  const isGatedLocked = video.subscriptionGated && !video.creator.isSubscribed;

  return (
    <div className="space-y-4" id="video-player-container">
      {/* Video Canvas Sandbox with absolute layers */}
      <div className={`relative bg-black rounded-2xl overflow-hidden group/player select-none shadow-2xl border border-zinc-900 transition-all duration-300 ${isTheater ? 'aspect-[21/9] max-h-[500px]' : 'aspect-video'}`}>
        {isRealVideo ? (
          <video
            ref={videoRef}
            src={video.url}
            onClick={() => !isGatedLocked && setIsPlaying(!isPlaying)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            className={`w-full h-full block cursor-pointer object-contain bg-black animate-in fade-in duration-300 ${getColorGradeClass(video.colorGrade)}`}
          />
        ) : (
          <canvas 
            ref={canvasRef} 
            onClick={() => !isGatedLocked && setIsPlaying(!isPlaying)}
            className={`w-full h-full block cursor-pointer ${getColorGradeClass(video.colorGrade)}`}
          />
        )}

        {/* Members-Only Lock Gated Overlay Screen */}
        {isGatedLocked && (
          <div className="absolute inset-0 bg-[#060609]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 z-30 animate-in fade-in duration-300" id="gated-lock-screen">
            <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shadow-lg shadow-gold-500/5 animate-pulse">
              <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <div className="space-y-1.5 max-w-sm">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/15 text-gold-400 text-[8px] font-mono font-black uppercase tracking-widest border border-gold-500/25">
                🔒 Members-Only Gated Stream
              </span>
              <h2 className="text-xs md:text-sm font-black text-zinc-100 tracking-tight font-sans">
                Join {video.creator.name}'s Channel Membership
              </h2>
              <p className="text-[10px] md:text-[11px] text-zinc-400 font-sans leading-relaxed">
                This exclusive live-stream is gated for channel members. Join today to unlock full access, custom comments badges, and priority interactions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs pt-1">
              <button
                onClick={() => setShowJoinModal(true)}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-gold-500/10 cursor-pointer text-center"
              >
                Join for 49 PPL
              </button>
              <button
                onClick={() => onSubscribe(video.creator.id)}
                className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Subscribe Free
              </button>
            </div>
          </div>
        )}

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

      {/* Visual Progress Bar Panel */}
      <div className="bg-[#0f0f12]/80 border border-zinc-900 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl backdrop-blur-sm" id="video-playback-progress-panel">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current text-gold-500" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-gold-500 translate-x-[0.5px]" />
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-950 px-2 py-1 rounded border border-zinc-900/60">
              {formatTime(currentTime)}
            </span>
            <span className="text-zinc-600 text-xs font-mono">/</span>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-900/60">
              {formatTime(durationSec)}
            </span>
          </div>

          {activeChapterIdx !== -1 && (
            <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-amber-400 font-bold bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900/80 max-w-[140px] truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
              <span className="truncate" title={chapters[activeChapterIdx].title}>
                {chapters[activeChapterIdx].title}
              </span>
            </div>
          )}

          {isPlaying && (
            <div className="hidden sm:flex items-end gap-0.5 h-4 ml-2">
              <div className="w-0.5 bg-gold-500 animate-pulse h-2"></div>
              <div className="w-0.5 bg-amber-500 animate-pulse h-3.5" style={{ animationDelay: '100ms' }}></div>
              <div className="w-0.5 bg-gold-500 animate-pulse h-1.5" style={{ animationDelay: '200ms' }}></div>
              <div className="w-0.5 bg-yellow-400 animate-pulse h-2.5" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>

        <div className="flex-1 w-full relative group/progress h-5 flex items-center">
          <div
            onClick={handleProgressBarClick}
            className="w-full h-1.5 bg-zinc-800 hover:bg-zinc-750 rounded-full cursor-pointer relative group-hover/progress:h-2.5 transition-all duration-150"
          >
            <div
              style={{ width: `${(currentTime / Math.max(durationSec, 1)) * 100}%` }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-500 to-gold-500 rounded-full flex items-center justify-end shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            >
              <span className="w-3 h-3 rounded-full bg-white border border-gold-600 shadow-md scale-0 group-hover/progress:scale-100 transition-transform duration-150"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-gold-500" />
            )}
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 md:w-20 accent-gold-500 cursor-pointer h-1 rounded-full bg-zinc-800"
            />
            <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Playback Speed Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 rounded-lg px-2 py-1">
            <Gauge className="w-3 h-3 text-zinc-400" />
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-[10px] font-mono font-bold text-zinc-300 focus:outline-none cursor-pointer border-none p-0 pr-1 select-none"
              title="Playback Speed"
            >
              <option value="0.5" className="bg-zinc-900 text-zinc-300">0.5x</option>
              <option value="1" className="bg-zinc-900 text-zinc-300">1.0x</option>
              <option value="1.5" className="bg-zinc-900 text-zinc-300">1.5x</option>
              <option value="2" className="bg-zinc-900 text-zinc-300">2.0x</option>
            </select>
          </div>

          {/* Theatre Mode Toggle */}
          {onToggleTheatreMode && (
            <button
              onClick={onToggleTheatreMode}
              className={`p-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isTheatreMode
                  ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                  : 'bg-zinc-950 border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
              title={isTheatreMode ? "Exit Theatre Mode" : "Theatre Mode"}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold hidden md:inline">
                {isTheatreMode ? 'Standard' : 'Theatre'}
              </span>
            </button>
          )}

          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-900/50 hidden sm:inline-block">
            {video.adEnabled ? 'Ad-Supported Stream' : 'Premium Standard Play'}
          </span>
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
                {(video.creator.id === 'creator_think_media' || video.creator.subscribers >= 500000) && (
                  <Check className="w-3 h-3 text-zinc-950 bg-zinc-400 rounded-full p-[1px] inline-block font-black flex-shrink-0" title="Verified Creator" />
                )}
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Online now"></span>
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">{(video.creator.subscribers).toLocaleString()} subscribers</p>
            </div>
            
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => onSubscribe(video.creator.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  video.creator.isSubscribed
                    ? 'bg-zinc-850 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                    : 'bg-gold-500 hover:bg-gold-600 text-black font-semibold shadow-sm shadow-gold-500/10'
                }`}
              >
                {video.creator.isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>

              {video.subscriptionGated && (
                <button
                  type="button"
                  onClick={() => setShowJoinModal(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold font-mono tracking-wide cursor-pointer transition-all border ${
                    video.creator.isSubscribed
                      ? 'bg-zinc-950 border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                      : 'bg-zinc-900 hover:bg-zinc-850 text-gold-400 hover:text-gold-300 border-gold-500/20'
                  }`}
                >
                  Join
                </button>
              )}
            </div>
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
        <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-900 text-left space-y-3.5">
          {/* Tabs header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <div className="flex gap-2.5">
              <button
                onClick={() => setDescriptionTab('info')}
                className={`text-xs font-bold uppercase tracking-wider font-mono pb-1 border-b-2 transition-all cursor-pointer ${
                  descriptionTab === 'info'
                    ? 'text-gold-500 border-gold-500'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setDescriptionTab('chapters')}
                className={`text-xs font-bold uppercase tracking-wider font-mono pb-1 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  descriptionTab === 'chapters'
                    ? 'text-gold-500 border-gold-500'
                    : 'text-zinc-500 border-transparent hover:text-zinc-300'
                }`}
              >
                Chapters <span className="text-[10px] bg-zinc-950 px-1.5 py-0.5 rounded-full border border-zinc-850 font-semibold">{chapters.length}</span>
              </button>
            </div>
            
            <div className="flex gap-3 text-[10px] font-mono font-bold text-zinc-450">
              <span>{(video.views).toLocaleString()} views</span>
              <span>•</span>
              <span>{video.uploadDate}</span>
            </div>
          </div>

          {descriptionTab === 'info' && (
            <div className="space-y-2 animate-in fade-in duration-150">
              {video.subscriptionGated && (
                <div className="mb-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                    CREATOR SUBSCRIPTION PREVIEW
                  </span>
                </div>
              )}
              <p className="text-xs text-zinc-450 font-sans leading-relaxed whitespace-pre-wrap">
                {(() => {
                  if (!video.description) return null;
                  const timestampRegex = /(\b(?:[0-5]?\d:)?(?:[0-5]?\d):[0-5]\d\b)/g;
                  const parts = video.description.split(timestampRegex);
                  return parts.map((part, idx) => {
                    if (timestampRegex.test(part)) {
                      const cleanPart = part.replace(/[\[\]()]/g, '');
                      const timeParts = cleanPart.split(':').map(Number);
                      let sec = 0;
                      if (timeParts.length === 3) {
                        sec = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
                      } else if (timeParts.length === 2) {
                        sec = timeParts[0] * 60 + timeParts[1];
                      }
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (sec <= durationSec) {
                              setCurrentTime(sec);
                            }
                          }}
                          className="text-gold-400 hover:text-gold-300 hover:underline font-mono font-bold bg-gold-500/10 px-1.5 py-0.5 rounded mx-0.5 inline-flex items-center cursor-pointer text-[11px] focus:outline-none transition-all border border-gold-500/5 hover:bg-gold-500/20 shadow-sm"
                          title={`Seek to ${cleanPart}`}
                        >
                          {part}
                        </button>
                      );
                    }
                    return <span key={idx}>{part}</span>;
                  });
                })()}
              </p>
            </div>
          )}

          {descriptionTab === 'chapters' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-150">
              {/* Chapter list */}
              {chapters.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No timestamped chapters found in the description text. Add one below to get started!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  {chapters.map((chapter, idx) => {
                    const isActive = idx === activeChapterIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCurrentTime(chapter.time)}
                        className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                          isActive
                            ? 'bg-gold-500/10 border-gold-500/30 text-gold-400 shadow-md shadow-gold-500/5'
                            : 'bg-zinc-950/40 border-zinc-900/60 hover:border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-950/80'
                        }`}
                      >
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-gold-500 text-black font-semibold shadow'
                              : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white'
                          }`}
                        >
                          {isActive ? (
                            <Pause className="w-2.5 h-2.5 fill-current" />
                          ) : (
                            <Play className="w-2.5 h-2.5 fill-current translate-x-[0.5px]" />
                          )}
                        </button>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 flex-shrink-0">
                          {chapter.timestampStr}
                        </span>
                        <span className="text-xs font-semibold truncate flex-1">{chapter.title}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Chapter form */}
              <form onSubmit={handleAddChapter} className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-900 space-y-3 text-left">
                <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                  <BookOpen className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Create Video Chapter</h4>
                </div>
                
                {chapterError && (
                  <p className="text-[10px] text-red-400 font-semibold">{chapterError}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Timestamp Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Timestamp</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. 01:30"
                        value={newChapterTime}
                        onChange={(e) => setNewChapterTime(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2.5 py-1.5 text-zinc-300 outline-none w-full focus:border-zinc-700 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setNewChapterTime(formatTime(currentTime))}
                        className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
                        title="Grab current player time"
                      >
                        <Clock className="w-3 h-3 text-gold-500" /> Current
                      </button>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Chapter Title</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. WELLINGTON STREET BOKEH"
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2.5 py-1.5 text-zinc-300 outline-none w-full focus:border-zinc-700 font-sans"
                      />
                      <button
                        type="submit"
                        className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer shadow-sm shadow-gold-500/10"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Chapter
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
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
            <p className="text-xs text-zinc-400">Share this amazing video stream directly with your friends via the Utube Media ecosystem URL.</p>
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

      {/* YouTube-styled Join Channel Membership Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="join-membership-modal">
          <div className="bg-[#0b0b0f] border-2 border-gold-500/30 w-full max-w-md rounded-3xl p-5 text-left space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-205">
            <button 
              onClick={() => setShowJoinModal(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-950/60 text-zinc-400 hover:text-white border border-zinc-900 cursor-pointer transition-all"
              title="Close modal"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header branding */}
            <div className="flex gap-3.5 items-center pb-3 border-b border-zinc-900">
              <img src={video.creator.avatar} alt="" className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 text-[8px] font-mono font-black uppercase tracking-widest border border-gold-500/15">
                  EXCLUSIVE MEMBERSHIP
                </span>
                <h3 className="text-xs font-bold text-zinc-100 tracking-tight flex items-center gap-1 mt-0.5">
                  Join {video.creator.name}'s Membership
                  {(video.creator.id === 'creator_think_media' || video.creator.subscribers >= 500000) && (
                    <Check className="w-3 h-3 text-zinc-950 bg-zinc-400 rounded-full p-[1px]" />
                  )}
                </h3>
              </div>
            </div>

            {/* Benefit perks list */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Members-only Perks & Tier Perks</h4>
              
              <div className="space-y-2 bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-900 text-[11px] text-zinc-300">
                <div className="flex items-start gap-2">
                  <span className="text-gold-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-zinc-100 block text-xs">Instant Access to Gated Streams</span>
                    <span className="text-[10px] text-zinc-500 leading-normal block">Watch all premium live broadcasts, tutorials, and masterclasses anytime.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-zinc-900">
                  <span className="text-gold-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-zinc-100 block text-xs">Exclusive Loyalty Badge</span>
                    <span className="text-[10px] text-zinc-500 leading-normal block">Get a special custom badge next to your comments to stand out.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-zinc-900">
                  <span className="text-gold-500 flex-shrink-0 mt-0.5 font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-zinc-100 block text-xs">Creator Direct Q&A Priority</span>
                    <span className="text-[10px] text-zinc-500 leading-normal block">Get direct feedback and high-priority replies on your comments and tips.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Info & Purchase Button */}
            <div className="pt-1 space-y-3">
              <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-xs">
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono block">YOUR WALLET BALANCE</span>
                  <span className="font-bold text-zinc-200 font-mono">{wallet.balancePPL} PPL</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-zinc-500 font-mono block">MEMBERSHIP COST</span>
                  <span className="font-black text-gold-400 font-mono">49 PPL / month</span>
                </div>
              </div>

              {wallet.balancePPL < 49 ? (
                <p className="text-[10px] text-red-400 font-medium text-center bg-red-950/10 py-1.5 px-3 rounded-lg border border-red-900/20">
                  ⚠️ Insufficient balance. Please swap coins or tip first to reload your PPL token balance.
                </p>
              ) : (
                <p className="text-[10px] text-zinc-500 font-medium text-center leading-normal">
                  Your subscription will instantly activate on the ledger. Cancel anytime from your account settings.
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={wallet.balancePPL < 49}
                  onClick={() => {
                    onSubscribe(video.creator.id);
                    setShowJoinModal(false);
                    alert(`Congratulations! You have successfully joined ${video.creator.name}'s membership! Premium content is now unlocked.`);
                  }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all text-center cursor-pointer ${
                    wallet.balancePPL < 49
                      ? 'bg-zinc-800 text-zinc-500 border border-zinc-850 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black shadow-lg shadow-gold-500/10'
                  }`}
                >
                  Join Membership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
