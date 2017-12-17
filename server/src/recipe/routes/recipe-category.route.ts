import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { Recipe, RecipeHandler, RecipeMiddleware } from "../index";

export class RecipeCategoryRoute {

  constructor (
    private _router: Router,
    private _multer: Instance,
    private _recipeHandler: RecipeHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler,
    private _recipeMiddleware: RecipeMiddleware) {}

  public createRoutes (): Router {

    this._router.get("/",
      (request, response) => {
        response.json('All categories');
      })



    return this._router;
  }
}
