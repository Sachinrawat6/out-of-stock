import { useCallback, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ImageModal from './ImageModal';

// Mobile: 1 card | Tablet: 2 cards | Desktop: 4 cards
export default function ProductList({ products, stocks }) {
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} stocks={stocks} onImageClick={() => setSelected(p)} />
        ))}
      </ul>

      {selected && <ImageModal product={selected} onClose={closeModal} />}
    </>
  );
}
