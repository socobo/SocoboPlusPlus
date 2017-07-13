import * as bcrypt from "bcrypt";
import { SocoboUser } from "../../socobouser/index";
import { ApiError, ComparePwResult, ERRORS } from "../index";

export class CryptoUtils {

  public hashPassword (userPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (errSalt, salt) => {
        if (errSalt) {
          const e = new ApiError(ERRORS.AUTH_SALT_GENERATION)
            .addSource(CryptoUtils.name)
            .addSourceMethod("hashPassword(..)")
            .addCause(errSalt);
          return reject(e);
        }
        bcrypt.hash(userPassword, salt, (errHash, hash) => {
          if (errHash) {
            const e = new ApiError(ERRORS.AUTH_PW_HASH_GENERATION)
              .addSource(CryptoUtils.name)
              .addSourceMethod("hashPassword(..)")
              .addCause(errHash);
            return reject(e);
          }
          resolve(hash);
        });
      });
    });
  }

  public comparePasswords (firstPw: string, user: SocoboUser): Promise<ComparePwResult> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(firstPw, user.password, (err, isMatch) => {
        if (err) {
          const e = new ApiError(ERRORS.AUTH_PW_MISSMATCH)
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
