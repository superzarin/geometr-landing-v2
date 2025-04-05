# Используем Node.js как базовый образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости с флагом --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Копируем остальные файлы проекта
COPY . .

# Открываем порт 3000
EXPOSE 3000

# Запускаем приложение в режиме разработки
CMD ["npm", "run", "dev"] 