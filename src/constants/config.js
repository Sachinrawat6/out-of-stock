const DEVELOPMENT_COMMON_PATH = 'http://localhost:5000/api/v1';
const PRODUCTION_COMMON_PATH = 'https://shopify-oms-v2-backend.onrender.com/api/v1';

// ******************** DEVELOPMENT ***********************
// ********************************************************

// export const API_URL = `${DEVELOPMENT_COMMON_PATH}/shopify-products`;
// export const SALES_URL = `${DEVELOPMENT_COMMON_PATH}/sales`;
// export const RACK_SPACE_URL = `${DEVELOPMENT_COMMON_PATH}/rack-space`;

// ******************** PRODUCTION ***********************
// ********************************************************

export const API_URL = `${PRODUCTION_COMMON_PATH}/shopify-products`;
export const SALES_URL = `${PRODUCTION_COMMON_PATH}/sales`;
export const RACK_SPACE_URL = `${PRODUCTION_COMMON_PATH}/rack-space`;

export const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DRAFT', label: 'Draft' },
];

export const FABRIC_STOCK_URL = 'https://raw-material-backend.onrender.com/api/v1/stock';
export const CSV_FILE_NAME = 'shopify-products.csv';
export const PDF_FILE_NAME = 'shopify-products.pdf';
