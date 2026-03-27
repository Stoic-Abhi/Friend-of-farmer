import { useState } from "react";
import { products as initialProducts } from "../../data/products";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilters from "../../components/product/ProductFilters";
import Hero from "../../components/common/Hero";
import SectionHeader from "../../components/common/SectionHeader";

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("fresh");

  const filteredProducts = initialProducts
    .filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase())
      ) return false;

      if (location && p.loc !== location) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return a.harvest - b.harvest;
    });

  return (
    <>
      <Hero />

      <div className="section">
        <SectionHeader
          tag="Marketplace"
          title="Today's Fresh Listings"
        />

        <ProductFilters
          search={search}
          setSearch={setSearch}
          location={location}
          setLocation={setLocation}
          sort={sort}
          setSort={setSort}
        />

        <ProductGrid products={filteredProducts} />
      </div>
    </>
  );
}