import { NextFunction, Request, Response, Router } from "express";
import { AuthValidationMiddleware } from "./../../../logic/middleware/index";
import { ApiError, DbError, Recipe, ValidationError } from "./../../../models/index";

export class AuthValidationHandler {

  constructor (private _authValidationMiddleware: AuthValidationMiddleware) {}

  public checkRequest = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkRequest(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public extractBody = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.extractRequestBody(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public checkToken = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidToken(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public checkUser = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidUser(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public restricted = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkUserRoleForRestriction(req, true)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public nonRestricted = (req: Request, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkUserRoleForRestriction(req, false)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  private _sendErrorResponse = (e: any, res: Response): void => {
    res.status(e.statusCode).json(e.forResponse());
  }
}
