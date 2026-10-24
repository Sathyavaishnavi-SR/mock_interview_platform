import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Practice Interview', path: '/interview-setup' },
    { label: 'Post Interview Experience', path: '/post-experience' },
    { label: 'Post Interview Questions', path: '/post-questions' },
    { label: 'Results & Statistics', path: '/results' },
  ];

  const displayName = user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

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
          {mobileOpen ? 'Close' : 'Menu'}
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
            <span className="user-name">{displayName}</span>
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
                    <span className="nav-text">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer User Info & Logout */}
        <div className="sidebar-bottom">
          <div className="user-info-card">
            <div className="user-avatar">{initial}</div>
            <div className="user-details">
              <span className="user-role-name">{displayName}</span>
              <span className="user-status-badge">Logged In</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout-btn"
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: '0.75rem',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              textAlign: 'center',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
