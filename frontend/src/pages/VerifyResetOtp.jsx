import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth3D from '../three/Auth3D';
import { useAuth } from '../context/AuthContext';

export default function VerifyResetOtp() {
  const navigate = useNavigate();
  const { verifyResetOtp, forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState(() => localStorage.getItem('email') || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // 60-second cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
    setError('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Email is missing. Please restart password reset.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    const response = await verifyResetOtp(email, otp);

    if (response.success) {
      setSuccessMsg('OTP verified successfully! Redirecting...');
      setTimeout(() => {
        navigate('/reset-password');
      }, 1000);
    } else {
      if (response.statusCode === 429) {
        setError('Too many failed attempts. Try again in 10 minutes.');
      } else {
        setError(response.message || 'Invalid or expired OTP.');
      }
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || loading) return;
    setError('');
    setSuccessMsg('');

    if (!email) {
      setError('Email address is missing.');
      return;
    }

    const response = await forgotPassword(email);
    if (response.success) {
      setSuccessMsg('A new reset OTP has been sent to your email.');
      setResendCooldown(60); // 60 seconds cooldown
    } else {
      if (response.statusCode === 429) {
        setError('Too many requests. Please wait before requesting another OTP.');
      } else {
        setError(response.message || 'Failed to resend reset OTP.');
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
          <h1 className="auth-title">Verify reset code</h1>
          <p className="auth-subtitle">
            Enter the 6-digit OTP sent to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{email || 'your email'}</strong>
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

        {successMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22c55e',
              borderRadius: 'var(--radius-sm)',
              color: '#86efac',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleVerify} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="otp" className="form-label" style={{ textAlign: 'center' }}>
              6-Digit Reset Code
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="123456"
              maxLength={6}
              style={{
                textAlign: 'center',
                letterSpacing: '8px',
                fontSize: '1.4rem',
                fontWeight: 'bold',
              }}
              className="form-input"
              autoComplete="one-time-code"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-btn"
            disabled={loading || otp.length !== 6}
            style={{
              opacity: loading || otp.length !== 6 ? 0.7 : 1,
              cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span>Verifying...</span>
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              style={{
                background: 'none',
                border: 'none',
                color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--accent-blue)',
                cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                textDecoration: resendCooldown > 0 ? 'none' : 'underline',
              }}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Back to{' '}
          <Link to="/forgot-password" className="auth-link">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
}
