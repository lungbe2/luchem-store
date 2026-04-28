import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await fetch('/api/profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ full_name: fullName })
        });
      }
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div>
        <Navbar />
        <div style={{
          maxWidth: '400px',
          margin: '80px auto',
          padding: '40px',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
          <h2>Check Your Email</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>
            We've sent you a confirmation link to {email}
          </p>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

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
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h1>
        
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

        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link href="/forgot-password" style={{ color: '#667eea', textDecoration: 'none' }}>
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
