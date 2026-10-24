import { useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import ProductFilters from '../components/ProductFilters';
import ProductList from '../components/ProductList';
import ErrorMessage from '../components/ErrorMessage';

import useProductFilters from '../hooks/useProductFilters';
import { exportProductsCsv } from '../utils/exportCsv';
import { exportProductsPdf } from '../utils/exportPdf';
import useFabricStock from '../hooks/useFabricStock';
import useProductSelection from '../hooks/useProductSelection';

import useZeroInventoryProducts from '../hooks/useZeroInventoryProducts';

export default function ExactInventory() {
  const { products, total, loading, loadingMore, hasNextPage, loadMore, error, reload } =
    useZeroInventoryProducts();

  const { filtered, search, setSearch, statusFilter, setStatusFilter } =
    useProductFilters(products);
  const { selectedIds, selectedProducts, selectedCount, toggle, selectAll, clear } =
    useProductSelection(products);
  const { stocks, stockLoading, stockError } = useFabricStock();

  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage || loading || loadingMore || error) return;

    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), {
      rootMargin: '300px',
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, loading, loadingMore, error, loadMore, filtered.length]);

  const isFiltering = Boolean(search) || (statusFilter && statusFilter !== 'all');
  const exportList = selectedCount > 0 ? selectedProducts : filtered;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PageHeader
        title="Exact Inventory Products"
        loading={loading}
        stockLoading={stockLoading}
        shown={filtered.length}
        total={total}
        selectedCount={selectedCount}
        onClearSelection={clear}
        onSelectAll={() => selectAll(filtered)}
        onExportCsv={() => exportProductsCsv(exportList, stocks)}
        onExportPdf={() => exportProductsPdf(exportList, stocks, 'Exact Inventory Products')}
      />

      <main className="mx-auto container px-4 py-6">
        <ProductFilters
          search={search}
          onSearch={setSearch}
          status={statusFilter}
          onStatus={setStatusFilter}
        />

        {(loading || stockLoading) && (
          <p className="py-16 text-center text-slate-500">Loading products...</p>
        )}

        {(error || stockError) && (
          <ErrorMessage
            message={error || stockError}
            onRetry={products.length === 0 ? reload : loadMore}
          />
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            {isFiltering && hasNextPage
              ? 'No match found in loaded products. More products are loading...'
              : 'No products match your search.'}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <ProductList
            products={filtered}
            type="Exact Inventory"
            stocks={stocks}
            selectedIds={selectedIds}
            onToggle={toggle}
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
