/**
 * Password encryption utilities for client-side password hashing
 * Uses Web Crypto API (SubtleCrypto) for secure hashing
 */

/**
 * Hashes a password using SHA-256 algorithm
 * @param password - The plain text password to hash
 * @returns A promise that resolves to the hex-encoded hash string
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Encode the password as UTF-8
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password. Please try again.');
  }
}

/**
 * Validates that a password meets minimum requirements before hashing
 * @param password - The password to validate
 * @returns True if valid, false otherwise
 */
export function isPasswordReadyForHashing(password: string): boolean {
  return password.length >= 8 && password.length <= 128;
}
