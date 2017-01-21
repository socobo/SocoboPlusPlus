import { LogService } from "./../../logic/services/index";
import { ApiError, ErrorType } from "./../index";

export class DbError extends ApiError {
  public name = DbError.name;
  public query: string = "";
  public error = new Error();

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }

  public addQuery = (query: string): this => {
    this.query = query;
    return this;
  }
}
