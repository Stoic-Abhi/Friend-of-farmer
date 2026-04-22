/**
 * src/components/product/ProductFilters.jsx
 *
 * Search bar + location / sort dropdowns + category pills.
 * Fully controlled — all state lives in BrowsePage.
 */

import { CATEGORIES, LOCATIONS, SORT_OPTIONS } from '../../data/products';

/**
 * @param {{
 *   query:         string,
 *   location:      string,
 *   sort:          string,
 *   activeFilter:  string,
 *   onQueryChange:    (v: string) => void,
 *   onLocationChange: (v: string) => void,
 *   onSortChange:     (v: string) => void,
 *   onFilterChange:   (key: string) => void,
 * }} props
 */
export default function ProductFilters({
  query,
  location,
  sort,
  activeFilter,
  onQueryChange,
  onLocationChange,
  onSortChange,
  onFilterChange,
}) {
  return (
    <>
      {/* ── Search / dropdowns bar ── */}
      <div className="search-zone">
        <input
          type="text"
          className="search-input"
          placeholder="🔍  Search tomatoes, rice, leafy greens…"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
        />

        <select
          className="filter-select"
          value={location}
          onChange={e => onLocationChange(e.target.value)}
        >
          <option value="">📍 All Locations</option>
          {LOCATIONS.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={e => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Search button is cosmetic here — filtering is live. */}
        <button className="search-btn" type="button">Search</button>
      </div>

      {/* ── Category pills ── */}
      <div className="filter-row">
        <span className="filter-label">Filter:</span>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`pill${activeFilter === cat.key ? ' active' : ''}`}
            onClick={() => onFilterChange(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </>
  );
}
