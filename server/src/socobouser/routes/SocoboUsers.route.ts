import { Router } from "express";
import { SocoboUserHandler } from "../handlers/SocoboUser.handler";
import { AuthValidationHandler } from "../../auth/index";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { SocoboUser } from "../index";

export class SocoboUsersRoute {

  constructor (
    private _router: Router,
    private _socoboUserHandler: SocoboUserHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(SocoboUser, [ValidationGroup.LOGIN, ValidationGroup.REGISTRATION]),
      this._socoboUserHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.deleteById);

    return this._router;
  }
}
