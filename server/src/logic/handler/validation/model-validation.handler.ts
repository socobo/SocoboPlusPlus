import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ModelValidationMiddleware } from "./../../../logic/middleware/index";
import {
  ApiError, DbError, Recipe, SocoboUser, Validatable, ValidationError, ValidationGroup
} from "./../../../models/index";

export class ModelValidationHandler {

  constructor (private _modelValidationMiddleware: ModelValidationMiddleware) {}

  public validate<T> (type: { new (): T }, validationGroups: ValidationGroup[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._modelValidationMiddleware.validate(type, req, validationGroups)
        .then(() => next())
        .catch((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()));
    };
  }

  public validateObject (
    objectToValidate: Validatable,
    validationGroups: ValidationGroup[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._modelValidationMiddleware.validateObject(objectToValidate, req, validationGroups)
        .then(() => next())
        .catch((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()));
    };
  }
}
