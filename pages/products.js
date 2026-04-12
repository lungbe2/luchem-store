import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { CartProvider } from '../context/CartContext';
import Link from 'next/link';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
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
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*').eq('is_active', true);
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query.order('name');
    
    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true);
      
    if (!error && data) {
      const unique = [...new Set(data.map(p => p.category))];
      setCategories(unique);
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock_quantity === 0) {
      alert('This product is out of stock!');
      return;
    }
    addToCart({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: product.size,
      category: product.category,
      type: 'product'
    }, 1);
    alert(`Added ${product.name} to cart!`);
  };

  const categoryNames = {
    'dishwashing': '🧼 Dishwashing',
    'car_wash': '🚗 Car Wash',
    'bleach': '🧴 Bleach',
    'floor_cleaner': '🧹 Floor Cleaner',
    'kitchen': '🍳 Kitchen',
    'bathroom': '🚽 Bathroom',
    'laundry': '👕 Laundry'
  };

  const getCategoryIcon = (category) => {
    const icons = {
      dishwashing: '🧼',
      car_wash: '🚗',
      bleach: '🧴',
      floor_cleaner: '🧹',
      kitchen: '🍳',
      bathroom: '🚽',
      laundry: '👕'
    };
    return icons[category] || '🧹';
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>All Products</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Prices in South African Rand (ZAR)</p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              background: selectedCategory === 'all' ? '#667eea' : 'white',
              color: selectedCategory === 'all' ? 'white' : '#667eea',
              border: '2px solid #667eea',
              borderRadius: '25px',
              cursor: 'pointer'
            }}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                background: selectedCategory === cat ? '#667eea' : 'white',
                color: selectedCategory === cat ? 'white' : '#667eea',
                border: '2px solid #667eea',
                borderRadius: '25px',
                cursor: 'pointer'
              }}
            >
              {categoryNames[cat] || cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {products.map(product => (
              <div 
                key={product.id} 
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'white',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div style={{
                  height: '200px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div style="font-size: 4rem;">${getCategoryIcon(product.category)}</div>`;
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: '4rem' }}>{getCategoryIcon(product.category)}</div>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px' }}>{product.name}</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>
                    {product.description?.substring(0, 60)}...
                  </p>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                      {product.size}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>
                        {formatZAR(product.price)}
                      </span>
                      <p style={{ fontSize: '12px', color: '#48bb78', margin: '5px 0 0 0' }}>
                        Stock: {product.stock_quantity}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock_quantity === 0}
                      style={{
                        padding: '8px 16px',
                        background: product.stock_quantity === 0 ? '#ccc' : '#48bb78',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
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

export default function Products() {
  return (
    <CartProvider>
      <ProductsPage />
    </CartProvider>
  );
}
