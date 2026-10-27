import { useCallback, useEffect, useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import ImageModal from './ImageModal';
import useRackSpace from '../hooks/useRackSpace';

// Mobile: 1 card | Tablet: 2 cards | Desktop: 3 cards
// `products` is already sorted by the page. `salesByStyle` comes from useSalesSort.
export default function ProductList({
  products,
  stocks,
  type,
  selectedIds,
  onToggle,
  salesByStyle = {},
}) {
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);

  // Rack space data is fetched here, so no page needs to change
  const { rackSpaces, fetchRackSpaces } = useRackSpace();

  useEffect(() => {
    fetchRackSpaces().catch(() => {});
  }, [fetchRackSpaces]);

  // { 12668: {...rack space doc}, 19690: {...}, ... }
  const rackByStyle = useMemo(
    () => Object.fromEntries(rackSpaces.map((r) => [r.styleNumber, r])),
    [rackSpaces]
  );

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            stocks={stocks}
            type={type}
            onImageClick={() => setSelected(p)}
            selected={selectedIds?.has(p.id)}
            onToggle={onToggle}
            salesData={salesByStyle[Number(p.styleNumber)]}
            rackData={rackByStyle[Number(p.styleNumber)]}
          />
        ))}
      </ul>

      {selected && <ImageModal product={selected} onClose={closeModal} />}
    </>
  );
}
