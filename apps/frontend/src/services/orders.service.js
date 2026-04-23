// src/services/orders.service.js
import api from './api.js';

export const placeOrder        = (data)       => api.post('/orders', data).then(r => r.data.data);
export const myOrders          = ()           => api.get('/orders/mine').then(r => r.data.data);
export const getOrder          = (id)         => api.get(`/orders/${id}`).then(r => r.data.data);
export const farmerOrders      = ()           => api.get('/orders/incoming').then(r => r.data.data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status }).then(r => r.data.data);
