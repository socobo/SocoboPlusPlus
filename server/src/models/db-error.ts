import { LogService } from "./../logic/services/logging.service";
import { ApiError } from "./api-error";

export class DbError extends ApiError{

private query: string;

constructor (message: string, error: any) {
    super(message, error);
    this.query = error.query;
}
}