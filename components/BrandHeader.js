export default function BrandHeader() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <div style={styles.pill}>National supplier</div>
        <div style={styles.message}>Bulk cleaning chemicals, bottled water, and services for homes and businesses.</div>
        <div style={styles.actions}>
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
