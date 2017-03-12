import { ApiError, ErrorType } from "./../index";

export class ValidationError extends ApiError {
  private validationErrors: any;

  constructor (
    errorType: ErrorType
  ) {
    super (errorType);
  }

  public addValidationErrors = (validationErrors: any): this => {
    this.validationErrors = validationErrors;
    return this;
  }

  public forResponse = () => {
    return {
      message: this.message,
      method: this.sourceMethod,
      source: this.source,
      validationErrors: this.validationErrors
    };
  }
}
