import { NextFunction, Request, Response, Router } from "express";
import { ModelValidationMiddleware } from "./../../../logic/middleware/index";
import { ApiError, DbError, Recipe, SocoboUser, ValidationError } from "./../../../models/index";

export class ModelValidationHandler {

  constructor (private _modelValidationMiddleware: ModelValidationMiddleware) {}

  public validate = (req: Request, res: Response, next: NextFunction): void => {
    this._modelValidationMiddleware.validate(Recipe, req)
      .then((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()))
      .catch(() => next());
  }

  public validateAuth = (req: Request, res: Response, next: NextFunction): void => {
    this._modelValidationMiddleware.validate(SocoboUser, req)
      .then((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()))
      .catch(() => next());
  }
}
