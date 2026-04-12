import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function WaterProductCard({ product }) {
  const { addToCart } = useCart();

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getWaterIcon = () => {
    if (product.category === 'sparkling') return '💧✨';
    if (product.category === 'spring') return '⛲';
    if (product.category === 'bulk') return '🚰';
    return '💧';
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/product-images/${imageUrl}`;
  };

  const imageUrl = getImageUrl(product.image_url);

  return (
    <div className="water-card">
      <Link href={`/water/${product.id}`}>
        <div className="water-image">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="water-img" />
          ) : (
            <div className="water-icon">{getWaterIcon()}</div>
          )}
          {product.is_bulk && <span className="bulk-badge">BULK</span>}
        </div>
      </Link>
      
      <div className="water-info">
        <Link href={`/water/${product.id}`}>
          <h3 className="water-title">{product.name}</h3>
        </Link>
        <p className="water-description">{product.description?.substring(0, 60)}...</p>
        
        <div className="water-meta">
          <span className="water-size">📦 {product.size}</span>
          <span className="water-type">💧 {product.water_type || 'Purified'}</span>
        </div>
        
        <div className="water-footer">
          <div className="water-price">
            {formatZAR(product.price)}
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart({ ...product, type: 'water' }, 1)}
            disabled={product.stock_quantity === 0}
          >
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .water-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #e0f2fe;
        }
        .water-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .water-image {
          height: 200px;
          background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .water-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
        }
        .water-icon {
          font-size: 4rem;
        }
        .bulk-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #0284c7;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .water-info {
          padding: 1rem;
        }
        .water-title {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          color: #0c4a6e;
        }
        .water-description {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 0.5rem;
        }
        .water-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .water-size, .water-type {
          font-size: 0.7rem;
          padding: 2px 8px;
          background: #f0f9ff;
          border-radius: 12px;
          color: #0284c7;
        }
        .water-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .water-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #0284c7;
        }
        .add-to-cart-btn {
          padding: 8px 16px;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.3s;
        }
        .add-to-cart-btn:hover:not(:disabled) {
          background: #0369a1;
          transform: scale(1.05);
        }
        .add-to-cart-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
