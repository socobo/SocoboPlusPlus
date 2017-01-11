import { ErrorType } from "./models/index"
/**
 * First digit indicates the type:
 * 0 => Generic errors
 * 1 => User errors
 * 2 => Auth errors
 * 3 => Validation errors
 */
export class ERRORS {
	static INTERNAL_SERVER_ERROR = new ErrorType(
		"00001",
		"internal.error",
		500
	);
	static REQUEST_BODY = new ErrorType(
		"00005",
		"internal.error.request.body",
		500
	)
	static USER_NOT_FOUND = new ErrorType(
		"10001",
		"user.not.found",
		404
	);
	static AUTH_WRONG_PASSWORD = new ErrorType(
		"20001",
		"auth.wrong.password",
		401
	)
	static AUTH_USED_PASSWORD_EMAIL = new ErrorType(
		"20002",
		"auth.used.email.or.password",
		400
	)
	static AUTH_TOKEN_EXPIRED = new ErrorType(
		"20003",
		"auth.token.expired",
		401
	)
	static AUTH_TOKEN_MISSING = new ErrorType(
		"20004",
		"auth.token.missing",
		401
	)
	static AUTH_TOKEN_ERROR = new ErrorType(
		"20005",
		"auth.token.error",
		401
	)
	static AUTH_PW_MISSMATCH = new ErrorType(
		"20006",
		"auth.password.missmatch",
		401
	)
	static AUTH_NO_HASHED_PASSWORD = new ErrorType(
		"20007",
		"internal.no.password.hash",
		500
	)
	static AUTH_PW_HASH_GENERATION = new ErrorType(
		"20008",
		"internal.error.create.salt",
		500
	)
	static AUTH_SALT_GENERATION = new ErrorType(
		"20009",
		"internal.error.create.hash",
		500
	)
	static VAL_MISSING_USERNAME_EMAIL = new ErrorType(
		"30001",
		"validation.missing.username.and.email",
		400
	)
	static VAL_MISSING_PASSWORD = new ErrorType(
		"30001",
		"validation.missing.password",
		400
	)
}