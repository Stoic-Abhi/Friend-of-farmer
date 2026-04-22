/**
 * src/data/products.js
 *
 * Static seed data — mirrors the shape that the backend API will return.
 * When you wire up the real API, replace this with a fetch/axios call
 * inside a custom hook (e.g. src/hooks/useProducts.js) and keep the
 * same object shape so every consumer component stays untouched.
 *
 * Future: GET /api/products  →  returns Product[]
 *
 * @typedef {Object} Product
 * @property {number}  id        - Unique identifier
 * @property {string}  name      - Crop display name
 * @property {string}  emoji     - Emoji thumbnail (replace with imageUrl in prod)
 * @property {string}  farmer    - Farmer's display name
 * @property {number}  farmerId  - FK → farmers table
 * @property {string}  loc       - District / city
 * @property {number}  price     - Price per kg in INR
 * @property {string}  qty       - Human-readable quantity string
 * @property {number}  harvest   - Days since harvest (0 = today)
 * @property {boolean} organic   - Organic certified flag
 * @property {boolean} delivery  - Self-delivery available flag
 * @property {string}  cat       - Category: 'veg' | 'fruit' | 'grain'
 * @property {number}  rating    - Average star rating (1–5)
 * @property {number}  reviews   - Total review count
 * @property {string}  bg        - Card background tint (cosmetic; remove in prod)
 */

export const PRODUCTS = [
  {
    id: 1, name: 'Tomatoes',  emoji: '🍅', farmer: 'Raju Gowda',   farmerId: 101,
    loc: 'Tumkur',            price: 28,  qty: '150 kg', harvest: 1,
    organic: true,  delivery: true,  cat: 'veg',   rating: 4.9, reviews: 89,  bg: '#fff0ee',
  },
  {
    id: 2, name: 'Spinach',   emoji: '🥬', farmer: 'Kavitha Devi',  farmerId: 102,
    loc: 'Hassan',            price: 45,  qty: '50 kg',  harvest: 0,
    organic: true,  delivery: true,  cat: 'veg',   rating: 4.8, reviews: 64,  bg: '#f0f8ee',
  },
  {
    id: 3, name: 'Ragi',      emoji: '🌾', farmer: 'Murali Raj',    farmerId: 103,
    loc: 'Kolar',             price: 52,  qty: '200 kg', harvest: 3,
    organic: false, delivery: false, cat: 'grain', rating: 4.5, reviews: 42,  bg: '#fdf8ee',
  },
  {
    id: 4, name: 'Bananas',   emoji: '🍌', farmer: 'Lakshmi Bai',   farmerId: 104,
    loc: 'Mysuru',            price: 35,  qty: '80 kg',  harvest: 1,
    organic: true,  delivery: true,  cat: 'fruit', rating: 4.7, reviews: 71,  bg: '#fffbee',
  },
  {
    id: 5, name: 'Broccoli',  emoji: '🥦', farmer: 'Suresh Kumar',  farmerId: 105,
    loc: 'Chikkaballapur',    price: 80,  qty: '30 kg',  harvest: 2,
    organic: true,  delivery: false, cat: 'veg',   rating: 4.6, reviews: 33,  bg: '#f0faf0',
  },
  {
    id: 6, name: 'Onions',    emoji: '🧅', farmer: 'Raju Gowda',    farmerId: 101,
    loc: 'Tumkur',            price: 22,  qty: '300 kg', harvest: 4,
    organic: false, delivery: true,  cat: 'veg',   rating: 4.9, reviews: 89,  bg: '#faf0f8',
  },
  {
    id: 7, name: 'Mangoes',   emoji: '🥭', farmer: 'Anand Rao',     farmerId: 106,
    loc: 'Bengaluru Rural',   price: 120, qty: '60 kg',  harvest: 1,
    organic: true,  delivery: true,  cat: 'fruit', rating: 4.9, reviews: 112, bg: '#fff8ee',
  },
  {
    id: 8, name: 'Toor Dal',  emoji: '🫘', farmer: 'Kavitha Devi',  farmerId: 102,
    loc: 'Hassan',            price: 95,  qty: '120 kg', harvest: 6,
    organic: false, delivery: false, cat: 'grain', rating: 4.8, reviews: 64,  bg: '#fef4ee',
  },
];

/** Unique district options derived from data (mirrors a /api/locations endpoint) */
export const LOCATIONS = [...new Set(PRODUCTS.map(p => p.loc))].sort();

/** Category pill config */
export const CATEGORIES = [
  { key: 'all',    label: 'All' },
  { key: 'organic', label: '🌿 Organic' },
  { key: 'delivery',label: '🚚 Delivery' },
  { key: 'pickup',  label: '🏪 Pickup' },
  { key: 'veg',     label: '🥬 Vegetables' },
  { key: 'fruit',   label: '🍅 Fruits' },
  { key: 'grain',   label: '🌾 Grains' },
];

/** Sort options */
export const SORT_OPTIONS = [
  { value: 'fresh',      label: '↑ Freshest First' },
  { value: 'price-asc',  label: '₹ Price: Low–High' },
  { value: 'price-desc', label: '₹ Price: High–Low' },
  { value: 'rating',     label: '⭐ Top Rated' },
];

/** Delivery fee constant — move to backend config later */
export const DELIVERY_FEE = 30;
