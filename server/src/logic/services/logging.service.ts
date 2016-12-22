import { ApiError } from "./../../models/apiError";
import * as winston from "winston";

export class LogService {

  static errorLogs: Array<ApiError> = new Array<ApiError>();

  static addError (msg: string, error: ApiError): void {
    this.errorLogs.push(error);
    winston.error(msg, error);
  }

  static getErrors (): ApiError[] {
    return this.errorLogs;
  }
}