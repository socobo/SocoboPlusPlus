import { NextFunction, Request, Response } from "express";
import {
  ApiError, DataType, DbError, ERRORS, ImageService, SocoboRequest, ValidationError
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { Recipe, RecipeIngredient} from "../index";

export class RecipeIngredientHandler {

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
      const result = await this._db.recipeIngredient.getById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      this._sendError(res)(error);
    }
  }

  public getAll = async (req: Request, res: Response) => {
    try {
      const result = await this._db.recipeIngredient.getAll();
      res.status(200).json(result);
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
