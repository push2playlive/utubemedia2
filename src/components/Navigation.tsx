import { Home, Flame, Users, Clock, ThumbsUp, Wallet, Store, BarChart3, Settings, ShieldAlert, Library, BookOpen, Music, History } from 'lucide-react';
import { Creator } from '../types';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  subscribedCreators: Creator[];
  onClose?: () => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
}

export default function Navigation({ currentView, onNavigate, subscribedCreators, onClose, isMobile, isCollapsed }: NavigationProps) {
  // Navigation categories
  const mainNav = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shorts', label: 'Shorts', icon: Flame },
    { id: 'music', label: 'Music', icon: Music },
  ];

  const personalNav = [
    { id: 'playlists', label: 'Playlists', icon: Library },
    { id: 'watch-later', label: 'Watch Later', icon: Clock },
    { id: 'liked', label: 'Liked videos', icon: ThumbsUp },
    { id: 'history', label: 'Watch History', icon: History },
  ];

  const ecosystemNav = [
    { id: 'wallet', label: 'Wallet & Crypto', icon: Wallet },
    { id: 'store', label: 'Online Store', icon: Store },
    { id: 'advertising', label: 'Advertisers Lab', icon: BookOpen },
    { id: 'creator-studio', label: 'Creator Studio', icon: BarChart3 },
    { id: 'lease-store', label: 'Lease a Store', icon: ShieldAlert },
  ];

  const containerClasses = isMobile
    ? "w-full text-zinc-300 space-y-5"
    : `bg-[#0a0a0c] text-zinc-300 border-r border-zinc-900/80 h-[calc(100vh-57px)] overflow-y-auto hidden lg:block space-y-5 transition-all duration-300 ${
        isCollapsed ? 'w-0 p-0 border-r-0 opacity-0 pointer-events-none' : 'w-64 p-3'
      }`;

  return (
    <aside className={containerClasses} id="app-navigation">
      {/* Main Stream */}
      <div className="space-y-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose?.();
              }}
              className={`w-full flex items-center gap-4 px-3 py-2 text-sm rounded-lg transition-all text-left font-medium cursor-pointer ${
                isActive 
                  ? 'bg-zinc-900 text-gold-400 font-semibold border-l-2 border-gold-500 rounded-l-none pl-2.5' 
                  : 'hover:bg-zinc-900 hover:text-white text-zinc-400'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-gold-500' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="h-px bg-zinc-900/60"></div>

      {/* Library / Library Elements */}
      <div>
        <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 font-mono">My Playlists</h3>
        <div className="space-y-1">
          {personalNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-4 px-3 py-2 text-sm rounded-lg transition-all text-left font-medium cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-900 text-gold-400 font-semibold border-l-2 border-gold-500 rounded-l-none pl-2.5' 
                    : 'hover:bg-zinc-900 hover:text-white text-zinc-400'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-gold-500' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-zinc-900/60"></div>

      {/* Creator Commerce & Ecosystem */}
      <div>
        <h3 className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 font-mono">Creator Economy</h3>
        <div className="space-y-1">
          {ecosystemNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-4 px-3 py-2 text-sm rounded-lg transition-all text-left font-medium cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-900 text-gold-400 font-semibold border-l-2 border-gold-500 rounded-l-none pl-2.5' 
                    : 'hover:bg-zinc-900 hover:text-white text-zinc-400'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-gold-500' : 'text-gold-500/60'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-zinc-900/60"></div>

      {/* Subscriptions Stream (Matches sidebar exactly) */}
      <div>
        <div className="flex items-center justify-between px-3 mb-2">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Subscriptions</h3>
          <span className="text-[8px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-1.5 py-0.5 rounded font-bold font-mono">LIVE</span>
        </div>
        <div className="space-y-1.5">
          {subscribedCreators.map((creator) => (
            <button
              key={creator.id}
              onClick={() => {
                onNavigate('creator-profile', { creatorId: creator.id });
                onClose?.();
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="w-5.5 h-5.5 rounded-full object-cover group-hover:scale-105 transition-transform" 
                  referrerPolicy="no-referrer"
                />
                <span className="truncate">{creator.name}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 group-hover:scale-110 transition-transform flex-shrink-0 ml-1"></span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
