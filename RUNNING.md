# Running and Testing - Web App for Python Code Checking

## Pre configurations for MacBook M1 users

Change the first line of Dockerfiles **programming-api** like below

```js
FROM denoland/deno:alpine-1.31.0
```
to
```js
FROM lukechannings/deno:v1.37.0
```

## Build images

```bash
cd grader-image
docker build -t grader-image .
cd ..
```
```bash
cd e2e-playwright
docker build -t e2e-playwright .
cd ..
```
## Running app with development configurations

```bash
docker compose up
```

## Running app with production configurations

### Pre steps
1. Create copy of project.env and rename it projectprod.env
2. Change FLYWAY_URL and PGHOST to following:
 
 ```env
FLYWAY_URL=jdbc:postgresql://database-server-dab-p1-prod/database
PGHOST=database-server-dab-p1-prod
 ```

then...

```bash
docker compose -f docker-compose.prod.yml up -d
```

## Testing - Playwright

### Running all tests

```bash
docker compose run --rm --entrypoint=npx e2e-playwright playwright test
```

## Testing - k6

### Pre steps
1. Install k6 from here -> https://k6.io/docs/get-started/installation/
