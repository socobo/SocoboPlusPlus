import { ERROR_MESSAGES } from "../../../i18n/error-messages";
import { LogService } from "../../index";
import { ErrorType } from "./error-type";

export class ApiError extends Error {
  public message: string;
  public name = ApiError.name;
  public timestamp: number;
  public statusCode: number;
  public code: string;
  public source = "";
  public sourceMethod = "";
  public error = new Error();

  constructor (
    errorType: ErrorType
  ) {
    super();
    this.message = this.resolveMessage(errorType.messageKey, errorType.messageArgs);
    this.statusCode = errorType.statusCode;
    this.code = errorType.code;
    this.timestamp = Date.now();
  }

  private resolveMessage = (messageKey: string, args: string[]): string => {
    let msg: string = ERROR_MESSAGES[messageKey];
    let argCounter = 0;
    for (const arg of args) {
      msg = msg.replace(`{${argCounter}}`, arg);
      argCounter++;
    }
    return msg;
  }

  public addSource = (source: string): this => {
    this.source = source;
    return this;
  }

  public addSourceMethod = (sourceMethod: string): this => {
    this.sourceMethod = sourceMethod;
    return this;
  }

  public addCause = (error: Error): this => {
    this.error = error;
    this.name = error.name;
    return this;
  }

  public forResponse = () => {
    LogService.addError(this.message, this);
    return {
      cause: this.error.message,
      message: this.message,
      method: this.sourceMethod,
      source: this.source,
      type: this.name
    };
  }
}
