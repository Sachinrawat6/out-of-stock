import usePaginatedProducts from './usePaginatedProducts';

export default function useActiveProducts(limit) {
  return usePaginatedProducts('/active-products', { limit });
}
