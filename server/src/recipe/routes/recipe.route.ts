import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { Recipe, RecipeHandler, RecipeMiddleware } from "../index";

export class RecipeRoute {

  constructor (
    private _router: Router,
    private _multer: Instance,
    private _recipeHandler: RecipeHandler,
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

    this._router.get("/search/field",
      this._authValidationHandler.checkToken,
      this._recipeHandler.searchByField);

    this._router.put("/:id",
      this._recipeHandler.merge,
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new Recipe(), [ValidationGroup.RECIPE]),
      this._recipeHandler.update);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new Recipe(), [ValidationGroup.RECIPE]),
      this._recipeHandler.save);

    this._router.post("/:id/image",
      this._authValidationHandler.checkToken,
      this._multer.single("recipeImage"),
      this._recipeMiddleware.checkTitle,
      this._recipeHandler.uploadImage);

    this._router.delete("/:id/image/:imgId",
      this._authValidationHandler.checkToken,
      this._recipeHandler.deleteImage);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._recipeHandler.delete);

    return this._router;
  }
}
