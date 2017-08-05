import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRolesHandler } from "../handlers/SocoboUserRoles.handler";
import { SocoboUserRole, SocoboUserRoleTypes } from "../index";

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
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserRolesHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserRolesHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._modelValidationHandler.validate(SocoboUserRole, [ValidationGroup.USER]),
      this._socoboUserRolesHandler.updateById);

    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._modelValidationHandler.validate(SocoboUserRole, [ValidationGroup.USER]),
      this._socoboUserRolesHandler.save);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserRolesHandler.deleteById);

    return this._router;
  }
}
