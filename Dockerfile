FROM node:22-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Флаг --host 0.0.0.0 обязателен в Docker, чтобы Vite был доступен из браузера
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]