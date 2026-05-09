// src/services/notifications.service.js
import api from './api.js';

export const getNotifications = () => api.get('/notifications').then(r => r.data.data);
export const markRead         = (id) => api.patch(`/notifications/${id}/read`).then(r => r.data.data);
export const markAllRead      = () => api.patch('/notifications/read-all').then(r => r.data.data);
