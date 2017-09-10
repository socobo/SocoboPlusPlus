import { NextFunction, Request, Response } from "express";
import { ApiError, ERRORS, ErrorType, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateType } from "../index";

export class SocoboUserMiddleware {

  private readonly MINUPDATETYPE = SocoboUserUpdateType.full;
  private readonly MAXUPDATETYPE = SocoboUserUpdateType.terms;
  private readonly MINLENGTH = SocoboUserUpdateType.full;
  private readonly MAXLENGTHFULL = SocoboUserUpdateType.terms;
  private readonly MAXLENGTHSINGLE = SocoboUserUpdateType.username;

  public checkUpdateType = (req: Request, res: Response, next: NextFunction): void => {
    const updateType: SocoboUserUpdateType = req.body.updateType;
    if (typeof updateType === "undefined") {
      const error = ErrorUtils.handleRequestError(ERRORS.USER_NO_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateType(..)");
      res.status(error.statusCode).json(error.forResponse());
      return;
    }
    if (updateType < this.MINUPDATETYPE || updateType > this.MAXUPDATETYPE) {
      const error = ErrorUtils.handleRequestError(ERRORS.USER_INVALID_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateType(..)");
      res.status(error.statusCode).json(error.forResponse());
      return;
    }
    next();
  }

  public checkUpdateBody = (req: Request, res: Response, next: NextFunction): void => {

    const errors = new Array<string>();

    const updateType: SocoboUserUpdateType = req.body.updateType;
    const fieldsToUpdate: object = req.body.fieldsToUpdate;

    if (!fieldsToUpdate) {
      const error = ErrorUtils.handleValidationError(ERRORS.USER_INVALID_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateBody(..)", ["No fieldsToUpdate provided"]);
      res.status(error.statusCode).json(error.forResponse());
      return;
    }

    const fieldLength = Object.entries(fieldsToUpdate).length;

    switch (updateType) {
      case SocoboUserUpdateType.full:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHFULL) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("username")) { errors.push("Username is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("email")) { errors.push("Email is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("password")) { errors.push("Password is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("imageUrl")) { errors.push("Image URL is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("role")) { errors.push("Role is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("provider")) { errors.push("Provider is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("hasTermsAccepted")) { errors.push("Has Terms Accepted is missing"); }
        break;

      case SocoboUserUpdateType.username:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("username")) { errors.push("Username is missing"); }
        break;

      case SocoboUserUpdateType.email:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("email")) { errors.push("Email is missing"); }
        break;

      case SocoboUserUpdateType.password:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("password")) { errors.push("Password is missing"); }
        break;

      case SocoboUserUpdateType.image:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("imageUrl")) { errors.push("Image URL is missing"); }
        break;

      case SocoboUserUpdateType.role:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("role")) { errors.push("Role is missing"); }
        break;

      case SocoboUserUpdateType.provider:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("provider")) { errors.push("Provider is missing"); }
        break;

      case SocoboUserUpdateType.terms:
        if (fieldLength <= this.MINLENGTH || fieldLength > this.MAXLENGTHSINGLE) {
          errors.push("Invalid Property length");
        }
        if (!fieldsToUpdate.hasOwnProperty("hasTermsAccepted")) { errors.push("Has Terms Accepted is missing"); }
        break;

      default:
        break;
    }

    if (errors.length > this.MINLENGTH) {
      const error = ErrorUtils.handleValidationError(ERRORS.USER_INVALID_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateBody(..)", errors);
      res.status(error.statusCode).json(error.forResponse());
      return;
    }

    next();
  }
}
