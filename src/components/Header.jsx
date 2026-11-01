import React from 'react';
import { Mail, Send, User, Volume2, VolumeX, Feather, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ activeTab, setActiveTab }) => {
  const { currentUser, audioEnabled, setAudioEnabled, logoutUser } = useApp();

  return (
    <header className="border-b border-[#d2bea3] bg-[#fbf6ec]/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('inbox')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full border border-[#8e1b1b] bg-[#fcf8f0] flex items-center justify-center text-[#8e1b1b] shadow-inner group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-tight text-[#3d291b] flex items-center gap-1.5 leading-none">
              The Little Pots
            </h1>
            <p className="text-[10px] font-typewriter text-[#7e5a3e] tracking-wide mt-0.5">
              Postal Dispatches
            </p>
          </div>
        </div>

        {/* Clean Unified Navigation */}
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-3 py-1.5 rounded text-xs font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'inbox'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inbox</span>
            </button>

            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3 py-1.5 rounded text-xs font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded text-xs font-typewriter flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#e4d4bd] text-[#2c1d13] font-bold border border-[#c5b095]'
                  : 'text-[#6f5038] hover:bg-[#ede0ce]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </nav>

          <div className="h-4 w-[1px] bg-[#cca780] mx-1"></div>

          {/* User Handle & Logout */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-typewriter text-[#3d291b] font-bold hidden md:inline">
              {currentUser?.name}
            </span>
            <button
              onClick={logoutUser}
              title="Sign Out"
              className="p-1.5 bg-[#f3e6d5] hover:bg-[#e5d0b5] border border-[#cbb294] rounded text-xs font-typewriter text-[#8e1b1b] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? "Mute typewriter sound" : "Enable typewriter sound"}
            className="p-1.5 rounded text-[#7e5a3e] hover:bg-[#ebdecb] transition-colors cursor-pointer"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#8e1b1b]" /> : <VolumeX className="w-3.5 h-3.5 opacity-40" />}
          </button>
        </div>

      </div>
    </header>
  );
};
