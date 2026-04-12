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
    <>
      <nav style={styles.navbar}>
        <div style={styles.container}>
          {/* Logo */}
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
            <Link href="/water" style={styles.navLink}>Water</Link>
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

          {/* Right side icons */}
          <div style={styles.rightIcons}>
            <Link href="/cart" style={styles.cartIcon}>
              🛒
              {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
            </Link>
            {/* Hamburger Menu Button - More Visible */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              style={styles.hamburgerBtn}
              aria-label="Menu"
            >
              <div style={{
                ...styles.hamburgerLine,
                transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <div style={{
                ...styles.hamburgerLine,
                opacity: isMenuOpen ? 0 : 1
              }} />
              <div style={{
                ...styles.hamburgerLine,
                transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
              }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div style={{ ...styles.mobileMenu, transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)' }}>
          <div style={styles.mobileMenuInner}>
            <Link href="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🏠 Home</Link>
            <Link href="/products" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🛒 Shop</Link>
            <Link href="/water" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>💧 Water</Link>
            <Link href="/raw-materials" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🧪 Raw Materials</Link>
            <Link href="/services" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🧹 Services</Link>
            {user ? (
              <>
                <div style={styles.mobileUser}>
                  <span>👤 {user.email}</span>
                  <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
                </div>
              </>
            ) : (
              <Link href="/login" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>🔐 Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div style={styles.overlay} onClick={() => setIsMenuOpen(false)} />
      )}
    </>
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
    padding: '12px 0',
    gap: '15px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0
  },
  logoImg: {
    height: '50px',
    width: 'auto',
    maxWidth: '180px',
    objectFit: 'contain'
  },
  logoText: {
    fontSize: '22px',
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
  // Hamburger Menu Styles
  hamburgerBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    flexDirection: 'column',
    gap: '5px',
    borderRadius: '8px',
    transition: 'background 0.3s'
  },
  hamburgerLine: {
    width: '25px',
    height: '3px',
    background: '#333',
    borderRadius: '2px',
    transition: 'all 0.3s ease'
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
  mobileMenu: {
    position: 'fixed',
    top: '74px',
    left: 0,
    right: 0,
    background: 'white',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    zIndex: 999,
    transition: 'transform 0.3s ease',
    maxHeight: 'calc(100vh - 74px)',
    overflowY: 'auto'
  },
  mobileMenuInner: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px'
  },
  mobileLink: {
    padding: '14px 0',
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
    fontSize: '16px',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  mobileUser: {
    padding: '14px 0',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },
  mobileLogoutBtn: {
    background: '#fee',
    border: 'none',
    color: '#fc8181',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '500'
  },
  overlay: {
    position: 'fixed',
    top: '74px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 998
  },
  '@media (max-width: 768px)': {
    desktopNav: {
      display: 'none'
    },
    hamburgerBtn: {
      display: 'flex'
    },
    logoImg: {
      height: '40px'
    }
  }
};

// Apply mobile styles
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (max-width: 768px) {
      .desktop-nav {
        display: none !important;
      }
      .hamburger-btn {
        display: flex !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
