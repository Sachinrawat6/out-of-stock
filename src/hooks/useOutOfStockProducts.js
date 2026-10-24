import usePaginatedProducts from './usePaginatedProducts';

export default function useOutOfStockProducts(limit) {
  return usePaginatedProducts('/out-of-stocks', { limit, dedupe: true });
}
