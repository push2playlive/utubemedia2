import React, { useState } from 'react';
import { User, Mail, Lock, CheckCircle, ShieldAlert, Sparkles, Image, AlignLeft, AlertCircle, Eye, EyeOff, Wallet, ArrowRight, ShieldCheck, Key, Shield } from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: { 
    name: string; 
    email: string; 
    avatar: string; 
    bio?: string; 
    isCreator: boolean; 
    role: 'member' | 'moderator' | 'admin' | 'advertising';
  }) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // Female chic
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', // Male elegant
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', // Female professional
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', // Male casual
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', // Female smiling
];

export default function AuthView({ onLoginSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [authPathway, setAuthPathway] = useState<'credentials' | 'magic_link' | 'web3'>('credentials');
  
  // Role selector (4 hardcoded tiers)
  const [selectedRole, setSelectedRole] = useState<'member' | 'moderator' | 'admin' | 'advertising'>('member');

  // Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatar, setCustomAvatar] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Magic Link State
  const [magicEmail, setMagicEmail] = useState('');
  const [magicStep, setMagicStep] = useState<'request' | 'verify'>('request');
  const [magicCode, setMagicCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('NEXUS-777');

  // Web3 Wallet State
  const [web3Wallet, setWeb3Wallet] = useState<'metamask' | 'walletconnect' | 'phantom' | null>(null);
  const [web3Step, setWeb3Step] = useState<'select' | 'sign' | 'complete'>('select');
  const [simulatedAddress, setSimulatedAddress] = useState('');
  const [signingMessage, setSigningMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  // Error/Success Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Credentials flow
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/commandnexus/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, method: 'credentials' })
      });
      const resData = await response.json();
      
      if (resData.success) {
        onLoginSuccess({
          name: email.split('@')[0],
          email: email.trim(),
          avatar: avatar,
          bio: bio || 'Welcome to my Push2Play celestial workspace!',
          isCreator: true,
          role: selectedRole
        });
      }
    } catch (err) {
      setErrorMsg('SSO Node Authenticator currently busy. Please retry.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Display name, email, and password are required.');
      return;
    }

    const avatarUrl = customAvatar.trim() || avatar;

    onLoginSuccess({
      name: name.trim(),
      email: email.trim(),
      avatar: avatarUrl,
      bio: bio.trim() || 'CommandNexus ecosystem workspace',
      isCreator,
      role: selectedRole
    });
  };

  // Handle Magic Link requests
  const handleRequestMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!magicEmail.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }

    setMagicStep('verify');
    setSuccessMsg('Magic link sent successfully. Verification token: NEXUS-777');
  };

  const handleVerifyMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (magicCode.trim() !== 'NEXUS-777' && magicCode.trim() !== '777') {
      setErrorMsg('Invalid verification token. Please use NEXUS-777.');
      return;
    }

    try {
      const response = await fetch('/api/commandnexus/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: magicEmail, method: 'magic_link', emailCode: magicCode })
      });
      const resData = await response.json();
      if (resData.success) {
        onLoginSuccess({
          name: resData.user.name,
          email: resData.user.email,
          avatar: resData.user.avatar,
          bio: resData.user.bio,
          isCreator: true,
          role: 'moderator' // Magic Link accounts get Moderator tier by default
        });
      }
    } catch (err) {
      setErrorMsg('Auth matrix timeout. Please try again.');
    }
  };

  // Handle Web3 Cryptographic Wallet Sign-In
  const handleSelectWeb3Wallet = (walletType: 'metamask' | 'walletconnect' | 'phantom') => {
    setWeb3Wallet(walletType);
    
    // Generate a random high-fidelity web3 address
    let address = '';
    if (walletType === 'phantom') {
      address = 'SolPhantom' + Array.from({length: 34}, () => Math.floor(Math.random()*16).toString(16)).join('');
    } else {
      address = '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    }
    
    setSimulatedAddress(address);
    setSigningMessage(`CommandNexus Authentication Sign Challenge:\n\nApplication: Utube Media (P2P Studio)\nTimestamp: ${Date.now()}\nNonce: ${Math.floor(Math.random()*1000000)}\nWallet: ${address}\n\nI agree to authenticate onto the CommandNexus secure matrix with zero gas fees.`);
    setWeb3Step('sign');
  };

  const handleSignWeb3Challenge = () => {
    setIsSigning(true);
    setErrorMsg('');

    setTimeout(async () => {
      try {
        const response = await fetch('/api/commandnexus/sso', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: simulatedAddress, method: 'web3' })
        });
        const resData = await response.json();
        setIsSigning(false);

        if (resData.success) {
          onLoginSuccess({
            name: resData.user.name,
            email: resData.user.email,
            avatar: resData.user.avatar,
            bio: `Web3 Cryptographic Participant connected via ${web3Wallet}`,
            isCreator: true,
            role: 'advertising' // Web3 accounts get Ad merchant role by default
          });
        }
      } catch (err) {
        setIsSigning(false);
        setErrorMsg('Cryptographic signature verification timed out.');
      }
    }, 1500); // 1.5s simulated signature loading
  };

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden" id="auth-view-screen">
      {/* Decorative CommandNexus styled translucent orange / grey blurred gradients */}
      <div className="absolute top-[-25%] left-[-25%] w-[70%] h-[70%] rounded-full bg-[#ea580c]/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-25%] w-[70%] h-[70%] rounded-full bg-zinc-600/10 blur-[160px] pointer-events-none" />

      <div className="w-full max-w-lg bg-[#0c0c0f]/90 border border-[#ea580c]/25 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(234,88,12,0.1)] relative z-10 space-y-6" id="auth-box">
        {/* Brand logo in CommandNexus Theme */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto flex items-center justify-center w-16 h-16 rounded-full border border-[#ea580c]/30 bg-[#07070a] shadow-inner shadow-[#ea580c]/10">
            <div className="absolute inset-1.5 rounded-full border border-zinc-700/40 bg-zinc-950 flex items-center justify-center shadow-md">
              <div className="absolute inset-1.5 rounded-full border border-[#ea580c]/30 bg-zinc-900 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#ea580c] to-amber-700 shadow-lg shadow-[#ea580c]/25">
                  <svg className="w-4 h-4 text-white fill-current translate-x-[1px]" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-zinc-100 font-serif tracking-wide">
              Push2Play <span className="text-[#ea580c] text-xs font-semibold uppercase tracking-widest px-1.5 py-0.5 bg-[#ea580c]/10 rounded ml-1 border border-[#ea580c]/20">Studio</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase mt-1">
              COMMANDNEXUS SECURE SSO MATRICES
            </p>
          </div>
        </div>

        {/* Pathway Pills (Credentials vs Magic Link vs Web3) */}
        <div className="flex flex-wrap bg-[#050507] p-1 rounded-xl border border-zinc-900/80 gap-1" id="sso-pathways-picker">
          <button
            onClick={() => { setAuthPathway('credentials'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${authPathway === 'credentials' ? 'bg-[#ea580c] text-black shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Credentials
          </button>
          <button
            onClick={() => { setAuthPathway('magic_link'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${authPathway === 'magic_link' ? 'bg-[#ea580c] text-black shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Magic Link
          </button>
          <button
            onClick={() => { setAuthPathway('web3'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${authPathway === 'web3' ? 'bg-[#ea580c] text-black shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Web3 Wallet
          </button>
        </div>

        {/* Error / Success Notifications */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/40 text-red-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PATHWAY 1: CREDENTIALS */}
        {authPathway === 'credentials' && (
          <div className="space-y-4">
            {/* Login vs Signup Pill */}
            <div className="flex bg-zinc-950/90 p-0.5 rounded-lg border border-zinc-900 max-w-[200px] mx-auto">
              <button
                onClick={() => { setIsLogin(true); setErrorMsg(''); }}
                className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all cursor-pointer ${isLogin ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-600'}`}
              >
                Log In
              </button>
              <button
                onClick={() => { setIsLogin(false); setErrorMsg(''); }}
                className={`flex-1 py-1 text-[10px] uppercase font-bold rounded transition-all cursor-pointer ${!isLogin ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-600'}`}
              >
                Sign Up
              </button>
            </div>

            {/* Core Role Tester Selector (Choose between 4 hardcoded role tiers) */}
            <div className="bg-[#050507] p-3 rounded-xl border border-zinc-900 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Choose Your Matrix Role Tier</span>
                </label>
                <span className="text-[8px] font-mono text-zinc-600">TEST ENGINE ACTIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSelectedRole('member')}
                  className={`py-1.5 px-2 rounded-lg border font-mono transition-all text-left flex flex-col justify-between ${selectedRole === 'member' ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/40' : 'bg-zinc-950 text-zinc-400 border-zinc-900'}`}
                >
                  <span className="font-bold">1. Member</span>
                  <span className="text-[8px] text-zinc-500 font-sans mt-0.5">Read, Profile, Color Toggles</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('moderator')}
                  className={`py-1.5 px-2 rounded-lg border font-mono transition-all text-left flex flex-col justify-between ${selectedRole === 'moderator' ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/40' : 'bg-zinc-950 text-zinc-400 border-zinc-900'}`}
                >
                  <span className="font-bold">2. Moderator</span>
                  <span className="text-[8px] text-zinc-500 font-sans mt-0.5">Mute Flags & Report Queue</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`py-1.5 px-2 rounded-lg border font-mono transition-all text-left flex flex-col justify-between ${selectedRole === 'admin' ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/40' : 'bg-zinc-950 text-zinc-400 border-zinc-900'}`}
                >
                  <span className="font-bold">3. Admin</span>
                  <span className="text-[8px] text-zinc-500 font-sans mt-0.5">Universal Override Control</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('advertising')}
                  className={`py-1.5 px-2 rounded-lg border font-mono transition-all text-left flex flex-col justify-between ${selectedRole === 'advertising' ? 'bg-[#ea580c]/10 text-[#ea580c] border-[#ea580c]/40' : 'bg-zinc-950 text-zinc-400 border-zinc-900'}`}
                >
                  <span className="font-bold">4. Merchant / Ad</span>
                  <span className="text-[8px] text-zinc-500 font-sans mt-0.5">Manage Ad Wallet & Analytics</span>
                </button>
              </div>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Email Credentials</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="e.g., developer@commandnexus.net"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs pl-9 pr-4 py-2.5 text-zinc-200 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Password</label>
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
                      className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs pl-9 pr-10 py-2.5 text-zinc-200 outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-350"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('connoisseur@commandnexus.net');
                      setPassword('password123');
                    }}
                    className="text-[9px] text-[#ea580c] hover:underline font-mono"
                  >
                    Load Tester credentials
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black font-black rounded-xl text-xs transition-all tracking-wider uppercase"
                >
                  Sign In to Secure Node
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4 text-left overflow-y-auto max-h-[45vh] pr-1">
                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Profile Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CinemaMaster"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs px-3.5 py-2.5 text-zinc-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs px-3.5 py-2.5 text-zinc-200 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Secure Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs px-3.5 py-2.5 text-zinc-200 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Biography</label>
                  <textarea
                    placeholder="Atmosphere and high fidelity audio enthusiast..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs p-3.5 h-16 text-zinc-200 outline-none transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Choose Node Portrait</label>
                  <div className="flex gap-2 py-1 overflow-x-auto">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        type="button"
                        key={av}
                        onClick={() => { setAvatar(av); setCustomAvatar(''); }}
                        className={`relative w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all ${avatar === av && !customAvatar ? 'border-[#ea580c]' : 'border-transparent opacity-60'}`}
                      >
                        <img src={av} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl cursor-pointer hover:border-[#ea580c]/20 transition-colors">
                  <input
                    type="checkbox"
                    checked={isCreator}
                    onChange={(e) => setIsCreator(e.target.checked)}
                    className="accent-[#ea580c] rounded text-black"
                  />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-zinc-300 block flex items-center gap-1">
                      Request Creator Certification <Sparkles className="w-3 h-3 text-[#ea580c]" />
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono block">Enables publishing long/short play clips on secure nodes.</span>
                  </div>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black font-black rounded-xl text-xs transition-all uppercase tracking-wider"
                >
                  Generate SSO Identity Card
                </button>
              </form>
            )}
          </div>
        )}

        {/* PATHWAY 2: MAGIC LINK */}
        {authPathway === 'magic_link' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            {magicStep === 'request' ? (
              <form onSubmit={handleRequestMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Enter your email to receive a secure, cryptographic authentication token instantly. We will simulate token delivery to bypass mail filters.
                  </p>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Magic Link Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="e.g. researcher@commandnexus.net"
                        value={magicEmail}
                        onChange={(e) => setMagicEmail(e.target.value)}
                        className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs pl-9 pr-4 py-2.5 text-zinc-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black font-black rounded-xl text-xs transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Request Magic Pass token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyMagicLink} className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-[#ea580c]/10 border border-[#ea580c]/30 rounded-xl p-3 flex items-start gap-2.5">
                    <Key className="w-4.5 h-4.5 text-[#ea580c] mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-zinc-200">Simulated Magic token received!</h5>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                        To sign in as <strong className="text-zinc-200">{magicEmail}</strong> with <strong className="text-[#ea580c]">Moderator privileges</strong>, enter the token <code className="bg-zinc-950 px-1 py-0.5 rounded text-white border border-zinc-800">NEXUS-777</code> below.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 font-mono">Verification Token</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter NEXUS-777"
                      value={magicCode}
                      onChange={(e) => setMagicCode(e.target.value)}
                      className="w-full bg-zinc-950/60 border border-zinc-900 focus:border-[#ea580c]/40 rounded-xl text-xs px-3.5 py-2.5 text-zinc-200 outline-none transition-all font-mono uppercase tracking-widest text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMagicStep('request')}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs border border-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1.5 py-2.5 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black font-black rounded-xl text-xs uppercase tracking-wider"
                  >
                    Authenticate Link
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PATHWAY 3: WEB3 CRYTOGRAPHIC WALLET */}
        {authPathway === 'web3' && (
          <div className="space-y-4 animate-in fade-in duration-200 text-left">
            {web3Step === 'select' && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sign in instantly by signing a cryptographic message with your Web3 wallet. This logs you in as an <strong className="text-[#ea580c]">Ad merchant & coin packages administrator</strong>.
                </p>
                <div className="grid grid-cols-1 gap-2.5" id="web3-wallets-list">
                  <button
                    onClick={() => handleSelectWeb3Wallet('metamask')}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🦊</span>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">MetaMask Wallet</h5>
                        <p className="text-[9px] text-zinc-500">Connect via secure ethereum RPC gateway</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ea580c] transition-colors" />
                  </button>

                  <button
                    onClick={() => handleSelectWeb3Wallet('walletconnect')}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🔗</span>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">WalletConnect Network</h5>
                        <p className="text-[9px] text-zinc-500">Scan QR or deep-link to Web3 browser wallets</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ea580c] transition-colors" />
                  </button>

                  <button
                    onClick={() => handleSelectWeb3Wallet('phantom')}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-950/60 hover:border-[#ea580c]/40 hover:bg-[#ea580c]/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👻</span>
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200">Solana Phantom / Ledger</h5>
                        <p className="text-[9px] text-zinc-500">Connect using high-performance solana cluster</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#ea580c] transition-colors" />
                  </button>
                </div>
              </div>
            )}

            {web3Step === 'sign' && (
              <div className="space-y-4">
                <div className="bg-[#ea580c]/5 border border-[#ea580c]/20 rounded-xl p-3 space-y-1">
                  <span className="text-[8px] font-mono text-[#ea580c] uppercase font-bold tracking-widest block">Wallet address detected</span>
                  <p className="text-xs font-mono text-zinc-300 break-all">{simulatedAddress}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Sign Challenge Message</label>
                  <pre className="p-3 bg-black border border-zinc-900 rounded-xl text-[9px] font-mono text-zinc-400 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                    {signingMessage}
                  </pre>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setWeb3Step('select')}
                    disabled={isSigning}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl text-xs border border-zinc-800 transition-colors disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                  <button
                    onClick={handleSignWeb3Challenge}
                    disabled={isSigning}
                    className="flex-1.5 py-2.5 bg-[#ea580c] hover:bg-[#ea580c]/90 text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-80"
                  >
                    {isSigning ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                        <span>Signing challenge...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Sign Cryptographic message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer secure node info */}
        <div className="p-4 bg-[#050507] border border-zinc-900/60 rounded-2xl flex items-center justify-between text-left">
          <div>
            <span className="text-[9px] font-bold text-zinc-400 block font-serif">CommandNexus Gateway</span>
            <span className="text-[8px] text-zinc-600 font-mono">ENCRYPTED THROUGHPUT PORT 3000</span>
          </div>
          <span className="text-[8px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            ● SECURE TUNNEL
          </span>
        </div>
      </div>
    </div>
  );
}
