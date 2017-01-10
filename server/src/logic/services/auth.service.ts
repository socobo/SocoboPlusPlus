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
  ComparePwResult, LoginResponse
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
        .catch((error: any) => reject(error));
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
        return reject(new Error("Authentication failed. User not found."));
      }
      resolve(user);
    });
  }

  private _validateComparePasswords (compareSuccessful: boolean, foundUser: SocoboUser): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (!compareSuccessful) {
        return reject(new Error("Authentication failed. Wrong password."));
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
          return reject(new Error(`Authentication failed. Error message: ${err.message}.`));
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
        return reject(new Error("Email or Username is already registered. Please use another one."));
      }
      resolve();
    });
  }

  private _createNewUser (hashedPassword: string, usernameOrEmail: string): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      if (hashedPassword.length <= 0) {
        return reject(new Error("Hashed Password length is <= 0"));
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