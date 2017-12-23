import { NextFunction, Request, Response } from "express";
import { RecipeCategory } from "./../models/recipe-category";

import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeImage} from "../index";

export class RecipeHandler {

  constructor (
    private _db: DbExtension,
    private _imgService: ImageService
  ) {}

  private _sendError = (res: Response) => {
    return (error: any) => {
      res.status(error.statusCode).json(error.forResponse());
    };
  }

  private _resolveCategory = (recipe: Recipe): Promise<Recipe> => {
    return this._db.recipeCategories.getById(recipe.categoryId)
      .then((category: RecipeCategory) => {
        recipe.category = category;
        return recipe;
      });
  }

  private _resolveAllCategories = (recipes: Recipe[]): Promise<Recipe[]> => {
    let promises: Array<Promise<Recipe>> = [];
    recipes.forEach((recipe: Recipe) => {
      const recipeWithCategoryPromise = recipe.categoryId
        ? this._resolveCategory(recipe)
        : Promise.resolve(recipe);
      promises = [...promises, recipeWithCategoryPromise];
    });
    return Promise.all(promises);
  }

  private _mapRecipesToRecipesWithCategory = (recipes: Recipe[]) => {
    let recipesWithCategory: Recipe[] = [];
    recipes.forEach((recipe: Recipe) => {
      recipesWithCategory = [
        ...recipesWithCategory,
        new Recipe().clone(recipe)
          .setCategoryId(undefined)];
    });
    return recipesWithCategory;
  }

  public getById = async (req: Request, res: Response) => {
    const queryPramas = req.query;
    try {
      const result = await this._db.recipe.getById(req.params.id) as Recipe;
      if (queryPramas.hasOwnProperty("resolveCategory") && result.categoryId) {
        this._resolveCategory(result).then((recipe: Recipe) => {
          res.status(200).json(recipe);
        });
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public getAll = async (req: Request, res: Response) => {
    const queryPramas = req.query;
    try {
      const result = await this._db.recipe.getAll() as Recipe[];
      if (queryPramas.hasOwnProperty("resolveCategory")) {
        this._resolveAllCategories(result).then((recipes: Recipe[]) => {
          res.status(200).json(this._mapRecipesToRecipesWithCategory(recipes));
        });
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public searchByField = async (req: Request, res: Response) => {

    const queryPramas = req.query;
    const allQueryParams = Object.getOwnPropertyNames(queryPramas);
    const firstQueryParam = allQueryParams[0];
    const valueFirstQueryParam = queryPramas[firstQueryParam];

    if (firstQueryParam && valueFirstQueryParam) {
      try {
        const result = await this._db.recipe
          .searchByField(firstQueryParam, valueFirstQueryParam);
        res.status(200).json(result);
      } catch (error) {
        this._sendError(res)(error);
      }
    } else {
      const error = new ApiError(ERRORS.VAL_INVALID_QUERY_PARAM_FORMAT)
        .addSource(RecipeHandler.name)
        .addSourceMethod("searchByField()");
      this._sendError(res)(error);
    }
  }

  public save = async (req: Request, res: Response) => {
    const recipe: Recipe = new Recipe()
      .clone(req.body as Recipe)
      .removeImageProp();

    try {
      await this._db.socobouser.getUserById(recipe.userId);
      const result = await this._db.recipe.save(recipe);
      res.status(201).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public update = async (req: Request, res: Response) => {
    const recipe: Recipe = new Recipe()
      .clone(req.body as Recipe)
      .removeImageProp();

    try {
      await this._db.socobouser.getUserById(recipe.userId);
      const result = await this._db.recipe.update(req.params.id, recipe);
      res.status(201).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public merge = async (req: Request, res: Response, next: NextFunction) => {
    const requestBody = req.body;
    // Remove id, because a different id than in the db would cause problems
    delete requestBody._id;
    try {
      const recipe = await this._db.recipe.getById(req.params.id);
      const updatedRecipe = {...recipe, ...requestBody};
      req.body = updatedRecipe;
      next();
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      const recipe = await this._db.recipe.getById(req.params.id);
      await this._db.recipe.delete(req.params.id);
      res.status(200).json();
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public uploadImage = async (req: SocoboRequest, res: Response) => {
    const userEmail = req.requestData.decoded.email;
    const recipeId = req.params.id;
    const imageTitle = req.query.title;
    try {
      const url = await this._imgService.persistImage(
        req.file.filename, DataType.RECIPE_IMAGE, userEmail);

      const recipe: any = await this._db.recipe.getById(recipeId);
      recipe.images.push(new RecipeImage().setUrl(url).setTitle(req.query.title));
      await this._db.recipe.update(recipeId, recipe);
      res.status(200).json(recipe);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public deleteImage = async (req: SocoboRequest, res: Response) => {
    try {
      const image = await this._db.recipe
        .getImageById(req.params.id, req.params.imgId) as RecipeImage;
      await this._imgService.deleteImage(image.url);
      await this._db.recipe.removeImage(req.params.id, req.params.imgId);
      res.status(200).json();
    } catch (error) {
      this._sendError(res)(error);
    }

  }
}
