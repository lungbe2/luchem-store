import { useEffect, useState } from 'react';

export default function BrandHeader() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={{
        ...styles.inner,
        padding: isMobile ? '8px 14px' : '10px 20px',
        gap: isMobile ? '8px' : '18px',
        justifyContent: isMobile ? 'center' : 'space-between',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{ ...styles.pill, fontSize: isMobile ? '10px' : '12px' }}>National supplier</div>
        <div style={{ ...styles.message, minWidth: isMobile ? '100%' : '240px', fontSize: isMobile ? '12px' : '14px' }}>Bulk cleaning chemicals, bottled water, and services for homes and businesses.</div>
        <div style={{ ...styles.actions, fontSize: isMobile ? '12px' : '14px', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
          <span>Call: 071 017 7161</span>
          <span style={styles.divider}>|</span>
          <span>Invoices available</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: '#071a33',
    color: 'white',
    borderBottom: '1px solid rgba(255,255,255,0.12)'
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
    fontSize: '14px'
  },
  pill: {
    background: '#ffcf24',
    color: '#071a33',
    padding: '6px 12px',
    borderRadius: '999px',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    fontSize: '12px'
  },
  message: {
    flex: 1,
    minWidth: '240px',
    color: '#dbeafe',
    fontWeight: '600'
  },
  actions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    color: '#f8fafc',
    fontWeight: '700'
  },
  divider: {
    opacity: 0.45
  }
};
