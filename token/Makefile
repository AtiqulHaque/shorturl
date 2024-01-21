LOCAL_UID	?= $(shell id -u)
LOCAL_GID	?= $(shell id -g)
DOCKER_USER	?= ${LOCAL_GID}:${LOCAL_UID}
SERVICE_NAME ?= app

all: help;
default: help;

run:
	echo $(SERVICE_NAME);

.PHONY: all up clean configure shell root-shell help

up: #: Start the development environment services
	docker compose up --attach ${SERVICE_NAME}

upd: #: Start the development environment services in daemon mode
	docker compose up -d

test-dockerfile: # Build an image and run it locally
	docker build -t ${SERVICE_NAME} .
	docker run --rm -ti -p 8080:8080 --env-file ./.env ${SERVICE_NAME}

clean: #: Bring down containers, remove all data
	docker compose down --remove-orphans --volumes

create-index: #: Create db indexes
	docker compose run --rm -ti app npm run create_indexes

configure: #: Fix permissions, deal with dependencies
	docker compose pull
	docker compose run -u ${DOCKER_USER} --rm -ti --no-deps ${SERVICE_NAME} npm install

shell: #: Enter user-mode shell (same UID:GID as host user)
	docker compose run -u ${DOCKER_USER} --rm -ti ${SERVICE_NAME} bash

root-shell: #: Enter root-mode shell (as root user in container)
	docker compose run --rm -ti ${SERVICE_NAME} bash

help: #: Show this help
	@fgrep -h "#-" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/#-\s//'
	@printf "\n"
	@printf "Common targets:\n"
	@fgrep -h "#+" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -Ee "s/([^:]+)(.*)(#\+(.*))/- \1:\4/g"
	@printf "\nAvailable target groups:\n"
	@fgrep -h "#?" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -Ee "s/^\#\? ([^:]+)\: (.*)/- \1: \2/g" | sort -bfi
	@printf "\nAvailable targets:\n"
	@fgrep -h "#:" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -Ee "s/([^:]+)(.*)(#:(.*))/- \1:\4/g" | sort -bfi

# Catch all
%:
	@echo 'ERROR: invalid stage'
