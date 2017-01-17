import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/index";
import { RecipeHandler } from "./recipe.handler";
import { ValidationHandler } from "./../validation/validation.handler";

export class RecipeRoute {

  constructor(
    private _router: Router, 
    private _recipeHandler: RecipeHandler, 
    private _validationHandler: ValidationHandler) {}

  createRoutes(){
    this._router.post(
      "/",
      this._validationHandler.validate,
      this._recipeHandler.save);

    this._router.get(
      "/:id", 
      this._recipeHandler.getById);

    return this._router;
  }
}