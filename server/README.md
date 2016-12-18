# Backend

## Requirements
- node
- npm
- postgres server

## Build and Run

1. start your local postgres server
2. create database, demo table and fill table with demo data

    ```bash
    npm run setup:db
    ```
3. start server

    development server
    ```bash
    npm run start:d
    ```

    or

    production server
    ```bash
    npm run start:p
    ```

## Test API
  
    - localhost:8282/api/v1/users
    - localhost:8282/api/v1/users/1
    - localhost:8282/api/v1/users/2

## Running unit tests

```bash
npm test
```