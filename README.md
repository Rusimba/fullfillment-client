# 🚚 Mini-Fulfillment Client

Frontend-приложение для управления складом и заказами. Работает в связке с [fulfillment-api](https://github.com/Rusimba/fulfillment-api) (NestJS backend).

**Стек:** React 18, TypeScript, Vite, Axios, ESLint

---

## ✨ Возможности

- 🔐 **Регистрация и вход** (JWT-аутентификация)
- 📦 **Просмотр и создание товаров**
- 🛒 **Создание заказов** с автоматическим списанием остатков
- 📋 **История заказов** текущего пользователя
- 🎨 **Адаптивный UI**

---

## 🛠 Стек технологий

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=white)

---

## 📁 Структура проекта
src/
├── components/          # Переиспользуемые компоненты
├── pages/               # Страницы приложения
│   ├── Login/
│   ├── Register/
│   ├── Products/
│   └── Orders/
├── services/            # API-клиенты (Axios)
├── hooks/               # Кастомные React hooks
├── types/               # TypeScript типы
├── utils/               # Утилиты
├── App.tsx              # Корневой компонент
└── main.tsx             # Точка входа


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
# Отредактировать .env (VITE_API_URL)

# Запустить dev-сервер
npm run dev
```
Дев-сервер: http://localhost:5173
⚠️ Важно: для работы нужен запущенный backend на http://localhost:3000 (или используй Docker Compose из backend-репозитория)

📝 Переменные окружения
Создай .env по аналогии с .env.example:
VITE_API_URL=http://localhost:3000

🏗 Архитектурные решения
1. Axios для HTTP-запросов

    Interceptors для автоматического добавления JWT-токена
    Error handling для 401 (автоматический logout)
    Base URL из .env (VITE_API_URL)

2. TypeScript

    Строгая типизация всех компонентов и API-ответов
    Type-aware ESLint (tseslint.configs.recommendedTypeChecked)
    Типы для DTO синхронизированы с backend

3. Vite

    HMR (Hot Module Replacement) для мгновенной разработки
    Быстрая сборка через esbuild
    Оптимизированный production build

🔗 Backend
Проект работает с API: fulfillment-api
Там находится:

    Вся бизнес-логика
    Схема БД (Prisma)
    Swagger-документация (http://localhost:3000/api)
    JWT-аутентификация
    Атомарные транзакции

🐳 Запуск через Docker (опционально)
Если в backend-репозитории настроен docker-compose.yml, можно запустить всё вместе:
cd fulfillment-api
docker-compose up --build
Это поднимет:

    PostgreSQL
    NestJS API (порт 3000)
    (опционально) React frontend

🗺 Roadmap

    State management (Zustand / Redux Toolkit)
    React Query для кэширования API-запросов
    React Hook Form + Zod для валидации форм
    Темная тема
    Unit-тесты (Vitest + React Testing Library)
    E2E тесты (Playwright)

📝 License
MIT
Автор: Rusimba
GitHub: github.com/Rusimba

Backend: fulfillment-api

Frontend: fullfillment-client
