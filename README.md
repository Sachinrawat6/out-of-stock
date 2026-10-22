# Out of Stock Products Frontend

React + Tailwind CSS (Vite) frontend for the out-of-stock products API.

## Run

```bash
npm install
cp .env.example .env   # API URL yahan badal sakte ho
npm run dev
```

Open http://localhost:5173 (backend me CORS enable hona chahiye).

## Folder structure

```
src/
├── constants/    config.js            API URL, status options, file names
├── utils/        product.js           style number, image resize, unique products
│                 exportCsv.js         CSV export
│                 exportPdf.js         PDF export
│                 downloadFile.js      file download helper
├── hooks/        useOutOfStockProducts.js   API fetch (loading / error / reload)
│                 useProductFilters.js       search + status filter
├── components/   PageHeader, ProductFilters, ProductList, ProductCard,
│                 ProductImage, ImageModal, StatusBadge, ErrorMessage
├── pages/        OutOfStockPage.jsx   page jo sab jodta hai
├── App.jsx
├── main.jsx
└── index.css
```

## Features

- Shopify style product cards: 4 per row on desktop, 1 on mobile
- Click on image to see full image
- Search (style number / title) and status filter
- Export PDF: style number, title, total inventory, status
- Export CSV: style number, title, total inventory, image link
