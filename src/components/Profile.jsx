import React, { useState } from 'react';
import { User, Archive, Send, MessageSquare, Edit3, Check, RefreshCw, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS, RANDOM_USERNAMES } from '../lib/mockData';

export const Profile = ({ onOpenCompose }) => {
  const { currentUser, pots, updateProfile, switchIdentity, isSupabaseConfigured } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [stampPreference, setStampPreference] = useState(currentUser.stampPreference || VINTAGE_STAMPS[0]);

  // Pots authored by user
  const myAuthoredPots = pots.filter(p => p.senderId === currentUser.id);

  // Total replies received across all user's pots
  const totalRepliesReceived = myAuthoredPots.reduce((acc, p) => acc + (p.replies?.length || 0), 0);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, bio, stampPreference);
    setIsEditing(false);
  };

  const handleRandomizeIdentity = () => {
    const randomPick = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
    switchIdentity(randomPick);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      
      {/* Identity Card */}
      <div className="parchment-sheet rounded-lg p-6 sm:p-8 mb-8 border border-[#cbb294] relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#cca780] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-2 border-[#8e1b1b] bg-[#fbf5eb] flex items-center justify-center text-[#8e1b1b] shadow-inner text-xl font-serif font-bold">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#3d291b]">
                  {currentUser.name}
                </h2>
                <span className="text-xs bg-[#e8dac6] border border-[#c9b295] px-2 py-0.5 rounded text-[#5c402c] font-typewriter">
                  Anonymous Wanderer
                </span>
              </div>
              <p className="font-typewriter text-xs text-[#7e5a3e] mt-1 max-w-md">
                {currentUser.bio || "No biography inked yet. Just another soul sending little pots into the deep."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-[#ecdcc8] hover:bg-[#decab0] border border-[#c5ad90] rounded text-xs font-typewriter text-[#3d291b] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Ledger'}</span>
            </button>

            <button
              onClick={handleRandomizeIdentity}
              title="Spawn a new persona to test 2-way stranger messaging"
              className="px-3 py-1.5 bg-[#f5ecdd] hover:bg-[#ebdecb] border border-[#c5ad90] rounded text-xs font-typewriter text-[#7e5a3e] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Persona</span>
            </button>
          </div>
        </div>

        {/* Edit Form Modal/Drawer */}
        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#f6ebd9] p-4 rounded mb-6 border border-[#c9b295] text-xs font-typewriter">
            <h4 className="font-serif font-bold text-sm text-[#3d291b] mb-3">Update Your Postal Registry</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[#7e5a3e] mb-1">Handle / Pseudonym:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fdfbf7] border border-[#cca780] rounded p-2 text-[#3d291b] focus:outline-none focus:border-[#8e1b1b]"
                  maxLength={30}
                  required
                />
              </div>

              <div>
                <label className="block text-[#7e5a3e] mb-1">Preferred Vintage Stamp:</label>
                <select
                  value={stampPreference}
                  onChange={(e) => setStampPreference(e.target.value)}
                  className="w-full bg-[#fdfbf7] border border-[#cca780] rounded p-2 text-[#3d291b] focus:outline-none focus:border-[#8e1b1b]"
                >
                  {VINTAGE_STAMPS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[#7e5a3e] mb-1">Short Bio / Motto:</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A line about the thoughts you carry..."
                className="w-full bg-[#fdfbf7] border border-[#cca780] rounded p-2 text-[#3d291b] focus:outline-none focus:border-[#8e1b1b] resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-[#8e1b1b] text-white rounded text-xs font-serif flex items-center gap-1.5 hover:bg-[#751313] transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Ledger</span>
            </button>
          </form>
        )}

        {/* Postal Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-typewriter">
          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9]">
            <div className="text-[11px] text-[#8c6746] flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> Pots Cast
            </div>
            <div className="font-serif text-2xl font-bold text-[#3d291b] mt-0.5">
              {myAuthoredPots.length}
            </div>
          </div>

          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9]">
            <div className="text-[11px] text-[#8c6746] flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> Replies Received
            </div>
            <div className="font-serif text-2xl font-bold text-[#8e1b1b] mt-0.5">
              {totalRepliesReceived}
            </div>
          </div>

          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9] col-span-2 sm:col-span-1">
            <div className="text-[11px] text-[#8c6746] flex items-center gap-1">
              <Archive className="w-3.5 h-3.5" /> Preferred Stamp
            </div>
            <div className="font-typewriter text-xs font-bold text-[#3d291b] mt-1 truncate">
              {currentUser.stampPreference || VINTAGE_STAMPS[0]}
            </div>
          </div>
        </div>

      </div>

      {/* Record of Pots Cast by User */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-xl font-bold text-[#3d291b] flex items-center gap-2">
            <span>Your Dispatched Pots</span>
            <span className="text-xs font-typewriter font-normal text-[#7e5a3e]">
              ({myAuthoredPots.length} records)
            </span>
          </h3>

          <button
            onClick={onOpenCompose}
            className="text-xs font-typewriter text-[#8e1b1b] hover:underline flex items-center gap-1"
          >
            <span>+ Cast Another Pot</span>
          </button>
        </div>

        {myAuthoredPots.length === 0 ? (
          <div className="parchment-sheet p-8 rounded-lg text-center border border-dashed border-[#c5ad90]">
            <p className="font-typewriter text-xs text-[#7e5a3e] mb-3">
              You haven't written any pots yet. Your shelf is empty waiting for your words.
            </p>
            <button
              onClick={onOpenCompose}
              className="wax-button text-white text-xs font-serif px-4 py-2 rounded-full shadow-wax-seal cursor-pointer inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Cast Your First Vent</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myAuthoredPots.map((pot) => (
              <div key={pot.id} className="parchment-sheet p-5 rounded-lg border border-[#cbb294]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2c1d13]">
                      {pot.title}
                    </h4>
                    <span className="text-[11px] font-typewriter text-[#8c6746]">
                      Cast on {new Date(pot.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="postal-stamp text-[10px]">
                    {pot.stamp}
                  </span>
                </div>

                <p className="font-typewriter text-xs text-[#443021] leading-relaxed whitespace-pre-wrap mb-4" style={{ lineHeight: '24px' }}>
                  {pot.content}
                </p>

                {/* Conversation status */}
                <div className="border-t border-[#dfceb9] pt-3 text-xs font-typewriter text-[#7e5a3e] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#8e1b1b]" />
                    <strong className="text-[#3d291b]">{pot.replies?.length || 0}</strong> stranger replies attached
                  </span>
                  <span className="text-[11px] text-[#8c6746] italic">
                    {pot.replies?.length > 0 ? "Connection sparked" : "Floating in the stream"}
                  </span>
                </div>

                {/* Nested replies if any */}
                {pot.replies && pot.replies.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-[#8e1b1b] space-y-2">
                    {pot.replies.map(r => (
                      <div key={r.id} className="bg-[#f5ebd9] p-2.5 rounded text-xs font-typewriter">
                        <div className="flex items-center justify-between font-bold text-[#3d291b] text-[11px] mb-1">
                          <span>{r.authorName} (Stranger's response)</span>
                          <span className="font-normal text-[#8c6746] text-[10px]">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[#443021]">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
