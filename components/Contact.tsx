
import React, { useState } from 'react';
import Button from './Button';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Contact: React.FC = () => {
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("AI Automation");
  
  // Form States
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const address = "경기 남양주시 다산지금로 202 현대테라타워DIMC B동 835호";
  const mapImage = "https://postfiles.pstatic.net/MjAyNTEyMzBfMzMg/MDAxNzY3MDY3MjkxMTk1.RwsvGH6Q9uJbuPFy8-WFiQjUtbuJ3_puNaGlGmnprY8g.qmxodNqEuIkJ8UWKD9xsQcihAWX1Z4RUh6rZJhln9gog.JPEG/1502_0007.jpg?type=w966";

  const interests = ["AI Automation", "Marketing", "Ad Creatives", "App Dev", "Consulting", "Other"];

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        project_type: selectedInterest,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-[#0a0a0a] text-white pt-24 pb-12 rounded-t-[3rem] mt-12 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Content Grid: Info & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-12 relative z-20">
            {/* Left Info */}
            <div className="flex flex-col h-full">
              <span className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-8 w-fit">
                <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#333_0%,#fff_50%,#333_100%)]" />
                <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-900/90 px-4 py-1.5 backdrop-blur-3xl">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 font-sans uppercase">CONTACT US</span>
                </span>
              </span>
              <h2 className="text-5xl md:text-7xl font-sans font-light text-white mb-8 leading-tight tracking-tight">
                Let's Build <br />
                <span className="text-neutral-500">The Future.</span>
              </h2>
              <p className="text-neutral-400 mb-12 text-lg font-sans font-light max-w-md">
                프로젝트에 대해 이야기해 보세요. <br/>
                TEAM 1502가 비즈니스의 다음 단계를 함께 설계합니다.
              </p>

              <div className="space-y-8 border-t border-white/10 pt-8 mt-auto">
                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="mt-1 text-neutral-500 group-hover:text-white transition-colors">
                    <Icon icon="solar:letter-linear" width={24} />
                  </div>
                  <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1 font-bold">Email</div>
                    <div className="text-xl font-sans font-light text-neutral-200 group-hover:text-white transition-colors break-all">1502factory@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="mt-1 text-neutral-500 group-hover:text-white transition-colors">
                    <Icon icon="solar:phone-calling-linear" width={24} />
                  </div>
                   <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1 font-bold">Phone</div>
                    <div className="text-xl font-sans font-light text-neutral-200 group-hover:text-white transition-colors">+82-10-2455-1502</div>
                  </div>
                </div>

                {/* Address Section Trigger */}
                <div 
                  className="flex items-start gap-6 group cursor-pointer"
                  onClick={() => setShowMap(!showMap)}
                >
                  <div className="mt-1 text-neutral-500 group-hover:text-white transition-colors">
                    <Icon icon="solar:map-point-linear" width={24} />
                  </div>
                   <div className="flex-1">
                    <div className="text-xs text-neutral-500 uppercase tracking-widest mb-1 font-bold">Office</div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-xl font-sans font-light text-neutral-200 group-hover:text-white transition-colors">
                        {address}
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/btn"
                      >
                        {copied ? (
                          <>
                            <Icon icon="solar:check-circle-bold" className="text-green-500 text-sm" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Copied</span>
                          </>
                        ) : (
                          <>
                            <Icon icon="solar:copy-linear" className="text-neutral-400 group-hover/btn:text-white transition-colors text-sm" />
                            <span className="text-[10px] font-bold text-neutral-400 group-hover/btn:text-white uppercase tracking-wider transition-colors">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-neutral-500 group-hover:text-blue-400 transition-colors">
                      <Icon icon={showMap ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} />
                      <span>{showMap ? "지도 접기" : "지도 보기"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form - Reimagined Luxury Design with Moving Border */}
            <div className="relative w-full h-fit rounded-[2rem] shadow-2xl overflow-hidden p-[1px]">
               {/* Moving Border Animation Layer */}
               <span className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#3b82f6_50%,#000000_100%)]" />
               
               <div className="relative bg-[#050505] rounded-[calc(2rem-1px)] p-6 md:p-12 overflow-hidden h-full">
                   {/* Inner Ambient Light */}
                   <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
                   <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-900/10 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />

                   <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8 md:gap-10">
                      
                      {/* Section: Interests */}
                      <div className="space-y-4">
                         <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] font-sans">Project Type</span>
                         <div className="flex flex-wrap gap-2">
                           {interests.map((item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setSelectedInterest(item)}
                                className={`
                                  px-4 py-2 md:px-5 md:py-2.5 rounded-full text-[12px] font-medium transition-all duration-300 font-sans border whitespace-nowrap
                                  ${selectedInterest === item 
                                     ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                                     : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5'}
                                `}
                              >
                                {item}
                              </button>
                           ))}
                         </div>
                      </div>

                      {/* Section: Inputs */}
                      <div className="space-y-6 md:space-y-8">
                           {/* Name */}
                           <div className="relative group/input">
                              <input 
                                 type="text" 
                                 id="name"
                                 value={formData.name}
                                 onChange={handleInputChange}
                                 required
                                 className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300 font-sans text-lg"
                                 placeholder="Name"
                              />
                              <label 
                                  htmlFor="name"
                                  className="absolute left-0 top-3 text-neutral-500 text-base transition-all duration-300 pointer-events-none
                                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
                                             peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-blue-400
                                             peer-valid:-top-4 peer-valid:text-[10px] peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-neutral-400"
                              >
                                  Your Name
                              </label>
                           </div>

                           {/* Email */}
                           <div className="relative group/input">
                              <input 
                                 type="email" 
                                 id="email"
                                 value={formData.email}
                                 onChange={handleInputChange}
                                 required
                                 className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300 font-sans text-lg"
                                 placeholder="Email"
                              />
                              <label 
                                  htmlFor="email"
                                  className="absolute left-0 top-3 text-neutral-500 text-base transition-all duration-300 pointer-events-none
                                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
                                             peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-blue-400
                                             peer-valid:-top-4 peer-valid:text-[10px] peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-neutral-400"
                              >
                                  Email Address
                              </label>
                           </div>

                           {/* Message */}
                           <div className="relative group/input">
                              <textarea 
                                 rows={1}
                                 id="message"
                                 value={formData.message}
                                 onChange={handleInputChange}
                                 required
                                 className="peer w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-all duration-300 font-sans text-lg resize-none min-h-[50px] focus:min-h-[120px]"
                                 placeholder="Message"
                              ></textarea>
                              <label 
                                  htmlFor="message"
                                  className="absolute left-0 top-3 text-neutral-500 text-base transition-all duration-300 pointer-events-none
                                             peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-neutral-500
                                             peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-blue-400
                                             peer-valid:-top-4 peer-valid:text-[10px] peer-valid:font-bold peer-valid:uppercase peer-valid:tracking-widest peer-valid:text-neutral-400"
                              >
                                  Project Details
                              </label>
                           </div>
                      </div>

                      {/* Submit */}
                      <div className="pt-4">
                          <button 
                            type="submit"
                            disabled={isSubmitting || submitStatus === 'success'}
                            className="relative w-full group overflow-hidden bg-white text-black rounded-full py-5 font-bold tracking-widest uppercase text-sm hover:bg-neutral-200 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                          >
                             <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Sent Successfully!' : 'Send Message'}
                                {submitStatus === 'success' ? <Icon icon="solar:check-circle-bold" className="text-green-600" /> : <Icon icon="solar:arrow-right-up-linear" className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                             </span>
                             {/* Hover Shine Effect */}
                             <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent z-0 opacity-50" />
                          </button>
                          {submitStatus === 'error' && <p className="text-red-500 text-xs text-center mt-2">Failed to send. Please try again.</p>}
                      </div>

                   </form>
               </div>
            </div>
          </div>
          
          {/* Expanded Map & Image Section - Opens in a new row below the grid */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 0 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden w-full"
              >
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                     {/* Left: Location Visual */}
                     <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 h-[250px] md:h-[350px]">
                        <img 
                          src={mapImage} 
                          alt="Office Location Visual" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                           <p className="text-[10px] text-white/80 text-center uppercase tracking-widest font-bold">Location Visual</p>
                        </div>
                     </div>

                     {/* Right: Google Map (Color) */}
                     <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-900 h-[300px] md:h-[350px]">
                        {/* Close Button Inside Map Container for convenience */}
                        <div className="absolute top-4 right-4 z-30">
                           <button 
                             onClick={() => setShowMap(false)}
                             className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-black hover:bg-neutral-200 transition-all duration-300"
                           >
                             <Icon icon="solar:close-circle-linear" width={20} />
                           </button>
                        </div>
                        <iframe 
                           width="100%" 
                           height="100%" 
                           frameBorder="0" 
                           scrolling="no" 
                           src="https://maps.google.com/maps?q=경기%20남양주시%20다산지금로%20202%20현대테라타워DIMC&t=&z=16&ie=UTF8&iwloc=&output=embed"
                           title="Google Map"
                           className="w-full h-full"
                           loading="lazy"
                        ></iframe>
                     </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <footer className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-sans tracking-wide mt-24">
          <div className="text-center md:text-left mb-4 md:mb-0">
            &copy; 2024 TEAM 1502. All rights reserved.
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
