import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ModelValidationMiddleware, Validatable, ValidationError, ValidationGroup } from "../index";

export class ModelValidationHandler {

  constructor (private _modelValidationMiddleware: ModelValidationMiddleware) {}

  public validateObject (objectToValidate: Validatable, validationGroups: ValidationGroup[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._modelValidationMiddleware.validateObject(objectToValidate, req, validationGroups)
        .then(() => next())
        .catch(next);
    };
  }
}
