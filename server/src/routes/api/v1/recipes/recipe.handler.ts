import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/index";
import { ErrorUtils } from "./../../../../logic/utils/index"
import { Recipe, DbError, ApiError, ValidationError, ERRORS } from "./../../../../models/index";
import { ApiValidator } from "./../../../../logic/middleware/index";

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
					let e = new DbError(ERRORS.RECIPE_NOT_FOUND.withArgs(id.toString()))
						.addSource(RecipeService.name)
						.addSourceMethod("getById()")
						.addCause(error)
						.addQuery(error.query);
					res.status(e.statusCode).json(e.forResponse());
				}else{
					let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
						.addSource(RecipeService.name)
						.addSourceMethod("getById()")
						.addCause(error)
						.addQuery(error.query);
					res.status(e.statusCode).json(e.forResponse());
				}
		});
	}

	save = (req: Request, res: Response) => {
		let recipe: Recipe = req.body as Recipe;
		
		recipe.created = new Date();
		this._recipeService.save(recipe)
		.then((result:any) => {
				recipe.id = result.id;
				res.status(201).json(recipe)
		}).catch(error => {
				let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
					.addSource(RecipeService.name)
					.addSourceMethod("save()")
					.addCause(error)
					.addQuery(error.query);
				res.status(e.statusCode).json(e.forResponse());
		});
  }
}

