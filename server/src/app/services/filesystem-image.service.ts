import * as fs from "fs";
import * as winston from "winston";
import { ApiError, ERRORS } from "../index";
import { Config } from "./../../config";
import { ImageService } from "./image.service";

export class FilesystemImageService implements ImageService {

  private _error = new ApiError(ERRORS.IMAGE_UPLOAD)
    .addSource(FilesystemImageService.name)
    .addSourceMethod("persistImage");

  // 'this' doesn't work correctly inside of fs.readFile.
  private _createDirIfNotExists (dir: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(dir)) {
        winston.info(`Directory ${dir} doesn't exist. Will be created.`);
        fs.mkdir(dir, (createErr) => {
          if (createErr) {
            reject(this._error.addCause(createErr));
          }else {
            resolve();
          }
        });
      }
      resolve();
    });
  }

  private _removeSourceFile (dir: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.unlink(dir, (deleteErr) => {
        if (deleteErr) {
          reject(this._error.addCause(deleteErr));
        }else {
          resolve();
        }

      });
    });
  }

  private _write (targetPath: string, sourcePath: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.writeFile(targetPath, data, (writeErr) => {
        writeErr ?
          reject(this._error.addCause(writeErr)) :
          this._removeSourceFile(sourcePath)
            .then(() => resolve(targetPath));
      });
    });
  }

  public persistImage (fileName: string, dataType: string, userIdentifier: string): Promise<string> {

    return new Promise((resolve, reject) => {
      const sourcePath = `${process.cwd()}/${process.env["IMAGE_TMP_DIR"] || Config.IMAGE_TMP_DIR}/${fileName}`;
      const userDataDir = `${process.cwd()}/${process.env["DATA_BASE_DIR"] || Config.DATA_BASE_DIR}/${userIdentifier}`;
      const dataTypeDir = `${userDataDir}/${dataType}`;
      const targetPath = `${dataTypeDir}/${fileName}`;

      fs.readFile(sourcePath, (readErr, data) => {
        if (readErr) {
          reject(this._error.addCause(readErr));
        } else {
          this._createDirIfNotExists(userDataDir)
            .then(() => this._createDirIfNotExists(dataTypeDir))
            .then(() => this._write(targetPath, sourcePath, data))
            .then(() => resolve(targetPath))
            .catch((error: ApiError) => reject(error));
        }
      });
    });
  }
}
