all: help
##	Available commands:

SHELL:=/bin/bash

help: Makefile
	@sed -n 's/^##//p' $<

# .PHONY: A phony target is one that is not really the name of a file; 
# rather it is just a name for a recipe to be executed when you make an explicit request.

## dev:		Run a server on development mode
dev:
	npm run dev

## prod:	Run a server on production mode
prod:
	npm run start

## build:	Build the project for production
build:
	npm run build

## test:	Run tests
test:
	npm run test

## lint:	Run linter
lint:
	npm run lint

## format:	Format code
format:
	npm run prettier