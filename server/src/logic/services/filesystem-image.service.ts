import * as fs from "fs";
import * as winston from "winston";
import { Config } from "./../../config";
import { ApiError, DataType, ERRORS } from "./../../models/index";
import { ImageService } from "./image.service";

export class FilesystemImageService implements ImageService {

  private _error = new ApiError(ERRORS.IMAGE_UPLOAD)
    .addSource(FilesystemImageService.name)
    .addSourceMethod("persistImage");

  // 'this' doesn't work correctly inside of fs.readFile.
  private _createDirIfNotExists (dir: string, rej: Function): void {
    if (!fs.existsSync(dir)) {
      winston.info(`Directory ${dir} doesn't exist. Will be created.`);
      fs.mkdir(dir, (createErr) => {
        if (createErr) {
          rej(this._error.addCause.call(this._error, createErr));
        }
      });
    }
  }

  private _removeSourceFile (dir: string, rej: Function) {
    fs.unlink(dir, (deleteErr) => {
      if (deleteErr) {
        rej(this._error.addCause.call(this._error, deleteErr));
      }
    });
  }

  public persistImage (fileName: string, dataType: string, userIdentifier: string): Promise<string> {

    return new Promise((resolve, reject) => {
      const sourcePath = `${process.cwd()}/${process.env.IMAGE_TMP_DIR || Config.IMAGE_TMP_DIR}/${fileName}`;
      const userDataDir = `${Config.DATA_BASE_DIR}/${userIdentifier}`;
      const dataTypeDir = `${userDataDir}/${dataType}`;
      const targetPath = `${dataTypeDir}/${fileName}`;

      fs.readFile(sourcePath, (readErr, data) => {
        if (readErr) {
          reject(this._error.addCause.call(this._error, readErr));
        } else {
          this._createDirIfNotExists(userDataDir, reject);
          this._createDirIfNotExists(dataTypeDir, reject);

          fs.writeFile(targetPath, data, (writeErr) => {
            writeErr ? reject(writeErr) : this._removeSourceFile(sourcePath, reject);
            resolve(targetPath);
          });
        }
      });
    });
  }
}
