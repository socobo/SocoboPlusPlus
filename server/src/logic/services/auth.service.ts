import * as jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { CryptoUtils } from "./../utils/cryptoUtils";
import { ErrorUtils } from "./../utils/errorUtils";
import { Config } from "./../../config";
import { 
  ApiError, DbError, SocoboUser, ComparePwResult, LoginResult
} from "./../../models/index";


export class AuthService {

  constructor (
    private _userService: UserService, 
    private _cryptoUtils: CryptoUtils
  ) {}

  login (isEmailLogin: boolean, usernameOrEmail: string, password: string): Promise<LoginResult> {
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

  private _createLoginResult (foundUser: SocoboUser): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
      jwt.sign(foundUser, (process.env.TOKEN_SECRET || Config.TOKEN_SECRET), {
        expiresIn: (process.env.TOKEN_EXPIRATION || Config.TOKEN_EXPIRATION)
      }, (err, token) => {
        if (err) {
          return reject(new Error(`Authentication failed. Error message: ${err.message}.`));
        }
        delete foundUser.password;
        resolve(new LoginResult(token, foundUser));
      });
    });
  }

  register (email: string, password: string): Promise<SocoboUser> {
    return new Promise((resolve, reject) => {
      // search for the user by provided email
      this._userService.getUserByEmail(email)
        .then((user: SocoboUser) => {
          // check if the user was found
          if (user) {
            return reject(new Error("Email is already registered. Please use another one."));
          }
        })
        // catch some database errors
        .catch((error: any) => {
          // check if no data was found
          if (ErrorUtils.notFound(error)) {
            // hash password
            this._cryptoUtils.hashPassword(password)
              .then((hashedPassword: string) => {
                // create new user object
                let user: SocoboUser = new SocoboUser();
                user.username = email.split("@")[0];
                user.email = email;
                user.password = hashedPassword;
                user.image = "http://placehold.it/350x150";
                user.hasTermsAccepted = true;
                user.isAdmin = false;
                user.provider = "email";
                // save user into database
                this._userService.save(user)
                  .then((result: any) => {
                    // set id to user object
                    user.id = result.id;
                    // return data
                    resolve(user);
                  })
                  // catch some saving errors
                  .catch((error: any) => reject(error))
              })
              // catch some hash errors
              .catch((error: any) => reject(error));
          } else {
            // return database errors
            reject(error); 
          }
        });
    });
  }
}