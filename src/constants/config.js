// API ka URL .env se aata hai, nahi mila toh default use hoga
export const API_URL =
  // import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/orders/out-of-stocks';
  import.meta.env.VITE_API_URL ||
  'https://shopify-oms-v2-backend.onrender.com/api/v1/orders/out-of-stocks';

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

export const CSV_FILE_NAME = 'out-of-stock-products.csv';
export const PDF_FILE_NAME = 'out-of-stock-products.pdf';
