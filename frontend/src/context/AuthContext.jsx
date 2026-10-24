import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, getAuthToken, removeAuthToken } from '../services/api';

/**
 * Authentication Context
 * Manages global authentication state, token storage, and user profile.
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getAuthToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token);

  // Sync user object with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [user]);

  /**
   * 1. Signup
   * Submits user credentials and sends email verification OTP.
   */
  const signup = async (name, rollNo, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          rollNo: rollNo.trim().toUpperCase(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      // Store email in localStorage as 'email' for the verify-email step
      localStorage.setItem('email', email.trim().toLowerCase());
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. Verify Email
   * Validates OTP and activates user account.
   */
  const verifyEmail = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      localStorage.removeItem('email');
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 3. Resend OTP
   * Requests a new email verification OTP.
   */
  const resendOtp = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!result.success) {
        setError(result.message);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 4. Login
   * Authenticates rollNo & password, stores JWT token.
   */
  const login = async (rollNo, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          rollNo: rollNo.trim().toUpperCase(),
          password,
        }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      setAuthToken(result.token);
      setToken(result.token);
      setUser(result.user);

      // Clean up temporary keys
      localStorage.removeItem('email');
      localStorage.removeItem('resetToken');

      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 5. Forgot Password
   * Requests a password reset OTP.
   */
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      localStorage.setItem('email', email.trim().toLowerCase());
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 6. Verify Reset OTP
   * Validates reset OTP and saves the issued resetToken.
   */
  const verifyResetOtp = async (email, otp) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/verify-reset-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      if (result.resetToken) {
        localStorage.setItem('resetToken', result.resetToken);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 7. Reset Password
   * Sets new password using verified resetToken.
   */
  const resetPassword = async (email, resetToken, newPassword, confirmNewPassword) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resetToken,
          newPassword,
          confirmNewPassword,
        }),
      });

      if (!result.success) {
        setError(result.message);
        return result;
      }

      localStorage.removeItem('email');
      localStorage.removeItem('resetToken');
      return result;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   * Clears all session and auth keys.
   */
  const logout = () => {
    removeAuthToken();
    localStorage.removeItem('authUser');
    localStorage.removeItem('email');
    localStorage.removeItem('resetToken');
    setToken(null);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        error,
        setError,
        signup,
        verifyEmail,
        resendOtp,
        login,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
