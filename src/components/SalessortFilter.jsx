// Sort fields. `value` is a key of METRICS in utils/salesMetrics.js
export const SORT_OPTIONS = [
  { value: 'totalSales', label: 'Total sales', title: 'Total sales units' },
  { value: 'netSales', label: 'Net sales', title: 'Net sale units' },
  { value: 'cancelled', label: 'Cancelled units', title: 'Cancelled units' },
  { value: 'rto', label: 'RTO', title: 'Courier returns (RTO)' },
  { value: 'rtv', label: 'RTV', title: 'Customer returns (RTV)' },
  { value: 'returnPercent', label: 'Return %', title: 'Return % = RTV / total sales' },
  { value: 'rackStock', label: 'Rack stock', title: 'Stock in racks' },
  { value: 'inventory', label: 'In stock', title: 'In stock (inventory)' },
];

// Controlled component: the parent (useSalesSort) keeps `sorts` in state.
// sorts = [{ key: 'totalSales', order: 'desc' }, { key: 'returnPercent', order: 'asc' }]
// The first item is the main sort. Next items are used when the earlier values are equal.
// `stickyTop` is the Tailwind class for the sticky position. Use 'top-16' if a header is above.
export default function SalesSortFilter({ sorts, onSortsChange, stickyTop = 'top-0' }) {
  // If the page is not connected to useSalesSort, show it clearly instead of doing nothing
  if (!Array.isArray(sorts) || typeof onSortsChange !== 'function') {
    console.error(
      'SalesSortFilter needs `sorts` and `onSortsChange`. ' +
        'Use <SalesSortFilter {...filterProps} /> with filterProps from useSalesSort.'
    );
    return (
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Sort bar is not connected. In this page use{' '}
        <code>{'<SalesSortFilter {...filterProps} />'}</code> with <code>filterProps</code> from{' '}
        <code>useSalesSort</code>.
      </div>
    );
  }

  // Click cycle for a field: not selected -> high to low -> low to high -> removed
  const handleClick = (key) => {
    const index = sorts.findIndex((sort) => sort.key === key);

    if (index === -1) {
      onSortsChange([...sorts, { key, order: 'desc' }]);
    } else if (sorts[index].order === 'desc') {
      onSortsChange(sorts.map((sort, i) => (i === index ? { ...sort, order: 'asc' } : sort)));
    } else {
      onSortsChange(sorts.filter((_, i) => i !== index));
    }
  };

  return (
    <div
      className={`sticky ${stickyTop} z-20 mb-4 rounded-xl border border-slate-200 bg-white/95 py-3 pl-14 pr-4 shadow-sm backdrop-blur md:px-4`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="text-sm font-medium text-slate-600">Sort by</span>

        {/* All sort fields in one flex row. Scrolls sideways on phones, wraps on bigger screens. */}
        <div
          role="group"
          aria-label="Sort fields"
          className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0"
        >
          {SORT_OPTIONS.map(({ value, label, title }) => {
            const index = sorts.findIndex((sort) => sort.key === value);
            const active = index !== -1;
            const order = active ? sorts[index].order : null;

            const nextAction = !active
              ? 'Click to sort high to low'
              : order === 'desc'
                ? 'Click to sort low to high'
                : 'Click to remove';

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                title={`${title}. ${nextAction}`}
                onClick={() => handleClick(value)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-900/40 ${
                  active
                    ? 'border-rose-900 bg-rose-900 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-rose-900 hover:text-rose-900'
                }`}
              >
                {/* Priority number (only when more than one sort is selected) */}
                {active && sorts.length > 1 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold tabular-nums">
                    {index + 1}
                  </span>
                )}

                <span>{label}</span>

                {active && (
                  <>
                    <span aria-hidden="true">{order === 'desc' ? '↓' : '↑'}</span>
                    <span className="sr-only">
                      {order === 'desc' ? 'high to low' : 'low to high'}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {sorts.length > 0 && (
          <button
            type="button"
            onClick={() => onSortsChange([])}
            className="shrink-0 text-sm text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <p className="mt-2 hidden text-xs text-slate-400 sm:block">
        Click a field: high to low (↓), click again: low to high (↑), once more: remove. With more
        than one field, the numbers show the priority.
      </p>
    </div>
  );
}
