import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CompanyMarquee from '../components/CompanyMarquee';
import ValueSection from '../components/ValueSection';
import RatingSection from '../components/RatingSection';
import HowItWorks from '../components/HowItWorks';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import ScrollScene from '../three/ScrollScene';

export default function Landing() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentScroll = window.scrollY;
        const progress = Math.min(Math.max(currentScroll / totalScroll, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* 1. Persistent 3D Canvas spanning the entire landing page viewport */}
      <ScrollScene scrollProgress={scrollProgress} />

      {/* 2. Fixed Navbar */}
      <Navbar />

      {/* 3. Document Content Flow */}
      <main className="landing-content">
        <HeroSection />
        <CompanyMarquee />
        <ValueSection />
        <RatingSection />
        <HowItWorks />
        <CTASection />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
