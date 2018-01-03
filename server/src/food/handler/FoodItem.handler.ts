import { Request, Response } from "express";
import { Types } from "mongoose";
import { DbError, ERRORS } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItem } from "../index";

export class FoodItemHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      let result;

      if (req.query && req.query.hasOwnProperty("socobouserid")) {
        const socoboUserId = req.query.socobouserid;
        await this._checkIfSocoboUserExists(socoboUserId, "getAll(..)");
        result = await this._db.fooditem.getAllBySocoboUserId(socoboUserId);
      } else {
        result = await this._db.fooditem.getAll();
      }

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

      await this._checkIfSocoboUserExists(item.socoboUserId.toHexString(), "save(..)");
      await this._checkIfFoodItemTemplateExists(item.foodItemTemplateId, "save(..)");

      const result = await this._db.fooditem.save(item) as Types.ObjectId;
      res.status(201).json(item.setId(result));
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodItemId = new Types.ObjectId(req.params.id);
      const socoboUserId = new Types.ObjectId(req.body.socoboUserId);
      const foodItemTemplateId = new Types.ObjectId(req.body.foodItemTemplateId);

      await this._checkIfSocoboUserExists(socoboUserId.toHexString(), "updateById(..)");
      await this._checkIfFoodItemTemplateExists(foodItemTemplateId, "updateById(..)");
      await this._checkIfFoodItemExists(foodItemId, "updateById(..)");

      const updateValues = { ...req.body, lastModified: Date.now() };
      const result = await this._db.fooditem.updateById(foodItemId, updateValues);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  public deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const foodItemId = new Types.ObjectId(req.params.id);

      await this._checkIfFoodItemExists(foodItemId, "deleteById(..)");

      const result = await this._db.fooditem.deleteById(foodItemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(error.statusCode).json(error.forResponse());
    }
  }

  private _checkIfSocoboUserExists = async (id: string, methodName: string) => {
    const foundUser = await this._db.socobouser.getUserById(id);
    if (!foundUser) {
      throw new DbError(ERRORS.USER_NOT_FOUND.withArgs("id", id))
        .addSource(FoodItemHandler.name)
        .addSourceMethod(methodName);
    }
  }

  private _checkIfFoodItemTemplateExists = async (id: Types.ObjectId, methodName: string) => {
    const foundTemplate = await this._db.fooditemTemplate.getById(id);
    if (!foundTemplate) {
      throw new DbError(ERRORS.FOODITEMTEMPLTE_NOT_FOUND.withArgs("id", id.toHexString()))
        .addSource(FoodItemHandler.name)
        .addSourceMethod(methodName);
    }
  }

  private _checkIfFoodItemExists = async (id: Types.ObjectId, methodName: string) => {
    const foundFoundItem = await this._db.fooditem.getById(id);
    if (!foundFoundItem) {
      throw new DbError(ERRORS.FOODITEM_NOT_FOUND.withArgs("id", id.toHexString()))
        .addSource(FoodItemHandler.name)
        .addSourceMethod(methodName);
    }
  }
}
