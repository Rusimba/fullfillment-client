import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Достаем функции и данные из хранилища
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);

  // Считаем товары для красного бейджика
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/products', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProducts(response.data);
      } catch (err: any) {
        setError('Не удалось загрузить товары');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Загрузка каталога...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-wrap justify-between items-center mb-8 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Каталог товаров</h2>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link to="/cart" className="relative px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium flex items-center">
              Корзина
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <Link to="/orders" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium flex items-center">
              Мои заказы
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium">
              Выйти
            </button>
          </div>
        </header>

        {products.length === 0 ? (
          <div className="text-center mt-20">
            <p className="text-xl text-gray-500">Товаров пока нет 😔</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all hover:shadow-md hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">{product.price} ₽</h2>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
                    <span>Остаток на складе:</span>
                    <span className="font-bold text-gray-700">{product.stock} шт.</span>
                  </div>
                  
                  <button 
                    disabled={product.stock === 0}
                    onClick={() => {
                      addItem({
                        productId: product.id,
                        name: product.name,
                        price: product.price,
                        stock: product.stock
                      });
                      toast.success(`${product.name} добавлен в корзину`);
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      product.stock === 0 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                    }`}
                  >
                    {product.stock === 0 ? 'Нет на складе' : 'В корзину'}
                  </button>
                </div>
              </div>
              
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
