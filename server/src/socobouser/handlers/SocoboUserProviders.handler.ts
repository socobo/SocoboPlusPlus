import { Request, Response } from "express";
// import { IDatabase } from "pg-promise/typescript/pg-promise";
// import { DbExtensions } from "../../app/index";
import { SocoboUserProvider } from "../models/SocoboUserProvider";

// TODO: remove this class --> now integrated into socobouser collection
export class SocoboUserProvidersHandler {

  private _db: any; // IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (req: Request, res: Response): void => {
    this._db.socobouserProviders.getAll()
      .then((result: SocoboUserProvider[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    const providerId: number = +req.params.id;
    this._db.socobouserProviders.getById(providerId)
      .then((result: SocoboUserProvider) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const providerId: number = +req.params.id;
    const fieldValue: string = req.body.fieldValue;
    this._db.socobouserProviders.updateById(providerId, fieldValue)
      .then((result: SocoboUserProvider) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    const providerId: number = +req.params.id;
    this._db.socobouserProviders.deleteById(providerId)
      .then((result: Object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public save = (req: Request, res: Response): void => {
    const name = req.body.name;
    const provider = new SocoboUserProvider().setName(name).createDates();
    this._db.socobouserProviders.save(provider)
      .then((result: any) => this._db.socobouserProviders.getById(Number(result.id)))
      .then((suProvider: SocoboUserProvider) => res.status(200).json(suProvider))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
