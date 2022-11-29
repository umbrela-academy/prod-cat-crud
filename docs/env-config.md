# TODO explain these env vars

MYSQL_USER=prisma
MYSQL_PASSWORD=topsecret123!
MYSQL_DATABASE=catprod

# https://dev.mysql.com/doc/refman/8.0/en/docker-mysql-more-topics.html

MYSQL_RANDOM_ROOT_PASSWORD=true
MYSQL_ONETIME_PASSWORD=true

DB_HOST=localhost

DB_PORT=3306
DB_SCHEMA=catprod

# Prisma database connection

DATABASE_URL=mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${DB_HOST}:${DB_PORT}/${MYSQL_DATABASE}?useUnicode=true&characterEncoding=utf8mb4

## Swagger

SWAGGER_ENABLED=true

## Also available:

## SWAGGER_PATH, SWAGGER_VERSION, SWAGGER_TITLE, SWAGGER_DESCRIPTION

## See docs/env-config.md for further information

## NestJS

## NEST_PORT=3030
