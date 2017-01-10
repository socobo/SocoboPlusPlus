import { LogService } from "./../../logic/services/index";
import { ERROR_MESSAGES } from "../../error-messages"
import { ERRORS } from "../../errors"
import { ErrorType } from "./../index";

export class ApiError extends Error{
  timestamp: number;
  statusCode: number;
  code: string;
  message: string;
  name = ApiError.name;
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

  forResponse = (): Object => {
    LogService.addError(this.message, this);
    return {
      "message": this.message,
      "source": this.source,
      "method": this.sourceMethod
    }
  }
}