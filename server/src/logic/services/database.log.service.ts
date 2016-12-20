import { DatabaseErrorLog } from "./../../models/databaseerrorlog";
let winston = require('winston')

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
    winston.error(log);
  }

  static getErrors (): DatabaseErrorLog[] {
    return this.errorLogs;
  }
}