import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { CartProvider, useCart } from '../context/CartContext';
import Link from 'next/link';

function WaterPage() {
  const [items, setItems] = useState([]);
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
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('water_products')
      .select('*')
      .eq('is_active', true)
      .eq('category', 'still')
      .order('name');
    
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    if (item.stock_quantity === 0) {
      alert('This product is out of stock!');
      return;
    }
    addToCart({ 
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      size: item.size,
      category: item.category,
      type: 'water'
    }, 1);
    alert(`Added ${item.name} to cart!`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💧 Still Water</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Pure, refreshing purified still water for every need
          <br />Available in various sizes - Prices in ZAR
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading water products...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {items.map(item => (
              <div key={item.id} style={{ position: 'relative', cursor: 'pointer' }} onClick={() => window.location.href = `/water/${item.id}`}>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                  transition: 'transform 0.3s'
                }}>
                  <div style={{
                    height: '200px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div style="font-size: 4rem;">💧</div>'; }}
                      />
                    ) : (
                      <div style={{ fontSize: '4rem' }}>💧</div>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 10px' }}>{item.name}</h3>
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                      {item.description?.substring(0, 60) || 'Premium quality purified still water'}...
                    </p>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                        {item.size}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                          {formatZAR(item.price)}
                        </span>
                        <p style={{ fontSize: '12px', color: '#48bb78', margin: '5px 0 0 0' }}>
                          Stock: {item.stock_quantity}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        disabled={item.stock_quantity === 0}
                        style={{
                          padding: '8px 16px',
                          background: item.stock_quantity === 0 ? '#ccc' : '#48bb78',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: item.stock_quantity === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {item.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Water() {
  return (
    <CartProvider>
      <WaterPage />
    </CartProvider>
  );
}
