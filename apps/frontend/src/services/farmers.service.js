// src/services/farmers.service.js
import api from './api.js';

export const listFarmers  = (p)  => api.get('/farmers',          { params: p }).then(r => r.data.data);
export const getFarmer    = (id) => api.get(`/farmers/${id}`).then(r => r.data.data);
export const savedFarmers = ()   => api.get('/farmers/saved').then(r => r.data.data);
export const saveFarmer   = (id) => api.post(`/farmers/${id}/save`).then(r => r.data.data);
export const unsaveFarmer = (id) => api.delete(`/farmers/${id}/save`).then(r => r.data.data);
export const getInventory = ()   => api.get('/farmers/inventory').then(r => r.data.data);
