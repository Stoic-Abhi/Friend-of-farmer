/**
 * src/components/cart/CartDrawer.jsx
 *
 * Slide-in cart panel with overlay.
 *
 * Future backend wiring: the `handleCheckout` function calls
 * CartContext.checkout() which will POST to /api/orders.
 */

import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

/**
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, subtotal, total, deliveryFee, changeQty, checkout } = useCart();
  const { showToast } = useToast();

  async function handleCheckout() {
    const result = await checkout();
    if (result.success) {
      onClose();
      showToast('🎉 Order placed! Farmer will confirm shortly.');
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside className={`cart-panel${isOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">🛒 Your Cart</div>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty">
              <span className="empty-icon">🛒</span>
              Cart is empty.<br />Browse fresh produce above!
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-emoji">{item.emoji}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-farmer">{item.farmer}</div>
                  <div className="cart-item-qty">
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="qty-num">{item.count} kg</span>
                    <button
                      className="qty-btn"
                      onClick={() => changeQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">₹{item.price * item.count}</div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Subtotal</span>
              <span className="cart-total-val">₹{subtotal}</span>
            </div>
            <div className="cart-total-row">
              <span className="cart-total-label">Delivery</span>
              <span className="cart-total-val">₹{deliveryFee}</span>
            </div>
            <hr className="cart-divider" />
            <div className="cart-total-row">
              <span className="cart-total-label" style={{ fontWeight: 700 }}>Total</span>
              <span className="cart-total-val cart-grand">₹{total}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              ✅ Place Order · COD
            </button>
            <p className="cod-tag">
              Cash on Delivery · <span>No advance payment needed</span>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
