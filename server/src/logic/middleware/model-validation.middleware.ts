import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ERRORS, ValidationError, ValidationGroup } from "./../../models/index";

export class ModelValidationMiddleware {

  public validate<T> (type: { new (): T }, req: Request, validationGroups: ValidationGroup[]): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      const objectToValidate: T = new type();
      const obj: any = req.body;
      const mappedGroups: string[] = validationGroups.map((group) => group.toString());

      for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          (objectToValidate as any)[prop] = obj[prop];
        }
      }

      validate(objectToValidate, { groups: mappedGroups })
        .then((errors: any[]) => {
          if (errors.length > 0) {
            const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
              .addSource(ModelValidationMiddleware.name)
              .addSourceMethod("validate(..)")
              .addValidationErrors(errors);
            reject(e);
          } else {
            resolve();
          }
        })
        .catch((error: any) => {
          const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
            .addSource(ModelValidationMiddleware.name)
            .addSourceMethod("validate(..)")
            .addCause(error);
          reject(e);
        });
    });
  }
}
