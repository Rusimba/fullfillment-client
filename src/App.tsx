import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Catalog from './pages/catalog';
import Orders from './pages/order';
import Cart from './pages/cart';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    // BrowserRouter следит за адресной строкой браузера
    <BrowserRouter>
      {/* Routes проверяет текущий URL и выбирает нужный Route */}
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {/* Автоматический редирект с корня на страницу логина */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Наши главные экраны */}
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;