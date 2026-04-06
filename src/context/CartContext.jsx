import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

  // ✅ Add to cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev[product.id];

      return {
        ...prev,
        [product.id]: {
          ...product,
          count: existing ? existing.count + 1 : 1,
        },
      };
    });
  };

  // ✅ Increase quantity
  const increaseQty = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        count: prev[id].count + 1,
      },
    }));
  };

  // ✅ Decrease quantity
  const decreaseQty = (id) => {
    setCart((prev) => {
      const updated = { ...prev };

      if (updated[id].count === 1) {
        delete updated[id]; // remove item
      } else {
        updated[id].count -= 1;
      }

      return updated;
    });
  };

  // ✅ Total items count
  const cartCount = Object.values(cart).reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        cartCount,
        increaseQty,
        decreaseQty, // ⭐ THIS WAS YOUR CONFUSION
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export const useCart = () => useContext(CartContext);