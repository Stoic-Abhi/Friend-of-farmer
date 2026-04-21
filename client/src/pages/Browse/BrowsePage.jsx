/**
 * src/pages/Browse/BrowsePage.jsx
 *
 * Consumer-facing marketplace page.
 * Owns filter/sort/search state and derives the filtered product list.
 *
 * Future: replace PRODUCTS import with a `useProducts(filters)` hook
 * that fetches from GET /api/products?loc=&cat=&sort=
 */

import { useState, useMemo, useRef } from 'react';
import { PRODUCTS } from '../../data/products';
import Hero           from '../../components/common/Hero';
import SectionHeader  from '../../components/common/SectionHeader';
import ProductFilters from '../../components/product/ProductFilters';
import ProductGrid    from '../../components/product/ProductGrid';

/**
 * @param {{ onNavigate: (id: string) => void }} props
 */
export default function BrowsePage({ onNavigate }) {
  const marketplaceRef = useRef(null);

  /* ── Filter / sort state ── */
  const [query,        setQuery]        = useState('');
  const [location,     setLocation]     = useState('');
  const [sort,         setSort]         = useState('fresh');
  const [activeFilter, setActiveFilter] = useState('all');

  /* ── Derived product list ── */
  const filteredProducts = useMemo(() => {
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
  }, [query, location, sort, activeFilter]);

  function scrollToMarketplace() {
    marketplaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Hero
        onShopNow={scrollToMarketplace}
        onSellHarvest={() => onNavigate('list-product')}
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

        <ProductGrid products={filteredProducts} />
      </section>
    </>
  );
}
