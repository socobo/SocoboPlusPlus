import { Router } from "express";
import {
  AuthValidationHandler, ModelValidationHandler, RecipeHandler
} from "./../../../../logic/handler/index";

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
      this._modelValidationHandler.validate,
      this._recipeHandler.save);

    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._recipeHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._recipeHandler.getById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._recipeHandler.delete);

    return this._router;
  }
}
