# Общая рабочая директория для development- и production-сборок фронтенда.
FROM node:22-bookworm-slim AS base
WORKDIR /app

# Development-образ хранит инструменты Vite и запускается с bind mount исходников.
FROM base AS development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000

# В build-слое Vite собирает статические файлы, которые затем отдаёт Nginx.
FROM development AS build
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Production-образ содержит только статические файлы и конфигурацию Nginx.
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 443
