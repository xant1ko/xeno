# Базируемся на Node 22 LTS: NestJS 11 требует Node 20 или новее.
FROM node:22-bookworm-slim AS base

# Все команды выполняются из директории API.
WORKDIR /app

# Этап разработки содержит dev-зависимости и используется Compose dev-профилем.
FROM base AS development

# Сначала копируем только manifests, чтобы Docker кешировал npm ci между изменениями исходников.
COPY package.json package-lock.json ./
RUN npm ci

# Исходники копируются для запуска образа без bind mount; в dev Compose они будут заменены volume.
COPY . .

# Nest watch-процесс запускается через Compose command.
EXPOSE 8000

# Этап сборки компилирует TypeScript в dist.
FROM development AS build
RUN npm run build

# Отдельно устанавливаем только runtime-зависимости для итогового production-образа.
FROM base AS production-dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Финальный образ не содержит исходники и инструменты разработки.
FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist

# Используем непривилегированного встроенного пользователя Node.
USER node

EXPOSE 8000
CMD ["node", "dist/main.js"]
