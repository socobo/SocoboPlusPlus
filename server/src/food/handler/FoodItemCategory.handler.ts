import { Request, Response } from "express";
import { Types } from "mongoose";
import { DbError, ERRORS } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemCategory } from "../index";

export class FoodItemCategoryHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this._db.fooditemCategory.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemCategory.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public save = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = new FoodItemCategory().clone(req.body);

      await this._checkIfFoodItemExists(category.foodItemId, "save(..)");

      const result = await this._db.fooditemCategory.save(category) as Types.ObjectId;
      res.status(201).json(category.setId(result));
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = new Types.ObjectId(req.params.id);
      const foodItemId = new Types.ObjectId(req.body.foodItemId);

      await this._checkIfFoodItemExists(foodItemId, "updateById(..)");

      const updateValues = { name: req.body.name, lastModified: Date.now() };
      const result = await this._db.fooditemCategory.updateById(categoryId, updateValues);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const categoryId = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemCategory.deleteById(categoryId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  private _checkIfFoodItemExists = async (id: Types.ObjectId, methodName: string) => {
    const foundFoundItem = await this._db.fooditem.getById(id);
    if (!foundFoundItem) {
      throw new DbError(ERRORS.FOODITEM_NOT_FOUND.withArgs("id", id.toHexString()))
        .addSource(FoodItemCategoryHandler.name)
        .addSourceMethod(methodName);
    }
  }
}
