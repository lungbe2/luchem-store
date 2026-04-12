import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: '',
    address: '',
    preferred_date: '',
    preferred_time: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('status', 'active')
      .order('name');
    
    if (!error && data && data.length > 0) {
      setServices(data);
    } else {
      // Default services
      setServices([
        { id: 1, name: 'Carpet Cleaning', icon: '🧹', description: 'Professional steam cleaning and stain removal for all carpet types. Our deep cleaning process removes dirt, allergens, and tough stains.', image_url: null },
        { id: 2, name: 'House Cleaning', icon: '🏠', description: 'Complete home cleaning service including kitchens, bathrooms, bedrooms, and living areas. Customizable cleaning plans available.', image_url: null },
        { id: 3, name: 'Industrial Cleaning', icon: '🏭', description: 'Heavy-duty cleaning for factories, warehouses, and industrial facilities. Specialized equipment and industrial-grade solutions.', image_url: null },
        { id: 4, name: 'Office Cleaning', icon: '🏢', description: 'Professional cleaning for offices, commercial spaces, and retail stores. After-hours cleaning available to minimize disruption.', image_url: null },
        { id: 5, name: 'Window Cleaning', icon: '🪟', description: 'Professional interior and exterior window cleaning. Streak-free shine for residential and commercial properties.', image_url: null },
        { id: 6, name: 'Post-Construction Cleaning', icon: '🔨', description: 'Complete cleanup after construction or renovation. Dust removal, debris cleanup, and detailed finishing.', image_url: null }
      ]);
    }
    setLoading(false);
  };

  const handleBookNow = (service) => {
    setSelectedService(service);
    setFormData({
      ...formData,
      service_type: service.name
    });
    setShowBookingForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('service_bookings')
      .insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.service_type,
        address: formData.address,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        notes: formData.notes,
        status: 'pending'
      }]);

    if (error) {
      alert('Error submitting booking: ' + error.message);
    } else {
      alert('Booking request sent! We will contact you within 24 hours.');
      setShowBookingForm(false);
      setFormData({
        name: '', email: '', phone: '', service_type: '', address: '', preferred_date: '', preferred_time: '', notes: ''
      });
    }
    setSubmitting(false);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/product-images/${imageUrl}`;
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Professional Cleaning Services</h1>
        <p style={styles.subtitle}>
          We offer cleaning services for offices, houses, industries, and any place. Book your appointment today!
          <br />Request a free quote - no obligation
        </p>

        {loading ? (
          <div style={styles.loading}>Loading services...</div>
        ) : (
          <div style={styles.grid}>
            {services.map(service => {
              const imageUrl = getImageUrl(service.image_url);
              return (
                <div key={service.id} style={styles.card}>
                  {/* Image Section - Rectangular with rounded corners */}
                  <div style={styles.imageContainer}>
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={service.name} 
                        style={styles.cardImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="fallback-icon" style={{ ...styles.iconPlaceholder, display: imageUrl ? 'none' : 'flex' }}>
                      {service.icon || '🧹'}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div style={styles.contentContainer}>
                    <h2 style={styles.cardTitle}>{service.name}</h2>
                    <p style={styles.cardDescription}>{service.description}</p>
                    <button 
                      onClick={() => handleBookNow(service)}
                      style={styles.bookButton}
                    >
                      Book This Service →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div style={styles.modalOverlay} onClick={() => setShowBookingForm(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Book {selectedService?.name}</h2>
              <button onClick={() => setShowBookingForm(false)} style={styles.closeBtn}>×</button>
            </div>
            <form onSubmit={handleSubmitBooking}>
              <div style={styles.formGroup}>
                <label>Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleFormChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleFormChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleFormChange} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label>Service Type</label>
                <input type="text" name="service_type" value={formData.service_type} disabled style={styles.inputDisabled} />
              </div>
              <div style={styles.formGroup}>
                <label>Address *</label>
                <textarea name="address" required value={formData.address} onChange={handleFormChange} rows="3" style={styles.textarea} />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label>Preferred Date</label>
                  <input type="date" name="preferred_date" value={formData.preferred_date} onChange={handleFormChange} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label>Preferred Time</label>
                  <input type="time" name="preferred_time" value={formData.preferred_time} onChange={handleFormChange} style={styles.input} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label>Additional Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows="2" style={styles.textarea} placeholder="Special instructions, area size, etc..." />
              </div>
              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  title: {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333'
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '40px',
    fontSize: '1.1rem',
    lineHeight: '1.6'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    color: '#666'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column'
  },
  imageContainer: {
    height: '220px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  iconPlaceholder: {
    fontSize: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  contentContainer: {
    padding: '25px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: '1.5rem',
    marginBottom: '12px',
    color: '#333',
    fontWeight: '600'
  },
  cardDescription: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
    flex: 1
  },
  bookButton: {
    width: '100%',
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#999',
    padding: '0 8px'
  },
  formGroup: {
    padding: '0 20px',
    marginBottom: '15px'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    padding: '0 20px',
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  inputDisabled: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    background: '#f5f5f5',
    color: '#666'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  submitBtn: {
    width: 'calc(100% - 40px)',
    margin: '20px',
    padding: '12px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default function Services() {
  return (
    <CartProvider>
      <ServicesPage />
    </CartProvider>
  );
}
