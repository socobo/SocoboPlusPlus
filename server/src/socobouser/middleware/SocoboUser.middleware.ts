import { NextFunction, Request, Response } from "express";
import { ApiError, ERRORS, ErrorType, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateType } from "../index";

export class SocoboUserMiddleware {

  public checkUpdateType = (req: Request, res: Response, next: NextFunction): void => {
    const updateType: SocoboUserUpdateType = req.body.updateType;
    if (!updateType) {
      const error = ErrorUtils.handleRequestError(ERRORS.USER_NO_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateType(..)");
      res.status(error.statusCode).json(error.forResponse());
      return;
    }
    if (updateType < SocoboUserUpdateType.full || updateType > SocoboUserUpdateType.provider) {
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
    const fieldLength = Object.entries(fieldsToUpdate).length;

    switch (updateType) {
      case SocoboUserUpdateType.full:
        if (fieldLength <= 0 || fieldLength > 6) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("username")) { errors.push("Username URL is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("email")) { errors.push("Email is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("password")) { errors.push("Password is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("imageUrl")) { errors.push("Image URL is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("role")) { errors.push("Role is missing"); }
        if (!fieldsToUpdate.hasOwnProperty("provider")) { errors.push("Provider is missing"); }
        break;

      case SocoboUserUpdateType.username:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("username")) { errors.push("Username URL is missing"); }
        break;

      case SocoboUserUpdateType.email:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("email")) { errors.push("Email is missing"); }
        break;

      case SocoboUserUpdateType.password:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("password")) { errors.push("Password is missing"); }
        break;

      case SocoboUserUpdateType.image:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("imageUrl")) { errors.push("Image URL is missing"); }
        break;

      case SocoboUserUpdateType.role:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("role")) { errors.push("Role is missing"); }
        break;

      case SocoboUserUpdateType.provider:
        if (fieldLength <= 0 || fieldLength > 1) { errors.push("Invalid Property length"); }
        if (!fieldsToUpdate.hasOwnProperty("provider")) { errors.push("Provider is missing"); }
        break;

      default:
        break;
    }

    if (errors.length > 0) {
      const error = ErrorUtils.handleValidationError(ERRORS.USER_INVALID_UPDATE_TYPE,
        SocoboUserMiddleware.name, "checkUpdateBody(..)", errors);
      res.status(error.statusCode).json(error.forResponse());
      return;
    }

    next();
  }
}
