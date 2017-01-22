import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Config } from "./../../config";
import { ApiError, ERRORS, SocoboUser } from "./../../models/index";
import { UserService } from "./../services/index";

export class AuthValidationMiddleware {

  constructor (private _userService: UserService) {}

  public checkRequest (req: Request): Promise<any> {
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

      if (hasEmailProperty) {
        req.body.isEmailLogin = true;
      } else {
        req.body.isEmailLogin = false;
      }

      resolve();
    });
  }

  public checkValidToken (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      const authHeader: string = (process.env.TOKEN_HEADER || Config.TOKEN_HEADER);
      const token = req.body.token
                    || req.query.token
                    || req.headers[authHeader];
      if (token) {
        jwt.verify(token, (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), (err: any, decoded: any)  => {
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
          req.body.decoded = decoded;
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

  public checkValidUser (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!req.body.hasOwnProperty("decoded")) {
        const err: ApiError = new ApiError(ERRORS.REQUEST_BODY_AUTHCHECK.withArgs("a decoded Object"))
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkValidUser(..)");
        return reject(err);
      }
      this._userService.getUserByEmail(req.body.decoded.email)
        .then((user: any) => {
          delete req.body.decoded;
          req.body.isAdmin = user.isadmin;
          resolve();
        })
        .catch((error: any) => reject(error));
    });
  }

  public checkUserRoleForRestriction (req: Request, shouldBeRestricted: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!req.body.hasOwnProperty("isAdmin")) {
        const err: ApiError = new ApiError(ERRORS.REQUEST_BODY_AUTHCHECK.withArgs("an isAdmin Property"))
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkUserRole(..)");
        return reject(err);
      }

      if (shouldBeRestricted) {
        if (req.body.isAdmin) {
          delete req.body.isAdmin;
          return resolve();
        }
        const error: ApiError = new ApiError(ERRORS.USER_NOT_A_ADMIN)
          .addSource(AuthValidationMiddleware.name)
          .addSourceMethod("checkUserRole(..)");
        return reject(error);
      }

      delete req.body.isAdmin;
      resolve();
    });
  }
}
