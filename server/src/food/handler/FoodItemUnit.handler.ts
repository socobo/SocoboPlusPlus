import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { DbError, ERRORS } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemUnit } from "../index";

export class FoodItemUnitHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._db.fooditemUnit.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemUnit.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unit = new FoodItemUnit().clone(req.body);

      await this._checkIfFoodItemExists(unit.foodItemId, "save(..)");

      const result = await this._db.fooditemUnit.save(unit) as Types.ObjectId;
      res.status(201).json(unit.setId(result));
    } catch (error) {
      next(error);
    }
  }

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = new Types.ObjectId(req.params.id);
      const foodItemId = new Types.ObjectId(req.body.foodItemId);

      await this._checkIfFoodItemExists(foodItemId, "updateById(..)");

      const updateValues = { name: req.body.name, lastModified: Date.now() };
      const result = await this._db.fooditemUnit.updateById(unitId, updateValues);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemUnit.deleteById(unitId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private _checkIfFoodItemExists = async (id: Types.ObjectId, methodName: string) => {
    const foundFoundItem = await this._db.fooditem.getById(id);
    if (!foundFoundItem) {
      throw new DbError(ERRORS.FOODITEM_NOT_FOUND.withArgs("id", id.toHexString()))
        .addSource(FoodItemUnitHandler.name)
        .addSourceMethod(methodName);
    }
  }
}
