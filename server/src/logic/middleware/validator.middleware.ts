import { Router, Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { ValidationError, ERRORS } from "./../../models/index";


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
                    let e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
                        .addSource("ApiValidator")
                        .addSourceMethod("validate(..)")
                        .addValidationErrors(errors);
                    resolve(e);
                }else{
                    reject();
                }
            }).catch(error => {
                let e = new ValidationError(ERRORS.VAL_INVALID_INPUT)
                    .addSource("ApiValidator")
                    .addSourceMethod("validate(..)")
                    .addCause(error);
                resolve(e);
            });
        });
    }
}