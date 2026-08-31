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
http://localhost:3000/api/v1/docs
```

Проверка состояния:

```bash
curl http://localhost:3000/api/v1/health
```

Production-сборка:

```bash
npm run build
npm run start:prod
```
