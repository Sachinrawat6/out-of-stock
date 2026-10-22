import Fabrics from './Fabrics';
import ProductImage from './ProductImage';
import StatusBadge from './StatusBadge';

export default function ProductCard({ product, onImageClick, stocks }) {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  // "2 days ago" / "Today" / "Yesterday" etc.
  function formatRelativeTime(dateInput) {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;

    const diffMs = Date.now() - date.getTime();
    const days = Math.max(0, Math.floor(diffMs / MS_PER_DAY));

    if (days === 0) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diffMs / (1000 * 60));
        return minutes <= 1 ? 'Just now' : `${minutes} min ago`;
      }
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    const years = Math.floor(days / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  // "15 Jan 2025" — absolute readable date
  function formatDate(dateInput) {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <li className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white  transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 ">
      <div className="relative">
        <ProductImage image={product.featuredImage} title={product.title} onClick={onImageClick} />

        <span
          className="absolute left-2 top-2 inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-md bg-red-600/95 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-sm backdrop-blur-sm"
          title={`Last updated ${formatRelativeTime(product.updatedAt) ?? 'unknown'}`}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/90" aria-hidden="true" />
          <span className="whitespace-nowrap">Out of Stock</span>
          <span
            className="shrink-0 rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-medium tabular-nums"
            aria-label={`Last updated ${formatRelativeTime(product.updatedAt) ?? 'unknown'}`}
          >
            {formatRelativeTime(product.updatedAt) ?? '—'}
          </span>
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
        <div>
          <Fabrics styleNumber={product.styleNumber} stocks={stocks} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <StatusBadge status={product.status} />
          <span className="whitespace-nowrap text-xs text-slate-500">
            Inventory:{' '}
            <span className="font-medium text-slate-700 tabular-nums">
              {product.totalInventory}
            </span>
            <p className="text-xs text-slate-500">
              Last updated{' '}
              <span className="font-medium text-slate-700">
                {formatDate(product.updatedAt) ?? 'Unknown'}
              </span>
            </p>
          </span>
        </div>
      </div>
    </li>
  );
}
