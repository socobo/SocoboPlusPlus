import { Request, Response } from "express";
//import { UserService } from "./../../../logic/services/index";
import * as db from "./../../../db/index";
import { SocoboUser } from "./../../../models/index";

export class UserHandler {

  constructor (private _db: any) {}

  public getAll = (req: Request, res: Response): void => {
    //this._userService.getAll()
    this._db.users.getAll()
      .then((result: SocoboUser[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    //this._userService.getUserById(req.params.id)
    let userId: number = +req.params.id    
    this._db.users.getUserById(userId)
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
