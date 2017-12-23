import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
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
      this._authValidationHandler.checkToken,
      this._recipeHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._recipeHandler.getById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._recipeHandler.save);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._recipeHandler.update);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._recipeHandler.delete);

    return this._router;
  }
}
