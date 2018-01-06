import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
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

      // TODO:  await this._db.fooditem.getById(unit.foodItemId);

      const result = await this._db.fooditemUnit.save(unit) as Types.ObjectId;
      res.status(201).json(unit.setId(result));
    } catch (error) {
      next(error);
    }
  }

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const unitId = new Types.ObjectId(req.params.id);
      const foodItemId = req.body.foodItemId;
      const updatedUnitName = req.body.name;

      // TODO:  await this._db.fooditem.getById(foodItemId);

      const result = await this._db.fooditemUnit.updateById(unitId, updatedUnitName);
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
}
