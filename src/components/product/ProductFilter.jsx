export default function ProductFilters({
  search,
  setSearch,
  location,
  setLocation,
  sort,
  setSort,
}) {
  return (
    <div className="search-zone">
      <input
        className="search-input"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="filter-select"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">All Locations</option>
        <option>Tumkur</option>
        <option>Hassan</option>
      </select>

      <select
        className="filter-select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="fresh">Fresh</option>
        <option value="price-asc">Price Low</option>
        <option value="price-desc">Price High</option>
      </select>
    </div>
  );
}