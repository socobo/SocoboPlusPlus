import { Router } from "express";
import {
  AuthHandler, AuthValidationHandler, ModelValidationHandler
} from "./../../../../logic/handler/index";
import { AuthService } from "./../../../../logic/services/index";
import { SocoboUser, ValidationGroup } from "./../../../../models/index";

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
      this._modelValidationHandler.validate(SocoboUser, ValidationGroup.LOGIN),
      this._authValidationHandler.extractBody,
      this._authHandler.login);

    this._router.post("/register",
      this._authValidationHandler.checkRequest,
      this._modelValidationHandler.validate(SocoboUser, ValidationGroup.REGISTRATION),
      this._authValidationHandler.extractBody,
      this._authHandler.register);

    return this._router;
  }
}
