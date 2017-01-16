import { Router, Request, Response, NextFunction } from "express";
import { RecipeService, UserService } from "./../../../../logic/services/index";
import { ErrorUtils } from "./../../../../logic/utils/index"
import { Recipe, DbError, ApiError, ValidationError, ERRORS } from "./../../../../models/index";
import { ApiValidator } from "./../../../../logic/middleware/index";

export class RecipeHandler{

	constructor(private _recipeService: RecipeService, private _userService: UserService) {}

	getById = (req: Request, res: Response) => {
		let recipe: Recipe = req.body as Recipe;
		let id = req.params.id;

		this._recipeService.getById(id)
		.then((result: Recipe) => {				
				res.status(200).json(result);
		}).catch((e: any) => { 
				res.status(e.statusCode).json(e.forResponse());
				res.status(e.statusCode).json(e.forResponse());
		});
	}

	save = (req: Request, res: Response) => {
		let recipe: Recipe = req.body as Recipe;
		recipe.created = new Date();
		this._userService.getUserById(recipe.userId).catch(error => {
			if (ErrorUtils.notFound(error)) {
				let e = new DbError(ERRORS.USER_NOT_FOUND.withArgs(recipe.userId.toString()))
					.addSource(UserService.name)
					.addSourceMethod("getUserById(id)")
					.addCause(error)
					.addQuery(error.query);
				res.status(e.statusCode).json(
					e.forResponse());
			} else {
				let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
					.addSource(UserService.name)
					.addSourceMethod("getUserById(id)")
					.addCause(error)
					.addQuery(error.query);
				res.status(e.statusCode).json(
					e.forResponse());
			}
		})
		this._recipeService.save(recipe)
		.then((result:any) => {
				recipe.id = result.id;
				res.status(201).json(recipe)
		}).catch(e => {
				res.status(e.statusCode).json(e.forResponse());
		});
  }
}
