
import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Partners from './components/Partners';
import PainPoint from './components/PainPoint';
import Services from './components/Services';
import Members from './components/Members';
import Contact from './components/Contact';
import FloatingActions from './components/FloatingActions';
import SplashScreen from './components/SplashScreen';
import ScrollProgress from './components/ScrollProgress';
import Admin from './components/Admin';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { scrollYProgress } = useScroll();

  // Simple routing check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') {
      setIsAdmin(true);
      setLoading(false); // Skip splash for admin
    }
  }, []);

  // Global Background Transition Logic
  // Define breakpoints based on component order:
  // 0 - 0.45: Light (Hero, About, Partners)
  // 0.45 - 0.65: Dark (PainPoint)
  // 0.65 - 0.80: Light (Services)
  // 0.80 - 1.0: Dark (Members, Contact)
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.45, 0.48, 0.65, 0.68, 0.80, 0.83, 1],
    ["#fafafa", "#fafafa", "#050505", "#050505", "#fafafa", "#fafafa", "#050505", "#050505"]
  );

  const handleSplashComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  if (isAdmin) {
    return <Admin />;
  }

  return (
    <motion.main 
      style={{ backgroundColor }}
      className="min-h-screen text-brand-text selection:bg-brand-accent selection:text-white relative transition-colors duration-700 ease-in-out"
    >
      <SplashScreen onComplete={handleSplashComplete} />
      
      <div className="bg-noise fixed inset-0 z-[60] pointer-events-none opacity-[0.03]"></div>
      
      <Navbar />
      <ScrollProgress />
      
      <Hero skipEntrance={!loading} /> 
      <About />
      <Partners />
      <PainPoint />
      <Services />
      <Members />
      <Contact />
      <FloatingActions />
    </motion.main>
  );
};

export default App;
