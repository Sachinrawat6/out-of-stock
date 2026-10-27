import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ActiveProducts from './pages/ActiveProducts';
import OutOfStockPage from './pages/OutOfStockPage';
import DraftProduct from './pages/DraftProduct';
import ExactInventory from './pages/ExactInventory';
import UploadCsv from './components/UploadCsv';
import UploadRackSpace from './components/UploadRackSpace';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/out-of-stock" replace />} />
          <Route path="/out-of-stock" element={<OutOfStockPage />} />
          <Route path="/active-products" element={<ActiveProducts />} />
          <Route path="/draft-products" element={<DraftProduct />} />
          <Route path="/exact-inventory" element={<ExactInventory />} />
          <Route path="/upload-sales" element={<UploadCsv />} />
          <Route path="/upload-rack-space" element={<UploadRackSpace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
