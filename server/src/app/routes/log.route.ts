import { Router } from "express";
import { AuthValidationHandler } from "../../auth/index";
import { SocoboUserRoleType } from "../../socobouser/index";
import { LogHandler } from "../index";

export class LogRoute {

  constructor (
    private _router: Router,
    private _logHandler: LogHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/errors",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser(SocoboUserRoleType.Admin),
      this._logHandler.getErrors);

    return this._router;
  }
}
