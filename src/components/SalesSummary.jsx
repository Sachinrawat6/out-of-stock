// Master (all sizes together) sales, return and stock numbers of one style.
// `sales` is the sales document and `racks` is the rack space document, both from the API.
// Each part is shown only when its data exists. Nothing is rendered when both are missing.
export default function SalesSummary({ sales = null, racks = null }) {
  if (!sales && !racks) return null;

  const items = [];

  if (sales) {
    const totalSales = sales.masterTotalSalesUnit ?? 0;
    const customerReturns = sales.masterCustomerReturn ?? 0; // RTV only (RTO is not counted)

    // Return % = RTV / total sales * 100. Safe when total sales is 0.
    const returnPercent = totalSales > 0 ? (customerReturns / totalSales) * 100 : 0;

    items.push(
      { label: 'Sold', title: 'Master total sales units', value: totalSales },
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
        label: 'Return %',
        title: 'Customer returns (RTV) as a percentage of total sales',
        value: returnPercent,
        display: `${Number(returnPercent.toFixed(1))}%`, // 12.5%
        isReturn: true,
      },
      { label: 'Cancel', title: 'Cancelled orders', value: sales.masterCancelled }
    );
  }

  if (racks) {
    // Total stock of ALL sizes in racks
    items.push({
      label: 'In stock',
      title: 'Master in stock (all sizes, all racks)',
      value: racks.masterInStock,
    });
  }

  return (
    <dl
      aria-label="Master sales, returns and stock"
      className="grid grid-cols-7 gap-x-1.5 gap-y-2 rounded-lg bg-slate-50 p-2 ring-1 ring-inset ring-slate-200"
    >
      {items.map(({ label, title, value, display, isReturn }) => {
        const count = value ?? 0;

        return (
          <div key={label} title={title} className="text-center">
            <dt className="text-[11px] font-medium text-slate-500">{label}</dt>
            <dd
              className={`text-sm font-semibold tabular-nums ${
                isReturn && count > 0 ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {display ?? count}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
