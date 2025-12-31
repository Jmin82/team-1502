
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  // Smooth spring animation for the progress value
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setProgress(Math.round(latest * 100));
    });
  }, [smoothProgress]);

  // Transform for the circle dashoffset
  const circumference = 2 * Math.PI * 18; // radius 18
  const strokeDashoffset = useTransform(smoothProgress, value => circumference - (value * circumference));

  return (
    <motion.div 
      className="fixed bottom-[260px] right-7 z-[90] hidden md:flex flex-col items-center gap-2 mix-blend-difference pointer-events-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
    >
      {/* Percentage Text */}
      <span className="text-[10px] font-bold font-sans text-white tracking-widest tabular-nums">
        {progress}%
      </span>

      {/* Circular Indicator */}
      <div className="relative w-12 h-12 -rotate-90">
        <svg className="w-full h-full" viewBox="0 0 40 40">
          {/* Track */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/20"
          />
          {/* Progress */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white"
            strokeDasharray={circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Center Dot pulsing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full animate-pulse" />
      </div>

      <span className="text-[8px] font-bold font-sans text-white/50 uppercase tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
        Scroll
      </span>
      
      {/* Visual Connector Line to buttons below */}
      <div className="w-[1px] h-8 bg-gradient-to-b from-white/50 to-transparent mt-2"></div>
    </motion.div>
  );
};

export default ScrollProgress;
