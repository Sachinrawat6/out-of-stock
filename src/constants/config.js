export const API_URL =
  // import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/orders/out-of-stocks';
  import.meta.env.VITE_API_URL ||
  'https://shopify-oms-v2-backend.onrender.com/api/v1/orders/out-of-stocks';

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

export const FABRIC_STOCK_URL = 'https://raw-material-backend.onrender.com/api/v1/stock';
export const CSV_FILE_NAME = 'out-of-stock-products.csv';
export const PDF_FILE_NAME = 'out-of-stock-products.pdf';
