FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
USER node

EXPOSE 8000
CMD ["node", "dist/main.js"]

# docker run -d --name xeno-mongodb --network xeno-net -e MONGO_INITDB_ROOT_USERNAME=czarq -e MONGO_INITDB_ROOT_PASSWORD=password -v xeno-mongo-data:/data/db mongo:7.0

# docker run -d --name xeno-api --env-file .env --network xeno-net -p 8000:8000 xeno-api

# я вахуе
