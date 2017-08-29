# Backend - Table of Content

* [Requirements](#requirements)
* [Build](#build-and-run)
* [Test](#running-tests)
* [Lint](#running-lint) 
* [API Documentation](#api-documentation)
  * [Auth](#auth)
  * [FoodItemTemplate](#fooditemtemplate)
  * [Log](#log)
  * [Recipe](#recipe)
  * [SocoboUser](#socobouser)
* [Enums](#enums)


## Requirements
- node
- npm
- mongoDB server
- _OPTIONAL homebrew (for mongoDB server service)_

## Build and Run

1. start your local mongodb server (_OPTIONAL_)

    ```bash
    npm run start:m
    ```

2. create database, collections and fill collections with demo data

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

## Running tests

```bash
npm test
```

## Running lint

```bash
npm run lint
```

## API Documentation

### **Auth**

- **POST /api/v1/auth/login**

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
      socobouser: {
        id: string,
        username: string,
        email: string,
        hasTermsAccepted: boolean,
        role: string|Role,
        provider: string|Provider,
        imageUrl: string,
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

- **POST /api/v1/auth/register**

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
      id: string,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
      role: string|Role,
      provider: string|Provider,
      imageUrl: string,
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

### **FoodItemTemplate**

- **GET /api/v1/fooditemtemplate**

  Response body:
    ```json
    [
      {
        id: string,
        name: string,
        created: number,
        lastModified: number
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

- **GET /api/v1/fooditemtemplate/:id**

  Path Parameter:
    - id: Fooditem Template id

  Response body:
    ```json
    {
      id: string,
      name: string,
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

- **PUT /api/v1/fooditemtemplate/:id**

  Path Parameter:
    - Fooditem Template id

  Request body:
    ```json
    {
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      name: string,
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

- **POST /api/v1/fooditemtemplate/**

  Path Parameter:
    - Fooditem Template id

  Request body:
    ```json
    {
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      name: string,
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

- **DELETE /api/v1/fooditemtemplate/:id**

  Path Parameter:
    - id: Fooditem Template id

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

### **Log**

- **GET /api/v1/log/errors**

  **_This route is only with admin rights accessable!_**

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

### **Recipe**

- **GET /api/v1/recipes**

  Response body:
    ```json
    [
      {
        id: number,
        title: string,
        userid: number,
        description: number,
        imageurl: string,
        created: Date,
        steps: [
          {
            id: number,
            recipeId: number,
            stepNumber: number,
            stepTitle: string,
            stepDescription?: string,
            createdDate: number,
            lastModifiedDate: number
          },
          {
            ...
          }
        ]
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

- **GET /api/v1/recipes/:id**

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
      created: Date,
      steps: [
        {
          id: number,
          recipeId: number,
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string,
          createdDate: number,
          lastModifiedDate: number
        },
        {
          ...
        }
      ]
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

- **GET /api/v1/recipes?property=value**

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
        created: Date,
        steps: [
          {
            id: number,
            recipeId: number,
            stepNumber: number,
            stepTitle: string,
            stepDescription?: string,
            createdDate: number,
            lastModifiedDate: number
          },
          {
            ...
          }
        ]
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

- **GET /api/v1/recipes/search?property=searchTerm**

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
        created: Date,
        steps: [
          {
            id: number,
            recipeId: number,
            stepNumber: number,
            stepTitle: string,
            stepDescription?: string,
            createdDate: number,
            lastModifiedDate: number
          },
          {
            ...
          }
        ]
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

- **PUT /api/v1/recipes/:id**

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
      imageurl?: string,
      steps?: [
        {
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string
        },
        {
          ...
        }
      ]
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
      created: Date,
      steps: [
        {
          id: number,
          recipeId: number,
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string,
          createdDate: number,
          lastModifiedDate: number
        },
        {
          ...
        }
      ]
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

- **POST /api/v1/recipes**

  Request body:
    ```json
    {
      title: string,
      userId: string,
      description?: string,
      imageurl?: string,
      steps?: [
        {
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string
        },
        {
          ...
        }
      ]
    }
    ```

  Response body:
    ```json
    {
      id: number,
      userId: number,
      title: string,
      description?: string,
      imageurl?: string,
      created: Date,
      steps: [
        {
          id: number,
          recipeId: number,
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string,
          createdDate: number,
          lastModifiedDate: number
        },
        {
          ...
        }
      ]
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

- **POST /api/v1/recipes/:id/image**

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
      created: Date,
      steps: [
        {
          id: number,
          recipeId: number,
          stepNumber: number,
          stepTitle: string,
          stepDescription?: string,
          createdDate: number,
          lastModifiedDate: number
        },
        {
          ...
        }
      ]
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

- **DELETE /api/v1/recipes/:id**

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

### **SocoboUser**

- **GET /api/v1/socobouser**

  **_This route is only with admin rights accessable!_**

  Response body:
    ```json
    [
      {
        id: string,
        username: string,
        email: string,
        hasTermsAccepted: boolean,
        role: string|Role,
        provider: string|Provider,
        imageUrl: string,
        created: number,
        lastModified: number
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

- **GET /api/v1/socobouser/:id**

  Path Parameter:
    - id: User id

  Response body:
    ```json
    {
      id: string,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
      role: string|Role,
      provider: string|Provider,
      imageUrl: string,
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

- **PUT /api/v1/socobouser/:id**

  Path Parameter:
    - id: User id

  Request body:
    ```json
    {
      updateType: UpdateType,
      fieldValues: {
        update-type specific socoboUser-Property: number|string|boolean|Role|Provider,
        ...
      }
    }
    ```

  Response body:
    ```json
    {
      id: string,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
      role: string|Role,
      provider: string|Provider,
      imageUrl: string,
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

- **POST /api/v1/socobouser/:id/upload**

  Uploads a provided image file to the server for the current user and updates
  the related user in the database.

  Path Parameter:
    - id: User id

  Request header:
    ```bash
    Content-Type = multipart/form-data
    ```

  Request body:
    ```bash
    key = socoboUserImage,
    value = file
    ```

  Response body:
    ```json
    {
      id: string,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
      role: string|Role,
      provider: string|Provider,
      imageUrl: string,
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

- **DELETE /api/v1/socobouser/:id**

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

## Enums

  - Role:
    - Admin
    - User

  - Provider:
    - Email
    - Username

  - UpdateType:
    - 0 = full
      - fields: username, email, password, imageUrl, role, provider
    - 1 = username
      - fields: username
    - 2 = email
      - fields: email
    - 3 = password
      - fields: password
    - 4 = image
      - fields: imageUrl
    - 5 = role
      - fields: role
    - 6 = provider:
      - fields: provider
