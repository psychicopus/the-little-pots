import React from 'react';
import { Feather, Send, Mail, Heart, Sparkles, Compass, Shield, ArrowRight } from 'lucide-react';

export const WelcomeBanner = ({ onGetStarted, onLearnMore }) => {
  return (
    <div className="mb-8 parchment-sheet rounded-lg p-6 sm:p-8 border-2 border-[#caa783] relative overflow-hidden">
      {/* Postal postmark background decoration */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full border-4 border-dashed border-[#8e1b1b]/15 pointer-events-none flex items-center justify-center text-xs font-typewriter text-[#8e1b1b]/20 rotate-12 select-none">
        POSTAL<br />EXCHANGE
      </div>

      <div className="max-w-2xl relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebdcc8] border border-[#cbb294] text-xs font-typewriter text-[#5c402c] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#8e1b1b]" />
          <span>A Haven for Honest, Anonymous Thoughts</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3d291b] leading-tight mb-3">
          Welcome to The Little Pots
        </h2>

        <p className="font-typewriter text-xs sm:text-sm text-[#5c402c] leading-relaxed mb-6" style={{ lineHeight: '24px' }}>
          In an internet hurried by notifications and performative profiles, The Little Pots returns to slow, thoughtful dispatches. 
          Pour out your unspoken worries or quiet memories into a vessel. It is sealed with wax and cast to a single stranger across the globe who can reply with advice, empathy, or solidarity.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 font-typewriter text-xs">
          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9]">
            <div className="font-bold text-[#3d291b] flex items-center gap-1.5 mb-1">
              <Feather className="w-4 h-4 text-[#8e1b1b]" /> 1. Cast a Vent
            </div>
            <p className="text-[#7e5a3e] text-[11px] leading-snug">
              Write unfiltered without fears of judgement or likes.
            </p>
          </div>

          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9]">
            <div className="font-bold text-[#3d291b] flex items-center gap-1.5 mb-1">
              <Mail className="w-4 h-4 text-[#8e1b1b]" /> 2. Stranger Arrives
            </div>
            <p className="text-[#7e5a3e] text-[11px] leading-snug">
              Assigned randomly to another registered wanderer.
            </p>
          </div>

          <div className="bg-[#f7f0e3] p-3 rounded border border-[#dfceb9]">
            <div className="font-bold text-[#3d291b] flex items-center gap-1.5 mb-1">
              <Heart className="w-4 h-4 text-[#8e1b1b]" /> 3. Spark Connection
            </div>
            <p className="text-[#7e5a3e] text-[11px] leading-snug">
              Reply to share advice or resonance in a quiet 1-on-1 thread.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onGetStarted}
            className="wax-button text-white font-serif px-5 py-2.5 rounded-full text-xs sm:text-sm tracking-wide shadow-wax-seal flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Cast Your First Pot</span>
          </button>

          <button
            onClick={onLearnMore}
            className="px-4 py-2.5 bg-[#ebdcc8] hover:bg-[#dfcdb5] border border-[#bfa486] rounded-full text-xs font-typewriter text-[#3d291b] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Create Postal Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
