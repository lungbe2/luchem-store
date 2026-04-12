export default function BrandHeader() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background effect */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <h1 style={{
        fontSize: '5rem',
        fontWeight: '900',
        margin: 0,
        letterSpacing: '4px',
        position: 'relative',
        zIndex: 1
      }}>
        <span style={{ color: 'white' }}>Lu</span>
        <span style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: 'none'
        }}>Chem</span>
      </h1>
      
      <p style={{
        fontSize: '1.3rem',
        color: 'rgba(255,255,255,0.95)',
        marginTop: '15px',
        fontWeight: '500',
        letterSpacing: '1px',
        position: 'relative',
        zIndex: 1
      }}>
        Premium Cleaning Solutions
      </p>
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100px',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #FFD700, #FFA500, transparent)',
        borderRadius: '3px'
      }} />
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @media (max-width: 768px) {
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
