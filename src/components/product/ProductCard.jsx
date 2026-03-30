import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <div className="product-img" style={{ background: product.bg }}>
        <span style={{ fontSize: "4rem" }}>{product.emoji}</span>
      </div>

      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-price">₹{product.price}</div>
      </div>

      <div className="product-footer">
        <button
          className="add-cart-btn"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}