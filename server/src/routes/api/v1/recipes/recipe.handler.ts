import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/recipe.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils"
import { Recipe } from "./../../../../models/recipe";
import { DbError } from "./../../../../models/db-error";
import { ApiError } from "./../../../../models/api-error";
import { ValidationError } from "./../../../../models/validation-error";
import { ApiValidator } from "./../../../../middleware/validator";

export class RecipeHandler{

	constructor(private _recipeService: RecipeService) {}

	getById = (req: Request, res: Response) => {
		let recipe: Recipe = req.body as Recipe;
		let id = req.params.id;

		this._recipeService.getById(id)
		.then((result: Recipe) => {				
				res.status(200).json(result);
		}).catch((error: any) => { 
				if (ErrorUtils.notFound(error)) {
						res.status(404).json(new DbError(`The recipe for the id ${id} does not exist`,
						RecipeService.name, "getById()", error).forResponse());
				}else{
						res.status(500).json(new ApiError("Error during adding the new recipe",
						RecipeService.name, "getById()", error).forResponse());
				}
		});
	}

	save = (req: Request, res: Response) => {
		let recipe: Recipe = req.body as Recipe;
		
		recipe.created = new Date();
		this._recipeService.save(recipe)
		.then((result:any) => {
				recipe.id = result.id;
				console.log("RECIPE", recipe);
				
				res.status(201).json(recipe)
		}).catch(error => {
				res.status(500).json(new DbError('Error during adding the new recipe',
				RecipeService.name, 'save()', error).forResponse());
		});
  }
}

