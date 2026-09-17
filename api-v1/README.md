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

## Пользователи

API подготавливает хранение пользователей в коллекции `users`: логин нормализуется без учёта
регистра, а пароль сохраняется только в виде Argon2id-хеша.

Ручки авторизации:

- `POST /api/v1/auth/register` — регистрация по логину и паролю;
- `POST /api/v1/auth/login` — вход и получение JWT;
- `GET /api/v1/auth/me` — текущий пользователь по заголовку `Authorization: Bearer <token>`.

Настройки JWT задаются через `JWT_SECRET` и `JWT_EXPIRES_IN` в `.env`.

Все ручки операций и CSV-импорта требуют JWT. Операции привязаны к пользователю: каждый аккаунт
видит, импортирует и изменяет только собственные записи.

Production-сборка:

```bash
npm run build
npm run start:prod
```
