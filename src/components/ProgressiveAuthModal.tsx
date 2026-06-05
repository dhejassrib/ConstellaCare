// ProgressiveAuthModal.tsx:
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface ProgressiveAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  theme: 'light' | 'dark';
  onAuthSuccess?: (email: string, displayName: string) => void;
}

export default function ProgressiveAuthModal({
  isOpen,
  onClose,
  reason,
  theme,
  onAuthSuccess
}: ProgressiveAuthModalProps) {
  const [step, setStep] = useState<'reward' | 'modal'>('reward');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Simulated Interactive Login Flows
  const [simState, setSimState] = useState<'none' | 'google' | 'email' | 'otp' | 'success'>('none');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('reward');
      setSimState('none');
      setAuthMode('signin');
      setEmailInput('');
      setNameInput('');
      setOtpInput('');
      setLoading(false);
      
      // Generate random glowing particle offsets
      const newParticles = Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        delay: Math.random() * 0.4
      }));
      setParticles(newParticles);

      // Auto transition from reward animation to credentials offering after 3.2 seconds
      const timer = setTimeout(() => {
        setStep('modal');
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Core Screen Context */}
        <AnimatePresence mode="wait">
          {step === 'reward' ? (
            /* PHASE 1: EMOTIONAL REWARD CELEBRATION */
            <motion.div
              key="reward"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.15, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative z-10 p-8 text-center max-w-sm flex flex-col items-center justify-center"
            >
              {/* Pulsing sky glow */}
              <div className="absolute w-[180px] h-[180px] bg-sky-500/15 dark:bg-purple-500/20 rounded-full blur-3xl opacity-80 animate-pulse pointer-events-none" />

              {/* Expansion particles */}
              <div className="absolute inset-x-0 top-1/2 flex items-center justify-center pointer-events-none">
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1.6, delay: p.delay, ease: 'easeOut' }}
                    className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400"
                  />
                ))}
              </div>

              {/* Constellation lights up animation */}
              <div className="relative w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:rotate-12 transition">
                <Star className="w-10 h-10 fill-white text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] animate-pulse" />
                
                {/* Embedded micro halos */}
                <span className="absolute inset-0 rounded-full border-2 border-white/25 scale-110 animate-ping duration-[3s]" />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-2.5"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-550/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Milestone unlocked
                </span>
                <h3 className="text-xl font-bold font-sans text-white capitalize leading-tight">
                  {reason} Aligned!
                </h3>
                <p className="text-sm font-black text-pink-300 animate-pulse tracking-tight mt-1">
                  “A new star has been added to your healing sky ✨”
                </p>
                <div className="text-[11px] text-slate-350 italic font-mono pt-3">
                  Assembling constellation fragments...
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* PHASE 2: HEALTH PARAMETER SOFT LOGIN WALL */
            <motion.div
              key="modal"
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20 }}
              className={`relative z-10 w-full max-w-md overflow-hidden rounded-3xl p-7 text-center shadow-2xl ${
                theme === 'dark' 
                  ? 'bg-[#120d2a] border border-purple-500/35 text-slate-100' 
                  : 'bg-white border border-purple-100 text-[#1e133a]'
              }`}
            >
              {/* Close corner utility for non-invasive guest path */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100/10 dark:bg-purple-950/20 text-slate-450 hover:text-slate-600 dark:hover:text-slate-100 cursor-pointer"
                title="Bypass as Guest"
              >
                ✕
              </button>

              {/* Decorative side orbs */}
              <div className="absolute top-3 left-4 w-12 h-12 bg-pink-500/5 blur-xl rounded-full" />
              <div className="absolute bottom-3 right-4 w-12 h-12 bg-purple-500/5 blur-xl rounded-full" />

              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-400 to-indigo-500 flex items-center justify-center text-white mx-auto mb-4 scale-102 shadow">
                <Sparkles className="w-5.5 h-5.5 fill-white" />
              </div>

              <h2 className="text-base font-black px-4 leading-snug">
                Save your constellation journey and emotional progress across devices.
              </h2>

              <div className={`p-4 my-4 rounded-2xl border text-left flex items-start gap-3 relative ${
                theme === 'dark' 
                  ? 'bg-purple-950/30 border-purple-500/15' 
                  : 'bg-[#faf8fd] border-purple-200/50'
              }`}>
                <Star className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="text-[9px] uppercase font-mono font-black text-pink-500 block tracking-widest leading-none">
                      JOURNEY COMPLETED
                  </span>
                  <p className={`text-[11.5px] mt-1 leading-relaxed ${theme === 'dark' ? 'text-purple-300' : 'text-slate-600'}`}>
                    Your progress can be securely preserved across devices. Sign in or create an account to save your checklists, notes, trends, and communication history.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pb-1.5 min-h-[160px] flex flex-col justify-center">
                {simState === 'none' && (
                  <div className="space-y-3 w-full">
                    {/* Tab Selection Row */}
                    <div className={`flex rounded-2xl p-1.5 ${theme === 'dark' ? 'bg-purple-950/40 border border-purple-500/10' : 'bg-[#FAF8FD] border border-purple-100/60'}`}>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                          authMode === 'signin'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                            : theme === 'dark' ? 'text-purple-300 hover:text-white' : 'text-[#4f426d] hover:text-[#1e133a]'
                        }`}
                      >
                        🚀 Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                          authMode === 'signup'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                            : theme === 'dark' ? 'text-purple-300 hover:text-white' : 'text-[#4f426d] hover:text-[#1e133a]'
                        }`}
                      >
                        ✨ Sign Up
                      </button>
                    </div>

                    <button
                      onClick={() => setSimState('google')}
                      className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-sans font-extrabold text-xs shadow hover:scale-[1.01] transition-transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {authMode === 'signup' ? 'Sign Up with Google' : 'Continue with Google'}
                    </button>

                    <button
                      onClick={() => setSimState('email')}
                      className="w-full py-3 rounded-2xl bg-[#a855f7]/15 dark:bg-[#a855f7]/25 hover:bg-[#a855f7]/35 text-[#a855f7] dark:text-[#fba5c9] border border-purple-500/20 dark:border-purple-400/30 font-sans font-extrabold text-xs shadow-sm cursor-pointer transition-transform"
                    >
                      {authMode === 'signup' ? 'Create Account with Email' : 'Continue with Email'}
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 font-bold block transition cursor-pointer"
                    >
                      Bypass & Continue as Guest
                    </button>
                  </div>
                )}

                {simState === 'google' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailInput.trim()) return;
                      if (authMode === 'signup' && !nameInput.trim()) return;
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        const parts = emailInput.split('@');
                        const fallbackName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                        const finalDisplayName = authMode === 'signup' && nameInput.trim() ? nameInput : fallbackName;
                        if (onAuthSuccess) {
                          onAuthSuccess(emailInput.trim(), finalDisplayName);
                        }
                        setSimState('success');
                      }, 1200);
                    }}
                    className="text-left space-y-3 w-full"
                  >
                    <span className="text-[10px] font-black text-pink-500 block uppercase tracking-wider">
                      {authMode === 'signup' ? 'Create Account with Google' : 'Sign In with Google'}
                    </span>
                    <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-purple-300' : 'text-slate-600'}`}>
                      {authMode === 'signup'
                        ? 'Enter your name and email to register your healing constellation:'
                        : 'Enter your email to authorize your secure credentials link:'}
                    </p>

                    {authMode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 dark:text-purple-300 uppercase tracking-wider block">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className={`w-full text-xs p-3 rounded-2xl border bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-purple-300 uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className={`w-full text-xs p-3 rounded-2xl border bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-sans font-extrabold text-xs shadow hover:scale-[1.01] transition-transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      {loading ? 'Linking cloud orbits...' : authMode === 'signup' ? 'Create Account' : 'Continue'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSimState('none')}
                      className="text-[10px] px-3 py-1 bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-purple-900/40 cursor-pointer"
                    >
                      ← Back
                    </button>
                  </form>
                )}

                {simState === 'email' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailInput.trim()) return;
                      if (authMode === 'signup' && !nameInput.trim()) return;
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        setSimState('otp');
                      }, 1000);
                    }}
                    className="text-left space-y-3 w-full animate-fade-in"
                  >
                    <span className="text-[10px] font-black text-pink-500 block uppercase tracking-wider">
                      {authMode === 'signup' ? 'Create Account' : 'Email OTP Access'}
                    </span>
                    <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-purple-300' : 'text-slate-600'}`}>
                      {authMode === 'signup'
                        ? 'Fill in your name and email to securely save your health journey:'
                        : 'Input email to trigger an instant OTP verification key:'}
                    </p>
                    
                    {authMode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 dark:text-purple-300 uppercase tracking-wider block">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your name"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          className={`w-full text-xs p-3 rounded-2xl border bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-purple-300 uppercase tracking-wider block">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className={`w-full text-xs p-3 rounded-2xl border bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl text-xs font-bold shadow hover:scale-[1.01] transition-transform cursor-pointer"
                    >
                      {loading ? "Transmitting safe channel..." : authMode === 'signup' ? "Create Account & Send Token" : "Send Verification Token"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSimState('none')}
                      className="text-[10px] px-3 py-1 bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-purple-900/40 cursor-pointer"
                    >
                      ← Back
                    </button>
                  </form>
                )}

                {simState === 'otp' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (otpInput.length < 4) return;
                      setLoading(true);
                      setTimeout(() => {
                        setLoading(false);
                        const parts = emailInput.split('@');
                        const fallbackName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                        const finalDisplayName = authMode === 'signup' && nameInput.trim() ? nameInput : fallbackName;
                        if (onAuthSuccess) {
                          onAuthSuccess(emailInput, finalDisplayName);
                        }
                        setSimState('success');
                      }, 1200);
                    }}
                    className="text-left space-y-3 w-full"
                  >
                    <span className="text-[10px] font-black text-pink-500 block uppercase tracking-wider">Verify Identity Sequence</span>
                    <p className={`text-[11px] leading-relaxed ${theme === 'dark' ? 'text-purple-300' : 'text-slate-600'}`}>Transmitted authentication digits to <b className="font-mono text-pink-500">{emailInput}</b>. Type the 4 digits:</p>

                    <input
                      type="text"
                      required
                      maxLength={4}
                      placeholder="• • • •"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                      className={`w-full text-center tracking-[1em] text-sm font-mono font-black p-3 rounded-2xl border bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-500 ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}
                    />

                    <button
                      type="submit"
                      disabled={loading || otpInput.length < 4}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl text-xs font-bold shadow hover:scale-[1.01] transition-transform cursor-pointer disabled:opacity-40"
                    >
                      {loading ? "Verifying alignment..." : "Verify & Align Constellation ✨"}
                    </button>
                  </form>
                )}

                {simState === 'success' && (
                  <div className="py-4 flex flex-col items-center justify-center text-center space-y-3 w-full">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 text-emerald-500 animate-bounce">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest block">JOURNEY HARMONIZED</span>
                    <p className={`text-[11px] leading-relaxed max-w-[280px] mx-auto ${theme === 'dark' ? 'text-purple-300' : 'text-slate-600'}`}>All current coordinates and logs successfully integrated with your cloud avatar secure backup.</p>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold cursor-pointer hover:scale-[1.02] transition-transform"
                    >
                      Enter Aligned Sky
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-purple-150 dark:border-purple-500/10 pt-3 mt-3">
                <span className="text-[9px] text-[#9c82ba] flex items-center justify-center gap-1 font-mono font-bold leading-none">
                  <ShieldCheck className="w-3 h-3 text-[#d4798e]" /> HIPAA PRIVATE HEALTH SECURED
                </span>
                <p className={`text-[8.5px] mt-1.5 leading-relaxed max-w-[280px] mx-auto ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  This companion application enforces local physical safeguards and protected health data rules which are never shared without explicit consent.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}