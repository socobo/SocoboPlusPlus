import { Router, Request, Response, NextFunction } from "express";
import { Recipe, DbError, ApiError, ValidationError } from "./../../../../models/index";
import { ApiValidator } from "./../../../../logic/middleware/index";

export class ValidationHandler{

	constructor(private _validator: ApiValidator) {}

	validate = (req: Request, res: Response, next: NextFunction) => {
		this._validator.validate(Recipe, req)
		.then((error: ValidationError) => {
				res.status(error.statusCode).json(error.forResponse())
		})
		.catch(() => {
				next();
		})
	}
}

