import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
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
      alert('Account created! Please check your email to confirm.');
      setIsLogin(true);
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        
        <h2 style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={styles.subtitle}>
          {isLogin ? 'Sign in to continue shopping' : 'Create an account for faster checkout'}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={styles.input}
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...styles.input, paddingRight: '76px', marginBottom: 0 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.showPasswordBtn}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {isLogin && (
            <div style={styles.forgotWrap}>
              <Link href="/forgot-password" style={styles.forgotLink} onClick={onClose}>
                Forgot your password?
              </Link>
            </div>
          )}
          
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={styles.switchText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '90%',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#999'
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px'
  },
  passwordWrap: {
    position: 'relative',
    marginBottom: '15px'
  },
  showPasswordBtn: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: '600'
  },
  forgotWrap: {
    textAlign: 'right',
    margin: '-4px 0 15px'
  },
  forgotLink: {
    color: '#667eea',
    fontSize: '14px',
    textDecoration: 'none'
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    textAlign: 'center'
  },
  switchText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666'
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
