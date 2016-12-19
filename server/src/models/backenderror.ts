import { DatabaseLogService } from "./../logic/services/database.log.service";

export class BackendError {
  private message: string;

  constructor (message: string, stackTrace: Object) {
    this.message = message;
    // add error to Log Object
    DatabaseLogService.addError(this.message, stackTrace);
  }
}