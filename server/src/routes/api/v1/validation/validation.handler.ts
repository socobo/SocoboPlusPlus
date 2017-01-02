import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/recipe.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils"
import { Recipe } from "./../../../../models/recipe";
import { DbError } from "./../../../../models/db-error";
import { ApiError } from "./../../../../models/api-error";
import { ValidationError } from "./../../../../models/validation-error";
import { ApiValidator } from "./../../../../middleware/validator";

export class ValidationHandler{

	constructor(private _validator: ApiValidator) {}

	validate = (req: Request, res: Response, next: NextFunction) => {
		this._validator.validate(Recipe, req)
		.then((error: ValidationError) => {
				res.status(400).json(error)
		})
		.catch(() => {
				next();
		})
	}
}

