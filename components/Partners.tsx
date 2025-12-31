import React from 'react';

const partnerList = [
  "DSP ENT", 
  "MAYS ENT", 
  "DY ENT", 
  "E-LAND", 
  "BABA FASHION", 
  "IZZAT BABA", 
  "THE IZZAT", 
  "JIGOTT", 
  "JJ JIGOTT", 
  "THE TILBURY", 
  "michaa", 
  "SOUP", 
  "T.I",
  "T.I for MEN",
  "공정거래위원회", 
  "한국마사회",
  "성평등가족부"
];

const Partners: React.FC = () => {
  // Repeat the list to ensure seamless infinite scrolling
  // We need enough items to cover the screen width at -50% translate
  const items = [...partnerList, ...partnerList, ...partnerList, ...partnerList];

  return (
    <section className="py-12 bg-[#fafafa] border-b border-neutral-100 overflow-hidden relative z-20">
       <div className="flex w-full overflow-hidden select-none">
         {/* 
           animate-scroll-right moves from translateX(-50%) to translateX(0).
           gap-12: Reduced spacing by half (was gap-24)
           animationDuration: 40s (Increased speed from default 120s)
         */}
         <div 
           className="flex whitespace-nowrap gap-12 animate-scroll-right w-max hover:[animation-play-state:paused]"
           style={{ animationDuration: '40s' }}
         >
           {items.map((partner, index) => (
             <span
               key={index}
               className="text-2xl font-sans font-medium text-neutral-500 tracking-tight opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-default"
             >
               {partner}
             </span>
           ))}
         </div>
       </div>
    </section>
  );
};

export default Partners;