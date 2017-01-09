import { LogService } from "./../../logic/services/index";


export class ApiError {
  private timestamp: number;
  private name: string;
  private stackTrace: string;
  private message: string;
  private source: string;
  private sourceMethod: string;

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

  forResponse(): Object {
    return {
      "message": this.message,
      "source": this.source,
      "method": this.sourceMethod
    }
  }
}