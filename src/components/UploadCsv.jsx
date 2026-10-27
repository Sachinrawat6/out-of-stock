import React, { useState } from 'react';
import Papa from 'papaparse';
import useSales from '../hooks/useSales';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

// ---------- Helpers ----------

// Empty numbers for one size
const createEmptySize = () => ({
  totalSales: 0,
  netSales: 0,
  customerReturn: 0,
  courierReturn: 0,
  unitCancelled: 0,
  netSalesAmount: 0,
});

// Empty summary for one style number
const createEmptySummary = (styleNumber) => {
  const summary = {
    styleNumber,
    masterTotalSalesUnit: 0,
    masterNetSaleUnit: 0,
    masterCustomerReturn: 0,
    masterCourierReturn: 0,
    masterCancelled: 0,
    masterNetSales: 0,
  };

  for (const size of SIZES) {
    summary[size] = createEmptySize();
  }

  return summary;
};

// Convert any cell value to a safe number
const toNumber = (value) => {
  if (value == null || String(value).trim() === '') return 0;
  const number = Number(String(value).replace(/[,\s₹]/g, ''));
  return Number.isFinite(number) ? number : 0;
};

// Group CSV rows by style number and size
const aggregateSales = (rows) => {
  const result = {};

  for (const row of rows) {
    // Product looks like "12668-Navy-3XL"
    const parts = String(row.Product || '')
      .trim()
      .split('-');
    if (parts.length < 2) continue; // skips rows like "unmapped"

    const styleNumber = parts[0].trim();
    const size = parts[parts.length - 1].trim().toUpperCase();

    if (!styleNumber || !SIZES.includes(size)) continue;

    if (!result[styleNumber]) {
      result[styleNumber] = createEmptySummary(styleNumber);
    }

    const summary = result[styleNumber];
    const sizeSummary = summary[size];

    const totalSales = toNumber(row['Total Sales Unit']);
    const netSales = toNumber(row['Net Sale Unit']);
    const customerReturn = toNumber(row['Customer Return(RTV) Unit']);
    const courierReturn = toNumber(row['Courier Return(RTO) Unit']);
    const cancelled = toNumber(row['Units Cancelled']);
    const netAmount = toNumber(row['Net Sales']);

    // Size-wise values
    sizeSummary.totalSales += totalSales;
    sizeSummary.netSales += netSales;
    sizeSummary.customerReturn += customerReturn;
    sizeSummary.courierReturn += courierReturn;
    sizeSummary.unitCancelled += cancelled;
    sizeSummary.netSalesAmount += netAmount;

    // Master totals for the style
    summary.masterTotalSalesUnit += totalSales;
    summary.masterNetSaleUnit += netSales;
    summary.masterCustomerReturn += customerReturn;
    summary.masterCourierReturn += courierReturn;
    summary.masterCancelled += cancelled;
    summary.masterNetSales += netAmount;
  }

  // Round money values after all additions
  for (const summary of Object.values(result)) {
    summary.masterNetSales = Number(summary.masterNetSales.toFixed(2));
    for (const size of SIZES) {
      summary[size].netSalesAmount = Number(summary[size].netSalesAmount.toFixed(2));
    }
  }

  return Object.values(result);
};

// Format money in Indian style
const formatMoney = (value) =>
  value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

// Reusable Tailwind classes for table cells
const th =
  'px-5 py-3 text-right text-xs font-semibold text-slate-500 whitespace-nowrap first:text-left';
const td = 'px-5 py-3 text-right tabular-nums whitespace-nowrap first:text-left';

// ---------- Component ----------

const UploadCsv = () => {
  const [payload, setPayload] = useState([]);
  const [fileName, setFileName] = useState('');
  const { importSales, loading } = useSales(); // API call + loading state
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }
  const [openStyle, setOpenStyle] = useState(null); // style whose size breakdown is open

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPayload([]);
    setStatus(null);
    setOpenStyle(null);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),

      complete: (results) => {
        const data = aggregateSales(results.data);

        if (data.length === 0) {
          setStatus({
            type: 'error',
            text: 'No valid rows found. Check the Product column format.',
          });
          return;
        }

        setPayload(data);
      },

      error: () => {
        setStatus({ type: 'error', text: 'CSV parsing failed.' });
      },
    });
  };

  const handleSave = async () => {
    try {
      setStatus(null);
      await importSales(payload);
      setStatus({ type: 'success', text: 'Sales data saved successfully.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Failed to save sales data.' });
    }
  };

  // Totals for the footer row
  const totals = payload.reduce(
    (sum, s) => ({
      sales: sum.sales + s.masterTotalSalesUnit,
      net: sum.net + s.masterNetSaleUnit,
      rtv: sum.rtv + s.masterCustomerReturn,
      rto: sum.rto + s.masterCourierReturn,
      cancelled: sum.cancelled + s.masterCancelled,
      amount: sum.amount + s.masterNetSales,
    }),
    { sales: 0, net: 0, rtv: 0, rto: 0, cancelled: 0, amount: 0 }
  );

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-6 text-slate-800 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Import sales data</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload the marketplace sales report. Units are grouped by style number and size.
          </p>
        </header>

        {/* Upload box */}
        <label className="flex cursor-pointer flex-col gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-5 transition hover:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700 focus-within:ring-offset-2">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
          <span className="text-base font-semibold">{fileName || 'Choose a Reports file'}</span>
          <span className="text-sm text-slate-500">
            {fileName ? 'Click to choose a different file' : ''}
          </span>
        </label>

        {/* Status message */}
        {status && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {status.text}
          </div>
        )}

        {/* Preview card */}
        {payload.length > 0 && (
          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-semibold">{payload.length} styles ready to import</h2>
              <button
                onClick={handleSave}
                disabled={loading}
                className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Saving…' : 'Save to database'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className={th}>Style</th>
                    <th className={th}>Total sales</th>
                    <th className={th}>Net sales</th>
                    <th className={th}>Customer returns</th>
                    <th className={th}>Courier returns</th>
                    <th className={th}>Cancelled</th>
                    <th className={th}>Net amount</th>
                  </tr>
                </thead>

                <tbody>
                  {payload.map((s) => (
                    <React.Fragment key={s.styleNumber}>
                      <tr
                        onClick={() =>
                          setOpenStyle(openStyle === s.styleNumber ? null : s.styleNumber)
                        }
                        className="cursor-pointer border-b border-slate-100 hover:bg-teal-50/50"
                      >
                        <td className={`${td} font-semibold`}>
                          {openStyle === s.styleNumber ? '▾' : '▸'} {s.styleNumber}
                        </td>
                        <td className={td}>{s.masterTotalSalesUnit}</td>
                        <td className={td}>{s.masterNetSaleUnit}</td>
                        <td className={td}>{s.masterCustomerReturn}</td>
                        <td className={td}>{s.masterCourierReturn}</td>
                        <td className={td}>{s.masterCancelled}</td>
                        <td className={td}>{formatMoney(s.masterNetSales)}</td>
                      </tr>

                      {/* Size-wise breakdown */}
                      {openStyle === s.styleNumber && (
                        <tr className="bg-slate-50">
                          <td colSpan={7} className="px-5 py-4">
                            <table className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white text-xs">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                  <th className="px-4 py-2 text-left font-semibold text-slate-500">
                                    Size
                                  </th>
                                  <th className="px-4 py-2 text-right font-semibold text-slate-500">
                                    Total
                                  </th>
                                  <th className="px-4 py-2 text-right font-semibold text-slate-500">
                                    Net
                                  </th>
                                  <th className="px-4 py-2 text-right font-semibold text-slate-500">
                                    RTV
                                  </th>
                                  <th className="px-4 py-2 text-right font-semibold text-slate-500">
                                    RTO
                                  </th>
                                  <th className="px-4 py-2 text-right font-semibold text-slate-500">
                                    Cancelled
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {SIZES.filter((size) => s[size].totalSales > 0).map((size) => (
                                  <tr
                                    key={size}
                                    className="border-b border-slate-100 last:border-0"
                                  >
                                    <td className="px-4 py-2 text-left font-medium">{size}</td>
                                    <td className="px-4 py-2 text-right tabular-nums">
                                      {s[size].totalSales}
                                    </td>
                                    <td className="px-4 py-2 text-right tabular-nums">
                                      {s[size].netSales}
                                    </td>
                                    <td className="px-4 py-2 text-right tabular-nums">
                                      {s[size].customerReturn}
                                    </td>
                                    <td className="px-4 py-2 text-right tabular-nums">
                                      {s[size].courierReturn}
                                    </td>
                                    <td className="px-4 py-2 text-right tabular-nums">
                                      {s[size].unitCancelled}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 font-semibold">
                  <tr className="border-t-2 border-slate-200">
                    <td className={td}>All styles</td>
                    <td className={td}>{totals.sales}</td>
                    <td className={td}>{totals.net}</td>
                    <td className={td}>{totals.rtv}</td>
                    <td className={td}>{totals.rto}</td>
                    <td className={td}>{totals.cancelled}</td>
                    <td className={td}>{formatMoney(totals.amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Raw payload, hidden by default */}
            <details className="border-t border-slate-200 px-5 py-3">
              <summary className="cursor-pointer text-sm text-slate-500">View API payload</summary>
              <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-100 p-3 text-xs">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </details>
          </section>
        )}
      </div>
    </div>
  );
};

export default UploadCsv;
