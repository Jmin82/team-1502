
import React, { useRef, useState, MouseEvent } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useScroll, useTransform, MotionValue, useMotionValueEvent } from 'framer-motion';
import { Icon } from '@iconify/react';

const problems = [
  {
    id: 1,
    category: "INEFFICIENCY",
    issueId: "ERR_01_WORKLOAD",
    question: "직원들이 반복 업무에\n지쳐 있나요?",
    painDescription: "단순 데이터 입력, CS 응대, 일정 조율... \n핵심 인재들이 단순 노동에 시간을 낭비하고 있습니다.",
    ahaTitle: "Autonomous Agent",
    ahaDescription: "TEAM 1502의 AI 에이전트는 24시간 잠들지 않습니다. 단순 반복 업무를 100% 자동화하여 조직의 생산성을 극대화합니다.",
    icon: "solar:clock-circle-linear",
    colorTheme: "orange"
  },
  {
    id: 2,
    category: "UNCERTAINTY",
    issueId: "ERR_02_BUDGET",
    question: "마케팅 예산,\n도박하듯 쓰고 계신가요?",
    painDescription: "감에 의존한 타겟팅, 분석 없는 광고 집행. \n비용은 늘어나는데 ROAS는 제자리걸음입니다.",
    ahaTitle: "Precision Targeting",
    ahaDescription: "AI가 수천 개의 변수를 실시간 분석합니다. 구매 전환 확률이 가장 높은 1%의 고객을 찾아내어 예산 효율을 300% 이상 높입니다.",
    icon: "solar:chart-square-linear",
    colorTheme: "blue"
  },
  {
    id: 3,
    category: "SLOW PACE",
    issueId: "ERR_03_LAGGING",
    question: "경쟁사의 속도를\n따라잡기 버거운가요?",
    painDescription: "기획부터 개발, 런칭까지 너무 긴 리드 타임. \n트렌드를놓치고 시장 진입 타이밍을 잃고 있습니다.",
    ahaTitle: "Generative Pipeline",
    ahaDescription: "1주 걸리던 기획안이 1분 만에, 한 달 걸리던 개발이 3일 만에. 생성형 AI 파이프라인으로 압도적인 속도 우위를 선점하세요.",
    icon: "solar:rocket-2-linear",
    colorTheme: "purple"
  }
];

interface CardProps {
  item: typeof problems[0];
  progress: MotionValue<number>;
  range: [number, number];
}

const Card: React.FC<CardProps> = ({ item, progress, range }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Scroll-driven Flip Animation
  const rotateX = useTransform(progress, range, [90, 0]);
  const opacity = useTransform(progress, range, [0, 1]);
  const y = useTransform(progress, range, [100, 0]);
  const blur = useTransform(progress, range, [10, 0]);

  const theme = {
    orange: { hex: "#f97316", glowClass: "bg-orange-500", textClass: "text-orange-400" },
    blue: { hex: "#3b82f6", glowClass: "bg-blue-500", textClass: "text-blue-400" },
    purple: { hex: "#a855f7", glowClass: "bg-purple-500", textClass: "text-purple-400" }
  }[item.colorTheme] || { hex: "#ffffff", glowClass: "bg-white", textClass: "text-white" };

  return (
    <motion.div 
      style={{ 
        rotateX, 
        opacity, 
        y, 
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        transformPerspective: 1000 
      }}
      className="group relative h-[380px] md:h-[400px] w-full lg:min-w-[300px] rounded-[2rem] z-0 flex-shrink-0 origin-bottom" 
      onMouseMove={handleMouseMove} 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)} 
    >
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden z-0">
        <div className="absolute inset-0 rounded-[2rem] border border-white/10 group-hover:border-transparent transition-colors duration-300" />
        <div className="absolute left-[-50%] top-[-50%] w-[200%] h-[200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 70%, ${theme.hex} 100%)`, animation: "spin 4s linear infinite" }} />
      </div>
      <div className="absolute inset-[1.5px] rounded-[calc(2rem-1.5px)] bg-[#0A0A0A] z-10 overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        <motion.div className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 z-0 mix-blend-screen" style={{ background: useMotionTemplate`radial-gradient(650px circle at ${mouseX}px ${mouseY}px, ${theme.hex}15, transparent 50%)` }} />
        <div className="relative h-full p-6 md:p-8 flex flex-col z-20">
          <div className="flex justify-between items-center mb-6 md:mb-8">
             <div className="flex items-center gap-3">
                <motion.div animate={{ backgroundColor: isHovered ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", boxShadow: isHovered ? "0 0 10px rgb(34, 197, 94)" : "0 0 0px transparent" }} className="w-2 h-2 rounded-full" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 font-sans uppercase">{isHovered ? "SYSTEM OPTIMIZED" : `ISSUE: ${item.issueId}`}</span>
             </div>
             <Icon icon={item.icon} className={`w-6 h-6 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-neutral-700'}`} />
          </div>
          <div className="flex-1 flex flex-col justify-center relative">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.div key="problem" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, filter: "blur(8px)" }} transition={{ duration: 0.4, ease: "easeOut" }} className="absolute inset-0 flex flex-col justify-center">
                  <motion.h3 className="text-2xl md:text-3xl font-display font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-[1.1] mb-6 whitespace-pre-wrap">{item.question}</motion.h3>
                  <p className="text-neutral-500 text-sm leading-relaxed font-sans border-l border-neutral-800 pl-4">{item.painDescription}</p>
                </motion.div>
              ) : (
                <motion.div key="solution" initial={{ opacity: 0, y: 10, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, delay: 0.05 }} className="absolute inset-0 flex flex-col justify-center">
                  <div className="mb-4">
                     <span className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-3">
                        <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#333_0%,#fff_50%,#333_100%)]" />
                        <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-900/90 px-3 py-0.5 backdrop-blur-3xl">
                          <span className={`text-[10px] font-bold ${theme.textClass} uppercase tracking-widest`}>Team 1502 Solution</span>
                        </span>
                     </span>
                     <h3 className="text-xl md:text-3xl font-display text-white mb-2 tracking-tight">{item.ahaTitle}</h3>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-white/30 to-transparent mb-4"></div>
                  <p className="text-neutral-200 text-xs md:text-sm leading-relaxed font-sans font-light">{item.ahaDescription}</p>
                  <div className="mt-6 flex gap-1 items-end h-8 opacity-50">
                     {[40, 70, 50, 90, 60, 100].map((h, i) => (
                        <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: 0.2 + (i * 0.1) }} className={`flex-1 rounded-t-sm ${theme.glowClass}`} />
                     ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-auto flex justify-between items-end pt-6 border-t border-white/5">
             <span className="text-[10px] font-bold text-neutral-600 tracking-widest uppercase font-sans group-hover:text-white transition-colors duration-300">{item.category}</span>
             <motion.div animate={{ x: isHovered ? 5 : 0, color: isHovered ? "#fff" : "#525252" }} transition={{ duration: 0.3 }}><Icon icon="solar:arrow-right-linear" width={20} /></motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Char Component for Individual Letter Animation ---

interface CharProps {
  char: string;
  index: number;
  range: [number, number];
  progress: MotionValue<number>;
  accentHex: string;
  isLast?: boolean;
}

const Char: React.FC<CharProps> = ({ char, index, range, progress, accentHex, isLast = false }) => {
  const sectionDuration = range[1] - range[0];
  const typingStartPct = 0.15;
  const exitStartPct = 0.75; 
  const typingDuration = sectionDuration * (exitStartPct - typingStartPct); 
  const step = typingDuration / 15; 
  
  const charStart = range[0] + (sectionDuration * typingStartPct) + (index * step);
  const charImpact = charStart + (step * 0.5); 
  const charSettle = charStart + (step * 2.5); 
  const charExitStart = range[0] + (sectionDuration * exitStartPct) + (index * (step * 0.2)); 
  const charExitEnd = range[1];

  const opacity = useTransform(
    progress, 
    [charStart, charImpact, charExitStart, charExitEnd], 
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );

  const scale = useTransform(
    progress, 
    [charStart, charImpact, charExitStart, charExitEnd], 
    isLast ? [3.0, 1.0, 1.0, 1.0] : [3.0, 1.0, 1.0, 5.0]
  );
  
  const color = useTransform(
    progress, 
    [charStart, charImpact, charSettle], 
    [accentHex, accentHex, "#ffffff"]
  );

  const blur = useTransform(
    progress,
    [charStart, charImpact, charExitStart, charExitEnd],
    isLast ? [10, 0, 0, 0] : [10, 0, 0, 20]
  );

  const zIndex = useTransform(scale, (s) => s > 1.5 ? 50 : 1);

  return (
    <motion.span 
      style={{ opacity, scale, color, filter: useTransform(blur, (b) => `blur(${b}px)`), zIndex }}
      className="inline-block origin-center will-change-transform relative"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

// Text Sequence Component
const TextSequence = ({ text, subText, accentColor, range, progress, isLast = false }: { text: string; subText: string; accentColor: string; range: [number, number]; progress: any, isLast?: boolean }) => {
  const accentHex = {
    red: "#ef4444",
    orange: "#f97316",
    yellow: "#facc15",
    blue: "#3b82f6",
  }[accentColor] || "#ffffff";

  const sectionDuration = range[1] - range[0];
  const labelStart = range[0];
  const labelEnd = range[0] + (sectionDuration * 0.15);
  const exitStart = range[0] + (sectionDuration * 0.85); 
  const exitEnd = range[1];

  const containerOpacity = useTransform(
    progress,
    [labelStart, labelEnd, exitStart, exitEnd],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  
  const lineWidth = useTransform(
    progress,
    [labelStart, labelEnd],
    ["0%", "100%"]
  );

  const colorMap: Record<string, { text: string, bg: string }> = {
    red: { text: "text-red-500", bg: "bg-red-500" },
    orange: { text: "text-orange-500", bg: "bg-orange-500" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-400" },
    blue: { text: "text-blue-500", bg: "bg-blue-500" },
  };
  const colors = colorMap[accentColor] || { text: "text-white", bg: "bg-white" };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-4 w-full overflow-hidden">
      <motion.div 
        style={{ opacity: containerOpacity }}
        className={`mb-8 md:mb-12 flex items-center gap-4 md:gap-6`}
      >
        <motion.div 
          style={{ width: lineWidth }}
          className={`h-[2px] md:h-[3px] ${colors.bg} shadow-[0_0_15px_currentColor] opacity-100 rounded-full`} 
        />
        <span className={`${colors.text} font-sans text-xs md:text-sm tracking-[0.4em] uppercase font-bold drop-shadow-lg whitespace-nowrap`}>
          {subText}
        </span>
        <motion.div 
          style={{ width: lineWidth }}
          className={`h-[2px] md:h-[3px] ${colors.bg} shadow-[0_0_15px_currentColor] opacity-100 rounded-full`} 
        />
      </motion.div>

      {/* Increased text size for mobile visibility (text-[12vw] vs text-[10vw]) */}
      <h2 className="text-[12vw] md:text-[7vw] font-display font-bold text-center leading-[1.1] tracking-tight drop-shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-wrap justify-center max-w-6xl perspective-1000">
        {Array.from(text).map((char, i) => (
          <Char 
            key={i} 
            char={char} 
            index={i} 
            range={range} 
            progress={progress} 
            accentHex={accentHex}
            isLast={isLast}
          />
        ))}
      </h2>
    </div>
  );
};

const ScrollTypewriter = ({ text, progress, range, className }: { text: string, progress: MotionValue<number>, range: [number, number], className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const count = useTransform(progress, range, [0, text.length]);
  
  useMotionValueEvent(count, "change", (latest) => {
    setDisplayText(text.slice(0, Math.round(latest)));
  });

  const cursorOpacity = useTransform(progress, (v) => (v >= range[0] && v < range[1]) ? 1 : 0);

  return (
    <span className={className}>
      {displayText}
      <motion.span style={{ opacity: cursorOpacity }} className="inline-block w-[0.1em] h-[1em] bg-blue-500 ml-1 align-middle" />
    </span>
  );
};

const PainPoint: React.FC = () => {
  const hookRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  
  // Section 1: Hook Section Scroll
  const { scrollYProgress } = useScroll({ target: hookRef, offset: ["start start", "end end"] });

  const textRanges = [
    [0.00, 0.18], 
    [0.18, 0.36], 
    [0.36, 0.54], 
    [0.54, 0.70] 
  ] as [number, number][];

  const bgOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 0.9]);

  // Section 2: Solution Scroll Timeline
  const { scrollYProgress: solutionProgress } = useScroll({ target: solutionRef, offset: ["start start", "end end"] });
  
  const descOpacity = useTransform(solutionProgress, [0.45, 0.55], [0, 1]);
  const descY = useTransform(solutionProgress, [0.45, 0.55], [30, 0]);

  return (
    <>
      {/* SECTION 1: PAIN POINTS */}
      <section ref={hookRef} className="relative h-[600vh] bg-transparent z-0">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center w-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(ellipse_at_top,rgba(30,30,30,0.4),transparent_70%)] pointer-events-none"></div>
          <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] pointer-events-none rounded-full"></div>
          <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[150px] pointer-events-none rounded-full"></div>
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-black z-10 pointer-events-none" />
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
             <TextSequence text="숨 막히는 비효율 😤" subText="Warning: Bottleneck" accentColor="red" range={textRanges[0]} progress={scrollYProgress} />
             <TextSequence text="새어 나가는 비용 💸" subText="Critical Issue" accentColor="orange" range={textRanges[1]} progress={scrollYProgress} />
             <TextSequence text="도태되는 경쟁력 📉" subText="Market Reality" accentColor="yellow" range={textRanges[2]} progress={scrollYProgress} />
             <TextSequence text="언제까지 방치하시겠습니까?" subText="It's Time To Change" accentColor="blue" range={textRanges[3]} progress={scrollYProgress} isLast={true} />
          </div>
        </div>
      </section>

      {/* 
        SECTION 2: THE SOLUTION (Snap Enabled)
        Added 'snap-y snap-mandatory' to enforce scrolling stops.
      */}
      <section 
        ref={solutionRef} 
        className="relative z-30 bg-[#0B0F19] -mt-[100vh] h-[400vh] rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,1)] snap-y snap-mandatory"
      >
        
        {/* SNAP SPACERS: Invisible elements to force scroll snap stops roughly aligned with animation timing */}
        <div className="absolute inset-0 w-full pointer-events-none">
           <div className="h-[100vh] w-full snap-start" /> {/* Header / Intro */}
           <div className="h-[100vh] w-full snap-center" /> {/* Card 1 */}
           <div className="h-[100vh] w-full snap-center" /> {/* Card 2 */}
           <div className="h-[100vh] w-full snap-center" /> {/* Card 3 */}
        </div>

        {/* Plasma Horizon Effect */}
        <div className="sticky top-0 z-50 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_-2px_20px_rgba(59,130,246,0.8)] opacity-80"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white shadow-[0_0_30px_rgba(255,255,255,1)] opacity-50"></div>
            <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-blue-900/20 to-transparent rounded-t-[3rem]"></div>
        </div>

        <div className="sticky top-0 h-screen overflow-hidden flex flex-col pt-20 pb-12 justify-between">
            <div className="container mx-auto px-6 h-full flex flex-col justify-between">
              
              {/* Header Area */}
              <div className="max-w-4xl mx-auto text-center shrink-0 z-20 pt-4">
                <div className="flex justify-center mb-6">
                   <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                     <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000_0%,#fff_50%,#000_100%)]" />
                     <span className="inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-neutral-950 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-300 backdrop-blur-3xl font-sans">Transformation</span>
                   </span>
                </div>

                <h2 className="text-4xl md:text-7xl font-display leading-[1.1] mb-6 tracking-tight text-white drop-shadow-xl min-h-[2.2em]">
                   <div className="block">
                     <ScrollTypewriter text="From Chaos" progress={solutionProgress} range={[0.2, 0.35]} />
                   </div>
                   <div className="block text-neutral-400">
                     <ScrollTypewriter text="To Clarity." progress={solutionProgress} range={[0.35, 0.5]} />
                   </div>
                </h2>

                <motion.p 
                  style={{ opacity: descOpacity, y: descY }}
                  className="text-neutral-300 text-base md:text-xl font-sans font-light leading-relaxed max-w-2xl mx-auto hidden md:block"
                >
                  비효율은 비용을 발생시키고, 불확실성은 기회를 앗아갑니다.<br />
                  TEAM 1502는 당신의 비즈니스에 '확신'을 심어드립니다.
                </motion.p>
              </div>
              
              {/* Cards Area */}
              <div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1400px] mx-auto w-full md:h-[400px] perspective-[2000px] mt-auto">
                {problems.map((item, index) => {
                   // Ranges roughly aligned with 100vh snap intervals
                   const start = 0.55 + (index * 0.12);
                   const end = start + 0.12;
                   
                   return (
                     <Card 
                        key={item.id} 
                        item={item} 
                        progress={solutionProgress} 
                        range={[start, end]} 
                     />
                   );
                })}
              </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default PainPoint;
