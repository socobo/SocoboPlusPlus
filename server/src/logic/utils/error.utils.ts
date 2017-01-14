import { errors } from "pg-promise";
import { ApiError } from "./../../models/index"
import { ERRORS } from "./../../models/index"

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
}