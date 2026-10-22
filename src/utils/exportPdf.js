import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_FILE_NAME } from '../constants/config';

export const exportProductsPdf = (products) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Out of Stock Products', 14, 16);
  doc.setFontSize(10);
  doc.text(`Total: ${products.length}  |  ${new Date().toLocaleDateString('en-IN')}`, 14, 23);

  autoTable(doc, {
    startY: 28,
    head: [['Style Number', 'Title', 'Total Inventory', 'Status']],
    body: products.map((p) => [p.styleNumber, p.title, p.totalInventory, p.status]),
    headStyles: { fillColor: [31, 41, 55] },
    styles: { fontSize: 9 },
  });

  doc.save(PDF_FILE_NAME);
};
