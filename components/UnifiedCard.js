import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function UnifiedCard({ item, type, formatZAR }) {
  const { addToCart } = useCart();
  const hasSpecial = item.old_price && item.old_price > item.price;
  const discountPercent = hasSpecial ? Math.round((1 - item.price / item.old_price) * 100) : 0;

  const getIcon = () => {
    if (type === 'product') {
      const icons = {
        dishwashing: '🧼',
        car_wash: '🚗',
        bleach: '🧴',
        floor_cleaner: '🧹',
        kitchen: '🍳',
        bathroom: '🚽',
        laundry: '👕'
      };
      return icons[item.category] || '🧹';
    }
    if (type === 'raw') return '🧪';
    if (type === 'service') return item.icon || '🧹';
    if (type === 'water') return '💧';
    return '📦';
  };

  const getPriceDisplay = () => {
    if (type === 'service') {
      if (item.price && typeof item.price === 'string' && item.price.includes('R')) return item.price;
      if (item.price_value && item.price_value > 0) return formatZAR(item.price_value);
      if (item.price && !isNaN(parseFloat(item.price)) && parseFloat(item.price) > 0) {
        return formatZAR(parseFloat(item.price));
      }
      return 'Custom Quote';
    }
    if (type === 'raw') return `${formatZAR(item.price)}/${item.unit}`;
    return formatZAR(item.price);
  };

  const getLink = () => {
    if (type === 'product') return `/product/${item.id}`;
    if (type === 'raw') return `/raw-materials`;
    if (type === 'service') return `/services`;
    if (type === 'water') return `/water`;
    return '#';
  };

  const getSecondaryInfo = () => {
    if (type === 'raw') {
      return (
        <p style={{ fontSize: '12px', color: '#48bb78', margin: '5px 0 0 0' }}>
          Stock: {item.stock_quantity} {item.unit}
        </p>
      );
    }
    if (type === 'product') {
      return (
        <p style={{ fontSize: '12px', color: '#48bb78', margin: '5px 0 0 0' }}>
          Stock: {item.stock_quantity}
        </p>
      );
    }
    return null;
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'white',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      position: 'relative'
    }}
    onClick={() => window.location.href = getLink()}>
      {/* Special Offer Badge */}
      {hasSpecial && (
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
          🔥 {discountPercent}% OFF
        </div>
      )}
      
      {/* Image container with WHITE background */}
      <div style={{
        height: '220px',
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
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain'
            }}
            onError={(e) => {
              console.error('Image failed to load:', item.image_url);
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="font-size: 4rem;">${getIcon()}</div>`;
            }}
          />
        ) : (
          <div style={{ fontSize: '4rem' }}>{getIcon()}</div>
        )}
      </div>
      
      <div style={{ padding: '20px' }}>
        <h3 style={{ 
          margin: '0 0 10px', 
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#333'
        }}>
          {item.name}
        </h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px', lineHeight: '1.4' }}>
          {item.description?.substring(0, 80)}...
        </p>
        
        <div style={{ marginBottom: '10px' }}>
          {type === 'raw' && (
            <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
              Supplier: {item.supplier || 'Various'}
            </span>
          )}
          {type === 'product' && (
            <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
              {item.size}
            </span>
          )}
          {type === 'water' && (
            <span style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
              📦 {item.size}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
          <div>
            {hasSpecial && item.old_price && (
              <span style={{ 
                fontSize: '14px', 
                color: '#999', 
                textDecoration: 'line-through',
                display: 'block'
              }}>
                {formatZAR(item.old_price)}
              </span>
            )}
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: hasSpecial ? '#e53e3e' : '#667eea' }}>
              {getPriceDisplay()}
            </span>
            {getSecondaryInfo()}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (type === 'service') {
                alert('Please call us to book: 071 017 7161');
              } else if (type === 'raw') {
                alert('Please contact us for bulk orders: sales@luchem.co.za');
              } else {
                if (item.stock_quantity === 0) {
                  alert('This product is out of stock!');
                  return;
                }
                addToCart({ ...item, type }, 1);
                alert(`Added ${item.name} to cart!`);
              }
            }}
            disabled={type !== 'service' && type !== 'raw' && item.stock_quantity === 0}
            style={{
              padding: '8px 16px',
              background: type !== 'service' && type !== 'raw' && item.stock_quantity === 0 ? '#a0aec0' : '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: type !== 'service' && type !== 'raw' && item.stock_quantity === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            {type === 'service' ? 'Book Now' : type === 'raw' ? 'Inquire' : item.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
