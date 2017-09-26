import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserHandler } from "../handlers/SocoboUser.handler";
import { SocoboUser, SocoboUserMiddleware, SocoboUserRoleType } from "../index";

export class SocoboUsersRoute {

  constructor (
    private _router: Router,
    private _socoboUserHandler: SocoboUserHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler,
    private _multer: Instance,
    private _socoboUserMiddleware: SocoboUserMiddleware
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._socoboUserHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserMiddleware.checkUpdateType,
      this._socoboUserMiddleware.checkUpdateBody,
      this._modelValidationHandler.validateObject(new SocoboUser(), [ValidationGroup.USER]),
      this._socoboUserHandler.updateById);

    this._router.post("/:id/upload",
      this._authValidationHandler.checkToken,
      this._multer.single("socoboUserImage"),
      this._socoboUserHandler.uploadById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.deleteById);

    return this._router;
  }
}
