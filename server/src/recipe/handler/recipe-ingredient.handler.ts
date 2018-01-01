import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeIngredient} from "../index";
import { FoodItemTemplate } from "./../../food/index";

const ObjectId = Types.ObjectId;

export class RecipeIngredientHandler {

  constructor (
    private _db: DbExtension
  ) {}

  private _sendError = (res: Response) => {
    return (error: any) => {
      res.status(error.statusCode).json(error.forResponse());
    };
  }

  private _resolveFoodItemTemplate = async (ingredient: RecipeIngredient): Promise<RecipeIngredient> => {
    const fit = await this._db.fooditemTemplate
      .getById(new ObjectId(ingredient.fooditemTemplateId)) as FoodItemTemplate;
    ingredient.fooditemTemplate = fit;
    return ingredient;
  }

  private _resolveAllFoodItemTemplat = (ingredients: RecipeIngredient[]): Promise<RecipeIngredient[]> => {
    let promises: Array<Promise<RecipeIngredient>> = [];
    ingredients.forEach((ingredient: RecipeIngredient) => {
      const ingredientWithCategoryPromise = ingredient.fooditemTemplateId
        ? this._resolveFoodItemTemplate(ingredient)
        : Promise.resolve(ingredient);
      promises = [...promises, ingredientWithCategoryPromise];
    });
    return Promise.all(promises);
  }

  private _mapFooditemTemplateIdToFooditemTemplateWithCategory = (ingredients: RecipeIngredient[]) => {
    return ingredients.map((ingrediet: RecipeIngredient) => {
      return new RecipeIngredient().clone(ingrediet)
      .setFooditemTemplateId(undefined);
    });
  }

  public getById = async (req: Request, res: Response) => {
    const queryPrams = req.query;

    try {
      const ingredient = await this._db.recipeIngredient.getById(req.params.id) as RecipeIngredient;
      if (queryPrams.hasOwnProperty("resolve") && ingredient.fooditemTemplateId) {
        const resolvedIngredient = await this._resolveFoodItemTemplate(ingredient);
        resolvedIngredient.fooditemTemplateId = undefined;
        return res.status(200).json(resolvedIngredient);
      } else {
        res.status(200).json(ingredient);
      }
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public getAll = async (req: Request, res: Response) => {
    const queryPrams = req.query;

    try {
      const result = await this._db.recipeIngredient.getAll() as RecipeIngredient[];
      if (queryPrams.hasOwnProperty("resolve")) {
        const recipes = await this._resolveAllFoodItemTemplat(result);
        return  res.status(200).json(this._mapFooditemTemplateIdToFooditemTemplateWithCategory(recipes));
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public save = async (req: Request, res: Response) => {
    const ingredient: RecipeIngredient = new RecipeIngredient()
      .clone(req.body as RecipeIngredient);
    try {
      const result = await this._db.recipeIngredient.save(ingredient);
      res.status(201).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public update = async (req: Request, res: Response) => {
    const ingredient: RecipeIngredient = new RecipeIngredient()
      .clone(req.body as RecipeIngredient);
    ingredient.setId(req.params.id);
    try {
      const result = await this._db.recipeIngredient.update(req.params.id, ingredient);
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this._db.recipeIngredient.getById(req.params.id);
      await this._db.recipeIngredient.delete(req.params.id);
      res.status(200).json();
    } catch (error) {
      this._sendError(res)(error);
    }
  }
}
