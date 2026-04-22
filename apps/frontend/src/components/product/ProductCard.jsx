/**
 * src/components/product/ProductCard.jsx
 *
 * Single product listing card.
 * Stateless — receives product data and callback props.
 *
 * Future: replace `emoji` with <img src={product.imageUrl} /> when
 * the backend starts serving image URLs.
 */

import { useNavigate } from 'react-router-dom';
import { useCart }     from '../../context/CartContext.jsx';
import { useToast }    from '../../context/ToastContext.jsx';
import { useAuth }     from '../../context/AuthContext.jsx';

const CATEGORY_EMOJI = { VEG:'🥬', FRUIT:'🍅', GRAIN:'🌾', HERB:'🌿', DAIRY:'🥛' };
const CAT_BG         = { VEG:'#f0f8ee', FRUIT:'#fff0ee', GRAIN:'#fdf8ee', HERB:'#f5fbf5', DAIRY:'#f0f4ff' };

function freshnessLabel(days) {
  if (days === 0) return '🌟 Just Harvested';
  if (days === 1) return '✨ 1 day ago';
  return `📅 ${days} days ago`;
}

export default function ProductCard({ product }) {
  const { addToCart }  = useCart();
  const { showToast }  = useToast();
  const { user }       = useAuth();
  const navigate       = useNavigate();

  // Normalise API shape vs seed shape
  const price      = product.pricePerKg  ?? product.price;
  const days       = product.harvestDays ?? product.harvest ?? 0;
  const rating     = product.avgRating   ?? product.rating;
  const reviews    = product.reviewCount ?? product.reviews;
  const isOrganic  = product.isOrganic   ?? product.organic;
  const hasDelivery= product.delivery === 'SELF' || product.delivery === 'BOTH' || product.delivery === true;
  const catKey     = (product.category ?? 'VEG').toUpperCase();
  const emoji      = CATEGORY_EMOJI[catKey] ?? '🌾';
  const bg         = product.bg ?? CAT_BG[catKey] ?? '#fdf8ee';
  const farmerName = product.farmer?.email ?? product.farmer ?? '';
  const location   = product.district ?? product.loc ?? '';

  function handleAddToCart(e) {
    e.stopPropagation();
    if (user?.role === 'FARMER') { showToast('⚠️ Farmers cannot place orders.'); return; }
    addToCart({ ...product, emoji, pricePerKg: price, price });
    showToast(`🛒 ${emoji} ${product.name} added to cart!`);
  }

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-img" style={{ background: bg }}>
        <span className="product-img-emoji">{emoji}</span>
        {isOrganic && <div className="organic-badge">Organic</div>}
        <div className={`freshness-badge ${days <= 1 ? 'fresh' : 'recent'}`}>
          {freshnessLabel(days)}
        </div>
      </div>

      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-farmer">
          by <a onClick={e => { e.stopPropagation(); }}>{farmerName}</a>
          {location && ` · ${location}`}
        </div>
        {rating && (
          <div className="rating-row">
            <span className="stars">{'⭐'.repeat(Math.round(rating))}</span>
            <span className="rating-count">{rating} ({reviews})</span>
          </div>
        )}
        <div className="product-meta">
          <div className="product-price">₹{price} <span>/ kg</span></div>
          <div className="product-loc">{hasDelivery ? '🚚 Delivery' : '🏪 Pickup'}</div>
        </div>
        <div className="product-avail">📦 {product.quantityKg ?? product.qty} kg available</div>
      </div>

      <div className="product-footer">
        <button className="add-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        <button className="wishlist-btn" onClick={e => e.stopPropagation()} aria-label="Save">♡</button>
      </div>
    </div>
  );
}
