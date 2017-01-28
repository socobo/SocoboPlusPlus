import { Router } from "express";
import { AuthValidationHandler, UserHandler } from "./../../../../logic/handler/index";
import { UserService } from "./../../../../logic/services/user.service";

export class UsersRoute {

  constructor (
    private _router: Router,
    private _userHandler: UserHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser,
      this._authValidationHandler.nonRestricted,
      this._userHandler.getAll);

    this._router.get("/:id",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser,
      this._authValidationHandler.nonRestricted,
      this._userHandler.getById);

    return this._router;
  }
}
