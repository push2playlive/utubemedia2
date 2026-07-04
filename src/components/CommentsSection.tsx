import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Heart, CornerDownRight, Send } from 'lucide-react';
import { Comment, CommentReply } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onLikeComment: (commentId: string) => void;
  onDislikeComment: (commentId: string) => void;
  onHeartComment: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
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
  currentUser,
  creatorId
}: CommentsSectionProps) {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyInputs, setReplyInputs] = useState<{ [commentId: string]: string }>({});
  const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

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

  // Sort logic
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.timestamp.includes('day') || b.timestamp.includes('hour') ? 1 : -1;
    }
    return (b.likes + (b.isLiked ? 1 : 0)) - (a.likes + (a.isLiked ? 1 : 0));
  });

  return (
    <div className="space-y-5 text-left border-t border-zinc-900/60 pt-5" id="comments-section-container">
      {/* Comments count & Sorting Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-gold-500" />
          <span>{comments.length} Comments</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('top')}
            className={`text-[10px] font-semibold font-mono px-2.5 py-1 rounded-full cursor-pointer transition-all border ${sortBy === 'top' ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Top Comments
          </button>
          <button
            onClick={() => setSortBy('newest')}
            className={`text-[10px] font-semibold font-mono px-2.5 py-1 rounded-full cursor-pointer transition-all border ${sortBy === 'newest' ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            Newest First
          </button>
        </div>
      </div>

      {/* Primary Root Comment Input */}
      <form onSubmit={handleSubmitComment} className="flex gap-3 bg-[#0c0c0f]/80 p-3 rounded-xl border border-zinc-900/80">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 space-y-2">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Share your spiritual revelations or constructive feedback..."
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 border-b border-zinc-900/60 focus:border-gold-500/30 outline-none resize-none h-12"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-zinc-500 font-mono">{newCommentText.length}/500 chars</span>
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3 py-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md shadow-gold-500/5"
            >
              Post <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

      {/* Comments List Thread Rendering */}
      <div className="space-y-4" id="comments-list">
        {sortedComments.map((comment) => (
          <div key={comment.id} className="group/comment space-y-2 pb-4 border-b border-zinc-900/40">
            {/* Comment Body */}
            <div className="flex gap-3">
              <img 
                src={comment.userAvatar} 
                alt={comment.userName} 
                className="w-7 h-7 rounded-full object-cover flex-shrink-0" 
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-300">{comment.userName}</span>
                  <span className="text-[9px] text-zinc-500 font-mono">{comment.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">
                  {comment.text}
                </p>

                {/* Inline Comment Actions (Likes, Replies, Creator Heart) */}
                <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-500">
                  <button
                    onClick={() => onLikeComment(comment.id)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${comment.isLiked ? 'text-gold-400 font-bold' : 'hover:text-zinc-300'}`}
                  >
                    <ThumbsUp className="w-3 h-3" /> 
                    <span className="font-mono">{comment.likes + (comment.isLiked ? 1 : 0)}</span>
                  </button>
                  <button
                    onClick={() => onDislikeComment(comment.id)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${comment.isDisliked ? 'text-zinc-300 font-bold' : 'hover:text-zinc-300'}`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => setActiveReplyBoxId(activeReplyBoxId === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer"
                  >
                    <MessageSquare className="w-3 h-3" /> Reply
                  </button>

                  {/* Creator Heart Action Indicator */}
                  {comment.isHeartedByCreator && (
                    <span className="flex items-center gap-1 text-gold-400 text-[9px] font-semibold bg-gold-500/5 px-1.5 py-0.5 rounded border border-gold-500/10">
                      <Heart className="w-2.5 h-2.5 fill-current text-gold-500" /> Hearted by Creator
                    </span>
                  )}

                  {/* Button to let creator heart it */}
                  {!comment.isHeartedByCreator && (
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
              <div className="pl-8 space-y-3 pt-2" id={`replies-${comment.id}`}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-2.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-zinc-700 flex-shrink-0 mt-0.5" />
                    <img 
                      src={reply.userAvatar} 
                      alt={reply.userName} 
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold ${reply.userName === 'A Word of Wisdom' || reply.userName === 'My Dirty Lense' ? 'text-gold-400 bg-gold-500/5 px-1 rounded' : 'text-zinc-300'}`}>
                          {reply.userName}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">{reply.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">
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
              <div className="pl-8 flex gap-2 pt-2 items-center animate-in slide-in-from-top-1 duration-150">
                <input
                  type="text"
                  placeholder={`Reply to ${comment.userName}...`}
                  value={replyInputs[comment.id] || ''}
                  onChange={(e) => setReplyInputs(prev => ({ ...prev, [comment.id]: e.target.value }))}
                  className="flex-1 bg-zinc-950 border border-zinc-900 text-xs px-3 py-1.5 rounded-lg text-zinc-300 outline-none focus:border-gold-500/30"
                />
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!(replyInputs[comment.id] || '').trim()}
                  className="px-3 py-1.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-40 text-black rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
