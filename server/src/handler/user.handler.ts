import { Request, Response } from "express";
import { UserService } from "./../logic/services/index";
import { SocoboUser } from "./../models/index";

export class UserHandler {

  constructor (private _userService: UserService) {}

  public getAll = (req: Request, res: Response): void => {
    this._userService.getAll()
      .then((result: SocoboUser[]) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public getById = (req: Request, res: Response): void => {
    this._userService.getUserById(req.params.id)
      .then((result: SocoboUser) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
