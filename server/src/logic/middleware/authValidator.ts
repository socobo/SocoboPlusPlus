import { Request, Response, NextFunction } from "express";
import { ApiError } from "./../../models/apiError";


export class AuthValidator {

  checkRequest (req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      let hasEmailProperty: boolean = req.body.hasOwnProperty("email");
      let hasUsernameProperty: boolean = req.body.hasOwnProperty("username");

      if (!hasEmailProperty && !hasUsernameProperty) {
        return reject(new ApiError("Request Body doesn't have a Username or Email Address!", AuthValidator.name, 
                                    "post('/login')", new Error("No Username or Email provided!")).forResponse());
      }

      if (hasEmailProperty) {
        req.body.isEmailLogin = true;
      } else {
        req.body.isEmailLogin = false;
      }

      resolve();
    });
  }

}