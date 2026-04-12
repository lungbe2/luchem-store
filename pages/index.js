import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import BrandHeader from '../components/BrandHeader';
import Hero from '../components/Hero';
import Link from 'next/link';
import { CartProvider, useCart } from '../context/CartContext';
import UnifiedCard from '../components/UnifiedCard';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    fetchData();
    loadRecentlyViewed();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch featured products (limit 8)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(8);
    
    // Fetch products on special (with old_price)
    const { data: specials } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .not('old_price', 'is', null)
      .limit(4);
    
    // Fetch raw materials
    const { data: materials } = await supabase
      .from('raw_materials')
      .select('*')
      .limit(4);
    
    if (products) setFeaturedProducts(products);
    if (specials) setSpecialProducts(specials);
    if (materials) setRawMaterials(materials);
    setLoading(false);
  };

  const loadRecentlyViewed = () => {
    const recent = localStorage.getItem('luchem_recently_viewed');
    if (recent) {
      try {
        const recentIds = JSON.parse(recent).slice(0, 4);
        // Fetch recent products by IDs
        const fetchRecent = async () => {
          const { data } = await supabase
            .from('products')
            .select('*')
            .in('id', recentIds);
          if (data) setRecentlyViewed(data);
        };
        fetchRecent();
      } catch (e) {
        console.error('Error loading recently viewed:', e);
      }
    }
  };

  // Helper to add to recently viewed (call this on product pages)
  const addToRecentlyViewed = (productId) => {
    const recent = localStorage.getItem('luchem_recently_viewed');
    let recentIds = recent ? JSON.parse(recent) : [];
    recentIds = [productId, ...recentIds.filter(id => id !== productId)].slice(0, 8);
    localStorage.setItem('luchem_recently_viewed', JSON.stringify(recentIds));
  };

  // Category sections for homepage
  const categories = [
    { name: 'Dishwashing', icon: '🧼', color: '#4299e1', link: '/products?category=dishwashing' },
    { name: 'Car Wash', icon: '🚗', color: '#48bb78', link: '/products?category=car_wash' },
    { name: 'Bleach', icon: '🧴', color: '#ed8936', link: '/products?category=bleach' },
    { name: 'Bottled Water', icon: '💧', color: '#0284c7', link: '/water' },
    { name: 'Raw Materials', icon: '🧪', color: '#9f7aea', link: '/raw-materials' },
    { name: 'Cleaning Services', icon: '🧹', color: '#f687b3', link: '/services' }
  ];

  return (
    <div>
      <Navbar />
      <BrandHeader />
      <Hero />

      {/* Category Pills Section */}
      <section style={{ padding: '40px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {categories.map(cat => (
              <Link href={cat.link} key={cat.name}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '15px 25px',
                  background: `${cat.color}10`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  minWidth: '100px'
                }}>
                  <div style={{ fontSize: '2rem' }}>{cat.icon}</div>
                  <span style={{ marginTop: '8px', fontWeight: '500', color: cat.color }}>{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers / On Special Section */}
      {specialProducts.length > 0 && (
        <section style={{ padding: '60px 20px', background: '#fff5f5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#e53e3e' }}>🔥 On Special</h2>
              <Link href="/products?special=true" style={{ color: '#e53e3e', textDecoration: 'none' }}>View All →</Link>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {specialProducts.map(product => (
                <div key={product.id} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#e53e3e',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    zIndex: 10
                  }}>
                    🔥 SALE
                  </div>
                  <UnifiedCard item={product} type="product" formatZAR={formatZAR} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section style={{ padding: '60px 20px', background: '#f7fafc' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#333' }}>✨ Featured Products</h2>
            <Link href="/products" style={{ color: '#667eea', textDecoration: 'none' }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {featuredProducts.map(product => (
                <UnifiedCard key={product.id} item={product} type="product" formatZAR={formatZAR} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <section style={{ padding: '60px 20px', background: 'white' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '30px', color: '#333' }}>🕐 Recently Viewed</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {recentlyViewed.map(product => (
                <UnifiedCard key={product.id} item={product} type="product" formatZAR={formatZAR} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Raw Materials Banner */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(135deg, #667eea15, #764ba215)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🧪 Raw Materials for Manufacturing</h2>
              <p style={{ color: '#666' }}>High-quality industrial chemicals for detergent production</p>
            </div>
            <Link href="/raw-materials">
              <button style={{
                padding: '10px 20px',
                background: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                View All →
              </button>
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {rawMaterials.map(material => (
              <UnifiedCard key={material.id} item={material} type="raw" formatZAR={formatZAR} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section style={{ padding: '60px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>🧹 Professional Cleaning Services</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            We offer cleaning services for offices, houses, industries, and any place.
          </p>
          <Link href="/services">
            <button style={{
              padding: '12px 30px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Book Cleaning Service →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <CartProvider>
      <HomePage />
    </CartProvider>
  );
}
