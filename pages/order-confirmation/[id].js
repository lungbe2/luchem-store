import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { supabase } from '../../lib/supabase';

export default function OrderConfirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      setOrder(data || null);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  const formatZAR = (amount = 0) => new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
  }).format(amount);

  return (
    <div>
      <Navbar />
      <main style={styles.container}>
        <section style={styles.card}>
          <div style={styles.icon}>✓</div>
          <h1 style={styles.title}>Order Confirmed</h1>
          <p style={styles.subtitle}>
            Thank you for shopping with LuChem. Your invoice has been sent to your email.
          </p>

          {loading ? (
            <p style={styles.muted}>Loading order details...</p>
          ) : order ? (
            <div style={styles.details}>
              <div style={styles.row}><span>Order number</span><strong>#{order.id}</strong></div>
              <div style={styles.row}><span>Status</span><strong>{order.status || 'pending'}</strong></div>
              <div style={styles.row}><span>Payment</span><strong>{order.payment_status || 'pending'}</strong></div>
              <div style={styles.row}><span>Total</span><strong>{formatZAR(order.total_amount)}</strong></div>
              <div style={styles.address}>
                <span>Delivery address</span>
                <strong>{order.shipping_address}{order.town_name ? `, ${order.town_name}` : ''}</strong>
              </div>
            </div>
          ) : (
            <p style={styles.muted}>Order #{id} was created. Sign in to view full account history.</p>
          )}

          <div style={styles.actions}>
            <Link href="/products" style={styles.primaryLink}>Continue Shopping</Link>
            <Link href="/account" style={styles.secondaryLink}>View Account</Link>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '60px 20px'
  },
  card: {
    background: 'white',
    borderRadius: '18px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)'
  },
  icon: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#48bb78',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '38px',
    fontWeight: 'bold',
    marginBottom: '18px'
  },
  title: {
    margin: '0 0 10px',
    color: '#1a202c'
  },
  subtitle: {
    color: '#4a5568',
    margin: '0 auto 28px',
    maxWidth: '560px'
  },
  details: {
    maxWidth: '560px',
    margin: '0 auto 28px',
    textAlign: 'left',
    border: '1px solid #edf2f7',
    borderRadius: '12px',
    overflow: 'hidden'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '14px 18px',
    borderBottom: '1px solid #edf2f7'
  },
  address: {
    display: 'grid',
    gap: '6px',
    padding: '14px 18px'
  },
  muted: {
    color: '#718096',
    marginBottom: '28px'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primaryLink: {
    background: '#667eea',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: 'bold'
  },
  secondaryLink: {
    background: '#edf2f7',
    color: '#2d3748',
    textDecoration: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: 'bold'
  }
};
