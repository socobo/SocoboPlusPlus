import { Router, Request, Response, NextFunction } from "express";
import { validate } from "class-validator"
import { ValidationError } from "./../models/validation-error";


export class ApiValidator {

    validate<T>(type: {new(): T}, req: Request): Promise<any>{
        return new Promise<any>((resolve: any, reject: any) => {
            let obj: any = req.body;
            let objectToValidate = new type();

            for(let prop in obj){
                (objectToValidate as any)[prop] = obj[prop];
            }          
            
            validate(objectToValidate).then(errors => {
                if(errors.length > 0){
                    resolve(new ValidationError('Validation failed',
                    "Validator", 'validate()', errors).forResponse())
                }else{
                    reject()
                }
            }).catch(error => {
                resolve(new ValidationError('Validation failed',
                "Validator", 'validate()', error).forResponse())
            })
        })
    }
}