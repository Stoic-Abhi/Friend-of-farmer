import Navbar from "./components/layout/Navbar";
import RoleTabs from "./components/layout/RoleTabs";
import BrowsePage from "./pages/Browse/BrowsePage";

export default function App() {
  return (
    <>
      <Navbar />
      <RoleTabs />
      <BrowsePage />
    </>
  );
}