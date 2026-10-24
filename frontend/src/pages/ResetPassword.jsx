import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth3D from '../three/Auth3D';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword, loading } = useAuth();

  const [email] = useState(() => localStorage.getItem('email') || '');
  const [resetToken] = useState(() => localStorage.getItem('resetToken') || '');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirm your new password';
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!email || !resetToken) {
      setServerError('Reset session expired. Please restart from Forgot Password.');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const response = await resetPassword(
      email,
      resetToken,
      formData.newPassword,
      formData.confirmNewPassword
    );

    if (response.success) {
      setSuccessMsg('Password reset successful! Redirecting to login in 2 seconds...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setServerError(response.message || 'Failed to reset password. Please try again.');
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
          <h1 className="auth-title">Reset your password</h1>
          <p className="auth-subtitle">
            Enter your new password for{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{email || 'your account'}</strong>
          </p>
        </div>

        {serverError && (
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
            {serverError}
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

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
                style={{ paddingRight: '4rem' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirm New Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                className={`form-input ${errors.confirmNewPassword ? 'input-error' : ''}`}
                style={{ paddingRight: '4rem' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <span className="form-error">{errors.confirmNewPassword}</span>
            )}
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
                <span>Updating Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Back to{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
