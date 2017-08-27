import { Request, Response } from "express";
import { Types } from "mongoose";
import { DataType, ImageService, SocoboRequest } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser } from "../index";

export class SocoboUserHandler {

  constructor (
    private _db: DbExtension,
    private _imgService: ImageService
  ) {}

  public getAll = (req: Request, res: Response): void => {
    this._db.socobouser.getAll()
      .then((result: SocoboUser[]) => res.status(200).json(result.map((item: SocoboUser) => item.removePassword())))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    this._db.socobouser.getUserById(new Types.ObjectId(req.params.id))
      .then((result: SocoboUser) => res.status(200).json(result.removePassword()))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public updateById = (req: Request, res: Response): void => {
    const userId: Types.ObjectId = new Types.ObjectId(req.params.id);
    const updateType: SocoboUserUpdateType = req.body.updateType;
    const fieldsToUpdate: object = req.body.fieldsToUpdate;
    this._db.socobouser.updateById(userId, updateType, fieldsToUpdate)
      .then((result: SocoboUser) => res.status(200).json(result.removePassword()))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public uploadById = (req: SocoboRequest, res: Response): void => {
    const userId: Types.ObjectId = new Types.ObjectId(req.params.id);
    const email: string = req.requestData.decoded.email;
    this._imgService.persistImage(req.file.filename, DataType.SOCOBO_USER_IMAGE, email)
      .then((url: string) => this._db.socobouser.updateById(userId, SocoboUserUpdateType.image, {imageUrl: url}))
      .then((user: SocoboUser) => res.status(200).json(user.removePassword()))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public deleteById = (req: Request, res: Response): void => {
    this._db.socobouser.deleteById(new Types.ObjectId(req.params.id))
      .then((result: object) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
