import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';

const Sidebar = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const globalAdminLinks = [
    { to: '/global-admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/global-admin/experiences', icon: '📋', label: 'All Experiences' },
  ];

  const localAdminLinks = [
    { to: '/local-admin/dashboard', icon: '🏠', label: 'Dashboard' },
    { to: '/local-admin/experiences', icon: '📋', label: 'Department Experiences' },
  ];

  const links = role === 'global_admin' ? globalAdminLinks : localAdminLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: 'var(--sidebar-width)',
      height: '100vh',
      background: 'linear-gradient(180deg, #0D47A1 0%, #1565C0 40%, #1976D2 100%)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      boxShadow: '4px 0 20px rgba(0,0,0,0.15)'
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '6px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            🎯
          </div>
          <div>
            <h1 style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: '800',
              lineHeight: '1.2'
            }}>
              MockPrep
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '11px',
              fontWeight: '500'
            }}>
              Interview Platform
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #00BCD4, #26C6DA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: '800',
            fontSize: '18px',
            flexShrink: 0,
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {user?.name || 'Admin'}
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '11px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {role === 'global_admin'
                ? 'Global Administrator'
                : `${user?.department || 'Department'} Admin`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '20px 16px',
        overflowY: 'auto'
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '10px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '12px',
          paddingLeft: '12px'
        }}>
          Main Menu
        </p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '4px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '700' : '500',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
              background: isActive
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
              border: isActive
                ? '1px solid rgba(255,255,255,0.2)'
                : '1px solid transparent',
              transition: 'all 0.2s ease',
              backdropFilter: isActive ? 'blur(10px)' : 'none'
            })}
          >
            <span style={{ fontSize: '18px' }}>{link.icon}</span>
            {link.label}
            {link.badge && (
              <span style={{
                marginLeft: 'auto',
                background: '#E53935',
                color: '#fff',
                borderRadius: '20px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700'
              }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Logout */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.8)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,83,80,0.3)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;