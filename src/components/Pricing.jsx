const Pricing = ({ product }) => {
  const pricing = product.variants.edges[0]?.node;

  if (!pricing) return null;

  const mrp = parseFloat(pricing.compareAtPrice);
  const sellingPrice = parseFloat(pricing.price);
  const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-3 py-3 px-4 rounded-xl bg-gray-50 border border-gray-200">
        {/* Selling Price - Primary */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-gray-500">Price</span>
          <span className=" font-bold text-gray-900 tracking-tight">{pricing.price}</span>
        </div>

        {/* MRP - Strikethrough */}
        {mrp > sellingPrice && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-gray-500">MRP</span>
            <span className="text-base font-medium text-gray-400 line-through">
              {pricing.compareAtPrice}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            {discount}% OFF
          </span>
        )}
      </div>
    </div>
  );
};

export default Pricing;
