export default function PageHeader({ loading, shown, total, onExportCsv, onExportPdf }) {
  const disabled = loading || shown === 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:py-5">
        {/* Title & Count */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Out of stock products
          </h1>
          <p className="mt-0.5 text-sm text-slate-500" aria-live="polite">
            {loading ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400" />
                Loading...
              </span>
            ) : (
              <>
                <span className="font-medium text-slate-700">{shown}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span>{total}</span> products
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 md:shrink-0">
          <button
            type="button"
            onClick={onExportCsv}
            disabled={disabled}
            aria-label="Export as CSV"
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white md:flex-none"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={disabled}
            aria-label="Export as PDF"
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900 md:flex-none"
          >
            Export PDF
          </button>
        </div>
      </div>
    </header>
  );
}
