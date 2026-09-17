#SHELL := /bin/bash
SHELL := /usr/bin/env bash

WEB_DIR=web
API_DIR=api-v1
DEV_TOOLS_DIR=dev-tools
MONGO_SCRIPT=$(DEV_TOOLS_DIR)/mongo.sh

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
