import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemCategory } from "../index";

export class FoodItemCategoryHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._db.fooditemCategory.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemCategory.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const category = new FoodItemCategory().clone(req.body);

      // TODO:  await this._db.fooditem.getById(category.foodItemId);

      const result = await this._db.fooditemCategory.save(category) as Types.ObjectId;
      res.status(201).json(category.setId(result));
    } catch (error) {
      next(error);
    }
  }

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = new Types.ObjectId(req.params.id);
      const foodItemId = req.body.foodItemId;
      const updatedCategoryName = req.body.name;

      // TODO:  await this._db.fooditem.getById(foodItemId);

      const result = await this._db.fooditemCategory.updateById(categoryId, updatedCategoryName);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categoryId = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemCategory.deleteById(categoryId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
