// src/hooks/useOrders.js
import { useCallback, useEffect, useState } from 'react';
import { myOrders, farmerOrders } from '../services/orders.service.js';

export function useMyOrders() {
  const [orders,    setOrders]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // myOrders returns the array directly
      const res = await myOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { orders, isLoading, error, refetch: fetch };
}

export function useFarmerOrders() {
  const [orders,    setOrders]    = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await farmerOrders();
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { orders, isLoading, error, refetch: fetch };
}
