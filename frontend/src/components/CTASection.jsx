import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="section" id="cta">
      <div className="container">
        <div className="glass-panel cta-box">
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            Ready to practice your next interview?
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            Join fellow PSG College of Technology students and boost your placement confidence with AI mock interviews.
          </p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ padding: '0.9rem 2.25rem', fontSize: '1.05rem' }}>
            Start Practicing
          </button>
        </div>
      </div>
    </section>
  );
}

