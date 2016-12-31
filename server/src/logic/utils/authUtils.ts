import * as jwt from "jsonwebtoken";
import { Router, Request, Response, NextFunction } from "express";
import { Config } from "./../../config";

/**
 * Rewrite as Promise Middleware --> checkValidToken()
 */
export class AuthUtils {

  static checkState (req: any, res: Response, next: NextFunction): any {
    // get token from request
    const token = req.body.token 
                    || req.query.token 
                    || req.headers["x-access-token"];
    // check if token is available
    if (token) {
      // verify token
      jwt.verify(token, (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), (err: any, decoded: any)  => {
        // error handling
        if (err) {
          // setup error message
          let msg = "Failed to authenticate token.";
          // append error message
          if (err.name === "TokenExpiredError") {
            msg = `${msg} Token expired at ${err.expiredAt}`;
          }
          // append error message
          if (err.name === "JsonWebTokenError") {
            msg = `${msg} Error message: ${err.message}`;
          }
          // return error data
          return res.status(400).json({success: false, message: msg});
        } else {
          // go to the next step
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // return error data
      return res.status(403).json({success: false, message: "No token provided."});
    }
  }
}