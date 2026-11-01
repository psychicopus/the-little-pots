import React, { useState } from 'react';
import { Mail, Clock, MessageSquare, Send, CornerDownRight, Inbox } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PotsInbox = ({ onOpenCompose }) => {
  const { pots, currentUser, replyToPot, playTypewriterSound } = useApp();
  const [selectedPotId, setSelectedPotId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  // Pots addressed to current user or unassigned strangers
  const receivedPots = pots.filter(p => 
    p.recipientId === currentUser?.id || 
    p.recipientId === 'current_user' || 
    (p.senderId !== currentUser?.id && !p.recipientId)
  );

  const selectedPot = pots.find(p => p.id === selectedPotId) || receivedPots[0] || null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedPot) return;

    await replyToPot(selectedPot.id, replyInput);
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
      return 'Recently';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      
      {/* Clean Header Bar - Removed duplicate buttons */}
      <div className="flex items-center justify-between border-b border-[#cca780] pb-3 mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#3d291b]">
            Your Shelf
          </h2>
          <p className="font-typewriter text-xs text-[#7e5a3e]">
            Letters and dispatches delivered from strangers.
          </p>
        </div>

        <div className="text-xs font-typewriter text-[#7e5a3e]">
          {receivedPots.length} {receivedPots.length === 1 ? 'letter' : 'letters'}
        </div>
      </div>

      {receivedPots.length === 0 ? (
        <div className="parchment-sheet p-10 rounded-lg text-center border border-dashed border-[#c5ad90] my-8">
          <Inbox className="w-10 h-10 text-[#9d744f] mx-auto mb-3 opacity-50" />
          <h3 className="font-serif text-xl font-bold text-[#3d291b] mb-1">Your Mailbox is Empty</h3>
          <p className="font-typewriter text-xs text-[#7e5a3e] max-w-sm mx-auto mb-5">
            No stranger letters have landed on your desk yet. As more wanderers cast pots, one will arrive here.
          </p>
          <button
            onClick={onOpenCompose}
            className="wax-button text-white text-xs font-serif px-5 py-2 rounded-full shadow-wax-seal cursor-pointer inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Compose a Dispatch</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Letters List */}
          <div className="md:col-span-5 space-y-2.5">
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
                  className={`p-3.5 rounded cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#fcf8f1] border-[#8e1b1b] shadow-letter translate-x-1'
                      : 'bg-[#f9f2e5] hover:bg-[#f5e9d5] border-[#d8c2a3]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#7e5a3e] font-typewriter mb-1">
                    <span className="font-bold text-[#3d291b] truncate max-w-[150px]">{pot.senderName}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      {formatDate(pot.createdAt)}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-[#2c1d13] line-clamp-1 mb-1">
                    {pot.title}
                  </h4>

                  <p className="font-typewriter text-xs text-[#6e4e33] line-clamp-2 leading-relaxed">
                    {pot.content}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-typewriter text-[#8c6746]">
                    <span className="bg-[#ede1ce] px-1.5 py-0.5 rounded text-[10px]">
                      {pot.stamp}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#8e1b1b]">
                      <MessageSquare className="w-3 h-3" />
                      {replyCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Letter Reader */}
          <div className="md:col-span-7">
            {selectedPot && (
              <div className="parchment-sheet p-6 rounded-lg border border-[#cbb294]">
                <div className="border-b border-[#cca780] pb-3 mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-typewriter text-[#7e5a3e]">
                      From <strong className="text-[#3d291b]">{selectedPot.senderName}</strong>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#2c1d13] mt-0.5">
                      {selectedPot.title}
                    </h3>
                    <div className="text-[11px] font-typewriter text-[#8c6746] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(selectedPot.createdAt)}
                    </div>
                  </div>

                  <div className="postal-stamp text-[10px] whitespace-nowrap">
                    {selectedPot.stamp}
                  </div>
                </div>

                {/* Body */}
                <div className="font-typewriter text-xs sm:text-sm text-[#2c1d13] leading-relaxed whitespace-pre-wrap mb-6 min-h-[100px]" style={{ lineHeight: '26px' }}>
                  {selectedPot.content}
                </div>

                {/* Replies Thread */}
                <div className="border-t border-[#d8c2a3] pt-4">
                  <div className="flex items-center gap-1 text-xs font-typewriter uppercase tracking-wider text-[#7e5a3e] font-bold mb-3">
                    <CornerDownRight className="w-3.5 h-3.5 text-[#8e1b1b]" />
                    <span>Replies ({selectedPot.replies?.length || 0})</span>
                  </div>

                  {selectedPot.replies && selectedPot.replies.length > 0 ? (
                    <div className="space-y-2.5 mb-4">
                      {selectedPot.replies.map((reply) => {
                        const isMe = reply.authorId === currentUser?.id;
                        return (
                          <div 
                            key={reply.id} 
                            className={`p-2.5 rounded text-xs font-typewriter border ${
                              isMe 
                                ? 'bg-[#f4ebe0] border-[#cbb294] ml-3' 
                                : 'bg-[#fdfaf3] border-[#dfcdb5] mr-3'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[#8c6746] mb-1 text-[10px]">
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
                    <p className="text-xs font-typewriter text-[#8c6746] italic mb-3">
                      No replies yet. Send a gentle thought in reply below.
                    </p>
                  )}

                  {/* Send Reply */}
                  <form onSubmit={handleSendReply} className="mt-3">
                    <textarea
                      rows={2}
                      value={replyInput}
                      onKeyDown={playTypewriterSound}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder="Write your reply to this stranger..."
                      className="w-full bg-[#fdfbf6] border border-[#cca780] focus:border-[#8e1b1b] focus:outline-none p-2.5 rounded text-xs font-typewriter text-[#2c1d13] placeholder:text-[#a08466] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="wax-button text-white px-4 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
