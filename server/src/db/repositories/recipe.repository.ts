import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class RecipeRepository {

  private _GET_BY_ID: string = `select * 
                                from recipes
                                where recipes.id = $1`;

  private _GET_ALL: string = `select * 
                                from recipes`;

  private _SAVE: string = `insert into recipes(
                             title, userId, description,
                             imageUrl, created)
                           values($1, $2, $3, $4, $5)
                           returning id`;
  
  private _UPDATE: string = `update recipes set
                             title=$2, userId=$3, description=$4,
                             imageUrl=$5
                           where recipes.id = $1`;

  private _DELETE: string = `delete from recipes where recipes.id = $1`;

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getById = (id: number): Promise<Recipe> => {
    return this._db.one(this._GET_BY_ID, [id], this._transformResult)
      .catch((error: any) => {
        return ErrorUtils.handleDbNotFound(
          ERRORS.RECIPE_NOT_FOUND, error, "id", id.toString(),
          RecipeRepository.name, "getById(..)");
      });
  }

  public getAll = (): Promise<Recipe[]> => {
    return this._db.many(this._GET_ALL, [])
      .then(result => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbError(
          error, RecipeRepository.name, "getAll(..)");
      });
  }

  public delete = (id: Number): Promise<void> => {
    return this._db.tx("DeleteRecipe", () => {
      return this._db.one(this._DELETE, [id])
      .catch((error: any) => {
        return ErrorUtils.handleDbError(
          error, RecipeRepository.name, "delete(..)");
      });
    });
  }

  public save = (recipe: Recipe): Promise<any> => {
    return this._db.tx("SaveRecipe", () => {
      return this._db.one(this._SAVE, [
        recipe.title, recipe.userId, recipe.description,
        recipe.imageUrl, recipe.created]);
    }).catch((error: any) => {
      return ErrorUtils.handleDbError(error, RecipeRepository.name, "save(..)");
    });
  }

  public update = (recipe: Recipe): Promise<Recipe> => {
    return this._db.tx("UpdateRecipe", () => {
      return this._db.one(this._UPDATE, [
        recipe.id, recipe.title, recipe.userId, recipe.description,
        recipe.imageUrl], this._transformResult);
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
    return transformedResult;
  }
}
