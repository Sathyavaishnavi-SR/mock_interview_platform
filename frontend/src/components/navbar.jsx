import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    if (role === 'global_admin') return 'Global Administrator';
    if (role === 'local_admin') return `Local Admin — ${user?.department || ''}`;
    return 'Admin';
  };

  const getRoleBadgeColor = (role) => {
    if (role === 'global_admin') return { bg: '#E3F2FD', color: '#1565C0' };
    return { bg: '#E8F5E9', color: '#2E7D32' };
  };

  const badgeStyle = getRoleBadgeColor(user?.role);

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      height: 'var(--navbar-height)',
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 30px',
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {title || 'Admin Portal'}
          </h2>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginTop: '1px'
          }}>
            Mock Interview Platform
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell */}
        <button style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '1px solid var(--border)',
          background: 'var(--light)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'var(--transition)',
          position: 'relative'
        }}
          onMouseEnter={e => e.target.style.background = '#E3F2FD'}
          onMouseLeave={e => e.target.style.background = 'var(--light)'}
        >
          🔔
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: '#E53935',
            borderRadius: '50%',
            border: '2px solid #fff'
          }} />
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--white)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1565C0, #00BCD4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '15px'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                lineHeight: '1.2'
              }}>
                {user?.name || 'Admin'}
              </p>
              <p style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                lineHeight: '1.2'
              }}>
                {getRoleLabel(user?.role)}
              </p>
            </div>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginLeft: '4px'
            }}>
              {showDropdown ? '▲' : '▼'}
            </span>
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid var(--border)',
              minWidth: '220px',
              zIndex: 200,
              overflow: 'hidden',
              animation: 'fadeIn 0.2s ease'
            }}>
              {/* Profile Info */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                background: 'linear-gradient(135deg, #E3F2FD, #F5F7FA)'
              }}>
                <p style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}>
                  {user?.name}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  marginTop: '2px'
                }}>
                  {user?.email}
                </p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: badgeStyle.bg,
                  color: badgeStyle.color
                }}>
                  {getRoleLabel(user?.role)}
                </span>
              </div>

              {/* Menu Items */}
              <div style={{ padding: '8px 0' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#C62828',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FFEBEE'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;