import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { CartProvider } from '../../context/CartContext';
import Link from 'next/link';

function RawMaterialPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product || product.stock_quantity === 0) {
      alert('This product is out of stock!');
      return;
    }
    addToCart({ 
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: product.unit,
      category: 'raw',
      type: 'raw'
    }, quantity);
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={styles.loading}>Loading product details...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div>
        <Navbar />
        <div style={styles.notFound}>
          <h2>Product Not Found</h2>
          <p>The raw material you're looking for doesn't exist.</p>
          <Link href="/raw-materials">
            <button style={styles.backButton}>Back to Raw Materials</button>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt; 
          <Link href="/raw-materials">Raw Materials</Link> &gt; 
          <span>{product.name}</span>
        </div>

        <div style={styles.productMain}>
          <div style={styles.imageColumn}>
            <div style={styles.imageContainer}>
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  style={styles.productImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="font-size: 5rem;">🧪</div>';
                  }}
                />
              ) : (
                <div style={styles.placeholderImage}>🧪</div>
              )}
            </div>
          </div>

          <div style={styles.infoColumn}>
            <div style={styles.category}>🧪 Raw Material</div>
            <h1 style={styles.title}>{product.name}</h1>
            
            <div style={styles.rating}>
              <span>★★★★☆</span>
              <span style={styles.reviewCount}>(4.5 • 64 reviews)</span>
            </div>
            
            <div style={styles.priceSection}>
              <div style={styles.currentPrice}>{formatZAR(product.price)}/{product.unit}</div>
              <div style={styles.taxInfo}>Excl. VAT</div>
            </div>

            <div style={styles.stockStatus}>
              {!isOutOfStock ? (
                <span style={styles.inStock}>✓ In Stock ({product.stock_quantity} {product.unit})</span>
              ) : (
                <span style={styles.outOfStock}>✗ Out of Stock</span>
              )}
            </div>

            <div style={styles.supplierInfo}>
              <span>🏭 Supplier:</span> {product.supplier || 'Various'}
            </div>

            <div style={styles.quantitySection}>
              <label>Quantity ({product.unit}):</label>
              <div style={styles.quantitySelector}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={styles.qtyBtn}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span style={styles.qtyNumber}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={styles.qtyBtn}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                ...styles.addToCartBtn,
                background: isOutOfStock ? '#ccc' : '#667eea',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatZAR(product.price * quantity)}`}
            </button>

            <div style={styles.deliveryInfo}>
              <div style={styles.deliveryItem}>🚚 Free delivery on orders over R500</div>
              <div style={styles.deliveryItem}>↺ 30-day easy returns</div>
              <div style={styles.deliveryItem}>✓ Secure checkout</div>
            </div>
          </div>
        </div>

        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            <button onClick={() => setActiveTab('description')} style={{...styles.tab, ...(activeTab === 'description' ? styles.activeTab : {})}}>Description</button>
            <button onClick={() => setActiveTab('specifications')} style={{...styles.tab, ...(activeTab === 'specifications' ? styles.activeTab : {})}}>Specifications</button>
            <button onClick={() => setActiveTab('reviews')} style={{...styles.tab, ...(activeTab === 'reviews' ? styles.activeTab : {})}}>Reviews</button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'description' && (
              <div>
                <h3>Product Description</h3>
                <p>{product.description || 'High quality industrial chemical for detergent manufacturing.'}</p>
                <h4>Applications:</h4>
                <ul>
                  <li>✓ Detergent manufacturing</li>
                  <li>✓ Industrial cleaning products</li>
                  <li>✓ Soap production</li>
                  <li>✓ Chemical processing</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3>Technical Specifications</h3>
                <table style={styles.specsTable}>
                  <tbody>
                    <tr><td style={styles.specLabel}>Product Name</td><td>{product.name}</td></tr>
                    <tr><td style={styles.specLabel}>Purity</td><td>99% minimum</td></tr>
                    <tr><td style={styles.specLabel}>Packaging</td><td>{product.unit} containers</td></tr>
                    <tr><td style={styles.specLabel}>Storage</td><td>Cool, dry place</td></tr>
                    <tr><td style={styles.specLabel}>Shelf Life</td><td>24 months</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3>Customer Reviews</h3>
                <div style={styles.reviewSummary}>
                  <div style={styles.averageRating}>4.5 ★★★★☆</div>
                  <p>Based on 64 reviews</p>
                </div>
                <div style={styles.reviewItem}>
                  <strong>Chemical Solutions Ltd.</strong>
                  <span>★★★★★</span>
                  <p>Excellent quality, consistent supply.</p>
                  <small>Posted on March 20, 2024</small>
                </div>
                <button style={styles.writeReviewBtn}>Write a Review</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1280px', margin: '0 auto', padding: '20px' },
  breadcrumb: { marginBottom: '30px', color: '#666', fontSize: '14px' },
  productMain: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '50px' },
  imageColumn: { background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #eee' },
  imageContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' },
  productImage: { maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' },
  placeholderImage: { fontSize: '5rem' },
  infoColumn: { display: 'flex', flexDirection: 'column', gap: '15px' },
  category: { color: '#667eea', textTransform: 'uppercase', fontSize: '14px', fontWeight: '600' },
  title: { fontSize: '2rem', fontWeight: '600', margin: '0', color: '#333' },
  rating: { display: 'flex', alignItems: 'center', gap: '10px' },
  reviewCount: { color: '#666', fontSize: '14px' },
  priceSection: { padding: '15px 0', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' },
  currentPrice: { fontSize: '2rem', fontWeight: 'bold', color: '#667eea' },
  taxInfo: { fontSize: '12px', color: '#666', marginTop: '5px' },
  stockStatus: { marginTop: '10px' },
  inStock: { color: '#48bb78', fontWeight: 'bold' },
  outOfStock: { color: '#fc8181', fontWeight: 'bold' },
  supplierInfo: { background: '#f0fdf4', padding: '12px', borderRadius: '8px', fontSize: '14px' },
  quantitySection: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' },
  quantitySelector: { display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' },
  qtyBtn: { width: '40px', height: '40px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '18px' },
  qtyNumber: { minWidth: '40px', textAlign: 'center', fontSize: '16px' },
  addToCartBtn: { width: '100%', padding: '15px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', marginTop: '10px' },
  deliveryInfo: { background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '15px' },
  deliveryItem: { marginBottom: '8px', fontSize: '14px' },
  tabsContainer: { marginTop: '40px', borderTop: '1px solid #eee' },
  tabs: { display: 'flex', gap: '30px', borderBottom: '2px solid #eee' },
  tab: { padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#666' },
  activeTab: { color: '#667eea', borderBottom: '2px solid #667eea', marginBottom: '-2px' },
  tabContent: { padding: '30px 0' },
  specsTable: { width: '100%', borderCollapse: 'collapse' },
  specLabel: { fontWeight: 'bold', padding: '10px 0', width: '150px' },
  reviewSummary: { textAlign: 'center', marginBottom: '30px' },
  averageRating: { fontSize: '2rem', fontWeight: 'bold' },
  reviewItem: { borderBottom: '1px solid #eee', padding: '15px 0' },
  writeReviewBtn: { marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#666' },
  notFound: { textAlign: 'center', padding: '100px' },
  backButton: { marginTop: '20px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};

export default function RawMaterial() {
  return (
    <CartProvider>
      <RawMaterialPage />
    </CartProvider>
  );
}
