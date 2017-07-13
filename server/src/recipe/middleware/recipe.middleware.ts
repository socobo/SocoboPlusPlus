import { NextFunction, Request, Response } from "express";
import { IDatabase } from "pg-promise";
import { DbExtensions } from "../../app/index";
import { Recipe } from "../index";

export class RecipeMiddleware {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public updateRecipes = (req: Request, res: Response): Promise<Recipe> => {
    const updatedRecipe: any = req.body;
    const UPDATEABLE_FIELDS = req.query.fields;
    return this._db.recipes.getById(req.params.id)
      .then((existingRecipe: Recipe) => {
        if (!UPDATEABLE_FIELDS) {
          updatedRecipe.id = existingRecipe.id;
          updatedRecipe.created = existingRecipe.created;
          return updatedRecipe;
        } else {

          const partlyUpdatedRecipe = {
            ...existingRecipe
          };

          if (UPDATEABLE_FIELDS.indexOf("title") !== -1) {
            partlyUpdatedRecipe.title = updatedRecipe.title;
          }
          if (UPDATEABLE_FIELDS.indexOf("userId") !== -1) {
            partlyUpdatedRecipe.userId = updatedRecipe.userId;
          }
          if (UPDATEABLE_FIELDS.indexOf("description") !== -1) {
            partlyUpdatedRecipe.description = updatedRecipe.description;
          }
          if (UPDATEABLE_FIELDS.indexOf("imageUrl") !== -1) {
            partlyUpdatedRecipe.imageUrl = updatedRecipe.imageUrl;
          }
          req.body = partlyUpdatedRecipe;
          return partlyUpdatedRecipe;
        }
      });
  }
}
