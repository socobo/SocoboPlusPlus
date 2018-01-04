import { NextFunction, Request, Response } from "express";
import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe} from "../index";
import { RecipeCategory } from "./../models/recipe-category";

export class RecipeCategoryHandler {

  constructor (
    private _db: DbExtension
  ) {}

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._db.recipeCategory.getById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this._db.recipeCategory.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction) => {
    const category: RecipeCategory = new RecipeCategory()
      .clone(req.body as RecipeCategory);
    try {
      const result = await this._db.recipeCategory.save(category);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    const category: RecipeCategory = new RecipeCategory()
      .clone(req.body as RecipeCategory);
    category.setId(req.params.id);
    try {
      const result = await this._db.recipeCategory.update(req.params.id, category);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this._db.recipeCategory.getById(req.params.id);
      await this._db.recipeCategory.delete(req.params.id);
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}
