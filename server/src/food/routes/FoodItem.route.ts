import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { FoodItem, FoodItemHandler } from "../index";

export class FoodItemRoute {

  private _objToValidate: FoodItem;

  constructor (
    private _router: Router,
    private _fooditemHandler: FoodItemHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {
    this._objToValidate = new FoodItem();
  }

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._fooditemHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(this._objToValidate, [ValidationGroup.FOODITEM]),
      this._fooditemHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(this._objToValidate, [ValidationGroup.FOODITEM]),
      this._fooditemHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemHandler.deleteById);

    return this._router;
  }
}
