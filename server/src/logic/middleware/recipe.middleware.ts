import { NextFunction, Request, Response } from "express";
import { IDatabase } from "pg-promise";
import { ApiError, DbExtensions, ERRORS, Recipe } from "./../../models/index";

export class RecipeMiddleware {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public updateRecipes = (req: Request, res: Response): Promise<Recipe> => {
    const NEW_RECIPE: any = req.body;
    const UPDATEABLE_FIELDS = req.query.props;
    return this._db.recipes.getById(req.params.id)
      .then((existingRecipe) => {
        if (!UPDATEABLE_FIELDS) {
          NEW_RECIPE.id = existingRecipe.id;
          NEW_RECIPE.created = existingRecipe.created;
          return NEW_RECIPE;
        } else {

          const UPDATEABLES = {
            description: "description",
            imageUrl: "imageUrl",
            title: "title",
            userId: "userId"
          };

          const PARTLY_UPDATED_RECIPE = {
            ...existingRecipe
          };

          if (UPDATEABLE_FIELDS.indexOf("title") !== -1) {
            PARTLY_UPDATED_RECIPE.title = NEW_RECIPE.title;
          }
          if (UPDATEABLE_FIELDS.indexOf("userId") !== -1) {
            PARTLY_UPDATED_RECIPE.userId = NEW_RECIPE.userId;
          }
          if (UPDATEABLE_FIELDS.indexOf("description") !== -1) {
            PARTLY_UPDATED_RECIPE.description = NEW_RECIPE.description;
          }
          if (UPDATEABLE_FIELDS.indexOf("imageUrl") !== -1) {
            PARTLY_UPDATED_RECIPE.imageUrl = NEW_RECIPE.imageUrl;
          }
          req.body = PARTLY_UPDATED_RECIPE;
          return PARTLY_UPDATED_RECIPE;
        }
      });
  }
}
