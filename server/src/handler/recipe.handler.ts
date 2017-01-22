import { NextFunction, Request, Response, Router } from "express";
import { RecipeService, UserService } from "./../logic/services/index";
import { ErrorUtils } from "./../logic/utils/index";
import { ApiError, DbError, ERRORS, Recipe, ValidationError } from "./../models/index";

export class RecipeHandler {

  constructor (
    private _recipeService: RecipeService,
    private _userService: UserService
  ) {}

  public getById = (req: Request, res: Response): void => {
    this._recipeService.getById(req.params.id)
      .then((result: Recipe) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public save = (req: Request, res: Response): void => {
    const recipe: Recipe = req.body as Recipe;
    recipe.created = new Date();

    this._userService.getUserById(recipe.userId)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._recipeService.save(recipe)
      .then((result: Recipe) => {
        recipe.id = result.id;
        res.status(201).json(recipe);
      })
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
