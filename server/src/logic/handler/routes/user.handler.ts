import { Request, Response } from "express";
import { IDatabase } from "pg-promise";
import * as db from "./../../../db/index";
import { SocoboUser, UpdateType } from "./../../../models/index";
import { DbExtensions } from "./../../../models/index";

export class UserHandler {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (req: Request, res: Response): void => {
    this._db.users.getAll()
      .then((result: SocoboUser[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    const userId: number = +req.params.id;
    this._db.users.getUserById(userId)
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const userId: number = +req.params.id;
    const updateType: UpdateType = req.body.updateType;
    const fieldValues: string[] = req.body.fieldValues;
    this._db.users.updateById(userId, updateType, fieldValues)
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    const userId: number = +req.params.id;
    this._db.users.deleteById(userId)
      .then((result: Object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
