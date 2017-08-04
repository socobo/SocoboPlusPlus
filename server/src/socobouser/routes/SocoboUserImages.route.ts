import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserImagesHandler } from "../handlers/SocoboUserImages.handler";
import { SocoboUserImage, SocoboUserRoleTypes } from "../index";

export class SocoboUserImagesRoute {

  constructor (
    private _router: Router,
    private _socoboUserImagesHandler: SocoboUserImagesHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserImagesHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserImagesHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._modelValidationHandler.validate(SocoboUserImage, [ValidationGroup.USER]),
      this._socoboUserImagesHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserImagesHandler.deleteById);

    return this._router;
  }
}
