// src/hooks/useGeolocation.js
// Browser Geolocation API wrapper.

import { useCallback, useState } from 'react';

/**
 * @returns {{
 *   loading:   boolean,
 *   error:     string|null,
 *   latitude:  number|null,
 *   longitude: number|null,
 *   accuracy:  number|null,
 *   request:   () => void,
 * }}
 */
export function useGeolocation() {
  const [state, setState] = useState({
    loading:   false,
    error:     null,
    latitude:  null,
    longitude: null,
    accuracy:  null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported by your browser.' }));
      return;
    }
    setState(s => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          loading:   false,
          error:     null,
          latitude:  coords.latitude,
          longitude: coords.longitude,
          accuracy:  coords.accuracy,
        });
      },
      (err) => {
        const messages = {
          1: 'Location permission denied. Please enter your address manually.',
          2: 'Could not determine your location. Please try again.',
          3: 'Location request timed out.',
        };
        setState({
          loading: false,
          error: messages[err.code] ?? 'Location unavailable.',
          latitude: null, longitude: null, accuracy: null,
        });
      },
      { timeout: 10_000, maximumAge: 60_000, enableHighAccuracy: false }
    );
  }, []);

  return { ...state, request };
}
