/**
 * src/components/product/ProductCard.jsx
 *
 * Single product listing card.
 * Stateless — receives product data and callback props.
 *
 * Future: replace `emoji` with <img src={product.imageUrl} /> when
 * the backend starts serving image URLs.
 */

import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/**
 * @param {{ product: import('../../data/products').Product }} props
 */
export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const freshnessClass = product.harvest <= 1 ? 'fresh' : 'recent';
  const freshnessLabel =
    product.harvest === 0
      ? '🌟 Just Harvested'
      : product.harvest === 1
      ? '✨ 1 day ago'
      : `📅 ${product.harvest} days ago`;

  function handleAddToCart(e) {
    e.stopPropagation(); // prevent card click bubbling
    addToCart(product);
    showToast(`🛒 ${product.emoji} ${product.name} added to cart!`);
  }

  return (
    <div className="product-card">
      {/* Thumbnail */}
      <div className="product-img" style={{ background: product.bg }}>
        <span className="product-img-emoji">{product.emoji}</span>
        {product.organic && <div className="organic-badge">Organic</div>}
        <div className={`freshness-badge ${freshnessClass}`}>{freshnessLabel}</div>
      </div>

      {/* Details */}
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-farmer">
          by <a href="#">{product.farmer}</a> · {product.loc}
        </div>

        <div className="rating-row">
          <span className="stars">{'⭐'.repeat(Math.round(product.rating))}</span>
          <span className="rating-count">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="product-meta">
          <div className="product-price">
            ₹{product.price} <span>/ kg</span>
          </div>
          <div className="product-loc">
            {product.delivery ? '🚚 Delivery' : '🏪 Pickup'}
          </div>
        </div>

        <div className="product-avail">📦 {product.qty} available</div>
      </div>

      {/* Actions */}
      <div className="product-footer">
        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="wishlist-btn" aria-label="Save to wishlist">♡</button>
      </div>
    </div>
  );
}
