import { NextFunction, Request, Response, Router } from "express";
import { ApiValidator } from "./../logic/middleware/index";
import { ApiError, DbError, Recipe, ValidationError } from "./../models/index";

export class ValidationHandler {

  constructor (private _validator: ApiValidator) {}

  public validate = (req: Request, res: Response, next: NextFunction): void => {
    this._validator.validate(Recipe, req)
      .then((e: ValidationError) => res.status(e.statusCode).json(e.forResponse()))
      .catch(() => next());
  }
}
