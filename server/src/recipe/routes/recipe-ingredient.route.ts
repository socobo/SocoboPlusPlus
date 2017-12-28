import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { Recipe, RecipeCategory, RecipeCategoryHandler, RecipeMiddleware } from "../index";

export class RecipeIngredientRoute {

  constructor (
    private _router: Router,
    private _recipeCategoryHandler: RecipeCategoryHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler) {}

  public createRoutes (): Router {

    this._router.get("/",(req, res) => {
      res.json('YES it works!')
    });

    return this._router;
  }
}
