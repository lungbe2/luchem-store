import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { CartProvider } from '../context/CartContext';

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
      <div style={styles.container}>
        <h1 style={styles.title}>All Products</h1>
        <p style={styles.subtitle}>Prices in South African Rand (ZAR)</p>

        {/* Mobile-friendly category filter - scrollable */}
        <div style={styles.categoryWrapper}>
          <div style={styles.categoryScroll}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{...styles.categoryBtn, ...(selectedCategory === 'all' ? styles.categoryActive : {})}}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{...styles.categoryBtn, ...(selectedCategory === cat ? styles.categoryActive : {})}}
              >
                {cat === 'dishwashing' ? '🧼' : cat === 'car_wash' ? '🚗' : cat === 'bleach' ? '🧴' : '🧹'} {categoryNames[cat]?.split(' ')[0] || cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading products...</div>
        ) : (
          <div style={styles.grid}>
            {products.map(product => (
              <div 
                key={product.id} 
                style={styles.card}
                onClick={() => window.location.href = `/product/${product.id}`}
              >
                <div style={styles.imageContainer}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} style={styles.image} />
                  ) : (
                    <div style={styles.icon}>{getCategoryIcon(product.category)}</div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.description}>{product.description?.substring(0, 60)}...</p>
                  <span style={styles.sizeBadge}>{product.size}</span>
                  <div style={styles.cardFooter}>
                    <span style={styles.price}>{formatZAR(product.price)}</span>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock_quantity === 0}
                      style={{...styles.addBtn, background: product.stock_quantity === 0 ? '#ccc' : '#48bb78'}}
                    >
                      {product.stock_quantity === 0 ? 'Out' : 'Add'}
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

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px 16px'
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '8px',
    color: '#333'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px',
    fontSize: '14px'
  },
  categoryWrapper: {
    marginBottom: '24px',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch'
  },
  categoryScroll: {
    display: 'flex',
    gap: '10px',
    paddingBottom: '8px',
    minWidth: 'min-content'
  },
  categoryBtn: {
    padding: '8px 16px',
    border: '1px solid #667eea',
    background: 'white',
    color: '#667eea',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s'
  },
  categoryActive: {
    background: '#667eea',
    color: 'white'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    background: 'white',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  imageContainer: {
    height: '180px',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    borderBottom: '1px solid #f0f0f0'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  icon: {
    fontSize: '3rem'
  },
  cardContent: {
    padding: '16px'
  },
  productName: {
    fontSize: '1rem',
    marginBottom: '8px',
    color: '#333'
  },
  description: {
    color: '#666',
    fontSize: '13px',
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  sizeBadge: {
    background: '#f0f0f0',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    display: 'inline-block',
    marginBottom: '12px'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px'
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#667eea'
  },
  addBtn: {
    padding: '6px 14px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  }
};

export default function Products() {
  return (
    <CartProvider>
      <ProductsPage />
    </CartProvider>
  );
}
