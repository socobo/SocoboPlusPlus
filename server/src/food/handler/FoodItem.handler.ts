import { Request, Response } from "express";
import { Types } from "mongoose";
import { DbError, ERRORS } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItem } from "../index";

export class FoodItemHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this._db.fooditem.getAll();
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public getAllBySocoboUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const socoboUserId = req.query.socoboUserId;
      const result = await this._db.fooditem.getAllBySocoboUserId(socoboUserId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = await this._db.fooditem.getById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public save = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = new FoodItem().clone(req.body);

      const foundUser = await this._db.socobouser.getUserById(String(item.socoboUserId));
      if (!foundUser) {
        throw new DbError(ERRORS.USER_NOT_FOUND.withArgs("id", item.socoboUserId.toHexString()))
          .addSource(FoodItemHandler.name)
          .addSourceMethod("save(..)");
      }

      const foundTemplate = await this._db.fooditemTemplate.getById(item.foodItemTemplateId);
      if (!foundTemplate) {
        throw new DbError(ERRORS.FOODITEMTEMPLTE_NOT_FOUND.withArgs("id", item.foodItemTemplateId.toHexString()))
          .addSource(FoodItemHandler.name)
          .addSourceMethod("save(..)");
      }

      const result = await this._db.fooditem.save(item) as Types.ObjectId;
      res.status(201).json(item.setId(result));
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }
}
