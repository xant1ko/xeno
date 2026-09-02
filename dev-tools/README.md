# Dev tools

Локальный запуск MongoDB для разработки.

## Первый запуск

```sh
cp dev-tools/.env.example dev-tools/.env
# Отредактируйте dev-tools/.env и задайте пароль.
./dev-tools/mongo.sh up
```

## Команды

```sh
./dev-tools/mongo.sh up      # Запустить MongoDB в фоне.
./dev-tools/mongo.sh down    # Остановить контейнер.
./dev-tools/mongo.sh logs    # Смотреть логи MongoDB.
./dev-tools/mongo.sh status  # Проверить состояние контейнера.
```

MongoDB доступна на `localhost:${MONGO_PORT}` из `.env` и использует указанные там root-логин и пароль.
