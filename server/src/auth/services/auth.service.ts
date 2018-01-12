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

  public login = async (erbr: ExtractRequestBodyResult, pwIsToken: boolean): Promise<LoginResponse> => {
    const foundUser = await this._getUserFromDatabase(erbr.isEmailLogin, erbr.usernameOrEmail, false) as SocoboUser;
    await this._cryptoUtils.comparePasswords(erbr.password, foundUser.password, pwIsToken);
    return await this._createLoginResult(foundUser);
  }

  public register = async (erbr: ExtractRequestBodyResult): Promise<SocoboUser> => {
    try {
      const foundUser = await this._getUserFromDatabase(erbr.isEmailLogin, erbr.usernameOrEmail, true);
      await this._checkIfUserIsAlreadyRegistered(foundUser as SocoboUser);
    } catch (error) {
      if (error.code === ERRORS.USER_NOT_FOUND.code) {
        const hashedPassword = await this._cryptoUtils.hashPassword(erbr.password);
        const createdUser = await this._createNewUser(hashedPassword, erbr.usernameOrEmail, erbr.role);
        const createdUserId = await this._db.socobouser.save(createdUser) as string;
        return createdUser.setId(createdUserId).removePassword();
      }
      throw error;
    }
  }

  /**
   * LOGIN AND REGISTRATION
   */
  private _getUserFromDatabase = async (isEmailLogin: boolean, usernameOrEmail: string,
                                        onlyEmailRegistration: boolean): Promise<SocoboUser | ApiError> => {
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

  /**
   * ONLY LOGIN
   */
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

  /**
   * ONLY REGISTRATION
   */
  private _checkIfUserIsAlreadyRegistered = async (user: SocoboUser): Promise<void> => {
    if (user) {
      throw new ApiError(ERRORS.AUTH_USED_PASSWORD_EMAIL)
        .addSource(AuthService.name)
        .addSourceMethod("register(..)");
    }
  }

  /**
   * ONLY REGISTRATION
   */
  private _createNewUser = async (hashedPassword: string, usernameOrEmail: string,
                                  role: SocoboUserRoleType): Promise<SocoboUser> => {

    if (hashedPassword.length <= 0) {
      throw new ApiError(ERRORS.AUTH_NO_HASHED_PASSWORD)
        .addSource(AuthService.name)
        .addSourceMethod("_createNewUser(..)");
    }

    return new SocoboUser()
      .setRole(role)
      .setProvider(usernameOrEmail.includes("@") ? SocoboUserProviderType.Email : SocoboUserProviderType.Username)
      .setImageUrl(String(process.env["DEFAULT_USER_IMAGE"] || Config.DEFAULT_USER_IMAGE))
      .setUsername(usernameOrEmail)
      .setEmail(usernameOrEmail)
      .setPassword(hashedPassword)
      .setHasTermsAccepted(true)
      .createDates();
  }
}
