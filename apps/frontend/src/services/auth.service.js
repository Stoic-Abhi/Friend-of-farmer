// src/services/auth.service.js
// Convention: functions return r.data.data (inner payload) where there is one,
// or r.data (full response body) for actions where the caller needs ok/message.
import api from './api.js';

// Returns full response body { ok, message, data } — callers may need message
export const signup     = (d) => api.post('/auth/signup',      d).then(r => r.data);
export const login      = (d) => api.post('/auth/login',       d).then(r => r.data);
export const requestOtp = (d) => api.post('/auth/request-otp', d).then(r => r.data);
export const verifyOtp  = (d) => api.post('/auth/verify-otp',  d).then(r => r.data);
export const selectRole = (d) => api.post('/auth/select-role', d).then(r => r.data);
export const logout     = ()  => api.post('/auth/logout').then(r => r.data);

// Returns the user object directly { id, email, phone, role, isVerified, createdAt }
export const getMe = () => api.get('/auth/me').then(r => r.data.data);
