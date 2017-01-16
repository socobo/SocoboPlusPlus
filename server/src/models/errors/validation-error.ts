import { LogService } from "./../../logic/services/index";
import { ApiError, ErrorType } from "./../index";


export class ValidationError extends ApiError {

  private validationErrors: any;

  constructor (
    errorType: ErrorType
  ) {
    super(errorType);
  }

  forResponse = () => {
    return {
      "message": this.message,
      "source": this.source,
      "method": this.sourceMethod,
      "validationErrors": this.validationErrors
    }
  }

  addValidationErrors = (validationErrors: any): this => {
    this.validationErrors = validationErrors;
    return this;
  }
}