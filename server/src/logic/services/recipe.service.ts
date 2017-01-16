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
    let promise = this._db.one(this._GET_BY_ID, [id])
    return promise.then(recipe => {
      return Promise.resolve(recipe)
    }).catch(error => {
      let e: DbError;
      if (ErrorUtils.notFound(error)) {
        e = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs(id.toString()))
          .addSource(RecipeService.name)
          .addSourceMethod("getById()")
          .addCause(error)
          .addQuery(error.query);
        return Promise.reject(e);
      }else{
        e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
          .addSource(RecipeService.name)
          .addSourceMethod("getById()")
          .addCause(error)
          .addQuery(error.query);
        return Promise.reject(e);
      }
    })
  }

  save (recipe: Recipe): Promise<any> {
    return this._db.tx(() => {
      return this._db.one(this._SAVE, [
        recipe.title,
        recipe.userId,
        recipe.description,
        recipe.imageUrl,
        recipe.created]);
    }).then(result => {
      return Promise.resolve(result);
    }).catch(error => {
      let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
        .addSource(RecipeService.name)
        .addSourceMethod("save()")
        .addCause(error)
        .addQuery(error.query);
      return Promise.reject(e)
    })
  }
}