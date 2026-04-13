import Link from 'next/link';

export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.content}>
        <h1 style={styles.title}>
          Clean <span style={styles.gradient}>Everything</span>
          <br />With Confidence
        </h1>
        <p style={styles.subtitle}>
          Professional-grade cleaning detergents for your home, car, and business.
          Powerful, eco-friendly, and affordable prices in South African Rand (ZAR).
        </p>
        <div style={styles.buttons}>
          <Link href="/products" style={styles.primaryBtn}>
            Shop Now →
          </Link>
          <Link href="/services" style={styles.secondaryBtn}>
            Book Services
          </Link>
        </div>
      </div>
      <div style={styles.stats}>
        <div style={styles.stat}>
          <span style={styles.statNumber}>10K+</span>
          <span style={styles.statLabel}>Happy Customers</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>50+</span>
          <span style={styles.statLabel}>Products</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statNumber}>24/7</span>
          <span style={styles.statLabel}>Support</span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-stats {
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '900',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
    fontFamily: "'Poppins', sans-serif"
  },
  gradient: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#a0aec0',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '3rem'
  },
  primaryBtn: {
    display: 'inline-block',
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    borderRadius: '8px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  secondaryBtn: {
    display: 'inline-block',
    padding: '14px 28px',
    border: '2px solid #667eea',
    background: 'transparent',
    color: '#667eea',
    borderRadius: '8px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4rem',
    marginTop: '3rem'
  },
  stat: {
    textAlign: 'center'
  },
  statNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: '900',
    color: '#667eea'
  },
  statLabel: {
    color: '#a0aec0',
    fontSize: '0.9rem',
    fontWeight: '500'
  }
};
