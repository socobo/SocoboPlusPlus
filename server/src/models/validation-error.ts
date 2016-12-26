import { LogService } from "./../logic/services/logging.service";
import { ApiError } from "./api-error";

export class ValidationError extends ApiError {

    private validationErrors: any;

    constructor (
        message: string, source: string, 
        sourceMethod: string, validationErrors: any
    ) {
        super(message, source, sourceMethod, new Error());
        this.validationErrors = validationErrors;
    }

    forResponse(): Object {
        return {
            "message": this.message,
            "source": this.source,
            "method": this.sourceMethod,
            "validationErrors": this.validationErrors
        }
    }
}