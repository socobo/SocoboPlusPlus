import { RecipeCategory } from './../models/recipe-category';
import { NextFunction, Request, Response } from "express";

import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe} from "../index";

export class RecipeCategoryHandler {

  constructor (
    private _db: DbExtension
  ) {}

  private _sendError = (res: Response) => {
    return (error: any) => {
      res.status(error.statusCode).json(error.forResponse());
    };
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const result = await this._db.recipeCategories.getById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this._db.recipeCategories.getAll();
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  // public save = async (req: Request, res: Response) => {
  //   const recipe: Recipe = new Recipe()
  //     .clone(req.body as Recipe)
  //     .removeImageProp();

  //   try {
  //     await this._db.socobouser.getUserById(recipe.userId);
  //     const result = await this._db.recipe.save(recipe);
  //     res.status(201).json(result);
  //   } catch (error) {
  //     this._sendError(res)(error);
  //   }
  // }

  // public update = async (req: Request, res: Response) => {
  //   const recipe: Recipe = new Recipe()
  //     .clone(req.body as Recipe)
  //     .removeImageProp();

  //   try {
  //     await this._db.socobouser.getUserById(recipe.userId);
  //     const result = await this._db.recipe.update(req.params.id, recipe);
  //     res.status(201).json(result);
  //   } catch (error) {
  //     this._sendError(res)(error);
  //   }
  // }

  // public delete = async (req: Request, res: Response) => {
  //   try {
  //     const recipe = await this._db.recipe.getById(req.params.id);
  //     await this._db.recipe.delete(req.params.id);
  //     res.status(200).json();
  //   } catch (error) {
  //     this._sendError(res)(error);
  //   }
  // }
}
