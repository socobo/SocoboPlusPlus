import * as fs from "fs";
import * as winston from "winston";
import { Config } from "./../../config";
import { ApiError, DataType, ERRORS } from "./../../models/index";
import { ImageService } from "./image.service";

export class FilesystemImageService implements ImageService {

  public persistImage (fileName: string, dataType: string, userIdentifier: string): Promise<string> {

    return new Promise((resolve, reject) => {
      const sourcePath = `${Config.IMAGE_TMP_DIR}/${fileName}`;
      const userDataDir = `${Config.DATA_BASE_DIR}/${userIdentifier}`;
      const dataTypeDir = `${userDataDir}/${dataType}`;
      const targetPath = `${dataTypeDir}/${fileName}`;

      const error = new ApiError(ERRORS.IMAGE_UPLOAD)
        .addSource(FilesystemImageService.name)
        .addSourceMethod("persistImage");

      // 'this' doesn't work correctly inside of fs.readFile.
      function createDirIfNotExists (dir: string, rej: Function): void {
        if (!fs.existsSync(dir)) {
          winston.info(`Directory ${dir} doesn't exist. Will be created.`);
          fs.mkdir(dir, (e) => {
            rej(error.addCause.call(error, e));
          });
        }
      }

      fs.readFile(sourcePath, (readErr, data) => {
        if (readErr) {
          reject(error.addCause.call(error, readErr));
        } else {
          createDirIfNotExists(userDataDir, reject);
          createDirIfNotExists(dataTypeDir, reject);

          fs.writeFile(targetPath, data, (writeErr) => {
            writeErr ? reject(writeErr) : resolve(targetPath);
          });
        }
      });
    });
  }
}
