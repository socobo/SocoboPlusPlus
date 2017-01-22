import { Request, Response } from "express";
import { AuthService } from "./../../logic/services/index";
import {
  ApiError, ERRORS, ExtractRequestBodyResult, LoginResponse, SocoboUser
} from "./../../models/index";

export class AuthHandler {

  constructor (private _authService: AuthService) {}

  public login = (req: Request, res: Response): void => {

    if (!req.body.hasOwnProperty("ExtractRequestBodyResult")) {
      const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
        .addSource(AuthHandler.name)
        .addSourceMethod("login");
      res.status(err.statusCode).json(err.forResponse());
    }

    const erbr: ExtractRequestBodyResult = req.body.ExtractRequestBodyResult;
    this._authService.login(erbr.isEmailLogin, erbr.usernameOrEmail, erbr.password)
      .then((result: LoginResponse) => {
        delete req.body.ExtractRequestBodyResult;
        res.status(200).json(result);
      })
      .catch((error: any) => {
        res.status(error.statusCode).json(error.forResponse());
      });
  }

  public register = (req: Request, res: Response): void => {

    if (!req.body.hasOwnProperty("ExtractRequestBodyResult")) {
      const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
        .addSource(AuthHandler.name)
        .addSourceMethod("register");
      res.status(err.statusCode).json(err.forResponse());
    }

    const erbr: ExtractRequestBodyResult = req.body.ExtractRequestBodyResult;
    this._authService.register(erbr.isEmailLogin, erbr.usernameOrEmail, erbr.password)
      .then((result: SocoboUser) => {
        delete req.body.ExtractRequestBodyResult;
        res.status(201).json(result);
      })
      .catch((error: any) => {
        res.status(error.statusCode).json(error.forResponse());
      });
  }
}
