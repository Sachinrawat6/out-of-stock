import { useCallback, useEffect, useRef, useState } from 'react';
import { COUNT_ENDPOINTS, fetchCount } from '../utils/fetchCounts';

const INITIAL = {
  active: undefined,
  draft: undefined,
  zeroInventory: undefined,
  outOfStock: undefined,
};

export default function useProductCounts() {
  const [counts, setCounts] = useState(INITIAL);
  const controllerRef = useRef(null);

  const load = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setCounts(INITIAL);

    Object.entries(COUNT_ENDPOINTS).forEach(async ([key, endpoint]) => {
      try {
        const total = await fetchCount(endpoint, controller.signal);
        setCounts((prev) => ({ ...prev, [key]: total }));
      } catch (err) {
        if (err.name === 'AbortError') return;
        setCounts((prev) => ({ ...prev, [key]: null }));
      }
    });
  }, []);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
  }, [load]);

  return { counts, reloadCounts: load };
}
