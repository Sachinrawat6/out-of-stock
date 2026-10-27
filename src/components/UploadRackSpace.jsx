import React, { useState } from 'react';
import Papa from 'papaparse';
import useRackSpace from '../hooks/useRackSpace';

const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

// Rack spaces that must be ignored (compared in lower case, after removing the leading ')
const IGNORED_RACKS = ['virtual', 'default', '', 'rack top'];

// ---------- Helpers ----------

// One size: total stock and the racks it is stored in
const createEmptySize = () => ({ inStock: 0, rackSpaces: [{}] });

// One style with every size set to zero
const createEmptyStyle = (styleNumber) => {
  const style = { styleNumber, masterInStock: 0 };
  for (const size of SIZES) {
    style[size] = createEmptySize();
  }
  return style;
};

// Convert any cell value to a safe number
const toNumber = (value) => {
  if (value == null || String(value).trim() === '') return 0;
  const number = Number(String(value).replace(/[,\s]/g, ''));
  return Number.isFinite(number) ? number : 0;
};

// "'10-A" -> "10-A". Dots are replaced because MongoDB map keys cannot contain them.
const cleanRack = (value) =>
  String(value ?? '')
    .trim()
    .replace(/^'+/, '')
    .trim()
    .replace(/\./g, '-');

// Group CSV rows by style number and size
const aggregateRackSpace = (rows) => {
  const result = {};
  let ignored = 0;

  for (const row of rows) {
    const rack = cleanRack(row['Rack Space']);

    // Skip virtual / default / empty / "Rack Top" racks
    if (IGNORED_RACKS.includes(rack.toLowerCase())) {
      ignored += 1;
      continue;
    }

    // Item SkuCode looks like "14094-Black-4XL" or "19758-Bottle Green-3XL"
    const parts = String(row['Item SkuCode'] || '')
      .trim()
      .split('-');
    if (parts.length < 2) {
      ignored += 1;
      continue;
    }

    const styleNumber = Number(parts[0].trim());
    const size = parts[parts.length - 1].trim().toUpperCase();
    const qty = toNumber(row.InStock);

    if (!Number.isFinite(styleNumber) || !SIZES.includes(size) || qty <= 0) {
      ignored += 1;
      continue;
    }

    if (!result[styleNumber]) {
      result[styleNumber] = createEmptyStyle(styleNumber);
    }

    const style = result[styleNumber];
    const racks = style[size].rackSpaces[0];

    style[size].inStock += qty;
    racks[rack] = (racks[rack] || 0) + qty; // same rack can appear in more than one row
    style.masterInStock += qty;
  }

  // Sizes without any rack get an empty rackSpaces array
  for (const style of Object.values(result)) {
    for (const size of SIZES) {
      if (Object.keys(style[size].rackSpaces[0]).length === 0) {
        style[size].rackSpaces = [];
      }
    }
  }

  return { styles: Object.values(result), ignored };
};

// Unique rack names used by one style
const getRackNames = (style) => {
  const names = new Set();
  for (const size of SIZES) {
    Object.keys(style[size].rackSpaces[0] || {}).forEach((rack) => names.add(rack));
  }
  return names;
};

// Reusable Tailwind classes for table cells
const th =
  'px-5 py-3 text-right text-xs font-semibold text-slate-500 whitespace-nowrap first:text-left';
const td = 'px-5 py-3 text-right tabular-nums whitespace-nowrap first:text-left';

// ---------- Component ----------

const UploadRackSpace = () => {
  const [payload, setPayload] = useState([]);
  const [ignoredRows, setIgnoredRows] = useState(0);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: string }
  const [openStyle, setOpenStyle] = useState(null);
  const { importRackSpace, loading } = useRackSpace();

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPayload([]);
    setStatus(null);
    setOpenStyle(null);
    setIgnoredRows(0);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),

      complete: (results) => {
        const { styles, ignored } = aggregateRackSpace(results.data);

        if (styles.length === 0) {
          setStatus({
            type: 'error',
            text: 'No valid rows found. Check the Item SkuCode and Rack Space columns.',
          });
          return;
        }

        setPayload(styles);
        setIgnoredRows(ignored);
      },

      error: () => {
        setStatus({ type: 'error', text: 'CSV parsing failed.' });
      },
    });
  };

  const handleSave = async () => {
    try {
      setStatus(null);
      await importRackSpace(payload);
      setStatus({ type: 'success', text: 'Rack space data saved successfully.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Failed to save rack space data.' });
    }
  };

  const totalStock = payload.reduce((sum, style) => sum + style.masterInStock, 0);

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-6 text-slate-800 sm:px-5 sm:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Import rack space data</h1>
          <p className="mt-1 text-sm text-slate-500">
            Upload the warehouse stock report. Stock is grouped by style, size and rack space.
          </p>
        </header>

        {/* Upload box */}
        <label className="flex cursor-pointer flex-col gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-5 transition hover:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700 focus-within:ring-offset-2">
          <input type="file" accept=".csv" onChange={handleFileUpload} className="sr-only" />
          <span className="text-base font-semibold">
            {fileName || 'Choose  rackSpace CSV file'}
          </span>
          <span className="text-sm text-slate-500">
            {fileName
              ? 'Click to choose a different file'
              : 'Needs the columns Rack Space, Item SkuCode and InStock'}
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
              <div>
                <h2 className="text-lg font-semibold">{payload.length} styles ready to import</h2>
                <p className="text-sm text-slate-500">
                  {ignoredRows} rows ignored (virtual, default, rack top, empty or zero stock)
                </p>
              </div>
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
                    <th className={th}>Racks used</th>
                    <th className={th}>In stock</th>
                  </tr>
                </thead>

                <tbody>
                  {payload.map((style) => (
                    <React.Fragment key={style.styleNumber}>
                      <tr
                        onClick={() =>
                          setOpenStyle(openStyle === style.styleNumber ? null : style.styleNumber)
                        }
                        className="cursor-pointer border-b border-slate-100 hover:bg-teal-50/50"
                      >
                        <td className={`${td} font-semibold`}>
                          {openStyle === style.styleNumber ? '▾' : '▸'} {style.styleNumber}
                        </td>
                        <td className={td}>{getRackNames(style).size}</td>
                        <td className={td}>{style.masterInStock}</td>
                      </tr>

                      {/* Size-wise racks */}
                      {openStyle === style.styleNumber && (
                        <tr className="bg-slate-50">
                          <td colSpan={3} className="px-5 py-4">
                            <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                              {SIZES.filter((size) => style[size].inStock > 0).map((size) => (
                                <li
                                  key={size}
                                  className="flex flex-wrap items-center gap-3 px-4 py-2 text-xs"
                                >
                                  <span className="w-10 font-semibold">{size}</span>
                                  <span className="w-16 tabular-nums text-slate-500">
                                    {style[size].inStock} pcs
                                  </span>
                                  <span className="flex flex-wrap gap-1.5">
                                    {Object.entries(style[size].rackSpaces[0] || {}).map(
                                      ([rack, qty]) => (
                                        <span
                                          key={rack}
                                          className="rounded bg-slate-100 px-2 py-0.5 tabular-nums"
                                        >
                                          {rack} × {qty}
                                        </span>
                                      )
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>

                <tfoot className="bg-slate-50 font-semibold">
                  <tr className="border-t-2 border-slate-200">
                    <td className={td}>All styles</td>
                    <td className={td}></td>
                    <td className={td}>{totalStock}</td>
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

export default UploadRackSpace;
