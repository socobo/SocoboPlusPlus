import { NextFunction, Request, Response } from "express";
import { IDatabase } from "pg-promise";
import { ModelUtils } from "./../../logic/utils/index";
import { ApiError, DbExtensions, ERRORS, Recipe } from "./../../models/index";

export class RecipeMiddleware {

  private _db: IDatabase<DbExtensions>&DbExtensions;
  private _modelUtils: ModelUtils;

  constructor (db: any, modelUtils: ModelUtils) {
    this._db = db;
    this._modelUtils = modelUtils;
  }

  public updateRecipe = (req: Request): Promise<Recipe> => {
    const newRecipe: any = req.body;
    return this._db.recipes.getById(req.params.id)
      .then((existingRecipe) => {
        return this._modelUtils.updateModelValues(existingRecipe, newRecipe)
          .then((result) => {
            req.body = result;
            return (result);
          }) as Promise<Recipe>;
    });
  }
}
