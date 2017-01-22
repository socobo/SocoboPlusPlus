import { NextFunction, Request, Response, Router } from "express";
import { AuthValidationMiddleware } from "./../../logic/middleware/index";
import { ApiError, DbError, Recipe, ValidationError } from "./../../models/index";

export class AuthValidationHandler {

  constructor (private _authValidationMiddleware: AuthValidationMiddleware) {}

  public authenticate = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidToken(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
