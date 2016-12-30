import * as jwt from "jsonwebtoken";
import { UserService } from "./user.service";
import { CryptoUtils } from "./../utils/cryptoUtils";
import { ErrorUtils } from "./../utils/errorUtils";
import { Config } from "./../../config";
import { 
  ApiError, DbError, SocoboUser, LoginResult 
} from "./../../models/index";


export class AuthService {
  constructor (
    private _userService: UserService, 
    private _cryptoUtils: CryptoUtils
  ) {}

  login (isEmailLogin: boolean, usernameOrEmail: string, password: string): Promise<LoginResult> {
    return new Promise((resolve, reject) => {
      // create promise holder
      let loginPromise: Promise<SocoboUser>;
      // search for the user by provided email or username
      if (isEmailLogin) {
        loginPromise = this._userService.getUserByEmail(usernameOrEmail);
      } else {
        loginPromise = this._userService.getUserByUsername(usernameOrEmail);
      }
      // login the user or reject
      loginPromise
        .then((user: SocoboUser) => {
          // check if the user was found
          if (!user) {
            return reject(new Error("Authentication failed. User not found."));
          }
          // check if the provided password match the users password
          this._cryptoUtils.comparePasswords(password, user.password)
            .then((passwordMatch: boolean) => {
              // if not match reject JWT creation
              if (!passwordMatch) {
                return reject(new Error("Authentication failed. Wrong password."));
              }
              // generate the JWT
              jwt.sign(user.forSigning(),  Config.TOKEN_SECRET, {
                expiresIn: Config.TOKEN_EXPIRATION
              }, (err, token) => {
                // check if some error occurs inside JWT creation
                if (err) {
                  return reject(new Error(`Authentication failed. 
                                            Error message: ${err.message}.`));
                }
                // remove password before return user object
                delete user.password;
                // return data
                resolve(new LoginResult(token, user));
              });
            })
            // catch some compare errors
            .catch((error: any) => reject(error));
        })
        // catch some database errors
        .catch((error: any) => reject(error));
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