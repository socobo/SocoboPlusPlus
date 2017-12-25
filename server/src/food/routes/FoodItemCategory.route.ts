import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { FoodItemCategory, FoodItemCategoryHandler } from "../index";

export class FoodItemCategoryRoute {

  private _objToValidate: FoodItemCategory;

  constructor (
    private _router: Router,
    private _fooditemCategoryHandler: FoodItemCategoryHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {
    this._objToValidate = new FoodItemCategory();
  }

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._fooditemCategoryHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemCategoryHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._modelValidationHandler.validateObject(this._objToValidate, [ValidationGroup.FOODITEMBASE]),
      this._fooditemCategoryHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._modelValidationHandler.validateObject(this._objToValidate, [ValidationGroup.FOODITEMBASE]),
      this._fooditemCategoryHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._fooditemCategoryHandler.deleteById);

    return this._router;
  }
}
