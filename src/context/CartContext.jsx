import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});

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

  const cartCount = Object.values(cart).reduce(
    (acc, item) => acc + item.count,
    0
  );

  return (
    <CartContext.Provider value={{ cart, addToCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);