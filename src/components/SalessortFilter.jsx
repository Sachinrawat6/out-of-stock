// Sort options. `field` is the field name in the sales document from the API.
export const SORT_OPTIONS = [
  { value: 'totalSales', label: 'Total sales', field: 'masterTotalSalesUnit' },
  { value: 'netSales', label: 'Net sales', field: 'masterNetSaleUnit' },
  { value: 'rto', label: 'Courier returns (RTO)', field: 'masterCourierReturn' },
  { value: 'rtv', label: 'Customer returns (RTV)', field: 'masterCustomerReturn' },
];

const ORDERS = [
  { value: 'desc', label: 'High to low' },
  { value: 'asc', label: 'Low to high' },
];

// Controlled component: the parent keeps `sortBy` and `order` in state.
// sortBy = '' means "no sorting" (original product order).
export default function SalesSortFilter({ sortBy, order, onSortByChange, onOrderChange }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      {/* Sort field */}
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <span className="font-medium">Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {/* Order (ascending / descending) */}
      <div
        role="group"
        aria-label="Sort order"
        className={`inline-flex overflow-hidden rounded-md border border-slate-300 ${
          sortBy ? '' : 'pointer-events-none opacity-50'
        }`}
      >
        {ORDERS.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={!sortBy}
            aria-pressed={order === item.value}
            onClick={() => onOrderChange(item.value)}
            className={`px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-900/40 ${
              order === item.value
                ? 'bg-rose-900 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reset */}
      {sortBy && (
        <button
          type="button"
          onClick={() => {
            onSortByChange('');
            onOrderChange('desc');
          }}
          className="text-sm text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
