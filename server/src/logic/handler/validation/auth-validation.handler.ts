import { NextFunction, Response, Router } from "express";
import { AuthValidationMiddleware } from "./../../../logic/middleware/index";
import { ApiError, DbError, Recipe, Role, SocoboRequest, ValidationError } from "./../../../models/index";

export class AuthValidationHandler {

  constructor (private _authValidationMiddleware: AuthValidationMiddleware) {}

  public checkRequest = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkRequest(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public extractBody = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.extractRequestBody(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public checkToken = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidToken(req)
      .then(() => next())
      .catch((e: any) => this._sendErrorResponse(e, res));
  }

  public checkUser = (restrictedRole: Role) => {
    return (req: SocoboRequest, res: Response, next: NextFunction): void => {
      this._authValidationMiddleware.checkValidUser(req, restrictedRole)
        .then(() => next())
        .catch((e: any) => this._sendErrorResponse(e, res));
    };
  }

  private _sendErrorResponse = (e: any, res: Response): void => {
    res.status(e.statusCode).json(e.forResponse());
  }
}
