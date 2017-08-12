import { Request, Response } from "express";
import { IDatabase } from "pg-promise/typescript/pg-promise";
import { DataType, DbExtensions, ImageService, SocoboRequest } from "../../app/index";
import { SocoboUserImage } from "../models/SocoboUserImage";

export class SocoboUserImagesHandler {

  private _db: IDatabase<DbExtensions>&DbExtensions;
  private _imgService: ImageService;

  constructor (db: any, imgService: ImageService) {
    this._db = db;
    this._imgService = imgService;
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

  public save = (req: Request, res: Response): void => {
    const url = req.body.url;
    const image = new SocoboUserImage().setUrl(url).createDates();
    this._db.socobouserImages.save(image)
      .then((result: any) => this._db.socobouserImages.getById(Number(result.id)))
      .then((suImage: SocoboUserImage) => res.status(200).json(suImage))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public upload = (req: SocoboRequest, res: Response): void => {
    const email = req.requestData.decoded.email;
    this._imgService.persistImage(req.file.filename, DataType.SOCOBO_USER_IMAGE, email)
      .then((url: string) => this._createNewImage(url))
      .then((image: SocoboUserImage) => this._db.socobouserImages.save(image))
      .then((result: any) => this._db.socobouserImages.getById(Number(result.id)))
      .then((suImage: SocoboUserImage) => res.status(200).json(suImage))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  private _createNewImage = (url: string): Promise<SocoboUserImage> => {
    return Promise.resolve(new SocoboUserImage().setUrl(url).createDates());
  }
}
