import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getCategoryIcon = () => {
    const icons = {
      dishwashing: '🧼',
      car_wash: '🚗',
      bleach: '🧴',
      floor_cleaner: '🧹',
      kitchen: '🍳',
      bathroom: '🚽',
      laundry: '👕'
    };
    return icons[product.category] || '🧹';
  };

  // Get the correct image URL
  const getImageUrl = () => {
    if (!product.image_url) return null;
    
    // If it's already a full URL, use it
    if (product.image_url.startsWith('http')) {
      return product.image_url;
    }
    
    // If it's just a filename, construct the full URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/product-images/${product.image_url}`;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="product-card">
      <Link href={`/product/${product.id}`}>
        <div className="product-image">
          {imageUrl && !imageError ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="product-img"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl);
                setImageError(true);
              }}
              onLoad={() => console.log('Image loaded:', imageUrl)}
            />
          ) : (
            <div className="product-icon">{getCategoryIcon()}</div>
          )}
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <span className="low-stock-badge">Low Stock</span>
          )}
          {product.stock_quantity === 0 && (
            <span className="sold-out-badge">Sold Out</span>
          )}
        </div>
      </Link>
      
      <div className="product-info">
        <Link href={`/product/${product.id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <p className="product-description">{product.description?.substring(0, 60)}...</p>
        
        <div className="product-meta">
          <span className="product-size">{product.size}</span>
          <span className="product-brand">{product.brand || 'LuChem'}</span>
        </div>
        
        <div className="product-footer">
          <div className="product-price">
            {formatZAR(product.price)}
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock_quantity === 0}
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .product-image {
          height: 200px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-icon {
          font-size: 4rem;
        }
        .low-stock-badge, .sold-out-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .low-stock-badge {
          background: #ed8936;
          color: white;
        }
        .sold-out-badge {
          background: #fc8181;
          color: white;
        }
        .product-info {
          padding: 1rem;
        }
        .product-title {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          color: #2d3748;
        }
        .product-description {
          color: #a0aec0;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .product-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .product-size, .product-brand {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: #f0f0f0;
          border-radius: 12px;
          color: #a0aec0;
        }
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #667eea;
        }
        .add-to-cart-btn {
          padding: 8px 16px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
        }
        .add-to-cart-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: scale(1.05);
        }
        .add-to-cart-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          .product-card {
            border-radius: 14px;
          }
          .product-image {
            height: 145px;
          }
          .product-icon {
            font-size: 3rem;
          }
          .product-info {
            padding: 0.75rem;
          }
          .product-description {
            display: none;
          }
          .product-footer {
            align-items: stretch;
            flex-direction: column;
            gap: 8px;
          }
          .product-price {
            font-size: 1.05rem;
          }
          .add-to-cart-btn {
            width: 100%;
            padding: 9px 10px;
          }
        }
      `}</style>
    </div>
  );
}
