import React, { useState } from 'react';
import { Feather, Lock, Mail, User, ArrowRight, Stamp, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VINTAGE_STAMPS, RANDOM_USERNAMES } from '../lib/mockData';

export const WelcomeAuthScreen = () => {
  const { loginUser, registerUser } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regUsername, setRegUsername] = useState(() => 
    RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)]
  );
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStamp, setRegStamp] = useState(VINTAGE_STAMPS[0]);

  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginUser(loginEmail, loginPassword);
    } catch (err) {
      setErrorMsg(err.message || 'Incorrect credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      if (!regUsername.trim()) throw new Error('Please enter a pseudonym / username.');
      await registerUser(regEmail, regPassword, regUsername, regStamp);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
      {/* Decorative Postal Stamp Header */}
      <div className="w-full max-w-md text-center mb-6">
        <div className="w-14 h-14 rounded-full border-2 border-[#8e1b1b] bg-[#fdf8f0] flex items-center justify-center text-[#8e1b1b] mx-auto mb-3 shadow-inner">
          <Feather className="w-7 h-7 -rotate-45" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#3d291b]">
          The Little Pots
        </h1>
        <p className="font-typewriter text-xs text-[#7e5a3e] tracking-widest uppercase mt-1">
          Vintage Postal Text Exchange
        </p>
      </div>

      {/* Main Parchment Card */}
      <div className="parchment-sheet max-w-md w-full rounded-lg p-6 sm:p-8 border border-[#cca780] shadow-2xl relative">
        
        {/* Postal Stamp Badge */}
        <div className="absolute top-4 right-4 pointer-events-none hidden sm:block">
          <div className="postal-stamp text-[9px]">
            POSTAGE PAID
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-[#fce8e8] border border-[#e5a2a2] text-[#8e1b1b] text-xs font-typewriter">
            {errorMsg}
          </div>
        )}

        {mode === 'login' ? (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#3d291b]">WELCOME</h2>
              <p className="font-typewriter text-xs text-[#7e5a3e] mt-0.5">
                Please enter your credentials to open your post desk.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 font-typewriter text-xs">
              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>USER ID / EMAIL:</span>
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="wanderer@example.com"
                  className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                />
              </div>

              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>PASSWORD:</span>
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full wax-button text-white font-serif py-2.5 rounded-full text-sm tracking-wide shadow-wax-seal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Opening Desk...' : 'LOGIN'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 pt-4 border-t border-[#dfceb9] text-center font-typewriter text-xs">
              <span className="text-[#7e5a3e]">New here? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="text-[#8e1b1b] font-bold hover:underline cursor-pointer ml-1"
              >
                Register now!
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#3d291b]">REGISTER</h2>
              <p className="font-typewriter text-xs text-[#7e5a3e] mt-0.5">
                Claim your anonymous persona and begin exchanging dispatches.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 font-typewriter text-xs">
              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>CHOOSE A PSEUDONYM:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. QuietSparrow"
                    className="flex-1 bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                    maxLength={25}
                  />
                  <button
                    type="button"
                    onClick={() => setRegUsername(RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)])}
                    className="px-2.5 py-1 bg-[#ede0ce] hover:bg-[#dfcdb5] border border-[#cca780] rounded text-[11px] text-[#5c402c] cursor-pointer"
                    title="Roll random pseudonym"
                  >
                    🎲 Roll
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>EMAIL ADDRESS:</span>
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="wanderer@example.com"
                  className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                />
              </div>

              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>PASSWORD:</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                />
              </div>

              <div>
                <label className="block text-[#5c402c] font-bold mb-1 flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-[#8e1b1b]" />
                  <span>PREFERRED POSTAL STAMP:</span>
                </label>
                <select
                  value={regStamp}
                  onChange={(e) => setRegStamp(e.target.value)}
                  className="w-full bg-[#fdfbf6] border border-[#cca780] rounded p-2.5 text-[#2c1d13] focus:outline-none focus:border-[#8e1b1b]"
                >
                  {VINTAGE_STAMPS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full wax-button text-white font-serif py-2.5 rounded-full text-sm tracking-wide shadow-wax-seal flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering...' : 'REGISTER & ENTER'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Switch back to Login */}
            <div className="mt-6 pt-4 border-t border-[#dfceb9] text-center font-typewriter text-xs">
              <span className="text-[#7e5a3e]">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="text-[#8e1b1b] font-bold hover:underline cursor-pointer ml-1"
              >
                Return to Login
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="mt-6 text-center font-typewriter text-xs text-[#7e5a3e]">
        No ads • No algorithms • Pure human dispatches
      </div>
    </div>
  );
};
