import { Request, Response } from "express";
import { IDatabase } from "pg-promise/typescript/pg-promise";
import { DbExtensions } from "../../app/index";
import { SocoboUserRole } from "../models/SocoboUserRole";

export class SocoboUserRolesHandler {
  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (req: Request, res: Response): void => {
    this._db.socobouserRoles.getAll()
      .then((result: SocoboUserRole[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    const roleId: number = +req.params.id;
    this._db.socobouserRoles.getById(roleId)
      .then((result: SocoboUserRole) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const roleId: number = +req.params.id;
    const fieldValue: string = req.body.fieldValue;
    this._db.socobouserRoles.updateById(roleId, fieldValue)
      .then((result: SocoboUserRole) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    const roleId: number = +req.params.id;
    this._db.socobousers.deleteById(roleId)
      .then((result: Object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public save = (req: Request, res: Response): void => {
    const name = req.body.name;
    const role = new SocoboUserRole().setName(name).createDates();
    this._db.socobouserRoles.save(role)
      .then((result: any) => this._db.socobouserProviders.getById(Number(result.id)))
      .then((suRole: SocoboUserRole) => res.status(200).json(suRole))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
