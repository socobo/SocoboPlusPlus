import { ErrorType } from "./error-type";
/**
 * First digit indicates the type:
 * 0 => Generic errors
 * 1 => User errors
 * 2 => Auth errors
 * 3 => Validation errors
 * 4 => Recipe errors
 * 5 => FoodItem errors
 */
export class ERRORS {
  public static INTERNAL_SERVER_ERROR = new ErrorType(
    "00001",
    "internal.error",
    500
  );
  public static UPDATE_MODEL_VALUES = new ErrorType(
    "00002",
    "update.model.values",
    400
  );
  public static REQUEST_BODY = new ErrorType(
    "00005",
    "internal.error.request.body",
    500
  );
  public static REQUEST_BODY_AUTHCHECK = new ErrorType(
    "00006",
    "internal.error.request.body.authcheck",
    500
  );
  public static IMAGE_UPLOAD = new ErrorType(
    "00007",
    "internal.error.upload.image",
    500
  );
  public static IMAGE_DELETION = new ErrorType(
    "00008",
    "internal.error.delete.image",
    500
  );
  public static GENERIC_BASE_NOT_FOUND = new ErrorType(
    "10000",
    "generic.base.not.found",
    404
  );
  public static USER_NOT_FOUND = new ErrorType(
    "10001",
    "user.not.found",
    404
  );
  public static USER_NOT_AN_ADMIN = new ErrorType(
    "10002",
    "user.not.an.admin",
    403
  );
  public static USER_NO_UPDATE_TYPE = new ErrorType(
    "10003",
    "user.no.update.type",
    400
  );
  public static USER_INVALID_UPDATE_TYPE = new ErrorType(
    "10004",
    "user.invalid.update.type",
    400
  );
  public static USER_INVALID_UPDATE_BODY = new ErrorType(
    "10005",
    "user.invalid.update.body",
    400
  );
  public static AUTH_WRONG_PASSWORD = new ErrorType(
    "20001",
    "auth.wrong.password",
    401
  );
  public static AUTH_USED_PASSWORD_EMAIL = new ErrorType(
    "20002",
    "auth.used.email.or.password",
    400
  );
  public static AUTH_TOKEN_EXPIRED = new ErrorType(
    "20003",
    "auth.token.expired",
    401
  );
  public static AUTH_TOKEN_MISSING = new ErrorType(
    "20004",
    "auth.token.missing",
    401
  );
  public static AUTH_TOKEN_ERROR = new ErrorType(
    "20005",
    "auth.token.error",
    401
  );
  public static AUTH_NO_HASHED_PASSWORD = new ErrorType(
    "20007",
    "internal.error.create.hash",
    500
  );
  public static AUTH_SALT_GENERATION = new ErrorType(
    "20009",
    "internal.error.create.hash",
    500
  );
  public static AUTH_NOT_REGISTERED = new ErrorType(
    "20010",
    "auth.user.not.registerd",
    401
  );
  public static AUTH_ONLY_EMAIL_ALLOWED = new ErrorType(
    "20011",
    "auth.only.email.allowed",
    400
  );
  public static USER_NOT_AUTHORIZED = new ErrorType(
    "10011",
    "auth.not.authorized",
    403
  );
  public static VAL_MISSING_USERNAME_EMAIL = new ErrorType(
    "30001",
    "validation.missing.username.and.email",
    400
  );
  public static VAL_MISSING_PASSWORD = new ErrorType(
    "30002",
    "validation.missing.password",
    400
  );
  public static VAL_INVALID_INPUT = new ErrorType(
    "30003",
    "validation.invalid.input",
    400
  );
  public static VAL_INVALID_QUERY_PARAM_FORMAT = new ErrorType(
    "30004",
    "validation.invalid.query.params.format",
    400
  );
  public static RECIPE_NOT_FOUND = new ErrorType(
    "40001",
    "recipe.not.found",
    404
  );
  public static RECIPE_INVALID_FIELD = new ErrorType(
    "40002",
    "recipe.field.not.found",
    400
  );
  public static RECIPE_NON_AVAILABLE = new ErrorType(
    "40003",
    "recipes.empty",
    404
  );
  public static RECIPE_NO_IMAGE_TITLE = new ErrorType(
    "40004",
    "recipes.no.image.title",
    400
  );
  public static RECIPE_CATEGORY_NOT_FOUND = new ErrorType(
    "40004",
    "recipe.category.not.found",
    404
  );
  public static FOODITEMTEMPLTE_NOT_FOUND = new ErrorType(
    "50001",
    "fooditem.template.not.found",
    404
  );
  public static FOODITEMTUNIT_NOT_FOUND = new ErrorType(
    "50002",
    "fooditem.unit.not.found",
    404
  );
}
