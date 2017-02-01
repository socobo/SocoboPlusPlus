import { NextFunction, Request, Response, Router } from "express";
import { AuthValidationMiddleware } from "./../../../logic/middleware/index";
import { ApiError, DbError, Recipe, ValidationError } from "./../../../models/index";

export class AuthValidationHandler {

  constructor (private _authValidationMiddleware: AuthValidationMiddleware) {}

  public checkRequest = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkRequest(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public extractBody = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.extractRequestBody(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public checkToken = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidToken(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public checkUser = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidUser(req)
      .then(() => next())
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  // public restricted = (req: Request, res: Response, next: NextFunction): void => {
  //   this._authValidationMiddleware.checkUserRoleForRestriction(req, true)
  //     .then(() => next())
  //     .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  // }

  // public nonRestricted = (req: Request, res: Response, next: NextFunction): void => {
  //   this._authValidationMiddleware.checkUserRoleForRestriction(req, false)
  //     .then(() => next())
  //     .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  // }
}
