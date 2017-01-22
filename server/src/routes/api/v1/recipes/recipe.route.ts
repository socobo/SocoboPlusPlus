import { NextFunction, Request, Response, Router } from "express";
import {
  AuthValidationHandler, ModelValidationHandler, RecipeHandler
} from "./../../../../handler/index";
import { RecipeService } from "./../../../../logic/services/index";

export class RecipeRoute {

  constructor (
    private _router: Router,
    private _recipeHandler: RecipeHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser,
      this._authValidationHandler.nonRestricted,
      this._modelValidationHandler.validate,
      this._recipeHandler.save);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser,
      this._authValidationHandler.nonRestricted,
      this._recipeHandler.getById);

    return this._router;
  }
}
