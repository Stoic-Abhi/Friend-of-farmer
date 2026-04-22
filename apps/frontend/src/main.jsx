/**
 * src/main.jsx
 *
 * React application entry point.
 * Mounts <App> into #root and imports global styles.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
