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
    return this._db.many(this._GET_BY_ID, [])
      .then(result => result.map(this._transformResult))
      .catch((error: any) => {
        return ErrorUtils.handleDbError(
          error, RecipeRepository.name, "getById(..)");
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
