import Link from 'next/link';
import { useEffect } from 'react';

export default function Footer() {
  // Add hover styles on client side only
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      .footer-link:hover {
        color: #667eea !important;
      }
      .social-link:hover {
        background: #667eea !important;
      }
      .contact-link:hover {
        color: #667eea !important;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.grid}>
          {/* Column 1 - Logo and About */}
          <div style={styles.column}>
            <div style={styles.logoContainer}>
              <img 
                src="/assets/logo.png" 
                alt="LuChem" 
                style={styles.logo}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div style="font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; background-clip: text; color: transparent;">LuChem</div>';
                }}
              />
            </div>
            <p style={styles.about}>
              LuChem Cleaning Solutions provides premium quality cleaning detergents, 
              raw materials, and professional cleaning services. Your trusted partner 
              for a cleaner, healthier environment.
            </p>
            <div style={styles.socialLinks}>
              <a 
                href="https://www.facebook.com/profile.php?id=61570732371551" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                style={styles.socialLink}
              >
                <span style={styles.socialIcon}>📘</span> Facebook
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div style={styles.column}>
            <h3 style={styles.columnTitle}>Quick Links</h3>
            <ul style={styles.linkList}>
              <li><Link href="/products" className="footer-link" style={styles.link}>🛒 Shop</Link></li>
              <li><Link href="/water" className="footer-link" style={styles.link}>💧 Water</Link></li>
              <li><Link href="/raw-materials" className="footer-link" style={styles.link}>🧪 Raw Materials</Link></li>
              <li><Link href="/services" className="footer-link" style={styles.link}>🧹 Services</Link></li>
              <li><Link href="/about" className="footer-link" style={styles.link}>📖 About Us</Link></li>
              <li><Link href="/contact" className="footer-link" style={styles.link}>📞 Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Policies */}
          <div style={styles.column}>
            <h3 style={styles.columnTitle}>Policies</h3>
            <ul style={styles.linkList}>
              <li><Link href="/policies/returns" className="footer-link" style={styles.link}>🔄 Returns Policy</Link></li>
              <li><Link href="/policies/terms" className="footer-link" style={styles.link}>📜 Terms & Conditions</Link></li>
              <li><Link href="/policies/privacy" className="footer-link" style={styles.link}>🔒 Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div style={styles.column}>
            <h3 style={styles.columnTitle}>Contact Us</h3>
            <div style={styles.contactInfo}>
              <p style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <a href="mailto:info@luchem.co.za" className="contact-link" style={styles.contactLink}>info@luchem.co.za</a>
              </p>
              <p style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <a href="mailto:sales@luchem.co.za" className="contact-link" style={styles.contactLink}>sales@luchem.co.za</a>
              </p>
              <p style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span>071 017 7161 / 071 776 7985</span>
              </p>
              <p style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span>8 Reserwe Street, Oudtshoorn, Western Cape</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} LuChem Cleaning Solutions. All rights reserved.
          </p>
          <p style={styles.credit}>
            Designed with ❤️ for a cleaner South Africa
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1a1a2e',
    color: '#fff',
    marginTop: '60px',
    padding: '60px 0 20px'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoContainer: {
    marginBottom: '20px'
  },
  logo: {
    height: '80px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)'
  },
  about: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#aaa',
    marginBottom: '20px'
  },
  socialLinks: {
    display: 'flex',
    gap: '15px'
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 16px',
    background: '#2d2d44',
    borderRadius: '8px',
    transition: 'background 0.3s',
    width: 'fit-content'
  },
  socialIcon: {
    fontSize: '18px'
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#fff',
    position: 'relative',
    paddingBottom: '10px'
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    display: 'block',
    color: '#aaa',
    textDecoration: 'none',
    padding: '8px 0',
    transition: 'color 0.3s'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#aaa',
    margin: 0
  },
  contactIcon: {
    fontSize: '18px',
    minWidth: '24px'
  },
  contactLink: {
    color: '#aaa',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
  bottomBar: {
    borderTop: '1px solid #2d2d44',
    paddingTop: '20px',
    textAlign: 'center'
  },
  copyright: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px'
  },
  credit: {
    fontSize: '11px',
    color: '#555'
  }
};
