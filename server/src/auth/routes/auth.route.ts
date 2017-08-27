import { Router } from "express";
import { ModelValidationHandler, ValidationGroup } from "../../app/index";
import { SocoboUser } from "../../socobouser/index";
import { AuthHandler, AuthValidationHandler } from "../index";

export class AuthRoute {

  constructor (
    private _router: Router,
    private _authHandler: AuthHandler,
    private _authValidationHandler: AuthValidationHandler,
    private _modelValidationHandler: ModelValidationHandler
  ) {}

  public createRoutes (): Router {
    this._router.post("/login",
      this._authValidationHandler.checkRequest,
      this._modelValidationHandler.validateObject(new SocoboUser(), [ValidationGroup.LOGIN]),
      this._authValidationHandler.extractBody,
      this._authHandler.login);

    this._router.post("/register",
      this._authValidationHandler.checkRequest,
      this._modelValidationHandler.validateObject(new SocoboUser(), [ValidationGroup.REGISTRATION]),
      this._authValidationHandler.extractBody,
      this._authHandler.register);

    return this._router;
  }
}
