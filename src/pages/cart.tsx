import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function Cart() {
  const cartItems = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);
  const addItem = useCartStore(state => state.addItem); 
  const removeItem = useCartStore(state => state.removeItem);
  const navigate = useNavigate();

  // Высчитываем итоговую сумму
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Отправляем весь массив товаров из корзины на сервер
      await axios.post('http://localhost:3000/orders', {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Очищаем корзину после успешной покупки
      clearCart();
      toast.success('Заказ успешно оформлен!');
      navigate('/orders'); // Телепортируем в историю заказов

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Оформление заказа</h2>
          <Link to="/catalog" className="text-gray-500 hover:text-gray-700 font-medium">
            &larr; Вернуться
          </Link>
        </header>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm text-center">
            <p className="text-xl text-gray-500 mb-4">Ваша корзина пуста</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <li key={item.productId} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  {cartItems.map(item => (
                <li key={item.productId} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors gap-4">
                  
                  {/* Информация о товаре */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-gray-500">{item.price} ₽</p>
                  </div>

                  {/* 👇 Блок управления количеством (+ / -) */}
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 hover:bg-gray-50 transition-colors font-bold"
                    >
                      &minus;
                    </button>
                    
                    <span className="w-6 text-center font-medium text-gray-800">
                      {item.quantity}
                    </span>
                    
                   <button 
                        disabled={item.quantity >= item.stock} // Отключаем кнопку, если достигли предела
                        onClick={() => addItem({ 
                            productId: item.productId, 
                            name: item.name, 
                            price: item.price, 
                            stock: item.stock // Передаем лимит
                        })}
                        className={`w-8 h-8 flex items-center justify-center rounded shadow-sm font-bold transition-colors ${
                            item.quantity >= item.stock 
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' // Стили для отключенной кнопки
                            : 'bg-white text-gray-600 hover:text-blue-500 hover:bg-gray-50'
                        }`}>
                        +
                    </button>
                  </div>

                  {/* Итоговая сумма за этот товар */}
                  <div className="w-24 text-right">
                    <span className="font-bold text-gray-900 text-lg">{item.price * item.quantity} ₽</span>
                  </div>

                </li>
              ))}
                </li>
              ))}
            </ul>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg text-gray-600">К оплате:</span>
                <span className="text-2xl font-bold text-blue-600">{totalPrice} ₽</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-sm transition-all text-lg"
              >
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}