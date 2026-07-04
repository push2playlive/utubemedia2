import React, { useState } from 'react';
import { User, Mail, ShieldAlert, CheckCircle, Camera, Users, Sparkles, LogOut, Key } from 'lucide-react';
import { Creator } from '../types';

interface ProfileSettingsProps {
  currentUser: { name: string; email: string; avatar: string; isCreator: boolean };
  onUpdateProfile: (name: string, email: string, avatar: string, isCreator: boolean) => void;
  subscribedCreators: Creator[];
  onUnsubscribe: (creatorId: string) => void;
}

export default function ProfileSettings({
  currentUser,
  onUpdateProfile,
  subscribedCreators,
  onUnsubscribe
}: ProfileSettingsProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [isCreator, setIsCreator] = useState(currentUser.isCreator);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name.trim(), email.trim(), avatar.trim(), isCreator);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
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
