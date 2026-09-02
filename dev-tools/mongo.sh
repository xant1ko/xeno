#!/usr/bin/env sh

# Останавливаем выполнение при ошибке или необъявленной переменной.
set -eu

# Определяем директорию этого скрипта независимо от текущей директории.
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
# Используем локальный env-файл рядом с compose-конфигурацией.
ENV_FILE="$SCRIPT_DIR/.env"
# Используем compose-файл из той же директории.
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

# Проверяем, что Docker установлен и доступен.
if ! command -v docker >/dev/null 2>&1; then
  echo "Ошибка: Docker не найден."
  exit 1
fi

# Проверяем наличие env-файла с логином и паролем.
if [ ! -f "$ENV_FILE" ]; then
  echo "Не найден $ENV_FILE"
  echo "Создайте его командой: cp $SCRIPT_DIR/.env.example $ENV_FILE"
  exit 1
fi

# Запускаем MongoDB в фоне по умолчанию.
COMMAND=${1:-up}

# Выполняем запрошенную операцию над MongoDB.
case "$COMMAND" in
  up)
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d
    ;;
  down)
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" down
    ;;
  logs)
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs -f mongodb
    ;;
  status)
    docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
    ;;
  *)
    echo "Использование: $0 {up|down|logs|status}"
    exit 1
    ;;
esac
