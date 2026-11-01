import React, { useState } from 'react';
import { Feather, Stamp, Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS, RANDOM_USERNAMES } from '../lib/mockData';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, authError } = useApp();
  const [isRegisterMode, setIsRegisterMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(() => 
    RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)]
  );
  const [selectedStamp, setSelectedStamp] = useState(VINTAGE_STAMPS[0]);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!username.trim()) throw new Error('Please enter a postal handle / pseudonym.');
        await register(email, password, username, selectedStamp);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setLocalError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#24170e]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="parchment-sheet max-w-md w-full rounded-lg p-6 sm:p-8 border-2 border-[#b5987a] relative shadow-2xl my-8">
        
        {/* Decorative corner postage stamp */}
        <div className="absolute top-4 right-4 hidden sm:block pointer-events-none">
          <div className="postal-stamp text-[10px]">
            {selectedStamp}
          </div>
        </div>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#8e1b1b] bg-[#fbf5eb] flex items-center justify-center text-[#8e1b1b] mx-auto mb-2 shadow-inner">
            <Feather className="w-6 h-6 -rotate-45" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#3d291b]">
            {isRegisterMode ? "Receive Your Postal Registry" : "Unlock Your Post Desk"}
          </h3>
          <p className="font-typewriter text-xs text-[#7e5a3e] mt-1">
            {isRegisterMode 
              ? "Claim an anonymous wanderer identity to seal and preserve your letters across devices."
              : "Welcome back, wanderer. Sign in to check your delivered dispatches."}
          </p>
        </div>

        {/* Error notice */}
        {(localError || authError) && (
          <div className="mb-4 p-2.5 rounded bg-[#fce8e8] border border-[#e5a2a2] text-[#8e1b1b] text-xs font-typewriter">
            {localError || authError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-typewriter text-xs">
          
          {isRegisterMode && (
            <div>
              <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8e1b1b]" />
                <span>Anonymous Postal Handle:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. CinnamonSparrow"
                  className="flex-1 bg-[#fdfbf6] border border-[#cca780] rounded p-2 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                  maxLength={25}
                />
                <button
                  type="button"
                  onClick={() => setUsername(RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)])}
                  className="px-2.5 py-1 bg-[#ede0ce] hover:bg-[#e0cfb8] border border-[#cbb294] rounded text-[11px] text-[#5c402c] cursor-pointer"
                  title="Generate a random pseudonym"
                >
                  🎲 Dice
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8e1b1b]" />
              <span>Email Address:</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="wanderer@example.com"
              className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
            />
          </div>

          <div>
            <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#8e1b1b]" />
              <span>Postal Key / Password:</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
            />
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                <Stamp className="w-3.5 h-3.5 text-[#8e1b1b]" />
                <span>Your Default Vintage Stamp:</span>
              </label>
              <select
                value={selectedStamp}
                onChange={(e) => setSelectedStamp(e.target.value)}
                className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
              >
                {VINTAGE_STAMPS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full wax-button text-white font-serif py-2.5 rounded-full text-sm tracking-wide shadow-wax-seal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Processing Ledger...' : isRegisterMode ? 'Seal & Create Account' : 'Open Post Desk'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

        {/* Mode Toggle & Close */}
        <div className="mt-6 pt-4 border-t border-[#dfceb9] flex items-center justify-between text-xs font-typewriter">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setLocalError('');
            }}
            className="text-[#8e1b1b] hover:underline cursor-pointer font-bold"
          >
            {isRegisterMode ? "Already registered? Sign In" : "Need a registry? Create Account"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-[#7e5a3e] hover:text-[#3d291b] cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        {/* Note on Free & Anonymous Nature */}
        <div className="mt-4 text-[10px] text-[#8c6746] font-typewriter flex items-center gap-1.5 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8e1b1b]" />
          <span>No spam, no real names exposed. Your handle remains fully private.</span>
        </div>

      </div>
    </div>
  );
};
