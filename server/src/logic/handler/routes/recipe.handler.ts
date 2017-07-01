import { NextFunction, Request, Response } from "express";
// import { validate } from "class-validator";
import { IDatabase } from "pg-promise";
import { RecipeMiddleware } from "./../../../logic/middleware/recipe.middleware";
import { FilesystemImageService, ImageService } from "./../../../logic/services/index";
import {
  ApiError, DataType, DbExtensions, ERRORS, Recipe, RecipeStep, SocoboRequest
} from "./../../../models/index";

export class RecipeHandler {

  private _db: IDatabase<DbExtensions>&DbExtensions;
  private _recipeMiddleware: RecipeMiddleware;
  private _imgService: ImageService;

  constructor (db: any, recipeMiddleware: RecipeMiddleware, imgService: ImageService) {
    this._db = db;
    this._recipeMiddleware = recipeMiddleware;
    this._imgService = imgService;
  }

  public getById = (req: Request, res: Response): void => {
    this._db.recipes.getById(req.params.id)
      .then((result: Recipe) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getAll = (req: Request, res: Response): void => {

    const queryPramas = req.query;
    const allQueryParams = Object.getOwnPropertyNames(queryPramas);
    const firstQueryParam = allQueryParams[0];
    const valueFirstQueryParam = queryPramas[firstQueryParam];

    if (firstQueryParam && valueFirstQueryParam) {
      if (!(new Recipe().fields.has(firstQueryParam))) {
        const e = new ApiError(ERRORS.RECIPE_INVALID_FIELD.withArgs(firstQueryParam))
          .addSource(RecipeHandler.name)
          .addSourceMethod("getAll()");
        res.status(e.statusCode).json(e.forResponse());
      }
      this._db.recipes.getByField(firstQueryParam, valueFirstQueryParam)
        .then((result: Recipe[]) => res.status(200).json(result))
        .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
    } else {
      this._db.recipes.getAll()
        .then((result: Recipe[]) => res.status(200).json(result))
        .catch((e: any) => {
          if (e.code === ERRORS.RECIPE_NON_AVAILABLE.code) {
            res.status(200).json([]);
          }
          res.status(e.statusCode).json(e.forResponse());
      });
    }
  }

  public searchByField = (req: Request, res: Response): void => {

    const queryPramas = req.query;
    const allQueryParams = Object.getOwnPropertyNames(queryPramas);
    const firstQueryParam = allQueryParams[0];
    const valueFirstQueryParam = queryPramas[firstQueryParam];

    if (firstQueryParam && valueFirstQueryParam) {
      if (!(new Recipe().fields.has(firstQueryParam))) {
        const e = new ApiError(ERRORS.RECIPE_INVALID_FIELD.withArgs(firstQueryParam))
          .addSource(RecipeHandler.name)
          .addSourceMethod("searchByField()");
        res.status(e.statusCode).json(e.forResponse());
      }
      this._db.recipes.searchByField(firstQueryParam, valueFirstQueryParam)
        .then((result: Recipe[]) => res.status(200).json(result))
        .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
    } else {
      const e = new ApiError(ERRORS.VAL_INVALID_QUERY_PARAM_FORMAT)
        .addSource(RecipeHandler.name)
        .addSourceMethod("searchByField()");
      res.status(e.statusCode).json(e.forResponse());
    }
  }

  public save = (req: Request, res: Response): void => {
    const recipe: Recipe = req.body as Recipe;
    // console.log('Recipe', recipe)

    // let r = new Recipe().of(recipe);

    // validate(r, {
    //   groups: ["recipe"]
    // }).then((errors: any) => { // errors is an array of validation errors
    //   if (errors.length > 0) {
    //       console.log("validation failed. errors: ", errors);
    //   } else {
    //       console.log("validation succeed");
    //   }
    // });
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
      .then(() => this.getById(req, res))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateRecipeProperties = (req: Request, res: Response, next: NextFunction) => {
    this._recipeMiddleware.updateRecipes(req, res)
      .then(() => next())
      .catch((error) => res.status(error.statusCode).json(error.forResponse()));
  }

  public delete = (req: Request, res: Response): void => {

    this._db.recipes.getById(req.params.id)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._db.recipes.delete(req.params.id)
      .then(() => res.status(200).json())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public uploadImage = (req: SocoboRequest, res: Response) => {
    const userEmail = req.requestData.decoded.email;
    const recipeId = req.params.id;
    this._imgService.persistImage(req.file.filename, DataType.RECIPE_IMAGE, userEmail)
      .then((url) => this._getRecipe(recipeId, url))
      .then((obj: any) => this._addImageUrl(obj.recipe, obj.url))
      .then((recipe: Recipe) => this._db.recipes.update(recipeId, recipe))
      .then(() => this.getById(req, res))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  private _getRecipe = (recipeId: number, url: string): Promise<any> => {
    return this._db.recipes.getById(recipeId).then((recipe) => ({recipe, url}));
  }

  private _addImageUrl = (recipe: Recipe, url: string): Promise<any> => {
    recipe.addImageUrl(url);
    return Promise.resolve(recipe);
  }
}
