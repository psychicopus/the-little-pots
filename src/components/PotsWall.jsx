import React, { useState } from 'react';
import { Search, Clock, MessageSquare, Send, CornerDownRight, Feather, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PotsWall = ({ onOpenCompose }) => {
  const { pots, currentUser, replyToPot, playTypewriterSound } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPotId, setSelectedPotId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  // Filter pots by search term (keywords in title, content, author, or stamp)
  const filteredPots = pots.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (p.title && p.title.toLowerCase().includes(term)) ||
      (p.content && p.content.toLowerCase().includes(term)) ||
      (p.senderName && p.senderName.toLowerCase().includes(term)) ||
      (p.stamp && p.stamp.toLowerCase().includes(term))
    );
  });

  const selectedPot = pots.find((p) => p.id === selectedPotId) || filteredPots[0] || null;

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
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      
      {/* Wall Header & Search Bar */}
      <div className="parchment-sheet p-5 rounded-lg mb-6 border border-[#cca780] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#3d291b] flex items-center gap-2">
              <span>The Public Pots Wall</span>
              <span className="text-xs font-typewriter font-normal px-2 py-0.5 rounded bg-[#ebdecb] text-[#5c402c] border border-[#d2bea3]">
                {pots.length} Dispatches
              </span>
            </h2>
            <p className="font-typewriter text-xs text-[#7e5a3e] mt-0.5">
              Browse whispers, memories, and vents from wanderers. Search by topic or keyword and reply to connect.
            </p>
          </div>

          <button
            onClick={onOpenCompose}
            className="wax-button self-start md:self-auto text-white font-serif px-5 py-2 rounded-full text-xs tracking-wide shadow-wax-seal flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Cast on Wall</span>
          </button>
        </div>

        {/* Vintage Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8e1b1b] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dispatches by keywords, memories, themes (e.g. 'lonely', 'tea', 'fear', 'stars')..."
            className="w-full bg-[#fdfbf6] border border-[#cca780] focus:border-[#8e1b1b] focus:outline-none pl-9 pr-4 py-2.5 rounded text-xs font-typewriter text-[#2c1d13] placeholder:text-[#a08466]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-typewriter text-[#8c6746] hover:text-[#3d291b]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Wall Content */}
      {filteredPots.length === 0 ? (
        <div className="parchment-sheet p-10 rounded-lg text-center border border-dashed border-[#c5ad90] my-8">
          <Feather className="w-10 h-10 text-[#9d744f] mx-auto mb-3 opacity-50 -rotate-45" />
          <h3 className="font-serif text-xl font-bold text-[#3d291b] mb-1">
            {searchTerm ? "No Dispatches Found" : "The Wall is Waiting"}
          </h3>
          <p className="font-typewriter text-xs text-[#7e5a3e] max-w-sm mx-auto mb-5">
            {searchTerm
              ? `No pots matching "${searchTerm}". Try another keyword or clear the search.`
              : "Be the very first wanderer to post your thoughts on the public wall."}
          </p>
          <button
            onClick={onOpenCompose}
            className="wax-button text-white text-xs font-serif px-5 py-2 rounded-full shadow-wax-seal cursor-pointer inline-flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Cast the First Pot</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: List of All Dispatches on the Wall */}
          <div className="md:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            <div className="text-[11px] font-typewriter uppercase tracking-wider text-[#7e5a3e] font-bold px-1 flex justify-between">
              <span>Wall Dispatches ({filteredPots.length})</span>
              {searchTerm && <span className="text-[#8e1b1b]">Filtered</span>}
            </div>

            {filteredPots.map((pot) => {
              const isSelected = selectedPot && selectedPot.id === pot.id;
              const replyCount = pot.replies?.length || 0;
              const isMine = pot.senderId === currentUser?.id;

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
                    <span className="font-bold text-[#3d291b] truncate max-w-[140px] flex items-center gap-1">
                      {pot.senderName}
                      {isMine && (
                        <span className="text-[9px] bg-[#ebdcc8] px-1.5 py-0.2 rounded text-[#8e1b1b]">
                          You
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-[10px]">
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
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Unfolded Dispatch & Public Comments Thread */}
          <div className="md:col-span-7">
            {selectedPot && (
              <div className="parchment-sheet p-6 rounded-lg border border-[#cbb294]">
                
                {/* Header */}
                <div className="border-b border-[#cca780] pb-3 mb-4 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-typewriter text-[#7e5a3e]">
                      Penned by <strong className="text-[#3d291b]">{selectedPot.senderName}</strong>
                      {selectedPot.senderId === currentUser?.id && ' (You)'}
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2c1d13] mt-0.5">
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

                {/* Letter Body */}
                <div
                  className="font-typewriter text-xs sm:text-sm text-[#2c1d13] leading-relaxed whitespace-pre-wrap mb-6 min-h-[110px]"
                  style={{ lineHeight: '26px' }}
                >
                  {selectedPot.content}
                </div>

                {/* Replies / Comments Section */}
                <div className="border-t border-[#d8c2a3] pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-typewriter uppercase tracking-wider text-[#7e5a3e] font-bold">
                      <CornerDownRight className="w-3.5 h-3.5 text-[#8e1b1b]" />
                      <span>Replies on this Pot ({selectedPot.replies?.length || 0})</span>
                    </div>
                    <span className="text-[10px] font-typewriter text-[#8c6746]">
                      Anyone can reply
                    </span>
                  </div>

                  {selectedPot.replies && selectedPot.replies.length > 0 ? (
                    <div className="space-y-2.5 mb-4 max-h-[350px] overflow-y-auto pr-1">
                      {selectedPot.replies.map((reply) => {
                        const isMe = reply.authorId === currentUser?.id;
                        const isAuthorOfPot = reply.authorId === selectedPot.senderId;

                        return (
                          <div
                            key={reply.id}
                            className={`p-3 rounded text-xs font-typewriter border ${
                              isMe
                                ? 'bg-[#f4ebe0] border-[#cbb294] ml-3'
                                : 'bg-[#fdfaf3] border-[#dfcdb5] mr-3'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[#8c6746] mb-1 text-[10px]">
                              <span className="font-bold text-[#3d291b] flex items-center gap-1">
                                {isMe ? 'You' : reply.authorName}
                                {isAuthorOfPot && (
                                  <span className="text-[9px] bg-[#8e1b1b] text-white px-1.5 py-0.2 rounded font-normal">
                                    Author
                                  </span>
                                )}
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
                      No replies on this pot yet. Share your thoughts or comfort below.
                    </p>
                  )}

                  {/* Add Reply Box */}
                  <form onSubmit={handleSendReply} className="mt-3">
                    <textarea
                      rows={2}
                      value={replyInput}
                      onKeyDown={playTypewriterSound}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Reply as ${currentUser?.name}...`}
                      className="w-full bg-[#fdfbf6] border border-[#cca780] focus:border-[#8e1b1b] focus:outline-none p-2.5 rounded text-xs font-typewriter text-[#2c1d13] placeholder:text-[#a08466] resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-typewriter text-[#7e5a3e]">
                        Public response
                      </span>
                      <button
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="wax-button text-white px-4 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply to Pot</span>
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
