import { DatabaseErrorLog } from "./../../models/databaseerrorlog";

export class DatabaseLogService {

  static errorLogs: Array<DatabaseErrorLog> = new Array<DatabaseErrorLog>();

  static addError (msg: string, stacktrace: any): void {
    let log: DatabaseErrorLog = new DatabaseErrorLog();

    log.timestamp = Date.now();
    log.errorName = stacktrace.name;
    log.stackTrace = stacktrace.stack;
    log.query = stacktrace.query;
    log.message = msg;

    this.errorLogs.push(log);
  }

  static getErrors (): DatabaseErrorLog[] {
    return this.errorLogs;
  }
}