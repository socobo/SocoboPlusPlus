import { LogService } from "./../logic/services/logging.service";

export class ApiError {
  private timestamp: number;
  private name: string;
  private stackTrace: string;
  private message: string;

  constructor (message: string, error: any) {
    this.timestamp = Date.now();
    this.name = error.name;
    this.stackTrace = error.stack;
    this.message = message;
    // add error to Log Object
    LogService.addError(this.message, this);
  }

  forResponse(): Object {
    return {
      "message": this.message
    }
  }
}