import { LogService } from "./../../logic/services/logging.service";
import { ApiError } from "./apiError";
import { ErrorType } from "./../error-type"

export class DbError extends ApiError {

  query: string = "";
  error = new Error()

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }
}