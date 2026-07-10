import React, { useEffect, useState } from 'react';
import { X, Sparkles, ExternalLink, Network, LayoutGrid } from 'lucide-react';

interface AdData {
  id: string;
  title: string;
  description: string;
  image: string;
  targetUrl: string;
  cta: string;
}

interface CommandNexusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ECOSYSTEM_PLATFORMS = [
  {
    name: 'UTubeChat',
    domain: 'utubechat.com',
    description: 'Secure real-time encrypted messaging array.',
    icon: '💬',
    accentColor: '#ea580c'
  },
  {
    name: 'UTubeMail',
    domain: 'utubemail.com',
    description: 'E2E private anonymous mailing server.',
    icon: '✉️',
    accentColor: '#3b82f6'
  },
  {
    name: 'UTubeMedia',
    domain: 'utube.media',
    description: 'Curated high-fidelity digital streaming node.',
    icon: '▶️',
    accentColor: '#e11d48'
  },
  {
    name: 'MyCanvasLab',
    domain: 'mycanvaslab.com',
    description: 'Interactive high-performance digital art desk.',
    icon: '🎨',
    accentColor: '#8b5cf6'
  },
  {
    name: 'WhisperTech',
    domain: 'whispertech.net',
    description: 'Advanced defensive threat matrices.',
    icon: '🛡️',
    accentColor: '#10b981'
  },
  {
    name: 'HygieneTeam',
    domain: 'hygieneteam.nz',
    description: 'Localised sanitisation deployment systems.',
    icon: '🧼',
    accentColor: '#06b6d4'
  },
  {
    name: 'SnippetsLive',
    domain: 'snippets.live',
    description: 'Instant sandbox code snippet ledger.',
    icon: '💻',
    accentColor: '#f59e0b'
  },
  {
    name: 'NexusOS Solutions',
    domain: 'nexusos.solutions',
    description: 'Ecosystem system control matrices.',
    icon: '⚙️',
    accentColor: '#6366f1'
  }
];

export default function CommandNexusDrawer({ isOpen, onClose }: CommandNexusDrawerProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDrawerAd = async () => {
      try {
        const response = await fetch('/api/commandnexus/ads?slot=drawer_top');
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            setAd(resJson.data);
          }
        }
      } catch (err) {
        console.error('Failed to load drawer sponsor ad:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawerAd();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-in fade-in duration-300" id="command-nexus-drawer-root">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
        id="command-nexus-drawer-backdrop"
      />

      {/* Drawer Panel */}
      <div 
        className="relative flex flex-col w-96 max-w-full h-full bg-[#0a0a0c] border-r border-[#ea580c]/30 shadow-[0_0_50px_rgba(234,88,12,0.15)] overflow-hidden animate-in slide-in-from-left duration-300"
        id="command-nexus-drawer-panel"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-900/80 bg-[#070709]">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-[#ea580c] animate-pulse" />
            <span className="text-xs font-black text-zinc-300 font-mono tracking-widest uppercase">
              CommandNexus Network
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-850 cursor-pointer transition-colors"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Sponsor Advertisement Slot (Top 80px) */}
        <div className="h-20 flex-shrink-0 border-b border-[#ea580c]/20 bg-gradient-to-r from-zinc-950 via-[#16110f] to-zinc-950 relative overflow-hidden flex items-center px-4 justify-between gap-3">
          {/* Subtle light transparent orange focus borders */}
          <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-[#ea580c]/5 to-transparent pointer-events-none" />
          
          {loading ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-zinc-900/80 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 bg-zinc-900 rounded animate-pulse" />
                <div className="h-2.5 w-48 bg-zinc-900 rounded animate-pulse" />
              </div>
            </div>
          ) : ad ? (
            <div className="flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-lg border border-[#ea580c]/20 bg-[#ea580c]/5 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-[#ea580c]" />
                </div>
                <div className="text-left overflow-hidden">
                  <span className="text-[8px] font-black tracking-widest text-[#ea580c] uppercase font-mono block">SPONSOR FEED</span>
                  <h5 className="text-[11px] font-bold text-zinc-200 truncate">{ad.title}</h5>
                  <p className="text-[9px] text-zinc-500 truncate">{ad.description}</p>
                </div>
              </div>
              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black text-[9px] font-black rounded uppercase tracking-wider flex items-center gap-1 flex-shrink-0"
              >
                <span>Go</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ) : (
            <div className="text-left py-2">
              <span className="text-[9px] font-mono text-zinc-500">Connected to CommandNexus Ad Matrix</span>
            </div>
          )}
        </div>

        {/* Master App-Launcher Grid (linking cleanly to all ecosystem platforms) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <LayoutGrid className="w-4 h-4 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
              Ecosystem Platform Launcher
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3" id="ecosystem-app-launcher-grid">
            {ECOSYSTEM_PLATFORMS.map((platform) => (
              <a
                key={platform.domain}
                href={`https://${platform.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col p-3 rounded-xl border border-zinc-900 bg-[#0c0c0f]/80 hover:bg-zinc-950/90 hover:border-[#ea580c]/40 transition-all duration-300 shadow-lg text-left"
              >
                {/* Accent glow on hover */}
                <div 
                  className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: platform.accentColor, filter: 'blur(4px)' }}
                />

                <span className="text-xl mb-2 filter drop-shadow-md group-hover:scale-110 transition-transform">{platform.icon}</span>
                <h6 className="text-[11px] font-black text-zinc-200 tracking-wide flex items-center gap-1">
                  <span>{platform.name}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-[#ea580c] transition-opacity" />
                </h6>
                <p className="text-[9px] text-zinc-500 font-sans mt-1 leading-normal">
                  {platform.description}
                </p>
                <span className="text-[8px] text-zinc-600 font-mono mt-2 block">
                  {platform.domain}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-[#050507] border-t border-zinc-900 flex items-center justify-between">
          <span className="text-[8px] text-zinc-600 font-mono">COMMANDNEXUS NODE v1.4.2</span>
          <span className="text-[8px] font-mono text-emerald-500 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span> SECURE TUNNEL
          </span>
        </div>
      </div>
    </div>
  );
}
