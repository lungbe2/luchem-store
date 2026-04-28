import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have a valid reset session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
      }
    };
    checkSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
    setLoading(false);
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
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
            <h2>Password Updated!</h2>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Your password has been successfully changed.
            </p>
            <p style={{ color: '#666' }}>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Set New Password</h1>
            
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

            <form onSubmit={handleReset}>
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
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
                  style={styles.showPasswordBtn}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.showPasswordBtn}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
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
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
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
  }
};
