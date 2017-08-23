// import { errors } from "pg-promise";
import { ApiError, DbError, ERRORS, ErrorType } from "../index";

const errorCode = { noData: 400 }; // TODO: find mongoose equivalent //errors.queryResultErrorCode;

export class ErrorUtils {

  public static notFound (err: any): boolean {
    return err.code === errorCode.noData;
  }

  public static handleError (error: any, source: string, sourceMethod: string): ApiError {
    if (error.name === "ApiError") {
      return error;
    }
    // Use an ApiError as wrapper for a generic error
    const e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource(source)
      .addSourceMethod(sourceMethod)
      .addCause(error);
    return e;
  }

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
    // if (ErrorUtils.notFound(error)) {
    //   const e = new DbError(errorType.withArgs(...msgVariables))
    //     .addSource(source)
    //     .addSourceMethod(method)
    //     .addCause(error)
    //     .addQuery(error.query);
    //   return Promise.reject(e);
    // } else {
    //   const e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
    //     .addSource(source)
    //     .addSourceMethod(method)
    //     .addCause(error)
    //     .addQuery(error.query);
    //   return Promise.reject(e);
    // }
    const e = new DbError(errorType.withArgs(...msgVariables))
      .addSource(source)
      .addSourceMethod(method)
      .addCause(error)
      .addQuery(error.query);
    return Promise.reject(e);
  }
}
