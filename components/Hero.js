import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title fade-in">
          Clean <span className="gradient-text">Everything</span>
          <br />With Confidence
        </h1>
        <p className="hero-subtitle">
          Professional-grade cleaning detergents for your home, car, and business.
          Powerful, eco-friendly, and affordable.
        </p>
        <div className="hero-buttons">
          <Link href="/products" className="btn btn-primary">
            Shop Now →
          </Link>
          <Link href="/about" className="btn btn-outline">
            Learn More
          </Link>
        </div>
      </div>
      <div className="hero-stats">
        <div className="stat">
          <span className="stat-number">10K+</span>
          <span className="stat-label">Happy Customers</span>
        </div>
        <div className="stat">
          <span className="stat-number">50+</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--gray);
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 4rem;
          margin-top: 3rem;
        }
        .stat {
          text-align: center;
        }
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          color: var(--primary);
        }
        .stat-label {
          color: var(--gray);
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          .hero-stats {
            gap: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
