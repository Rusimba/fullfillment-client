# 🚚 Mini-Fulfillment Client

Frontend-приложение для управления складом и заказами. Работает в связке с [fulfillment-api](https://github.com/Rusimba/fulfillment-api) (NestJS backend).

**Стек:** React 18, TypeScript, Vite, Zustand, Axios, ESLint

---

## ✨ Возможности

- 🔐 **Регистрация и вход** (JWT-аутентификация)
- 📦 **Просмотр и создание товаров**
- 🛒 **Создание заказов** с автоматическим списанием остатков
- 📋 **История заказов** текущего пользователя
- 🎨 **Адаптивный UI**
- 🔄 **Глобальное состояние** через Zustand

---

## 🛠 Стек технологий

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4A154B?logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

---

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
├── pages/               # Страницы приложения
│   ├── Login/
│   ├── Register/
│   ├── Products/
│   └── Orders/
├── store/               # Zustand stores
│   ├── authStore.ts     # Состояние аутентификации (JWT, user)
│   ├── productsStore.ts # Состояние товаров
│   └── ordersStore.ts   # Состояние заказов
├── services/            # API-клиенты (Axios)
├── hooks/               # Кастомные React hooks
├── types/               # TypeScript типы
├── utils/               # Утилиты
├── App.tsx              # Корневой компонент
└── main.tsx             # Точка входа
```

---

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- Запущенный [backend](https://github.com/Rusimba/fulfillment-api) на `http://localhost:3000`

### Установка

```bash
git clone https://github.com/Rusimba/fullfillment-client.git
cd fullfillment-client

# Установить зависимости
npm install

# Настроить переменные окружения
cp .env.example .env

# Запустить dev-сервер
npm run dev
```

**Дев-сервер:** `http://localhost:5173`

⚠️ **Важно:** для работы нужен запущенный backend на `http://localhost:3000`

---

## 📝 Переменные окружения

Создай `.env` по аналогии с `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

---

## 🔧 NPM-скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера с HMR |
| `npm run build` | Production-сборка |
| `npm run preview` | Предпросмотр production-сборки |
| `npm run lint` | Проверка кода через ESLint |

---

## 🏗 Архитектурные решения

### 1. Zustand для управления состоянием

Используется **Zustand** вместо Redux/Context API:

```typescript
// store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
```

**Почему Zustand:**
- **Минималистичный API** — меньше boilerplate, чем в Redux
- **Нет провайдеров** — не нужно оборачивать приложение в `<Provider>`
- **TypeScript из коробки** — полная типизация
- **Производительность** — подписка только на нужные поля

**Что хранится в сторах:**
- `authStore` — JWT-токен, данные пользователя, методы login/logout
- `productsStore` — список товаров, методы загрузки
- `ordersStore` — список заказов, методы создания и загрузки

### 2. Axios для HTTP-запросов

- **Interceptors** для автоматического добавления JWT-токена из Zustand store
- **Error handling** для 401 (автоматический logout через `authStore.logout()`)
- **Base URL** из `.env` (VITE_API_URL)

```typescript
// services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Автоматически добавляем JWT токен
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Автоматический logout при 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. TypeScript

- **Строгая типизация** всех компонентов и API-ответов
- **Type-aware ESLint** (tseslint.configs.recommendedTypeChecked)
- **Типы для DTO** синхронизированы с backend
- **Zustand stores** полностью типизированы

### 4. Vite

- **HMR** (Hot Module Replacement) для мгновенной разработки
- **Быстрая сборка** через esbuild
- **Оптимизированный production build**

---

## 🔗 Backend

Проект работает с API: **[fulfillment-api](https://github.com/Rusimba/fulfillment-api)**

Там находится:
- Вся бизнес-логика
- Схема БД (Prisma)
- Swagger-документация (`http://localhost:3000/api`)
- JWT-аутентификация
- Атомарные транзакции

---

## 🐳 Запуск через Docker (опционально)

Если в backend-репозитории настроен `docker-compose.yml`, можно запустить **всё вместе**:

```bash
cd fulfillment-api
docker-compose up --build
```

Это поднимет:
- PostgreSQL
- NestJS API (порт 3000)

---

## 🗺 Roadmap

- [x] Zustand для state management
- [x] Axios interceptors для JWT
- [ ] **React Query** для кэширования API-запросов
- [ ] **React Hook Form** + Zod для валидации форм
- [ ] **Темная тема**
- [ ] **Unit-тесты** (Vitest + React Testing Library)
- [ ] **E2E тесты** (Playwright)

---

## 📝 License

MIT

---

**Автор:** Rusimba  
**GitHub:** [github.com/Rusimba](https://github.com/Rusimba)  
**Backend:** [fulfillment-api](https://github.com/Rusimba/fulfillment-api)  
**Frontend:** [fullfillment-client](https://github.com/Rusimba/fullfillment-client)
