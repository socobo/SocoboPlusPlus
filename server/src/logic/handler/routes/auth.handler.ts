import { Request, Response } from "express";
import { AuthService } from "./../../../logic/services/index";
import {
  ApiError, ERRORS, ExtractRequestBodyResult, LoginResponse, SocoboUser
} from "./../../../models/index";

export class AuthHandler {

  constructor (private _authService: AuthService) {}

  public login = (req: Request, res: Response): void => {
    this._getExtractedRequestBodyResult(req, "login(..)")
      .then((result: ExtractRequestBodyResult) => {
        return this._authService.login(result.isEmailLogin, result.usernameOrEmail, result.password);
      })
      .then((loginResult: LoginResponse) => {
        delete req.body.ExtractRequestBodyResult;
        res.status(200).json(loginResult);
      })
      .catch((error: any) => res.status(error.statusCode).json(error.forResponse()));
  }

  public register = (req: Request, res: Response): void => {
    this._getExtractedRequestBodyResult(req, "register(..)")
      .then((result: ExtractRequestBodyResult) => {
        return this._authService.register(result.isEmailLogin, result.usernameOrEmail, result.password);
      })
      .then((user: SocoboUser) => {
        delete req.body.ExtractRequestBodyResult;
        res.status(200).json(user);
      })
      .catch((error: any) => res.status(error.statusCode).json(error.forResponse()));
  }

  private _getExtractedRequestBodyResult = (req: Request, sourceMethod: string): Promise<ExtractRequestBodyResult> => {
    return new Promise((resolve, reject) => {
      if (!req.body.hasOwnProperty("ExtractRequestBodyResult")) {
        const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
          .addSource(AuthHandler.name)
          .addSourceMethod(sourceMethod);
        return reject(err);
      }
      resolve(req.body.ExtractRequestBodyResult);
    });
  }
}
