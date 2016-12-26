import { Router, Request, Response, NextFunction } from "express";
import { Validation } from "./../models/validation";
import { ValidationError } from "./../models/validation-error";

export class Validator{

    constructor(private validations: Validation){}

    getValidator(){
        return ((req: Request, res: Response, next:NextFunction) => {
            let obj: any = req.body;
            req = this.validations.addValidationsToRequest(req);
            var errors = req.validationErrors();
            console.log(errors);
            
            if(errors){
                res.status(400).json(new ValidationError('Validation failed',
                "Validator", 'validate()', errors).forResponse())
            }else{
                next();
            }
        })
    }

}