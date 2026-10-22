import { useMemo, useState } from 'react';

// search + status filter
export default function useProductFilters(products) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return products.filter((p) => {
      const matchSearch =
        !q || p.title.toLowerCase().includes(q) || p.styleNumber.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  return { filtered, search, setSearch, statusFilter, setStatusFilter };
}
