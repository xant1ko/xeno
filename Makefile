#SHELL := /bin/bash
SHELL := /usr/bin/env bash

WEB_DIR=web
API_DIR=api-v1
DEV_TOOLS_DIR=dev-tools
MONGO_SCRIPT=$(DEV_TOOLS_DIR)/mongo.sh

# Короткие команды для полного Docker-стека. Перед первым запуском скопируйте
# соответствующий .env.*.example в .env.dev или .env.prod.
COMPOSE=docker compose
DEV_COMPOSE=$(COMPOSE) --env-file .env.dev -f compose.yaml -f compose.dev.yaml
PROD_COMPOSE=$(COMPOSE) --env-file .env.prod -f compose.yaml -f compose.prod.yaml

# --- Docker Compose ---

.PHONY: dev-up dev-down dev-build dev-deps dev-rebuild dev-logs dev-ps
# Запускаем development-стек с пересборкой образов и выводом логов в консоль.
dev-up:
	$(DEV_COMPOSE) up --build

# Останавливаем development-контейнеры, не удаляя volume с данными MongoDB.
dev-down:
	$(DEV_COMPOSE) down

# Пересобираем development-образы без запуска контейнеров.
dev-build:
	$(DEV_COMPOSE) build

# Синхронизируем package-lock.json с именованными node_modules volumes development-стека.
# Это нужно после npm install: bind mount скрывает node_modules, установленные в новом Docker-образе.
dev-deps:
	$(DEV_COMPOSE) stop api web
	$(DEV_COMPOSE) run --rm --no-deps api npm ci
	$(DEV_COMPOSE) run --rm --no-deps web npm ci
	$(DEV_COMPOSE) up -d --force-recreate

# Полностью пересобираем образы без Docker-кеша, затем обновляем node_modules в development-volumes.
# MongoDB volume не удаляется: данные базы сохраняются, как и при обычном dev-up.
dev-rebuild:
	$(DEV_COMPOSE) build --no-cache
	$(MAKE) dev-deps

# Открываем поток логов всех сервисов development-стека.
dev-logs:
	$(DEV_COMPOSE) logs -f

# Показываем состояние development-контейнеров и healthchecks.
dev-ps:
	$(DEV_COMPOSE) ps

.PHONY: prod-up prod-down prod-build prod-logs prod-ps
# Запускаем production-стек в фоне после пересборки образов.
prod-up:
	$(PROD_COMPOSE) up -d --build

# Останавливаем production-контейнеры, сохраняя данные MongoDB.
prod-down:
	$(PROD_COMPOSE) down

# Собираем production-образы; используйте после обновления зависимостей или кода.
prod-build:
	$(PROD_COMPOSE) build

# Открываем поток логов production-стека.
prod-logs:
	$(PROD_COMPOSE) logs -f

# Показываем состояние production-контейнеров и healthchecks.
prod-ps:
	$(PROD_COMPOSE) ps

# --- web ---

.PHONY: start_web
start_web:
	cd $(WEB_DIR); npm i; npm run dev $(ARGS)

.PHONY: web_lint_fix
web_lint_fix:
	cd $(WEB_DIR); npm run lint:fix $(ARGS)

.PHONY: web_check
web_check:
	cd $(WEB_DIR); npm run check $(ARGS)

.PHONY: web_check_fix
web_check_fix:
	cd $(WEB_DIR); npm run check:fix $(ARGS)

# --- api ---

.PHONY: start_api
# Устанавливаем зависимости и запускаем API в режиме разработки.
start_api: start_db
	cd $(API_DIR); npm i; npm run start:dev $(ARGS)

# --- dev db ---

.PHONY: start_db
start_db:
	./$(MONGO_SCRIPT) up

.PHONY: dev_db_down
dev_db_down:
	./$(MONGO_SCRIPT) down

.PHONY: dev_db_logs
dev_db_logs:
	./$(MONGO_SCRIPT) logs

.PHONY: dev_db_status
dev_db_status:
	./$(MONGO_SCRIPT) status
