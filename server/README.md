# Backend - Table of Content

* [Requirements](#requirements)
* [Build](#build-and-run)
* [Test](#running-tests)
* [Lint](#running-lint)
* [API Documentation](#api-documentation)
  * [Auth](#auth)
  * [FoodItemTemplate](#fooditemtemplate)
  * [FoodItemCategory](#fooditemcategory)
  * [FoodItemUnit](#fooditemunit)
  * [FoodItem](#fooditem)
  * [Log](#log)
  * [Recipe](#recipe)
  * [Recipe Category](#recipe-category)
  * [Recipe Ingredient](#recipe-ingredient)
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

### Use Docker to run a mongo db with mock data

1. Install some Docker engine for your system (e.g Docker for Mac)

2. npm script to start the mongodb via docker

```bash
#Start a mongo db on the default port which is populated with mock data
npm run docker:db:d
```

This script starts a mongo db in a docker container and fill it with mock data.

3. Start your app with npm run start:d

4. More

- To add new mock data, add a new mongodb-seed section in the docker-compose file

- Other docker commands to mangage your environment

```bash
#Start a mongodb terminal client to check your db content
npm run docker:c
```

```bash
# Clean up your containers => removes the started docker containers
npm run docker:r
```

## Running tests

```bash
npm test
```

```bash
# With docker
npm run test:d
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

  Query Parameter:
  - resolve: If this query parameter is set, the response will not only contain the category ids and unit id, but the complete category and unit data

  Response body:
    ```json
    [
      {
        id: string,
        categoryIds: [string],
        unitId: string,
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

  Query Parameter:
  - resolve: If this query parameter is set, the response will not only contain the category ids and unit id, but the complete category and unit data

  Response body:
    ```json
    {
      id: string,
      categoryIds: [string],
      unitId: string,
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
      categoryIds: [string],
      unitId: string,
      name: string,
      created: number
    }
    ```

  Response body:
    ```json
    {
      id: string,
      categoryIds: [string],
      unitId: string,
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
      categoryIds: [string],
      unitId: string,
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      categoryIds: [string],
      unitId: string,
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
      id: string
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

### **FoodItemCategory**

- **GET /api/v1/fooditemcategory**

  Response body:
    ```json
    [
      {
        id: string,
        foodItemId: string,
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

- **GET /api/v1/fooditemcategory/:id**

  Path Parameter:
    - id: Fooditem Category id

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **PUT /api/v1/fooditemcategory/:id**

  Path Parameter:
    - Fooditem Category id

  Request body:
    ```json
    {
      foodItemId: string,
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **POST /api/v1/fooditemcategory/**

  Path Parameter:
    - Fooditem Category id

  Request body:
    ```json
    {
      foodItemId: string,
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **DELETE /api/v1/fooditemcategory/:id**

  Path Parameter:
    - id: Fooditem Category id

  Response body:
    ```json
    {
      id: string
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

### **FoodItemUnit**

- **GET /api/v1/fooditemunit**

  Response body:
    ```json
    [
      {
        id: string,
        foodItemId: string,
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

- **GET /api/v1/fooditemunit/:id**

  Path Parameter:
    - id: Fooditem Unit id

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **PUT /api/v1/fooditemunit/:id**

  Path Parameter:
    - Fooditem Unit id

  Request body:
    ```json
    {
      foodItemId: string,
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **POST /api/v1/fooditemunit/**

  Path Parameter:
    - Fooditem Unit id

  Request body:
    ```json
    {
      foodItemId: string,
      name: string
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemId: string,
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

- **DELETE /api/v1/fooditemunit/:id**

  Path Parameter:
    - id: Fooditem Unit id

  Response body:
    ```json
    {
      id: string
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

### **FoodItem**

- **GET /api/v1/fooditem**

  Query Parameter:
  - socobouserid: If this query parameter is set, the response will only contain the food items for the specfic user

  Response body:
    ```json
    [
      {
        id: string,
        foodItemTemplateId: string,
        socoboUserId: string,
        amount: string,
        bestBefore: number,
        created: number,
        lastModified: number
      },
      {
        ...
      }
    ]
    ```

    Query Parameter:
    - resolve: If this query parameter is set, the response will not only contain the template and user ids, but the complete template and user data

    ```json
    [
      {
        id: string,
        foodItemTemplate: {
          id: string,
          categoryIds: [string],
          unitId: string,
          name: string,
          created: number,
          lastModified: number
        },
        socoboUser: {
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
        amount: string,
        bestBefore: number,
        created: number,
        lastModified: number
      },
      {
        ...
      }
    ]
    ```

    Query Parameter:
    - resolve-deep: If this query parameter is set, the response will not only contain the template and user ids, but the complete template w/ complete categories and unit data and user data

    ```json
    [
      {
        id: string,
        foodItemTemplate: {
          id: string,
          categories: [
            {
              id: string,
              name: string,
              created: number,
              lastModified: number
            },
            {
              ...
            }
          ],
          unit: {
            id: string,
            name: string,
            created: number,
            lastModified: number
          },
          name: string,
          created: number,
          lastModified: number
        },
        socoboUser: {
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
        amount: string,
        bestBefore: number,
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

- **GET /api/v1/fooditem/:id**

  Path Parameter:
    - id: Fooditem id

  Response body:
    ```json
    {
      id: string,
      foodItemTemplateId: string,
      socoboUserId: string,
      amount: string,
      bestBefore: number,
      created: number,
      lastModified: number
    }
    ```

    Query Parameter:
    - resolve: If this query parameter is set, the response will not only contain the template and user ids, but the complete template and user data

    ```json
    {
      id: string,
      foodItemTemplate: {
        id: string,
        categoryIds: [string],
        unitId: string,
        name: string,
        created: number,
        lastModified: number
      },
      socoboUser: {
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
      amount: string,
      bestBefore: number,
      created: number,
      lastModified: number
    }
    ```

    Query Parameter:
    - resolve-deep: If this query parameter is set, the response will not only contain the template and user ids, but the complete template w/ complete categories and unit data and user data

    ```json
    {
      id: string,
      foodItemTemplate: {
        id: string,
        categories: [
          {
            id: string,
            name: string,
            created: number,
            lastModified: number
          },
          {
            ...
          }
        ],
        unit: {
          id: string,
          name: string,
          created: number,
          lastModified: number
        },
        name: string,
        created: number,
        lastModified: number
      },
      socoboUser: {
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
      amount: string,
      bestBefore: number,
      created: number,
      lastModified: number
    }
    ```

- **PUT /api/v1/fooditem/:id**

  Path Parameter:
    - Fooditem id

  Request body:
    ```json
    {
      foodItemTemplateId: string,
      socoboUserId: string,
      amount: string,
      bestBefore: number,
      created: number
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemTemplateId: string,
      socoboUserId: string,
      amount: string,
      bestBefore: number,
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

- **POST /api/v1/fooditem/**

  Path Parameter:
    - Fooditem id

  Request body:
    ```json
    {
      foodItemTemplateId: string,
      socoboUserId: string,
      amount: string,
      bestBefore: number
    }
    ```

  Response body:
    ```json
    {
      id: string,
      foodItemTemplateId: string,
      socoboUserId: string,
      amount: string,
      bestBefore: number,
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

- **DELETE /api/v1/fooditem/:id**

  Path Parameter:
    - id: Fooditem id

  Response body:
    ```json
    {
      id: string
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

  Query Parameter:

  - resolve: If this query parameter is set, the response will not only contain the category id but the complete category data

  Response body:
    ```json
    [
      {
        id: number,
        title: string,
        userid: number,
        description: number,
        imageurl: string,
        ingredients: [
          ingredientId: string,
          ...
        ],
        created: Date,
        categoryId: string,
        steps: [
          {
            id: number,
            stepNumber: number,
            stepTitle: string,
            stepDescription?: string
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

- **GET /api/v1/recipes/:id?resolve**

  Path Parameter:
    - id: Recipe id

  Query Parameter
    - resolve: If this query parameter is set, the response will not only contain the category id but the complete category data

  Response body:
    ```json
    {
      id: number,
      title: string,
      userid: number,
      description: number,
      imageurl: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
      created: Date,
      categoryId: string,
      steps: [
        {
          id: number,
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

  Error body:
    ```json
    {
      message: string,
      method: string,
      source: string
    }
    ```

- **GET /api/v1/recipes/search/field?property=searchTerm**

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
        ingredients: [
          ingredientId: string,
          ...
        ],
        created: Date,
        categoryId: string,
        steps: [
          {
            id: number,
            stepNumber: number,
            stepTitle: string,
            stepDescription?: string
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
  provided id.
  If the request body only conatains single fields of a recipe, only these fields
  will be updated. This is true for the first level of properties. E.g. if you update
  the steps of a recipe and you only provide a single step all remaining steps are
  removed since there are no data in the request.

  Path Parameter:
    - id: Recipe id

  Request body (could also be a subset of these values):
    ```json
    {
      title?: string,
      userId?: string,
      description?: string,
      imageurl?: string,
      categoryId?: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
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
      categoryId: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
      steps: [
        {
          id: number,
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

  Error body:
    ```json
    {
      message: string,
      method: string,
      source: string
    }
    ```

- **POST /api/v1/recipes**

  Special constraints:
  - At least one ingredient necessary
  - Steps must be in correct order

  Request body:
    ```json
    {
      title: string,
      userId: string,
      description?: string,
      imageurl?: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
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
      description: string,
      imageurl: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
      created: Date,
      categoryId: string,
      steps: [
        {
          id: number,
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
      description: string,
      imageurl: string,
      ingredients: [
        ingredientId: string,
        ...
      ],
      created: Date,
      categoryId: string,
      steps: [
        {
          id: number,
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

### **Recipe Category**

- **GET /api/v1/recipecategory**

  Response body:
    ```json
    [
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        title: string,
        description: string
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

- **GET /api/v1/recipecategory/:id**

  Path Parameter:

    - id: the category id

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        title: string,
        description: string
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

- **POST /api/v1/recipecategory**

  **_This route is only with admin rights accessable!_**

  Request body:
  ```json
  {
    title: string,
    description: string
  }
  ```

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        title: string,
        description: string
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

- **PUT /api/v1/recipecategory/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:

    - id: the category id

  Request body:
  ```json
  {
    title: string,
    description: string
  }
  ```

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        title: string,
        description: string
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

- **DELETE /api/v1/recipecategory/:id**

  **_This route is only with admin rights accessable!_**

  Path Parameter:

    - id: the category id

  Error body:
    ```json
    {
      message: string,
      method: string,
      source: string
    }
    ```

### **Recipe Ingredient**

- **GET /api/v1/recipeingredient**

  Query Parameter:

    - resolve: (no value needed) loads the fooditem template and adds it to
    the response body instead of the fooditemTemplateId

  Response body:
    ```json
    [
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        amount: int,
        fooditemTemplateId: string
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

- **GET /api/v1/recipeingredient/:id**

  Path Parameter:

    - id: the recipeingredient id

  Query Parameter:

    - resolve: (no value needed) loads the fooditem template and adds it to
    the response body instead of the fooditemTemplateId

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        amount: int,
        fooditemTemplateId: string
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

- **POST /api/v1/recipeingredient**

  Request body:
    ```json
    {
      amount: int,
      fooditemTemplateId: string
    }
    ```

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        amount: int,
        fooditemTemplateId: string
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

- **PUT /api/v1/recipeingredient/:id**

  Path Parameter:

    - id: the recipeingredient id

  Request body:
    ```json
    {
      amount: int,
      fooditemTemplateId: string
    }
    ```

  Response body:
    ```json
    {
        _id: string,
        updatedAt: string,
        createdAt: string,
        amount: int,
        fooditemTemplateId: string
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

- **DELETE /api/v1/recipeingredient/:id**


  Path Parameter:

    - id: the recipeingredient id

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
      id: string
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
      - fields: username, email, password, imageUrl, role, provider, hasTermsAccepted
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
    - 7 = terms
      - fields: hasTermsAccepted