import { LogService } from "./../logic/services/logging.service";
import { ApiError } from "./api-error";

export class DbError extends ApiError {

  private query: string;

  constructor (
    message: string, source: string, 
    sourceMethod: string, error: any
  ) {
    super(message, source, sourceMethod, error);
    this.query = error.query;
  }
}