import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/catalog');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при входе');
    }
  };

  return (
    // min-h-screen растягивает блок на весь экран, flex и items-center центрируют контент
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      {/* Карточка формы: белый фон, скругленные углы (rounded-xl) и красивая тень (shadow-lg) */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Вход в систему</h2>
        
        {/* space-y-4 делает автоматические отступы между всеми элементами формы */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Стили инпута: рамка, скругление, и кольцо фокуса при клике (focus:ring-2)
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="student@test.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          
          {/* Блок ошибки с красным текстом */}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <button 
            type="submit" 
            // Стили кнопки: синий фон, белый текст, изменение цвета при наведении (hover:bg-blue-700)
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Войти
          </button>
        </form>
      </div>

    </div>
  );
}