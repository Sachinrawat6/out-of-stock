import { useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import ProductFilters from '../components/ProductFilters';
import SalesSortFilter from '../components/SalessortFilter';
import ProductList from '../components/ProductList';
import ErrorMessage from '../components/ErrorMessage';

import useProductFilters from '../hooks/useProductFilters';
import useSalesSort from '../hooks/useSalesSort';
import { exportProductsCsv } from '../utils/exportCsv';
import { exportProductsPdf } from '../utils/exportPdf';
import useFabricStock from '../hooks/useFabricStock';
import useDraftProducts from '../hooks/useDraftProducts';
import useProductSelection from '../hooks/useProductSelection';

export default function DraftProduct() {
  const { products, total, loading, loadingMore, hasNextPage, loadMore, error, reload } =
    useDraftProducts();

  const { filtered, search, setSearch, statusFilter, setStatusFilter } =
    useProductFilters(products);

  // Sales data + sorting (runs after the search/status filters)
  const { salesByStyle, rackByStyle, sortedProducts, filterProps, needsAllProducts } =
    useSalesSort(filtered);

  const { selectedIds, selectedProducts, selectedCount, toggle, selectAll, clear } =
    useProductSelection(products);

  const { stocks, stockLoading, stockError } = useFabricStock();

  const sentinelRef = useRef(null);

  // Infinite scroll. Skipped while a sort is active, because the effect below loads every page.
  useEffect(() => {
    const node = sentinelRef.current;
    if (needsAllProducts || !node || !hasNextPage || loading || loadingMore || error) return;

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), {
      rootMargin: '300px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [needsAllProducts, hasNextPage, loading, loadingMore, error, loadMore, sortedProducts.length]);

  // While a sort is active, keep loading pages so the sort covers ALL products
  useEffect(() => {
    if (!needsAllProducts || !hasNextPage || loading || loadingMore || error) return;
    loadMore();
  }, [needsAllProducts, hasNextPage, loading, loadingMore, error, loadMore]);

  const isFiltering = Boolean(search) || (statusFilter && statusFilter !== 'all');
  const exportList = selectedCount > 0 ? selectedProducts : sortedProducts;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PageHeader
        title="Draft products"
        loading={loading}
        stockLoading={stockLoading}
        shown={sortedProducts.length}
        total={total}
        selectedCount={selectedCount}
        onClearSelection={clear}
        onSelectAll={() => selectAll(sortedProducts)}
        onExportCsv={() => exportProductsCsv(exportList, stocks, { salesByStyle, rackByStyle })}
        onExportPdf={() => exportProductsPdf(exportList, stocks, 'Draft Products')}
      />

      <main className="mx-auto container px-4 py-6">
        <ProductFilters
          search={search}
          onSearch={setSearch}
          status={statusFilter}
          onStatus={setStatusFilter}
        />

        <SalesSortFilter {...filterProps} />

        {needsAllProducts && hasNextPage && (
          <p className="mb-4 text-sm text-slate-500">
            Loading the remaining products so the sort covers all of them...
          </p>
        )}

        {(loading || stockLoading) && (
          <p className="py-16 text-center text-slate-500">Loading products...</p>
        )}

        {(error || stockError) && (
          <ErrorMessage
            message={error || stockError}
            onRetry={products.length === 0 ? reload : loadMore}
          />
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            {isFiltering && hasNextPage
              ? 'No match found in loaded products. More products are loading...'
              : 'No products match your search.'}
          </p>
        )}

        {!loading && sortedProducts.length > 0 && (
          <ProductList
            products={sortedProducts}
            type="Draft"
            stocks={stocks}
            selectedIds={selectedIds}
            onToggle={toggle}
            salesByStyle={salesByStyle}
            rackByStyle={rackByStyle}
          />
        )}

        {!loading && hasNextPage && (
          <div ref={sentinelRef} className="flex justify-center py-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              {loadingMore ? 'Loading more...' : 'Load more'}
            </button>
          </div>
        )}

        {!loading && !hasNextPage && products.length > 0 && (
          <p className="py-8 text-center text-sm text-slate-400">All products loaded</p>
        )}
      </main>
    </div>
  );
}
