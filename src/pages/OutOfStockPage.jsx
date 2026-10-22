import PageHeader from '../components/PageHeader';
import ProductFilters from '../components/ProductFilters';
import ProductList from '../components/ProductList';
import ErrorMessage from '../components/ErrorMessage';
import useOutOfStockProducts from '../hooks/useOutOfStockProducts';
import useProductFilters from '../hooks/useProductFilters';
import { exportProductsCsv } from '../utils/exportCsv';
import { exportProductsPdf } from '../utils/exportPdf';

export default function OutOfStockPage() {
  const { products, loading, error, reload } = useOutOfStockProducts();
  const { filtered, search, setSearch, statusFilter, setStatusFilter } =
    useProductFilters(products);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Export hamesha filtered list se hoga */}
      <PageHeader
        loading={loading}
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

        {loading && <p className="py-16 text-center text-slate-500">Loading products...</p>}

        {error && <ErrorMessage message={error} onRetry={reload} />}

        {!loading && !error && filtered.length === 0 && (
          <p className="py-16 text-center text-slate-500">No products match your search.</p>
        )}

        {!loading && !error && filtered.length > 0 && <ProductList products={filtered} />}
      </main>
    </div>
  );
}
