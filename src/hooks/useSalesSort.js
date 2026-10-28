import { useEffect, useMemo, useState } from 'react';
import useSales from './useSales';
import useRackSpace from './useRackSpace';
import { METRICS } from '../utils/salesMetrics';

// Fetches sales and rack space data once, then sorts a list of products by one or more fields.
// Use it in the page (not in the list), so it works together with pagination.
export default function useSalesSort(products) {
  // [{ key: 'totalSales', order: 'desc' }, ...]  (empty = original order)
  const [sorts, setSorts] = useState([]);

  const { sales, fetchSales } = useSales();
  const { rackSpaces, fetchRackSpaces } = useRackSpace();

  useEffect(() => {
    fetchSales().catch(() => {});
    fetchRackSpaces().catch(() => {});
  }, [fetchSales, fetchRackSpaces]);

  // { 12668: {...doc}, 19690: {...}, ... }
  const salesByStyle = useMemo(
    () => Object.fromEntries(sales.map((s) => [s.styleNumber, s])),
    [sales]
  );
  const rackByStyle = useMemo(
    () => Object.fromEntries(rackSpaces.map((r) => [r.styleNumber, r])),
    [rackSpaces]
  );

  const sortedProducts = useMemo(() => {
    // Ignore unknown keys
    const activeSorts = sorts.filter((sort) => METRICS[sort.key]);
    if (activeSorts.length === 0) return products;

    const getValue = (product, key) => {
      const styleNumber = Number(product.styleNumber);
      return METRICS[key]({
        product,
        sales: salesByStyle[styleNumber],
        racks: rackByStyle[styleNumber],
      });
    };

    return [...products].sort((a, b) => {
      // Go through the sorts in priority order. The next one is used only when values are equal.
      for (const { key, order } of activeSorts) {
        const valueA = getValue(a, key);
        const valueB = getValue(b, key);

        // Products without data always stay after the others
        if (valueA == null && valueB == null) continue;
        if (valueA == null) return 1;
        if (valueB == null) return -1;

        if (valueA !== valueB) {
          return (valueA - valueB) * (order === 'asc' ? 1 : -1);
        }
      }
      return 0;
    });
  }, [products, salesByStyle, rackByStyle, sorts]);

  // Sorting needs every page of products to be loaded
  const needsAllProducts = sorts.length > 0;

  // Everything SalesSortFilter needs: <SalesSortFilter {...filterProps} />
  const filterProps = { sorts, onSortsChange: setSorts };

  return {
    salesByStyle,
    rackByStyle,
    sortedProducts,
    needsAllProducts,
    filterProps,
    sorts,
    setSorts,
  };
}
