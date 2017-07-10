import { Router } from "express";
import { AuthValidationHandler, SocoboUserHandler } from "./../../../../logic/handler/index";

export class SocoboUsersRoute {

  constructor (
    private _router: Router,
    private _socoboUserHandler: SocoboUserHandler,
    private _authValidationHandler: AuthValidationHandler
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
      this._socoboUserHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._socoboUserHandler.deleteById);

    return this._router;
  }
}
