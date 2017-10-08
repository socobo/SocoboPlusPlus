import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { FoodItemTemplate, FoodItemTemplateHandler } from "../index";

export class FoodItemTemplateRoute {

  constructor (
    private _router: Router,
    private _fooditemTemplateHandler: FoodItemTemplateHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._fooditemTemplateHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemTemplateHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new FoodItemTemplate(), [ValidationGroup.FOODITEMBASE]),
      this._fooditemTemplateHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validateObject(new FoodItemTemplate(), [ValidationGroup.FOODITEMBASE]),
      this._fooditemTemplateHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._fooditemTemplateHandler.deleteById);

    return this._router;
  }
}
