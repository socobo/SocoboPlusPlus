import { NextFunction, Request, Response, Router } from "express";
import { ModelValidationMiddleware } from "./../../../logic/middleware/index";
import {
  ApiError, DbError, Recipe, SocoboUser, ValidationError, ValidationGroup
} from "./../../../models/index";

export class ModelValidationHandler {

  constructor (private _modelValidationMiddleware: ModelValidationMiddleware) {}

  public validate<T> (type: { new (): T }, validationGroups: ValidationGroup[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._modelValidationMiddleware.validate(type, req, validationGroups)
        .then((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()))
        .catch(() => next());
    };
  }
}
