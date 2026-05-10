/**
 * src/components/product/ProductFilters.jsx
 *
 * Search bar + location / sort dropdowns + category pills.
 * Fully controlled — all state lives in BrowsePage.
 */

import { LOCATIONS, CATEGORIES, SORT_OPTIONS } from '../../data/products';

/**
 * @param {{
 *   query:            string,
 *   location:         string,
 *   sort:             string,
 *   activeFilter:     string,
 *   onQueryChange:    (v: string) => void,
 *   onLocationChange: (v: string) => void,
 *   onSortChange:     (v: string) => void,
 *   onFilterChange:   (v: string) => void,
 * }} props
 */
export default function ProductFilters({
  query, location, sort, activeFilter,
  onQueryChange, onLocationChange, onSortChange, onFilterChange,
}) {
  return (
    <div className="filters-wrapper">
      {/* Search + dropdowns row */}
      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search produce or farmer…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="filter-select"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          aria-label="Filter by location"
        >
          <option value="">📍 All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="filter-pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`filter-pill${activeFilter === cat.key ? ' active' : ''}`}
            onClick={() => onFilterChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
