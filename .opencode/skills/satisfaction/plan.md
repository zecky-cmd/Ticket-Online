import React, { useState, useEffect, useRef } from 'react';
import { Check, X, RefreshCw, Sparkles, Heart, ThumbsUp, Send, ShieldCheck, Star } from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(true);
  const [theme, setTheme] = useState('emerald'); // emerald, forest, deep
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [autoClose, setAutoClose] = useState(true);
  const [progress, setProgress] = useState(100);
  const canvasRef = useRef(null);

  // Theme configurations
 const themes = {
    emerald: {
      name: 'Émeraude Moderne',
      bgHeader: 'bg-emerald-600',
      headerGradient: 'from-emerald-700 via-emerald-600 to-teal-600',
      accent: 'emerald',
      textAccent: 'text-emerald-600',
      bgAccent: 'bg-emerald-600',
      ringColor: 'rgba(5, 150, 105, 0.25)',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      btnHover: 'hover:bg-emerald-700',
    },
    forest: {
      name: 'Vert Prestige (Original)',
      bgHeader: 'bg-emerald-800',
      headerGradient: 'from-emerald-900 via-emerald-800 to-green-800',
      accent: 'green',
      textAccent: 'text-emerald-800',
      bgAccent: 'bg-emerald-800',
      ringColor: 'rgba(6, 78, 59, 0.25)',
      glowColor: 'rgba(4, 120, 87, 0.4)',
      btnHover: 'hover:bg-emerald-900',
    },
    deep: {
      name: 'Nuit & Luxe',
      bgHeader: 'bg-slate-900',
      headerGradient: 'from-slate-950 via-slate-900 to-emerald-950',
      accent: 'teal',
      textAccent: 'text-teal-500',
      bgAccent: 'bg-teal-600',
      ringColor: 'rgba(20, 184, 166, 0.25)',
      glowColor: 'rgba(45, 212, 191, 0.4)',
      btnHover: 'hover:bg-teal-700',
    }
  };

  const currentTheme = themes[theme];

  // Trigger animation replay
  const replayAnimation = () => {
    setIsOpen(false);
    setShowConfetti(false);
    setProgress(100);
    setTimeout(() => {
      setAnimationKey(prev => prev + 1);
      setIsOpen(true);
    }, 300);
  };

  // Trigger light particle effect on canvas
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setShowConfetti(true);
      triggerParticles();
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen, animationKey]);

  // Handle auto close timer progress
  useEffect(() => {
    if (!isOpen || !autoClose) {
      setProgress(100);
      return;
    }

    const duration = 6000; // 6 seconds
    const interval = 50; // update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setIsOpen(false);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, autoClose, animationKey]);

  // Minimal custom particle logic
  const triggerParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const particles = [];
    const colors = theme === 'emerald' 
      ? ['#10B981', '#34D399', '#6EE7B7', '#FBBF24', '#3B82F6']
      : theme === 'forest' 
      ? ['#047857', '#10B981', '#A7F3D0', '#F59E0B', '#10B981']
      : ['#14B8A6', '#2DD4BF', '#99F6E4', '#F43F5E', '#818CF8'];

    // Spawn 45 particles around check center
    const centerX = width / 2;
    const centerY = height * 0.38;

    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 3 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.96 + Math.random() * 0.03,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
        rotation: Math.random() * Math.PI
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach(p => {
        if (p.alpha > 0.01) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.08; // gravity
          p.alpha *= p.life;
          p.rotation += 0.1;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          }

          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#1e293b,0%,#0f172a_100%)] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Control Panel (Top Header) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-wide">Borne de Satisfaction — Modal Chic</h1>
            <p className="text-xs text-slate-400">Design optimisé sans texte de décompte encombrant</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          {/* Theme Switcher */}
          <div className="flex bg-slate-800/90 p-1 rounded-lg border border-slate-700/60 text-xs">
            {Object.keys(themes).map((tKey) => (
              <button
                key={tKey}
                onClick={() => { setTheme(tKey); replayAnimation(); }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 ${
                  theme === tKey 
                    ? 'bg-slate-700 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {themes[tKey].name}
              </button>
            ))}
          </div>

          {/* Replay Button */}
          <button
            onClick={replayAnimation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rejouer
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        
        {/* Toggle Modal Trigger when closed */}
        {!isOpen && (
          <button
            onClick={replayAnimation}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group animate-bounce"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Afficher la modale de confirmation
          </button>
        )}

        {/* MODAL CARD */}
        {isOpen && (
          <div 
            key={animationKey}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 transition-all duration-500 animate-modal-pop"
          >
            {/* Top Auto-Close Subtle Progress Line */}
            {autoClose && (
              <div className="w-full h-1 bg-slate-100 overflow-hidden absolute top-0 left-0 z-30">
                <div 
                  className={`h-full ${currentTheme.bgAccent} transition-all duration-75 ease-linear`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Canvas for Particle Sparkles */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 pointer-events-none z-20 w-full h-full"
            />

            {/* Modal Header */}
            <div className={`relative px-6 py-5 bg-gradient-to-r ${currentTheme.headerGradient} text-white flex items-start justify-between z-10 overflow-hidden`}>
              
              {/* Subtle overlay shine */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(255,255,255,0.25),transparent_70%)] pointer-events-none" />

              <div className="flex items-center gap-3.5 z-10">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                  <Heart className="w-5 h-5 text-white fill-white/20 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white leading-snug">
                    Satisfaction Client
                  </h2>
                  <p className="text-xs text-emerald-100/80 font-normal">
                    Votre avis compte — quelques clics suffisent
                  </p>
                </div>
              </div>

              {/* Close Icon Button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors duration-200"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="px-7 pt-9 pb-8 flex flex-col items-center text-center relative z-10 bg-white">
              
              {/* CHECKMARK ANIMATED CONTAINER */}
              <div className="relative mb-6 flex items-center justify-center">
                
                {/* Glowing Background Ripples */}
                <div className="absolute w-28 h-28 rounded-full animate-ping-slow opacity-20" style={{ backgroundColor: currentTheme.glowColor }} />
                <div className="absolute w-24 h-24 rounded-full animate-pulse-glow opacity-30" style={{ backgroundColor: currentTheme.glowColor }} />

                {/* Main Circle Icon Outer Ring */}
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-slate-50 to-emerald-50/50 flex items-center justify-center border border-slate-100 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.25)]">
                  
                  {/* Green Inner Pill */}
                  <div className={`w-14 h-14 rounded-full ${currentTheme.bgAccent} flex items-center justify-center shadow-lg shadow-emerald-600/30 transform transition-transform duration-500 scale-100 animate-check-bounce`}>
                    
                    {/* SVG Drawn Checkmark */}
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline 
                        points="20 6 9 17 4 12" 
                        className="animate-draw-check" 
                        style={{
                          strokeDasharray: 30,
                          strokeDashoffset: 30,
                          animation: 'drawCheck 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.25s forwards'
                        }}
                      />
                    </svg>

                  </div>
                </div>
              </div>

              {/* STAGGERED TEXT CONTENT */}
              <div className="space-y-2.5 max-w-sm mb-7">
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight animate-fade-slide-up opacity-0" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
                  Merci pour votre retour !
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal animate-fade-slide-up opacity-0" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
                  Votre avis a été transmis à la <span className="font-semibold text-slate-700">direction qualité</span> pour améliorer en continu votre expérience en agence.
                </p>
              </div>

              {/* MAIN ACTION BUTTON */}
              <div className="w-full max-w-xs animate-fade-slide-up opacity-0" style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300/80 text-slate-800 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] border border-slate-200/70 flex items-center justify-center gap-2 group"
                >
                  <span>Fermer</span>
                </button>
              </div>

              {/* Discreet Auto-close indicator (Clean line, no bulky text) */}
              {autoClose && (
                <p className="mt-4 text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1.5 opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Fermeture automatique
                </p>
              )}

            </div>

            {/* Bottom Footer Accent Ribbon */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />
          </div>
        )}

      </main>

      {/* Feature Highlights Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500 border-t border-slate-800/60">
        <div className="flex items-center justify-center gap-4 mb-2 sm:mb-0">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300 transition-colors">
            <input 
              type="checkbox" 
              checked={autoClose} 
              onChange={(e) => setAutoClose(e.target.checked)} 
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
            />
            <span>Minuteur de fermeture automatique</span>
          </label>
        </div>

        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Design UX Borne Tactile — Haute Fidélité</span>
        </div>
      </footer>

      {/* Embedded Custom Keyframe Animations */}
      <style>{`
        @keyframes drawCheck {
          0% { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes checkBounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          75% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.25; }
          50% { transform: scale(1.12); opacity: 0.45; }
        }

        @keyframes pingSlow {
          0% { transform: scale(0.9); opacity: 0.4; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .animate-modal-pop {
          animation: modalPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-check-bounce {
          animation: checkBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards;
        }

        .animate-fade-slide-up {
          animation: fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-pulse-glow {
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        .animate-ping-slow {
          animation: pingSlow 2s infinite cubic-bezier(0, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}