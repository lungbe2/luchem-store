export default function BrandHeader() {
  return (
    <div style={styles.container}>
      {/* Logo centered */}
      <div style={styles.logoWrapper}>
        <img 
          src="/assets/logo.png" 
          alt="LuChem" 
          style={styles.logo}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div style="font-size: 3rem; font-weight: 900;">LuChem</div>';
          }}
        />
      </div>
      
      {/* Brand Name with bolder font */}
      <h1 style={styles.title}>
        Lu<span style={styles.highlight}>Chem</span>
      </h1>
      
      {/* Tagline */}
      <p style={styles.tagline}>Premium Cleaning Solutions</p>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @media (max-width: 768px) {
          .container {
            padding: 30px 20px !important;
          }
          h1 {
            font-size: 2.5rem !important;
          }
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '50px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  logoWrapper: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: '100px',
    width: 'auto',
    objectFit: 'contain',
    filter: 'brightness(0) invert(1)',
    maxWidth: '200px'
  },
  title: {
    fontSize: '4rem',
    fontWeight: '900',
    margin: '0',
    letterSpacing: '2px',
    color: 'white',
    fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  highlight: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    textShadow: 'none'
  },
  tagline: {
    fontSize: '1.2rem',
    color: 'rgba(255,255,255,0.95)',
    marginTop: '10px',
    fontWeight: '600',
    letterSpacing: '1px',
    fontFamily: "'Inter', 'Poppins', sans-serif"
  }
};
