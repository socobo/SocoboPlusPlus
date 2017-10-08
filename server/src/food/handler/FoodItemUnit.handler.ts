import { Request, Response } from "express";
import { Types } from "mongoose";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemUnit } from "../index";

export class FoodItemUnitHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this._db.fooditemUnit.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public getAllByFooditemId = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodItemId = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemUnit.getAllByFooditemId(foodItemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemUnit.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public save = async (req: Request, res: Response): Promise<void> => {
    try {
      const unit = new FoodItemUnit().clone(req.body);

      // TODO:  await this._db.fooditem.getById(unit.foodItemId);

      const result = await this._db.fooditemUnit.save(unit) as Types.ObjectId;
      res.status(201).json(unit.setId(result));
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const unitId = new Types.ObjectId(req.params.id);
      const foodItemId = req.body.foodItemId;
      const updatedUnitName = req.body.name;

      // TODO:  await this._db.fooditem.getById(foodItemId);

      const result = await this._db.fooditemUnit.updateById(unitId, updatedUnitName);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const unitId = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditemUnit.deleteById(unitId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }
}
