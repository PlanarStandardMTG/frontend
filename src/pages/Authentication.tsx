import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { API_BASE_URL } from '../types/Api';
import { 
  isValidEmail, 
  isValidUsername, 
  isValidPassword,
  sanitizeText,
  RateLimiter 
} from '../utils/security';
import { setAuthToken } from '../utils/apiSecurity';
import { hashPassword } from '../utils/passwordEncryption';

// Rate limiter for authentication attempts
const authRateLimiter = new RateLimiter(5, 300000); // 5 attempts per 5 minutes

export function Authentication() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be between 8 and 128 characters.');
      return;
    }

    if (mode === 'register') {
      if (!isValidUsername(username)) {
        setError('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens.');
        return;
      }
    }

    // Rate limiting check
    if (!authRateLimiter.isAllowed(`auth-${mode}`)) {
      setError('Too many attempts. Please try again in a few minutes.');
      return;
    }

    setLoading(true);

    try {
      // Hash the password before sending
      const hashedPassword = await hashPassword(password);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        },
        credentials: 'same-origin',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          passwordHash: hashedPassword, 
          username: username.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Sanitize error message to prevent XSS
        const errorMessage = sanitizeText(data.message || 'An error occurred. Please try again.');
        setError(errorMessage);
        return;
      }

      if (mode === 'login') {
        // Store token securely
        const token = data.token;
        if (typeof token === 'string' && token.length > 0) {
          setAuthToken(token);
          setIsLoggedIn(true);
          setSuccess('Login successful! Redirecting...');
          
          // Reset rate limiter on successful login
          authRateLimiter.reset(`auth-${mode}`);
          
          // Redirect to dashboard after 1 second
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setError('Invalid authentication response.');
        }
      } else {
        // After successful registration, switch to login mode
        setSuccess('Account created successfully! Please log in.');
        setEmail('');
        setPassword('');
        setUsername('');
        
        // Reset rate limiter on successful registration
        authRateLimiter.reset(`auth-${mode}`);
        
        setTimeout(() => {
          setMode('login');
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? sanitizeText(err.message) 
        : 'An error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Authentication</h1>
          
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-300 mb-2">You are logged in</p>
              <p className="text-sm text-gray-400">{email}</p>
            </div>

            {success && (
              <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {mode === 'login' ? 'Login' : 'Register'}
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                autoComplete="email"
                maxLength={254}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={8}
                maxLength={128}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
              />
              {mode === 'register' && (
                <p className="mt-1 text-xs text-gray-400">
                  Minimum 8 characters required
                </p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input 
                  type="text" 
                  placeholder="yourusername"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="username"
                  minLength={3}
                  maxLength={20}
                  pattern="[a-zA-Z0-9_-]{3,20}"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-400">
                  3-20 characters: letters, numbers, underscores, and hyphens only
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
                setSuccess('');
                setEmail('');
                setPassword('');
                setUsername('');
              }}
              disabled={loading}
              className="w-full py-2 border-2 border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'login' ? 'Create New Account' : 'Back to Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
