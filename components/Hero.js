import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const quickLinks = [
    { label: 'Dishwashing', href: '/products?category=dishwashing' },
    { label: 'Car wash', href: '/products?category=car_wash' },
    { label: 'Car detailing', href: '/products?category=car_detailing' },
    { label: 'Bleach', href: '/products?category=bleach' },
    { label: 'Water', href: '/water' }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 820);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="home-hero" style={{ ...styles.hero, padding: isMobile ? '34px 14px 30px' : '76px 20px 64px' }}>
      <div style={styles.glowOne}></div>
      <div style={styles.glowTwo}></div>

      <div className="home-hero-inner" style={{ ...styles.inner, gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'minmax(0, 1.12fr) minmax(320px, 0.88fr)' }}>
        <div className="home-hero-copy" style={{ ...styles.copy, textAlign: isMobile ? 'center' : 'left', margin: isMobile ? '0 auto' : 0, minWidth: 0 }}>
          <div style={{ ...styles.badge, fontSize: isMobile ? '10px' : '12px', marginBottom: isMobile ? '14px' : '20px' }}>Premium Cleaning Supply Store</div>
          <h1 style={{
            ...styles.title,
            fontSize: isMobile ? '2.55rem' : 'clamp(2.7rem, 6vw, 5.8rem)',
            lineHeight: isMobile ? 1 : 0.94,
            letterSpacing: isMobile ? '-0.045em' : '-0.07em',
            marginBottom: isMobile ? '16px' : '22px'
          }}>
            Clean smarter.
            <span style={styles.titleAccent}> Stock up faster.</span>
          </h1>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '15px' : 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: isMobile ? 1.55 : 1.7,
            marginBottom: isMobile ? '20px' : '28px',
            overflowWrap: 'break-word'
          }}>
            Professional detergents, raw materials, bottled water, and cleaning services from LuChem.
            Built for households, car washes, offices, and bulk buyers.
          </p>

          <div style={{
            ...styles.ctas,
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
            marginBottom: isMobile ? '16px' : '22px'
          }}>
            <Link href="/products" style={{ ...styles.primaryBtn, width: isMobile ? '100%' : 'auto' }}>Shop Products</Link>
            <Link href="/services" style={{ ...styles.secondaryBtn, width: isMobile ? '100%' : 'auto' }}>Book Cleaning</Link>
          </div>

          <div style={{
            ...styles.quickLinks,
            justifyContent: isMobile ? 'flex-start' : 'flex-start',
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? '4px' : 0,
            width: '100%',
            maxWidth: '100%'
          }}>
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.label} style={styles.quickLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="home-hero-panel" style={{ ...styles.panel, maxWidth: isMobile ? '100%' : 'none', margin: isMobile ? '0 auto' : 0, padding: isMobile ? '14px' : '18px', borderRadius: isMobile ? '20px' : '26px', minWidth: 0 }}>
          <div style={styles.panelTop}>
            <span style={styles.panelKicker}>Popular now</span>
            <span style={styles.panelTag}>ZAR pricing</span>
          </div>

          <div style={{ ...styles.offerCard, minHeight: isMobile ? '190px' : '260px', padding: isMobile ? '20px' : '28px', borderRadius: isMobile ? '18px' : '22px' }}>
            <div>
              <span style={styles.offerLabel}>5L essentials</span>
              <h2 style={{ ...styles.offerTitle, fontSize: isMobile ? '1.45rem' : '2rem', overflowWrap: 'break-word' }}>Dish Wash, Pine Gel, Bleach</h2>
              <p style={styles.offerText}>Reliable stock for daily cleaning, resale, and business use.</p>
            </div>
            <Link href="/products" style={styles.offerBtn}>View Deals</Link>
          </div>

          <div style={{ ...styles.miniGrid, gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
            <div style={styles.miniCard}>
              <strong>Fast checkout</strong>
              <span>Invoice payments supported</span>
            </div>
            <div style={styles.miniCard}>
              <strong>Bulk ready</strong>
              <span>25L options available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
    background: 'linear-gradient(135deg, #071a33 0%, #0b3a63 46%, #0f766e 100%)',
    color: 'white',
    padding: '76px 20px 64px'
  },
  glowOne: {
    position: 'absolute',
    width: '360px',
    height: '360px',
    borderRadius: '50%',
    background: 'rgba(255,207,36,0.18)',
    top: '-120px',
    right: '10%',
    filter: 'blur(8px)'
  },
  glowTwo: {
    position: 'absolute',
    width: '460px',
    height: '460px',
    borderRadius: '50%',
    background: 'rgba(14,165,233,0.18)',
    bottom: '-220px',
    left: '-80px',
    filter: 'blur(10px)'
  },
  inner: {
    position: 'relative',
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.12fr) minmax(320px, 0.88fr)',
    gap: '44px',
    alignItems: 'center',
    minWidth: 0
  },
  copy: {
    maxWidth: '740px',
    minWidth: 0
  },
  badge: {
    display: 'inline-flex',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    color: '#fef3c7',
    padding: '8px 14px',
    borderRadius: '999px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontSize: '12px',
    marginBottom: '20px'
  },
  title: {
    fontSize: 'clamp(2.7rem, 6vw, 5.8rem)',
    lineHeight: 0.94,
    margin: '0 0 22px',
    letterSpacing: '-0.07em',
    fontWeight: '950'
  },
  titleAccent: {
    display: 'block',
    color: '#ffcf24'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: '#dbeafe',
    lineHeight: 1.7,
    maxWidth: '680px',
    marginBottom: '28px'
  },
  ctas: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '22px'
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffcf24',
    color: '#071a33',
    padding: '15px 26px',
    borderRadius: '12px',
    fontWeight: '900',
    textDecoration: 'none',
    boxShadow: '0 18px 34px rgba(0,0,0,0.24)'
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.12)',
    color: 'white',
    padding: '15px 26px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.25)',
    fontWeight: '900',
    textDecoration: 'none'
  },
  quickLinks: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  quickLink: {
    color: '#e0f2fe',
    textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: '800',
    flexShrink: 0
  },
  panel: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '26px',
    padding: '18px',
    boxShadow: '0 26px 80px rgba(0,0,0,0.28)',
    backdropFilter: 'blur(14px)',
    minWidth: 0,
    overflow: 'hidden'
  },
  panelTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px'
  },
  panelKicker: {
    fontWeight: '900',
    color: '#fef3c7'
  },
  panelTag: {
    background: '#0f172a',
    color: '#ffcf24',
    padding: '6px 10px',
    borderRadius: '999px',
    fontWeight: '900',
    fontSize: '12px'
  },
  offerCard: {
    minHeight: '260px',
    borderRadius: '22px',
    background: 'linear-gradient(145deg, #ffffff 0%, #edf7ff 100%)',
    color: '#071a33',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflow: 'hidden',
    minWidth: 0
  },
  offerLabel: {
    color: '#0f766e',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '12px'
  },
  offerTitle: {
    margin: '10px 0',
    fontSize: '2rem',
    lineHeight: 1.05,
    color: '#071a33'
  },
  offerText: {
    color: '#475569',
    lineHeight: 1.6
  },
  offerBtn: {
    alignSelf: 'flex-start',
    background: '#071a33',
    color: 'white',
    padding: '12px 18px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '900'
  },
  miniGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginTop: '12px'
  },
  miniCard: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.16)',
    borderRadius: '16px',
    padding: '14px',
    display: 'grid',
    gap: '4px'
  }
};
