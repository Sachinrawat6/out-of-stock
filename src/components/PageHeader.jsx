export default function PageHeader({
  title,
  loading,
  shown,
  total,
  selectedCount = 0,
  onClearSelection,
  onSelectAll,
  onExportCsv,
  onExportPdf,
}) {
  const hasSelection = selectedCount > 0;

  const exportDisabled = loading || (shown === 0 && !hasSelection);
  const selectAllDisabled = loading || shown === 0;

  const suffix = hasSelection ? ` (${selectedCount})` : '';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/60">
      {/* // <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/60"> */}
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between md:py-5">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
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

          {hasSelection && (
            <p className="mt-1 flex items-center gap-2 text-xs text-slate-600" aria-live="polite">
              <span className="rounded bg-slate-900 px-2 py-0.5 font-medium text-white">
                {selectedCount} selected
              </span>
              <button
                type="button"
                onClick={onClearSelection}
                className="underline hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800"
              >
                Clear
              </button>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 md:shrink-0 md:flex-nowrap">
          {onSelectAll && (
            <button
              type="button"
              onClick={onSelectAll}
              disabled={selectAllDisabled}
              aria-label="Select all visible products"
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white md:flex-none"
            >
              Select all
            </button>
          )}

          <button
            type="button"
            onClick={onExportCsv}
            disabled={exportDisabled}
            aria-label={hasSelection ? `Export ${selectedCount} selected as CSV` : 'Export as CSV'}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white md:flex-none"
          >
            Export CSV{suffix}
          </button>

          <button
            type="button"
            onClick={onExportPdf}
            disabled={exportDisabled}
            aria-label={hasSelection ? `Export ${selectedCount} selected as PDF` : 'Export as PDF'}
            className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900 md:flex-none"
          >
            Export PDF{suffix}
          </button>
        </div>
      </div>
    </header>
  );
}
