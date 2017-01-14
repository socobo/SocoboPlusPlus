import * as jwt from "jsonwebtoken";
import { Config } from "./../../config";
import {
  UserService 
} from "./index";
import { 
  CryptoUtils, ErrorUtils 
} from "./../utils/index";
import { 
  ApiError, DbError, SocoboUser, 
  ComparePwResult, LoginResponse, ERRORS
} from "./../../models/index";
export class AuthService {

  constructor (
    private _userService: UserService, 
    private _cryptoUtils: CryptoUtils
  ) {}

  login (isEmailLogin: boolean, usernameOrEmail: string, password: string): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      this._getUserFromDatabase(isEmailLogin, usernameOrEmail)
        .then((user: SocoboUser) => this._validateUser(user))
        .then((foundUser: SocoboUser) => this._cryptoUtils.comparePasswords(password, foundUser))
        .then((compareResult: ComparePwResult) => this._validateComparePasswords(compareResult.isPasswordMatch, compareResult.user))
        .then((user: SocoboUser) => resolve(this._createLoginResult(user)))
        .catch((error: any) => {
          if (ErrorUtils.notFound(error)) {
            let e = new DbError(ERRORS.AUTH_NOT_REGISTERED.withArgs(usernameOrEmail))
              .addSource(AuthService.name)
              .addSourceMethod("login(..)")
              .addCause(error)
              .addQuery(error.query);
            reject(e)
          } else {
            let e = ErrorUtils.handleError(error, AuthService.name, "login()")
            reject(e)
          }
        });
    });
  }

  private _getUserFromDatabase (isEmailLogin: boolean, usernameOrEmail: string): Promise<SocoboUser> {
    if (isEmailLogin) {
      return this._userService.getUserByEmail(usernameOrEmail); 
    }
    return this._userService.getUserByUsername(usernameOrEmail);
  }

  private _validateUser (user: SocoboUser): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (!user) {
        let e = new ApiError(ERRORS.USER_NOT_FOUND.withArgs("provided email or username"))
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
        let e = new ApiError(ERRORS.AUTH_WRONG_PASSWORD)
          .addSource(AuthService.name)
          .addSourceMethod("_validateComparePasswords(..)");       
        return reject(e);
      }
      resolve(foundUser);
    });
  }

  private _createLoginResult (foundUser: SocoboUser): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      jwt.sign(foundUser, (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), {
        expiresIn: (process.env.TOKEN_EXPIRATION || Config.TOKEN_EXPIRATION)
      }, (err, token) => {
        if (err) {
          let e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
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

  register (isEmailLogin: boolean, usernameOrEmail: string, password: string): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      this._getUserFromDatabase(isEmailLogin, usernameOrEmail)
        .then((user: SocoboUser) => this._checkIfUserIsAlreadyRegistered(user))
        .catch((error: any) => {
          if (ErrorUtils.notFound(error)) {
            this._cryptoUtils.hashPassword(password)
              .then((hashedPassword: string) => this._createNewUser(hashedPassword, usernameOrEmail))
              .then((createdUser: SocoboUser) => resolve(this._returnSavedUser(createdUser)))
              .catch((error: any) => reject(error))
          } else {
            reject(error);
          }
        });
    });
  }

  private _checkIfUserIsAlreadyRegistered (user: SocoboUser): Promise<any> {
    return new Promise((resolve, reject) => {
      if (user) {
        let e = new ApiError(ERRORS.AUTH_USED_PASSWORD_EMAIL)
          .addSource(AuthService.name)
          .addSourceMethod("register(..)");
        return reject(e);
      }
      resolve();
    });
  }

  private _createNewUser (hashedPassword: string, usernameOrEmail: string): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (hashedPassword.length <= 0) {
        let e = new ApiError(ERRORS.AUTH_NO_HASHED_PASSWORD)
          .addSource(AuthService.name)
          .addSourceMethod("_createNewUser(..)");
        return reject(e);
      }
      let user: SocoboUser = new SocoboUser();
      user.username = usernameOrEmail.includes("@") ? usernameOrEmail.split("@")[0] : usernameOrEmail;
      user.email = usernameOrEmail.includes("@") ? usernameOrEmail : "";
      user.password = hashedPassword;
      user.image = "http://placehold.it/350x150";
      user.hasTermsAccepted = true;
      user.isAdmin = false;
      user.provider = "email";
      resolve(user);
    });
  }

  private _returnSavedUser (user: SocoboUser): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      this._userService.save(user)
        .then((result: any) => {
          user.id = result.id;
          delete user.password;
          resolve(user);
        })
        .catch((error: any) => reject(error))
    });
  }
}