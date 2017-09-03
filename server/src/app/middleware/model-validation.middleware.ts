import { validate } from "class-validator";
import { NextFunction, Request, Response, Router } from "express";
import { ERRORS, Validatable, ValidationError, ValidationGroup} from "../index";

export class ModelValidationMiddleware {

  /**
   * This validation approache enables also validation of nested objects
   * @param objToValidate
   * @param req
   * @param validationGroups
   */
  public validateObject = async (objToValidate: Validatable, req: Request,
                                 validationGroups: ValidationGroup[]): Promise<void> => {
    // create new object for validation
    objToValidate.clone(req.body);
    // get validation groups
    const mappedGroups = validationGroups.map((group: ValidationGroup) => group.toString());
    console.log('GROUPS', mappedGroups)
    // validate newly created object
    const result = await validate(objToValidate, {groups: mappedGroups });
    // throw error if the object is not valid
    if (result.length > 0) {
      throw new ValidationError(ERRORS.VAL_INVALID_INPUT)
        .addSource(ModelValidationMiddleware.name)
        .addSourceMethod("validateObject(..)")
        .addValidationErrors(result);
    }
  }
}
