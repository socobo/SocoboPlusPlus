import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { DbError, ERRORS } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemCategory, FoodItemTemplate, FoodItemUnit } from "../index";

export class FoodItemTemplateHandler {

  constructor (private _db: DbExtension) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = (req.query && req.query.hasOwnProperty("resolve"))
        ? await this._db.fooditemTemplate.getAllResolved()
        : await this._db.fooditemTemplate.getAll();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = new Types.ObjectId(req.params.id);
      const result = (req.query && req.query.hasOwnProperty("resolve"))
        ? await this._db.fooditemTemplate.getByIdResolved(id)
        : await this._db.fooditemTemplate.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = new FoodItemTemplate().clone(req.body);
      const result = await this._db.fooditemTemplate.save(template) as Types.ObjectId;
      res.status(201).json(template.setId(result));
    } catch (error) {
      next(error);
    }
  }

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const templateId = new Types.ObjectId(req.params.id);
      await this._checkIfFoodItemTemplateExists(templateId, "updateById(..)");

      const updateValues = { ...req.body, lastModified: Date.now() };
      const result = await this._db.fooditemTemplate.updateById(templateId, updateValues);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const templateId = new Types.ObjectId(req.params.id);
      await this._checkIfFoodItemTemplateExists(templateId, "deleteById(..)");

      const result = await this._db.fooditemTemplate.deleteById(templateId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  private _checkIfFoodItemTemplateExists = async (id: Types.ObjectId, methodName: string) => {
    const foundItem = await this._db.fooditemTemplate.getById(id);
    if (!foundItem) {
      throw new DbError(ERRORS.FOODITEMTEMPLTE_NOT_FOUND.withArgs("id", id.toHexString()))
        .addSource(FoodItemTemplateHandler.name)
        .addSourceMethod(methodName);
    }
  }
}
