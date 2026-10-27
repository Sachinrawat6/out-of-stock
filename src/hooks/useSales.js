import { useState, useCallback } from 'react';
import { SALES_URL } from '../constants/config';

// Small helper: calls the API and throws an Error with the server message if it fails
const request = async (path = '', options = {}) => {
  const response = await fetch(`${SALES_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
};

const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Runs an API call and handles loading and error state in one place
  const run = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError('');
      return await apiCall();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      throw err; // lets the component show its own message if it wants
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /api/v1/sales
  // sortBy: 'netSales' | 'totalSales' | 'netAmount', order: 'desc' | 'asc'
  const fetchSales = useCallback(
    ({ sortBy = 'netSales', order = 'desc' } = {}) =>
      run(async () => {
        const data = await request(`?sortBy=${sortBy}&order=${order}`);
        setSales(data);
        return data;
      }),
    [run]
  );

  // GET /api/v1/sales/:styleNumber
  const fetchSaleByStyle = useCallback(
    (styleNumber) => run(() => request(`/${styleNumber}`)),
    [run]
  );

  // POST /api/v1/sales/import (replaces all existing data)
  const importSales = useCallback(
    (payload) => run(() => request('/import', { method: 'POST', body: JSON.stringify(payload) })),
    [run]
  );

  return { sales, loading, error, fetchSales, fetchSaleByStyle, importSales };
};

export default useSales;
