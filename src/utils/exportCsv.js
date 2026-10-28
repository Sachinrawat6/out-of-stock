// import { CSV_FILE_NAME } from '../constants/config';
// import { downloadFile } from './downloadFile';
// import { fabricNumbers } from './fabrics';

// const MAX_FABRICS = 3;

// const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

// const header = [
//   'Style Number',
//   'Image Link',
//   'Title',
//   'Total Inventory',
//   ...Array.from({ length: MAX_FABRICS }, (_, i) => [
//     `Fabric ${i + 1} Name`,
//     `Fabric ${i + 1} Qty`,
//   ]).flat(),
// ];

// export const exportProductsCsv = (products = [], stocks = []) => {
//   const rows = products.map((p) => {
//     const fabrics = fabricNumbers(p.styleNumber, stocks) || [];

//     const fabricCells = Array.from({ length: MAX_FABRICS }, (_, i) => [
//       fabrics[i]?.fabricName ?? '',
//       fabrics[i]?.availableStock?.toFixed(2) ?? '',
//     ]).flat();

//     return [p.styleNumber, p.featuredImage?.url ?? '', p.title, p.totalInventory, ...fabricCells];
//   });

//   const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

//   downloadFile('\uFEFF' + csv, CSV_FILE_NAME, 'text/csv;charset=utf-8;');
// };

import { CSV_FILE_NAME } from '../constants/config';
import { downloadFile } from './downloadFile';
import { fabricNumbers } from './fabrics';
import { getReturnPercent } from './salesMetrics';

const MAX_FABRICS = 3;
const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const header = [
  'Style Number',
  'Image Link',
  'Title',
  'Total Inventory',
  'Rack Stock',
  'Rack Spaces',
  'Total Sales',
  'Net Sales',
  'Cancelled Units',
  'Customer Returns (RTV)',
  'Courier Returns (RTO)',
  'Return % (RTV)',
  ...Array.from({ length: MAX_FABRICS }, (_, i) => [
    `Fabric ${i + 1} Name`,
    `Fabric ${i + 1} Qty`,
  ]).flat(),
];

// All racks of a style (all sizes together), biggest quantity first: "10-A: 10 | 20-B: 5"
const getRackSummary = (racks) => {
  if (!racks) return '';

  const totals = {};
  for (const size of SIZES) {
    const entries = racks[size]?.rackSpaces?.[0] ?? {};
    for (const [rack, qty] of Object.entries(entries)) {
      totals[rack] = (totals[rack] || 0) + qty;
    }
  }

  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([rack, qty]) => `${rack}: ${qty}`)
    .join(' | ');
};

// salesByStyle and rackByStyle come from useSalesSort. Cells stay empty when a style has no data.
export const exportProductsCsv = (
  products = [],
  stocks = [],
  { salesByStyle = {}, rackByStyle = {} } = {}
) => {
  const rows = products.map((p) => {
    const fabrics = fabricNumbers(p.styleNumber, stocks) || [];

    const fabricCells = Array.from({ length: MAX_FABRICS }, (_, i) => [
      fabrics[i]?.fabricName ?? '',
      fabrics[i]?.availableStock?.toFixed(2) ?? '',
    ]).flat();

    const styleNumber = Number(p.styleNumber);
    const sales = salesByStyle[styleNumber];
    const racks = rackByStyle[styleNumber];

    const returnPercent = getReturnPercent(sales);

    return [
      p.styleNumber,
      p.featuredImage?.url ?? '',
      p.title,
      p.totalInventory,
      racks?.masterInStock ?? '',
      getRackSummary(racks),
      sales?.masterTotalSalesUnit ?? '',
      sales?.masterNetSaleUnit ?? '',
      sales?.masterCancelled ?? '',
      sales?.masterCustomerReturn ?? '',
      sales?.masterCourierReturn ?? '',
      returnPercent == null ? '' : Number(returnPercent.toFixed(2)),
      ...fabricCells,
    ];
  });

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

  downloadFile('\uFEFF' + csv, CSV_FILE_NAME, 'text/csv;charset=utf-8;');
};
