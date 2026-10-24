import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth3D from '../three/Auth3D';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Email address is required');
      return;
    } else if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    const response = await forgotPassword(trimmedEmail);

    if (response.success) {
      navigate('/verify-reset-otp');
    } else {
      if (response.statusCode === 404) {
        setError('No account found with this email.');
      } else {
        setError(response.message || 'Failed to send reset code. Try again later.');
      }
    }
  };

  return (
    <div className="auth-container">
      <Auth3D />

      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-brand">
            <div className="nav-logo-icon">PSG</div>
            <span className="auth-brand-title">PSG College of Technology</span>
          </Link>
          <h1 className="auth-title">Forgot password</h1>
          <p className="auth-subtitle">
            Enter your registered email and we'll send you a password reset code.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-sm)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Registered Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="student@psgtech.ac.in"
              className="form-input"
              autoComplete="email"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Sending Code...</span>
              </>
            ) : (
              'Send Reset OTP'
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
