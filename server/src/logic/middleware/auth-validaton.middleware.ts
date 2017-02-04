import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Config } from "./../../config";
import { ApiError, ERRORS, ExtractRequestBodyResult, Role, SocoboRequest, SocoboUser } from "./../../models/index";
import { UserService } from "./../services/index";

export class AuthValidationMiddleware {

  constructor (private _userService: UserService) {}

  public checkRequest (req: SocoboRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      const hasEmailProperty: boolean = req.body.hasOwnProperty("email");
      const hasUsernameProperty: boolean = req.body.hasOwnProperty("username");
      const hasPasswordProperty: boolean = req.body.hasOwnProperty("password");

      if (!hasEmailProperty && !hasUsernameProperty) {
        const e = new ApiError(ERRORS.VAL_MISSING_USERNAME_EMAIL)
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkRequest(..)");
        return reject(e);
      }
      if (!hasPasswordProperty) {
        const e = new ApiError(ERRORS.VAL_MISSING_PASSWORD)
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkRequest(..)");
        return reject(e);
      }

      req.requestData = {};

      if (hasEmailProperty) {
        req.requestData.isEmailLogin = true;
      } else {
        req.requestData.isEmailLogin = false;
      }

      resolve();
    });
  }

  public extractRequestBody (req: SocoboRequest): Promise<ExtractRequestBodyResult> {
    return new Promise((resolve, reject) => {
      if (!req.requestData.hasOwnProperty("isEmailLogin")) {
        const e: ApiError = new ApiError(ERRORS.REQUEST_BODY)
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("extractRequestBody(..)");
        return reject(e);
      }

      req.requestData.ExtractRequestBodyResult = new ExtractRequestBodyResult(req.requestData.isEmailLogin,
                                                (req.requestData.isEmailLogin ? req.body.email : req.body.username),
                                                req.body.password, req.body.role);
      resolve();
    });
  }

  public checkValidToken (req: SocoboRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      const authHeader: string = (process.env.TOKEN_HEADER || Config.TOKEN_HEADER);
      const token = req.body.token
                    || req.query.token
                    || req.headers[authHeader];
      if (token) {
        jwt.verify(token, (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), (err: any, decoded: any) => {
          if (err) {
            let e: ApiError;
            if (err.name === "TokenExpiredError") {
              e = new ApiError(ERRORS.AUTH_TOKEN_EXPIRED);
            }
            if (err.name === "JsonWebTokenError") {
              e = new ApiError(ERRORS.AUTH_TOKEN_ERROR);
            }
            e.addSource(AuthValidationMiddleware.name).addSourceMethod("checkRequest(..)");
            return reject(e);
          }
          req.requestData = {};
          req.requestData.decoded = decoded;
          resolve();
        });
      } else {
        const e = new ApiError(ERRORS.AUTH_TOKEN_MISSING)
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkRequest(..)");
        return reject(e);
      }
    });
  }

  public checkValidUser (req: SocoboRequest, restrictedRole: Role): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!req.requestData.hasOwnProperty("decoded")) {
        const err: ApiError = new ApiError(ERRORS.REQUEST_BODY_AUTHCHECK.withArgs("a decoded Object"))
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkValidUser(..)");
        return reject(err);
      }
      this._userService.getUserByEmail(req.requestData.decoded.email)
        .then((user: any) => {
          req.requestData = {};
          // In the future if we need more roles we could
          // The role of a user could be in the token and would be fetched
          // from the token if we need it for the authorization (or from db)
          // check for a role like if user.role === role
          if (user.role === restrictedRole) {
            resolve();
          } else {
            const err: ApiError = new ApiError(ERRORS.USER_NOT_AUTHORIZED)
              .addSource(AuthValidationMiddleware.name)
              .addSourceMethod("checkValidUser(..)");
            reject(err);
          }
        })
        .catch((error: any) => reject(error));
    });
  }
}
