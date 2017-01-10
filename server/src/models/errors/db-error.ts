import { ApiError, ErrorType } from "./../index";
import { LogService } from "./../../logic/services/index";


export class DbError extends ApiError {

  query: string = "";
  error = new Error()

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }
}