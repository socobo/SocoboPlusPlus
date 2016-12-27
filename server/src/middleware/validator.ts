import { Router, Request, Response, NextFunction } from "express";
import { validate } from "class-validator"
import { ValidationError } from "./../models/validation-error";


export class ApiValidator {

  apiValidator <T> (type: { new (): T }) {
    return ((req: Request, res: Response, next: NextFunction) => {
      let obj: any = req.body;
      let objectToValidate: T = new type();
      for (let prop in obj) {
        (objectToValidate as any)[prop] = obj[prop];
      }

      validate(objectToValidate)
        .then((errorResults: any[]) => {
          if (errorResults.length > 0) {
            res.status(400).json(new ValidationError("Validation failed",
              "Validator", "validate()", errorResults).forResponse())
          } else {
            next();
          }
        })
        .catch((error: any) => {
          res.status(500).json(new ValidationError("Internal Server Error",
            "Validator", "validate()", error).forResponse())
        });
    });
  }

}