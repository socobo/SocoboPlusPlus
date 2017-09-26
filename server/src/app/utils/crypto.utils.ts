import * as bcrypt from "bcrypt";
import { SocoboUser } from "../../socobouser/index";
import { ApiError, ComparePwResult, ERRORS } from "../index";

export class CryptoUtils {

  public hashPassword = async (userPassword: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(userPassword, salt);
    } catch (error) {
      throw new ApiError(ERRORS.AUTH_NO_HASHED_PASSWORD)
        .addSource(CryptoUtils.name)
        .addSourceMethod("hashPassword(..)")
        .addCause(error);
    }
  }

  public comparePasswords = async (firstPw: string, secondPw: string): Promise<void> => {
    const result = await bcrypt.compare(firstPw, secondPw);
    if (!result) {
      throw new ApiError(ERRORS.AUTH_WRONG_PASSWORD)
        .addSource(CryptoUtils.name)
        .addSourceMethod("comparePasswords(..)");
    }
  }
}
