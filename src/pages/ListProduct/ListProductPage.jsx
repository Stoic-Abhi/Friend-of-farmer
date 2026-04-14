export default function ListProductPage() {
  return (
    <div className="listing-section">
      <div className="form-card">
        <div className="form-title">📋 Add New Produce Listing</div>
        <div className="form-sub">
          Fill in the details below to list your harvest on FarmDirect.
        </div>

        <form className="form-grid">
          {/* Crop Name */}
          <div className="form-group">
            <label>CROP NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tomatoes, Ragi"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label>CATEGORY</label>
            <select className="form-select">
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Grains</option>
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>PRICE PER KG (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 35"
            />
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>QUANTITY AVAILABLE (KG)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 100"
            />
          </div>

          {/* Harvest Date */}
          <div className="form-group">
            <label>HARVEST DATE</label>
            <input type="date" className="form-input" />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>LOCATION / DISTRICT</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tumkur"
            />
          </div>

          {/* Description */}
          <div className="form-group full">
            <label>DESCRIPTION</label>
            <textarea
              className="form-textarea"
              placeholder="Tell buyers about your produce..."
            />
          </div>

          {/* Buttons */}
          <div className="form-actions">
            <button className="submit-btn" type="submit">
              Publish Listing
            </button>

            <button className="save-draft" type="button">
              Save Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}