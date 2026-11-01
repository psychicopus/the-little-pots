import React, { useState } from 'react';
import { Header } from './components/Header';
import { Compose } from './components/Compose';
import { PotsInbox } from './components/PotsInbox';
import { Profile } from './components/Profile';
import { AuthModal } from './components/AuthModal';
import { WelcomeBanner } from './components/WelcomeBanner';
import { useApp } from './context/AppContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'compose' | 'profile'
  const { isAuthModalOpen, setIsAuthModalOpen, currentUser } = useApp();
  
  // Track whether welcome banner has been dismissed in current browser session
  const [dismissBanner, setDismissBanner] = useState(() => {
    return localStorage.getItem('little_pots_banner_seen') === 'true';
  });

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="transition-all duration-300 max-w-4xl mx-auto px-4 pt-6">
          
          {/* Onboarding Welcome Story for new or guest visitors */}
          {!dismissBanner && (
            <WelcomeBanner
              onGetStarted={() => {
                setActiveTab('compose');
                localStorage.setItem('little_pots_banner_seen', 'true');
                setDismissBanner(true);
              }}
              onLearnMore={() => setIsAuthModalOpen(true)}
            />
          )}

          {activeTab === 'inbox' && (
            <PotsInbox onOpenCompose={() => setActiveTab('compose')} />
          )}

          {activeTab === 'compose' && (
            <Compose onSent={() => setActiveTab('inbox')} />
          )}

          {activeTab === 'profile' && (
            <Profile onOpenCompose={() => setActiveTab('compose')} />
          )}
        </main>
      </div>

      {/* Auth & Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Retro Postal Footer */}
      <footer className="border-t border-[#d5be9f] py-6 px-4 text-center font-typewriter text-xs text-[#7e5a3e] bg-[#ede0ce]/60 mt-12">
        <div className="max-w-2xl mx-auto space-y-1">
          <p className="font-serif italic text-sm text-[#3d291b]">
            "Words in small vessels, delivered by quiet currents."
          </p>
          <p className="text-[11px] text-[#936e4e]">
            The Little Pots • Free & Open Source Text Exchange • No Algorithms, Just Strangers
          </p>
        </div>
      </footer>
    </div>
  );
}
