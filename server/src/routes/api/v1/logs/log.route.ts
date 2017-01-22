import { Router } from "express";
import { AuthValidationHandler, LogHandler } from "./../../../../handler/index";

export class LogRoute {

  constructor (
    private _router: Router,
    private _logHandler: LogHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.get("/errors",
      this._authValidationHandler.checkToken,
      this._authValidationHandler.checkUser,
      this._authValidationHandler.restricted,
      this._logHandler.getErrors);

    return this._router;
  }
}
