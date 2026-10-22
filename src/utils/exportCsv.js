import { CSV_FILE_NAME } from '../constants/config';
import { downloadFile } from './downloadFile';

// comma ya quotes aaye toh CSV break na ho
const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export const exportProductsCsv = (products) => {
  const header = ['Style Number', 'Title', 'Total Inventory', 'Image Link'];

  const rows = products.map((p) => [
    p.styleNumber,
    p.title,
    p.totalInventory,
    p.featuredImage?.url || '',
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');

  // \uFEFF => Excel me special characters sahi dikhte hain
  downloadFile('\uFEFF' + csv, CSV_FILE_NAME, 'text/csv;charset=utf-8;');
};
