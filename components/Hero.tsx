
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from './Button';

// Data for the Hero Card Slider
const heroSlides = [
  {
    id: 0,
    tag: "AI Automation",
    titlePrefix: "Future of",
    titleHighlight: "Digital Growth",
    description: "TEAM 1502는 최첨단 AI 기술과 데이터 기반 마케팅으로 귀사의 비즈니스에 압도적인 성장을 선사합니다. 기술과 예술이 만나는 지점에서 우리는 당신의 가치를 증명합니다."
  },
  {
    id: 1,
    tag: "Hyper Automation",
    titlePrefix: "Zero-Work",
    titleHighlight: "Operation",
    description: "반복되는 업무의 90%를 AI 에이전트에게 맡기세요. 인간은 오직 창의적인 결정에만 집중할 수 있도록, 우리는 완벽한 무인 자동화 워크플로우를 설계합니다."
  },
  {
    id: 2,
    tag: "Generative Creative",
    titlePrefix: "Cinematic",
    titleHighlight: "AI Visuals",
    description: "상상을 현실로. 텍스트 프롬프트 한 줄로 브랜드의 감성을 담은 초고화질 이미지와 시네마틱 영상을 생성하여, 고객의 시선을 단 1초 만에 사로잡습니다."
  },
  {
    id: 3,
    tag: "Tech Development",
    titlePrefix: "Intelligent",
    titleHighlight: "Code Engine",
    description: "단순한 코딩을 넘어 스스로 진화하는 웹과 앱을 구축합니다. 사용자 경험(UX)을 실시간으로 분석하고 최적화하는 차세대 디지털 프로덕트를 경험하세요."
  }
];

// --- Typewriter Component with Cursor & Untyping Logic ---
interface TypingTitleProps {
  prefix: string;
  highlight: string;
  isHovered: boolean;
  onTypingComplete: () => void; // Trigger description show
  onNext: () => void;           // Trigger slide change
}

const TypingTitle: React.FC<TypingTitleProps> = ({ 
  prefix, 
  highlight, 
  isHovered, 
  onTypingComplete, 
  onNext 
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing');
  
  const fullText = `${prefix}\n${highlight}`;
  const prefixLength = prefix.length;

  useEffect(() => {
    setDisplayedText("");
    setPhase('typing');
  }, [prefix, highlight]);

  useEffect(() => {
    if (isHovered) return;

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayedText.length < fullText.length) {
        const randomSpeed = Math.random() * 30 + 50;
        timer = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, randomSpeed);
      } else {
        onTypingComplete();
        timer = setTimeout(() => {
          setPhase('waiting');
        }, 1500); 
      }
    } 
    else if (phase === 'waiting') {
      timer = setTimeout(() => {
        setPhase('deleting');
      }, 3000);
    } 
    else if (phase === 'deleting') {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        }, 20); 
      } else {
        onNext();
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, phase, isHovered, fullText, onTypingComplete, onNext]);

  const currentPrefix = displayedText.length > prefixLength 
    ? prefix 
    : displayedText;
  
  const currentHighlight = displayedText.length > prefixLength + 1 
    ? displayedText.slice(prefixLength + 1) 
    : "";

  return (
    <h2 className="text-4xl md:text-6xl font-display text-brand-text mb-6 leading-[1.1] min-h-[120px] md:min-h-[140px] whitespace-pre-wrap">
      <span>{currentPrefix}</span>
      {displayedText.length <= prefixLength && (
        <span className="inline-block w-[3px] h-[1em] bg-brand-accent ml-1 animate-pulse align-middle translate-y-[-2px]" />
      )}
      {displayedText.length > prefixLength && <br />}
      {displayedText.length > prefixLength && (
        <>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            {currentHighlight}
          </span>
          <span className="inline-block w-[3px] h-[1em] bg-brand-accent ml-1 animate-pulse align-middle translate-y-[-2px]" />
        </>
      )}
    </h2>
  );
};

export const GlowingText = ({ children }: { children?: React.ReactNode }) => (
  <div className="relative inline-block">
    <span className="relative z-10 block text-transparent" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>{children}</span>
    <span className="absolute inset-0 z-20 block text-transparent animate-gradient-flow pointer-events-none select-none" style={{ backgroundImage: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #ff006e)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text' }}>{children}</span>
    <span className="absolute inset-0 z-30 block text-transparent animate-shine pointer-events-none select-none mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextStroke: '1px transparent' }}>{children}</span>
  </div>
);

const MarqueeRow = ({ text, direction }: { text: string; direction: 'left' | 'right' }) => {
  const items = Array(12).fill(text); 
  return (
    <div className="flex overflow-hidden select-none pointer-events-none w-full">
      <div className={`flex whitespace-nowrap gap-4 md:gap-8 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'}`} style={{ width: 'fit-content' }}>
        {items.map((item, i) => (
          <span key={i} className={`text-[60px] md:text-[120px] font-bold font-jalnan transition-colors ${i % 2 === 0 ? 'text-brand-text' : 'text-transparent'}`} style={i % 2 !== 0 ? { WebkitTextStroke: '1px #0f172a' } : {}}>{item}</span>
        ))}
        {items.map((item, i) => (
          <span key={`dup-${i}`} className={`text-[60px] md:text-[120px] font-bold font-jalnan transition-colors ${i % 2 === 0 ? 'text-brand-text' : 'text-transparent'}`} style={i % 2 !== 0 ? { WebkitTextStroke: '1px #0f172a' } : {}}>{item}</span>
        ))}
      </div>
    </div>
  );
};

// Luxury Button Component for High-End Feel (Upgraded)
interface LuxuryButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const LuxuryButton: React.FC<LuxuryButtonProps> = ({ onClick, children }) => {
  return (
    <button 
      onClick={onClick}
      className="group relative w-full sm:w-auto cursor-pointer"
    >
        {/* 1. Outer Glow/Shadow REMOVED as requested */}
        
        {/* 2. Main Button Body */}
        <div className="relative overflow-hidden rounded-full bg-[#0F172A] px-10 py-5 ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03] group-hover:ring-blue-500/50 group-hover:shadow-2xl shadow-blue-900/20">
            
            {/* 3. Shine/Sheen Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out skew-x-12 z-0" />

            {/* 4. Content Wrapper */}
            <div className="relative z-10 flex items-center justify-center gap-3">
               
               {/* Rolling Text Animation */}
               <div className="relative h-5 overflow-hidden flex flex-col justify-start">
                   <span className="block font-display text-[15px] font-bold tracking-widest text-white uppercase group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                     {children}
                   </span>
                   <span className="absolute top-0 left-0 block font-display text-[15px] font-bold tracking-widest text-blue-400 uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]">
                     {children}
                   </span>
               </div>

               {/* Flying Arrow Icon Animation */}
               <div className="relative w-5 h-5 overflow-hidden">
                   <Icon 
                     icon="solar:arrow-right-up-linear" 
                     className="absolute inset-0 w-full h-full text-white group-hover:-translate-y-full group-hover:translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" 
                   />
                   <Icon 
                     icon="solar:arrow-right-up-linear" 
                     className="absolute inset-0 w-full h-full text-blue-400 -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" 
                   />
               </div>
            </div>
        </div>
    </button>
  );
};

interface HeroProps {
  skipEntrance?: boolean;
}

const Hero: React.FC<HeroProps> = ({ skipEntrance = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  const handleNextSlide = useCallback(() => {
    setShowDescription(false);
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setShowDescription(true);
  }, []);

  useEffect(() => {
    setShowDescription(false);
  }, [currentIndex]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative w-full h-[85vh] md:h-screen overflow-hidden flex flex-col justify-center bg-white">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-100">
          <motion.div 
            className="w-full h-full relative" 
            style={{ clipPath: 'inset(0 0 60px 0)', transformOrigin: '50% 35%' }}
            initial={{ scale: 2 }}
            animate={{ scale: skipEntrance ? 1 : 2 }}
            transition={{ duration: 2.5, ease: [0.19, 1, 0.22, 1] }}
          >
              <iframe src='https://my.spline.design/nexbotrobotcharacterconcept-eyDKiERP10MYJJCHUEMjU6oR/' frameBorder='0' width='100%' height='100%' className="w-full h-full opacity-100 pointer-events-none md:pointer-events-auto" title="Spline 3D Robot"></iframe>
          </motion.div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
           <motion.div 
             initial={skipEntrance ? { y: 0, opacity: 1, scale: 1 } : { y: 100, opacity: 0, scale: 0.9 }} 
             animate={{ y: 0, opacity: 1, scale: 1 }} 
             transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} 
             className="flex flex-col items-center justify-center w-full px-4"
           >
              {/* Responsive Text Size: smaller on mobile to prevent overflow */}
              <h1 className="mt-16 md:mt-20 flex flex-col md:flex-row items-center justify-center text-[15vw] md:text-[10vw] leading-[0.8] md:leading-tight font-jalnan tracking-tight select-none whitespace-nowrap drop-shadow-2xl py-4">
                <GlowingText>TEAM</GlowingText><span className="block w-4 md:w-8"></span><GlowingText>1502</GlowingText>
              </h1>
           </motion.div>
        </div>
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-muted font-bold font-sans">Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-accent to-transparent"></div>
        </motion.div>
      </section>

      <section className="relative z-20 -mt-20 md:-mt-32 px-4 md:px-6 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 flex flex-col justify-center items-center gap-4 opacity-[0.12] pointer-events-none top-0 pt-20">
          <MarqueeRow text="TEAM 1502" direction="left" />
          <MarqueeRow text="TEAM 1502" direction="right" />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto relative backdrop-blur-3xl backdrop-saturate-[1.8] bg-white/60 p-6 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[2.5rem] border border-white/60 shadow-[0_30px_100px_-20px_rgba(59,130,246,0.15),inset_0_0_0_1px_rgba(255,255,255,0.6)] overflow-hidden pointer-events-auto transition-all duration-500 hover:shadow-[0_40px_120px_-20px_rgba(59,130,246,0.2)] hover:bg-white/70 group"
          >
            {/* Abstract Background Blobs inside card */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-100/50 rounded-full blur-[80px] pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-16 items-start">
              
              {/* Left Column: Content */}
              <div className="flex flex-col h-full min-h-[380px] md:min-h-[420px]">
                <div className="flex flex-col h-full">
                    {/* Badge */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-6 md:mb-8 self-start w-fit"
                      >
                         <span className="absolute inset-[-1000%] animate-spin-badge bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#3b82f6_50%,#E2E8F0_100%)]" />
                         <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-white/90 px-4 py-1.5 backdrop-blur-3xl">
                           <span className="relative flex h-2 w-2">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                           </span>
                           <span className="text-[10px] font-bold tracking-widest text-brand-accent uppercase font-sans">
                             {heroSlides[currentIndex].tag}
                           </span>
                         </span>
                      </motion.div>
                    </AnimatePresence>

                    {/* Typewriter Title */}
                    <TypingTitle 
                      key={currentIndex} 
                      prefix={heroSlides[currentIndex].titlePrefix} 
                      highlight={heroSlides[currentIndex].titleHighlight} 
                      isHovered={false}
                      onTypingComplete={handleTypingComplete}
                      onNext={handleNextSlide}
                    />

                    {/* Description */}
                    <motion.div animate={{ opacity: showDescription ? 1 : 0, y: showDescription ? 0 : 20 }} transition={{ duration: 0.8, ease: "easeOut" }} className="mb-8">
                      <p className="text-base md:text-xl text-brand-muted leading-relaxed font-sans font-light max-w-xl">{heroSlides[currentIndex].description}</p>
                    </motion.div>
                </div>
                
                {/* Button Section - UPGRADED */}
                <div className="flex flex-col sm:flex-row gap-4 justify-start mt-auto pt-4 w-full">
                  <LuxuryButton onClick={scrollToContact}>
                    Start Project
                  </LuxuryButton>
                </div>
              </div>

              {/* Right Column: Navigation & Indicators (Mobile: Simplified) */}
              <div className="hidden lg:flex flex-col justify-between h-full py-2 border-l border-neutral-100 pl-12 min-h-[420px]">
                 <div className="space-y-6">
                     <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] font-sans mb-8">Service Areas</h3>
                     <div className="flex flex-col gap-5">
                        {heroSlides.map((slide, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => { setShowDescription(false); setCurrentIndex(idx); }}
                             className={`group cursor-pointer flex items-center gap-4 transition-all duration-300 ${idx === currentIndex ? 'translate-x-2' : 'hover:translate-x-1'}`}
                           >
                              <div className={`h-[2px] transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-600' : 'w-2 bg-neutral-300 group-hover:bg-neutral-400'}`} />
                              <span className={`text-sm font-sans font-medium transition-colors duration-300 ${idx === currentIndex ? 'text-blue-900' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                                {slide.tag}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
                  
                  {/* Slide Counter */}
                  <div className="relative">
                    <div className="text-7xl font-display font-light text-neutral-100 select-none text-right tracking-tighter">
                      0{currentIndex + 1}
                    </div>
                  </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
