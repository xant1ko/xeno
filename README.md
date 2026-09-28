# Xeno

## Docker Compose

Скопируйте шаблон переменных и при необходимости задайте свои пароли и JWT-секрет:

```bash
cp .env.dev.example .env.dev
```

Запуск development-стека с hot reload API и web. Dev запускается отдельным Compose-проектом `xeno-dev`, поэтому его MongoDB volume не пересекается с production:

```bash
make dev-up
```

После запуска доступны:

- Web: `http://localhost:8090`
- API: `http://localhost:8000/api/v1`
- Swagger: `http://localhost:8000/api/v1/docs`
- MongoDB: `mongodb://localhost:27017`

Остановка контейнеров:

```bash
make dev-down
```

Данные MongoDB сохраняются в именованном Docker volume `mongodb-data`.

Полезные команды: `make dev-build`, `make dev-logs`, `make dev-ps`.

Для production подготовьте отдельные секреты:

```bash
cp .env.prod.example .env.prod
```

Запуск production-стека: web отдаётся Nginx, а запросы на `/api` он передаёт API внутри Docker-сети.

```bash
make prod-up
```

После запуска приложение доступно на `http://localhost:80`. API и MongoDB наружу в production не публикуются.

Для обновления production-образов после изменения кода или зависимостей выполните `make prod-build`, затем `make prod-up`. Логи и состояние: `make prod-logs`, `make prod-ps`; остановка: `make prod-down`.

Если требуется другой внешний порт, измените `WEB_PORT` в `.env.dev` или `.env.prod` до запуска соответствующего стека.
