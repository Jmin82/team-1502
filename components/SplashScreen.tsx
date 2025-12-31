
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

// Hero Section과 동일한 스타일을 유지하기 위한 컴포넌트
const GlowingText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative inline-block">
    <span className="relative z-10 block text-transparent" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>{children}</span>
    <span className="absolute inset-0 z-20 block text-transparent animate-gradient-flow pointer-events-none select-none" style={{ backgroundImage: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #ff006e)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text' }}>{children}</span>
    <span className="absolute inset-0 z-30 block text-transparent animate-shine pointer-events-none select-none mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextStroke: '1px transparent' }}>{children}</span>
  </div>
);

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<
    'idle' | 'typing_agency' | 'deleting_agency' | 'typing_team' | 'morphing' | 'revealing' | 'finished'
  >('idle');

  // Hero.tsx의 폰트 사이즈와 정확히 일치시켜야 함
  // text-[22vw] md:text-[10vw] leading-[0.8] md:leading-tight
  const baseTextClass = "text-[22vw] md:text-[10vw] leading-[0.8] md:leading-tight font-jalnan tracking-tight select-none whitespace-nowrap flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8";

  useEffect(() => {
    // Prevent restart if already finished
    if (phase === 'finished') return;

    let isMounted = true;

    const runSequence = async () => {
      // 1. Idle (Cursor blinking)
      if (!isMounted) return;
      setPhase('idle');
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;

      // 2. Type "AI AGENCY"
      setPhase('typing_agency');
      const text1 = "AI AGENCY";
      for (let i = 0; i <= text1.length; i++) {
        if (!isMounted) return;
        setText(text1.slice(0, i));
        await new Promise(r => setTimeout(r, 80 + Math.random() * 30)); // Natural typing speed
      }
      await new Promise(r => setTimeout(r, 1000)); // Wait before deleting
      if (!isMounted) return;

      // 3. Delete "AI AGENCY"
      setPhase('deleting_agency');
      for (let i = text1.length; i >= 0; i--) {
        if (!isMounted) return;
        setText(text1.slice(0, i));
        await new Promise(r => setTimeout(r, 30)); // Fast delete
      }
      await new Promise(r => setTimeout(r, 300)); // Brief pause
      if (!isMounted) return;

      // 4. Type "TEAM 1502"
      setPhase('typing_team');
      const text2 = "TEAM 1502";
      // We need to handle the space carefully if we want to mimic the final layout (TEAM [gap] 1502)
      // For typing effect, we'll type straight string first.
      for (let i = 0; i <= text2.length; i++) {
        if (!isMounted) return;
        setText(text2.slice(0, i));
        await new Promise(r => setTimeout(r, 90 + Math.random() * 40));
      }
      await new Promise(r => setTimeout(r, 600));
      if (!isMounted) return;

      // 5. Morph to Gradient (Instant switch to enable styles)
      setPhase('morphing');
      await new Promise(r => setTimeout(r, 1500)); // Show gradient text on black for a moment
      if (!isMounted) return;

      // 6. Reveal Background
      setPhase('revealing');
      onComplete(); // Notify App to enable scroll/animations underneath
      await new Promise(r => setTimeout(r, 1000)); // Allow fade out animation to finish
      if (!isMounted) return;

      setPhase('finished');
    };

    runSequence();

    return () => { isMounted = false; };
  }, [onComplete]); // Keep dependency, logic inside handles the checks

  if (phase === 'finished') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#fafafa] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === 'revealing' ? 0 : 1,
        pointerEvents: phase === 'revealing' ? 'none' : 'auto'
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative w-full flex flex-col items-center justify-center">
        {/* White Background Layer (to ensure solid background until reveal) */}
        {/* We use #fafafa which matches the body background */}
        
        {/* Render Text */}
        <div className={baseTextClass}>
          {phase === 'morphing' || phase === 'revealing' ? (
            // Morphing State: Render matching the Hero component exactly
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               transition={{ duration: 0.8 }}
               className="flex flex-col md:flex-row items-center justify-center"
            >
              <GlowingText>TEAM</GlowingText>
              <span className="block w-4 md:w-8 h-4 md:h-auto"></span>
              <GlowingText>1502</GlowingText>
            </motion.div>
          ) : (
            // Typing State: Simple black text
            <span className="text-neutral-900 inline-flex items-center">
              {text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="inline-block w-[1.5vw] h-[14vw] md:h-[7vw] bg-blue-600 ml-2 align-middle translate-y-[1vw]"
              />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
