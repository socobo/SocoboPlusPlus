import { Router, Request, Response, NextFunction } from "express";
import { Recipe, DbError, ApiError, ValidationError } from "./../../../../models/index";
import { AuthValidator } from "./../../../../logic/middleware/index";

export class AuthHandler{

	constructor(private _validator: AuthValidator) {}

	// The auth validation handler
	authenticate = (req: Request, res: Response, next: NextFunction) => {
		this._validator.checkValidToken(req)
			.then(() => next())
			.catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
	}
}
