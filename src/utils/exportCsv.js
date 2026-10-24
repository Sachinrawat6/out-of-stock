import { CSV_FILE_NAME } from '../constants/config';
import { downloadFile } from './downloadFile';
import { fabricNumbers } from './fabrics';

const MAX_FABRICS = 3;

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const header = [
  'Style Number',
  'Image Link',
  'Title',
  'Total Inventory',
  ...Array.from({ length: MAX_FABRICS }, (_, i) => [
    `Fabric ${i + 1} Name`,
    `Fabric ${i + 1} Qty`,
  ]).flat(),
];

export const exportProductsCsv = (products = [], stocks = []) => {
  const rows = products.map((p) => {
    const fabrics = fabricNumbers(p.styleNumber, stocks) || [];

    const fabricCells = Array.from({ length: MAX_FABRICS }, (_, i) => [
      fabrics[i]?.fabricName ?? '',
      fabrics[i]?.availableStock?.toFixed(2) ?? '',
    ]).flat();

    return [p.styleNumber, p.featuredImage?.url ?? '', p.title, p.totalInventory, ...fabricCells];
  });

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

  downloadFile('\uFEFF' + csv, CSV_FILE_NAME, 'text/csv;charset=utf-8;');
};
