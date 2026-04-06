import { useCart } from "../../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  // ✅ MUST BE INSIDE FUNCTION
  const { cart, increaseQty, decreaseQty } = useCart();

  const items = Object.values(cart);

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <div className={`cart-panel ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div className="cart-title">🛒 Your Cart</div>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id}>
              <span>{item.name}</span>

              <div>
                <button onClick={() => decreaseQty(item.id)}>-</button>
                {item.count}
                <button onClick={() => increaseQty(item.id)}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}