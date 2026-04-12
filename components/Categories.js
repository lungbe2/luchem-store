import Link from 'next/link';

const categories = [
  { name: 'Dishwashing', icon: '🧼', color: '#4299e1', slug: 'dishwashing' },
  { name: 'Car Wash', icon: '🚗', color: '#48bb78', slug: 'car_wash' },
  { name: 'Bleach', icon: '🧴', color: '#ed8936', slug: 'bleach' },
  { name: 'Floor Cleaner', icon: '🧹', color: '#9f7aea', slug: 'floor_cleaner' },
  { name: 'Kitchen', icon: '🍳', color: '#f687b3', slug: 'kitchen' },
  { name: 'Bathroom', icon: '🚽', color: '#fc8181', slug: 'bathroom' },
  { name: 'Laundry', icon: '👕', color: '#a0aec0', slug: 'laundry' },
];

export default function Categories() {
  return (
    <section className="categories">
      <h2 className="section-title">Shop by Category</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <Link href={`/products?category=${cat.slug}`} key={cat.name}>
            <div className="category-card" style={{ background: `${cat.color}15` }}>
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <span className="shop-now">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .categories {
          padding: 60px 20px;
          background: white;
        }
        .section-title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
          color: var(--dark);
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .category-card {
          text-align: center;
          padding: 2rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .category-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .category-card h3 {
          margin: 0.5rem 0;
          color: var(--dark);
        }
        .shop-now {
          color: var(--primary);
          font-size: 0.85rem;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .category-card:hover .shop-now {
          opacity: 1;
        }
        a {
          text-decoration: none;
        }
      `}</style>
    </section>
  );
}
