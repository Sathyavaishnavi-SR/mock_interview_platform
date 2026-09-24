import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', items: 'center', gap: '0.75rem', fontWeight: 'bold' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px'
              }}>
                PSG
              </div>
              <span>PSG College of Technology</span>
            </div>
            <p>
              AI-Powered Mock Interview Platform tailored for college students preparing for technical, domain, and placement interviews.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#value-props">Value Proposition</a></li>
              <li><a href="#student-ratings">Student Ratings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Account</h4>
            <ul className="footer-links">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/dashboard">Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Institution</h4>
            <ul className="footer-links">
              <li><span>PSG College of Technology</span></li>
              <li><span>Department of Training & Placement</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} AI Mock Interview Platform • PSG College of Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
