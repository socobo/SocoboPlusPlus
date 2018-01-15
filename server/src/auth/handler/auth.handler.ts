import { NextFunction, Response } from "express";
import {
  ApiError, ERRORS, ExtractRequestBodyResult, LoginResponse, SocoboRequest
} from "../../app/index";
import { SocoboUser } from "../../socobouser/index";
import { AuthService } from "../index";

export class AuthHandler {

  constructor (private _authService: AuthService) {}

  public login = async (req: SocoboRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getExtractedRequestBodyResult(req, "login(..)");
      const loginResult = await this._authService.login(result);
      res.status(200).json(loginResult);
    } catch (error) {
      next(error);
    }
  }

  public register = async (req: SocoboRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this._getExtractedRequestBodyResult(req, "register(..)");
      const user = await this._authService.register(result);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  private _getExtractedRequestBodyResult = async (req: SocoboRequest,
                                                  sourceMethod: string): Promise<ExtractRequestBodyResult> => {

    if (!req.requestData.hasOwnProperty("ExtractRequestBodyResult")) {
      throw new ApiError(ERRORS.REQUEST_BODY)
        .addSource(AuthHandler.name)
        .addSourceMethod(sourceMethod);
    }
    return req.requestData.ExtractRequestBodyResult;
  }
}
