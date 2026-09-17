# Xeno

## API и MongoDB в Docker Compose

Скопируйте шаблон переменных и при необходимости задайте свои пароли и JWT-секрет:

```bash
cp .env.dev.example .env.dev
```

Запуск development-стека с hot reload API:

```bash
docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml up --build
```

После запуска доступны:

- API: `http://localhost:8000/api/v1`
- Swagger: `http://localhost:8000/api/v1/docs`
- MongoDB: `mongodb://localhost:27017`

Остановка контейнеров:

```bash
docker compose --env-file .env.dev -f compose.yaml -f compose.dev.yaml down
```

Данные MongoDB сохраняются в именованном Docker volume `mongodb-data`.

Production-override с web и Nginx будет добавлен следующим PR.

Для будущего production-запуска подготовлен отдельный шаблон:

```bash
cp .env.prod.example .env.prod
```
