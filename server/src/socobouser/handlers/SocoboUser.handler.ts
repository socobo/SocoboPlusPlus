import { NextFunction, Request, Response } from "express";
import { DataType, ImageService, SocoboRequest } from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { SocoboUserUpdateType } from "../enums/SocoboUserUpdateType";
import { SocoboUser } from "../index";

export class SocoboUserHandler {

  constructor (
    private _db: DbExtension,
    private _imgService: ImageService
  ) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: SocoboUser[] = await this._db.socobouser.getAll() as SocoboUser[];
      res.status(200).json(result.map((item: SocoboUser) => item.removePassword()));
    } catch (error) {
      next(error);
    }
  }

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: SocoboUser = await this._db.socobouser.getUserById(req.params.id) as SocoboUser;
      res.status(200).json(result.removePassword());
    } catch (error) {
      next(error);
    }
  }

  public updateById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const updateType: SocoboUserUpdateType = req.body.updateType;
      const fieldsToUpdate: object = req.body.fieldsToUpdate;
      const result: SocoboUser = await this._db.socobouser.updateById(userId, updateType, fieldsToUpdate) as SocoboUser;
      res.status(200).json(result.removePassword());
    } catch (error) {
      next(error);
    }
  }

  public uploadById = async (req: SocoboRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      const email: string = req.requestData.decoded.email;
      const type: SocoboUserUpdateType = SocoboUserUpdateType.image;
      const url: string = await this._imgService.persistImage(req.file.filename, DataType.SOCOBO_USER_IMAGE, email);
      const result: SocoboUser = await this._db.socobouser.updateById(userId, type, {imageUrl: url}) as SocoboUser;
      res.status(200).json(result.removePassword());
    } catch (error) {
      next(error);
    }
  }

  public deleteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result: object = await this._db.socobouser.deleteById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
