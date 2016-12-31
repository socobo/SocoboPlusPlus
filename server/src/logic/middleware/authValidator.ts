import * as jwt from "jsonwebtoken"; 
import { Request, Response, NextFunction } from "express";
import { ApiError } from "./../../models/apiError";
import { Config } from "./../../config";


export class AuthValidator {

  checkRequest (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      let hasEmailProperty: boolean = req.body.hasOwnProperty("email");
      let hasUsernameProperty: boolean = req.body.hasOwnProperty("username");

      if (!hasEmailProperty && !hasUsernameProperty) {
        return reject(new ApiError("Request Body doesn't have a Username or Email Address!", AuthValidator.name, 
                                    "checkRequest(req)", new Error("No Username or Email provided!")).forResponse());
      }

      if (hasEmailProperty) {
        req.body.isEmailLogin = true;
      } else {
        req.body.isEmailLogin = false;
      }

      resolve();
    });
  }

  /**
   * Rewrite as Promise Middleware --> checkValidToken()
   */
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
            if (err.name === "TokenExpiredError") {
              msg = `${msg} Token expired at ${err.expiredAt}`;
            }
            if (err.name === "JsonWebTokenError") {
              msg = `${msg} Error message: ${err.message}`;
            }
            return reject(new ApiError(msg, AuthValidator.name, "checkValidToken(req)", err));
          }
          
          req.body.decoded = decoded;
          resolve();
        });
      } else {
        return reject(new ApiError("No token provided.", AuthValidator.name, "checkValidToken(req)", new Error()));
      }
    });
  }
}