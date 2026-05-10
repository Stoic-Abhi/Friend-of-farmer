/**
 * src/pages/Browse/BrowsePage.jsx
 *
 * Consumer-facing marketplace page.
 * Owns filter/sort/search state and derives the filtered product list.
 *
 * Uses the useProducts hook to fetch from GET /products?...
 * Falls back to static PRODUCTS seed data if the API is unavailable.
 */

import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts.js';
import { PRODUCTS }    from '../../data/products';
import Hero           from '../../components/common/Hero';
import SectionHeader  from '../../components/common/SectionHeader';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid    from '../../components/product/ProductGrid';

export default function BrowsePage() {
  const navigate       = useNavigate();
  const marketplaceRef = useRef(null);

  /* ── Filter / sort state ── */
  const [query,        setQuery]        = useState('');
  const [location,     setLocation]     = useState('');
  const [sort,         setSort]         = useState('fresh');
  const [activeFilter, setActiveFilter] = useState('all');

  /* ── Build API filter params ── */
  const apiFilters = useMemo(() => {
    const params = {};
    if (query)    params.search   = query;
    if (location) params.district = location;
    if (sort)     params.sort     = sort;
    if (activeFilter === 'organic')              params.isOrganic = 'true';
    if (['veg', 'fruit', 'grain', 'herb', 'dairy'].includes(activeFilter)) params.category = activeFilter;
    return params;
  }, [query, location, sort, activeFilter]);

  /* ── Fetch from API (with seed fallback) ── */
  const { products: apiProducts, isLoading, error } = useProducts(apiFilters);

  // If API failed or returned empty, fall back to seed data with client-side filtering
  const products = useMemo(() => {
    if (apiProducts.length > 0) return apiProducts;
    if (isLoading) return [];
    if (error) {
      // Client-side filtering of seed data as fallback
      let list = PRODUCTS.filter(p => {
        const q = query.toLowerCase();
        if (q && !p.name.toLowerCase().includes(q) && !p.farmer.toLowerCase().includes(q)) return false;
        if (location && p.loc !== location) return false;
        if (activeFilter === 'organic'  && !p.organic)   return false;
        if (activeFilter === 'delivery' && !p.delivery)  return false;
        if (activeFilter === 'pickup'   &&  p.delivery)  return false;
        if (['veg', 'fruit', 'grain'].includes(activeFilter) && p.cat !== activeFilter) return false;
        return true;
      });

      if (sort === 'fresh')      list = [...list].sort((a, b) => a.harvest - b.harvest);
      if (sort === 'price-asc')  list = [...list].sort((a, b) => a.price   - b.price);
      if (sort === 'price-desc') list = [...list].sort((a, b) => b.price   - a.price);
      if (sort === 'rating')     list = [...list].sort((a, b) => b.rating  - a.rating);
      return list;
    }
    return [];
  }, [apiProducts, isLoading, error, query, location, sort, activeFilter]);

  function scrollToMarketplace() {
    marketplaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Hero
        onShopNow={scrollToMarketplace}
        onSellHarvest={() => navigate('/list-product')}
      />

      <section className="section" ref={marketplaceRef}>
        <SectionHeader
          tag="Marketplace"
          titleHtml="Today's <em>Fresh Listings</em>"
        />

        <ProductFilters
          query={query}
          location={location}
          sort={sort}
          activeFilter={activeFilter}
          onQueryChange={setQuery}
          onLocationChange={setLocation}
          onSortChange={setSort}
          onFilterChange={setActiveFilter}
        />

        <ProductGrid products={products} isLoading={isLoading} />
      </section>
    </>
  );
}
