import { Router } from "express";
import { SocoboUserProvidersHandler } from "../handlers/SocoboUserProviders.handler";
import { AuthValidationHandler } from "../../auth/index";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { SocoboUserProvider } from "../index";

export class SocoboUserProvidersRoute {

  constructor (
    private _router: Router,
    private _socoboUserProvidersHandler: SocoboUserProvidersHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._socoboUserProvidersHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserProvidersHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(SocoboUserProvider, [ValidationGroup.USER]),
      this._socoboUserProvidersHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserProvidersHandler.deleteById);

    return this._router;
  }
}
