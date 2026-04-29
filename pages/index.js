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
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch featured products (limit 8)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(8);
    
    // Some Supabase schemas do not have old_price yet. Keep homepage loading
    // even when specials are not configured.
    const { data: specials, error: specialsError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .limit(4);
    
    // Fetch raw materials
    const { data: materials } = await supabase
      .from('raw_materials')
      .select('*')
      .limit(4);
    
    if (products) setFeaturedProducts(products);
    if (!specialsError && specials) {
      setSpecialProducts(specials.filter((product) => product.old_price && product.old_price > product.price));
    }
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
    { name: 'Car Detailing', icon: 'Auto', color: '#0f766e', link: '/products?category=car_detailing' },
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
      <section style={{ padding: isMobile ? '24px 12px 30px' : '34px 20px 46px', background: '#f8fbff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'end', gap: '14px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <div>
              <span style={{ color: '#0f766e', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shop by department</span>
              <h2 style={{ margin: '6px 0 0', color: '#071a33', fontSize: isMobile ? '1.55rem' : '2rem' }}>Everything LuChem supplies</h2>
            </div>
            <Link href="/products" style={{ color: '#071a33', fontWeight: '900', textDecoration: 'none', background: '#ffcf24', padding: '12px 18px', borderRadius: '999px', textAlign: 'center', width: isMobile ? '100%' : 'auto' }}>
              View all products
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: isMobile ? '10px' : '14px'
          }}>
            {categories.map(cat => (
              <Link href={cat.link} key={cat.name} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: isMobile ? '8px' : '12px',
                  padding: isMobile ? '12px' : '18px',
                  background: 'white',
                  border: '1px solid #e5edf7',
                  boxShadow: '0 16px 34px rgba(15,23,42,0.06)',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  minHeight: isMobile ? '74px' : '84px'
                }}>
                  <div style={{ fontSize: isMobile ? '1.25rem' : '1.8rem', width: isMobile ? '38px' : '48px', height: isMobile ? '38px' : '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat.color}16` }}>{cat.icon}</div>
                  <span style={{ fontWeight: '900', color: '#071a33', fontSize: isMobile ? '13px' : '16px' }}>{cat.name}</span>
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
