# Dev tools

Локальный запуск MongoDB для разработки.

## Первый запуск

```sh
cp dev-tools/.env.example dev-tools/.env
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

## Очистка операций полного development-стека

Когда приложение запущено через основной Compose (`make dev-up`), удалить все записи операций можно командой:

```sh
make dev-clear-operations
```

Команда использует корневой `.env.dev`, удаляет только документы из коллекции `operations` и выводит их количество. Пользователи и остальные данные MongoDB сохраняются.
