# Products & Categories

This repository contains a NestJS-Typescript-Zod API server with endpoints for products, categories and images for an imaginary e-commerce service. Please add e2e tests and DB integration tests with the already provided test setup in this repo. You are also welcome to add your own testing tools but all of the tests must be runnable by a single step in the npm run script in package.json.

You are expected to only focus on these search related endpoints:

- /search
- /products/search
- /categories/search

## API Server Description

A basic CRUD server with nest, prisma, mysql, zod, docker, multer and jest.

CRUD endpoints are available at /api. OpenAPI document can be downloaded from /api-json. By default swagger-ui should be located at

http://localhost:3333/api

## Docker Image

To use the dockerized setup, please run:

```
docker-compose up
```

Please make sure port 3333 and 3306 are not currently being used. Alternatively, please adjust the PORT and DB_PORT configs in .env file.
(Sample config for .env is given in .env.sample.)

## Unit Tests

The test report is generated using `jest-html-reporter` and is located in project root at `test-report.html`. Test coverage report is located in `/coverage/lcov-report/index.html`.

- The repo contains strictly unit tests only as per the task. Integration tests and e2e tests could be added for deeper coverage.

## Future Improvements

- A cron-job or a scheduled service could check and prune images on disk that are not being used by any product/category. I have not inlined disk access e.g. with `fs.unlink` within the API call-response cycle to save avoidable disk write requests and keeping the endpoint response latency low.

- Config options could also be validated using zod, using the same pattern, when config becomes complex or ambiguous.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## For development

`dev-db.compose.yml` provides lax settings so that you can use root access for prisma shadow mysql db to keep track of schema drift.

```bash
$ docker compose -f dev-db.compose.yml up -d
$ npm i
$ npm exec prisma db push
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Looking forward to hearing from you!

- Author - [Risav Karna](https://github.com/risavkarna)
- Website - [risav.dev](https://risav.dev/)
- Email - [prodcatapi@risav.dev](mailto:prodcatapi@risav.dev)
- Twitter (& most social media) - [@risavkarna](https://twitter.com/risavkarna)
