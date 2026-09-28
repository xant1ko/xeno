#!/usr/bin/env sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
ENV_FILE="$PROJECT_DIR/.env.dev"
COMPOSE_FILE="$PROJECT_DIR/compose.yaml"
COMPOSE_DEV_FILE="$PROJECT_DIR/compose.dev.yaml"
DEV_PROJECT="xeno-dev" # Должно совпадать с project name в Makefile, чтобы выбрать dev MongoDB volume.
if [ ! -f "$ENV_FILE" ]; then
  echo "Не найден $ENV_FILE"
  echo "Создайте его командой: cp $PROJECT_DIR/.env.dev.example $ENV_FILE"
  exit 1
fi
if ! command -v docker >/dev/null 2>&1; then
  echo "Ошибка: Docker не найден."
  exit 1
fi
set -a
. "$ENV_FILE"
set +a
docker compose -p "$DEV_PROJECT" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" -f "$COMPOSE_DEV_FILE" exec -T mongodb \
  mongosh --quiet \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  "mongodb://127.0.0.1:27017/$MONGO_DATABASE" \
  --eval 'const result = db.operations.deleteMany({}); print(`Удалено операций: ${result.deletedCount}`);'
