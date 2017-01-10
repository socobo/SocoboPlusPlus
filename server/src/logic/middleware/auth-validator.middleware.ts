import * as jwt from "jsonwebtoken"; 
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./../../models/index";
import { Config } from "./../../config";
import { ERRORS } from "./../../errors"


export class AuthValidator {

  checkRequest (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      let hasEmailProperty: boolean = req.body.hasOwnProperty("email");
      let hasUsernameProperty: boolean = req.body.hasOwnProperty("username");

      if (!hasEmailProperty && !hasUsernameProperty) {
        let e = new ApiError(ERRORS.VAL_MISSING_PW_EMAIL);
        e.source = AuthValidator.name;
        e.sourceMethod = "checkRequest(..)"
        return reject(e.forResponse());
      }

      if (hasEmailProperty) {
        req.body.isEmailLogin = true;
      } else {
        req.body.isEmailLogin = false;
      }

      resolve();
    });
  }

  checkValidToken (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {

      const authHeader: string = (process.env.TOKEN_HEADER || Config.TOKEN_HEADER);
      const token = req.body.token 
                    || req.query.token 
                    || req.headers[authHeader];

      if (token) {
        jwt.verify(token, 
                    (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), 
                    (err: any, decoded: any)  => {

          if (err) {
            let msg = "Failed to authenticate token.";
            let e;
            if (err.name === "TokenExpiredError") {
              e = new ApiError(ERRORS.AUTH_TOKEN_EXPIRED);
              e.source = AuthValidator.name;
              e.sourceMethod = "checkRequest(..)"
              //msg = `${msg} Token expired at ${err.expiredAt}`;
            }
            if (err.name === "JsonWebTokenError") {
              e = new ApiError(ERRORS.AUTH_TOKEN_ERROR);
              e.source = AuthValidator.name;
              e.sourceMethod = "checkRequest(..)"
              //msg = `${msg} Error message: ${err.message}`;
            }
            return reject(e)
          }
          
          req.body.decoded = decoded;
          resolve();
        });
      } else {
        let e = new ApiError(ERRORS.AUTH_TOKEN_MISSING);
        e.source = AuthValidator.name;
        e.sourceMethod = "checkRequest(..)"
        return reject(e);
      }
    });
  }
}