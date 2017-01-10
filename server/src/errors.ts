import { ErrorType } from "./models/error-type"
/**
 * First digit indicates the type:
 * 0 => Internal server error
 * 1 => User errors
 * 2 => Auth errors
 */
export class ERRORS {
	static INTERNAL_SERVER_ERROR: ErrorType = {
		code: "00001",
		messageKey: "internal.error",
		statusCode: 500
	}
	static NO_HASHED_PASSWORD: ErrorType = {
		code: "00002",
		messageKey: "internal.no.password.hash",
		statusCode: 500
	}
	static PW_HASH_GENERATION: ErrorType = {
		code: "00003",
		messageKey: "internal.error.create.salt",
		statusCode: 500
	}
	static SALT_GENERATION: ErrorType = {
		code: "00004",
		messageKey: "internal.error.create.hash",
		statusCode: 500
	}
	static REQUEST_BODY: ErrorType = {
		code: "00005",
		messageKey: "internal.error.request.body",
		statusCode: 500
	}
	static USER_NOT_FOUND: ErrorType = {
		code: "10001",
		messageKey: "user.not.found",
		statusCode: 404
	}
	static AUTH_WRONG_PASSWORD: ErrorType = {
		code: "20001",
		messageKey: "auth.wrong.password",
		statusCode: 400
	}
	static AUTH_USED_PASSWORD_EMAIL: ErrorType = {
		code: "20002",
		messageKey: "auth.used.email.or.password",
		statusCode: 400
	}
}