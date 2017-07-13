import { Router } from "express";
import { SocoboUserRolesHandler } from "../handlers/SocoboUserRoles.handler";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRole } from "../index";
import { ValidationGroup, ModelValidationHandler } from "../../app/index";

export class SocoboUserRolesRoute {

  constructor (
    private _router: Router,
    private _socoboUserRolesHandler: SocoboUserRolesHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._socoboUserRolesHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserRolesHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(SocoboUserRole, [ValidationGroup.USER]),
      this._socoboUserRolesHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserRolesHandler.deleteById);

    return this._router;
  }
}
