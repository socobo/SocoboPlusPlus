import * as jwt from "jsonwebtoken";
import {
  ApiError, ComparePwResult, CryptoUtils, DbError,
  ERRORS, ErrorUtils, ExtractRequestBodyResult, LoginResponse
} from "../../app/index";
import { DbExtension } from "../../db/interface/db-extension";
import { SocoboUser, SocoboUserProviderType, SocoboUserRoleType } from "../../socobouser/index";
import { Config  } from "./../../config";

export class AuthService {

  constructor (
    private _db: DbExtension,
    private _cryptoUtils: CryptoUtils
  ) { }

  public login = async (erbr: ExtractRequestBodyResult): Promise<LoginResponse> => {
    const foundUser = await this._getUserFromDatabase(erbr.isEmailLogin, erbr.usernameOrEmail, false) as SocoboUser;
    await this._cryptoUtils.comparePasswords(erbr.password, foundUser.password);
    return await this._createLoginResult(foundUser);
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
          delete user.password;
          resolve(user);
        })
        .catch((error: any) => reject(error));
    });
  }

  private _getUserFromDatabase = async (isEmailLogin: boolean, usernameOrEmail: string,
                                        onlyEmailRegistration: boolean): Promise<SocoboUser | DbError> => {
    // Registration is only possible with an email address
    // Login is possible with email address or username
    if (onlyEmailRegistration && !isEmailLogin) {
      throw new ApiError(ERRORS.AUTH_ONLY_EMAIL_ALLOWED)
        .addSource(AuthService.name)
        .addSourceMethod("_getUserFromDatabase(..)");
    }

    if (isEmailLogin) {
      return await this._db.socobouser.getUserByEmail(usernameOrEmail);
    }

    if (!onlyEmailRegistration) {
      return await this._db.socobouser.getUserByUsername(usernameOrEmail);
    }
  }

  private _createLoginResult = async (foundUser: SocoboUser): Promise<LoginResponse> => {
    try {
      const token = await jwt.sign(foundUser.getSigningInfo(), (process.env["TOKEN_SECRET"] || Config.TOKEN_SECRET), {
        expiresIn: (process.env["TOKEN_EXPIRATION"] || Config.TOKEN_EXPIRATION),
        issuer: (process.env["TOKEN_ISSUER"] || Config.TOKEN_ISSUER)
      });
      delete foundUser.password;
      return new LoginResponse(token, foundUser);
    } catch (error) {
      throw new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
        .addSource(AuthService.name)
        .addSourceMethod("_createLoginResult(..)")
        .addCause(error);
    }
  }
}
