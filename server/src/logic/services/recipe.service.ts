import { IDatabase } from "pg-promise";
import { Recipe, DbError, ERRORS } from "./../../models/index";
import { ErrorUtils } from "./../../logic/utils/index";
import { UserService } from "./../../logic/services/index";

export class RecipeService {

  private _GET_BY_ID: string = `select * 
                                from recipes
                                where recipes.id = $1`;

  private _SAVE: string = `insert into recipes(
                             title,
                             userId,
                             description,
                             imageUrl,
                             created)
                           values($1, $2, $3, $4, $5)
                           returning id`;

  constructor (private _db: IDatabase<any>) {}

  getById (id: number): Promise<Recipe> {
    console.log("CAll getById");
    let promise = this._db.one(this._GET_BY_ID, [id]);
    return promise.catch(error => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.RECIPE_NOT_FOUND,
        error,
        "id",
        id.toString(),
        RecipeService.name,
        "getById(..)");
    });
  }

  save (recipe: Recipe): Promise<any> {
    return this._db.tx(() => {
      return this._db.one(this._SAVE, [
        recipe.title,
        recipe.userId,
        recipe.description,
        recipe.imageUrl,
        recipe.created]);
    }).catch(error => {
      return ErrorUtils.handleDbError(
        error,
        RecipeService.name,
        "save(..)");
    });
  }
}