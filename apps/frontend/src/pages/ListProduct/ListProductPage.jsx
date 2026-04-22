/**
 * src/pages/ListProduct/ListProductPage.jsx
 *
 * Form for farmers to create a new produce listing.
 *
 * Future wiring:
 *   - Replace local state + console.log with POST /api/products
 *   - Add react-hook-form or Formik for validation
 *   - Add image upload to S3/Cloudinary via pre-signed URL
 *   - Wrap in <RequireAuth role="farmer"> guard
 */

import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const INITIAL = {
  name:        '',
  category:    'veg',
  price:       '',
  quantity:    '',
  harvestDate: '',
  location:    '',
  description: '',
  certification: 'organic',
  delivery:    'self',
};

const CERT_OPTIONS     = ['organic', 'chemical-free', 'certified-organic', 'conventional'];
const DELIVERY_OPTIONS = ['self', 'pickup', 'both'];

const CERT_LABELS = {
  'organic':          '🌿 Organic',
  'chemical-free':    '🔬 Chemical-free',
  'certified-organic':'🏷️ Certified Organic',
  'conventional':     '⚗️ Conventional',
};

const DELIVERY_LABELS = {
  'self':   '🚚 Self Delivery',
  'pickup': '🏪 Farm Pickup',
  'both':   '🤝 Both',
};

export default function ListProductPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState(INITIAL);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  /** TODO: replace with API call — POST /api/products */
  function handlePublish() {
    console.info('[ListProductPage] Publishing listing:', form);
    showToast('✅ Listing published successfully!');
    setForm(INITIAL);
  }

  function handleDraft() {
    console.info('[ListProductPage] Saving draft:', form);
    showToast('💾 Draft saved!');
  }

  return (
    <div className="listing-section">
      <div className="form-card">
        <div className="form-title">📋 Add New Produce Listing</div>
        <div className="form-sub">
          Fill in the details below to list your harvest on FarmDirect.
        </div>

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
            >
              <option value="veg">🥬 Vegetables</option>
              <option value="fruit">🍅 Fruits</option>
              <option value="grain">🌾 Grains &amp; Pulses</option>
              <option value="herb">🌿 Herbs &amp; Spices</option>
              <option value="dairy">🥛 Dairy</option>
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
          <button className="submit-btn" type="button" onClick={handlePublish}>
            Publish Listing
          </button>
          <button className="save-draft" type="button" onClick={handleDraft}>
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
