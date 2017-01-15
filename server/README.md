# Backend

## Requirements
- node
- npm
- postgres server

## Build and Run

1. start your local postgres server
2. create database, demo table and fill table with demo data

    for production
    ```bash
    npm run setup:db:p
    ```

    or

    for development
    ```bash
    npm run setup:db:d
    ```

    or

    for testing
    ```bash
    npm run setup:db:t
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

## API Documentation

### **AUTH**

**POST /api/v1/auth/login**

Request body:
  ```json
  {
    "name": "Username",
    "password": "HighSecureUserPassword"
  }
  ```

  or

  ```json
  {
    "email": "username@test.test",
    "password": "HighSecureUserPassword"
  }
  ```

Response body:
  ```json
  {
    "token": String,
    "user": {
      id: number,
      username: string,
      email: string,
      image: string,
      hasTermsAccepted: boolean,
      isAdmin: boolean,
      provider: string,
      created: number,
      lastModified: number
    }
  }
  ```

Error body:
  ```json
  {
    "message": string,
    "source": string,
    "method": string
  }
  ```

**POST /api/v1/auth/register**

Request body:
  ```json
  {
    "name": "Username",
    "password": "HighSecureUserPassword"
  }
  ```

  or

  ```json
  {
    "email": "username@test.test",
    "password": "HighSecureUserPassword"
  }
  ```

Response body:
  ```json
  {
    id: number,
    username: string,
    email: string,
    image: string,
    hasTermsAccepted: boolean,
    isAdmin: boolean,
    provider: string,
    created: number,
    lastModified: number
  }
  ```

Error body:
  ```json
  {
    "message": string,
    "source": string,
    "method": string
  }
  ```

### **USERS**

**GET /api/v1/users**

Response body:
  ```json
  [
    {
      id: number,
      username: string,
      email: string,
      image: string,
      hasTermsAccepted: boolean,
      isAdmin: boolean,
      provider: string,
      created: number,
      lastModified: number
    },
    {...}
  ]
  ```

Error body:
  ```json
  {
    "message": string,
    "source": string,
    "method": string
  }
  ```

**GET /api/v1/users/:id**

Path Parameter:
  - id: User id

Response body:
  ```json
  {
    id: number,
    username: string,
    email: string,
    image: string,
    hasTermsAccepted: boolean,
    isAdmin: boolean,
    provider: string,
    created: number,
    lastModified: number
  }
  ```

Error body:
  ```json
  {
    "message": string,
    "source": string,
    "method": string
  }
  ```

### **LOGS**

**GET /api/v1/logs/errors**

```json
  [
    {
      message: string.
      name: string
      timestamp: number,
      statusCode: number,
      code: string,
      source: string,
      sourceMethod: string,
      error: Object,
      query?: string
    },
    {...}
  ]
  ```

## Running tests

```bash
npm test
```