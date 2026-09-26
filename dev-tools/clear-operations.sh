#!/usr/bin/env sh

# Останавливаем скрипт при первой ошибке и не разрешаем использовать неинициализированные переменные.
set -eu

# Находим корень репозитория независимо от директории, из которой вызвали скрипт.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

# Используем настройки полного development-стека: именно к этой MongoDB подключается API.
ENV_FILE="$PROJECT_DIR/.env.dev"
COMPOSE_FILE="$PROJECT_DIR/compose.yaml"
COMPOSE_DEV_FILE="$PROJECT_DIR/compose.dev.yaml"
DEV_PROJECT="xeno-dev" # Должно совпадать с project name в Makefile, чтобы выбрать dev MongoDB volume.

# Без .env.dev невозможно безопасно определить целевую базу и учётные данные MongoDB.
if [ ! -f "$ENV_FILE" ]; then
  echo "Не найден $ENV_FILE"
  echo "Создайте его командой: cp $PROJECT_DIR/.env.dev.example $ENV_FILE"
  exit 1
fi

# Проверяем Docker заранее, чтобы вместо неясной ошибки shell показать действие пользователю.
if ! command -v docker >/dev/null 2>&1; then
  echo "Ошибка: Docker не найден."
  exit 1
fi

# Экспортируем значения шаблона только на время работы скрипта: они нужны mongosh для авторизации.
set -a
. "$ENV_FILE"
set +a

# deleteMany({}) удаляет исключительно документы коллекции operations: users, индексы и сама база сохраняются.
# exec вернёт ошибку, если development MongoDB не запущена, и операция не будет выполнена по неверному адресу.
docker compose -p "$DEV_PROJECT" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" -f "$COMPOSE_DEV_FILE" exec -T mongodb \
  mongosh --quiet \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  "mongodb://127.0.0.1:27017/$MONGO_DATABASE" \
  --eval 'const result = db.operations.deleteMany({}); print(`Удалено операций: ${result.deletedCount}`);'
