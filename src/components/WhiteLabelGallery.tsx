import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Sliders, Layout, Grid, Maximize2, Copy, Check, 
  Plus, Trash2, Edit2, Play, Eye, Compass, Image, Move, RefreshCw, Layers, ExternalLink
} from 'lucide-react';

interface SpaceSaverItem {
  id: string;
  title: string;
  category: string;
  views: string;
  time: string;
  duration: string;
  badge?: string;
  accentColor?: string;
}

const INITIAL_SPACE_SAVERS: SpaceSaverItem[] = [
  { id: 'ss-1', title: 'Acoustic Serenade study session', category: 'Music', views: '230K views', time: '2 days ago', duration: '12:04', badge: 'LIVE', accentColor: 'from-[#D97706] to-[#F59E0B]' },
  { id: 'ss-2', title: 'Enduro Mountain Descent raw cut', category: 'Enduro', views: '1.2M views', time: '1 week ago', duration: '4:20', accentColor: 'from-[#2563EB] to-[#3B82F6]' },
  { id: 'ss-3', title: 'Good Intercessions - Cinematic Harps', category: 'Harps', views: '45K views', time: '5 hours ago', duration: '45:00', accentColor: 'from-[#10B981] to-[#34D399]' },
  { id: 'ss-4', title: 'Consciousness & Psychology lecture series', category: 'Psychology', views: '89K views', time: '3 weeks ago', duration: '28:15', accentColor: 'from-[#8B5CF6] to-[#A78BFA]' },
  { id: 'ss-5', title: 'Kickboxing warm-up drills masterclass', category: 'Kickboxing', views: '14K views', time: 'Just now', duration: '09:45', badge: 'NEW', accentColor: 'from-[#EF4444] to-[#F87171]' },
  { id: 'ss-6', title: 'Atmospheric study logs ambient mix', category: 'Mixes', views: '512K views', time: '1 month ago', duration: '1:30:00', accentColor: 'from-[#EC4899] to-[#F472B6]' }
];

export default function WhiteLabelGallery() {
  // Gallery Configuration State
  const [galleryTitle, setGalleryTitle] = useState<string>(() => {
    return localStorage.getItem('wl_gallery_title') || 'Exquisite Media Collection';
  });
  const [gallerySubtitle, setGallerySubtitle] = useState<string>(() => {
    return localStorage.getItem('wl_gallery_subtitle') || 'A clean, customizable white-label preview grid for high-fidelity content prototyping.';
  });
  const [accentTheme, setAccentTheme] = useState<'gold' | 'cyber' | 'emerald' | 'ruby' | 'silver'>(() => {
    return (localStorage.getItem('wl_gallery_accent') as any) || 'gold';
  });
  const [columns, setColumns] = useState<number>(3);
  const [aspectRatio, setAspectRatio] = useState<'16-9' | '9-16' | '1-1' | '4-3'>('16-9');
  const [borderRadiusStyle, setBorderRadiusStyle] = useState<'square' | 'rounded' | 'extra' | 'organic'>('extra');
  const [spacing, setSpacing] = useState<'compact' | 'balanced' | 'spacious'>('balanced');
  const [skeletonStyle, setSkeletonStyle] = useState<'pulse' | 'shimmer' | 'dark-frost'>('shimmer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Space Saver Cards State
  const [items, setItems] = useState<SpaceSaverItem[]>(() => {
    const saved = localStorage.getItem('wl_gallery_items');
    return saved ? JSON.parse(saved) : INITIAL_SPACE_SAVERS;
  });

  // Editing single item title modal/form states
  const [editingItem, setEditingItem] = useState<SpaceSaverItem | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingCategory, setEditingCategory] = useState<string>('');

  // Save states to localstorage
  useEffect(() => {
    localStorage.setItem('wl_gallery_title', galleryTitle);
    localStorage.setItem('wl_gallery_subtitle', gallerySubtitle);
    localStorage.setItem('wl_gallery_accent', accentTheme);
    localStorage.setItem('wl_gallery_items', JSON.stringify(items));
  }, [galleryTitle, gallerySubtitle, accentTheme, items]);

  const handleCopyLink = () => {
    const directUrl = `${window.location.origin}${window.location.pathname}?view=gallery`;
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenNewPage = () => {
    const directUrl = `${window.location.origin}${window.location.pathname}?view=gallery`;
    window.open(directUrl, '_blank');
  };

  const triggerMockReload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setItems(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          title: editingTitle,
          category: editingCategory
        };
      }
      return item;
    }));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNewItem = () => {
    const gradients = [
      'from-yellow-600 to-amber-500',
      'from-cyan-600 to-blue-500',
      'from-emerald-600 to-green-400',
      'from-rose-600 to-red-500',
      'from-purple-600 to-indigo-500',
      'from-pink-600 to-fuchsia-500'
    ];
    const randomGrad = gradients[Math.floor(Math.random() * gradients.length)];
    const newItem: SpaceSaverItem = {
      id: `ss-${Date.now()}`,
      title: 'New Space Saver Item Title',
      category: 'General',
      views: '0 views',
      time: 'Just now',
      duration: '10:00',
      accentColor: randomGrad
    };
    setItems(prev => [...prev, newItem]);
  };

  // Color mappings
  const getAccentClass = () => {
    switch (accentTheme) {
      case 'gold': return 'from-amber-400 to-yellow-600 text-yellow-400 border-yellow-500/20';
      case 'cyber': return 'from-cyan-400 to-blue-600 text-cyan-400 border-cyan-500/20';
      case 'emerald': return 'from-emerald-400 to-teal-600 text-emerald-400 border-emerald-500/20';
      case 'ruby': return 'from-rose-400 to-red-600 text-rose-400 border-rose-500/20';
      case 'silver': return 'from-zinc-300 to-zinc-500 text-zinc-300 border-zinc-500/20';
    }
  };

  const getThemeHex = () => {
    switch (accentTheme) {
      case 'gold': return '#EAB308';
      case 'cyber': return '#06B6D4';
      case 'emerald': return '#10B981';
      case 'ruby': return '#EF4444';
      case 'silver': return '#9CA3AF';
    }
  };

  const getBorderRadiusClass = () => {
    switch (borderRadiusStyle) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-lg';
      case 'extra': return 'rounded-2xl';
      case 'organic': return 'rounded-[2rem] rounded-tr-[1rem] rounded-bl-[1.5rem]';
    }
  };

  const getSpacingClass = () => {
    switch (spacing) {
      case 'compact': return 'gap-3 p-3';
      case 'balanced': return 'gap-6 p-6';
      case 'spacious': return 'gap-10 p-10';
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16-9': return 'aspect-video';
      case '9-16': return 'aspect-[9/16]';
      case '1-1': return 'aspect-square';
      case '4-3': return 'aspect-[4/3]';
    }
  };

  // Check if we are in clean standalone mode (querystring view=gallery)
  const isQueryStandalone = new URLSearchParams(window.location.search).get('view') === 'gallery';

  return (
    <div className="min-h-screen bg-[#050507] text-zinc-100 flex flex-col font-sans select-none overflow-x-hidden pb-12" id="white-label-gallery-root">
      
      {/* Top Header Control Ribbon (Hidden if query is standalone unless hovered, to protect pure white-labeling) */}
      {!isQueryStandalone ? (
        <div className="bg-[#0b0b0f] border-b border-zinc-900/80 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-gold-500 shadow-inner">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                White Label Engine <span className="text-[10px] bg-gold-500/10 text-gold-400 border border-gold-500/20 px-1.5 py-0.5 rounded font-mono">v1.2</span>
              </h1>
              <p className="text-[11px] text-zinc-500">Live grid configuration and layout space saver tool.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAddNewItem}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer"
              id="add-space-saver-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Placeholder
            </button>
            <button
              onClick={triggerMockReload}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer"
              id="trigger-shimmer-reload-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Simulate Load
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-all cursor-pointer"
              id="copy-standalone-link-btn"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied' : 'Copy Share Link'}
            </button>
            <button
              onClick={handleOpenNewPage}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-black shadow-lg shadow-gold-500/10 transition-all cursor-pointer font-bold"
              id="open-standalone-page-btn"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Standalone View
            </button>
          </div>
        </div>
      ) : (
        /* Standalone back to main app button */
        <div className="bg-[#050507]/90 backdrop-blur px-6 py-2 border-b border-zinc-900 flex items-center justify-between">
          <div className="text-[10px] font-mono text-zinc-500">Standalone Branded Window Mode</div>
          <button
            onClick={() => window.location.href = window.location.pathname}
            className="flex items-center gap-1.5 px-3 py-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 font-medium transition-all"
          >
            ← Exit Standalone Mode
          </button>
        </div>
      )}

      {/* Main Container Layout split into Configurator sidebar & Media Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* SIDE PANEL: CONFIGURATOR (Hidden in Standalone View) */}
        {!isQueryStandalone && (
          <div className="w-full lg:w-80 bg-[#07070a] border-b lg:border-b-0 lg:border-r border-zinc-900/80 p-6 space-y-6 flex-shrink-0" id="wl-configurator-sidebar">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gold-500">
                <Sliders className="w-4 h-4" />
                <h2 className="text-xs font-bold uppercase tracking-widest font-mono">Branding Engine</h2>
              </div>
              
              {/* Branded Title inputs */}
              <div className="space-y-3 bg-zinc-950/80 p-4 rounded-xl border border-zinc-900/60">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Gallery Title</label>
                  <input
                    type="text"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    placeholder="Enter dynamic title..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Subtitle Description</label>
                  <textarea
                    rows={2}
                    value={gallerySubtitle}
                    onChange={(e) => setGallerySubtitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50 resize-none"
                    placeholder="Enter subtitle info..."
                  />
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Core Accent Palette</label>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase">{accentTheme}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(['gold', 'cyber', 'emerald', 'ruby', 'silver'] as const).map((theme) => {
                    const themeColors = {
                      gold: 'bg-yellow-500 ring-yellow-400',
                      cyber: 'bg-cyan-500 ring-cyan-400',
                      emerald: 'bg-emerald-500 ring-emerald-400',
                      ruby: 'bg-red-500 ring-red-400',
                      silver: 'bg-zinc-400 ring-zinc-300'
                    };
                    const isActive = accentTheme === theme;
                    return (
                      <button
                        key={theme}
                        onClick={() => setAccentTheme(theme)}
                        className={`h-8 rounded-lg cursor-pointer transition-all ${themeColors[theme]} ${
                          isActive ? 'ring-2 ring-offset-2 ring-offset-[#07070a] scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={`Select ${theme} accent`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Spacing & Layout controls */}
              <div className="space-y-3 bg-zinc-950/80 p-4 rounded-xl border border-zinc-900/60">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Columns Layout</label>
                  <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-850">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => setColumns(num)}
                        className={`py-1 text-xs rounded-md font-mono font-bold transition-all ${
                          columns === num ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Aspect Ratio Spacer</label>
                  <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-850">
                    {(['16-9', '9-16', '1-1', '4-3'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-1 text-[10px] rounded-md font-mono font-bold transition-all ${
                          aspectRatio === ratio ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Border Corner Radius</label>
                  <div className="grid grid-cols-4 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-850">
                    {(['square', 'rounded', 'extra', 'organic'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setBorderRadiusStyle(style)}
                        className={`py-1 text-[9px] rounded-md font-bold uppercase transition-all ${
                          borderRadiusStyle === style ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Grid Padding & Gap</label>
                  <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-850">
                    {(['compact', 'balanced', 'spacious'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setSpacing(style)}
                        className={`py-1 text-[9px] rounded-md font-bold uppercase transition-all ${
                          spacing === style ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shimmer Placeholder styles */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Placeholder Shimmer Style</label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                  {(['pulse', 'shimmer', 'dark-frost'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setSkeletonStyle(style)}
                      className={`py-1.5 text-[9px] rounded-md font-semibold uppercase transition-all ${
                        skeletonStyle === style ? 'bg-zinc-900 text-white border border-zinc-850' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Informational Tip */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 space-y-2 text-zinc-500">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">🌟 Craft Tip</span>
              <p className="text-[10px] leading-relaxed">
                Click <span className="text-zinc-300">directly on any item card's title</span> in the gallery to customize its custom title and metadata live. Perfect for zero-asset wireframing!
              </p>
            </div>
          </div>
        )}

        {/* CENTER SHELF: ACTUAL MEDIA CANVAS GALLERY VIEW */}
        <div className="flex-1 bg-[#050507] overflow-y-auto p-6 md:p-8 lg:p-12 space-y-10">
          
          {/* Header Billboard Section */}
          <div className="max-w-5xl mx-auto space-y-3 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className={`w-2.5 h-2.5 rounded-full animate-ping`} style={{ backgroundColor: getThemeHex() }}></span>
              <span className="text-[10px] font-bold uppercase tracking-widest font-mono text-zinc-500">Live Custom Workspace</span>
            </div>
            
            {/* Dynamic Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans" id="dynamic-gallery-title">
              {galleryTitle || 'Dynamic Preview Gallery'}
            </h1>
            
            {/* Dynamic Subtitle */}
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed font-sans" id="dynamic-gallery-subtitle">
              {gallerySubtitle || 'Placeholders for visual content mapping'}
            </p>
          </div>

          {/* SKELETON LOADERS / SPACE SAVER GRID */}
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} ${getSpacingClass()}`} id="gallery-skeletons-loading">
                {Array.from({ length: items.length || 6 }).map((_, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className={`w-full bg-zinc-900/60 animate-pulse ${getAspectRatioClass()} ${getBorderRadiusClass()} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                    </div>
                    <div className="h-4 w-3/4 bg-zinc-900 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-zinc-900 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              /* Empty state */
              <div className="text-center py-24 bg-zinc-950 rounded-2xl border border-dashed border-zinc-900 max-w-lg mx-auto space-y-4">
                <Image className="w-12 h-12 text-zinc-700 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-zinc-300">No Space Savers Remaining</h3>
                  <p className="text-xs text-zinc-500 mt-1">Add items or reset defaults using the configuration deck.</p>
                </div>
                <button
                  onClick={() => setItems(INITIAL_SPACE_SAVERS)}
                  className="px-4 py-1.5 text-xs bg-zinc-900 text-zinc-300 rounded-lg hover:bg-zinc-800 transition-all border border-zinc-800"
                >
                  Reset Defaults
                </button>
              </div>
            ) : (
              /* Render dynamic item cards grid */
              <div 
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} ${getSpacingClass()}`}
                id="gallery-items-grid"
              >
                {items.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                    className="group relative flex flex-col justify-between space-y-3 cursor-pointer"
                    onClick={() => {
                      setEditingItem(item);
                      setEditingTitle(item.title);
                      setEditingCategory(item.category);
                    }}
                  >
                    {/* Floating Delete button */}
                    {!isQueryStandalone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/80 hover:bg-red-600/90 text-zinc-400 hover:text-white border border-zinc-800/80 opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Delete Space Saver"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Image Placeholder Block / Aspect ratio spacer */}
                    <div 
                      className={`relative w-full overflow-hidden bg-[#0a0a0c] border border-zinc-900/60 transition-all group-hover:border-zinc-800 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] ${getBorderRadiusClass()}`}
                    >
                      {/* Interactive shimmer waves */}
                      {skeletonStyle === 'shimmer' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                      )}

                      {/* Content block representing media space saver */}
                      <div className={`w-full h-full ${getAspectRatioClass()} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
                        
                        {/* Background subtle neon visual element */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.accentColor || 'from-[#D97706] to-[#F59E0B]'} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300`} />
                        
                        {/* Small decorative grid overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

                        {/* Centered abstract camera or media icon */}
                        <div className="p-3.5 rounded-full bg-zinc-900/80 border border-zinc-850 text-zinc-500 group-hover:text-zinc-200 group-hover:scale-115 transition-all shadow-xl z-10">
                          <Image className="w-5 h-5" />
                        </div>

                        {/* Optional pulsing category tag */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-950/90 border border-zinc-850/80 text-[9px] font-mono tracking-wider font-bold text-zinc-400">
                          {item.badge ? (
                            <>
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                              <span className="text-red-400 font-bold">{item.badge}</span>
                            </>
                          ) : (
                            <span>{item.category}</span>
                          )}
                        </div>

                        {/* Video Duration / Size space saver */}
                        <div className="absolute bottom-3 right-3 px-1.5 py-0.5 bg-black/80 rounded font-mono text-[9px] font-bold text-zinc-300">
                          {item.duration}
                        </div>

                        {/* Real-time aspect ratio indicator overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 z-10">
                          <Maximize2 className="w-5 h-5" style={{ color: getThemeHex() }} />
                          <span className="text-[10px] font-mono tracking-widest font-semibold uppercase">Edit Layout Spec</span>
                          <span className="text-[9px] text-zinc-500 font-mono">ID: {item.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata below thumbnail representation */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white leading-tight font-sans line-clamp-2 transition-colors">
                          {item.title}
                        </h3>
                        {!isQueryStandalone && (
                          <div className="p-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit2 className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                        <span className="hover:text-zinc-300">{item.category}</span>
                        <span className="text-[9px]">•</span>
                        <span>{item.views}</span>
                        <span className="text-[9px]">•</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* EDIT MODAL / TITLE OVERLAY CONFIGURATOR */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0f] border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl z-10"
            >
              <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Configure Placeholder</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">ID: {editingItem.id}</p>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-lg bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-850"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Item Title (titm title)</label>
                  <input
                    type="text"
                    required
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    placeholder="Enter item title..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">Category Tag</label>
                  <input
                    type="text"
                    required
                    value={editingCategory}
                    onChange={(e) => setEditingCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500/50"
                    placeholder="Enter category tag..."
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteItem(editingItem.id);
                      setEditingItem(null);
                    }}
                    className="px-4 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    Delete Item
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-gold-500 to-amber-600 text-black rounded-lg transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
