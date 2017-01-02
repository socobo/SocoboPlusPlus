import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/recipe.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils"
import { Recipe } from "./../../../../models/recipe";
import { DbError } from "./../../../../models/db-error";
import { ApiError } from "./../../../../models/api-error";
import { ValidationError } from "./../../../../models/validation-error";
import { ApiValidator } from "./../../../../middleware/validator";

import { RecipeHandler } from "./recipe.handler"
import { ValidationHandler } from "./../validation/validation.handler"

export class RecipeRouteV1 {

  constructor(
    private _router: Router, 
    private _recipeHandler: RecipeHandler, 
    private _validationHandler: ValidationHandler) {}

  createRoutes(){
    this._router.post("/",
    this._validationHandler.validate,
    this._recipeHandler.save)

    this._router.get("/:id", 
    this._recipeHandler.getById);

    return this._router;
  }
}