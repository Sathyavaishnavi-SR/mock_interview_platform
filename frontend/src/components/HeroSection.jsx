import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge">
            <span style={{ fontSize: '1.1rem' }}>✨</span> AI-Driven Interview Preparation
          </div>

          <h1 className="hero-title">
            Prepare Smarter. <br />
            <span className="gradient-text">Interview Better.</span>
          </h1>

          <p className="hero-description">
            Elevate your interview readiness with personalized AI-generated questions, resume alignment, real student interview experiences, and instant performance feedback.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Start Practicing Now
            </button>
            <button className="btn-secondary" onClick={scrollToHowItWorks}>
              How It Works
            </button>
          </div>
        </div>

        {/* Right Column Layout Space for the Persistent 3D Visual */}
        <div className="hero-visual-space"></div>
      </div>
    </section>
  );
}
