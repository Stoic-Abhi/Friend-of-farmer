// src/services/profile.service.js
import api from './api.js';

export const getMyProfile      = ()       => api.get('/profile/me').then(r => r.data.data);
export const updateProfile     = (data)   => api.patch('/profile/me', data).then(r => r.data.data);
export const updateGeolocation = (coords) => api.patch('/profile/geolocation', coords).then(r => r.data.data);
export const getPublicProfile  = (id)     => api.get(`/profile/${id}`).then(r => r.data.data);

export const getMyCerts        = ()       => api.get('/profile/certifications').then(r => r.data.data);
export const addCertification  = (data)   => api.post('/profile/certifications', data).then(r => r.data.data);
export const updateCert        = (id, d)  => api.patch(`/profile/certifications/${id}`, d).then(r => r.data.data);
export const deleteCert        = (id)     => api.delete(`/profile/certifications/${id}`).then(r => r.data.data);
