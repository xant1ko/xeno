FROM node:22-bookworm-slim AS base
WORKDIR /app
FROM base AS development
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 8000
FROM development AS build
RUN npm run build
FROM base AS production-dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
FROM node:22-bookworm-slim AS production

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
USER node

EXPOSE 8000
CMD ["node", "dist/main.js"]
