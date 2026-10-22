import PageHeader from '../components/PageHeader';
import ProductFilters from '../components/ProductFilters';
import ProductList from '../components/ProductList';
import ErrorMessage from '../components/ErrorMessage';
import useOutOfStockProducts from '../hooks/useOutOfStockProducts';
import useProductFilters from '../hooks/useProductFilters';
import { exportProductsCsv } from '../utils/exportCsv';
import { exportProductsPdf } from '../utils/exportPdf';
import useFabricStock from '../hooks/useFabricStock';
import { fabricNumbers } from '../utils/fabrics';

export default function OutOfStockPage() {
  const { products, loading, error, reload } = useOutOfStockProducts();
  const { filtered, search, setSearch, statusFilter, setStatusFilter } =
    useProductFilters(products);
  const { stocks, stockLoading, stockError } = useFabricStock();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <PageHeader
        loading={loading}
        stockLoading={stockLoading}
        shown={filtered.length}
        total={products.length}
        onExportCsv={() => exportProductsCsv(filtered)}
        onExportPdf={() => exportProductsPdf(filtered)}
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

        {(error || stockError) && <ErrorMessage message={error} onRetry={reload} />}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-slate-500">No products match your search.</p>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ProductList products={filtered} stocks={stocks} />
        )}
      </main>
    </div>
  );
}
