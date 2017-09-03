import { ApiError, DbError, ERRORS, ErrorType } from "../index";

export class ErrorUtils {

  public static handleError (error: any, source: string, sourceMethod: string): ApiError {
    if (error.name === "ApiError") {
      return error;
    }
    // Use an ApiError as wrapper for a generic error
    return new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource(source)
      .addSourceMethod(sourceMethod)
      .addCause(error);
  }

  public static handleDbError (error: any, source: string, sourceMethod: string): Promise<DbError> {
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
}
