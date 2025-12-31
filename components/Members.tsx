
import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';

// --- Data ---
const members = [
  {
    id: 1,
    role: "CEO & Strategist",
    name: "The Visionary",
    engName: "J.M. SHIN",
    copy: "데이터의 흐름 속에서\n비즈니스의 내일을 봅니다.",
    keywords: ["Strategy", "Growth", "Vision"],
    image: "https://yafvltczvbqpmffdsvmt.supabase.co/storage/v1/object/public/Video/1502_ceo.jpg",
    theme: "amber",
    stats: { label: "Success Rate", value: "98.5%" }
  },
  {
    id: 2,
    role: "Creative Director",
    name: "The Creator",
    engName: "S.Y. LEE",
    copy: "이성적인 기술에\n감성적인 숨결을 불어넣습니다.",
    keywords: ["Design", "Art", "UI/UX"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    theme: "purple",
    stats: { label: "Creative IQ", value: "150+" }
  },
  {
    id: 3,
    role: "Lead Developer",
    name: "The Architect",
    engName: "K.W. PARK",
    copy: "상상을 현실로 구현하는\n가장 완벽한 로직.",
    keywords: ["Code", "Logic", "System"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    theme: "emerald",
    stats: { label: "Code Quality", value: "A++" }
  }
];

// --- Components ---

const TechRing = ({ colorClass }: { colorClass: string }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className={`w-[140%] h-[140%] rounded-full border-[1px] border-dashed ${colorClass} opacity-20 animate-[spin_60s_linear_infinite]`} />
    <div className={`absolute w-[120%] h-[120%] rounded-full border-[1px] ${colorClass} opacity-10 animate-[spin_40s_linear_infinite_reverse]`} />
  </div>
);

interface CinematicCardProps {
  member: typeof members[0];
}

const CinematicCard: React.FC<CinematicCardProps> = ({ member }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Motion Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth Springs
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transforms for Parallax
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Image Parallax (Moves opposite to tilt)
  const imageX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3%", "3%"]);
  const imageY = useTransform(mouseYSpring, [-0.5, 0.5], ["-3%", "3%"]);

  // Glare Effect Position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Dynamic Theme Colors
  const themeMap = {
    blue: { 
      border: "group-hover:border-blue-500/50", 
      shadow: "group-hover:shadow-[0_20px_80px_-20px_rgba(59,130,246,0.3)]",
      text: "text-blue-400",
      bgGradient: "from-blue-900/40",
      ring: "border-blue-500"
    },
    purple: { 
      border: "group-hover:border-purple-500/50", 
      shadow: "group-hover:shadow-[0_20px_80px_-20px_rgba(168,85,247,0.3)]",
      text: "text-purple-400",
      bgGradient: "from-purple-900/40",
      ring: "border-purple-500"
    },
    emerald: { 
      border: "group-hover:border-emerald-500/50", 
      shadow: "group-hover:shadow-[0_20px_80px_-20px_rgba(16,185,129,0.3)]",
      text: "text-emerald-400",
      bgGradient: "from-emerald-900/40",
      ring: "border-emerald-500"
    },
    amber: { 
      border: "group-hover:border-amber-500/50", 
      shadow: "group-hover:shadow-[0_20px_80px_-20px_rgba(245,158,11,0.3)]",
      text: "text-amber-400",
      bgGradient: "from-amber-900/40",
      ring: "border-amber-500"
    }
  };

  const themeColors = themeMap[member.theme as keyof typeof themeMap] || themeMap.blue;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`group relative w-full aspect-[3/4] rounded-[2rem] bg-[#0f0f0f] border border-neutral-800 ${themeColors.border} ${themeColors.shadow} transition-all duration-700 ease-out overflow-hidden cursor-pointer perspective-1000`}
    >
      {/* 1. Background Image with Parallax */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
         <motion.div 
            style={{ x: imageX, y: imageY, scale: 1.1 }}
            className="absolute inset-0 w-full h-full"
         >
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-700 ease-in-out"
            />
            {/* Dark Overlay Gradient (Top down) */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-[#0f0f0f]/20 to-[#0f0f0f] opacity-80 group-hover:opacity-60 transition-opacity duration-500`} />
            
            {/* Color Bleed Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${themeColors.bgGradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-soft-light`} />
         </motion.div>
      </div>

      {/* 2. HUD / Tech Elements (Behind Text) */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
         <TechRing colorClass={themeColors.ring} />
         
         {/* Top Right Stats */}
         <div className="absolute top-8 right-8 flex flex-col items-end">
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${themeColors.text}`}>{member.stats.label}</div>
            <div className="text-2xl font-display text-white">{member.stats.value}</div>
         </div>

         {/* Grid Lines */}
         <div className="absolute inset-x-0 bottom-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
         <div className="absolute inset-y-0 left-8 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>

      {/* 3. Content Layer (Floating) */}
      <div 
        style={{ transform: "translateZ(60px)" }}
        className="absolute inset-0 z-20 flex flex-col justify-end p-8 pointer-events-none"
      >
        {/* Role Badge */}
        <div className="mb-auto pt-2 flex justify-start">
           <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2 group-hover:bg-white/10 transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full ${themeColors.text.replace('text-', 'bg-')} animate-pulse`} />
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">{member.role}</span>
           </div>
        </div>

        {/* Main Text Info */}
        <div className="relative overflow-hidden">
           <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-4xl md:text-5xl font-display text-white mb-2 leading-none">{member.name}</h3>
              <p className={`text-xs font-bold font-sans tracking-[0.3em] uppercase mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500 ${themeColors.text}`}>
                 {member.engName}
              </p>
              
              <p className="text-neutral-400 text-sm leading-relaxed max-w-[90%] opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 transform translate-y-4 group-hover:translate-y-0">
                {member.copy}
              </p>
              
              {/* Keywords */}
              <div className="flex gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                 {member.keywords.map((kw, i) => (
                    <span key={i} className="px-2 py-1 rounded border border-white/10 bg-black/20 text-[9px] text-neutral-300 uppercase tracking-wider backdrop-blur-sm">
                       {kw}
                    </span>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 4. Glass Reflection & Noise */}
      <div className="absolute inset-0 z-30 pointer-events-none rounded-[2rem] overflow-hidden">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
         
         {/* Dynamic Glare */}
         <motion.div 
            style={{ 
               background: useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15), transparent 40%)` 
            }}
            className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500"
         />
         
         {/* Border Shine */}
         <div className="absolute inset-0 rounded-[2rem] border border-white/5 group-hover:border-white/10 transition-colors duration-500" />
      </div>

    </motion.div>
  );
};

const Members: React.FC = () => {
  return (
    <section id="members" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#fafafa] to-[#050505] opacity-100" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      
      {/* Decorative Glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-24 relative">
           {/* Vertical Line */}
           <motion.div 
              initial={{ height: 0 }} 
              whileInView={{ height: 60 }} 
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent to-neutral-500" 
           />
           
           <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4 text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 font-sans"
           >
              Our Intelligence
           </motion.span>
           
           {/* Updated Luxurious Headline */}
           <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-display text-white mb-8 tracking-tighter"
           >
              Meet The <br className="lg:hidden" />
              <span className="relative inline-block ml-0 lg:ml-4">
                  {/* Outer Glow for contrast against dark bg */}
                  <span className="absolute -inset-1 blur-2xl bg-blue-500/20 rounded-full" />
                  
                  {/* Metallic Gradient Text */}
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500">
                    Architects
                  </span>
                  
                  {/* Trendy Star Accent */}
                  <motion.span 
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-4 md:-right-8 text-blue-400 text-2xl md:text-4xl"
                  >
                    ✦
                  </motion.span>
              </span>
           </motion.h2>
           
           <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-neutral-400 text-lg font-sans font-light max-w-2xl mx-auto"
           >
              우리는 단순한 팀이 아닙니다.<br className="hidden md:block"/>
              데이터와 크리에이티브가 결합된 하나의 유기체입니다.
           </motion.p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
          {members.map((member) => (
             <CinematicCard key={member.id} member={member} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Members;
