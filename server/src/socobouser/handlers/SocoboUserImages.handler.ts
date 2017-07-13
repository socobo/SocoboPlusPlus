import { Request, Response } from "express";
import { IDatabase } from "pg-promise/typescript/pg-promise";
import { DbExtensions } from "../../app/index";
import { SocoboUserImage } from "../models/SocoboUserImage";

export class SocoboUserImagesHandler {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (req: Request, res: Response): void => {
    this._db.socobouserImages.getAll()
      .then((result: SocoboUserImage[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    const imageId: number = +req.params.id;
    this._db.socobouserImages.getById(imageId)
      .then((result: SocoboUserImage) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const imageId: number = +req.params.id;
    const fieldValue: string = req.body.fieldValue;
    this._db.socobouserImages.updateById(imageId, fieldValue)
      .then((result: SocoboUserImage) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    const imageId: number = +req.params.id;
    this._db.socobouserImages.deleteById(imageId)
      .then((result: Object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
