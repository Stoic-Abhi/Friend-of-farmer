import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter } from "react-router-dom";  // ✅ ADD THIS
import "./styles/navbar.css";
import "./styles/hero.css";
import "./styles/product.css";
import "./styles/dashboard.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>   {/* ✅ WRAP HERE */}
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);