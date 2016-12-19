import * as pgPromise from "pg-promise";

let errorCode = pgPromise.errors.queryResultErrorCode;

export class ErrorUtils{

    static notFoundError(err: any): boolean {
        return err.code ===  errorCode.noData;
    }

}