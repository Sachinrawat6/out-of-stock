import { useCallback, useEffect, useState } from 'react';
import { FABRIC_STOCK_URL } from '../constants/config';

export default function useFabricStock() {
  const [stocks, setStocks] = useState([]);
  const [stockLoading, setStockLoading] = useState(true);
  const [stockError, setStockError] = useState('');

  const loadStocks = useCallback(async () => {
    setStockLoading(true);
    setStockError('');
    try {
      const res = await fetch(FABRIC_STOCK_URL);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'API error');

      setStocks(json.data);
    } catch (err) {
      setError(err.message || 'Stock not loaded');
    } finally {
      setStockLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  return { stocks, stockLoading, stockError, reloadStock: loadStocks };
}
