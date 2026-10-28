// Return % = customer returns (RTV) / total sales * 100.
// Returns null when the style has no sales data, and 0 when total sales is 0.
export const getReturnPercent = (sales) => {
  if (!sales) return null;

  const totalSales = sales.masterTotalSalesUnit ?? 0;
  if (totalSales <= 0) return 0;

  return ((sales.masterCustomerReturn ?? 0) / totalSales) * 100;
};

// One function per value that can be sorted.
// Each one gets { product, sales, racks } and returns a number.
// It returns null when the data is missing, and those products always go to the end.
export const METRICS = {
  totalSales: ({ sales }) => sales?.masterTotalSalesUnit ?? null,
  netSales: ({ sales }) => sales?.masterNetSaleUnit ?? null,
  cancelled: ({ sales }) => sales?.masterCancelled ?? null,
  rto: ({ sales }) => sales?.masterCourierReturn ?? null,
  rtv: ({ sales }) => sales?.masterCustomerReturn ?? null,
  returnPercent: ({ sales }) => getReturnPercent(sales),
  rackStock: ({ racks }) => racks?.masterInStock ?? null, // stock in racks
  inventory: ({ product }) => product?.totalInventory ?? null, // in stock (Shopify inventory)
};
