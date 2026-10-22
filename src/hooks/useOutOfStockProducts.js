import { useCallback, useEffect, useState } from 'react';
import { API_URL } from '../constants/config';
import { uniqueByStyle } from '../utils/product';

export default function useOutOfStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'API error');

      setProducts(uniqueByStyle(json.data.data));
    } catch (err) {
      setError(err.message || 'Products not loaded');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, reload: loadProducts };
}
