import { NextFunction, Request, Response, Router } from "express";
import { AuthValidator } from "./../logic/middleware/index";
import { ApiError, DbError, Recipe, ValidationError } from "./../models/index";

export class AuthHandler {

  constructor (private _validator: AuthValidator) {}

  public authenticate = (req: Request, res: Response, next: NextFunction): void => {
    this._validator.checkValidToken(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
