import { Request, Response } from "express";
import { Recipe } from "./../../../models/index";

export class RecipeHandler {

  constructor (
    private _db: any
  ) {}

  public getById = (req: Request, res: Response): void => {
    this._db.recipes.getById(req.params.id)
      .then((result: Recipe) => res.status(200).json(result))
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }

  public save = (req: Request, res: Response): void => {
    const recipe: Recipe = req.body as Recipe;
    recipe.created = new Date();

    this._db.users.getUserById(recipe.userId)
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));

    this._db.recipes.save(recipe)
      .then((result: Recipe) => {
        recipe.id = result.id;
        res.status(201).json(recipe);
      })
      .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
  }
}
