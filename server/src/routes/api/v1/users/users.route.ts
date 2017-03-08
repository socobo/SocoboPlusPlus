import { Router } from "express";
import { AuthValidationHandler, UserHandler } from "./../../../../logic/handler/index";

export class UsersRoute {

  constructor (
    private _router: Router,
    private _userHandler: UserHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._userHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._userHandler.getById);

    this._router.put("/:id",
      this._authValidationHandler.checkToken,
      this._userHandler.updateById);

    this._router.delete("/:id",
      this._authValidationHandler.checkToken,
      this._userHandler.deleteById);

    return this._router;
  }
}
