import { NextFunction, Request, Response, Router } from "express";
import {
  AuthHandler, RecipeHandler, ValidationHandler
} from "./../../../../handler/index";
import { RecipeService } from "./../../../../logic/services/index";

export class RecipeRoute {

  constructor (
    private _router: Router,
    private _recipeHandler: RecipeHandler,
    private _validationHandler: ValidationHandler,
    private _authHandler: AuthHandler
  ) {}

  public createRoutes (): Router {
    this._router.post("/",
      this._authHandler.authenticate,
      this._validationHandler.validate,
      this._recipeHandler.save);

    this._router.get("/:id",
      this._authHandler.authenticate,
      this._recipeHandler.getById);

    return this._router;
  }
}
