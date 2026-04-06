import { useState } from "react";
import Navbar from "./components/layout/Navbar";
import RoleTabs from "./components/layout/RoleTabs";
import BrowsePage from "./pages/Browse/BrowsePage";
import CartDrawer from "./components/cart/CartDrawer";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <RoleTabs />
      <BrowsePage />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}