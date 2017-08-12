import { IDatabase } from "pg-promise";
import { DbExtensions, ErrorUtils, ERRORS, DbError } from "../../app/index";
import { Recipe, RecipeStep } from "../index";

export class RecipeRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  private _fetchSteps = (recipe: Recipe) => {
    return this._db.recipeSteps.get(recipe.id)
      .then((steps: RecipeStep) => {
        return {steps, recipe};
      });
  }

  private _addStepsToRecipe = (obj: any) => {
    obj.recipe.steps = obj.steps;
    return obj.recipe;
  }

  public getById = (id: number): Promise<Recipe> => {
    const query = `select * from recipes where recipes.id = $1`;
    return this._db.one(query, [id], this._transformResult)
      .then((recipe) => this._fetchSteps(recipe))
      .then((obj: any) => this._addStepsToRecipe(obj))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NOT_FOUND, error,
          RecipeRepository.name, "getById(..)", "id", id.toString());
      });
  }

  public getAll = (): Promise<Recipe[] | DbError> => {
    const query = `select * from recipes`;
    return this._db.many(query, [])
      .then((result) => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NON_AVAILABLE, error, RecipeRepository.name,
          "getAll(..)");
      });
  }

  public getByField = (field: string, value: string | number): Promise<Recipe[] | DbError> => {
    const query: string = `select * from recipes where ${field} = $1`;
    return this._db.many(query, [value])
      .then((result) => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NOT_FOUND, error, RecipeRepository.name,
          "getByField(..)", "a field of value", value.toString());
      });
  }

  public searchByField = (field: string, value: string | number): Promise<Recipe[] | DbError> => {
    const query: string = `select * from recipes where ${field} like '%${value}%'`;
    return this._db.many(query, [])
      .then((result) => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound (
          ERRORS.RECIPE_NOT_FOUND, error, RecipeRepository.name,
          "searchByField(..)", "a field of value", value.toString());
      });
  }

  public delete = (id: Number): Promise<void> => {
    const query: string = `delete from recipes where recipes.id = $1`;
    return this._db.tx("DeleteRecipe", (t) => {
      const queries = [this._db.recipeSteps.delete(id), this._db.none(query, [id])];
      return t.batch(queries)
        .catch((error: any) => {
          return ErrorUtils.handleDbError(error, RecipeRepository.name, "delete(..)");
        });
    });
  }

  private _saveRecipeCoreQuery = (recipe: Recipe) => {
    const query: string = `insert into recipes(title, userId, description, imageUrl, created)
                           values($1, $2, $3, $4, $5)
                           returning id`;
    return this._db.one(query, [recipe.title, recipe.userId, recipe.description, recipe.imageUrl, recipe.created]);
  }

  private _saveRecipeStepsQuery = (id: any, recipe: Recipe) => {
    recipe.id = id.id;
    return this._db.tx("SaveRecipeSteps", (t) => {
      this._db.recipeSteps.save(recipe.steps, recipe);
      return id;
    });
  }

  public save = (recipe: Recipe): Promise<any> => {
    return this._db.tx("SaveRecipeCoreDate", (t) => {
      return this._saveRecipeCoreQuery(recipe);
    })
    .then((id: any) => {
      return this._saveRecipeStepsQuery(id, recipe);
    })
    .catch((error: any) => {
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "save(..)");
    });
  }

  public update = (id: number, recipe: Recipe): Promise<Recipe> => {
    const query: string = `update recipes set
                             title=$2, userId=$3, description=$4, imageUrl=$5
                           where recipes.id = $1`;
    return this._db.tx("UpdateRecipe", () => {
      return this._db.none(query, [id, recipe.title, recipe.userId, recipe.description, recipe.imageUrl]);
    })
    .then(() => {
      return this._db.recipeSteps.update(recipe.steps);
    })
    .catch((error: any) => {
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "update(..)");
    });
  }

  private _transformResult = (result: any): Recipe => {
    const transformedResult: Recipe = new Recipe();
    transformedResult.id = result.hasOwnProperty("id") ? Number(result.id) : null;
    transformedResult.title = result.hasOwnProperty("title") ? result.title : null;
    transformedResult.userId = result.hasOwnProperty("userid") ? Number(result.userid) : null;
    transformedResult.description = result.hasOwnProperty("description") ? result.description : null;
    transformedResult.imageUrl = result.hasOwnProperty("imageurl") ? result.imageurl : null;
    transformedResult.created = result.hasOwnProperty("created") ? new Date(result.created) : null;
    transformedResult.steps = result.hasOwnProperty("steps") ? result.steps : null;
    delete transformedResult.fields;
    return transformedResult;
  }
}
