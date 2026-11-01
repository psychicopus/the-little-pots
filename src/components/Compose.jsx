import React, { useState } from 'react';
import { Send, Stamp, Sparkles, Feather, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS } from '../lib/mockData';
import confetti from 'canvas-confetti';

export const Compose = ({ onSent }) => {
  const { castPot, currentUser, playTypewriterSound } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [stamp, setStamp] = useState(currentUser.stampPreference || VINTAGE_STAMPS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleKeyDown = () => {
    playTypewriterSound();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      castPot({ title, content, stamp });
      setIsSubmitting(false);
      setSuccessNotice(true);

      // Gentle celebratory postal confetti
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8e1b1b', '#cfae8b', '#7e5a3e']
        });
      } catch (err) {}

      setTimeout(() => {
        setSuccessNotice(false);
        setTitle('');
        setContent('');
        if (onSent) onSent();
      }, 1800);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      
      {/* Intro memo */}
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl font-bold text-[#3d291b] mb-1">
          Cast a Little Pot into the Stream
        </h2>
        <p className="font-typewriter text-sm text-[#7e5a3e]">
          Write what’s weighing on your mind. Once sealed, it flies anonymously to a random stranger somewhere in the world.
        </p>
      </div>

      {successNotice ? (
        <div className="parchment-sheet p-8 rounded-lg text-center animate-fade-in border-2 border-[#b5987a]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8e1b1b] text-white flex items-center justify-center shadow-wax-seal">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#3d291b] mb-2">Pot Sealed & Delivered!</h3>
          <p className="font-typewriter text-sm text-[#5c402c] max-w-md mx-auto">
            Your dispatch has been picked up by the postal wind. It will rest in a stranger's collection until they open and reply.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="parchment-sheet rounded-lg p-6 sm:p-8 relative">
          
          {/* Decorative Postage Stamp in the top right corner */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <div className="postal-stamp cursor-pointer" title="Click to swap stamp">
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
            <div className="postmark-circle w-14 h-14 flex items-center justify-center text-[9px] -mt-5 -ml-4 rotate-12 pointer-events-none select-none">
              POSTAL<br/>NO. 704
            </div>
          </div>

          {/* Letter Header */}
          <div className="mb-6 pt-2">
            <div className="flex items-center gap-2 text-xs font-typewriter text-[#7e5a3e] uppercase tracking-widest mb-1">
              <Feather className="w-3.5 h-3.5 text-[#8e1b1b]" />
              <span>Dear Stranger,</span>
            </div>
            <input
              type="text"
              value={title}
              onKeyDown={handleKeyDown}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title or subject (e.g., A heavy thought after midnight...)"
              className="w-full bg-transparent border-b border-[#cca780] focus:border-[#8e1b1b] focus:outline-none py-1 font-serif text-xl sm:text-2xl text-[#2c1d13] placeholder:text-[#a08466]"
              maxLength={90}
            />
          </div>

          {/* Letter Body (Typewriter text area) */}
          <div className="mb-6 relative">
            <textarea
              required
              rows={8}
              value={content}
              onKeyDown={handleKeyDown}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Spill your words here. A memory, an unspoken sorrow, a question you can’t ask people you know, or simply something you need to say out loud without judgment..."
              className="w-full bg-transparent font-typewriter text-sm sm:text-base leading-relaxed text-[#2c1d13] placeholder:text-[#9e8367] resize-y focus:outline-none"
              style={{ lineHeight: '28px' }}
            />
          </div>

          {/* Footer controls & Wax Seal Send Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#d8c2a3]">
            <div className="text-xs font-typewriter text-[#7e5a3e] flex items-center gap-1.5">
              <span>Dispatched as:</span>
              <span className="font-bold text-[#3d291b]">{currentUser.name}</span>
              <span className="text-[10px] text-[#9c7857]">(Anonymous Handle)</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="wax-button text-[#fff8ee] font-serif px-6 py-2.5 rounded-full flex items-center gap-2 text-sm tracking-wide shadow-wax-seal disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Stamping & Sending...' : 'Apply Wax Seal & Cast'}</span>
            </button>
          </div>

        </form>
      )}

      {/* Gentle Tips */}
      <div className="mt-8 border border-dashed border-[#c5ad90] p-4 rounded bg-[#f7f0e3] text-[#694d34] text-xs font-typewriter leading-relaxed">
        <strong className="text-[#3d291b] flex items-center gap-1 mb-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#8e1b1b]" /> The Postal Code of Ethics:
        </strong>
        The Little Pots is a gentle haven. No ads, no likes, no social scores. Be vulnerable, be kind, and remember there's an actual human reading your words on the other end.
      </div>

    </div>
  );
};
