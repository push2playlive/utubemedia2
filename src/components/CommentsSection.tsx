import React, { useState, useRef } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Heart, 
  CornerDownRight, 
  ListFilter, 
  X, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { Comment, CommentReply } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onDislikeComment: (commentId: string) => void;
  onHeartComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onEditComment?: (commentId: string, text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUser: { name: string; avatar: string };
  creatorId: string;
}

export default function CommentsSection({
  comments,
  onAddComment,
  onAddReply,
  onLikeComment,
  onDislikeComment,
  onHeartComment,
  onLikeReply,
  onEditComment,
  onDeleteComment,
  currentUser,
  creatorId
}: CommentsSectionProps) {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // States for three-dots menu and editing comments
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const commentsListRef = useRef<HTMLDivElement>(null);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(newCommentText.trim());
    setNewCommentText('');
  };

  const handleSubmitReply = (commentId: string) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;
    onAddReply(commentId, text.trim());
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyBoxId(null);
  };

  const handleStartEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (commentId: string) => {
    if (onEditComment && editText.trim()) {
      onEditComment(commentId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  };

  // Scroll function for floating scroll-up and scroll-down arrows
  const handleScroll = (direction: 'up' | 'down') => {
    if (commentsListRef.current) {
      const scrollAmount = direction === 'up' ? -220 : 220;
      commentsListRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  // Sort logic
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp.includes('seconds') || b.timestamp.includes('now') ? -1 : 1;
    }
    return (b.likes + (b.isLiked ? 1 : 0)) - (a.likes + (a.isLiked ? 1 : 0));
  });

  // Renders the stylized red play avatar or fallback to image
  const renderAvatar = (avatarUrl: string, userName: string) => {
    if (userName === 'UtubeChat' || avatarUrl === 'pp_logo' || !avatarUrl || avatarUrl.includes('placeholder')) {
      return (
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/15 select-none" id={`avatar-utube-${userName}`}>
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-white translate-x-[1.5px]" />
        </div>
      );
    }
    return (
      <img 
        src={avatarUrl} 
        alt={userName} 
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-zinc-850" 
        referrerPolicy="no-referrer"
      />
    );
  };

  if (isCollapsed) {
    return (
      <div className="bg-[#0b0b0d]/60 border border-zinc-900/60 rounded-2xl p-4 flex items-center justify-between" id="comments-collapsed-panel">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-4.5 h-4.5 text-gold-500" />
          <span className="text-xs font-bold text-zinc-300 font-mono">Comments are hidden ({comments.length})</span>
        </div>
        <button
          onClick={() => setIsCollapsed(false)}
          className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-gold-400 hover:text-gold-300 text-[10px] font-bold font-mono rounded-lg border border-zinc-800 transition-colors cursor-pointer"
        >
          Show Comments
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-[#050507]/40 border border-zinc-900/40 rounded-2xl p-4 md:p-5 text-left space-y-4" id="comments-section-container">
      {/* Comments count & Sorting Header */}
      <div className="flex items-center justify-between border-b border-zinc-900/50 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-zinc-100 font-sans tracking-wide">
            Comments
          </h3>
          <span className="text-[11px] font-bold font-mono text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-full border border-zinc-850">
            {comments.length}
          </span>
        </div>

        {/* Action icons on right */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortBy(sortBy === 'top' ? 'newest' : 'top')}
            title={`Sort by: ${sortBy === 'top' ? 'Newest' : 'Top'}`}
            className="p-1.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900/60 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ListFilter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse Comments"
            className="p-1.5 rounded-lg bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900/60 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating scroll arrows on the right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        <button
          onClick={() => handleScroll('up')}
          title="Scroll Comments Up"
          className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-md shadow-black/40 hover:scale-105"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleScroll('down')}
          title="Scroll Comments Down"
          className="w-8 h-8 rounded-full bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-md shadow-black/40 hover:scale-105"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Comments Scroll List Container */}
      <div 
        ref={commentsListRef}
        className="space-y-4 max-h-[360px] overflow-y-auto pr-10 scrollbar-none" 
        id="comments-list"
      >
        {sortedComments.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-4 text-center">No comments yet. Start the conversation below!</p>
        ) : (
          sortedComments.map((comment) => {
            const isUserComment = comment.userName === currentUser.name;
            const canModify = isUserComment || comment.userName === 'Push2PlayChat'; // Allow mock comment Push2PlayChat to be modified too

            return (
              <div 
                key={comment.id} 
                className="group/comment space-y-2 pb-3.5 border-b border-zinc-950/80 last:border-b-0"
              >
                {/* Comment Body */}
                <div className="flex gap-3 relative">
                  {renderAvatar(comment.userAvatar, comment.userName)}

                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      {/* Handle and Date */}
                      <div className="flex items-center">
                        <span className="text-xs font-bold text-zinc-200">
                          @{comment.userName.replace(/\s+/g, '')}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium font-sans ml-2.5">
                          {comment.timestamp}
                        </span>
                      </div>

                      {/* Three-dots Menu Option */}
                      {canModify && (
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === comment.id ? null : comment.id)}
                            className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown popup menu styled like image */}
                          {activeMenuId === comment.id && (
                            <div className="absolute right-0 mt-1 z-30 bg-[#0d0d11] border border-zinc-800/80 rounded-xl shadow-2xl p-1.5 w-24 animate-in fade-in slide-in-from-top-1 duration-150">
                              <button
                                onClick={() => handleStartEdit(comment)}
                                className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3 h-3 text-gold-400" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (onDeleteComment) {
                                    onDeleteComment(comment.id);
                                  }
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold text-red-450 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-red-550" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Content text or Edit Field */}
                    {editingId === comment.id ? (
                      <div className="mt-1.5 space-y-1.5">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 px-3 py-1.5 outline-none focus:border-gold-500/30"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-black text-[10px] font-bold rounded-md cursor-pointer transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-md cursor-pointer transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-300 font-sans mt-1 leading-relaxed">
                        {comment.text}
                      </p>
                    )}

                    {/* Inline Comment Actions (Likes, Replies, Creator Heart) */}
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-500 font-sans">
                      <button
                        onClick={() => onLikeComment(comment.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${comment.isLiked ? 'text-gold-400' : 'hover:text-zinc-300'}`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> 
                        <span className="font-mono text-[9px]">{comment.likes + (comment.isLiked ? 1 : 0)}</span>
                      </button>
                      <button
                        onClick={() => onDislikeComment(comment.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${comment.isDisliked ? 'text-zinc-300' : 'hover:text-zinc-300'}`}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id)}
                        className="font-semibold text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        Reply
                      </button>

                      {/* Creator Heart Action Indicator */}
                      {comment.isHeartedByCreator && (
                        <span className="flex items-center gap-1 text-gold-400 text-[9px] font-bold bg-gold-500/5 px-2 py-0.5 rounded-full border border-gold-500/10">
                          <Heart className="w-2.5 h-2.5 fill-current text-gold-500" /> Hearted by Creator
                        </span>
                      )}

                      {/* Button to let creator heart it */}
                      {!comment.isHeartedByCreator && creatorId === currentUser.name && (
                        <button
                          onClick={() => onHeartComment(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-100 flex items-center gap-1 hover:text-gold-400 transition-opacity cursor-pointer text-zinc-600"
                          title="Heart this comment as creator"
                        >
                          <Heart className="w-2.5 h-2.5" /> Heart
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Replies Thread */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="pl-9 space-y-3 pt-2" id={`replies-${comment.id}`}>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-zinc-800 flex-shrink-0 mt-0.5" />
                        {renderAvatar(reply.userAvatar, reply.userName)}
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className={`text-[11px] font-bold ${reply.userName === 'A Word of Wisdom' || reply.userName === 'My Dirty Lense' ? 'text-gold-400 bg-gold-500/5 px-1.5 py-0.5 rounded border border-gold-500/5' : 'text-zinc-300'}`}>
                              @{reply.userName.replace(/\s+/g, '')}
                            </span>
                            <span className="text-[9px] text-zinc-500 font-mono ml-2">{reply.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-zinc-300 mt-0.5 leading-normal">
                            {reply.text}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-[9px] text-zinc-500">
                            <button
                              onClick={() => onLikeReply(comment.id, reply.id)}
                              className={`flex items-center gap-1 hover:text-zinc-300 cursor-pointer ${reply.isLiked ? 'text-gold-400 font-bold' : ''}`}
                            >
                              👍 <span className="font-mono">{reply.likes + (reply.isLiked ? 1 : 0)}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Reply Editor Drawer */}
                {activeReplyBoxId === comment.id && (
                  <div className="pl-9 flex gap-2 pt-2 items-center animate-in slide-in-from-top-1 duration-150">
                    <input
                      type="text"
                      placeholder={`Reply to @${comment.userName}...`}
                      value={replyInputs[comment.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                      className="flex-1 bg-zinc-950 border border-zinc-900 text-xs px-3 py-1.5 rounded-lg text-zinc-300 outline-none focus:border-gold-500/30"
                    />
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!(replyInputs[comment.id] || '').trim()}
                      className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Primary Root Comment Input (Rendered at the bottom exactly like the image) */}
      <form onSubmit={handleSubmitComment} className="flex gap-3 pt-3 border-t border-zinc-950/40 items-center">
        {renderAvatar(currentUser.avatar, currentUser.name)}
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-500 border-b border-zinc-900 focus:border-zinc-700 outline-none pb-1 transition-colors font-sans"
            maxLength={300}
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-[10px] font-bold transition-colors cursor-pointer shadow-md shadow-gold-500/5"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
