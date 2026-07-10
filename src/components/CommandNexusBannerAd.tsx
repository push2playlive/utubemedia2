import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, X } from 'lucide-react';

interface AdData {
  id: string;
  title: string;
  description: string;
  image: string;
  targetUrl: string;
  cta: string;
}

interface CommandNexusBannerAdProps {
  isPremiumSubscribed: boolean;
}

export default function CommandNexusBannerAd({ isPremiumSubscribed }: CommandNexusBannerAdProps) {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isPremiumSubscribed) return;

    const fetchAd = async () => {
      try {
        const response = await fetch('/api/commandnexus/ads?slot=top_banner');
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            setAd(resJson.data);
          }
        }
      } catch (err) {
        console.error('Failed to load CommandNexus sponsor feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [isPremiumSubscribed]);

  if (isPremiumSubscribed || dismissed || !ad) return null;

  return (
    <div 
      className="w-full max-w-7xl mx-auto px-4 md:px-6 py-2.5 animate-in fade-in slide-in-from-top-4 duration-500" 
      id="commandnexus-top-banner-ad-container"
    >
      <div className="relative overflow-hidden rounded-2xl border border-[#ea580c]/35 bg-gradient-to-r from-zinc-950/90 via-[#1c1c24]/90 to-zinc-950/95 backdrop-blur-md shadow-[0_0_25px_rgba(234,88,12,0.1)] p-3 md:py-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Decorative glowing background elements */}
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#ea580c]/10 to-transparent pointer-events-none" />
        <div className="absolute -left-10 top-0 w-40 h-full bg-zinc-400/5 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Ad Badge Indicator */}
          <div className="flex-shrink-0 relative flex items-center justify-center w-12 h-12 rounded-xl border border-zinc-800/80 bg-zinc-950/60 shadow-inner">
            <div className="absolute inset-0.5 rounded-lg border border-[#ea580c]/20 bg-[#ea580c]/5 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#ea580c]" />
            </div>
          </div>

          <div className="text-left space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest text-[#ea580c] uppercase px-1.5 py-0.5 bg-[#ea580c]/10 border border-[#ea580c]/20 rounded font-mono">
                Sponsor Feed
              </span>
              <span className="text-[10px] font-mono text-zinc-500">via CommandNexus Hub</span>
            </div>
            <h4 className="text-xs md:text-sm font-bold text-zinc-100 tracking-wide">
              {ad.title}
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed max-w-2xl line-clamp-1">
              {ad.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <a
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#ea580c] hover:bg-[#ea580c]/95 active:scale-95 text-black font-black rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-md shadow-[#ea580c]/20 flex items-center gap-1.5"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300 border border-zinc-800/80 transition-colors cursor-pointer"
            title="Dismiss Sponsor Ad"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
