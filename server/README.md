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
    username: string,
    password: string
  }
  ```

  or

  ```json
  {
    email: string,
    password: string
  }
  ```

Response body:
  ```json
  {
    token: string,
    user: {
      id: number,
      username: string,
      email: string,
      image: string,
      hasTermsAccepted: boolean,
      role: number,
      provider: number,
      created: number,
      lastModified: number
    }
  }
  ```

Error body:
  ```json
  {
    message: string,
    source: string,
    method: string
  }
  ```

**POST /api/v1/auth/register**

Request body:
  ```json
  {
    username: string,
    password: string,
    role: number
  }
  ```

  or

  ```json
  {
    email: string,
    password: string,
    role: number
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
    role: number,
    provider: number,
    created: number,
    lastModified: number
  }
  ```

Error body:
  ```json
  {
    message: string,
    method: string,
    source: string
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
      role: number,
      provider: number,
      created: number,
      lastModified: number
    },
    {...}
  ]
  ```

Error body:
  ```json
  {
    message: string,
    method: string,
    source: string
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
    role: number,
    provider: number,
    created: number,
    lastModified: number
  }
  ```

Error body:
  ```json
  {
    message: string,
    method: string,
    source: string
  }
  ```

### **RECIPES**

**GET /api/v1/recipes/:id**

Path Parameter:
  - id: Recipe id

Response body:
  ```json
  {
    id: number,
    title: string,
    userid: number,
    description: number,
    imageurl: string,
    created: Date
  }
  ```

Error body:
  ```json
  {
    message: string,
    method: string,
    source: string
  }
  ```

**POST /api/v1/recipes**

Request body:
  ```json
  {
    title: string,
    userId: string,
    description?: string,
    imageurl?: string
  }
  ```

Response body:
  ```json
  {
    id: number,
    title: string,
    userid: number,
    description?: string,
    imageurl?: string,
    created: Date
  }
  ```

Error body:
  ```json
  {
    message: string,
    method: string,
    source: string
  }
  ```

### **LOGS**

**GET /api/v1/logs/errors**

Response body:
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