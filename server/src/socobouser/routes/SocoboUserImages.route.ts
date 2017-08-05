import { Router } from "express";
import { Instance } from "multer";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserImagesHandler } from "../handlers/SocoboUserImages.handler";
import { SocoboUserImage, SocoboUserRoleTypes } from "../index";

export class SocoboUserImagesRoute {

  constructor (
    private _router: Router,
    private _socoboUserImagesHandler: SocoboUserImagesHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler,
    private _multer: Instance
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleTypes.Admin),
      this._socoboUserImagesHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(SocoboUserImage, [ValidationGroup.USER]),
      this._socoboUserImagesHandler.updateById);

    // save image that is not stored into our storage
    this._router.post("/",
      this._authValidationHandler.checkToken,
      this._modelValidationHandler.validate(SocoboUserImage, [ValidationGroup.USER]),
      this._socoboUserImagesHandler.save);

    // save image that is stored into our storage
    this._router.post("/upload",
      this._authValidationHandler.checkToken,
      this._multer.single("socoboUserImage"),
      this._socoboUserImagesHandler.upload);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.deleteById);

    return this._router;
  }
}
