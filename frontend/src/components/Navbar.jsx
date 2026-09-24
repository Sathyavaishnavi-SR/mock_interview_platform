import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById('footer');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* LEFT: Logo & Brand Name */}
        <Link to="/" className="nav-brand">
          <div className="nav-logo-icon">PSG</div>
          <span className="nav-brand-title">PSG College of Technology</span>
          <span className="logo-badge">AI MOCK</span>
        </Link>

        {/* CENTER: Navigation Links */}
        <nav className={`nav-center ${mobileOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="nav-link" onClick={scrollToHowItWorks}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#footer" className="nav-link" onClick={scrollToContact}>
                Contact
              </a>
            </li>
            <li>
              <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link" onClick={() => setMobileOpen(false)}>
                Sign Up
              </Link>
            </li>
          </ul>
        </nav>

        {/* RIGHT: Primary CTA & Mobile Toggle */}
        <div className="nav-right">
          <button
            className="btn-primary nav-cta-btn"
            onClick={() => {
              setMobileOpen(false);
              navigate('/login');
            }}
          >
            Start Practicing
          </button>
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  );
}
