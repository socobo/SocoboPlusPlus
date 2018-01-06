import { NextFunction, Response, Router } from "express";
import { SocoboRequest } from "../../app/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { AuthValidationMiddleware } from "../index";

export class AuthValidationHandler {

  constructor (private _authValidationMiddleware: AuthValidationMiddleware) {}

  public checkRequest = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkRequest(req)
      .then(() => next())
      .catch(next);
  }

  public extractBody = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.extractRequestBody(req)
      .then(() => next())
      .catch(next);
  }

  public checkToken = (req: SocoboRequest, res: Response, next: NextFunction): void => {
    this._authValidationMiddleware.checkValidToken(req)
      .then(() => next())
      .catch(next);
  }

  public checkUser = (restrictedRole: SocoboUserRoleType) => {
    return (req: SocoboRequest, res: Response, next: NextFunction): void => {
      this._authValidationMiddleware.checkValidUser(req, restrictedRole)
        .then(() => next())
        .catch(next);
    };
  }
}
