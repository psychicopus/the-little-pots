import React, { useState } from 'react';
import { User, Archive, Send, MessageSquare, Edit3, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS } from '../lib/mockData';

export const Profile = ({ onOpenCompose }) => {
  const { currentUser, pots, updateProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [stampPreference, setStampPreference] = useState(currentUser?.stampPreference || VINTAGE_STAMPS[0]);

  const myPots = pots.filter(p => p.senderId === currentUser?.id);
  const totalReplies = myPots.reduce((acc, p) => acc + (p.replies?.length || 0), 0);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, bio, stampPreference);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      
      {/* Profile Card */}
      <div className="parchment-sheet rounded-lg p-6 mb-6 border border-[#cbb294]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cca780] pb-5 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full border-2 border-[#8e1b1b] bg-[#fbf5eb] flex items-center justify-center text-[#8e1b1b] text-xl font-serif font-bold shadow-inner">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-2xl font-bold text-[#3d291b]">
                  {currentUser?.name}
                </h2>
                <span className="text-[10px] bg-[#e8dac6] border border-[#c9b295] px-2 py-0.5 rounded text-[#5c402c] font-typewriter">
                  Registered
                </span>
              </div>
              <p className="font-typewriter text-xs text-[#7e5a3e] mt-0.5">
                {currentUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-start sm:self-auto px-3 py-1.5 bg-[#ecdcc8] hover:bg-[#decab0] border border-[#c5ad90] rounded text-xs font-typewriter text-[#3d291b] flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing && (
          <form onSubmit={handleSave} className="bg-[#f6ebd9] p-4 rounded mb-5 border border-[#c9b295] text-xs font-typewriter space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#7e5a3e] mb-1">Pseudonym:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fdfbf7] border border-[#cca780] rounded p-2 text-[#3d291b]"
                  required
                />
              </div>
              <div>
                <label className="block text-[#7e5a3e] mb-1">Default Stamp:</label>
                <select
                  value={stampPreference}
                  onChange={(e) => setStampPreference(e.target.value)}
                  className="w-full bg-[#fdfbf7] border border-[#cca780] rounded p-2 text-[#3d291b]"
                >
                  {VINTAGE_STAMPS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="wax-button text-white px-4 py-1.5 rounded-full text-xs font-serif flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 font-typewriter text-center">
          <div className="bg-[#f7f0e3] p-2.5 rounded border border-[#dfceb9]">
            <div className="text-[10px] text-[#8c6746] flex items-center justify-center gap-1">
              <Send className="w-3 h-3" /> Dispatched
            </div>
            <div className="font-serif text-xl font-bold text-[#3d291b] mt-0.5">
              {myPots.length}
            </div>
          </div>

          <div className="bg-[#f7f0e3] p-2.5 rounded border border-[#dfceb9]">
            <div className="text-[10px] text-[#8c6746] flex items-center justify-center gap-1">
              <MessageSquare className="w-3 h-3" /> Replies
            </div>
            <div className="font-serif text-xl font-bold text-[#8e1b1b] mt-0.5">
              {totalReplies}
            </div>
          </div>

          <div className="bg-[#f7f0e3] p-2.5 rounded border border-[#dfceb9]">
            <div className="text-[10px] text-[#8c6746] flex items-center justify-center gap-1">
              <Archive className="w-3 h-3" /> Stamp
            </div>
            <div className="text-xs font-bold text-[#3d291b] mt-1 truncate">
              {currentUser?.stampPreference}
            </div>
          </div>
        </div>

      </div>

      {/* Dispatched Pots Archive */}
      <div>
        <h3 className="font-serif text-xl font-bold text-[#3d291b] mb-3">
          Your Sent Letters ({myPots.length})
        </h3>

        {myPots.length === 0 ? (
          <div className="parchment-sheet p-6 rounded-lg text-center border border-dashed border-[#c5ad90]">
            <p className="font-typewriter text-xs text-[#7e5a3e] mb-3">
              You haven't written any letters yet.
            </p>
            <button
              onClick={onOpenCompose}
              className="wax-button text-white text-xs font-serif px-4 py-1.5 rounded-full shadow-wax-seal cursor-pointer inline-flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Compose First Letter</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myPots.map((pot) => (
              <div key={pot.id} className="parchment-sheet p-4 rounded-lg border border-[#cbb294]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-serif font-bold text-base text-[#2c1d13]">
                    {pot.title}
                  </h4>
                  <span className="postal-stamp text-[9px]">
                    {pot.stamp}
                  </span>
                </div>

                <p className="font-typewriter text-xs text-[#443021] leading-relaxed whitespace-pre-wrap mb-3">
                  {pot.content}
                </p>

                <div className="border-t border-[#dfceb9] pt-2 text-[11px] font-typewriter text-[#7e5a3e] flex items-center justify-between">
                  <span>{new Date(pot.createdAt).toLocaleDateString()}</span>
                  <span className="font-bold text-[#8e1b1b]">
                    {pot.replies?.length || 0} replies
                  </span>
                </div>

                {pot.replies && pot.replies.length > 0 && (
                  <div className="mt-2.5 pl-3 border-l-2 border-[#8e1b1b] space-y-2">
                    {pot.replies.map(r => (
                      <div key={r.id} className="bg-[#f5ebd9] p-2 rounded text-xs font-typewriter">
                        <div className="flex items-center justify-between font-bold text-[#3d291b] text-[10px] mb-0.5">
                          <span>{r.authorName}</span>
                          <span className="font-normal text-[#8c6746]">
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
