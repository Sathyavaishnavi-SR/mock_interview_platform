import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { label: 'Practice Interview', path: '/interview-setup', icon: '🎯' },
    { label: 'Post Interview Experience', path: '/post-experience', icon: '📝' },
    { label: 'Post Interview Questions', path: '/post-questions', icon: '❓' },
    { label: 'Results & Statistics', path: '/results', icon: '📊' },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="dash-mobile-header">
        <Link to="/" className="nav-brand">
          <div className="nav-logo-icon">PSG</div>
          <span className="nav-brand-title">PSG College of Technology</span>
        </Link>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Dashboard Menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Persistent Sidebar (Desktop) / Mobile Drawer */}
      <aside className={`dashboard-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-top">
          {/* PSG Brand */}
          <Link to="/" className="sidebar-brand">
            <div className="nav-logo-icon">PSG</div>
            <div className="brand-text">
              <span className="brand-title">PSG College of Technology</span>
              <span className="brand-sub">AI MOCK PLATFORM</span>
            </div>
          </Link>

          {/* User Welcome Greeting */}
          <div className="sidebar-user-greeting">
            <span className="greeting-label">Welcome,</span>
            <span className="user-name">Student</span>
          </div>

          {/* Main Menu */}
          <div className="sidebar-menu-section">
            <div className="sidebar-section-title">MAIN MENU</div>
            <nav className="sidebar-nav">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-text">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="sidebar-bottom">
          <div className="user-info-card">
            <div className="user-avatar">S</div>
            <div className="user-details">
              <span className="user-role-name">Student</span>
              <span className="user-status-badge">Logged In</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

