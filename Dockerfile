# === Build stage ===
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходники
COPY . .

# Собираем проект
RUN npm run build

# === Production stage ===
FROM nginx:alpine

# Копируем билд из предыдущего этапа
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем свой nginx конфиг (опционально, чтобы включить SPA fallback)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Экспонируем порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
