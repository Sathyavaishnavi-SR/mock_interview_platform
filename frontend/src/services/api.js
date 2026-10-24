/**
 * Base API Service Abstraction
 * Handles HTTP requests, JWT token attachment, and 401 interceptor.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Token management helpers
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('authToken', token);
  }
}

export function getAuthToken() {
  return localStorage.getItem('authToken');
}

export function removeAuthToken() {
  localStorage.removeItem('authToken');
}

/**
 * Generic fetch wrapper for backend communication.
 * @param {string} endpoint - Relative API path (e.g. '/auth/login')
 * @param {RequestInit} [options] - Standard fetch options
 */
export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const defaultHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // 401 Interceptor: clear token and redirect to /login
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      removeAuthToken();
      localStorage.removeItem('authUser');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `HTTP error! Status: ${response.status}`,
        statusCode: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong. Please check your internet connection.',
      statusCode: 500,
    };
  }
}
