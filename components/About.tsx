import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, MotionValue } from 'framer-motion';
import { StatItem } from '../types';

const stats: StatItem[] = [
  { value: '500+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24/7', label: 'AI Operation' },
  { value: '150%', label: 'Avg. ROI Increase' },
];

interface Review {
  role: string;
  comment: string;
  rating: number;
}

const reviews: Review[] = [
  { role: 'Startup CEO', comment: "도입 후 업무 효율이 300% 증가했습니다.", rating: 5 },
  { role: 'Marketing Director', comment: "ROAS 200% 달성, 데이터 분석이 놀랍네요.", rating: 5 },
  { role: 'E-commerce Owner', comment: "CS 자동화로 직원들이 본질에 집중해요.", rating: 5 },
  { role: 'Freelance Dev', comment: "단순 코딩 시간이 절반으로 줄었습니다.", rating: 5 },
  { role: 'Medical Director', comment: "환자 예약 관리가 완벽하게 자동화됐어요.", rating: 5 },
  { role: 'Fintech PM', comment: "보안과 효율, 두 마리 토끼를 잡았습니다.", rating: 5 },
  { role: 'Academy Instructor', comment: "학생별 맞춤 커리큘럼 생성이 1초면 끝나요.", rating: 5 },
  { role: 'Real Estate Agent', comment: "고객 매칭 정확도가 소름 돋을 정도입니다.", rating: 5 },
  { role: 'Content Creator', comment: "영상 편집 속도가 3배는 빨라진 것 같아요.", rating: 5 },
  { role: 'Franchise Owner', comment: "재고 관리가 이제야 체계가 잡히네요.", rating: 5 },
];

const ScrollCounter = ({ value, progress }: { value: string, progress: MotionValue<number> }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const numericValue = parseInt(value.replace(/\D/g, '') || '0', 10);
  const suffix = value.replace(/[0-9]/g, '');
  const countSpring = useSpring(0, { stiffness: 50, damping: 15 });

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < 0.1) countSpring.set(0);
    else countSpring.set(numericValue);
  });

  useEffect(() => {
    const unsubscribe = countSpring.on("change", (latest) => {
      if (latest < 1) setDisplayValue("0" + suffix);
      else setDisplayValue(`${Math.round(latest)}${suffix}`);
    });
    return () => unsubscribe();
  }, [countSpring, numericValue, suffix]);

  return <span>{displayValue}</span>;
};

const ScrollRevealText = ({ text, scrollProgress, start, end, className }: { text: string, scrollProgress: MotionValue<number>, start: number, end: number, className?: string }) => {
  const words = text.split(" ");
  const step = (end - start) / words.length;

  return (
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => {
        const wordStart = start + (i * step);
        const wordEnd = wordStart + (step * 0.8);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollProgress, [wordStart, wordEnd], [0, 1]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(scrollProgress, [wordStart, wordEnd], [20, 0]);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const blur = useTransform(scrollProgress, [wordStart, wordEnd], [10, 0]);
        return (
          <motion.span key={i} style={{ opacity, y, filter: useTransform(blur, (b) => `blur(${b}px)`) }} className="inline-block mr-[0.2em] will-change-transform">
            {word}
          </motion.span>
        );
      })}
    </span>
  );
};

const About: React.FC = () => {
  const brandImage = "https://postfiles.pstatic.net/MjAyNTEyMjhfMjE5/MDAxNzY2OTAwNjc0Mjk5.3r9DMQ_lYSOisfDV48LqnSgMLwDlvmJJkzxLfQrU7Cog.VMS5w7RL9nBqSzmLkMFSnfxmndHuLAWTt-HMr9mWdlkg.PNG/1502_0001.png?type=w966";
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  const badgeOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const badgeY = useTransform(scrollYProgress, [0, 0.1], [20, 0]);
  const descOpacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  const descY = useTransform(scrollYProgress, [0.35, 0.45], [20, 0]);
  const textXMobile = useTransform(scrollYProgress, [0.5, 0.7], ["0%", "0%"]);
  const textXDesktop = useTransform(scrollYProgress, [0.5, 0.7], ["25%", "0%"]); 
  const imageOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const imageX = useTransform(scrollYProgress, [0.55, 0.7], [100, 0]);
  const imageScale = useTransform(scrollYProgress, [0.55, 0.7], [0.8, 1]);
  const statsOpacity = useTransform(scrollYProgress, [0.70, 0.80], [0, 1]);
  const statsY = useTransform(scrollYProgress, [0.70, 0.80], [30, 0]);
  const counterProgress = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={containerRef} id="about" className="relative h-[500vh] bg-[#fafafa]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <motion.div className="md:col-span-7 flex flex-col justify-center" style={{ x: isMobile ? textXMobile : textXDesktop }}>
              <motion.div style={{ opacity: badgeOpacity, y: badgeY }} className="flex md:block justify-center md:justify-start">
                <span className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-6">
                  <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#cbd5e1_0%,#3b82f6_50%,#cbd5e1_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-white/90 px-5 py-1.5 backdrop-blur-3xl">
                    <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-500 uppercase font-sans">Who We Are</span>
                  </span>
                </span>
              </motion.div>
              <div className="text-4xl md:text-6xl font-display text-neutral-900 leading-[1.1] tracking-tight text-center md:text-left">
                 <div className="block"><ScrollRevealText text="Not just an agency." scrollProgress={scrollYProgress} start={0.10} end={0.22} /></div>
                 <div className="block mt-2 text-blue-600"><ScrollRevealText text="Your Growth Partner." scrollProgress={scrollYProgress} start={0.20} end={0.35} className="pb-2" /></div>
              </div>
              <motion.p style={{ opacity: descOpacity, y: descY }} className="text-neutral-600 text-lg md:text-xl leading-relaxed font-sans font-light max-w-2xl mt-10 text-center md:text-left mx-auto md:mx-0">
                TEAM 1502는 <span className="text-neutral-900 font-medium">최첨단 AI 솔루션</span>과 <span className="text-neutral-900 font-medium">창의적인 마케팅 전략</span>을 결합하여 기업의 잠재력을 극대화합니다. 우리는 단순한 반복 업무를 자동화하는 것을 넘어, 당신이 창의적인 본질에 집중할 수 있는 자유를 설계합니다.
              </motion.p>
              <motion.div style={{ opacity: statsOpacity, y: statsY }} className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-neutral-200 mt-10">
                {stats.map((stat, idx) => (
                  <div key={idx} className="relative group text-center md:text-left">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    <div className="text-3xl md:text-4xl font-display text-neutral-900 mb-2 tracking-tight"><ScrollCounter value={stat.value} progress={counterProgress} /></div>
                    <div className="text-[10px] md:text-xs text-neutral-500 font-bold font-sans uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div className="md:col-span-5 relative hidden md:block" style={{ opacity: imageOpacity, x: imageX, scale: imageScale }}>
               <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-[0_30px_60px_-15px_rgba(59,130,246,0.15)] border border-white/60 bg-white group">
                  <img src={brandImage} alt="3D Business Illustration" className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-[1.5s] ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-blue-900/10 to-transparent pointer-events-none" />
                  <div className="absolute bottom-8 left-0 right-0 overflow-hidden py-2 mask-linear-gradient">
                     <div className="flex gap-4 w-max animate-scroll-left hover:[animation-play-state:paused] px-6" style={{ animationDuration: '40s' }}>
                        {[...reviews, ...reviews].map((review, i) => (
                          <div key={i} className="w-[260px] p-5 bg-white/20 backdrop-blur-xl rounded-[1.2rem] border border-white/40 shadow-lg text-white shrink-0 hover:bg-white/30 transition-colors cursor-default">
                             <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                  <div className="flex text-yellow-300 gap-0.5 text-[10px] drop-shadow-sm">{'★'.repeat(review.rating)}</div>
                                  <div className="text-[9px] font-bold uppercase tracking-widest text-white/80 bg-white/10 px-2 py-0.5 rounded-full">{review.role}</div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed font-sans text-white drop-shadow-md line-clamp-2">"{review.comment}"</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
               <motion.div className="absolute -top-10 -right-10 w-32 h-32 border border-blue-200 rounded-full flex items-center justify-center animate-spin-slow opacity-60" initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }}><div className="w-2 h-2 bg-blue-500 rounded-full"></div></motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;