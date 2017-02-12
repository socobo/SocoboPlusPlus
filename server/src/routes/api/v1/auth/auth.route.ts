import { Router } from "express";
import { AuthHandler, AuthValidationHandler } from "./../../../../logic/handler/index";
import { AuthService } from "./../../../../logic/services/index";

export class AuthRoute {

  constructor (
    private _router: Router,
    private _authHandler: AuthHandler,
    private _authValidationHandler: AuthValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.post("/login",
      this._authValidationHandler.checkRequest,
      this._authValidationHandler.extractBody,
      this._authHandler.login);

    this._router.post("/register",
      this._authValidationHandler.checkRequest,
      this._authValidationHandler.extractBody,
      this._authHandler.register);

    return this._router;
  }
}
