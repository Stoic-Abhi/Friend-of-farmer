import { Routes, Route } from "react-router-dom";
import BrowsePage from "./pages/Browse/BrowsePage";
import FarmerDashboardPage from "./pages/FarmerDashboard/FarmerDashboardPage";
import ConsumerDashboardPage from "./pages/ConsumerDashboard/ConsumerDashboardPage";
import ListProductPage from "./pages/ListProduct/ListProductPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BrowsePage />} />
      <Route path="/farmer" element={<FarmerDashboardPage />} />
      <Route path="/orders" element={<ConsumerDashboardPage />} />
      <Route path="/list" element={<ListProductPage />} />
    </Routes>
  );
}