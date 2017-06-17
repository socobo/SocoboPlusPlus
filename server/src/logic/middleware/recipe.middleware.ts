import { NextFunction, Request, Response } from "express";
import { IDatabase } from "pg-promise";
import { ApiError, DbExtensions, ERRORS, Recipe } from "./../../models/index";

export class RecipeMiddleware {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public newUpdateRecipes = (req: Request, res: Response): Promise<Recipe> => {
    const NEW_RECIPE: any = req.body;
    const UPDATEABLE_FIELDS = req.query.props;
    return this._db.recipes.getById(req.params.id)
      .then((existingRecipe) => {
        if (!UPDATEABLE_FIELDS) {
          NEW_RECIPE.id = existingRecipe.id;
          return NEW_RECIPE;
        } else {

          const UPDATEABLES = {
            description: "description",
            imageUrl: "imageUrl",
            title: "title",
            userId: "userId"
          };

          const partlyUpdatedRecipe = {
            ...existingRecipe
          };

          if (UPDATEABLE_FIELDS.indexOf("title") !== -1) {
            partlyUpdatedRecipe.title = NEW_RECIPE.title;
          }
          if (UPDATEABLE_FIELDS.indexOf("userId") !== -1) {
            partlyUpdatedRecipe.userId = NEW_RECIPE.userId;
          }
          if (UPDATEABLE_FIELDS.indexOf("description") !== -1) {
            partlyUpdatedRecipe.description = NEW_RECIPE.description;
          }
          if (UPDATEABLE_FIELDS.indexOf("imageUrl") !== -1) {
            partlyUpdatedRecipe.imageUrl = NEW_RECIPE.imageUrl;
          }
          req.body = partlyUpdatedRecipe;
          return partlyUpdatedRecipe;
        }
      });
  }
}
