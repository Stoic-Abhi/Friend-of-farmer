// src/services/products.service.js
// All functions return the inner `data` payload directly (unwrapped from { ok, message, data }).
import api from './api.js';

// Returns { total, page, limit, products: [...] }
export const getProducts   = (params) => api.get('/products',      { params }).then(r => r.data.data);
export const getProduct    = (id)     => api.get(`/products/${id}`).then(r => r.data.data);
export const createProduct = (data)   => api.post('/products', data).then(r => r.data.data);
export const updateProduct = (id, d)  => api.patch(`/products/${id}`, d).then(r => r.data.data);
export const deleteProduct = (id)     => api.delete(`/products/${id}`).then(r => r.data.data);
export const myProducts    = ()       => api.get('/products/my').then(r => r.data.data);
export const addReview     = (id, d)  => api.post(`/products/${id}/review`, d).then(r => r.data.data);
// Returns { totalOrders, totalEarningsRs, activeListings, avgRating, reviewCount }
export const farmerStats   = ()       => api.get('/products/stats').then(r => r.data.data);
