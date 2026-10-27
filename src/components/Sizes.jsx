const LOW_STOCK_LIMIT = 5;

const getStockStyle = (qty) => {
  if (qty <= 0) {
    return {
      chip: 'bg-rose-50 text-rose-700 ring-rose-600/20',
      qty: 'bg-rose-100 text-rose-700',
      label: 'Out of stock',
    };
  }
  if (qty <= LOW_STOCK_LIMIT) {
    return {
      chip: 'bg-amber-50 text-amber-800 ring-amber-600/30',
      qty: 'bg-amber-100 text-amber-800',
      label: 'Low stock',
    };
  }
  return {
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    qty: 'bg-emerald-100 text-emerald-700',
    label: 'In stock',
  };
};

// Variant title can be "3XL" or "Navy / 3XL". The last part is the size key.
const getSizeKey = (title = '') => title.split(/[/-]/).pop().trim().toUpperCase();

// `sales` is the sales document of this style (from the API), for example:
// { styleNumber: 12668, '3XL': { totalSales: 46, netSales: 41, ... }, ... }
// `racks` is the rack space document of this style (from the API), for example:
// { styleNumber: 12668, '3XL': { inStock: 20, rackSpaces: [{ '10-A': 10, '20-B': 5 }] }, ... }
const Sizes = ({ sizes = [], sales = null, racks = null }) => {
  if (!sizes.length) {
    return <p className="text-xs text-slate-400">No sizes available</p>;
  }

  return (
    <div>
      {/* Master rack stock of the whole style */}
      {racks && (
        <p className="mb-2 text-xs text-slate-500">
          Master in stock:{' '}
          <span className="font-semibold tabular-nums text-slate-800">
            {racks.masterInStock ?? 0}
          </span>
        </p>
      )}

      <ul
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3"
        aria-label="Size wise inventory and sales"
      >
        {sizes.map(({ node }) => {
          const qty = node.inventoryQuantity ?? 0;
          const style = getStockStyle(qty);

          // Sales numbers for this size (0 if the size is missing in the report)
          const sizeSales = sales?.[getSizeKey(node.title)];
          const sold = sizeSales?.totalSales ?? 0;
          const net = sizeSales?.netSales ?? 0;
          const rtv = sizeSales?.customerReturn ?? 0; // customer returns
          const rto = sizeSales?.courierReturn ?? 0; // courier returns
          const cancelled = sizeSales?.unitCancelled ?? 0;

          // Rack locations of this size, biggest quantity first: [['10-A', 10], ['20-B', 5]]
          const rackEntries = Object.entries(
            racks?.[getSizeKey(node.title)]?.rackSpaces?.[0] ?? {}
          ).sort((a, b) => b[1] - a[1]);

          // Total stock of this size in racks
          const rackStock = racks?.[getSizeKey(node.title)]?.inStock ?? 0;

          const baseTooltip = sales
            ? `${node.title}: ${qty} in stock (${style.label})\n` +
              `Sold ${sold}, Net ${net}, ` +
              `Customer returns (RTV) ${rtv}, ` +
              `Courier returns (RTO) ${rto}, ` +
              `Cancelled ${cancelled}`
            : `${node.title}: ${qty} (${style.label})`;

          // Tooltip shows ALL rack spaces of this size, one per line
          const tooltip = rackEntries.length
            ? `${baseTooltip}\nRack spaces:\n${rackEntries
                .map(([rack, rackQty]) => `${rack} × ${rackQty}`)
                .join('\n')}`
            : baseTooltip;

          return (
            <li
              key={node.id}
              title={tooltip}
              className={`flex flex-col gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-1 ring-inset ${style.chip}`}
            >
              {/* Size name and inventory */}
              <div className="flex items-center justify-between gap-1">
                <span className="truncate font-semibold uppercase tracking-wide">{node.title}</span>
                <span
                  className={`min-w-6 rounded px-1.5 py-0.5 text-center tabular-nums ${style.qty}`}
                >
                  {qty}
                </span>
              </div>

              {/* Sales numbers (only when sales data exists for this style) */}
              {sales && (
                <div className="border-t border-current/10 pt-1 text-[11px] font-normal tabular-nums">
                  <p className="flex justify-between gap-1 opacity-80">
                    <span>Sold {sold}</span>
                    <span>Net {net}</span>
                  </p>

                  {/* Return data: bold when there are returns */}
                  <p className="flex justify-between gap-1 opacity-80">
                    <span className={rtv > 0 ? 'font-semibold opacity-100' : ''}>RTV {rtv}</span>
                    <span className={rto > 0 ? 'font-semibold opacity-100' : ''}>RTO {rto}</span>
                  </p>
                </div>
              )}

              {/* Rack stock of this size (rack names are in the tooltip) */}
              {racks && (
                <p className="flex justify-between gap-1 border-t border-current/10 pt-1 text-[11px] font-normal tabular-nums">
                  <span className="opacity-80">Rack stock</span>
                  <span className="font-semibold">{rackStock}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sizes;
