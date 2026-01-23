import { isValidJWTFormat, RateLimiter } from './security';

/**
 * API security utilities for secure HTTP requests
 */

// Create a rate limiter for API calls
const apiRateLimiter = new RateLimiter(100, 30000); // 100 requests per 30 seconds

/**
 * Validates and retrieves the auth token from localStorage
 */
export function getAuthToken(): string | null {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return null;
  }
  
  // Validate JWT format
  if (!isValidJWTFormat(token)) {
    console.warn('Invalid token format detected, clearing token');
    localStorage.removeItem('authToken');
    return null;
  }
  
  return token;
}

/**
 * Securely stores auth token
 */
export function setAuthToken(token: string): void {
  if (!isValidJWTFormat(token)) {
    throw new Error('Invalid token format');
  }
  
  localStorage.setItem('authToken', token);
}

/**
 * Removes auth token
 */
export function clearAuthToken(): void {
  localStorage.removeItem('authToken');
}

/**
 * Creates secure headers for API requests
 */
export function createSecureHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Helps prevent CSRF
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

/**
 * Validates API response to prevent malicious responses
 */
export function validateAPIResponse(response: Response): void {
  // Check Content-Type to prevent content sniffing attacks
  const contentType = response.headers.get('Content-Type');
  if (contentType && !contentType.includes('application/json')) {
    throw new Error('Invalid response content type');
  }
}

/**
 * Secure fetch wrapper with built-in protections
 */
export async function secureFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Rate limiting check
  if (!apiRateLimiter.isAllowed('api-call')) {
    throw new Error('Too many requests. Please try again later.');
  }
  
  // Ensure HTTPS in production (allow HTTP only in development)
  if (import.meta.env.MODE === 'production' && !url.startsWith('https://')) {
    throw new Error('Only HTTPS connections allowed in production');
  }
  
  // Add secure headers
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...createSecureHeaders(true),
      ...options.headers,
    },
    // Credentials policy
    credentials: 'same-origin',
    // Prevent caching of sensitive data
    cache: 'no-store',
  };
  
  try {
    const response = await fetch(url, secureOptions);
    
    // Validate response
    validateAPIResponse(response);
    
    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401) {
      clearAuthToken();
      // Optionally redirect to login
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    return response;
  } catch (error) {
    // Sanitize error messages to prevent information leakage
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

/**
 * Safely parse JSON response with error handling
 */
export async function safeJSONParse<T>(response: Response): Promise<T> {
  try {
    const text = await response.text();
    
    // Validate that response isn't too large (prevent DoS)
    if (text.length > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('Response too large');
    }
    
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid response format');
    }
    throw error;
  }
}

/**
 * Sanitizes request body to prevent injection attacks
 */
export function sanitizeRequestBody(body: unknown): unknown {
  if (typeof body !== 'object' || body === null) {
    return body;
  }
  
  // Prevent prototype pollution
  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }
  
  const sanitized: Record<string, unknown> = {};
  
  for (const key in body) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      // Block dangerous keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      
      const value = (body as Record<string, unknown>)[key];
      
      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeRequestBody(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

/**
 * Create a secure POST request
 */
export async function securePost<T>(
  url: string,
  data: unknown
): Promise<T> {
  const sanitizedData = sanitizeRequestBody(data);
  
  const response = await secureFetch(url, {
    method: 'POST',
    body: JSON.stringify(sanitizedData),
  });
  
  if (!response.ok) {
    const errorData = await safeJSONParse<{ message?: string }>(response);
    throw new Error(errorData.message || 'Request failed');
  }
  
  return safeJSONParse<T>(response);
}

/**
 * Create a secure GET request
 */
export async function secureGet<T>(url: string): Promise<T> {
  const response = await secureFetch(url, {
    method: 'GET',
  });
  
  if (!response.ok) {
    const errorData = await safeJSONParse<{ message?: string }>(response);
    throw new Error(errorData.message || 'Request failed');
  }
  
  return safeJSONParse<T>(response);
}

/**
 * Validates OAuth state to prevent CSRF attacks
 */
export function validateOAuthState(receivedState: string): boolean {
  const storedState = sessionStorage.getItem('challonge_oauth_state');
  
  if (!storedState) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  if (receivedState.length !== storedState.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < receivedState.length; i++) {
    result |= receivedState.charCodeAt(i) ^ storedState.charCodeAt(i);
  }
  
  // Clean up
  sessionStorage.removeItem('challonge_oauth_state');
  
  return result === 0;
}

/**
 * Generate cryptographically secure random state for OAuth
 */
export function generateOAuthState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
