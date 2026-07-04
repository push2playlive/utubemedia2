import React, { useState } from 'react';
import { User, Mail, ShieldAlert, CheckCircle, Camera, Users, Sparkles, LogOut, Key, Link2, Youtube, Instagram, Facebook, Video, Globe } from 'lucide-react';
import { Creator } from '../types';

interface ProfileSettingsProps {
  currentUser: { 
    name: string; 
    email: string; 
    avatar: string; 
    bio?: string; 
    isCreator: boolean;
    tiktokApiKey?: string;
    youtubeApiKey?: string;
    instagramApiKey?: string;
    facebookApiKey?: string;
  };
  onUpdateProfile: (
    name: string, 
    email: string, 
    avatar: string, 
    isCreator: boolean, 
    bio?: string,
    tiktokApiKey?: string,
    youtubeApiKey?: string,
    instagramApiKey?: string,
    facebookApiKey?: string
  ) => void;
  subscribedCreators: Creator[];
  onUnsubscribe: (creatorId: string) => void;
  onLogout: () => void;
}

export default function ProfileSettings({
  currentUser,
  onUpdateProfile,
  subscribedCreators,
  onUnsubscribe,
  onLogout
}: ProfileSettingsProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isCreator, setIsCreator] = useState(currentUser.isCreator);
  
  // External Social API Keys
  const [tiktokApiKey, setTiktokApiKey] = useState(() => currentUser.tiktokApiKey || localStorage.getItem('ppl_key_tiktok') || '');
  const [youtubeApiKey, setYoutubeApiKey] = useState(() => currentUser.youtubeApiKey || localStorage.getItem('ppl_key_youtube') || '');
  const [instagramApiKey, setInstagramApiKey] = useState(() => currentUser.instagramApiKey || localStorage.getItem('ppl_key_instagram') || '');
  const [facebookApiKey, setFacebookApiKey] = useState(() => currentUser.facebookApiKey || localStorage.getItem('ppl_key_facebook') || '');

  // Testing/status states
  const [testStatus, setTestStatus] = useState<{ [key: string]: 'idle' | 'testing' | 'success' | 'error' }>({});

  const handleTestKey = (platform: string, keyValue: string) => {
    if (!keyValue.trim()) {
      setTestStatus(prev => ({ ...prev, [platform]: 'error' }));
      setTimeout(() => {
        setTestStatus(prev => ({ ...prev, [platform]: 'idle' }));
      }, 3000);
      return;
    }

    setTestStatus(prev => ({ ...prev, [platform]: 'testing' }));
    
    // Simulate external social API authentication verification
    setTimeout(() => {
      setTestStatus(prev => ({ ...prev, [platform]: 'success' }));
    }, 1200);
  };
  
  // Password state management
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  // Email notifications checkboxes
  const [notifyComments, setNotifyComments] = useState(true);
  const [notifyUploads, setNotifyUploads] = useState(true);
  const [notifyTransactions, setNotifyTransactions] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save account settings to our persistent ledger accounts
    const saved = localStorage.getItem('ppl_registered_accounts');
    if (saved) {
      const accounts = JSON.parse(saved);
      const updatedAccounts = accounts.map((acc: any) => {
        if (acc.email.toLowerCase() === currentUser.email.toLowerCase()) {
          return {
            ...acc,
            name: name.trim(),
            email: email.trim(),
            avatar: avatar.trim(),
            bio: bio.trim(),
            password: password,
            isCreator: isCreator,
            tiktokApiKey: tiktokApiKey.trim(),
            youtubeApiKey: youtubeApiKey.trim(),
            instagramApiKey: instagramApiKey.trim(),
            facebookApiKey: facebookApiKey.trim()
          };
        }
        return acc;
      });
      localStorage.setItem('ppl_registered_accounts', JSON.stringify(updatedAccounts));
    }

    onUpdateProfile(
      name.trim(),
      email.trim(),
      avatar.trim(),
      isCreator,
      bio.trim(),
      tiktokApiKey.trim(),
      youtubeApiKey.trim(),
      instagramApiKey.trim(),
      facebookApiKey.trim()
    );
    
    // Save external API keys
    localStorage.setItem('ppl_key_tiktok', tiktokApiKey.trim());
    localStorage.setItem('ppl_key_youtube', youtubeApiKey.trim());
    localStorage.setItem('ppl_key_instagram', instagramApiKey.trim());
    localStorage.setItem('ppl_key_facebook', facebookApiKey.trim());

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 text-left animate-in fade-in duration-200" id="profile-settings-container">
      {/* Page Title */}
      <div className="border-b border-zinc-900/60 pb-3">
        <h1 className="text-lg font-medium font-serif text-zinc-100 flex items-center gap-2 tracking-wide">
          <User className="w-5.5 h-5.5 text-gold-500" />
          <span>USER PROFILE & CREATOR SETTINGS</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-sans">Configure your platform identities, toggle creator monetization programs, and review subscriptions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Avatar backdrop */}
        <div className="space-y-4">
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 p-5 rounded-2xl text-center space-y-4 relative overflow-hidden">
            {/* Banner block simulation */}
            <div className="h-16 bg-gradient-to-r from-gold-600/20 to-zinc-900 rounded-lg absolute top-0 left-0 right-0 z-0"></div>

            <div className="relative z-10 pt-4 flex flex-col items-center">
              <div className="relative group">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border-4 border-zinc-950 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => {
                    const url = prompt('Enter image URL for avatar:', avatar);
                    if (url) setAvatar(url);
                  }}
                  className="absolute bottom-0 right-0 p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-850 text-zinc-350 hover:text-white transition-colors cursor-pointer"
                  title="Edit Avatar URL"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100 mt-3">{currentUser.name}</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{currentUser.email}</p>

              {currentUser.isCreator ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-gold-500/10 text-gold-400 text-[9px] font-bold mt-3 border border-gold-500/20 uppercase tracking-wider">
                  Verified Partner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] font-semibold mt-3">
                  Viewer Node Account
                </span>
              )}

              {bio && (
                <p className="text-[11px] text-zinc-400 font-sans italic line-clamp-3 mt-3 border-t border-zinc-900/60 pt-2.5">
                  "{bio}"
                </p>
              )}

              <button
                type="button"
                onClick={onLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out of Account
              </button>
            </div>
          </div>

          {/* Subscribed Channels Shelf */}
          <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 p-4.5 rounded-2xl space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-900/60 pb-1.5">
              <Users className="w-4 h-4 text-gold-500" /> Subscriptions ({subscribedCreators.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {subscribedCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between p-1.5 bg-zinc-950/60 rounded-lg border border-zinc-900">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <img src={creator.avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    <span className="text-[11px] text-zinc-300 truncate font-medium">{creator.name}</span>
                  </div>
                  <button
                    onClick={() => onUnsubscribe(creator.id)}
                    className="text-[9px] text-zinc-500 hover:text-gold-400 font-semibold cursor-pointer px-1.5 py-0.5 rounded hover:bg-gold-500/5 transition-colors"
                  >
                    Unsub
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Settings Form */}
        <div className="bg-[#0c0c0f]/80 border border-zinc-900/80 p-5 rounded-2xl md:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-widest border-b border-zinc-900/60 pb-2">
            Configure Account Identity
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Profile Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs pl-8 pr-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none focus:border-gold-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">External Avatar URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none font-mono focus:border-gold-500/30"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Biography / Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief description of yourself or your channel..."
                className="w-full bg-zinc-950 border border-zinc-900 rounded-lg text-xs px-3 py-2 h-16 text-zinc-200 outline-none focus:border-gold-500/30 resize-none"
              />
            </div>

            {/* Account Settings: Password updates */}
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block font-serif tracking-wide flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-gold-500" /> Account Security
              </span>
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Change Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-3 py-2 pr-10 text-zinc-200 outline-none focus:border-gold-500/30 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    <span className="text-[10px] font-mono cursor-pointer">{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Account Settings: Email Notifications */}
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3">
              <span className="text-xs font-semibold text-zinc-300 block font-serif tracking-wide flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-gold-500" /> Email Notifications Settings
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyComments}
                    onChange={(e) => setNotifyComments(e.target.checked)}
                    className="accent-gold-500 rounded"
                  />
                  <div className="text-left">
                    <span className="text-[11px] font-medium text-zinc-300 block">Comments and Replies</span>
                    <span className="text-[9px] text-zinc-500 font-mono block">Notify me when someone replies to my comments or posts on my streams</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyUploads}
                    onChange={(e) => setNotifyUploads(e.target.checked)}
                    className="accent-gold-500 rounded"
                  />
                  <div className="text-left">
                    <span className="text-[11px] font-medium text-zinc-300 block">Creator Upload Alerts</span>
                    <span className="text-[9px] text-zinc-500 font-mono block">Send me daily digest updates for streams uploaded by creators I subscribe to</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyTransactions}
                    onChange={(e) => setNotifyTransactions(e.target.checked)}
                    className="accent-gold-500 rounded"
                  />
                  <div className="text-left">
                    <span className="text-[11px] font-medium text-zinc-300 block">Blockchain and Store Transactions</span>
                    <span className="text-[9px] text-zinc-500 font-mono block">Send automated reports for tips, coin swaps, store purchases, and leases</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Creator Program Toggles */}
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-250 block font-serif tracking-wide">DEPLOY CREATOR IDENTITY</span>
                  <p className="text-[10px] text-zinc-500 leading-normal mt-0.5">Publish long and short streams, lease virtual stores, monetize view streams, and connect smart contracts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreator(!isCreator)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${isCreator ? 'bg-gold-500' : 'bg-zinc-800'}`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isCreator ? 'left-6' : 'left-1'}`}></span>
                </button>
              </div>
            </div>

            {/* External API Key Social Integrations */}
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
              <div className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-250 block font-serif tracking-wide flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-gold-500" /> CREATOR BROADCAST & API INTEGRATIONS
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">Sync broadcasts with multi-platform channels</span>
              </div>

              <div className="space-y-4">
                {/* YouTube */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Data API Key
                    </label>
                    <div className="flex items-center gap-2">
                      {testStatus['youtube'] === 'success' && <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10">● Valid</span>}
                      {testStatus['youtube'] === 'error' && <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/10">● Key Required</span>}
                      {testStatus['youtube'] === 'testing' && <span className="text-[9px] font-mono text-gold-400 animate-pulse">Checking...</span>}
                      <button
                        type="button"
                        onClick={() => handleTestKey('youtube', youtubeApiKey)}
                        className="text-[9px] uppercase tracking-wider font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-450 hover:text-white px-2 py-0.5 rounded border border-zinc-800 cursor-pointer"
                      >
                        Verify Key
                      </button>
                    </div>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter YouTube API Key (e.g. AIzaSy...)"
                    value={youtubeApiKey}
                    onChange={(e) => setYoutubeApiKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-300 outline-none focus:border-gold-500/30 font-mono"
                  />
                </div>

                {/* TikTok */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-cyan-450" /> TikTok Stream Access Token
                    </label>
                    <div className="flex items-center gap-2">
                      {testStatus['tiktok'] === 'success' && <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10">● Connected</span>}
                      {testStatus['tiktok'] === 'error' && <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/10">● Token Required</span>}
                      {testStatus['tiktok'] === 'testing' && <span className="text-[9px] font-mono text-gold-400 animate-pulse">Checking...</span>}
                      <button
                        type="button"
                        onClick={() => handleTestKey('tiktok', tiktokApiKey)}
                        className="text-[9px] uppercase tracking-wider font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-455 hover:text-white px-2 py-0.5 rounded border border-zinc-800 cursor-pointer"
                      >
                        Verify Key
                      </button>
                    </div>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter TikTok stream/session broadcast token..."
                    value={tiktokApiKey}
                    onChange={(e) => setTiktokApiKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-300 outline-none focus:border-gold-500/30 font-mono"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram Graph Access Key
                    </label>
                    <div className="flex items-center gap-2">
                      {testStatus['instagram'] === 'success' && <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10">● Authenticated</span>}
                      {testStatus['instagram'] === 'error' && <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/10">● Key Required</span>}
                      {testStatus['instagram'] === 'testing' && <span className="text-[9px] font-mono text-gold-400 animate-pulse">Checking...</span>}
                      <button
                        type="button"
                        onClick={() => handleTestKey('instagram', instagramApiKey)}
                        className="text-[9px] uppercase tracking-wider font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-450 hover:text-white px-2 py-0.5 rounded border border-zinc-800 cursor-pointer"
                      >
                        Verify Key
                      </button>
                    </div>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Instagram Graph API token..."
                    value={instagramApiKey}
                    onChange={(e) => setInstagramApiKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-300 outline-none focus:border-gold-500/30 font-mono"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      <Facebook className="w-3.5 h-3.5 text-blue-500" /> Facebook Live Integration Key
                    </label>
                    <div className="flex items-center gap-2">
                      {testStatus['facebook'] === 'success' && <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/10">● Live Linked</span>}
                      {testStatus['facebook'] === 'error' && <span className="text-[9px] font-mono text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/10">● Key Required</span>}
                      {testStatus['facebook'] === 'testing' && <span className="text-[9px] font-mono text-gold-400 animate-pulse">Checking...</span>}
                      <button
                        type="button"
                        onClick={() => handleTestKey('facebook', facebookApiKey)}
                        className="text-[9px] uppercase tracking-wider font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-450 hover:text-white px-2 py-0.5 rounded border border-zinc-800 cursor-pointer"
                      >
                        Verify Key
                      </button>
                    </div>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Facebook Page/Stream Access token..."
                    value={facebookApiKey}
                    onChange={(e) => setFacebookApiKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-850 rounded-lg text-xs px-3 py-2 text-zinc-300 outline-none focus:border-gold-500/30 font-mono"
                  />
                </div>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 bg-gold-500/10 border border-gold-500/20 text-gold-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" /> Profiles identity updated successfully on the ledger state.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-black rounded-lg text-xs font-bold transition-all cursor-pointer text-center shadow-md shadow-gold-500/5"
            >
              Save Profiles Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
