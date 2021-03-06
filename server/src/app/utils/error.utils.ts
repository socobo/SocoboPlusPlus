import { ApiError, DbError, ERRORS, ErrorType, ValidationError } from "../index";

export class ErrorUtils {

  public static handleDbError (error: any, source: string, sourceMethod: string): Promise<DbError> {
    if (error.name === "DbError") {
      return Promise.reject(error);
    }
    const e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource(source)
      .addSourceMethod(sourceMethod)
      .addCause(error)
      .addQuery(error.query);
    return Promise.reject(e);
  }

  public static handleDbNotFound (errorType: ErrorType, error: any, source: string,
                                  method: string, ...msgVariables: string[]): Promise<DbError> {
    const e = new DbError(errorType.withArgs(...msgVariables))
      .addSource(source)
      .addSourceMethod(method)
      .addCause(error)
      .addQuery(error.query);
    return Promise.reject(e);
  }

  public static handleRequestError (errorType: ErrorType, source: string, method: string): ApiError {
    return new ApiError(errorType)
      .addSource(source)
      .addSourceMethod(method);
  }

  public static handleValidationError (errorType: ErrorType, source: string,
                                       method: string, validationErrors: any): ValidationError {
    return new ValidationError(errorType)
      .addSource(source)
      .addSourceMethod(method)
      .addValidationErrors(validationErrors);
  }
}
