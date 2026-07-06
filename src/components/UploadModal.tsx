import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, Video as VideoIcon, Sparkles, FileVideo } from 'lucide-react';
import { Video, Creator, getColorGradeClass } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (newVideo: Omit<Video, 'id' | 'views' | 'uploadDate' | 'likes' | 'dislikes' | 'commentsCount'>) => void;
  creatorDetails: Creator;
  type: 'long' | 'short';
}

export default function UploadModal({ isOpen, onClose, onUpload, creatorDetails, type }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(type === 'short' ? '0:30' : '15:45');
  const [category, setCategory] = useState(type === 'short' ? 'Shorts' : 'Testimonies');
  const [thumbnail, setThumbnail] = useState('');
  const [subscriptionGated, setSubscriptionGated] = useState(false);
  const [adEnabled, setAdEnabled] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [colorGrade, setColorGrade] = useState('none');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setFileName(file.name);

    // Create Object URL for the local video file so it can be played directly
    const localUrl = URL.createObjectURL(file);
    setVideoFileUrl(localUrl);

    // Estimate the actual duration of the uploaded video
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.onloadedmetadata = () => {
      const minutes = Math.floor(tempVideo.duration / 60);
      const seconds = Math.floor(tempVideo.duration % 60);
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    tempVideo.src = localUrl;

    if (!title.trim()) {
      // Remove file extension for default title suggestion
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      // Capitalize/prettify title nicely
      const cleanTitle = nameWithoutExt
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      setTitle(cleanTitle);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpload({
      title: title.trim(),
      description: description.trim() || 'A majestic celestial stream of pure inspiration.',
      url: videoFileUrl || (type === 'short' ? 'heavenly_particle' : 'cloud_wisdom'), // map to dynamic interactive visualizers
      thumbnail: thumbnail.trim() || (type === 'short' ? 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400' : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'),
      duration,
      category,
      creator: creatorDetails,
      isShort: type === 'short',
      subscriptionGated,
      adEnabled,
      colorGrade
    });

    setTitle('');
    setDescription('');
    setFileName('');
    setVideoFileUrl('');
    setColorGrade('none');
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      onClose();
    }, 2000);
  };

  const categories = [
    'Testimonies',
    'Photography',
    'Engineering',
    'Music',
    'Shorts',
    'Faith Studies',
    'Tech Pod'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in" id="upload-dialog-overlay">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-2xl p-5 md:p-6 text-left space-y-4 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
          <div className="flex items-center gap-2">
            <VideoIcon className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-bold text-zinc-100 font-mono uppercase tracking-wide">
              Deploy {type === 'short' ? 'Short Play' : 'Long Play'} Stream
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Drag-and-Drop Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center space-y-2.5 transition-all duration-350 cursor-pointer ${isDragging ? 'border-red-500 bg-red-500/5' : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900/60 hover:border-zinc-600'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />
          {fileName ? (
            <div className="space-y-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileVideo className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">File Selected Successfully!</p>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5 max-w-[90%] mx-auto truncate" title={fileName}>
                  {fileName}
                </p>
                <span className="inline-block mt-2 text-[9px] font-mono bg-zinc-800 text-zinc-400 hover:text-white px-2 py-1 rounded transition-colors">
                  Click to choose a different video
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mx-auto w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-300">Click to select or drag & drop video stream</p>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">MP4, WebM up to 4K resolution (Local files supported)</p>
              </div>
            </>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Stream Title</label>
              <input
                type="text"
                placeholder="e.g. GOT GOD ☁️ Heavenly Vibe Check"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Stream Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Duration (MM:SS)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-200 font-mono outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5" id="thumbnail-upload-section">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Stream Thumbnail</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Thumbnail Preview / Dropzone */}
              <div 
                onClick={() => thumbnailInputRef.current?.click()}
                className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 flex flex-col items-center justify-center min-h-[110px] cursor-pointer hover:bg-zinc-900/40 hover:border-zinc-700 transition-all text-center relative overflow-hidden group"
                id="thumbnail-upload-zone"
              >
                <input
                  type="file"
                  ref={thumbnailInputRef}
                  onChange={handleThumbnailFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {thumbnail ? (
                  <>
                    <img 
                      src={thumbnail} 
                      alt="Thumbnail Preview" 
                      className={`absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity ${getColorGradeClass(colorGrade)}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="relative z-10 bg-black/80 px-2.5 py-1 rounded text-[9px] font-mono text-zinc-350 border border-zinc-800">
                      Click to Replace Thumbnail
                    </div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="mx-auto text-zinc-500 group-hover:text-gold-400 transition-colors">
                      <Upload className="w-4 h-4 mx-auto" />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400 block">Upload Thumbnail Image</span>
                    <span className="text-[9px] text-zinc-600 block">Click or select a local file (PNG, JPG)</span>
                  </div>
                )}
              </div>

              {/* Thumbnail URL Input & Manual override */}
              <div className="flex flex-col justify-between p-3.5 bg-zinc-950 border border-zinc-850 rounded-xl gap-2">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wide">Or paste custom image URL:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={thumbnail.startsWith('data:') ? '' : thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg text-xs px-2.5 py-1.5 text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-zinc-700"
                  />
                </div>
                {thumbnail && (
                  <button
                    type="button"
                    onClick={() => setThumbnail('')}
                    className="text-left text-[9px] font-mono text-red-500 hover:text-red-400 transition-colors self-start mt-1 flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Color Grade Filter Selector */}
          <div className="space-y-2 bg-zinc-950 p-3.5 rounded-xl border border-zinc-850" id="color-grade-filtering-section">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Color Grade Adjustment
              </label>
              <span className="text-[9px] text-zinc-500 font-mono">
                Applied to video and thumbnail
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[
                { id: 'none', name: 'Normal', icon: '✨' },
                { id: 'grayscale', name: 'Noir', icon: '⚫' },
                { id: 'sepia', name: 'Sepia', icon: '🟤' },
                { id: 'contrast', name: 'Dramatic', icon: '🌗' },
                { id: 'vintage', name: 'Vintage', icon: '🎞️' },
                { id: 'warm', name: 'Amber', icon: '🌅' },
                { id: 'cool', name: 'Cyber', icon: '❄️' },
              ].map((opt) => {
                const isActive = colorGrade === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setColorGrade(opt.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-500/15 border-red-500/50 text-red-400 font-bold'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-750'
                    }`}
                  >
                    <span className="text-sm mb-0.5">{opt.icon}</span>
                    <span className="text-[9px] font-mono truncate w-full">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 font-mono">Short Stream Description</label>
            <textarea
              placeholder="What spiritual revelations, stories, or metrics are you sharing today?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs px-3 py-2 text-zinc-200 outline-none resize-none h-16"
            />
          </div>

          {/* Gates and Revenue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={subscriptionGated}
                onChange={(e) => setSubscriptionGated(e.checked || e.target.checked)}
                className="accent-red-600 rounded"
              />
              <div className="text-left">
                <span className="text-xs font-semibold text-zinc-300 block">Subscription Gate</span>
                <span className="text-[9px] text-zinc-500 font-mono block">Requires Channel Membership</span>
              </div>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={adEnabled}
                onChange={(e) => setAdEnabled(e.checked || e.target.checked)}
                className="accent-red-600 rounded"
              />
              <div className="text-left">
                <span className="text-xs font-semibold text-zinc-300 block">Monetize Splits</span>
                <span className="text-[9px] text-zinc-500 font-mono block">60% CPM revenue on clicks</span>
              </div>
            </label>
          </div>

          {uploadSuccess && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-medium flex items-center gap-1.5 animate-bounce">
              <CheckCircle className="w-3.5 h-3.5" /> Video stream published successfully onto Utube Media Live index!
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Publish to Creator Ledger
          </button>
        </form>
      </div>
    </div>
  );
}
