import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { CartProvider } from '../context/CartContext';
import AuthModal from '../components/AuthModal';

function CheckoutPage() {
  const { cart, cartTotal, clearCart, formatZAR } = useCart();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [towns, setTowns] = useState([]);
  const [loadingTowns, setLoadingTowns] = useState(true);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('invoice');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    town_id: '',
    town_name: '',
    address: '',
    address_line2: '',
    notes: ''
  });
  
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !user && cart.length > 0) {
      setShowAuth(true);
    }
  }, [isCheckingAuth, user, cart.length]);

  useEffect(() => {
    if (user) {
      fetchTowns();
    }
  }, [user]);

  useEffect(() => {
    const selectedTown = towns.find(t => t.id === parseInt(formData.town_id));
    if (selectedTown) {
      setDeliveryFee(selectedTown.delivery_fee);
      setFormData(prev => ({ ...prev, town_name: selectedTown.name }));
    } else {
      setDeliveryFee(0);
    }
  }, [formData.town_id, towns]);

  const checkUser = async () => {
    setIsCheckingAuth(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setUserEmail(user.email);
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          town_id: profile.default_town_id || '',
          address: profile.default_address || ''
        }));
      }
    }
    setIsCheckingAuth(false);
  };

  const fetchTowns = async () => {
    const { data, error } = await supabase
      .from('towns')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setTowns(data);
    }
    setLoadingTowns(false);
  };

  const detectLocation = () => {
    setDetectingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Please select your town manually.');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
          );
          const data = await response.json();
          
          let detectedTown = data.address?.city || 
                            data.address?.town || 
                            data.address?.village ||
                            data.address?.suburb;
          
          if (detectedTown) {
            const matchingTown = towns.find(t => 
              t.name.toLowerCase().includes(detectedTown.toLowerCase()) ||
              detectedTown.toLowerCase().includes(t.name.toLowerCase())
            );
            
            if (matchingTown) {
              setFormData(prev => ({ ...prev, town_id: matchingTown.id }));
              alert(`Location detected: ${matchingTown.name}`);
            } else {
              alert(`We detected "${detectedTown}" but delivery is not available. Please select from the list.`);
            }
          } else {
            alert('Could not detect your town. Please select manually.');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          alert('Could not detect your location. Please select manually.');
        }
        setDetectingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to detect your location. Please select your town manually.');
        setDetectingLocation(false);
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateStep1 = () => {
    if (!formData.fullName) {
      alert('Please enter your full name');
      return false;
    }
    if (!formData.phone) {
      alert('Please enter your phone number');
      return false;
    }
    if (!formData.town_id) {
      alert('Please select your delivery location');
      return false;
    }
    if (!formData.address) {
      alert('Please enter your street address');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendInvoiceEmail = async (order, orderItems) => {
    try {
      const emailData = {
        to: userEmail,
        subject: `LuChem Order Confirmation - #${order.id}`,
        orderId: order.id,
        customerName: formData.fullName,
        customerEmail: userEmail,
        orderDate: new Date().toLocaleDateString(),
        items: orderItems,
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        total: cartTotal + deliveryFee,
        shippingAddress: `${formData.address}${formData.address_line2 ? ', ' + formData.address_line2 : ''}, ${formData.town_name}`
      };
      
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) {
        console.error('Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
    }
  };

  const saveProfile = async (session) => {
    await fetch('/api/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
      },
      body: JSON.stringify({
        full_name: formData.fullName,
        phone: formData.phone,
        default_town_id: formData.town_id || null,
        default_address: formData.address
      })
    });
  };

  const submitPayFastPayment = async (orderId, session) => {
    const selectedTown = towns.find(t => t.id === parseInt(formData.town_id));
    const response = await fetch('/api/payfast/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
      },
      body: JSON.stringify({
        orderId,
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          address_line2: formData.address_line2,
          region: selectedTown?.province || ''
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Could not prepare PayFast payment' }));
      throw new Error(error.error || 'Could not prepare PayFast payment');
    }

    const { processUrl, fields } = await response.json();
    const form = document.createElement('form');
    form.method = 'post';
    form.action = processUrl;
    form.style.display = 'none';

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value || '';
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    const orderData = {
      user_id: user.id,
      user_email: userEmail,
      items: cart,
      subtotal: cartTotal,
      delivery_fee: deliveryFee,
      total: cartTotal + deliveryFee,
      customer: {
        fullName: formData.fullName,
        email: userEmail,
        phone: formData.phone,
        address: formData.address,
        address_line2: formData.address_line2
      },
      town_id: formData.town_id,
      town_name: formData.town_name,
      payment_method: selectedPayment
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderId(order.orderId);

        await saveProfile(session);

        if (selectedPayment === 'payfast') {
          await submitPayFastPayment(order.orderId, session);
          return;
        }
        
        await sendInvoiceEmail(order, cart);
        
        setOrderComplete(true);
        clearCart();
        
        setTimeout(() => {
          router.push(`/order-confirmation/${order.orderId}`);
        }, 3000);
      } else {
        const error = await response.json();
        alert('Error placing order: ' + error.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    checkUser();
    setShowAuth(false);
  };

  if (isCheckingAuth) {
    return (
      <div>
        <Navbar />
        <div style={styles.loadingContainer}>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div>
        <Navbar />
        <div style={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart before checking out.</p>
          <button onClick={() => router.push('/products')} style={styles.continueBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div>
        <Navbar />
        <div style={styles.success}>
          <div style={styles.successIcon}>✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with LuChem.</p>
          <p>Order #{orderId} has been confirmed.</p>
          <p>📧 An invoice has been sent to <strong>{userEmail}</strong></p>
          <p>Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  const totalWithDelivery = cartTotal + deliveryFee;

  return (
    <div>
      <Navbar />
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => {
          setShowAuth(false);
          if (!user) {
            router.push('/products');
          }
        }}
        onSuccess={handleAuthSuccess}
      />
      
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Checkout</h1>
        
        {user && (
          <div style={styles.emailBanner}>
            📧 Invoices will be sent to: <strong>{userEmail}</strong>
          </div>
        )}
        
        <div style={{ ...styles.stepProgress, gap: isMobile ? '6px' : '10px' }}>
          <div style={{ ...styles.step, ...(currentStep >= 1 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepLabel}>Shipping</div>
          </div>
          <div style={{ ...styles.stepLine, width: isMobile ? '28px' : '60px' }}></div>
          <div style={{ ...styles.step, ...(currentStep >= 2 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepLabel}>Summary</div>
          </div>
          <div style={{ ...styles.stepLine, width: isMobile ? '28px' : '60px' }}></div>
          <div style={{ ...styles.step, ...(currentStep >= 3 ? styles.stepActive : {}) }}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepLabel}>Payment</div>
          </div>
        </div>

        <div style={{ ...styles.checkoutWrapper, gridTemplateColumns: isMobile ? '1fr' : '1fr 350px' }}>
          <div style={{ ...styles.formColumn, padding: isMobile ? '20px' : '30px' }}>
            {currentStep === 1 && (
              <div style={styles.section}>
                <h2>Shipping Information</h2>
                
                <div style={styles.formGroup}>
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="John Doe"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="071 234 5678"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Delivery Location *</label>
                  <div style={{ ...styles.locationRow, flexDirection: isMobile ? 'column' : 'row' }}>
                    <select
                      name="town_id"
                      required
                      value={formData.town_id}
                      onChange={handleChange}
                      style={{ ...styles.input, flex: 2 }}
                      disabled={loadingTowns}
                    >
                      <option value="">Select your town/city</option>
                      {towns.map(town => (
                        <option key={town.id} value={town.id}>
                          {town.name} - {town.province} (Delivery: R{town.delivery_fee})
                        </option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      onClick={detectLocation}
                      disabled={detectingLocation}
                      style={styles.detectBtn}
                    >
                      {detectingLocation ? '📍 Detecting...' : '📍 Detect'}
                    </button>
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label>Street Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="House number and street name"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="address_line2"
                    value={formData.address_line2}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label>Order Notes (Optional)</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    style={styles.textarea}
                    placeholder="Special delivery instructions"
                  />
                </div>

                <button onClick={handleNextStep} style={styles.continueBtn}>
                  Continue to Summary →
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div style={styles.section}>
                <h2>Order Summary</h2>
                
                <div style={styles.summaryBox}>
                  <h3>Shipping Information</h3>
                  <div style={styles.summaryRow}>
                    <span>Name:</span>
                    <span>{formData.fullName}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Email:</span>
                    <span><strong>{userEmail}</strong></span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery to:</span>
                    <span>{formData.town_name}, {formData.address}{formData.address_line2 ? ', ' + formData.address_line2 : ''}</span>
                  </div>
                  
                  <h3>Order Items</h3>
                  {cart.map(item => (
                    <div key={item.id} style={styles.summaryRow}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatZAR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  
                  <div style={styles.summaryDivider}></div>
                  
                  <div style={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>{formatZAR(cartTotal)}</span>
                  </div>
                  <div style={styles.summaryRow}>
                    <span>Delivery Fee:</span>
                    <span>{formatZAR(deliveryFee)}</span>
                  </div>
                  <div style={styles.summaryTotal}>
                    <span>Total:</span>
                    <span>{formatZAR(totalWithDelivery)}</span>
                  </div>
                </div>

                <div style={{ ...styles.buttonGroup, flexDirection: isMobile ? 'column' : 'row' }}>
                  <button onClick={handlePrevStep} style={styles.backBtn}>
                    ← Back
                  </button>
                  <button onClick={() => setCurrentStep(3)} style={styles.continueBtn}>
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div style={styles.section}>
                <h2>Payment Method</h2>
                
                <div style={styles.paymentOptions}>
                  <div 
                    style={{
                      ...styles.paymentOption,
                      border: selectedPayment === 'invoice' ? '2px solid #48bb78' : '1px solid #ddd',
                      background: selectedPayment === 'invoice' ? '#f0fff4' : 'white'
                    }}
                    onClick={() => setSelectedPayment('invoice')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={selectedPayment === 'invoice'}
                      onChange={() => setSelectedPayment('invoice')}
                    />
                    <label style={{ flex: 1, cursor: 'pointer' }}>
                      <strong>📧 Pay by Invoice</strong>
                      <p>An invoice will be sent to <strong>{userEmail}</strong> with payment instructions.</p>
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '6px', fontSize: '13px' }}>
                        <strong>Bank Details:</strong><br />
                        Bank: First National Bank (FNB)<br />
                        Account Name: LuChem Cleaning Solutions<br />
                        Account Number: 63052838019<br />
                        Branch Code: 250655<br />
                        Reference: {formData.fullName?.replace(/\s/g, '').toUpperCase() || 'CUSTOMER'}
                      </div>
                    </label>
                  </div>
                  
                  <div 
                    style={{
                      ...styles.paymentOption,
                      border: selectedPayment === 'payfast' ? '2px solid #071a33' : '1px solid #ddd',
                      background: selectedPayment === 'payfast' ? '#eef6ff' : 'white'
                    }}
                    onClick={() => setSelectedPayment('payfast')}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={selectedPayment === 'payfast'}
                      onChange={() => setSelectedPayment('payfast')}
                    />
                    <label style={{ flex: 1, cursor: 'pointer' }}>
                      <strong>PayFast Online Payment</strong>
                      <p>Pay securely online by card, instant EFT, or supported PayFast payment methods.</p>
                      <div style={{ marginTop: '10px', padding: '10px', background: '#f9fbff', borderRadius: '6px', fontSize: '13px' }}>
                        You will be redirected to PayFast to complete payment for <strong>{formatZAR(totalWithDelivery)}</strong>.
                      </div>
                    </label>
                  </div>
                  
                  <div style={styles.paymentOptionDisabled}>
                    <input type="radio" name="payment" disabled />
                    <label style={{ opacity: 0.5 }}>
                      <strong>💳 Credit / Debit Card</strong>
                      <p>Coming soon</p>
                    </label>
                  </div>
                </div>

                <div style={{ ...styles.buttonGroup, flexDirection: isMobile ? 'column' : 'row' }}>
                  <button onClick={() => setCurrentStep(2)} style={styles.backBtn}>
                    ← Back
                  </button>
                  <button onClick={handlePlaceOrder} disabled={loading} style={styles.placeOrderBtn}>
                    {loading ? 'Processing...' : selectedPayment === 'payfast' ? `Pay with PayFast - ${formatZAR(totalWithDelivery)}` : `Place Order - ${formatZAR(totalWithDelivery)}`}
                  </button>
                </div>
                
                <p style={styles.paymentNote}>
                  {selectedPayment === 'payfast'
                    ? 'You will be redirected to PayFast. Your order will update automatically after payment is confirmed.'
                    : 'By placing this order, you agree to pay the invoice within 7 days.'}
                </p>
              </div>
            )}
          </div>

          <div style={{ ...styles.summaryColumn, position: isMobile ? 'static' : 'sticky' }}>
            <div style={styles.cartSummary}>
              <h3>Your Cart ({cart.length} items)</h3>
              <div style={styles.cartItems}>
                {cart.slice(0, 3).map(item => (
                  <div key={item.id} style={styles.cartItem}>
                    <div style={styles.cartItemInfo}>
                      <span style={styles.cartItemName}>{item.name}</span>
                      <span style={styles.cartItemQty}>x{item.quantity}</span>
                    </div>
                    <span>{formatZAR(item.price * item.quantity)}</span>
                  </div>
                ))}
                {cart.length > 3 && (
                  <div style={styles.moreItems}>+{cart.length - 3} more items</div>
                )}
              </div>
              <div style={styles.cartTotal}>
                <span>Subtotal:</span>
                <span>{formatZAR(cartTotal)}</span>
              </div>
              {deliveryFee > 0 && (
                <div style={styles.cartTotal}>
                  <span>Delivery:</span>
                  <span>{formatZAR(deliveryFee)}</span>
                </div>
              )}
              <div style={styles.cartGrandTotal}>
                <span>Total:</span>
                <span>{formatZAR(totalWithDelivery)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  loadingContainer: { textAlign: 'center', padding: '100px', color: '#666' },
  pageTitle: { fontSize: '2rem', marginBottom: '30px', color: '#333' },
  emailBanner: { background: '#e8f5e9', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', color: '#2e7d32' },
  stepProgress: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', gap: '10px' },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
  stepActive: { stepNumber: { background: '#667eea' } },
  stepNumber: { width: '40px', height: '40px', borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' },
  stepLabel: { fontSize: '12px', color: '#666' },
  stepLine: { width: '60px', height: '2px', background: '#ddd' },
  checkoutWrapper: { display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px' },
  formColumn: { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  section: { marginBottom: '0' },
  formGroup: { marginBottom: '20px' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px' },
  textarea: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '16px', fontFamily: 'inherit' },
  locationRow: { display: 'flex', gap: '10px' },
  detectBtn: { padding: '12px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' },
  continueBtn: { width: '100%', padding: '14px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' },
  backBtn: { flex: 1, padding: '14px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' },
  buttonGroup: { display: 'flex', gap: '15px', marginTop: '30px' },
  summaryBox: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginTop: '10px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' },
  summaryDivider: { height: '1px', background: '#ddd', margin: '15px 0' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', fontWeight: 'bold', fontSize: '18px' },
  paymentOptions: { marginTop: '20px' },
  paymentOption: { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '15px', cursor: 'pointer', transition: 'all 0.3s' },
  paymentOptionDisabled: { padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'flex-start', gap: '15px', opacity: 0.6, background: '#f9f9f9' },
  placeOrderBtn: { flex: 2, padding: '14px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
  paymentNote: { textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' },
  summaryColumn: { position: 'sticky', top: '20px', height: 'fit-content' },
  cartSummary: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cartItems: { marginTop: '15px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #f0f0f0', fontSize: '14px' },
  cartItemInfo: { display: 'flex', gap: '10px', flex: 1 },
  cartItemName: { flex: 1 },
  cartItemQty: { color: '#666' },
  moreItems: { textAlign: 'center', color: '#666', fontSize: '12px', marginTop: '10px' },
  cartTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', fontSize: '14px' },
  cartGrandTotal: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', fontWeight: 'bold', fontSize: '18px' },
  emptyCart: { textAlign: 'center', padding: '80px 20px' },
  shopBtn: { marginTop: '20px', padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  success: { textAlign: 'center', padding: '80px 20px' },
  successIcon: { fontSize: '64px', marginBottom: '20px', color: '#48bb78' }
};

export default function Checkout() {
  return (
    <CartProvider>
      <CheckoutPage />
    </CartProvider>
  );
}
