import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_FILE_NAME } from '../constants/config';
import { fabricNumbers } from './fabrics';

const MAX_FABRICS = 3;

const fabricHeaders = Array.from({ length: MAX_FABRICS }, (_, i) => [
  `Fabric ${i + 1}`,
  `Qty ${i + 1}`,
]).flat();

export const exportProductsPdf = (products = [], stocks = [], title = 'Out of Stock Products') => {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(`Total: ${products.length}  |  ${new Date().toLocaleDateString('en-IN')}`, 14, 23);

  const body = products.map((p) => {
    const fabrics = fabricNumbers(p.styleNumber, stocks) || [];

    const fabricCells = Array.from({ length: MAX_FABRICS }, (_, i) => [
      fabrics[i]?.fabricName ?? '',
      fabrics[i]?.availableStock?.toFixed(2) ?? '',
    ]).flat();

    return [
      p.styleNumber ?? '',
      p.title ?? '',
      p.totalInventory ?? '',
      p.status ?? '',
      ...fabricCells,
    ];
  });

  autoTable(doc, {
    startY: 28,
    head: [['Style Number', 'Title', 'Total Inventory', 'Status', ...fabricHeaders]],
    body,
    headStyles: { fillColor: [31, 41, 55] },
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    columnStyles: {
      1: { cellWidth: 50 }, // Title
    },

    didDrawPage: () => {
      const { width, height } = doc.internal.pageSize;
      doc.setFontSize(8);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, width - 20, height - 8);
    },
  });

  doc.save(PDF_FILE_NAME);
};
