import { NextFunction, Request, Response } from "express";
import { RecipeCategory } from "./../models/recipe-category";

import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeAuthorizationService, RecipeImage} from "../index";

export class RecipeHandler {

  constructor (
    private _db: DbExtension,
    private _imgService: ImageService,
    private _recipeAuthService: RecipeAuthorizationService
  ) {}

  private _resolveCategory = async (recipe: Recipe): Promise<Recipe> => {
    const category = await this._db.recipeCategory.getById(recipe.categoryId) as RecipeCategory;
    recipe.category = category;
    return recipe;
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
    return recipes.map((recipe: Recipe) => {
      return new Recipe().clone(recipe)
      .setCategoryId(undefined);
    });
  }

  public getById = async (req: SocoboRequest, res: Response, next: NextFunction) => {
    const queryPramas = req.query;
    try {
      const recipe = await this._db.recipe.getById(req.params.id) as Recipe;
      await this._recipeAuthService.readable(req.requestData.decoded.user, recipe);
      if (queryPramas.hasOwnProperty("resolve") && recipe.categoryId) {
        const resolvedRecipe = await this._resolveCategory(recipe);
        resolvedRecipe.categoryId = undefined;
        return res.status(200).json(resolvedRecipe);
      } else {
        res.status(200).json(recipe);
      }
    } catch (error) {
      next(error);
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    const queryPrams = req.query;
    try {
      const result = await this._db.recipe.getAll() as Recipe[];
      if (queryPrams.hasOwnProperty("resolve")) {
        const recipes = await this._resolveAllCategories(result);
        return  res.status(200).json(this._mapRecipesToRecipesWithCategory(recipes));
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  public searchByField = async (req: Request, res: Response, next: NextFunction) => {

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
        next(error);
      }
    } else {
      const error = new ApiError(ERRORS.VAL_INVALID_QUERY_PARAM_FORMAT)
        .addSource(RecipeHandler.name)
        .addSourceMethod("searchByField()");
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction) => {
    const recipe: Recipe = new Recipe()
      .clone(req.body as Recipe)
      .removeImageProp();

    try {
      await this._db.socobouser.getUserById(recipe.userId);
      const result = await this._db.recipe.save(recipe);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const recipe: Recipe = new Recipe()
      .clone(req.body as Recipe)
      .removeImageProp();

    try {
      await this._db.socobouser.getUserById(recipe.userId);
      const result = await this._db.recipe.update(req.params.id, recipe);
      res.status(201).json(result);
    } catch (error) {
      next(error);
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
      next(error);
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recipe = await this._db.recipe.getById(req.params.id);
      await this._db.recipe.delete(req.params.id);
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }

  public uploadImage = async (req: SocoboRequest, res: Response, next: NextFunction) => {
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
      next(error);
    }
  }

  public deleteImage = async (req: SocoboRequest, res: Response, next: NextFunction) => {
    try {
      const image = await this._db.recipe
        .getImageById(req.params.id, req.params.imgId) as RecipeImage;
      await this._imgService.deleteImage(image.url);
      await this._db.recipe.removeImage(req.params.id, req.params.imgId);
      res.status(200).json();
    } catch (error) {
      next(error);
    }

  }
}
