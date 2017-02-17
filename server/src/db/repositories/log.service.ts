import * as winston from "winston";
import { ApiError } from "./../../models/index";

export class LogService {

  private static errorLogs: ApiError[] = [];

  public static addError (msg: string, error: ApiError): void {
    this.errorLogs.push(error);
    winston.error(msg, error);
  }

  public static getErrors (): ApiError[] {
    return this.errorLogs;
  }
}
