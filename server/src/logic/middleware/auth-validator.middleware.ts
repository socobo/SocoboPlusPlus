import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Config } from "./../../config";
import { ApiError, ERRORS } from "./../../models/index";

export class AuthValidator {

  public checkRequest (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      const hasEmailProperty: boolean = req.body.hasOwnProperty("email");
      const hasUsernameProperty: boolean = req.body.hasOwnProperty("username");
      const hasPasswordProperty: boolean = req.body.hasOwnProperty("password");

      if (!hasEmailProperty && !hasUsernameProperty) {
        const e = new ApiError(ERRORS.VAL_MISSING_USERNAME_EMAIL)
          .addSource(AuthValidator.name)
          .addSourceMethod("checkRequest(..)");
        return reject(e);
      }
      if (!hasPasswordProperty) {
        const e = new ApiError(ERRORS.VAL_MISSING_PASSWORD)
          .addSource(AuthValidator.name)
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
            e.addSource(AuthValidator.name).addSourceMethod("checkRequest(..)");
            return reject(e);
          }
          req.body.decoded = decoded;
          resolve();
        });
      } else {
        const e = new ApiError(ERRORS.AUTH_TOKEN_MISSING)
          .addSource(AuthValidator.name)
          .addSourceMethod("checkRequest(..)");
        return reject(e);
      }
    });
  }
}
