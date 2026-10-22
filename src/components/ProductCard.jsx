import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';

// Shopify store-style product card
export default function ProductCard({ product, onImageClick }) {
  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white  transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 ">
      {/* Image + Out of Stock tag */}
      <div className="relative">
        <ProductImage image={product.featuredImage} title={product.title} onClick={onImageClick} />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-red-600/95 px-2.5 py-1 text-xs font-semibold tracking-wide text-white  backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden="true" />
          Out of Stock
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Style {product.styleNumber}
        </p>
        <h2
          title={product.title}
          className="line-clamp-2 text-sm font-medium leading-snug text-slate-900 transition-colors group-hover:text-slate-700"
        >
          {product.title}
        </h2>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <StatusBadge status={product.status} />
          <span className="whitespace-nowrap text-xs text-slate-500">
            Inventory:{' '}
            <span className="font-medium text-slate-700 tabular-nums">
              {product.totalInventory}
            </span>
          </span>
        </div>
      </div>
    </li>
  );
}
