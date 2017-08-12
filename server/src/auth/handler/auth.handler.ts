import { Response } from "express";
import {
  ApiError, ERRORS, ExtractRequestBodyResult, LoginResponse, SocoboRequest
} from "../../app/index";
import { SocoboUser } from "../../socobouser/index";
import { AuthService } from "../index";

export class AuthHandler {

  constructor (private _authService: AuthService) {}

  public login = (req: SocoboRequest, res: Response): void => {
    this._getExtractedRequestBodyResult(req, "login(..)")
      .then((result: ExtractRequestBodyResult) => this._authService.login(result))
      .then((loginResult: LoginResponse) => res.status(200).json(loginResult))
      .catch((error: any) => res.status(error.statusCode).json(error.forResponse()));
  }

  public register = (req: SocoboRequest, res: Response): void => {
    this._getExtractedRequestBodyResult(req, "register(..)")
      .then((result: ExtractRequestBodyResult) => this._authService.register(result))
      .then((user: SocoboUser) => res.status(200).json(user))
      .catch((error: any) => res.status(error.statusCode).json(error.forResponse()));
  }

  private _getExtractedRequestBodyResult = (req: SocoboRequest,
                                            sourceMethod: string): Promise<ExtractRequestBodyResult> => {
    return new Promise((resolve, reject) => {
      if (!req.requestData.hasOwnProperty("ExtractRequestBodyResult")) {
        const err: ApiError = new ApiError(ERRORS.REQUEST_BODY)
          .addSource(AuthHandler.name)
          .addSourceMethod(sourceMethod);
        return reject(err);
      }
      resolve(req.requestData.ExtractRequestBodyResult);
    });
  }
}
