
import { LogService } from "./../../logic/services/logging.service";
import { ERROR_MESSAGES } from "../../error-messages"
import { ERRORS } from "../../errors"
import { ErrorType } from "./../index";

export class ApiError extends Error{
  timestamp: number;
  name: string;
  statusCode: number;
  code: string;
  stackTrace: string;
  message: string;
  source = "";
  sourceMethod = "";
  error = new Error();

  constructor (
    errorType: ErrorType
  ) {
    super();
    this.message = this.resolveMessage(errorType.messageKey);
    this.statusCode = errorType.statusCode;
    this.code = errorType.code;
    this.timestamp = Date.now();
  }

  public resolveMessage = (messageKey: string): string => {
    return ERROR_MESSAGES[messageKey];
  }

  logError = (name: string, stack: string) => {
    LogService.addError(this.message, this);
  }

  forResponse = (): Object => {
    this.logError(this.error.name, this.error.stack)
    return {
      "message": this.message,
      "source": this.source,
      "method": this.sourceMethod
    }
  }
}