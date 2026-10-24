import usePaginatedProducts from './usePaginatedProducts';

export default function useDraftProducts(limit) {
  return usePaginatedProducts('/draft-products', { limit });
}
