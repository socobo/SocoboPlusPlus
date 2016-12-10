export class BackendError {
  private message: string;
  private stackTrace: Object;

  constructor (message: string, stackTrace: Object) {
    this.message = message;
    this.stackTrace = stackTrace;
  }
}