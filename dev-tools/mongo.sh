#!/usr/bin/env sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ENV_FILE="$SCRIPT_DIR/.env"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
if ! command -v docker >/dev/null 2>&1; then
  echo "Ошибка: Docker не найден."
  exit 1
fi
if [ ! -f "$ENV_FILE" ]; then
  echo "Не найден $ENV_FILE"
  echo "Создайте его командой: cp $SCRIPT_DIR/.env.example $ENV_FILE"
  exit 1
fi
COMMAND=${1:-up}
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
