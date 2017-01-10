import { LogService } from "./../../logic/services/logging.service";
import { ApiError, ErrorType } from "./../index";

export class DbError extends ApiError {

  query: string = "";
  error = new Error()

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }
}