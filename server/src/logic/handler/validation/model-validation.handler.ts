import { NextFunction, Request, Response, Router } from "express";
import { ModelValidationMiddleware } from "./../../../logic/middleware/index";
import {
  ApiError, DbError, Recipe, SocoboUser, ValidationError, ValidationGroup
} from "./../../../models/index";

export class ModelValidationHandler {

  constructor (private _modelValidationMiddleware: ModelValidationMiddleware) {}

  public validate<T> (type: { new (): T }, validationGroup: ValidationGroup) {
    return (req: Request, res: Response, next: NextFunction): void => {
      this._modelValidationMiddleware.validate(type, req, [validationGroup.toString()])
        .then((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()))
        .catch(() => next());
    };
  }
}
