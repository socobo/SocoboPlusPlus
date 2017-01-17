import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/index";
import { RecipeHandler } from "./recipe.handler";
import { ValidationHandler } from "./../validation/validation.handler";
import { AuthHandler } from "./../auth/auth.handler";


export class RecipeRoute {

  constructor(
    private _router: Router, 
    private _recipeHandler: RecipeHandler, 
    private _validationHandler: ValidationHandler,
    private _authHandler: AuthHandler) {}

  createRoutes(){
    this._router.post(
      "/",
      this._authHandler.authenticate,
      this._validationHandler.validate,
      this._recipeHandler.save);

    this._router.get(
      "/:id", 
      this._authHandler.authenticate,
      this._recipeHandler.getById);

    return this._router;
  }
}