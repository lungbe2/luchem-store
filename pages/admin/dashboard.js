import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import EditModal from '../../components/EditModal';
import { isAdminSession, setAdminSession } from '../../lib/adminAuth';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [services, setServices] = useState([]);
  const [waterProducts, setWaterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const formatZAR = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const shopProducts = products.filter(product => product.category !== 'car_detailing');
  const carDetailingProducts = products.filter(product => product.category === 'car_detailing');

  useEffect(() => {
    if (isAdminSession()) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      setAdminSession();
      setIsAuthenticated(true);
    } else {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      alert(error.error || 'Wrong password!');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await fetchProducts();
    await fetchRawMaterials();
    await fetchServices();
    await fetchWaterProducts();
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category');
    if (!error && data) setProducts(data);
  };

  const fetchRawMaterials = async () => {
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*')
      .order('name');
    if (!error && data) setRawMaterials(data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    if (!error && data) setServices(data);
  };

  const fetchWaterProducts = async () => {
    const { data, error } = await supabase
      .from('water_products')
      .select('*')
      .order('category');
    if (!error && data) setWaterProducts(data);
  };

  const uploadImageToStorage = async (file, folder, itemId) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${itemId}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSave = async (formData, isEdit) => {
    setSaving(true);
    let imageUrl = formData.image_url;

    if (formData.image_file && isEdit && editingItem?.id) {
      const uploadedUrl = await uploadImageToStorage(formData.image_file, `${editingType}s`, editingItem.id);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    let updates;
    let tableName;

    if (editingType === 'product') {
      tableName = 'products';
      updates = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category,
        size: formData.size,
        image_url: imageUrl || null
      };
    } else if (editingType === 'raw') {
      tableName = 'raw_materials';
      updates = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        supplier: formData.supplier || '',
        unit: formData.unit,
        image_url: imageUrl || null
      };
    } else if (editingType === 'service') {
      tableName = 'services';
      const priceDisplay = formData.price && parseFloat(formData.price) > 0 
        ? `Starting at ${formatZAR(parseFloat(formData.price))}`
        : 'Custom Quote';
      updates = {
        name: formData.name,
        description: formData.description || '',
        price: priceDisplay,
        price_value: parseFloat(formData.price) || 0,
        icon: formData.icon || '🧹',
        status: formData.status || 'active',
        image_url: imageUrl || null
      };
    } else if (editingType === 'water') {
      tableName = 'water_products';
      updates = {
        name: formData.name,
        description: formData.description || '',
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity),
        category: formData.category || 'still',
        size: formData.size,
        volume_ml: parseInt(formData.volume_ml) || 0,
        water_type: formData.water_type || 'purified',
        ph_level: parseFloat(formData.ph_level) || null,
        is_bulk: formData.is_bulk === 'true' || formData.is_bulk === true,
        deposit_amount: parseFloat(formData.deposit_amount) || 0,
        delivery_available: formData.delivery_available === 'true' || formData.delivery_available === true,
        image_url: imageUrl || null,
        is_active: formData.is_active === 'true' || formData.is_active === true
      };
    }

    let result;
    if (isEdit) {
      result = await supabase.from(tableName).update(updates).eq('id', editingItem.id);
    } else {
      const { data, error } = await supabase.from(tableName).insert([updates]).select();
      result = { error };
      if (data && data[0] && formData.image_file) {
        const newId = data[0].id;
        const uploadedUrl = await uploadImageToStorage(formData.image_file, `${editingType}s`, newId);
        if (uploadedUrl) {
          await supabase.from(tableName).update({ image_url: uploadedUrl }).eq('id', newId);
        }
      }
    }

    if (result?.error) {
      setMessage({ type: 'error', text: result.error.message });
    } else {
      setMessage({ type: 'success', text: `${editingType} saved successfully!` });
      setEditingItem(null);
      await fetchAllData();
    }
    setSaving(false);
  };

  const handleDelete = async (item, type) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    
    let tableName;
    if (type === 'product') tableName = 'products';
    else if (type === 'raw') tableName = 'raw_materials';
    else if (type === 'service') tableName = 'services';
    else if (type === 'water') tableName = 'water_products';
    
    const { error } = await supabase.from(tableName).delete().eq('id', item.id);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: `${type} deleted successfully!` });
      await fetchAllData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div style={styles.loginContainer}>
          <h1 style={styles.loginTitle}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.loginInput}
            />
            <button type="submit" style={styles.loginButton}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        
        {message && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '4px',
            background: message.type === 'success' ? '#e8f5e9' : '#fee',
            color: message.type === 'success' ? '#2e7d32' : '#c33'
          }}>
            {message.text}
          </div>
        )}
        
        <div style={styles.tabs}>
          <button onClick={() => { setActiveTab('products'); setEditingItem(null); }} style={{ ...styles.tab, ...(activeTab === 'products' ? styles.activeTab : {}) }}>
            🧼 Products ({shopProducts.length})
          </button>
          <button onClick={() => { setActiveTab('detailing'); setEditingItem(null); }} style={{ ...styles.tab, ...(activeTab === 'detailing' ? styles.activeTab : {}) }}>
            Car Detailing ({carDetailingProducts.length})
          </button>
          <button onClick={() => { setActiveTab('raw'); setEditingItem(null); }} style={{ ...styles.tab, ...(activeTab === 'raw' ? styles.activeTab : {}) }}>
            🧪 Raw Materials ({rawMaterials.length})
          </button>
          <button onClick={() => { setActiveTab('services'); setEditingItem(null); }} style={{ ...styles.tab, ...(activeTab === 'services' ? styles.activeTab : {}) }}>
            🧹 Services ({services.length})
          </button>
          <button onClick={() => { setActiveTab('water'); setEditingItem(null); }} style={{ ...styles.tab, ...(activeTab === 'water' ? styles.activeTab : {}) }}>
            💧 Water ({waterProducts.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={styles.header}>
              <h2>Products Management</h2>
              <button onClick={() => { setEditingItem({ category: 'dishwashing' }); setEditingType('product'); }} style={styles.addButton}>
                + Add New Product
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Size</th><th>Price</th><th>Stock</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shopProducts.map(product => (
                    <tr key={product.id} style={styles.tableRow}>
                      <td>{product.image_url ? <img src={product.image_url} style={styles.tableImage} /> : '📷'}</td>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.size}</td>
                      <td>{formatZAR(product.price)}</td>
                      <td>{product.stock_quantity}</td>
                      <td>
                        <button onClick={() => { setEditingItem(product); setEditingType('product'); }} style={styles.editButton}>✏️ Edit</button>
                        <button onClick={() => handleDelete(product, 'product')} style={styles.deleteButton}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Car Detailing Tab */}
        {activeTab === 'detailing' && (
          <div>
            <div style={styles.header}>
              <h2>Car Detailing Products</h2>
              <button onClick={() => { setEditingItem({ category: 'car_detailing' }); setEditingType('product'); }} style={styles.addButton}>
                + Add Car Detailing Product
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Size</th><th>Price</th><th>Stock</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carDetailingProducts.map(product => (
                    <tr key={product.id} style={styles.tableRow}>
                      <td>{product.image_url ? <img src={product.image_url} style={styles.tableImage} /> : 'Auto'}</td>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.size}</td>
                      <td>{formatZAR(product.price)}</td>
                      <td>{product.stock_quantity}</td>
                      <td>
                        <button onClick={() => { setEditingItem(product); setEditingType('product'); }} style={styles.editButton}>Edit</button>
                        <button onClick={() => handleDelete(product, 'product')} style={styles.deleteButton}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {carDetailingProducts.length === 0 && (
                    <tr style={styles.tableRow}>
                      <td colSpan="8" style={styles.emptyCell}>No car detailing products yet. Add the first one here.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Raw Materials Tab */}
        {activeTab === 'raw' && (
          <div>
            <div style={styles.header}>
              <h2>Raw Materials Management</h2>
              <button onClick={() => { setEditingItem({}); setEditingType('raw'); }} style={styles.addButton}>
                + Add Raw Material
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Image</th><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Supplier</th><th>Unit</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map(material => (
                    <tr key={material.id} style={styles.tableRow}>
                      <td>{material.image_url ? <img src={material.image_url} style={styles.tableImage} /> : '🧪'}</td>
                      <td>{material.id}</td>
                      <td>{material.name}</td>
                      <td>{formatZAR(material.price)}</td>
                      <td>{material.stock_quantity}</td>
                      <td>{material.supplier || 'Various'}</td>
                      <td>{material.unit}</td>
                      <td>
                        <button onClick={() => { setEditingItem(material); setEditingType('raw'); }} style={styles.editButton}>✏️ Edit</button>
                        <button onClick={() => handleDelete(material, 'raw')} style={styles.deleteButton}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div>
            <div style={styles.header}>
              <h2>Services Management</h2>
              <button onClick={() => { setEditingItem({}); setEditingType('service'); }} style={styles.addButton}>
                + Add Service
              </button>
            </div>
            <div style={styles.serviceGrid}>
              {services.map(service => (
                <div key={service.id} style={styles.serviceCard}>
                  {service.image_url ? (
                    <img src={service.image_url} alt={service.name} style={styles.serviceImage} />
                  ) : (
                    <div style={styles.serviceIcon}>{service.icon}</div>
                  )}
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p style={styles.servicePrice}>{service.price}</p>
                  <span style={{ ...styles.serviceStatus, background: service.status === 'active' ? '#e8f5e9' : '#fee', color: service.status === 'active' ? '#2e7d32' : '#c33' }}>
                    {service.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                  <div style={styles.serviceActions}>
                    <button onClick={() => { setEditingItem(service); setEditingType('service'); }} style={styles.editButton}>✏️ Edit</button>
                    <button onClick={() => handleDelete(service, 'service')} style={styles.deleteButton}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Water Tab */}
        {activeTab === 'water' && (
          <div>
            <div style={styles.header}>
              <h2>Water Products Management</h2>
              <button onClick={() => { setEditingItem({}); setEditingType('water'); }} style={styles.addButton}>
                + Add Water Product
              </button>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Size</th><th>Volume</th><th>Price</th><th>Stock</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {waterProducts.map(product => (
                    <tr key={product.id} style={styles.tableRow}>
                      <td>{product.image_url ? <img src={product.image_url} style={styles.tableImage} /> : '💧'}</td>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.size}</td>
                      <td>{product.volume_ml ? `${product.volume_ml}ml` : '-'}</td>
                      <td>{formatZAR(product.price)}</td>
                      <td>{product.stock_quantity}</td>
                      <td>
                        <button onClick={() => { setEditingItem(product); setEditingType('water'); }} style={styles.editButton}>✏️ Edit</button>
                        <button onClick={() => handleDelete(product, 'water')} style={styles.deleteButton}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSave}
          item={editingItem}
          type={editingType}
          saving={saving}
        />
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' },
  title: { fontSize: '2rem', marginBottom: '20px' },
  loginContainer: { maxWidth: '400px', margin: '100px auto', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  loginTitle: { textAlign: 'center', marginBottom: '30px' },
  loginInput: { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '6px' },
  loginButton: { width: '100%', padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #eee', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  activeTab: { borderBottom: '3px solid #667eea', color: '#667eea', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addButton: { padding: '10px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  tableContainer: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', background: 'white' },
  tableHeader: { background: '#667eea', color: 'white', padding: '12px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  emptyCell: { padding: '18px', textAlign: 'center', color: '#64748b' },
  tableImage: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' },
  editButton: { padding: '5px 10px', marginRight: '5px', background: '#4299e1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  deleteButton: { padding: '5px 10px', background: '#fc8181', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
  serviceCard: { padding: '20px', border: '1px solid #e0e0e0', borderRadius: '12px', background: 'white', textAlign: 'center' },
  serviceImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto 10px auto' },
  serviceIcon: { fontSize: '3rem', marginBottom: '10px' },
  servicePrice: { fontWeight: 'bold', color: '#667eea', marginTop: '10px' },
  serviceStatus: { display: 'inline-block', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginTop: '10px' },
  serviceActions: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }
};
