import { Router, Request, Response, NextFunction } from "express";
import { ValidationError } from "./../models/validation-error";

import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate} from "class-validator"

export class ApiValidator{

    apiValidator<T>(type: {new(): T}){
        return ((req: Request, res: Response, next:NextFunction) => {
            let obj: any = req.body;
            let objectToValidate = new type();
            for(let prop in obj){
                (objectToValidate as any)[prop] = obj[prop];
            }          
            
            validate(objectToValidate).then(errors => {
                if(errors.length > 0){
                    res.status(400).json(new ValidationError('Validation failed',
                    "Validator", 'validate()', errors).forResponse())
                }else{
                    next();
                }
            }).catch(error => {
                res.status(500).json(new ValidationError('Internal Server Error',
                "Validator", 'validate()', error).forResponse())
            }) 
        })
    }

}