import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { Recipe, RecipeCategoryHandler, RecipeMiddleware } from "../index";

export class RecipeCategoryRoute {

  constructor (
    private _router: Router,
    private _multer: Instance,
    private _recipeHandler: RecipeCategoryHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler,
    private _recipeMiddleware: RecipeMiddleware) {}

  public createRoutes (): Router {

    this._router.get("/",
      this._recipeHandler.getAll)



    return this._router;
  }
}
