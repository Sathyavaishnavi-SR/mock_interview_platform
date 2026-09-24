/**
 * Base API Service Abstraction
 * Uses native fetch API to communicate with the Express backend.
 */

const BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper for backend communication.
 * @param {string} endpoint - Relative API path (e.g. '/health')
 * @param {RequestInit} [options] - Standard fetch options
 */
export async function apiRequest(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

