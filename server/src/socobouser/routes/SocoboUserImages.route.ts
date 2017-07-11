import { Router } from "express";
import { SocoboUserImagesHandler } from "../handlers/SocoboUserImages.handler";
import { AuthValidationHandler } from "../../logic/handler/index";

export class SocoboUserImagesRoute {

  constructor (
    private _router: Router,
    private _socoboUserImagesHandler: SocoboUserImagesHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserImagesHandler.deleteById);

    return this._router;
  }
}
