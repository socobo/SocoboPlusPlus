import { IDatabase } from "pg-promise";
import { UserService } from "./../../logic/services/index";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe } from "./../../models/index";

export class RecipeService {

  private _GET_BY_ID: string = `select * 
                                from recipes
                                where recipes.id = $1`;

  private _SAVE: string = `insert into recipes(
                             title, userId, description,
                             imageUrl, created)
                           values($1, $2, $3, $4, $5)
                           returning id`;

  constructor (private _db: IDatabase<any>) {}

  public getById (id: number): Promise<Recipe> {
    const promise = this._db.one(this._GET_BY_ID, [id]);
    return promise.catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.RECIPE_NOT_FOUND, error, "id", id.toString(),
        RecipeService.name, "getById(..)");
    });
  }

  public save (recipe: Recipe): Promise<any> {
    return this._db.tx("SaveRecipe", () => {
      return this._db.one(this._SAVE, [
        recipe.title, recipe.userId, recipe.description,
        recipe.imageUrl, recipe.created]);
    }).catch((error: any) => {
      return ErrorUtils.handleDbError(error, RecipeService.name, "save(..)");
    });
  }
}
