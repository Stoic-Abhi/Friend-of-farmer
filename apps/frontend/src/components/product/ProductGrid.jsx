/**
 * src/components/product/ProductGrid.jsx
 *
 * Renders the responsive grid of ProductCards.
 * Handles the empty state.
 */

import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, isLoading }) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-card" style={{ minHeight: 320 }}>
            <div className="product-img" style={{ background: '#f0ebe5' }} />
            <div className="product-body">
              <div style={{ height: 18, background: '#f0ebe5', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ height: 12, background: '#f5f0eb', borderRadius: 6, width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="product-grid">
        <div className="empty" style={{ gridColumn: '1 / -1' }}>
          <span className="empty-icon">🔍</span>
          No produce found matching your search.
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
