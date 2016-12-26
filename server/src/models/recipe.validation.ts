import expressValidator = require("express-validator");
import { Router, Request, Response, NextFunction } from "express";
import { Validation } from "./../models/validation";

export class RecipeValidation implements Validation{

    constructor(){}

    addValidationsToRequest(req: Request): Request {
        req.checkBody('title', 'Title must not be empty and can contain up to 50 characters').isLength({min:15,max:50})
        return req;
    }
}