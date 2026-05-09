/**
 * src/pages/ListProduct/ListProductPage.jsx
 *
 * Form for farmers to create a new produce listing.
 * Wired to POST /products via createProduct service.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast }    from '../../context/ToastContext';
import { createProduct } from '../../services/products.service.js';

const INITIAL = {
  name:        '',
  category:    'VEG',
  price:       '',
  quantity:    '',
  harvestDate: '',
  location:    '',
  description: '',
  certification: 'ORGANIC',
  delivery:    'SELF',
};

const CERT_OPTIONS     = ['ORGANIC', 'CHEMICAL_FREE', 'CERTIFIED_ORGANIC', 'CONVENTIONAL'];
const DELIVERY_OPTIONS = ['SELF', 'PICKUP', 'BOTH'];

const CERT_LABELS = {
  'ORGANIC':           '🌿 Organic',
  'CHEMICAL_FREE':     '🔬 Chemical-free',
  'CERTIFIED_ORGANIC': '🏷️ Certified Organic',
  'CONVENTIONAL':      '⚗️ Conventional',
};

const DELIVERY_LABELS = {
  'SELF':   '🚚 Self Delivery',
  'PICKUP': '🏪 Farm Pickup',
  'BOTH':   '🤝 Both',
};

export default function ListProductPage() {
  const { showToast } = useToast();
  const navigate      = useNavigate();
  const [form, setForm]     = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handlePublish() {
    // Basic validation
    if (!form.name.trim())        { setError('Crop name is required.');     return; }
    if (!form.price || form.price <= 0) { setError('Price must be positive.'); return; }
    if (!form.quantity || form.quantity <= 0) { setError('Quantity must be positive.'); return; }
    if (!form.harvestDate)        { setError('Harvest date is required.');  return; }
    if (!form.location.trim())    { setError('Location is required.');     return; }

    setError('');
    setLoading(true);

    try {
      await createProduct({
        name:          form.name.trim(),
        category:      form.category,
        pricePerKg:    Number(form.price),
        quantityKg:    Number(form.quantity),
        harvestDate:   form.harvestDate,
        location:      form.location.trim(),
        district:      form.location.trim(),
        description:   form.description.trim() || null,
        certification: form.certification,
        delivery:      form.delivery,
        isOrganic:     form.certification === 'ORGANIC' || form.certification === 'CERTIFIED_ORGANIC',
        images:        [],
      });

      showToast('✅ Listing published successfully!');
      setForm(INITIAL);
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message);
      showToast('❌ Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  }

  function handleDraft() {
    showToast('💾 Draft saved locally!');
  }

  return (
    <div className="listing-section">
      <div className="form-card">
        <div className="form-title">📋 Add New Produce Listing</div>
        <div className="form-sub">
          Fill in the details below to list your harvest on FarmDirect.
        </div>

        {error && <div className="auth-error-banner" style={{ marginBottom: '1rem' }}>⚠️ {error}</div>}

        <div className="form-grid">
          {/* Crop name */}
          <div className="form-group">
            <label htmlFor="lp-name">CROP NAME</label>
            <input
              id="lp-name"
              type="text"
              className="form-input"
              placeholder="e.g. Tomatoes, Ragi, Spinach"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="lp-cat">CATEGORY</label>
            <select
              id="lp-cat"
              className="form-select"
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              disabled={loading}
            >
              <option value="VEG">🥬 Vegetables</option>
              <option value="FRUIT">🍅 Fruits</option>
              <option value="GRAIN">🌾 Grains &amp; Pulses</option>
              <option value="HERB">🌿 Herbs &amp; Spices</option>
              <option value="DAIRY">🥛 Dairy</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="lp-price">PRICE PER KG (₹)</label>
            <input
              id="lp-price"
              type="number"
              className="form-input"
              placeholder="e.g. 35"
              min="1"
              value={form.price}
              onChange={e => handleChange('price', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label htmlFor="lp-qty">QUANTITY AVAILABLE (KG)</label>
            <input
              id="lp-qty"
              type="number"
              className="form-input"
              placeholder="e.g. 100"
              min="1"
              value={form.quantity}
              onChange={e => handleChange('quantity', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Harvest date */}
          <div className="form-group">
            <label htmlFor="lp-harvest">HARVEST DATE</label>
            <input
              id="lp-harvest"
              type="date"
              className="form-input"
              value={form.harvestDate}
              onChange={e => handleChange('harvestDate', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="lp-loc">LOCATION / DISTRICT</label>
            <input
              id="lp-loc"
              type="text"
              className="form-input"
              placeholder="e.g. Tumkur, Karnataka"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="form-group full">
            <label htmlFor="lp-desc">DESCRIPTION</label>
            <textarea
              id="lp-desc"
              className="form-textarea"
              placeholder="Tell buyers about your produce — variety, growing method, certifications…"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Certification chips */}
          <div className="form-group full">
            <label>CERTIFICATION</label>
            <div className="toggle-row">
              {CERT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`toggle-chip${form.certification === opt ? ' active' : ''}`}
                  onClick={() => handleChange('certification', opt)}
                  disabled={loading}
                >
                  {CERT_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery chips */}
          <div className="form-group full">
            <label>DELIVERY OPTIONS</label>
            <div className="toggle-row">
              {DELIVERY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`toggle-chip${form.delivery === opt ? ' active' : ''}`}
                  onClick={() => handleChange('delivery', opt)}
                  disabled={loading}
                >
                  {DELIVERY_LABELS[opt]}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div className="form-group full">
            <label>PRODUCT IMAGES</label>
            {/* TODO: wire to S3 pre-signed upload endpoint */}
            <div className="img-upload" role="button" tabIndex={0}>
              <span className="img-upload-icon">📷</span>
              <div className="img-upload-text">
                Click to upload photos of your produce
                <br />
                <small>JPG, PNG up to 5 MB each · Max 5 images</small>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            className="submit-btn"
            type="button"
            onClick={handlePublish}
            disabled={loading}
          >
            {loading ? 'Publishing…' : 'Publish Listing'}
          </button>
          <button className="save-draft" type="button" onClick={handleDraft} disabled={loading}>
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
