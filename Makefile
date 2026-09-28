SHELL := /usr/bin/env bash

WEB_DIR=web
API_DIR=api-v1
DEV_TOOLS_DIR=dev-tools
MONGO_SCRIPT=$(DEV_TOOLS_DIR)/mongo.sh
COMPOSE=docker compose
DEV_COMPOSE=$(COMPOSE) -p xeno-dev --env-file .env.dev -f compose.yaml -f compose.dev.yaml
PROD_COMPOSE=$(COMPOSE) --env-file .env.prod -f compose.yaml -f compose.prod.yaml

.PHONY: dev-up dev-down dev-build dev-deps dev-rebuild dev-logs dev-ps dev-clear-operations
dev-up:
	$(DEV_COMPOSE) up --build
dev-down:
	$(DEV_COMPOSE) down
dev-build:
	$(DEV_COMPOSE) build
dev-deps:
	$(DEV_COMPOSE) stop api web
	$(DEV_COMPOSE) run --rm --no-deps api npm ci
	$(DEV_COMPOSE) run --rm --no-deps web npm ci
	$(DEV_COMPOSE) up -d --force-recreate
dev-rebuild:
	$(DEV_COMPOSE) build --no-cache
	$(MAKE) dev-deps
dev-logs:
	$(DEV_COMPOSE) logs -f
dev-ps:
	$(DEV_COMPOSE) ps
dev-clear-operations:
	./$(DEV_TOOLS_DIR)/clear-operations.sh

.PHONY: prod-up prod-down prod-build prod-reset-db prod-logs prod-ps
prod-up:
	$(PROD_COMPOSE) up -d --build
prod-down:
	$(PROD_COMPOSE) down
prod-build:
	$(PROD_COMPOSE) build
prod-reset-db:
	$(PROD_COMPOSE) down -v
	$(PROD_COMPOSE) up -d --build
prod-logs:
	$(PROD_COMPOSE) logs -f
prod-ps:
	$(PROD_COMPOSE) ps

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

.PHONY: start_api
start_api: start_db
	cd $(API_DIR); npm i; npm run start:dev $(ARGS)

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
