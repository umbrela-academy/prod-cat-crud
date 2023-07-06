# Products & Categories

This repository contains a NestJS-Typescript-Zod API server with endpoints for products, categories and images for an imaginary e-commerce service. Please add e2e tests and DB integration tests with the already provided test setup in this repo. You are also welcome to add your own testing tools but all of the tests must be runnable by a single step in the npm run script in package.json.

You are expected to only focus on these search related endpoints:

- /search
- /products/search
- /categories/search

## CSV Module
The CSV module has create and update endpoints. The endpoints are designed to handle the uploading of csv file and store their content in the database of the product. 
#### Workflow
The endpoint receives file data as buffer. The buffer is then passed to the z-csv validator pipe. This pipe validates the file's properties, such as mimetype, size, extension and name, to ensure it matches the requirements for a CSV or Excel File.
Once the file passes the validation, is then sent  to ExcelTransformationPipe. This pipe utilizes the xlsx library, which is capable of parsing both Excel and CSV files. The ExcelTransformationPipe first converts the file buffer into an array of objects, representing the rows and columns of the CSV file.
After the conversion, the array of objects goes through validation using zod validators. 
After the valdations the array of objects is sent to the service.

In the csv service, we perform additional checks and operations of the data:
- We verify the parent and categories id exist in our database.
- As the images are provided as URLs in the csv file, we retrieve the image from the url and save them in our Minio Server.
- To fetch the images, we use the httpservice provided by NestJS, which utilizes Axios under the hood. However, we encountered an issue where we had to fetch the same image data multiple times if the same image URL was used for different products. To avoid this redundancy, we query our product image table's URL field to check if the image file already exists in our Minio server. If a match is found, we create a new product image entry in our database but utilize the same file in our Minio server.
- While fetching the image data, we also ensure that the file buffer represents an image. To perform this verification, we use the sharp library, which confirms that the buffer is indeed an image.
- To ensure atomicity during product creation, we use a transaction. Ideally, we would utilize the createMany method provided by Prisma, which allows bulk creation of products and returns the created products. However, we couldn't use this method as it only returns the count of the created products, not the actual products themselves.

To optimize the endpoint's performance, one potential improvement would be to allow uncommitted reads within the transaction. This would enable us to check if the same URL exists in the CSV file itself, avoiding multiple fetches of the same image data. Currently, we are only checking the database for duplicates, but not the CSV file itself.



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
$ cd docker/dev
$ docker compose -f dev-db.compose.yml up -d
$ docker compose -f dev-minio.compose.yml up -d
$ npm i
$ npm exec prisma db push
$ npx prisma db seed
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

- Authors - [Risav Karna](https://github.com/risavkarna), [Suman Khadka](https://github.com/sumann7916)
- Website - [risav.dev](https://risav.dev/)
- Email - [prodcatapi@risav.dev](mailto:prodcatapi@risav.dev)
- Twitter (& most social media) - [@risavkarna](https://twitter.com/risavkarna)
