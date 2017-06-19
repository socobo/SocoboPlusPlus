import { Router } from "express";
import { Instance } from "multer";
import {
  AuthValidationHandler, ModelValidationHandler, RecipeHandler
} from "./../../../../logic/handler/index";
import { DataType, Recipe, ValidationGroup } from "./../../../../models/index";

export class RecipeRoute {

  constructor (
    private _router: Router,
    private _multer: Instance,
    private _recipeHandler: RecipeHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(Recipe, [ValidationGroup.RECIPE]),
      this._recipeHandler.save);

    this._router.post("/:id/image",
      this._authValidationHandler.checkToken,
      this._multer.single("recipeImage"),
      this._recipeHandler.uploadImage);

    this._router.get("/search",
      this._authValidationHandler.checkToken,
      this._recipeHandler.searchByField);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._recipeHandler.updateRecipeProperties,
      this._modelValidationHandler.validate(Recipe, [ValidationGroup.RECIPE]),
      this._recipeHandler.update);

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
