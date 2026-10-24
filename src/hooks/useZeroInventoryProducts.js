import usePaginatedProducts from './usePaginatedProducts';

// backend 'total' ki jagah 'totalZeroInventoryVariants' bhejta hai
export default function useZeroInventoryProducts(limit) {
  return usePaginatedProducts('/zero-inventory', {
    limit,
    // totalKey: 'totalZeroInventoryVariants',
  });
}
