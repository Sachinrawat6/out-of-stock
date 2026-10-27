import { useEffect, useMemo, useState } from 'react';
import useSales from './useSales';
import { SORT_OPTIONS } from '../components/SalessortFilter';

// Fetches the sales data once and sorts a list of products by it.
// Use it in the page (not in the list), so it works together with pagination.
export default function useSalesSort(products) {
  const [sortBy, setSortBy] = useState(''); // '' = original order
  const [order, setOrder] = useState('desc'); // 'desc' = high to low

  const { sales, fetchSales } = useSales();

  useEffect(() => {
    fetchSales().catch(() => {});
  }, [fetchSales]);

  // { 12668: {...sales doc}, 19690: {...}, ... }
  const salesByStyle = useMemo(
    () => Object.fromEntries(sales.map((s) => [s.styleNumber, s])),
    [sales]
  );

  const sortedProducts = useMemo(() => {
    const field = SORT_OPTIONS.find((option) => option.value === sortBy)?.field;
    if (!field) return products;

    const direction = order === 'asc' ? 1 : -1;
    const getValue = (product) => salesByStyle[Number(product.styleNumber)]?.[field];

    return [...products].sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);

      // Products without sales data always stay at the end
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return 1;
      if (valueB == null) return -1;

      return (valueA - valueB) * direction;
    });
  }, [products, salesByStyle, sortBy, order]);

  return { salesByStyle, sortedProducts, sortBy, setSortBy, order, setOrder };
}
