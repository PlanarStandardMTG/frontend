import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation, sanitization, and XSS protection
 */

// Configure DOMPurify with strict settings
const purifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  KEEP_CONTENT: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Use this for any user-generated content that may contain HTML
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, purifyConfig);
}

/**
 * Sanitizes plain text content
 * Escapes HTML special characters to prevent XSS
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates username format
 * - 3-20 characters
 * - Alphanumeric, underscores, and hyphens only
 * - No special characters that could be used for injection
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validates password strength
 * - Minimum 8 characters
 * - Maximum 128 characters (prevent DoS attacks)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}

/**
 * Sanitizes URL to prevent javascript: and data: protocol attacks
 */
export function sanitizeURL(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  const trimmedUrl = url.trim();
  
  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmedUrl)) {
    return '';
  }

  // Only allow http, https, and relative URLs
  if (!/^(https?:)?\/\//i.test(trimmedUrl) && !/^\//.test(trimmedUrl)) {
    return '';
  }

  return trimmedUrl;
}

/**
 * Validates UUID format (for IDs)
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Sanitizes input for localStorage/sessionStorage
 * Prevents storing potentially malicious data
 */
export function sanitizeStorageValue(value: string): string {
  if (typeof value !== 'string') {
    return '';
  }
  
  // Remove any script tags or event handlers
  return sanitizeHTML(value);
}

/**
 * Validates JWT token format (basic check)
 */
export function isValidJWTFormat(token: string): boolean {
  if (typeof token !== 'string') {
    return false;
  }
  
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Rate limiting helper for client-side actions
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if an action is allowed
   * @param key - Identifier for the action (e.g., 'login', 'api-call')
   * @returns true if action is allowed, false if rate limited
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.attempts.get(key) || [];
    
    // Remove timestamps outside the window
    const recentTimestamps = timestamps.filter(t => now - t < this.windowMs);
    
    if (recentTimestamps.length >= this.maxAttempts) {
      return false;
    }
    
    recentTimestamps.push(now);
    this.attempts.set(key, recentTimestamps);
    return true;
  }

  /**
   * Reset attempts for a specific key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all attempts
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

/**
 * Content Security Policy helpers
 */
export const CSP = {
  /**
   * Generate a nonce for inline scripts
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
};

/**
 * Validates that input doesn't contain SQL injection patterns
 * Note: Backend should handle SQL injection prevention,
 * but this provides an extra layer of client-side validation
 */
export function containsSQLInjectionPattern(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /('OR'|"OR"|'AND'|"AND")/gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Validates that input doesn't contain NoSQL injection patterns
 */
export function containsNoSQLInjectionPattern(input: string): boolean {
  const noSqlPatterns = [
    /\$where/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$lt/gi,
    /\$or/gi,
    /\$and/gi,
    /\$regex/gi,
  ];
  
  return noSqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize object keys to prevent prototype pollution
 */
export function sanitizeObjectKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Block dangerous keys
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
}

/**
 * Secure comparison to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}
