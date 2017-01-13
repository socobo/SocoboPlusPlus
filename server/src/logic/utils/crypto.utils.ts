import * as bcrypt from "bcrypt";
import { 
  ApiError, ComparePwResult, SocoboUser 
} from "./../../models/index";
import { ERRORS } from "./../../models/index"


export class CryptoUtils {

  hashPassword (userPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          let e = new ApiError(ERRORS.AUTH_SALT_GENERATION)
            .addSource(CryptoUtils.name)
            .addSourceMethod("hashPassword(..)")
            .addCause(err);
          return reject(e);
        }
        bcrypt.hash(userPassword, salt, (err, hash) => {
            if (err) {
              let e = new ApiError(ERRORS.AUTH_PW_HASH_GENERATION)
                .addSource(CryptoUtils.name)
                .addSourceMethod("hashPassword(..)")
                .addCause(err);
              return reject(e);
            }
            resolve(hash);
        });
      });
    });
  }

  comparePasswords (firstPw: string, user: SocoboUser): Promise<ComparePwResult> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(firstPw, user.password, (err, isMatch) => {
        if (err) {
          let e = new ApiError(ERRORS.AUTH_PW_MISSMATCH)
            .addSource(CryptoUtils.name)
            .addSourceMethod("comparePasswords(..)")
            .addCause(err);
          return reject(e);
        }
        resolve(new ComparePwResult(isMatch, user));
      });
    });
  }
}