import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ERRORS, Validatable, ValidationError, ValidationGroup} from "../index";

export class ModelValidationMiddleware {

  /**
   * This validation approache enables also validation of nested objects
   * @param objToValidate
   * @param req
   * @param validationGroups
   */
  public validateObject (objToValidate: Validatable, req: Request, validationGroups: ValidationGroup[]): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      const obj: any = req.body;
      const mappedGroups: string[] = validationGroups.map((group) => group.toString());

      objToValidate.clone(obj);

      validate(objToValidate, { groups: mappedGroups })
        .then((errors: any[]) => {
          if (errors.length > 0) {
            const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
              .addSource(ModelValidationMiddleware.name)
              .addSourceMethod("validateObject(..)")
              .addValidationErrors(errors);
            reject(e);
          } else {
            resolve();
          }
        })
        .catch((error: any) => {
          const e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
            .addSource(ModelValidationMiddleware.name)
            .addSourceMethod("validateObject(..)")
            .addCause(error);
          reject(e);
        });
    });
  }
}
