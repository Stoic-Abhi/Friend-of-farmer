// src/services/api.js
// In dev: Vite proxy forwards /auth, /products, /orders, /farmers to localhost:4000.
// In prod: set VITE_API_URL to your deployed API base URL.
import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.message ?? err.message ?? 'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default api;
