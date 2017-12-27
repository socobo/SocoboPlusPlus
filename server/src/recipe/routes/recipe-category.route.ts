import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { Recipe, RecipeCategory, RecipeCategoryHandler, RecipeMiddleware } from "../index";

export class RecipeCategoryRoute {

  constructor (
    private _router: Router,
    private _recipeCategoryHandler: RecipeCategoryHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler) {}

  public createRoutes (): Router {

    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._recipeCategoryHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._recipeCategoryHandler.getById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._modelValidationHandler.validateObject(new RecipeCategory(), [ValidationGroup.RECIPE]),
      this._recipeCategoryHandler.save);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._modelValidationHandler.validateObject(new RecipeCategory(), [ValidationGroup.RECIPE]),
      this._recipeCategoryHandler.update);

    this._router.delete ("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._recipeCategoryHandler.delete);

    return this._router;
  }
}
