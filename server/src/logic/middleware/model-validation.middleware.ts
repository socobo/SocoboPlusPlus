import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ERRORS, ValidationError } from "./../../models/index";

export class ModelValidationMiddleware {

  public validate<T> (type: { new (): T }, req: Request, validationGroups: string[]): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      const obj: any = req.body;
      const objectToValidate: T = new type();

      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          (objectToValidate as any)[prop] = obj[prop];
        }
      }

      validate(objectToValidate, { groups: [...validationGroups] })
        .then((errors: any[]) => {
          if (errors.length > 0) {
            const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
              .addSource(ModelValidationMiddleware.name)
              .addSourceMethod("validate(..)")
              .addValidationErrors(errors);
            resolve(e);
          } else {
            reject();
          }
        }).catch((error: any) => {
          const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
            .addSource(ModelValidationMiddleware.name)
            .addSourceMethod("validate(..)")
            .addCause(error);
          resolve(e);
        });
    });
  }
}
