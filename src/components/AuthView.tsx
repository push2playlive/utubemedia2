import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, ShieldAlert, Sparkles, Image, AlignLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: { name: string; email: string; avatar: string; bio?: string; isCreator: boolean }) => void;
}

// Preset modern elegant avatars for quick selection
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Female chic
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Male elegant
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', // Female professional
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', // Male casual
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', // Female smiling
];

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get list of registered accounts in local storage
  const getRegisteredAccounts = () => {
    const saved = localStorage.getItem('ppl_registered_accounts');
    if (saved) return JSON.parse(saved);
    
    // Default demo account
    const defaultAccounts = [
      {
        name: 'UtubeMediaUser',
        email: 'push2playlive@gmail.com',
        password: 'password123',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        bio: 'Atmospheric video connoisseur and certified audio engineer.',
        isCreator: true,
      }
    ];
    localStorage.setItem('ppl_registered_accounts', JSON.stringify(defaultAccounts));
    return defaultAccounts;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    const accounts = getRegisteredAccounts();
    const found = accounts.find((acc: any) => acc.email.toLowerCase() === email.trim().toLowerCase());

    if (!found) {
      setErrorMsg('No registered account found with this email. Please Sign Up!');
      return;
    }

    if (found.password !== password) {
      setErrorMsg('Incorrect password. Please try again.');
      return;
    }

    // Success login
    onLoginSuccess({
      name: found.name,
      email: found.email,
      avatar: found.avatar,
      bio: found.bio || '',
      isCreator: found.isCreator,
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Display name, email, and password are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    const accounts = getRegisteredAccounts();
    const emailExists = accounts.some((acc: any) => acc.email.toLowerCase() === email.trim().toLowerCase());

    if (emailExists) {
      setErrorMsg('An account with this email already exists. Please log in.');
      return;
    }

    const avatarUrl = customAvatar.trim() || avatar;

    const newAccount = {
      name: name.trim(),
      email: email.trim(),
      password,
      avatar: avatarUrl,
      bio: bio.trim() || 'Welcome to my Utube Media celestial space!',
      isCreator,
    };

    // Save account
    const updated = [...accounts, newAccount];
    localStorage.setItem('ppl_registered_accounts', JSON.stringify(updated));

    // Log in immediately
    onLoginSuccess({
      name: newAccount.name,
      email: newAccount.email,
      avatar: newAccount.avatar,
      bio: newAccount.bio,
      isCreator: newAccount.isCreator,
    });
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden" id="auth-view-screen">
      {/* Decorative ambient blurred glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-gold-600/10 blur-[150px] z-0"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-red-900/10 blur-[150px] z-0"></div>

      <div className="w-full max-w-lg bg-[#0c0c0f]/90 border border-zinc-900/80 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10 space-y-6" id="auth-box">
        {/* Logo Pairings */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/20">
            <svg className="w-5 h-5 text-black fill-current translate-x-[1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white font-serif tracking-wide">
              Utube Media <span className="text-gold-400 text-xs font-semibold uppercase tracking-widest px-1.5 py-0.5 bg-gold-500/10 rounded ml-1 border border-gold-500/20">Live</span>
            </h1>
            <p className="text-[10px] text-gold-500/80 font-mono tracking-widest uppercase mt-1">CURATED ART & CINEMA LEDGER</p>
          </div>
        </div>

        {/* Toggle Pills */}
        <div className="flex bg-[#050507] p-1 rounded-xl border border-zinc-900/80 max-w-xs mx-auto">
          <button
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${isLogin ? 'bg-gold-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Log In
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isLogin ? 'bg-gold-500 text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isLogin ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-4 py-2.5 text-zinc-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Account Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-10 py-2.5 text-zinc-200 outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setEmail('push2playlive@gmail.com');
                  setPassword('password123');
                }}
                className="text-[10px] text-gold-500 hover:underline font-mono cursor-pointer"
              >
                Autofill Demo Account credentials
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-gold-500/10 text-center"
            >
              Sign In to Broadcast Feed
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-4 text-left overflow-y-auto max-h-[60vh] pr-1 scrollbar-thin">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Display Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <User className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CelestialSeeker"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-4 py-2.5 text-zinc-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-4 py-2.5 text-zinc-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Secure Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-10 py-2.5 text-zinc-200 outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1 font-mono">Short Biography (Bio)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 pt-2.5 text-zinc-500">
                    <AlignLeft className="w-3.5 h-3.5" />
                  </span>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-4 py-2 h-16 text-zinc-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Avatar Selection Picker */}
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Choose Profile Portrait</label>
                <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => { setAvatar(av); setCustomAvatar(''); }}
                      className={`relative w-11 h-11 rounded-full overflow-hidden border-2 flex-shrink-0 transition-transform hover:scale-105 cursor-pointer ${avatar === av && !customAvatar ? 'border-gold-500' : 'border-transparent opacity-60'}`}
                    >
                      <img src={av} alt="" className="w-full h-full object-cover" />
                      {avatar === av && !customAvatar && (
                        <div className="absolute inset-0 bg-gold-500/15 flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-gold-400 fill-black" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom Avatar URL alternative */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                    <Image className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="url"
                    placeholder="Or paste external avatar URL..."
                    value={customAvatar}
                    onChange={(e) => setCustomAvatar(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-gold-500/40 rounded-xl text-xs pl-9 pr-4 py-2 text-zinc-200 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Creator Mode Checkbox */}
              <label className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl cursor-pointer hover:border-gold-500/20 transition-colors">
                <input
                  type="checkbox"
                  checked={isCreator}
                  onChange={(e) => setIsCreator(e.target.checked)}
                  className="accent-gold-500 rounded"
                />
                <div className="text-left">
                  <span className="text-xs font-semibold text-zinc-300 block flex items-center gap-1">
                    Become a Verified Creator <Sparkles className="w-3 h-3 text-gold-500" />
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">Launches your Celestial Studio & custom merchandise store immediately!</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-gold-500/10 text-center"
            >
              Sign Up & Connect Node Wallet
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
