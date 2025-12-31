
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ServiceItem } from '../types';

const services: ServiceItem[] = [
  {
    id: 1,
    title: "AI 업무 자동화",
    titleEn: "AI Work Automation",
    description: "반복적인 업무 프로세스를 맞춤형 AI 에이전트로 대체하여 비용은 줄이고 효율성은 극대화합니다.",
    icon: "solar:magic-stick-3-linear"
  },
  {
    id: 2,
    title: "퍼포먼스 마케팅",
    titleEn: "Performance Marketing",
    description: "데이터 기반의 정밀 타겟팅과 AI 광고 최적화를 통해 ROAS를 획기적으로 개선합니다.",
    icon: "solar:chart-2-linear"
  },
  {
    id: 3,
    title: "지능형 챗봇",
    titleEn: "Intelligent Chatbot",
    description: "24시간 고객 응대부터 사내 지식 관리까지, 문맥을 이해하는 똑똑한 AI 챗봇을 구축합니다.",
    icon: "solar:chat-round-line-linear"
  },
  {
    id: 4,
    title: "웹/앱 개발",
    titleEn: "Web & App Dev",
    description: "최신 트렌드를 반영한 디자인과 강력한 기능의 반응형 웹사이트 및 애플리케이션을 개발합니다.",
    icon: "solar:monitor-smartphone-linear"
  },
  {
    id: 5,
    title: "데이터 분석",
    titleEn: "Data Analytics",
    description: "비즈니스 데이터를 수집, 가공, 시각화하여 데이터에 기반한 확실한 의사결정을 돕습니다.",
    icon: "solar:cpu-linear"
  },
  {
    id: 6,
    title: "브랜드 전략",
    titleEn: "Brand Strategy",
    description: "AI 시장 분석을 통해 경쟁사와 차별화된 독보적인 브랜드 아이덴티티를 수립합니다.",
    icon: "solar:bolt-linear"
  }
];

const Typewriter = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (isInView) {
      let current = 0;
      const startDelay = setTimeout(() => {
        const interval = setInterval(() => {
          if (current < text.length) {
            current++;
            setDisplay(text.substring(0, current));
          } else {
            clearInterval(interval);
            setTimeout(() => setShowCursor(false), 1000); // Hide cursor after typing
          }
        }, 50 + Math.random() * 30); // Randomize typing speed slightly for realism
        return () => clearInterval(interval);
      }, delay * 1000);
      return () => clearTimeout(startDelay);
    }
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
      <motion.span 
        animate={{ opacity: showCursor ? [1, 0] : 0 }} 
        transition={{ repeat: showCursor ? Infinity : 0, duration: 0.8 }} 
        className="inline-block w-[3px] h-[0.9em] bg-blue-500 ml-1 align-middle"
      />
    </span>
  );
};

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 pb-8 border-b border-neutral-100">
          <div className="max-w-2xl">
            <span className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-4">
              <span className="absolute inset-[-1000%] animate-spin-badge bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#3b82f6_50%,#e2e8f0_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-white/90 px-4 py-1 backdrop-blur-3xl">
                <span className="text-blue-600 font-bold tracking-[0.2em] text-[10px] uppercase font-sans">Our Expertise</span>
              </span>
            </span>
            <h2 className="text-4xl md:text-6xl font-display leading-tight min-h-[2.5em]">
              <div className="text-neutral-900">
                <Typewriter text="Solutions for" />
              </div>
              <div className="text-neutral-400">
                <Typewriter text="Digital Dominance." delay={0.8} />
              </div>
            </h2>
          </div>
          <p className="text-neutral-500 max-w-sm mt-8 md:mt-0 text-right md:text-left font-light text-lg font-sans leading-relaxed">
            최고의 기술력과 크리에이티브로<br/>
            귀사의 비즈니스 가치를 높입니다.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-8 h-full rounded-[2rem] bg-neutral-50 border border-neutral-100 transition-all duration-500 hover:bg-white hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden min-h-[300px]"
            >
              {service.id === 1 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMTQ1/MDAxNzY2OTEyNzIwNjE4.zkCl2fBru4VSBON2CEzBzDuleU05oPYhOD4uHj10MjAg.OVRet3g42tCXTo2b_wtAcLtHbvYthP9OrILfpU5tmSUg.PNG/1502_0002.png?type=w966" alt="AI Automation 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}
              {service.id === 2 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMjYw/MDAxNzY2OTE0MTA5MTEw.wYOy-fNmlkGw-trx2AkukrLk8P31tDibkK4cFhyuBWIg.UJBbF4M2VX1jZPinbTfmyz4CxagybdoUUKh7imrc_eUg.PNG/1502_0003.png?type=w966" alt="Performance Marketing 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}
              {service.id === 3 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMTQz/MDAxNzY2OTE0MTA5MTQ3.ks8v0i8kJhJ1Bbt5rRK14UwwVQb1dpzPyzn3epjIkQgg.VlzJBzXnQm8N57QIBaKgL52XC7jNfZvu5h_IIJSY1TAg.PNG/1502_0004.png?type=w966" alt="Intelligent Chatbot 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}
              {service.id === 4 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMTQ0/MDAxNzY2OTE0ODc4MDY5.e1X_wS6KrqscT6A9wMlvKRcjKOTyu577tITYnRpxP-Ug.P6SS8Uzq9cQ1jfWdonrc7cfpv6pdpks4OeF0vqLRa2cg.PNG/1502_0005.png?type=w966" alt="Web & App Dev 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}
              {service.id === 5 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMjYw/MDAxNzY2OTE0MTA5MTEw.wYOy-fNmlkGw-trx2AkukrLk8P31tDibkK4cFhyuBWIg.UJBbF4M2VX1jZPinbTfmyz4CxagybdoUUKh7imrc_eUg.PNG/1502_0003.png?type=w966" alt="Data Analytics 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}
              {service.id === 6 && (
                <div className="absolute top-0 right-0 z-0 pointer-events-none opacity-40 md:opacity-100">
                   <div className="w-80 h-80 -mr-16 -mt-16 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] md:opacity-0 md:translate-x-20 md:-translate-y-20 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                      <img src="https://postfiles.pstatic.net/MjAyNTEyMjhfMTQ1/MDAxNzY2OTEyNzIwNjE4.zkCl2fBru4VSBON2CEzBzDuleU05oPYhOD4uHj10MjAg.OVRet3g42tCXTo2b_wtAcLtHbvYthP9OrILfpU5tmSUg.PNG/1502_0002.png?type=w966" alt="Brand Strategy 3D" className="w-full h-full object-contain drop-shadow-2xl" />
                   </div>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-900 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm">
                  <Icon icon={service.icon} width={26} />
                </div>
                <h3 className="text-2xl font-display text-neutral-900 mb-2 group-hover:translate-x-1 transition-transform">{service.title}</h3>
                <p className="text-[10px] text-blue-600 font-sans tracking-widest uppercase mb-6 font-bold">{service.titleEn}</p>
                <p className="text-neutral-500 text-[15px] leading-relaxed font-sans font-light mt-auto">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
