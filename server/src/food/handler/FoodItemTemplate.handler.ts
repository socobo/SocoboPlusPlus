import { Request, Response } from "express";
import { Types } from "mongoose";
import { DbExtension } from "../../db/interface/db-extension";
import { FoodItemTemplate } from "../index";

export class FoodItemTemplateHandler {

  constructor (private _db: DbExtension) {}

  public getAll = (req: Request, res: Response): void => {
    this._db.fooditemTemplate.getAll()
      .then((result: FoodItemTemplate[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    this._db.fooditemTemplate.getById(new Types.ObjectId(req.params.id))
      .then((result: FoodItemTemplate) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public save = (req: Request, res: Response): void => {
    const template = new FoodItemTemplate().clone(req.body);
    this._db.fooditemTemplate.save(template)
      .then((result: any) => res.status(201).json(template.setId(result)))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const userId: Types.ObjectId = new Types.ObjectId(req.params.id);
    const updateName: string = req.body.name;
    this._db.fooditemTemplate.updateById(userId, updateName)
      .then((result: FoodItemTemplate) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    this._db.fooditemTemplate.deleteById(new Types.ObjectId(req.params.id))
      .then((result: object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
