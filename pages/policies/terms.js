import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsConditions() {
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Terms & Conditions</h1>
        <div style={styles.content}>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the LuChem website, you agree to be bound by these Terms & Conditions.</p>
          
          <h2>2. Products and Pricing</h2>
          <p>All prices are in South African Rand (ZAR) and include VAT unless stated otherwise. We reserve the right to change prices without notice.</p>
          
          <h2>3. Orders and Payments</h2>
          <p>Orders are confirmed upon payment. We accept EFT, credit/debit cards (coming soon), and invoice payments for approved customers.</p>
          
          <h2>4. Shipping and Delivery</h2>
          <p>Delivery times are estimates and not guaranteed. We deliver to all major towns in South Africa. Delivery fees are calculated at checkout based on your location.</p>
          
          <h2>5. Returns and Refunds</h2>
          <p>Please refer to our Returns Policy for detailed information about returns and refunds.</p>
          
          <h2>6. Privacy Policy</h2>
          <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect and use your information.</p>
          
          <h2>7. Contact Information</h2>
          <p>For questions about these Terms, contact us at info@luchem.co.za</p>
          
          <p><strong>Last updated:</strong> April 2024</p>
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
