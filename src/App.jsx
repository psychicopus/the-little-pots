import React, { useState } from 'react';
import { Header } from './components/Header';
import { Compose } from './components/Compose';
import { PotsInbox } from './components/PotsInbox';
import { Profile } from './components/Profile';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { useApp } from './context/AppContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox' | 'compose' | 'profile'
  const { currentUser, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-typewriter text-xs text-[#7e5a3e]">
        <span>Loading postal desk...</span>
      </div>
    );
  }

  // If user is not authenticated/registered, lock into clean Welcome Auth Screen
  if (!currentUser) {
    return <WelcomeAuthScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="transition-all duration-300 max-w-4xl mx-auto px-4">
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

      {/* Retro Postal Footer */}
      <footer className="border-t border-[#d5be9f] py-5 px-4 text-center font-typewriter text-xs text-[#7e5a3e] bg-[#ede0ce]/60 mt-10">
        <p className="font-serif italic text-xs text-[#3d291b]">
          "Words in small vessels, delivered by quiet currents."
        </p>
        <p className="text-[10px] text-[#936e4e] mt-0.5">
          The Little Pots • An Anonymous Text Exchange
        </p>
      </footer>
    </div>
  );
}
