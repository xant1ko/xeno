# api-v1

Базовый API-сервис на NestJS.

## Запуск

```bash
npm install
cp .env.example .env
npm run start:dev
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
