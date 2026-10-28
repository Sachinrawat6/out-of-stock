import { useCallback, useState } from 'react';
import ProductCard from './ProductCard';
import ImageModal from './ImageModal';

// Mobile: 1 card | Tablet: 2 cards | Desktop: 3 cards
// `products` is already filtered and sorted by the page.
// `salesByStyle` and `rackByStyle` come from useSalesSort.
export default function ProductList({
  products,
  stocks,
  type,
  selectedIds,
  onToggle,
  salesByStyle = {},
  rackByStyle = {},
}) {
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);

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
