import { ApiError, ErrorType } from "./../index";
import { LogService } from "./../../logic/services/index";


export class DbError extends ApiError {
  name = DbError.name;

  query: string = "";
  error = new Error()

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }

  addQuery = (query: string): this => {
    this.query = query;
    return this;
  }
}