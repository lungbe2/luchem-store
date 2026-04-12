import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Privacy Policy</h1>
        <div style={styles.content}>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support.</p>
          
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Process your orders and payments</li>
            <li>Send you order confirmations and invoices</li>
            <li>Communicate about your account or orders</li>
            <li>Improve our products and services</li>
          </ul>
          
          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist with order fulfillment, payment processing, and email delivery.</p>
          
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. All payment information is encrypted.</p>
          
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at info@luchem.co.za for assistance.</p>
          
          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at info@luchem.co.za</p>
          
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
