import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ReturnsPolicy() {
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Returns Policy</h1>
        <div style={styles.content}>
          <h2>30-Day Returns Guarantee</h2>
          <p>We want you to be completely satisfied with your purchase from LuChem. If you're not happy with your order, you may return it within 30 days of delivery for a full refund or exchange.</p>
          
          <h2>Conditions for Returns</h2>
          <ul>
            <li>Products must be unused and in original packaging</li>
            <li>Proof of purchase is required</li>
            <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
            <li>Bulk/wholesale orders may have different return policies</li>
          </ul>
          
          <h2>How to Return an Item</h2>
          <ol>
            <li>Contact our customer service at sales@luchem.co.za</li>
            <li>Provide your order number and reason for return</li>
            <li>Wait for return authorization</li>
            <li>Ship the item to our address: 8 Reserwe Street, Oudtshoorn</li>
          </ol>
          
          <h2>Refund Processing</h2>
          <p>Once we receive and inspect your return, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method.</p>
          
          <p><strong>Contact us:</strong> sales@luchem.co.za or call 071 017 7161</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' },
  content: { background: '#f9f9f9', padding: '30px', borderRadius: '12px', marginTop: '20px' }
};
