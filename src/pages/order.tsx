import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Order {
  id: number;
  createdAt: string;
  status: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setOrders(response.data);
      } catch (err) {
        setError('Не удалось загрузить историю заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Красивые экраны загрузки и ошибки
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-gray-500">
      Загрузка истории...
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl text-red-500">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Шапка */}
        <header className="flex flex-wrap justify-between items-center mb-8 bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Мои заказы</h2>
          <Link 
            to="/catalog" 
            className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            &larr; В каталог
          </Link>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-xl text-gray-500 mb-4">У вас пока нет заказов 🛒</p>
            <Link to="/catalog" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Перейти к покупкам
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              // Карточка отдельного заказа
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                
                {/* Шапка заказа (серая подложка) */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <span className="text-gray-500 text-sm block mb-1">Заказ #{order.id}</span>
                    <span className="font-semibold text-gray-800">
                      {/* Делаем дату красивой и читаемой */}
                      {new Date(order.createdAt).toLocaleDateString("ru-RU", { 
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' 
                      })}
                    </span>
                  </div>
                  
                  {/* Цветной бейджик статуса */}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                    order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {order.status === 'PENDING' ? 'В обработке' : order.status}
                  </span>
                </div>
                
                {/* Список товаров в этом заказе */}
                <ul className="px-6 divide-y divide-gray-100">
                  {order.items.map(item => (
                    <li key={item.id} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{item.product.price} ₽ x {item.quantity} шт.</p>
                      </div>
                      <span className="font-bold text-gray-800">
                        {item.product.price * item.quantity} ₽
                      </span>
                    </li>
                  ))}
                </ul>
                
                {/* Подвал заказа: Подсчет итоговой суммы */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end items-center">
                  <span className="text-gray-600 mr-4">Итого:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {/* Магия JavaScript: метод reduce() суммирует цены всех товаров */}
                    {order.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)} ₽
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}