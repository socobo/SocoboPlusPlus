# Backend - Table of Content

* [Requirements](#requirements)
* [Build](#build-and-run)
* [Test](#running-tests)
* [Lint](#running-lint) 
* [API Documentation](#api-documentation)
  * [Auth](#auth)
  * [SocoboUsers](#socobousers)
  * [SocoboUserImages](#socobouserimages)
  * [SocoboUserProviders](#socobouserproviders)
  * [SocoboUserRoles](#socobouserroles)
  * [Recipes](#recipes)
  * [Logs](#logs)
* [Enums](#enums)


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
        id: number,
        socoboUserRoleId: number|Role,
        socoboUserProviderId: number|Provider,
        socoboUserImageId: number,
        username: string,
        email: string,
        hasTermsAccepted: boolean,
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
      id: number,
      socoboUserRoleId: number|Role,
      socoboUserProviderId: number|Provider,
      socoboUserImageId: number,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
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

### **SocoboUsers**

- **GET /api/v1/socobousers**

  **_This route is only with admin rights accessable!_**

  Response body:
    ```json
    [
      {
        id: number,
        socoboUserRoleId: number|Role,
        socoboUserProviderId: number|Provider,
        socoboUserImageId: number,
        username: string,
        email: string,
        hasTermsAccepted: boolean,
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

- **GET /api/v1/socobousers/:id**

  Path Parameter:
    - id: User id

  Response body:
    ```json
    {
      id: number,
      socoboUserRoleId: number|Role,
      socoboUserProviderId: number|Provider,
      socoboUserImageId: number,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
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

- **PUT /api/v1/socobousers/:id**

  Path Parameter:
    - id: User id

  Request body:
    ```json
    {
      updateType: UpdateType,
      fieldValues: [
        value: string|number,
        ...
      ]
    }
    ```

  Response body:
    ```json
    {
      id: number,
      socoboUserRoleId: number|Role,
      socoboUserProviderId: number|Provider,
      socoboUserImageId: number,
      username: string,
      email: string,
      hasTermsAccepted: boolean,
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

- **DELETE /api/v1/socobousers/:id**

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

### **SocoboUserImages**

- **GET /api/v1/socobouserimages**

  **_This route is only with admin rights accessable!_**

  Response body:
    ```json
    [
      {
        id: number,
        url: string,
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

- **GET /api/v1/socobouserimages/:id**

  Path Parameter:
    - id: SocoboUserImage id

  Response body:
    ```json
    {
      id: number,
      url: string,
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

- **PUT /api/v1/socobouserimages/:id**

  Path Parameter:
    - id: SocoboUserImage id

<<<<<<< HEAD
**GET /api/v1/recipes**
=======
  Request body:
    ```json
    {
      url: string
    }
    ```

  Response body:
    ```json
    {
      id: number,
      url: string,
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

- **POST /api/v1/socobouserimages**

  This route save images that are _not_ stored into our storage.
  
  **ATTENTION**
  
  After calling this API route it's needed to call the SocoboUser Update Route with the newly created SocoboUserImage Id. One API call should only manipulate the called resource and not multiple resources.

  Request body:
    ```json
    {
      url: string
    }
    ```
>>>>>>> origin/75-extend-database-functionality

  Response body:
    ```json
    {
      id: number,
<<<<<<< HEAD
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
=======
      url: string,
      created: number,
      lastModified: number
    }
    ```

  Error body:
    ```json
>>>>>>> origin/75-extend-database-functionality
    {
      message: string,
      method: string,
      source: string
    }
    ```

- **POST /api/v1/socobouserimages/upload**

  This route save images that are stored into our storage.

  **ATTENTION**
  
  After calling this API route it's needed to call the SocoboUser Update Route with the newly created SocoboUserImage Id. One API call should only manipulate the called resource and not multiple resources.

  Request body as form-data:
    ```bash
    key = socoboUserImage,
    value = file
    ```

  Response body:
    ```json
    {
      id: number,
      url: string,
      created: number,
      lastModified: number
    }
    ```

<<<<<<< HEAD
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

**GET /api/v1/recipes?property=value**
=======
  Error body:
    ```json
    {
      message: string,
      method: string,
      source: string
    }
    ```

- **DELETE /api/v1/socobouserimages/:id**
>>>>>>> origin/75-extend-database-functionality

  Path Parameter:
    - id: SocoboUserImage id

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

### **SocoboUserProviders**

- **GET /api/v1/sobouserproviders**

  **_This route is only with admin rights accessable!_**

  Response body:
    ```json
    [
      {
        id: number,
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

- **GET /api/v1/sobouserproviders/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:
    - id: SocoboUserProvider id

  Response body:
    ```json
    {
      id: number,
<<<<<<< HEAD
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
=======
      name: string,
      created: number,
      lastModified: number
    }
    ```

  Error body:
    ```json
>>>>>>> origin/75-extend-database-functionality
    {
      message: string,
      method: string,
      source: string
    }
    ```

- **PUT /api/v1/sobouserproviders/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:
    - id: SocoboUserProvider id

  Request body:
    ```json
    {
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: number,
<<<<<<< HEAD
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
=======
      name: string,
      created: number,
      lastModified: number
    }
    ```

  Error body:
    ```json
>>>>>>> origin/75-extend-database-functionality
    {
      message: string,
      method: string,
      source: string
    }
    ```

<<<<<<< HEAD
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
=======
- **POST /api/v1/sobouserproviders**

  **_This route is only with admin rights accessable!_**

  Request body:
    ```json
    {
      name: string
    }
    ```
>>>>>>> origin/75-extend-database-functionality

  Response body:
    ```json
    {
      id: number,
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

<<<<<<< HEAD
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
=======
- **DELETE /api/v1/sobouserproviders/:id**

  **_This route is only with admin rights accessable!_**
>>>>>>> origin/75-extend-database-functionality

  Path Parameter:
    - id: SocoboUserProvider id

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

### **SocoboUserRoles**

- **GET /api/v1/sobouserroles**

  **_This route is only with admin rights accessable!_**

<<<<<<< HEAD
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
=======
  Response body:
    ```json
    [
      {
        id: number,
        name: string,
        created: number,
        lastModified: number
>>>>>>> origin/75-extend-database-functionality
      },
      {
        ...
      }
    ]
<<<<<<< HEAD
  }
  ```
=======
    ```
>>>>>>> origin/75-extend-database-functionality

  Error body:
    ```json
    {
      message: string,
      method: string,
      source: string
    }
    ```

<<<<<<< HEAD
**DELETE /api/v1/recipes/:id**

Deletes the recipe found for the given id

Path Parameter:
  - id: The id of the recipe which should be deleted
=======
- **GET /api/v1/sobouserroles/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:
    - id: SocoboUserRole id

  Response body:
    ```json
    {
      id: number,
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

- **PUT /api/v1/sobouserroles/:id**
>>>>>>> origin/75-extend-database-functionality

  **_This route is only with admin rights accessable!_**

  Path Parameter:
    - id: SocoboUserRole id

  Request body:
    ```json
    {
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: number,
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

- **POST /api/v1/sobouserroles**

  **_This route is only with admin rights accessable!_**

  Request body:
    ```json
    {
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: number,
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

- **DELETE /api/v1/sobouserroles/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:
    - id: SocoboUserRoles id

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

### **Recipes**

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

- **GET /api/v1/recipes?property=value**

  Gets all recipes for the defined property value

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

- **POST /api/v1/recipes**

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

### **Logs**

- **GET /api/v1/logs/errors**

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

## Enums

  - Role:
    - 1 = Admin
    - 2 = User

  - Provider:
    - 1 = Email
    - 2 = Username

  - UpdateType:
    - 0 = full
      - fields: username, email, password
    - 1 = username
      - fields: username
    - 2 = email
      - fields: email
    - 3 = password
      - fields: password
    - 4 = image
      - fields: socoboUserImageId
    - 5 = role
      - fields: socoboUserRoleId
    - 6 = provider:
      - fields: socoboUserProviderId
