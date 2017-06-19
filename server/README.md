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
      role: Role,
      provider: ProviderType,
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
    email: string,
    password: string,
    role: Role
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
    role: Role,
    provider: ProviderType,
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
      role: Role,
      provider: ProviderType,
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
    role: Role,
    provider: ProviderType,
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

**PUT /api/v1/users/:id**

Path Parameter:
  - id: User id

Request body:
  ```json
  {
    updateType: UpdateType,
    fieldValues: [
      value: string,
      ...
    ]
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
    role: Role,
    provider: ProviderType,
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

**DELETE /api/v1/users/:id**

Path Parameter:
  - id: User id

Response body:
  ```json
  {
    id: number
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

**GET /api/v1/recipes**

Response body:
  ```json
  [
    {
      id: number,
      title: string,
      userid: number,
      description: number,
      imageurl: string,
      created: Date
    },
    {
      ...
    }
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

**GET /api/v1/recipes?property=value**

Gets all recieps for the defined property value

Query parameter:
  - property: The name of the recipe property which should be used as filter
  - value: The to filter on

Response body:
  ```json
  [
    {
      id: number,
      title: string,
      userid: number,
      description: number,
      imageurl: string,
      created: Date
    },
    {
      ...
    }
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
**GET /api/v1/recipes/search?property=searchTerm**

Searches for a specified term inside a the given recipe property and returns
the matching subset of recipes

Query parameter:
  - property: The name of the recipe property after which should be searched
  - searchTerm: The term which will be searched

Response body:
  ```json
  [
    {
      id: number,
      title: string,
      userid: number,
      description: number,
      imageurl: string,
      created: Date
    },
    {
      ...
    }
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

**DELETE /api/v1/recipes/:id**

Deletes the recipe found for the given id

Path Parameter:
  - id: The id of the recipe which should be deleted

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

**POST /api/v1/recipes/:id/image**

Uploads a provided image file to the server for the current user and updates
the related recipe in the database.

Request body:

```
  multipart/form-data:

  key: recipeImage
  value: image file
```

Response body:
  ```json
  {
    id: number,
    title: string,
    userid: number,
    description?: string,
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

**PUT /api/v1/recipes/:id**

Alters the properties, defined in the request body, on the recipe with the
provided id. The request body must contain all recipe properties except the id.
To update only specific field you need to define these fields in the fields query parameter.
If a fields query prameter is defined, only these fields will be updated.

Path Parameter:
  - id: Recipe id

Query Parameter:
  - fields: The fields which should be updated (title, description, imageUrl, userId)

Request body (could also be a subset of these values):
  ```json
  {
    title?: string,
    userId?: string,
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
    description: string,
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

## Enums

Role:
  - 0 = Admin
  - 1 = User

ProviderType:
  - 0 = Email
  - 1 = Username

UpdateType:
  - 0 = full
  - 1 = username
  - 2 = email
  - 3 = password
  - 4 = image

## Running tests

```bash
npm test
```
