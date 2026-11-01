import React from 'react';
import { Mail, Send, User, Volume2, VolumeX, Feather, LogIn, LogOut, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ activeTab, setActiveTab }) => {
  const { currentUser, audioEnabled, setAudioEnabled, setIsAuthModalOpen, logout } = useApp();

  return (
    <header className="border-b border-[#d2bea3] bg-[#fbf6ec]/85 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('inbox')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full border border-[#8e1b1b] bg-[#fcf8f0] flex items-center justify-center text-[#8e1b1b] shadow-inner group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3d291b] flex items-center gap-2">
              The Little Pots
              <span className="text-xs font-typewriter px-2 py-0.5 rounded bg-[#ebdecb] text-[#5c402c] font-normal border border-[#d2bea3]">
                EST. 1894
              </span>
            </h1>
            <p className="text-xs font-typewriter text-[#7e5a3e] tracking-wide">
              Anonymously Exchanging Letters with Strangers
            </p>
          </div>
        </div>

        {/* Navigation tabs & Auth status */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold shadow-sm border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Pots Received</span>
              <span className="sm:hidden">Inbox</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold shadow-sm border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Cast a Pot</span>
              <span className="sm:hidden">Write</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded text-xs sm:text-sm font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold shadow-sm border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">My Profile</span>
              <span className="sm:hidden">Profile</span>
            </button>
          </nav>

          <div className="h-5 w-[1px] bg-[#cca780] mx-1"></div>

          {/* Account Login / Registration Pill */}
          {currentUser.isRegistered ? (
            <button
              onClick={logout}
              title={`Registered as ${currentUser.name}. Click to log out.`}
              className="px-2.5 py-1.5 bg-[#f3e6d5] hover:bg-[#e8d5be] border border-[#cbb294] rounded text-xs font-typewriter text-[#7e5a3e] flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#8e1b1b]" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1.5 bg-[#8e1b1b] hover:bg-[#751313] text-white rounded-full text-xs font-serif flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? "Disable typewriter clicks" : "Enable typewriter clicks"}
            className="p-1.5 rounded text-[#7e5a3e] hover:bg-[#ebdecb] transition-colors cursor-pointer"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-[#8e1b1b]" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>
        </div>

      </div>
    </header>
  );
};
