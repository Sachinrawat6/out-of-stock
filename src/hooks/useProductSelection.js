import { useCallback, useMemo, useState } from 'react';

export default function useProductSelection(products = []) {
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const toggle = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((visible) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      visible.forEach((p) => next.add(p.id));
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.has(p.id)),
    [products, selectedIds]
  );

  return {
    selectedIds,
    selectedProducts,
    selectedCount: selectedProducts.length,
    toggle,
    selectAll,
    clear,
  };
}
