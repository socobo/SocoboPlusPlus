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

  public comparePasswords = async (firstPw: string, secondPw: string): Promise<void> => {
    try {
      const result = await bcrypt.compare(firstPw, secondPw);
      if (!result) {
        throw new ApiError(ERRORS.AUTH_PW_MISSMATCH)
          .addSource(CryptoUtils.name)
          .addSourceMethod("comparePasswords(..)");
      }
    } catch (error) {
      throw new ApiError(ERRORS.AUTH_WRONG_PASSWORD)
        .addSource(CryptoUtils.name)
        .addSourceMethod("_validateComparePasswords(..)")
        .addCause(error);
    }
  }
}
