
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Our Team', href: '#members' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset mute state when menu closes
  useEffect(() => {
    if (!isOpen) {
      setIsMuted(true);
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  // 1. Logo Click Handler: Reset to Home
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      // Toggle the state
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      // Directly manipulating ref ensures immediate response for video element
      videoRef.current.muted = nextMuted;
    }
  };

  return (
    <header className="fixed top-4 md:top-6 left-0 right-0 z-[100] flex justify-center w-full pointer-events-none px-4">
      {/* Backdrop Overlay for Mobile/Desktop when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav 
        initial={false}
        animate={{
          width: isOpen ? '95vw' : (scrolled ? '280px' : '320px'),
          height: isOpen ? 'auto' : '64px', // Height adapts to content (square cards)
          borderRadius: isOpen ? '32px' : '100px',
          maxWidth: isOpen ? '1000px' : (scrolled ? '280px' : '320px')
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 30,
          mass: 0.8
        }}
        className={`
          group/nav pointer-events-auto relative overflow-hidden transition-shadow duration-300 
          ${isOpen ? 'shadow-2xl shadow-blue-900/20' : 'shadow-lg shadow-black/5'}
        `}
      >
        {/* ==============================================
            1. Moving Border Layer
            ============================================== */}
        <div className="absolute inset-0 pointer-events-none z-0 rounded-[inherit] overflow-hidden">
            <div 
              className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -ml-[100%] -mt-[100%] animate-spin-slow opacity-70"
              style={{
                background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 40%, #3b82f6 50%, transparent 60%, transparent 100%)`
              }}
            />
             <div 
              className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -ml-[100%] -mt-[100%] animate-spin-slow opacity-40"
              style={{
                background: `conic-gradient(from 270deg at 50% 50%, transparent 0%, transparent 40%, #a855f7 50%, transparent 60%, transparent 100%)`,
                animationDuration: '7s'
              }}
            />
        </div>

        {/* 
            2. Main Background Cover (Glassmorphism Mask) 
        */}
        <div 
          className={`
            absolute inset-[1.5px] rounded-[inherit] z-[1] border border-white/40 transition-all duration-500
            ${!isOpen && scrolled 
                ? 'bg-white/40 backdrop-blur-md group-hover/nav:bg-white/90 group-hover/nav:backdrop-blur-xl' 
                : 'bg-white/90 backdrop-blur-xl'}
          `}
        >
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        {/* 3. Content Area */}
        <div className="relative z-10 w-full h-full flex flex-col">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full h-[64px] px-2 flex-none z-50">
            {/* Logo */}
            <a 
              href="#" 
              className="pl-6 relative group cursor-pointer block"
              onClick={handleLogoClick}
            >
              <span className="font-black text-lg text-brand-text tracking-tighter font-jalnan relative z-10 group-hover:text-blue-600 transition-colors">
                {isOpen ? 'TEAM 1502' : '1502'}
              </span>
            </a>

            {/* Desktop Status / Indicator */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center">
              <AnimatePresence mode="wait">
                {!isOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100/50 border border-neutral-200/50 backdrop-blur-sm"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase font-sans">
                      Ai Agency
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Burger Button (2-Lines to X Fixed) */}
            <button 
              type="button"
              onClick={toggleMenu}
              className={`
                group w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer mr-2 relative z-[110] hover:scale-105 active:scale-95
                ${isOpen ? 'bg-neutral-100 text-neutral-900' : 'bg-neutral-900 text-white hover:bg-blue-600'}
              `}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                {/* Top Line */}
                <motion.span 
                  initial={false}
                  animate={{ 
                    rotate: isOpen ? 45 : 0, 
                    y: isOpen ? 0 : -3 
                  }}
                  className={`absolute w-full h-[1.5px] rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'bg-neutral-900' : 'bg-current'}`} 
                />
                
                {/* Bottom Line */}
                <motion.span 
                  initial={false}
                  animate={{ 
                    rotate: isOpen ? -45 : 0, 
                    y: isOpen ? 0 : 3 
                  }}
                  className={`absolute w-full h-[1.5px] rounded-full transition-all duration-300 ease-in-out ${isOpen ? 'bg-neutral-900' : 'bg-current'}`} 
                />
              </div>
            </button>
          </div>

          {/* Expanded Menu Content */}
          <div className="w-full relative">
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="w-full px-4 md:px-8 pb-4 md:pb-8 pt-2 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8"
                >
                  {/* LEFT: Nav Links - SQUARE ASPECT RATIO */}
                  <div className="relative z-20 w-full aspect-square shrink-0 order-2 md:order-1">
                    <div className="bg-white/40 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/20 p-6 md:p-8 shadow-lg h-full flex flex-col justify-between">
                      <div className="flex flex-col gap-3 md:gap-4 items-start justify-center flex-1">
                        {navItems.map((item, idx) => (
                          <motion.a 
                            key={item.label} 
                            href={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                            onClick={() => setIsOpen(false)}
                            className="relative group block overflow-hidden cursor-pointer"
                          >
                            {/* 2. Trendy Rolling Text Effect - Adjusted sizes for mobile */}
                            <div className="relative">
                              <span className="block text-3xl md:text-5xl lg:text-6xl font-display font-medium text-neutral-800 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                                {item.label}
                              </span>
                              <span className="absolute top-0 left-0 block text-3xl md:text-5xl lg:text-6xl font-display font-medium text-blue-600 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0">
                                {item.label}
                              </span>
                            </div>

                            {/* Dynamic Arrow Indicator */}
                            <div className="absolute top-1 -right-6 md:top-2 md:-right-8 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 group-hover:translate-x-2 transition-all duration-500 ease-out">
                               <Icon icon="solar:arrow-right-up-linear" className="text-2xl md:text-3xl text-blue-500" />
                            </div>
                          </motion.a>
                        ))}
                      </div>

                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 flex flex-col gap-1 border-t border-neutral-200/50 pt-4"
                      >
                        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold font-sans">
                          Seoul, Korea
                        </p>
                        <p className="text-xs md:text-sm text-neutral-600 font-sans font-light">
                           AI Automation & Marketing<br/>
                           Since 2024
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* RIGHT: Video Player - SQUARE ASPECT RATIO */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                    className="relative w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black shadow-2xl shadow-blue-900/10 border border-neutral-100 order-1 md:order-2 shrink-0"
                  >
                     <div className="absolute inset-0 z-0">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted={isMuted}
                          loop
                          playsInline
                        >
                          <source src="https://yafvltczvbqpmffdsvmt.supabase.co/storage/v1/object/public/Video/___1080p_202512301827.webm" type="video/webm" />
                        </video>
                     </div>
                     
                     <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                           <span className="text-[10px] text-white font-bold tracking-widest uppercase">Brand Story</span>
                        </div>
                     </div>

                     <button
                        type="button"
                        onClick={toggleMute}
                        className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 hover:scale-110 transition-all duration-300 group shadow-lg"
                     >
                        {isMuted ? (
                           <Icon icon="solar:muted-linear" className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white" />
                        ) : (
                           <span className="relative flex items-center justify-center">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-20 animate-ping"></span>
                              <Icon icon="solar:volume-loud-bold" className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
                           </span>
                        )}
                     </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;
