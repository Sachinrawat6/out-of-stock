import { useCallback, useEffect, useRef, useState } from 'react';
import { API_URL } from '../constants/config';
import { uniqueByStyle } from '../utils/product';

const PAGE_SIZE = 50;

export default function usePaginatedProducts(
  endpoint,
  { limit = PAGE_SIZE, totalKey = 'total', dedupe = true } = {}
) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const cursorRef = useRef(null);
  const busyRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchPage = useCallback(
    async (cursor, isFirst) => {
      if (busyRef.current) return;
      busyRef.current = true;
      const requestId = ++requestIdRef.current;

      isFirst ? setLoading(true) : setLoadingMore(true);
      setError('');

      try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (cursor) params.set('cursor', cursor);

        const res = await fetch(`${API_URL}${endpoint}?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || 'API error');

        if (requestId !== requestIdRef.current) return;

        const { data, hasNextPage: more, nextCursor, [totalKey]: apiTotal } = json.data;

        if (apiTotal !== null && apiTotal !== undefined) setTotal(apiTotal);

        setProducts((prev) => {
          const merged = isFirst ? data : [...prev, ...data];
          return dedupe ? uniqueByStyle(merged) : merged;
        });

        cursorRef.current = nextCursor;
        setHasNextPage(Boolean(more));
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError(err.message || 'Products not loaded');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          busyRef.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [endpoint, limit, totalKey, dedupe]
  );

  const loadProducts = useCallback(() => {
    busyRef.current = false;
    cursorRef.current = null;
    setProducts([]);
    setTotal(0);
    setHasNextPage(false);
    return fetchPage(null, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasNextPage || !cursorRef.current) return;
    return fetchPage(cursorRef.current, false);
  }, [fetchPage, hasNextPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    total,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    reload: loadProducts,
  };
}
