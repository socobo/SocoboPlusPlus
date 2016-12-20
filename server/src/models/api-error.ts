import { LogService } from "./../logic/services/logging.service";

export class ApiError {
  private timestamp: number;
  private name: string;
  private stackTrace: string;

  constructor (private message: string, error: any) {
    this.timestamp = Date.now();
    this.name = error.name;
    this.stackTrace = error.stack;
    // add error to Log Object
    LogService.addError(this.message, this);
  }

  public forResponse(){
    return {
      'message': this.message
    }
  }
}