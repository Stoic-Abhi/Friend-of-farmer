/**
 * src/context/CartContext.jsx
 *
 * Global cart state via React Context + useReducer.
 *
 * checkout(deliveryAddress) maps cart items → POST /orders
 * and clears the cart on success.
 */

import { createContext, useContext, useReducer, useCallback } from 'react';
import { placeOrder } from '../services/orders.service.js';

const DELIVERY_FEE = 30;

/* ── Shape ────────────────────────────────── */
/**
 * @typedef {Object} CartItem
 * @property {string} id          - product UUID
 * @property {string} name
 * @property {string} emoji
 * @property {string} farmer
 * @property {number} pricePerKg
 * @property {number} count       - quantity in kg
 */

const initialState = {
  /** @type {Object.<string, CartItem>} */
  items: {},
};

/* ── Reducer ──────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product } = action;
      const existing = state.items[product.id];
      return {
        ...state,
        items: {
          ...state.items,
          [product.id]: {
            id:         product.id,
            name:       product.name,
            emoji:      product.emoji,
            farmer:     product.farmer,
            pricePerKg: product.pricePerKg ?? product.price,
            price:      product.pricePerKg ?? product.price,
            count:      (existing?.count ?? 0) + 1,
          },
        },
      };
    }

    case 'CHANGE_QTY': {
      const { id, delta } = action;
      const current = state.items[id];
      if (!current) return state;
      const newCount = Math.max(0, current.count + delta);
      if (newCount === 0) {
        const { [id]: _, ...rest } = state.items;
        return { ...state, items: rest };
      }
      return {
        ...state,
        items: { ...state.items, [id]: { ...current, count: newCount } },
      };
    }

    case 'REMOVE': {
      const { [action.id]: _, ...rest } = state.items;
      return { ...state, items: rest };
    }

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
}

/* ── Context ──────────────────────────────── */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const cartItems  = Object.values(state.items).filter(i => i.count > 0);
  const totalCount = cartItems.reduce((sum, i) => sum + i.count, 0);
  const subtotal   = cartItems.reduce((sum, i) => sum + (i.pricePerKg ?? i.price) * i.count, 0);
  const total      = subtotal + (cartItems.length ? DELIVERY_FEE : 0);

  const addToCart  = useCallback((product) => dispatch({ type: 'ADD', product }), []);
  const changeQty  = useCallback((id, delta) => dispatch({ type: 'CHANGE_QTY', id, delta }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);

  /**
   * Place order via POST /orders.
   * Maps cart items to { productId, quantityKg } and sends deliveryAddress.
   * @param {string} deliveryAddress
   * @returns {{ success: boolean, order?: object, error?: string }}
   */
  const checkout = useCallback(async (deliveryAddress = '') => {
    try {
      const items = cartItems.map(item => ({
        productId:  item.id,
        quantityKg: item.count,
      }));

      const order = await placeOrder({ items, deliveryAddress });
      dispatch({ type: 'CLEAR' });
      return { success: true, order };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{ cartItems, totalCount, subtotal, total, deliveryFee: DELIVERY_FEE,
               addToCart, changeQty, removeItem, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}