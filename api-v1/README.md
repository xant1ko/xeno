# api-v1

Базовый API-сервис на NestJS.

Правила проектирования API и обязательного описания новых ручек в Swagger находятся в [docs/API.md](docs/API.md).

## Запуск

```bash
npm install
cp .env.example .env
npm run start:dev
```

Swagger UI:

```text
http://localhost:8000/api/v1/docs
```

Проверка состояния:

```bash
curl http://localhost:8000/api/v1/health
```

Операции доступны по адресу `http://localhost:8000/api/v1/operations`. Массовая загрузка
новых операций выполняется через `POST /api/v1/operations/create-many`.
Загрузка через `POST /api/v1/csv-import` автоматически сохраняет все успешно распарсенные новые операции.

Production-сборка:

```bash
npm run build
npm run start:prod
```
