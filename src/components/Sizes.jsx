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

const Sizes = ({ sizes = [] }) => {
  if (!sizes.length) {
    return <p className="text-xs text-slate-400">No sizes available</p>;
  }

  return (
    <ul
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Size wise inventory"
    >
      {sizes.map(({ node }) => {
        const qty = node.inventoryQuantity ?? 0;
        const style = getStockStyle(qty);

        return (
          <li
            key={node.id}
            title={`${node.title}: ${qty} (${style.label})`}
            className={`flex items-center justify-between gap-1 rounded-md px-2 py-1.5 text-xs font-medium ring-1 ring-inset ${style.chip}`}
          >
            <span className="truncate font-semibold uppercase tracking-wide">{node.title}</span>
            <span className={`min-w-6 rounded px-1.5 py-0.5 text-center tabular-nums ${style.qty}`}>
              {qty}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default Sizes;
