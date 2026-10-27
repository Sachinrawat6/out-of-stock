// Master (all sizes together) sales and return numbers of one style.
// `sales` is the sales document from the API. Nothing is rendered when it is missing.
export default function SalesSummary({ sales }) {
  if (!sales) return null;

  const items = [
    { label: 'Sold', title: 'Master total sales units', value: sales.masterTotalSalesUnit },
    { label: 'Net', title: 'Master net sale units', value: sales.masterNetSaleUnit },
    {
      label: 'RTV',
      title: 'Master customer returns',
      value: sales.masterCustomerReturn,
      isReturn: true,
    },
    {
      label: 'RTO',
      title: 'Master courier returns',
      value: sales.masterCourierReturn,
      isReturn: true,
    },
    {
      label: 'Cancel',
      title: 'Cancelled orders',
      value: sales.masterCancelled,
    },
  ];

  return (
    <dl
      aria-label="Master sales and returns"
      className="grid grid-cols-5 gap-1.5 rounded-lg bg-slate-50 p-2 ring-1 ring-inset ring-slate-200"
    >
      {items.map(({ label, title, value, isReturn }) => {
        const count = value ?? 0;

        return (
          <div key={label} title={title} className="text-center">
            <dt className="text-[11px] font-medium text-slate-500">{label}</dt>
            <dd
              className={`text-sm font-semibold tabular-nums ${
                isReturn && count > 0 ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {count}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
