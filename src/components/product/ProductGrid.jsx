/**
 * src/components/product/ProductGrid.jsx
 *
 * Renders the responsive grid of ProductCards.
 * Handles the empty state.
 */

import ProductCard from './ProductCard';

/**
 * @param {{ products: import('../../data/products').Product[] }} props
 */
export default function ProductGrid({ products }) {
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
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
