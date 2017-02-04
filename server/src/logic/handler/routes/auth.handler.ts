import { Response } from "express";
import { AuthService } from "./../../../logic/services/index";
import {
  ApiError, ERRORS, ExtractRequestBodyResult,
  LoginResponse, SocoboRequest, SocoboUser
} from "./../../../models/index";

export class AuthHandler {

  constructor (private _authService: AuthService) {}

  public login = (req: SocoboRequest, res: Response): void => {

    if (!req.requestData.hasOwnProperty("ExtractRequestBodyResult")) {
      const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
        .addSource(AuthHandler.name)
        .addSourceMethod("login");
      res.status(err.statusCode).json(err.forResponse());
    }

    const erbr: ExtractRequestBodyResult = req.requestData.ExtractRequestBodyResult;

    this._authService.login(erbr.isEmailLogin, erbr.usernameOrEmail, erbr.password)
      .then((result: LoginResponse) => {
        res.status(200).json(result);
      })
      .catch((error: any) => {
        res.status(error.statusCode).json(error.forResponse());
      });
  }

  public register = (req: SocoboRequest, res: Response): void => {

    if (!req.requestData.hasOwnProperty("ExtractRequestBodyResult")) {
      const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
        .addSource(AuthHandler.name)
        .addSourceMethod("register");
      res.status(err.statusCode).json(err.forResponse());
    }

    const erbr: ExtractRequestBodyResult = req.requestData.ExtractRequestBodyResult;

    this._authService.register(erbr.isEmailLogin, erbr.usernameOrEmail, erbr.password, erbr.role)
      .then((result: SocoboUser) => {
        res.status(201).json(result);
      })
      .catch((error: any) => {
        res.status(error.statusCode).json(error.forResponse());
      });
  }
}
