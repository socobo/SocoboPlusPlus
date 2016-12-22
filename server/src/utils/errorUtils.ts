import { errors } from "pg-promise";

let errorCode = errors.queryResultErrorCode;

export class ErrorUtils {

  static notFound (err: any): boolean {
    return err.code === errorCode.noData;
  }
}