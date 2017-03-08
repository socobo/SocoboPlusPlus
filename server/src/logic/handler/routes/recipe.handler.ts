import { NextFunction, Request, Response } from "express";
import { IDatabase } from "pg-promise";
import { ModelUtils } from "./../../../logic/utils/index";
import { ApiError, ERRORS, Recipe } from "./../../../models/index";
import { DbExtensions } from "./../../../models/index";

export class RecipeHandler {

  private _db: IDatabase<DbExtensions>&DbExtensions;
  private _modelUtils: ModelUtils;

  constructor (db: any, modelUtils: ModelUtils) {
    this._db = db;
    this._modelUtils = modelUtils;
  }

  public getById = (req: Request, res: Response): void => {
    this._db.recipes.getById(req.params.id)
      .then((result: Recipe) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getAll = (req: Request, res: Response): void => {

    const queryPramas = req.query;
    const allQueryParams = Object.getOwnPropertyNames(queryPramas);
    const firstQeryParam = allQueryParams[0];
    const valueFirstQueryParam = queryPramas[firstQeryParam];

    if (firstQeryParam && valueFirstQueryParam) {
      if (!(new Recipe().getFields().has(firstQeryParam))) {
        res.status(400).json("Field does not exist");
      }
      this._db.recipes.getByField(firstQeryParam, valueFirstQueryParam)
      .then((result: Recipe[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
    } else {
      this._db.recipes.getAll()
      .then((result: Recipe[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
    }
  }

  public searchByField = (req: Request, res: Response): void => {

    const queryPramas = req.query;
    const allQueryParams = Object.getOwnPropertyNames(queryPramas);
    const firstQeryParam = allQueryParams[0];
    const valueFirstQueryParam = queryPramas[firstQeryParam];

    if (firstQeryParam && valueFirstQueryParam) {
      if (!(new Recipe().getFields().has(firstQeryParam))) {
        res.status(400).json("Field does not exist");
      }
      this._db.recipes.searchByField(firstQeryParam, valueFirstQueryParam)
      .then((result: Recipe[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
    } else {
      res.status(400).json("Invalid request");
    }
  }

  public save = (req: Request, res: Response): void => {
    const recipe: Recipe = req.body as Recipe;
    recipe.created = new Date();

    this._db.users.getUserById(recipe.userId)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._db.recipes.save(recipe)
      .then((result: Recipe) => {
        recipe.id = result.id;
        res.status(201).json(recipe);
      })
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public update = (req: Request, res: Response): void => {
    const newRecipe: Recipe = req.body as Recipe;

    this._db.users.getUserById(newRecipe.userId)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._db.recipes.update(req.params.id, newRecipe)
      .then(() => {
        this.getById(req, res);
      })
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateRecipe = (req: Request, res: Response, next: NextFunction) => {
    const newRecipe: any = req.body;

    this._db.recipes.getById(req.params.id).then((existingRecipe) => {
      this._modelUtils.updateModelValues(existingRecipe, newRecipe)
        .then((result) => {
          req.body = result;
          next();
        })
        .catch((error) => {
          res.status(error.statusCode).json(error.forResponse());
        });
    });
  }

  public delete = (req: Request, res: Response): void => {

    this._db.recipes.getById(req.params.id)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._db.recipes.delete(req.params.id)
      .then(() => res.status(200).json())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
