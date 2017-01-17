import { errors } from "pg-promise";
import { ApiError, DbError } from "./../../models/index"
import { ERRORS, ErrorType } from "./../../models/index"

let errorCode = errors.queryResultErrorCode;

export class ErrorUtils {

  static notFound (err: any): boolean {
    return err.code === errorCode.noData;
  }

  static handleError(error: any, source: string, sourceMethod: string): ApiError{
    if(error.name === "ApiError"){
      return error;
    }
    // Use an ApiError as wrapper for a generic error
    let e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource(source)
      .addSourceMethod(sourceMethod)
      .addCause(error);
    return e;
  }

  static handleDbError(error: any, source: string, sourceMethod: string): Promise<any>{
    let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
      .addSource(source)
      .addSourceMethod(sourceMethod)
      .addCause(error)
      .addQuery(error.query);
    return Promise.reject(e);
  }

  static handleDbNotFound(
    errorType: ErrorType,
    error: any, 
    notFoundPropertyKey: string, 
    notFoundProperty: string,
    source: string,
    method: string): Promise<any> {
    if (ErrorUtils.notFound(error)) {
      let e = new DbError(errorType.withArgs(
        notFoundPropertyKey, 
        notFoundProperty))
        .addSource(source)
        .addSourceMethod(method)
        .addCause(error)
        .addQuery(error.query);
      return Promise.reject(e);
    } else {
      let e = new DbError(ERRORS.INTERNAL_SERVER_ERROR)
        .addSource(source)
        .addSourceMethod(method)
        .addCause(error)
        .addQuery(error.query);
      return Promise.reject(e);
    }
  }

}