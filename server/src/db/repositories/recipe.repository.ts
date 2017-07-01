import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, RecipeStep } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class RecipeRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getById = (id: number): Promise<Recipe> => {
    const query = `select * from recipes where recipes.id = $1`;
    return this._db.one(query, [id], this._transformResult)
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NOT_FOUND, error,
          RecipeRepository.name, "getById(..)", "id", id.toString());
      });
  }

  public getAll = (): Promise<Recipe[]> => {
    const query = `select * from recipes`;
    return this._db.many(query, [])
      .then((result) => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NON_AVAILABLE, error, RecipeRepository.name,
          "getAll(..)");
      });
  }

  public getByField = (field: string,
    value: string | number): Promise<Recipe[]> => {
    const query: string = `select * from recipes where ${field} = $1`;
    return this._db.many(query, [value])
      .then((result) => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NOT_FOUND, error, RecipeRepository.name,
          "getByField(..)", "a field of value", value.toString());
      });
  }

  public searchByField = (field: string,
    value: string | number): Promise<Recipe[]> => {
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
    return this._db.tx("DeleteRecipe", () => {
      return this._db.none(query, [id])
      .catch((error: any) => {
        return ErrorUtils.handleDbError(
          error, RecipeRepository.name, "delete(..)");
      });
    });
  }

  private _saveRecipeCoreQuery = (recipe: Recipe) => {
    const query: string = `insert into recipes(
                             title, userId, description,
                             imageUrl, created)
                           values($1, $2, $3, $4, $5)
                           returning id`;
    return this._db.one(query, [
        recipe.title, recipe.userId, recipe.description,
        recipe.imageUrl, recipe.created]);
  }

  public save = (recipe: Recipe): Promise<any> => {
    return this._db.tx("SaveRecipeCoreDate", (t) => {
      return this._saveRecipeCoreQuery(recipe);      
    })
    .then((id: any) => {
      recipe.id = id.id;
      return this._db.tx("SaveRecipeSteps", (t) => {
          return this._db.recipeSteps.save(recipe.steps, recipe);
      })
    })
    .catch((error: any) => {
      console.log("Error", error)
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "save(..)");
    });
  }

  public update = (id: number, recipe: Recipe): Promise<Recipe> => {
    const query: string = `update recipes set
                             title=$2, userId=$3, description=$4,
                             imageUrl=$5
                           where recipes.id = $1`;
    return this._db.tx("UpdateRecipe", () => {
      return this._db.none(query, [
        id, recipe.title, recipe.userId, recipe.description,
        recipe.imageUrl]);
    }).catch((error: any) => {
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
    delete transformedResult.fields;
    return transformedResult;
  }
}
