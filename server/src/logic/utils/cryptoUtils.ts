import * as bcrypt from "bcrypt";
import { ApiError, ComparePwResult, SocoboUser } from "./../../models/index";


export class CryptoUtils {

  hashPassword (userPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(new ApiError("Error by Generating the Salt value.", 
                                      CryptoUtils.name, 
                                      "hashPassword(userPassword)", err));
        }
        bcrypt.hash(userPassword, salt, (err, hash) => {
            if (err) {
              return reject(new ApiError("Error by Generating the hashed Password.", 
                                          CryptoUtils.name, 
                                          "hashPassword(userPassword)", err));
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
          return reject(new ApiError("Error by comparing Passwords.", CryptoUtils.name, 
                                      "comparePasswords(firstPw,secondPw)", err));
        }
        resolve(new ComparePwResult(isMatch, user));
      });
    });
  }
}