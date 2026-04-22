/**
 * src/context/CartContext.jsx
 *
 * Global cart state via React Context + useReducer.
 *
 * Future backend wiring points (marked TODO):
 *   - POST /api/orders  on checkout
 *   - GET  /api/cart/:userId  to hydrate cart on login
 */

import { createContext, useContext, useReducer, useCallback } from 'react';
import { DELIVERY_FEE } from '../data/products';

/* ── Shape ────────────────────────────────── */
/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} name
 * @property {string} emoji
 * @property {string} farmer
 * @property {number} price
 * @property {number} count
 */

const initialState = {
  /** @type {Object.<number, CartItem>} */
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
            id:     product.id,
            name:   product.name,
            emoji:  product.emoji,
            farmer: product.farmer,
            price:  product.price,
            count:  (existing?.count ?? 0) + 1,
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
  const subtotal   = cartItems.reduce((sum, i) => sum + i.price * i.count, 0);
  const total      = subtotal + (cartItems.length ? DELIVERY_FEE : 0);

  const addToCart  = useCallback((product) => dispatch({ type: 'ADD', product }), []);
  const changeQty  = useCallback((id, delta) => dispatch({ type: 'CHANGE_QTY', id, delta }), []);
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);

  /**
   * TODO: replace with → await api.post('/orders', { items: cartItems, paymentMethod: 'COD' })
   */
  const checkout = useCallback(async () => {
    await new Promise(r => setTimeout(r, 600));
    dispatch({ type: 'CLEAR' });
    return { success: true };
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