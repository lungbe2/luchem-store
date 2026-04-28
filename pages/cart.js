import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import { CartProvider } from '../context/CartContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart, formatZAR } = useCart();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div>
        <Navbar />
        <div style={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products yet.</p>
          <Link href="/products">
            <button style={styles.continueBtn}>Continue Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Shopping Cart</h1>
        
        <div style={{ ...styles.cartContainer, gridTemplateColumns: isMobile ? '1fr' : '1fr 350px' }}>
          <div style={styles.cartItems}>
            {cart.map(item => (
              <div key={`${item.id}-${item.type}`} style={{ ...styles.cartItem, flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
                <div style={{ ...styles.itemImage, alignSelf: isMobile ? 'center' : 'auto' }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} style={styles.image} />
                  ) : (
                    <div style={styles.placeholder}>
                      {item.type === 'water' ? '💧' : item.type === 'raw' ? '🧪' : '🧼'}
                    </div>
                  )}
                </div>
                <div style={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>{item.size && `Size: ${item.size}`}</p>
                  <p>{formatZAR(item.price)}</p>
                  <div style={{ ...styles.quantityControls, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
                    <button onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.id, item.type)} style={styles.removeBtn}>Remove</button>
                  </div>
                </div>
                <div style={{ ...styles.itemTotal, textAlign: isMobile ? 'center' : 'right' }}>
                  {formatZAR(item.price * item.quantity)}
                </div>
              </div>
            ))}
            
            <button onClick={clearCart} style={styles.clearBtn}>Clear Cart</button>
          </div>

          <div style={styles.summary}>
            <h2>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>{formatZAR(cartTotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div style={styles.summaryTotal}>
              <span>Total:</span>
              <span>{formatZAR(cartTotal)}</span>
            </div>
            <button onClick={handleCheckout} style={styles.checkoutBtn}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  emptyCart: { textAlign: 'center', padding: '80px 20px' },
  continueBtn: { marginTop: '20px', padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cartContainer: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' },
  cartItems: { background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cartItem: { display: 'flex', gap: '20px', padding: '20px', borderBottom: '1px solid #eee' },
  itemImage: { width: '100px', height: '100px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: '100%', objectFit: 'contain' },
  placeholder: { fontSize: '2rem' },
  itemDetails: { flex: 1 },
  itemTotal: { fontWeight: 'bold', fontSize: '18px' },
  quantityControls: { display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' },
  removeBtn: { background: 'none', border: 'none', color: '#fc8181', cursor: 'pointer', marginLeft: '10px' },
  clearBtn: { marginTop: '20px', padding: '8px 16px', background: 'none', border: '1px solid #fc8181', color: '#fc8181', borderRadius: '6px', cursor: 'pointer' },
  summary: { background: '#f9f9f9', padding: '20px', borderRadius: '12px', height: 'fit-content' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', fontWeight: 'bold', fontSize: '18px' },
  checkoutBtn: { width: '100%', marginTop: '20px', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default function Cart() {
  return (
    <CartProvider>
      <CartPage />
    </CartProvider>
  );
}
