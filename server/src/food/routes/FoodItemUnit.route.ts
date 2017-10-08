import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { FoodItemUnit, FoodItemUnitHandler } from "../index";

export class FoodItemUnitRoute {

  constructor (
    private _router: Router,
    private _fooditemUnitHandler: FoodItemUnitHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._fooditemUnitHandler.getAll);

    this._router.get("/fooditem/:id",
      this._authValidationHandler.checkToken,
      this._fooditemUnitHandler.getAllByFooditemId);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemUnitHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new FoodItemUnit(), [ValidationGroup.FOODITEMBASE]),
      this._fooditemUnitHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new FoodItemUnit(), [ValidationGroup.FOODITEMBASE]),
      this._fooditemUnitHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemUnitHandler.deleteById);

    return this._router;
  }
}
