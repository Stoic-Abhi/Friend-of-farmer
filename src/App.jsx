import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import RoleTabs from "./components/layout/RoleTabs";
import CartDrawer from "./components/cart/CartDrawer";
import AppRoutes from "./routes";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <RoleTabs />

      <AppRoutes />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}