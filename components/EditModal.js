import { useState, useEffect } from 'react';

export default function EditModal({ isOpen, onClose, onSave, item, type, saving }) {
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      setPreviewUrl(item.image_url || '');
    }
  }, [item]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_file: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData, !!item?.id);
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (type === 'product') return item?.id ? 'Edit Product' : 'Add New Product';
    if (type === 'raw') return item?.id ? 'Edit Raw Material' : 'Add Raw Material';
    if (type === 'service') return item?.id ? 'Edit Service' : 'Add New Service';
    if (type === 'water') return item?.id ? 'Edit Water Product' : 'Add New Water Product';
    return 'Edit Item';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{getTitle()}</h2>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {(type === 'product' || type === 'service' || type === 'water') && (
            <div style={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows="3"
                style={styles.textarea}
              />
            </div>
          )}

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label>Price (ZAR) {type === 'service' && '- leave 0 for custom quote'}</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                required={type !== 'service'}
                style={styles.input}
              />
            </div>

            {type !== 'service' && (
              <div style={styles.formGroup}>
                <label>Stock Quantity</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity || ''}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            )}
          </div>

          {type === 'product' && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category || 'dishwashing'}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="dishwashing">Dishwashing</option>
                    <option value="car_wash">Car Wash</option>
                    <option value="bleach">Bleach</option>
                    <option value="floor_cleaner">Floor Cleaner</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="laundry">Laundry</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    placeholder="e.g., 750ml, 5L"
                    value={formData.size || ''}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>
            </>
          )}

          {type === 'raw' && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Unit</label>
                  <select
                    name="unit"
                    value={formData.unit || 'kg'}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="L">Liters (L)</option>
                    <option value="g">Grams (g)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'service' && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Icon (Emoji)</label>
                  <input
                    type="text"
                    name="icon"
                    placeholder="e.g., 🧹, 🏢, 🏠"
                    value={formData.icon || '🧹'}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status || 'active'}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {type === 'water' && (
            <>
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Water Category</label>
                  <select
                    name="category"
                    value={formData.category || 'still'}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="still">Still Water</option>
                    <option value="sparkling">Sparkling Water</option>
                    <option value="spring">Spring Water</option>
                    <option value="bulk">Bulk / Office</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label>Size</label>
                  <input
                    type="text"
                    name="size"
                    placeholder="e.g., 500ml, 1L, 19L"
                    value={formData.size || ''}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>Volume (ml)</label>
                  <input
                    type="number"
                    name="volume_ml"
                    placeholder="e.g., 500, 1000, 19000"
                    value={formData.volume_ml || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Water Type</label>
                  <select
                    name="water_type"
                    value={formData.water_type || 'purified'}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="purified">Purified</option>
                    <option value="spring">Spring</option>
                    <option value="mineral">Mineral</option>
                    <option value="sparkling">Sparkling</option>
                  </select>
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    name="ph_level"
                    placeholder="e.g., 7.2"
                    value={formData.ph_level || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label>Deposit Amount (ZAR)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="deposit_amount"
                    placeholder="Bottle deposit if any"
                    value={formData.deposit_amount || ''}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      name="is_bulk"
                      checked={formData.is_bulk === true || formData.is_bulk === 'true'}
                      onChange={handleCheckboxChange}
                      style={{ marginRight: '8px' }}
                    />
                    Bulk Product
                  </label>
                </div>
                <div style={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      name="delivery_available"
                      checked={formData.delivery_available !== false}
                      onChange={handleCheckboxChange}
                      style={{ marginRight: '8px' }}
                    />
                    Delivery Available
                  </label>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active !== false}
                    onChange={handleCheckboxChange}
                    style={{ marginRight: '8px' }}
                  />
                  Active (visible on store)
                </label>
              </div>
            </>
          )}

          <div style={styles.formGroup}>
            <label>Image</label>
            {previewUrl && (
              <div style={styles.imagePreview}>
                <img src={previewUrl} alt="Preview" style={styles.previewImage} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
            {uploading && <p style={{ color: '#667eea' }}>Uploading...</p>}
            <p style={styles.hint}>Upload an image from your computer (PNG, JPG)</p>
          </div>

          <div style={styles.buttons}>
            <button type="submit" disabled={saving || uploading} style={styles.saveButton}>
              {saving ? 'Saving...' : (item?.id ? 'Update' : 'Add')}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '650px',
    width: '90%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #eee'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#333'
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
    padding: '0 25px',
    marginBottom: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    padding: '0 25px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit'
  },
  fileInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px'
  },
  imagePreview: {
    marginBottom: '10px'
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '150px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #ddd',
    padding: '5px'
  },
  hint: {
    fontSize: '12px',
    color: '#999',
    marginTop: '5px'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    padding: '20px 25px',
    borderTop: '1px solid #eee',
    marginTop: '10px'
  },
  saveButton: {
    flex: 1,
    padding: '12px',
    background: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    background: '#a0aec0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};
