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

        {/* Desktop Navigation */}
        <div style={styles.desktopNav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/products" style={styles.navLink}>Shop</Link>
          <Link href="/water" style={styles.navLink}>💧 Water</Link>
          <Link href="/raw-materials" style={styles.navLink}>Raw</Link>
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

        <div style={styles.rightIcons}>
          <Link href="/cart" style={styles.cartIcon}>
            🛒
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={styles.menuBtn}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={{ ...styles.mobileMenu, display: isMenuOpen ? 'flex' : 'none' }}>
        <Link href="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link href="/products" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🛒 Shop</Link>
        <Link href="/water" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>💧 Water</Link>
        <Link href="/raw-materials" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🧪 Raw Materials</Link>
        <Link href="/services" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🧹 Services</Link>
        {user ? (
          <>
            <span style={styles.mobileUser}>{user.email}</span>
            <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
          </>
        ) : (
          <Link href="/login" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
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
    padding: '0 16px'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    gap: '15px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0
  },
  logoImg: {
    height: '60px',
    width: 'auto',
    maxWidth: '200px',
    objectFit: 'contain'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  desktopNav: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '15px',
    transition: 'color 0.3s',
    whiteSpace: 'nowrap'
  },
  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexShrink: 0
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userName: {
    color: '#667eea',
    fontWeight: '500',
    fontSize: '14px'
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#fc8181',
    cursor: 'pointer',
    fontWeight: '500',
    padding: '5px 8px',
    fontSize: '14px'
  },
  cartIcon: {
    position: 'relative',
    fontSize: '24px',
    textDecoration: 'none',
    color: '#333'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-12px',
    background: '#667eea',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '11px',
    minWidth: '18px',
    textAlign: 'center'
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#333',
    padding: '8px'
  },
  mobileMenu: {
    flexDirection: 'column',
    padding: '16px',
    borderTop: '1px solid #eee',
    background: 'white',
    gap: '12px'
  },
  mobileLink: {
    padding: '12px 0',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '16px',
    borderBottom: '1px solid #f0f0f0'
  },
  mobileUser: {
    padding: '12px 0',
    color: '#667eea',
    fontWeight: '500',
    borderBottom: '1px solid #f0f0f0'
  },
  mobileLogoutBtn: {
    padding: '12px 0',
    background: 'none',
    border: 'none',
    color: '#fc8181',
    cursor: 'pointer',
    textAlign: 'left',
    fontWeight: '500',
    fontSize: '16px'
  },
  '@media (max-width: 768px)': {
    desktopNav: {
      display: 'none'
    },
    menuBtn: {
      display: 'block'
    },
    logoImg: {
      height: '45px'
    },
    navLink: {
      fontSize: '14px'
    }
  }
};
