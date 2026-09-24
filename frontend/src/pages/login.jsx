import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authentication.jsx';
import { loginAdmin } from '../services/adminservice.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'global_admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // TEMPORARY - Remove this when backend is ready
  if (form.role === 'global_admin') {
    login(
      {
        name: 'Global Admin',
        email: form.email,
        role: 'global_admin',
        department: null
      },
      'fake-token-global'
    );
    navigate('/global-admin/dashboard');
  } else {
    login(
      {
        name: 'Local Admin',
        email: form.email,
        role: 'local_admin',
        department: 'ECE'
      },
      'fake-token-local'
    );
    navigate('/local-admin/dashboard');
  }
};
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 35%, #0097A7 70%, #00BCD4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(0,188,212,0.1)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo Card */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            🎯
          </div>
          <h1 style={{
            color: '#fff',
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '6px',
            letterSpacing: '-0.5px'
          }}>
            MockPrep
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '15px',
            fontWeight: '400'
          }}>
            Admin Portal — Interview Platform
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#1A2332',
            marginBottom: '6px'
          }}>
            Welcome Back 👋
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#546E7A',
            marginBottom: '28px'
          }}>
            Sign in to access your admin dashboard
          </p>

          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FFEBEE',
              border: '1px solid #EF9A9A',
              borderRadius: '8px',
              color: '#C62828',
              fontSize: '14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#546E7A',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '10px'
              }}>
                Login As
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                {[
                  { value: 'global_admin', label: '🌐 Global Admin', desc: 'All Departments' },
                  { value: 'local_admin', label: '🏢 Local Admin', desc: 'My Department' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: opt.value })}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: form.role === opt.value
                        ? '2px solid #1565C0'
                        : '2px solid #E0E6ED',
                      background: form.role === opt.value
                        ? '#E3F2FD'
                        : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <p style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: form.role === opt.value ? '#1565C0' : '#1A2332',
                      marginBottom: '2px'
                    }}>
                      {opt.label}
                    </p>
                    <p style={{
                      fontSize: '11px',
                      color: '#90A4AE'
                    }}>
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#546E7A',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px'
                }}>
                  ✉️
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@college.edu"
                  style={{
                    width: '100%',
                    padding: '13px 16px 13px 44px',
                    border: '2px solid #E0E6ED',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1A2332',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#1565C0';
                    e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#E0E6ED';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '700',
                color: '#546E7A',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px'
                }}>
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 44px',
                    border: '2px solid #E0E6ED',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: '#1A2332',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#1565C0';
                    e.target.style.boxShadow = '0 0 0 3px rgba(21,101,192,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#E0E6ED';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading
                  ? '#90A4AE'
                  : 'linear-gradient(135deg, #1565C0, #1976D2)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(21,101,192,0.4)',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : (
                '🚀 Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '13px',
          marginTop: '24px'
        }}>
          © 2026 MockPrep Platform. PSG COLLEGE OF TECHNOLOGY.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;