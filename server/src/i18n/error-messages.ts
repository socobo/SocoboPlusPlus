export const ERROR_MESSAGES: any = {
	"user.not.found": 'User with id {0} could not be found',
	"auth.wrong.password": "Authentication failed. Wrong password",
	"auth.used.email.or.password": "Email or Username is already registered. Please use another one.",
	"auth.token.expired": "Token expired",
	"auth.token.error": "Token error",
	"auth.token.missing": "Missing auth token",
	"auth.password.missmatch": "Passwords do not match",
	"auth.user.not.registerd": "The user with the username/email {0} is not registered yet",
	"validation.missing.username.and.email": "Request Body doesn't have a Username or Email Address!",
	"validation.missing.password": "Request Body doesn't have a Password!",
	"internal.error": "Internal server error",
	"internal.no.password.hash": "No password hash",
	"internal.error.create.salt": "Error while generating the Salt value",
	"internal.error.create.hash": "Error while generating password hash",
	"internal.error.request.body": "Something went wrong with extracting request body"
}