import { NextFunction, Response, Router } from "express";
import { SocoboRequest } from "../../app/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { AuthValidationMiddleware } from "../index";

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

  public checkUser = (restrictedRole: SocoboUserRoleType) => {
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
