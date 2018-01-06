import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { Recipe, RecipeIngredient, RecipeIngredientHandler, RecipeMiddleware } from "../index";

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

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._recipeIngredientHandler.getById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new RecipeIngredient(), [ValidationGroup.RECIPE]),
      this._recipeIngredientHandler.save);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new RecipeIngredient(), [ValidationGroup.RECIPE]),
      this._recipeIngredientHandler.update);

    this._router.delete ("/:id",
      this._authValidationHandler.checkToken,
      this._recipeIngredientHandler.delete);

    return this._router;
  }
}
