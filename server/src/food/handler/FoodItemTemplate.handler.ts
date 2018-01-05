import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemTemplate } from "../index";

export class FoodItemTemplateHandler {

  constructor (private _db: DbExtension) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    this._db.fooditemTemplate.getAll()
      .then((result: FoodItemTemplate[]) => res.status(200).json(result))
      .catch(next);
  }

  public getById = (req: Request, res: Response, next: NextFunction): void => {
    this._db.fooditemTemplate.getById(new Types.ObjectId(req.params.id))
      .then((result: FoodItemTemplate) => res.status(200).json(result))
      .catch(next);
  }

  public save = (req: Request, res: Response, next: NextFunction): void => {
    const template = new FoodItemTemplate().clone(req.body);
    this._db.fooditemTemplate.save(template)
      .then((result: any) => res.status(201).json(template.setId(result)))
      .catch(next);
  }

  public updateById = (req: Request, res: Response, next: NextFunction): void => {
    const templateId: Types.ObjectId = new Types.ObjectId(req.params.id);
    const updatedTemplateName: string = req.body.name;
    this._db.fooditemTemplate.updateById(templateId, updatedTemplateName)
      .then((result: FoodItemTemplate) => res.status(200).json(result))
      .catch(next);
  }

  public deleteById = (req: Request, res: Response, next: NextFunction): void => {
    this._db.fooditemTemplate.deleteById(new Types.ObjectId(req.params.id))
      .then((result: object) => res.status(200).json(result))
      .catch(next);
  }
}
