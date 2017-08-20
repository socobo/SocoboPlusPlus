import * as jwt from "jsonwebtoken";
import {
  ApiError, ComparePwResult, CryptoUtils, DbError,
  ERRORS, ErrorUtils, ExtractRequestBodyResult, LoginResponse
} from "../../app/index";
import {
  SocoboUser, SocoboUserProviderType, SocoboUserRoleType
} from "../../socobouser/index";
import { Config } from "./../../config";
import { DbExtension } from "../../db/interface/db-extension";

export class AuthService {

  constructor (
    private _db: DbExtension,
    private _cryptoUtils: CryptoUtils
  ) {}

  public login (erbr: ExtractRequestBodyResult): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      this._getUserFromDatabase(erbr.isEmailLogin, erbr.usernameOrEmail, false)
        .then((user: SocoboUser) => this._validateUser(user))
        .then((foundUser: SocoboUser) => this._cryptoUtils.comparePasswords(erbr.password, foundUser))
        .then((cr: ComparePwResult) => this._validateComparePasswords(cr.isPasswordMatch, cr.user))
        .then((user: SocoboUser) => resolve(this._createLoginResult(user)))
        .catch((error: any) => {
          if (error.code === ERRORS.USER_NOT_FOUND.code) {
            const e = new DbError(ERRORS.AUTH_NOT_REGISTERED.withArgs(erbr.usernameOrEmail))
              .addSource(AuthService.name)
              .addSourceMethod("login(..)")
              .addCause(error)
              .addQuery(error.query);
            reject(e);
          } else {
            const e = ErrorUtils.handleError(error, AuthService.name, "login()");
            reject(e);
          }
        });
    });
  }

  public register (erbr: ExtractRequestBodyResult): Promise<SocoboUser | DbError> {
    return new Promise((resolve, reject) => {
      this._getUserFromDatabase(erbr.isEmailLogin, erbr.usernameOrEmail, true)
        .then((user: SocoboUser) => this._checkIfUserIsAlreadyRegistered(user))
        .catch((errorOne: any) => {
          if (errorOne.code === ERRORS.USER_NOT_FOUND.code) {
            this._cryptoUtils.hashPassword(erbr.password)
              .then((hashedPassword: string) => this._createNewUser(hashedPassword, erbr.usernameOrEmail, erbr.role))
              .then((createdUser: SocoboUser) => resolve(this._returnSavedUser(createdUser)))
              .catch((errorTwo: any) => reject(errorTwo));
          } else {
            reject(errorOne);
          }
        });
    });
  }

  private _getUserFromDatabase (isEmailLogin: boolean, usernameOrEmail: string,
                                onlyEmailRegistration: boolean): Promise<SocoboUser | DbError> {

    if (isEmailLogin) {
      return this._db.socobouser.getUserByEmail(usernameOrEmail);
    }

    if (!onlyEmailRegistration) {
      return this._db.socobouser.getUserByUsername(usernameOrEmail);
    }

    const e = new ApiError(ERRORS.AUTH_ONLY_EMAIL_ALLOWED)
      .addSource(AuthService.name)
      .addSourceMethod("_getUserFromDatabase(..)");
    return Promise.reject(e);
  }

  private _validateUser (user: SocoboUser): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (!user) {
        const e = new ApiError(ERRORS.USER_NOT_FOUND.withArgs("provided email or", "username"))
          .addSource(AuthService.name)
          .addSourceMethod("_validateUser(..)");
        return reject(e);
      }
      resolve(user);
    });
  }

  private _validateComparePasswords (compareSuccessful: boolean, foundUser: SocoboUser): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (!compareSuccessful) {
        const e = new ApiError(ERRORS.AUTH_WRONG_PASSWORD)
          .addSource(AuthService.name)
          .addSourceMethod("_validateComparePasswords(..)");
        return reject(e);
      }
      resolve(foundUser);
    });
  }

  private _createLoginResult (foundUser: SocoboUser): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      jwt.sign(foundUser.getSigningInfo(), (process.env["TOKEN_SECRET"] || Config.TOKEN_SECRET), {
        expiresIn: (process.env["TOKEN_EXPIRATION"] || Config.TOKEN_EXPIRATION),
        issuer: (process.env["TOKEN_ISSUER"] || Config.TOKEN_ISSUER)
      }, (err, token) => {
        if (err) {
          const e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
            .addSource(AuthService.name)
            .addSourceMethod("_createLoginResult(..)")
            .addCause(err);
          return reject(e);
        }
        delete foundUser.password;
        resolve(new LoginResponse(token, foundUser));
      });
    });
  }

  private _checkIfUserIsAlreadyRegistered (user: SocoboUser): Promise<any> {
    return new Promise((resolve, reject) => {
      if (user) {
        const e = new ApiError(ERRORS.AUTH_USED_PASSWORD_EMAIL)
          .addSource(AuthService.name)
          .addSourceMethod("register(..)");
        return reject(e);
      }
      resolve();
    });
  }

  private _createNewUser (hashedPassword: string, usernameOrEmail: string,
                          role: SocoboUserRoleType): Promise<SocoboUser | DbError> {
    return new Promise((resolve, reject) => {
      if (hashedPassword.length <= 0) {
        const e = new ApiError(ERRORS.AUTH_NO_HASHED_PASSWORD)
          .addSource(AuthService.name)
          .addSourceMethod("_createNewUser(..)");
        return reject(e);
      }
      const user: SocoboUser = new SocoboUser()
        .setRole(role)
        .setProvider(usernameOrEmail.includes("@") ? SocoboUserProviderType.Email : SocoboUserProviderType.Username)
        .setImageUrl(String(process.env["DEFAULT_USER_IMAGE"] || Config.DEFAULT_USER_IMAGE))
        .setUsername(usernameOrEmail)
        .setEmail(usernameOrEmail)
        .setPassword(hashedPassword)
        .setHasTermsAccepted(true)
        .createDates();
      resolve(user);
    });
  }

  private _returnSavedUser (user: SocoboUser): Promise<SocoboUser | DbError> {
    return new Promise((resolve, reject) => {
      this._db.socobouser.save(user)
        .then((result: any) => {
          user.id = result.id;
          delete user.password;
          resolve(user);
        })
        .catch((error: any) => reject(error));
    });
  }
}
