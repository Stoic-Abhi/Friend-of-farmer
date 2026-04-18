export default function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <div className="product-img" style={{ background: product.bg }}>
        <span>{product.emoji}</span>

        {product.organic && (
          <div className="organic-badge">Organic</div>
        )}

        <div className="freshness-badge">
          {product.harvest === 0
            ? "🌟 Just Harvested"
            : `📅 ${product.harvest} days ago`}
        </div>
      </div>

      <div className="product-body">
        <div className="product-name">{product.name}</div>

        <div className="product-farmer">
          by {product.farmer} · {product.loc}
        </div>

        <div className="rating-row">
          ⭐ {product.rating} ({product.reviews})
        </div>

        <div className="product-meta">
          <div className="product-price">
            ₹{product.price} <span>/kg</span>
          </div>

          <div className="product-loc">
            {product.delivery ? "🚚 Delivery" : "🏪 Pickup"}
          </div>
        </div>
      </div>

      <div className="product-footer">
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}