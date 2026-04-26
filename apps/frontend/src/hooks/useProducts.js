// src/hooks/useProducts.js
import { useCallback, useEffect, useState } from 'react';
import { getProducts } from '../services/products.service.js';

export function useProducts(filters = {}) {
  const [products,  setProducts]  = useState([]);
  const [total,     setTotal]     = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // getProducts returns { total, page, limit, products } directly
      const res = await getProducts(filters);
      setProducts(res?.products ?? []);
      setTotal(res?.total ?? 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, total, isLoading, error, refetch: fetch };
}
