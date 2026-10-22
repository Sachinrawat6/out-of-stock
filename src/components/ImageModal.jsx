import { useEffect } from 'react';

export default function ImageModal({ product, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-lg leading-none text-slate-800 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        ×
      </button>

      <figure onClick={(e) => e.stopPropagation()} className="max-h-full max-w-3xl">
        <img
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          className="max-h-[80vh] w-auto rounded-lg object-contain"
        />
        <figcaption className="mt-2 text-center text-sm text-white">
          Style {product.styleNumber} - {product.title}
        </figcaption>
      </figure>
    </div>
  );
}
