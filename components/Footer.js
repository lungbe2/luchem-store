import Link from 'next/link';
import { useEffect } from 'react';

export default function Footer() {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .footer-link:hover { color: #667eea !important; }
      .social-link:hover { background: #667eea !important; }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* About Section */}
          <div style={styles.column}>
            <img src="/assets/logo.png" alt="LuChem" style={styles.logo} />
            <p style={styles.about}>
              LuChem Cleaning Solutions provides premium quality cleaning detergents, 
              raw materials, and professional cleaning services.
            </p>
            <a href="https://www.facebook.com/profile.php?id=61570732371551" target="_blank" rel="noopener noreferrer" style={styles.socialLink}>
              📘 Facebook
            </a>
          </div>

          {/* Quick Links */}
          <div style={styles.column}>
            <h3 style={styles.title}>Quick Links</h3>
            <Link href="/products" style={styles.link}>🛒 Shop</Link>
            <Link href="/water" style={styles.link}>💧 Water</Link>
            <Link href="/raw-materials" style={styles.link}>🧪 Raw Materials</Link>
            <Link href="/services" style={styles.link}>🧹 Services</Link>
          </div>

          {/* Policies */}
          <div style={styles.column}>
            <h3 style={styles.title}>Policies</h3>
            <Link href="/policies/returns" style={styles.link}>🔄 Returns</Link>
            <Link href="/policies/terms" style={styles.link}>📜 Terms</Link>
            <Link href="/policies/privacy" style={styles.link}>🔒 Privacy</Link>
          </div>

          <div style={styles.column}>
            <h3 style={styles.title}>Payments</h3>
            <p style={styles.paymentTrust}>Secure online payments via PayFast</p>
            <p style={styles.contactText}>Invoice and EFT payments also available.</p>
          </div>

          {/* Contact */}
          <div style={styles.column}>
            <h3 style={styles.title}>Contact</h3>
            <a href="mailto:info@luchem.co.za" style={styles.link}>📧 info@luchem.co.za</a>
            <a href="mailto:sales@luchem.co.za" style={styles.link}>📧 sales@luchem.co.za</a>
            <p style={styles.contactText}>📞 071 017 7161</p>
            <p style={styles.contactText}>📍 Cape Town, WC</p>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p>© {new Date().getFullYear()} LuChem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1a2e',
    color: '#fff',
    marginTop: '40px',
    padding: '40px 16px 20px'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  logo: {
    height: '50px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
    marginBottom: '10px'
  },
  about: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: '#aaa'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#fff'
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.3s',
    padding: '4px 0'
  },
  contactText: {
    color: '#aaa',
    fontSize: '13px',
    margin: 0
  },
  socialLink: {
    display: 'inline-block',
    color: '#fff',
    textDecoration: 'none',
    background: '#2d2d44',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    width: 'fit-content',
    marginTop: '10px'
  },
  paymentTrust: {
    color: '#dbeafe',
    fontSize: '13px',
    fontWeight: '700',
    margin: 0
  },
  bottomBar: {
    borderTop: '1px solid #2d2d44',
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '12px',
    color: '#666'
  }
};
