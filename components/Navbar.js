import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          {!logoError ? (
            <img 
              src="/assets/logo.png" 
              alt="Luchem" 
              style={styles.logoImg}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={styles.logoText}>LuChem</span>
          )}
        </Link>

        <div style={styles.navLinks}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/products" style={styles.navLink}>Shop</Link>
          <Link href="/water" style={styles.navLink}>💧 Water</Link>
          <Link href="/raw-materials" style={styles.navLink}>Raw Materials</Link>
          <Link href="/services" style={styles.navLink}>Services</Link>
          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>👤 {user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <Link href="/login" style={styles.navLink}>Login</Link>
          )}
        </div>

        <Link href="/cart" style={styles.cartIcon}>
          🛒
          {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
        </Link>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuBtn}>
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link href="/" style={styles.mobileLink}>Home</Link>
          <Link href="/products" style={styles.mobileLink}>Shop</Link>
          <Link href="/water" style={styles.mobileLink}>💧 Water</Link>
          <Link href="/raw-materials" style={styles.mobileLink}>Raw Materials</Link>
          <Link href="/services" style={styles.mobileLink}>Services</Link>
          {user ? (
            <>
              <span style={styles.mobileUser}>{user.email}</span>
              <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
            </>
          ) : (
            <Link href="/login" style={styles.mobileLink}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    background: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
    padding: '0 20px'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    gap: '20px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0
  },
  logoImg: {
    height: '90px',  // Increased from 70px to 90px
    width: 'auto',
    maxWidth: '300px',
    objectFit: 'contain'
  },
  logoText: {
    fontSize: '32px',  // Increased from 28px to 32px
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  navLinks: {
    display: 'flex',
    gap: '30px',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '16px',
    transition: 'color 0.3s'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userName: {
    color: '#667eea',
    fontWeight: '500'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#fc8181',
    cursor: 'pointer',
    fontWeight: '500',
    padding: '5px 10px'
  },
  cartIcon: {
    position: 'relative',
    fontSize: '24px',
    textDecoration: 'none',
    color: '#333',
    flexShrink: 0
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-12px',
    background: '#667eea',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '12px',
    minWidth: '18px',
    textAlign: 'center'
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#333'
  },
  mobileMenu: {
    display: 'none',
    flexDirection: 'column',
    padding: '20px',
    borderTop: '1px solid #eee',
    background: 'white'
  },
  mobileLink: {
    padding: '10px 0',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500'
  },
  mobileUser: {
    padding: '10px 0',
    color: '#667eea',
    fontWeight: '500'
  },
  mobileLogoutBtn: {
    padding: '10px 0',
    background: 'none',
    border: 'none',
    color: '#fc8181',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: '500'
  },
  '@media (max-width: 768px)': {
    navLinks: {
      display: 'none'
    },
    menuBtn: {
      display: 'block'
    },
    mobileMenu: {
      display: 'flex'
    },
    logoImg: {
      height: '60px'
    }
  }
};
