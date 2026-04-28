import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      // Successful login
      router.push('/account');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/account'
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '400px',
        margin: '80px auto',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Welcome Back</h1>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          />
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 76px 12px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link href="/forgot-password" style={{ color: '#667eea', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ margin: '20px 0', textAlign: 'center', position: 'relative' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
          <span style={{
            position: 'relative',
            top: '-12px',
            background: 'white',
            padding: '0 10px',
            color: '#999'
          }}>or</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '20px' }}>G</span>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#667eea', textDecoration: 'none' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
