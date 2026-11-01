import React, { useState } from 'react';
import { Send, CheckCircle2, Feather } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS } from '../lib/mockData';
import confetti from 'canvas-confetti';

export const Compose = ({ onSent }) => {
  const { castPot, currentUser, playTypewriterSound } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stamp, setStamp] = useState(currentUser?.stampPreference || VINTAGE_STAMPS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await castPot({ title, content, stamp });
      setSuccessNotice(true);

      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#8e1b1b', '#cfae8b', '#7e5a3e']
        });
      } catch (err) {}

      setTimeout(() => {
        setSuccessNotice(false);
        setTitle('');
        setContent('');
        if (onSent) onSent();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#3d291b]">
          Compose a Dispatch
        </h2>
        <p className="font-typewriter text-xs text-[#7e5a3e]">
          Write what's on your mind. Once sealed, it is delivered anonymously to a random stranger.
        </p>
      </div>

      {successNotice ? (
        <div className="parchment-sheet p-8 rounded-lg text-center border border-[#b5987a]">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#8e1b1b] text-white flex items-center justify-center shadow-wax-seal">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#3d291b] mb-1">Sealed & Delivered</h3>
          <p className="font-typewriter text-xs text-[#5c402c]">
            Your pot has flown into the postal stream.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="parchment-sheet rounded-lg p-6 sm:p-7 relative border border-[#cca780]">
          
          {/* Corner Postage Stamp Selector */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
            <div className="postal-stamp cursor-pointer">
              <select
                value={stamp}
                onChange={(e) => setStamp(e.target.value)}
                className="bg-transparent text-xs font-typewriter text-[#3d291b] border-none focus:outline-none cursor-pointer"
              >
                {VINTAGE_STAMPS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Letter Title */}
          <div className="mb-5 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-typewriter text-[#7e5a3e] uppercase tracking-widest mb-1">
              <Feather className="w-3 h-3 text-[#8e1b1b]" />
              <span>Dear Stranger,</span>
            </div>
            <input
              type="text"
              value={title}
              onKeyDown={playTypewriterSound}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Subject / Title"
              className="w-full bg-transparent border-b border-[#cca780] focus:border-[#8e1b1b] focus:outline-none py-1 font-serif text-xl text-[#2c1d13] placeholder:text-[#a08466]"
              maxLength={80}
            />
          </div>

          {/* Body */}
          <div className="mb-5">
            <textarea
              required
              rows={7}
              value={content}
              onKeyDown={playTypewriterSound}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pour out your unspoken words, memories, worries, or thoughts here..."
              className="w-full bg-transparent font-typewriter text-xs sm:text-sm text-[#2c1d13] placeholder:text-[#9e8367] resize-y focus:outline-none leading-relaxed"
              style={{ lineHeight: '26px' }}
            />
          </div>

          {/* Single clean Cast button */}
          <div className="flex items-center justify-between pt-3 border-t border-[#d8c2a3]">
            <span className="text-[11px] font-typewriter text-[#7e5a3e]">
              From: <strong className="text-[#3d291b]">{currentUser?.name}</strong>
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="wax-button text-white font-serif px-6 py-2 rounded-full flex items-center gap-2 text-xs tracking-wide shadow-wax-seal disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sealing...' : 'Seal & Cast Pot'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
