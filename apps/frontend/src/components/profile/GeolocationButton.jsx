/**
 * src/components/profile/GeolocationButton.jsx
 *
 * Requests browser location, reverse-geocodes via Nominatim,
 * and reports back { latitude, longitude, accuracy, district, state }.
 */

import { useGeolocation } from '../../hooks/useGeolocation.js';
import { useState } from 'react';

export default function GeolocationButton({ onLocation, disabled }) {
  const geo = useGeolocation();
  const [reverseLoading, setReverseLoading] = useState(false);
  const [captured, setCaptured]     = useState(false);

  async function handleClick() {
    geo.request();
  }

  // Watch for successful geo capture
  if (geo.latitude && !captured && !reverseLoading) {
    setReverseLoading(true);
    setCaptured(true);

    // Reverse geocode via Nominatim (free, no API key)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${geo.latitude}&lon=${geo.longitude}&format=json&accept-language=en`)
      .then(r => r.json())
      .then(data => {
        const address = data.address ?? {};
        onLocation({
          latitude:  geo.latitude,
          longitude: geo.longitude,
          accuracy:  geo.accuracy,
          district:  address.county || address.state_district || address.city || '',
          state:     address.state || '',
        });
      })
      .catch(() => {
        // Even if reverse geocode fails, pass raw coords
        onLocation({
          latitude: geo.latitude,
          longitude: geo.longitude,
          accuracy: geo.accuracy,
          district: '',
          state: '',
        });
      })
      .finally(() => setReverseLoading(false));
  }

  const isLoading = geo.loading || reverseLoading;

  return (
    <div className="geo-widget">
      <button
        type="button"
        className="geo-btn"
        onClick={handleClick}
        disabled={disabled || isLoading || captured}
      >
        {isLoading ? '📡 Detecting location…' :
         captured  ? '✅ Location captured'   :
                     '📍 Use My Current Location'}
      </button>

      {geo.error && (
        <div className="geo-error">{geo.error}</div>
      )}

      {captured && geo.latitude && (
        <div className="geo-coords">
          {geo.latitude.toFixed(4)}°N, {geo.longitude.toFixed(4)}°E
          {geo.accuracy && <span className="geo-accuracy"> (±{Math.round(geo.accuracy)}m)</span>}
        </div>
      )}
    </div>
  );
}
