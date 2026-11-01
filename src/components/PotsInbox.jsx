import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, Send, ArrowRight, CornerDownRight, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PotsInbox = ({ onOpenCompose }) => {
  const { pots, currentUser, replyToPot, playTypewriterSound } = useApp();
  const [selectedPotId, setSelectedPotId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  // Show pots addressed to current user or public dispatches
  const receivedPots = pots.filter(p => p.recipientId === currentUser.id || p.recipientId === 'current_user');
  
  // Also show pots the current user has sent so they can track their conversations
  const sentPots = pots.filter(p => p.senderId === currentUser.id);

  const selectedPot = pots.find(p => p.id === selectedPotId) || receivedPots[0] || null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedPot) return;

    replyToPot(selectedPot.id, replyInput);
    setReplyInput('');
  };

  const formatDate = (isoStr) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Moments ago';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3d291b]">
            Your Postal Desk & Shelf
          </h2>
          <p className="font-typewriter text-xs text-[#7e5a3e]">
            Letters delivered to your care from strangers around the globe.
          </p>
        </div>

        <button
          onClick={onOpenCompose}
          className="wax-button self-start sm:self-auto text-white px-4 py-2 rounded-full text-xs font-serif flex items-center gap-2 cursor-pointer shadow-wax-seal"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Write a New Vent</span>
        </button>
      </div>

      {receivedPots.length === 0 ? (
        <div className="parchment-sheet p-8 rounded-lg text-center border-2 border-dashed border-[#c5ad90] my-8">
          <Mail className="w-12 h-12 text-[#9d744f] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-xl font-bold text-[#3d291b] mb-1">Your Mailbox is Resting</h3>
          <p className="font-typewriter text-xs text-[#7e5a3e] max-w-md mx-auto mb-4">
            No stranger pots have landed on your doorstep just yet. Why not cast your own thoughts into the stream or check your sent dispatches?
          </p>
          <button
            onClick={onOpenCompose}
            className="px-4 py-2 bg-[#ebdcc8] hover:bg-[#dfcdb5] border border-[#bfa486] rounded text-xs font-typewriter text-[#3d291b] transition-colors"
          >
            Cast the First Pot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Stack of Letters / Envelopes */}
          <div className="md:col-span-5 space-y-3">
            <div className="text-xs font-typewriter uppercase tracking-wider text-[#7e5a3e] px-1 font-bold">
              Delivered Letters ({receivedPots.length})
            </div>

            {receivedPots.map((pot) => {
              const isSelected = selectedPot && selectedPot.id === pot.id;
              const replyCount = pot.replies?.length || 0;

              return (
                <div
                  key={pot.id}
                  onClick={() => {
                    setSelectedPotId(pot.id);
                    setReplyInput('');
                  }}
                  className={`p-4 rounded cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#fcf8f1] border-[#8e1b1b] shadow-letter translate-x-1'
                      : 'bg-[#f9f2e5] hover:bg-[#f6ebd9] border-[#d8c2a3]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#7e5a3e] font-typewriter mb-1">
                    <span className="font-bold text-[#3d291b]">{pot.senderName || 'Anonymous'}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatDate(pot.createdAt)}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#2c1d13] line-clamp-1 mb-1">
                    {pot.title || 'Untitled Letter'}
                  </h4>

                  <p className="font-typewriter text-xs text-[#6e4e33] line-clamp-2 leading-relaxed">
                    {pot.content}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-typewriter text-[#8c6746]">
                    <span className="bg-[#ede1ce] px-2 py-0.5 rounded text-[10px]">
                      {pot.stamp || '📬 Standard'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#8e1b1b]">
                      <MessageSquare className="w-3 h-3" />
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Open Letter Reader & Reply Desk */}
          <div className="md:col-span-7">
            {selectedPot ? (
              <div className="parchment-sheet p-6 sm:p-7 rounded-lg border border-[#cbb294]">
                
                {/* Letter Header info */}
                <div className="border-b border-[#cca780] pb-4 mb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-typewriter text-[#7e5a3e]">
                        A letter from <strong className="text-[#3d291b]">{selectedPot.senderName}</strong>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2c1d13] mt-1">
                        {selectedPot.title}
                      </h3>
                    </div>

                    <div className="postal-stamp text-[10px] whitespace-nowrap">
                      {selectedPot.stamp || '📬 Vintage Postal'}
                    </div>
                  </div>

                  <div className="text-[11px] font-typewriter text-[#8c6746] mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Delivered on {new Date(selectedPot.createdAt).toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>

                {/* Letter Content */}
                <div className="font-typewriter text-sm sm:text-base text-[#2c1d13] leading-relaxed whitespace-pre-wrap mb-6 min-h-[120px]" style={{ lineHeight: '28px' }}>
                  {selectedPot.content}
                </div>

                {/* Replies Thread */}
                <div className="border-t border-[#d8c2a3] pt-4 mt-6">
                  <div className="flex items-center gap-1.5 text-xs font-typewriter uppercase tracking-wider text-[#7e5a3e] font-bold mb-3">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#8e1b1b]" />
                    <span>Exchanged Words ({selectedPot.replies?.length || 0})</span>
                  </div>

                  {selectedPot.replies && selectedPot.replies.length > 0 ? (
                    <div className="space-y-3 mb-5">
                      {selectedPot.replies.map((reply) => {
                        const isMe = reply.authorId === currentUser.id;
                        return (
                          <div 
                            key={reply.id} 
                            className={`p-3 rounded text-xs font-typewriter border ${
                              isMe 
                                ? 'bg-[#f4ebe0] border-[#cbb294] ml-4' 
                                : 'bg-[#fdfaf3] border-[#dfcdb5] mr-4'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[#8c6746] mb-1 text-[11px]">
                              <span className="font-bold text-[#3d291b]">
                                {isMe ? 'You' : reply.authorName}
                              </span>
                              <span>{formatDate(reply.createdAt)}</span>
                            </div>
                            <p className="text-[#342416] leading-relaxed whitespace-pre-wrap">
                              {reply.content}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs font-typewriter text-[#8c6746] italic mb-4">
                      No replies yet. Be the first gentle voice to answer this stranger.
                    </p>
                  )}

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendReply} className="mt-4">
                    <div className="relative">
                      <textarea
                        rows={3}
                        value={replyInput}
                        onKeyDown={playTypewriterSound}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder="Type your response, thoughts, or shared experience here..."
                        className="w-full bg-[#fdfbf6] border border-[#cca780] focus:border-[#8e1b1b] focus:outline-none p-3 rounded text-xs font-typewriter text-[#2c1d13] placeholder:text-[#a08466] leading-relaxed resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[11px] font-typewriter text-[#7e5a3e]">
                        Replying as <strong className="text-[#3d291b]">{currentUser.name}</strong>
                      </span>
                      <button
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="px-4 py-1.5 bg-[#8e1b1b] hover:bg-[#751313] disabled:opacity-50 text-white rounded text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </form>

                </div>

              </div>
            ) : (
              <div className="parchment-sheet p-8 rounded-lg text-center text-[#7e5a3e] font-typewriter text-xs">
                Select a letter from the left shelf to unfold and read.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
