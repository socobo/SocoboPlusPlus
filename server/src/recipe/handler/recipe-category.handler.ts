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

  private _sendError = (res: Response) => {
    return (error: any) => {
      res.status(error.statusCode).json(error.forResponse());
    };
  }

  public getById = async (req: Request, res: Response) => {
    try {
      const result = await this._db.recipeCategory.getById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this._db.recipeCategory.getAll();
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public save = async (req: Request, res: Response) => {
    const category: RecipeCategory = new RecipeCategory()
      .clone(req.body as RecipeCategory);
    try {
      const result = await this._db.recipeCategory.save(category);
      res.status(201).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public update = async (req: Request, res: Response) => {
    const category: RecipeCategory = new RecipeCategory()
      .clone(req.body as RecipeCategory);
    category.setId(req.params.id);
    try {
      const result = await this._db.recipeCategory.update(req.params.id, category);
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this._db.recipeCategory.getById(req.params.id);
      await this._db.recipeCategory.delete(req.params.id);
      res.status(200).json();
    } catch (error) {
      this._sendError(res)(error);
    }
  }
}