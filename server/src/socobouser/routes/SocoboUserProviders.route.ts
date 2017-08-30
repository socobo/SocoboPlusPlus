import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserProvidersHandler } from "../handlers/SocoboUserProviders.handler";
import { SocoboUserProvider, SocoboUserRoleTypes } from "../index";

// TODO: remove this class --> now integrated into socobouser collection
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
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserProvidersHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserProvidersHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._modelValidationHandler.validate(SocoboUserProvider, [ValidationGroup.USER]),
      this._socoboUserProvidersHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._modelValidationHandler.validate(SocoboUserProvider, [ValidationGroup.USER]),
      this._socoboUserProvidersHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserProvidersHandler.deleteById);

    return this._router;
  }
}
