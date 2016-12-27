import { LogService } from "./../logic/services/logging.service";

export class ApiError {
  
  public message: string;
  public source: string;
  public sourceMethod: string;
  private timestamp: number;
  private name: string;
  private stackTrace: string;

  constructor (
    message: string, source: string, 
    sourceMethod: string, error: any
  ) {
    this.timestamp = Date.now();
    this.name = error.name;
    this.stackTrace = error.stack;
    this.message = message;
    this.source = source;
    this.sourceMethod = sourceMethod;
    // add error to Log Object
    LogService.addError(this.message, this);
  }

  forResponse (): Object {
    return {
      "message": this.message,
      "source": this.source,
      "method": this.sourceMethod
    }
  }
}