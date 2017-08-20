import { Request, Response } from "express";
import { Types } from "mongoose";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser } from "../models/SocoboUser";
import { DbExtension } from "../../db/interface/db-extension";
import { ImageService, SocoboRequest, DataType } from "../../app/index";

export class SocoboUserHandler {

  constructor (
    private _db: DbExtension,
    private _imgService: ImageService
  ) {}

  public getAll = (req: Request, res: Response): void => {
    this._db.socobouser.getAll()
      .then((result: SocoboUser[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    this._db.socobouser.getUserById(new Types.ObjectId(+req.params.id))
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const userId: number = +req.params.id;
    const updateType: SocoboUserUpdateType = req.body.updateType;
    const fieldsToUpdate: object = req.body.fieldsToUpdate;
    this._db.socobouser.updateById(new Types.ObjectId(userId), updateType, fieldsToUpdate)
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public uploadById = (req: SocoboRequest, res: Response): void => {
    const userId: number = +req.params.id;
    const email: string = req.requestData.decoded.email;
    this._imgService.persistImage(req.file.filename, DataType.SOCOBO_USER_IMAGE, email)
      .then((url: string) => this._db.socobouser.updateById(new Types.ObjectId(userId), SocoboUserUpdateType.image, [url]))
      .then((user: SocoboUser) => res.status(200).json(user))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    const userId: number = +req.params.id;
    this._db.socobouser.deleteById(new Types.ObjectId(userId))
      .then((result: Object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
