// src/hooks/useFarmerStats.js
import { useEffect, useState } from 'react';
import { farmerStats } from '../services/products.service.js';

export function useFarmerStats() {
  const [stats,     setStats]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    farmerStats()
      // farmerStats() returns { totalOrders, totalEarningsRs, activeListings, avgRating, reviewCount }
      .then(res  => setStats(res))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { stats, isLoading, error };
}
