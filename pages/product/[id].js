import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { CartProvider } from '../../context/CartContext';
import Link from 'next/link';

function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
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
      .from('products')
      .select('*')
      .eq('id', parseInt(id))
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
    } else {
      setProduct(data);
      setSelectedImage(data.image_url);
      
      // Add to recently viewed
      if (data?.id) {
        const recent = localStorage.getItem('luchem_recently_viewed');
        let recentIds = recent ? JSON.parse(recent) : [];
        recentIds = [data.id, ...recentIds.filter(id => id !== data.id)].slice(0, 8);
        localStorage.setItem('luchem_recently_viewed', JSON.stringify(recentIds));
      }
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (product.stock_quantity === 0) {
      alert('This product is out of stock!');
      return;
    }
    addToCart(product, quantity);
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  const categoryNames = {
    'dishwashing': '🧼 Dishwashing Liquid',
    'car_wash': '🚗 Car Wash',
    'bleach': '🧴 Bleach',
    'floor_cleaner': '🧹 Floor Cleaner',
    'kitchen': '🍳 Kitchen Cleaner',
    'bathroom': '🚽 Bathroom Cleaner',
    'laundry': '👕 Laundry Detergent'
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

  if (loading) return (
    <div>
      <Navbar />
      <div style={styles.loading}>Loading product details...</div>
    </div>
  );
  
  if (!product) return (
    <div>
      <Navbar />
      <div style={styles.notFound}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link href="/products">
          <button style={styles.backButton}>Back to Products</button>
        </Link>
      </div>
    </div>
  );

  const isOutOfStock = product.stock_quantity === 0;
  const hasSpecial = product.old_price && product.old_price > product.price;
  const discountPercent = hasSpecial ? Math.round((1 - product.price / product.old_price) * 100) : 0;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt; 
          <Link href="/products">Products</Link> &gt; 
          <span>{product.name}</span>
        </div>

        {/* Product Main Section */}
        <div style={styles.productMain}>
          {/* Left - Image Gallery */}
          <div style={styles.imageGallery}>
            <div style={styles.mainImageContainer}>
              <div style={styles.mainImage}>
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt={product.name} 
                    style={styles.mainImageImg}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div style="font-size: 5rem;">${getCategoryIcon(product.category)}</div>`;
                    }}
                  />
                ) : (
                  <div style={styles.iconPlaceholder}>
                    {getCategoryIcon(product.category)}
                  </div>
                )}
              </div>
              {isOutOfStock && (
                <div style={styles.outOfStockOverlay}>
                  <span>OUT OF STOCK</span>
                </div>
              )}
              {hasSpecial && !isOutOfStock && (
                <div style={styles.specialOverlay}>
                  <span>🔥 {discountPercent}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {/* Right - Product Info */}
          <div style={styles.productInfo}>
            <div style={styles.category}>{categoryNames[product.category] || product.category}</div>
            <h1 style={styles.productTitle}>{product.name}</h1>
            
            {/* Rating Placeholder */}
            <div style={styles.rating}>
              <span>★★★★☆</span>
              <span style={styles.reviewCount}>(4.2 • 128 reviews)</span>
            </div>
            
            {/* Price Section */}
            <div style={styles.priceSection}>
              {hasSpecial && product.old_price && (
                <div style={styles.oldPrice}>{formatZAR(product.old_price)}</div>
              )}
              <div style={{ ...styles.currentPrice, color: hasSpecial ? '#e53e3e' : '#667eea' }}>
                {formatZAR(product.price)}
              </div>
              <div style={styles.taxInfo}>incl. VAT • Free Shipping on orders over R500</div>
            </div>

            {/* Stock Status */}
            <div style={styles.stockStatus}>
              {!isOutOfStock ? (
                <>
                  <span style={styles.inStock}>✓ In Stock</span>
                  <span style={styles.stockCount}>Only {product.stock_quantity} left in stock</span>
                </>
              ) : (
                <span style={styles.outOfStock}>✗ Out of Stock - Will be back soon!</span>
              )}
            </div>

            {/* Quantity Selector - Disabled when out of stock */}
            <div style={styles.quantitySection}>
              <label>Quantity:</label>
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
                  disabled={isOutOfStock || quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
              <span style={styles.unitInfo}>{product.size}</span>
            </div>

            {/* Add to Cart Button - Disabled when out of stock */}
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                ...styles.addToCartBtn,
                background: isOutOfStock ? '#ccc' : (hasSpecial ? '#e53e3e' : '#667eea'),
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'Out of Stock' : `Add to Cart - ${formatZAR(product.price * quantity)}`}
            </button>

            {/* Notify Me When Back in Stock - Only shows when out of stock */}
            {isOutOfStock && (
              <div style={styles.notifyContainer}>
                <p style={styles.notifyText}>Want to know when this item is back in stock?</p>
                <div style={styles.notifyForm}>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    style={styles.notifyInput}
                  />
                  <button style={styles.notifyButton}>Notify Me</button>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div style={styles.deliveryInfo}>
              <div style={styles.deliveryItem}>
                <span style={styles.deliveryIcon}>🚚</span>
                <span>Free delivery on orders over R500</span>
              </div>
              <div style={styles.deliveryItem}>
                <span style={styles.deliveryIcon}>↺</span>
                <span>30-day easy returns</span>
              </div>
              <div style={styles.deliveryItem}>
                <span style={styles.deliveryIcon}>✓</span>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div style={styles.tabsContainer}>
          <div style={styles.tabs}>
            <button 
              onClick={() => setActiveTab('description')}
              style={{...styles.tab, ...(activeTab === 'description' ? styles.activeTab : {})}}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('specifications')}
              style={{...styles.tab, ...(activeTab === 'specifications' ? styles.activeTab : {})}}
            >
              Specifications
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              style={{...styles.tab, ...(activeTab === 'reviews' ? styles.activeTab : {})}}
            >
              Reviews
            </button>
          </div>

          <div style={styles.tabContent}>
            {activeTab === 'description' && (
              <div>
                <h3>Product Description</h3>
                <p style={styles.description}>{product.description || 'No description available.'}</p>
                <h4>Key Features:</h4>
                <ul style={styles.featuresList}>
                  <li>✓ Premium quality cleaning formula</li>
                  <li>✓ Effective on tough stains</li>
                  <li>✓ Safe for multiple surfaces</li>
                  <li>✓ Eco-friendly ingredients</li>
                  <li>✓ Long-lasting freshness</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3>Product Specifications</h3>
                <table style={styles.specsTable}>
                  <tbody>
                    <tr>
                      <td style={styles.specLabel}>Brand</td>
                      <td>{product.brand || 'LuChem'}</td>
                    </tr>
                    <tr>
                      <td style={styles.specLabel}>Size</td>
                      <td>{product.size}</td>
                    </tr>
                    <tr>
                      <td style={styles.specLabel}>Category</td>
                      <td>{categoryNames[product.category] || product.category}</td>
                    </tr>
                    <tr>
                      <td style={styles.specLabel}>Stock Status</td>
                      <td style={{ color: isOutOfStock ? '#fc8181' : '#48bb78' }}>
                        {isOutOfStock ? 'Out of Stock' : `${product.stock_quantity} units available`}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.specLabel}>SKU</td>
                      <td>LCH-{product.id.toString().padStart(6, '0')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3>Customer Reviews</h3>
                <div style={styles.reviewSummary}>
                  <div style={styles.averageRating}>4.2 ★★★★☆</div>
                  <p>Based on 128 reviews</p>
                </div>
                <div style={styles.reviewItem}>
                  <strong>Thabo M.</strong>
                  <span>★★★★★</span>
                  <p>Excellent product! Works really well on tough stains.</p>
                  <small>Posted on March 15, 2024</small>
                </div>
                <div style={styles.reviewItem}>
                  <strong>Sarah K.</strong>
                  <span>★★★★☆</span>
                  <p>Good value for money. Fast delivery too!</p>
                  <small>Posted on March 10, 2024</small>
                </div>
                <button style={styles.writeReviewBtn}>Write a Review</button>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div style={styles.relatedSection}>
          <h2>You May Also Like</h2>
          <div style={styles.relatedGrid}>
            <p style={{ color: '#666' }}>More products coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  breadcrumb: {
    marginBottom: '30px',
    color: '#666',
    fontSize: '14px'
  },
  productMain: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '50px',
    marginBottom: '50px'
  },
  imageGallery: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px'
  },
  mainImageContainer: {
    position: 'relative'
  },
  mainImage: {
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    border: '1px solid #eee'
  },
  mainImageImg: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain'
  },
  iconPlaceholder: {
    fontSize: '5rem'
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: '#fc8181',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    zIndex: 10
  },
  specialOverlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: '#e53e3e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px',
    zIndex: 10
  },
  productInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  category: {
    color: '#667eea',
    textTransform: 'uppercase',
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px'
  },
  productTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: '0',
    color: '#333'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  reviewCount: {
    color: '#666',
    fontSize: '14px'
  },
  priceSection: {
    padding: '15px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee'
  },
  currentPrice: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  oldPrice: {
    fontSize: '1.2rem',
    color: '#999',
    textDecoration: 'line-through',
    marginBottom: '5px'
  },
  taxInfo: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px'
  },
  stockStatus: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  inStock: {
    color: '#48bb78',
    fontWeight: 'bold'
  },
  outOfStock: {
    color: '#fc8181',
    fontWeight: 'bold'
  },
  stockCount: {
    color: '#666',
    fontSize: '14px'
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px'
  },
  quantitySelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  qtyBtn: {
    width: '40px',
    height: '40px',
    border: 'none',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontSize: '18px'
  },
  qtyNumber: {
    minWidth: '40px',
    textAlign: 'center',
    fontSize: '16px'
  },
  unitInfo: {
    color: '#666',
    fontSize: '14px'
  },
  addToCartBtn: {
    width: '100%',
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  notifyContainer: {
    background: '#f0f7ff',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '10px'
  },
  notifyText: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#667eea'
  },
  notifyForm: {
    display: 'flex',
    gap: '10px'
  },
  notifyInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  notifyButton: {
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  deliveryInfo: {
    background: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '15px'
  },
  deliveryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontSize: '14px'
  },
  deliveryIcon: {
    fontSize: '18px'
  },
  tabsContainer: {
    marginTop: '40px',
    borderTop: '1px solid #eee'
  },
  tabs: {
    display: 'flex',
    gap: '30px',
    borderBottom: '2px solid #eee'
  },
  tab: {
    padding: '15px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666'
  },
  activeTab: {
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    marginBottom: '-2px'
  },
  tabContent: {
    padding: '30px 0'
  },
  description: {
    lineHeight: '1.6',
    color: '#555',
    marginBottom: '20px'
  },
  featuresList: {
    listStyle: 'none',
    padding: 0
  },
  specsTable: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  specLabel: {
    fontWeight: 'bold',
    padding: '10px 0',
    width: '150px'
  },
  reviewSummary: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  averageRating: {
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  reviewItem: {
    borderBottom: '1px solid #eee',
    padding: '15px 0'
  },
  writeReviewBtn: {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  relatedSection: {
    marginTop: '50px',
    paddingTop: '30px',
    borderTop: '1px solid #eee'
  },
  relatedGrid: {
    marginTop: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px',
    color: '#666'
  },
  notFound: {
    textAlign: 'center',
    padding: '100px'
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default function Product() {
  return (
    <CartProvider>
      <ProductPage />
    </CartProvider>
  );
}
