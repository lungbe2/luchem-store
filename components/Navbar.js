import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="site-navbar" style={styles.navbar}>
      <div className="site-top-rail" style={{ ...styles.topRail, display: isMobile ? 'none' : 'block' }}>
        <div style={styles.topRailInner}>
          <span>Premium cleaning supplies</span>
          <span>Fast local service</span>
          <span>Secure checkout</span>
        </div>
      </div>

      <div className="site-nav-container" style={{ ...styles.container, padding: isMobile ? '8px 0' : '12px 0', gap: isMobile ? '8px' : '15px' }}>
        <Link href="/" style={styles.logo}>
          {!logoError ? (
            <img
              src="/assets/logo.png"
              alt="LuChem"
              style={{
                ...styles.logoImg,
                height: isMobile ? '48px' : '96px',
                maxWidth: isMobile ? '170px' : '310px'
              }}
              onError={() => setLogoError(true)}
            />
          ) : (
            <span style={styles.logoText}>LuChem</span>
          )}
        </Link>

        <div className="site-desktop-nav" style={{ ...styles.desktopNav, display: isMobile ? 'none' : 'flex' }}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/products" style={styles.shopLink}>Shop</Link>
          <Link href="/products?category=car_detailing" style={styles.navLink}>Car Detailing</Link>
          <Link href="/water" style={styles.navLink}>Water</Link>
          <Link href="/raw-materials" style={styles.navLink}>Raw Materials</Link>
          <Link href="/services" style={styles.navLink}>Services</Link>
          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>{user.email?.split('@')[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <Link href="/login" style={styles.navLink}>Login</Link>
          )}
        </div>

        <div className="site-right-icons" style={{ ...styles.rightIcons, gap: isMobile ? '8px' : '12px' }}>
          <Link
            href="/cart"
            style={{
              ...styles.cartIcon,
              minWidth: isMobile ? '48px' : '56px',
              height: isMobile ? '40px' : '46px',
              borderRadius: isMobile ? '12px' : '16px',
              padding: isMobile ? '0 10px' : '0 12px'
            }}
            aria-label="Cart"
          >
            <span>Cart</span>
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>

          <button
            className="site-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={styles.hamburgerBtn}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
            <span style={styles.hamburgerLine}></span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="site-mobile-menu" style={styles.mobileMenu}>
          <div style={styles.mobileMenuInner}>
            <Link href="/" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link href="/products" style={styles.mobileLinkHighlight} onClick={() => setIsMenuOpen(false)}>Shop Products</Link>
            <Link href="/products?category=car_detailing" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Car Detailing</Link>
            <Link href="/water" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Water</Link>
            <Link href="/raw-materials" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Raw Materials</Link>
            <Link href="/services" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Services</Link>
            {user ? (
              <div style={styles.mobileUser}>
                <span>{user.email}</span>
                <button onClick={handleLogout} style={styles.mobileLogoutBtn}>Logout</button>
              </div>
            ) : (
              <Link href="/login" style={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    background: 'rgba(255,255,255,0.96)',
    boxShadow: '0 10px 35px rgba(15,23,42,0.08)',
    zIndex: 1000,
    padding: '0 16px',
    borderBottom: '1px solid #e5edf7',
    backdropFilter: 'blur(16px)'
  },
  topRail: {
    margin: '0 -16px',
    background: '#071a33',
    color: '#dbeafe',
    fontSize: '12px',
    fontWeight: '800'
  },
  topRailInner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '7px 20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '28px',
    flexWrap: 'wrap',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
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
    width: 'auto',
    maxWidth: '310px',
    objectFit: 'contain'
  },
  logoText: {
    fontSize: '26px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #071a33, #0f766e)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  desktopNav: {
    gap: '18px',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: '800',
    fontSize: '15px',
    whiteSpace: 'nowrap',
    padding: '10px 8px'
  },
  shopLink: {
    textDecoration: 'none',
    color: '#071a33',
    background: '#ffcf24',
    fontWeight: '900',
    fontSize: '15px',
    whiteSpace: 'nowrap',
    padding: '10px 18px',
    borderRadius: '999px',
    boxShadow: '0 10px 20px rgba(255,207,36,0.28)'
  },
  rightIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0
  },
  cartIcon: {
    position: 'relative',
    textDecoration: 'none',
    color: '#071a33',
    background: '#eef6ff',
    minWidth: '56px',
    height: '46px',
    borderRadius: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 12px',
    fontSize: '13px',
    fontWeight: '900'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#ffcf24',
    color: '#071a33',
    borderRadius: '50%',
    padding: '3px 7px',
    fontSize: '11px',
    minWidth: '20px',
    textAlign: 'center',
    border: '2px solid white'
  },
  hamburgerBtn: {
    display: 'none',
    background: '#071a33',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '14px',
    fontWeight: '900',
    width: '44px',
    height: '44px',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '4px'
  },
  hamburgerLine: {
    display: 'block',
    width: '20px',
    height: '2px',
    background: 'white',
    borderRadius: '99px'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  userName: {
    color: '#0f766e',
    fontWeight: '800',
    fontSize: '14px'
  },
  logoutBtn: {
    background: '#fff1f2',
    border: 'none',
    color: '#be123c',
    cursor: 'pointer',
    fontWeight: '800',
    padding: '8px 10px',
    borderRadius: '10px',
    fontSize: '13px'
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'white',
    boxShadow: '0 18px 40px rgba(15,23,42,0.14)',
    zIndex: 999,
    borderTop: '1px solid #e5edf7'
  },
  mobileMenuInner: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '8px'
  },
  mobileLink: {
    padding: '13px 14px',
    textDecoration: 'none',
    color: '#1f2937',
    fontWeight: '800',
    fontSize: '16px',
    border: '1px solid #eef2f7',
    borderRadius: '14px',
    background: '#f8fbff'
  },
  mobileLinkHighlight: {
    padding: '13px 14px',
    textDecoration: 'none',
    color: '#071a33',
    fontWeight: '900',
    fontSize: '16px',
    background: '#ffcf24',
    borderRadius: '14px'
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
    color: '#be123c',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '10px',
    fontWeight: '800'
  }
};
