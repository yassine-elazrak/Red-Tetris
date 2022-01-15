PROJECT_NAME	= Tetris 

# -f is not used because --env-file is not available on the version of docker-compose
# the VM uses.
AIRFLOW_UID		= $(shell id -u)
COMPOSE			= docker-compose -p $(PROJECT_NAME) -f  docker-compose.yaml
NEW_FILE		= touch
RM				= rm -rf
NPM 			= npm run 
INSTALL			= npm install

all:
	@$(NPM) dev

install:
	@$(INSTALL)

# build images separately, without starting the containers.

build:
	$(COMPOSE) build  --no-cache

# build the service's images and run the containers in the background.
# ensure containers are down before performing up.
.up: clean
	$(COMPOSE) up -d --build

clean: 
	$(COMPOSE) down 

# Deletes docker volumes, but persistance should remain as ~/data directories
# are left untouched. 
fclean:
	$(COMPOSE)  down --rmi all 

## generate ssl for https	

	
# $(COMPOSE) exec webserver nginx -s reload

    
# stop the containers

# Delete docker volumes and up (data should persist)
re: fclean all

# /!\ ROOT ACCESS REQUIRED /!\
# Cleanup the entire docker environment as well as volumes that persisted.
prune: fclean
	docker system prune  --all --force

.PHONY: build clean fclean all re .up ssl down