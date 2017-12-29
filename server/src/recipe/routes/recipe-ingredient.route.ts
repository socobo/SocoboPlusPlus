import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { Recipe, RecipeIngredientHandler, RecipeMiddleware } from "../index";

export class RecipeIngredientRoute {

  constructor (
    private _router: Router,
    private _recipeIngredientHandler: RecipeIngredientHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler) {}

  public createRoutes (): Router {

    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._recipeIngredientHandler.getAll);

    return this._router;
  }
}
